from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import stripe
import json
import logging

from .models import Campaign, Donation, CampaignUpdate
from .serializers import CampaignSerializer, DonationSerializer, CampaignUpdateSerializer, CreateDonationSerializer

logger = logging.getLogger(__name__)
stripe.api_key = settings.STRIPE_SECRET_KEY

class CurrentCampaignView(generics.RetrieveAPIView):
    serializer_class = CampaignSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        return Campaign.objects.filter(is_active=True).first()

class RecentDonationsView(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Donation.objects.filter(
            payment_status='completed',
            is_anonymous=False
        ).order_by('-created_at')[:10]

class CampaignUpdatesView(generics.ListAPIView):
    serializer_class = CampaignUpdateSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        campaign = Campaign.objects.filter(is_active=True).first()
        return campaign.updates.all() if campaign else CampaignUpdate.objects.none()


@api_view(['POST'])
@permission_classes([AllowAny])
def create_donation(request):
    try:
        # Validate input
        serializer = CreateDonationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': 'Invalid data', 'details': serializer.errors}, status=400)
        
        data = serializer.validated_data
        campaign = Campaign.objects.filter(is_active=True).first()
        if not campaign:
            return Response({'error': 'No active campaign'}, status=404)
        
        # Create donation record FIRST
        donation = Donation.objects.create(
            campaign=campaign,
            amount=data['amount'],
            donor_name=data.get('donor_name', ''),
            donor_email=data.get('donor_email', ''),
            message=data.get('message', ''),
            is_anonymous=data.get('is_anonymous', False),
            stripe_session_id='',  # Will be updated after session creation
            payment_status='pending'
        )
        
        logger.info(f"Created donation record {donation.id} for ${donation.amount}")
        
        # Create Stripe session with COMPLETE metadata including donation_id
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': f'Donation to {campaign.title}'},
                    'unit_amount': int(float(data['amount']) * 100),
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{settings.FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/cancel",
            metadata={
                'donation_id': str(donation.id),  # 🔥 THE CRITICAL FIX!
                'campaign_id': str(campaign.id),
                'amount': str(data['amount']),
                'donor_name': data.get('donor_name', ''),
                'donor_email': data.get('donor_email', ''),
            }
        )
        
        # Update donation with session ID
        donation.stripe_session_id = session.id
        donation.save()
        
        logger.info(f"Stripe session created: {session.id} for donation {donation.id}")
        
        return Response({'checkout_url': session.url})
        
    except Exception as e:
        logger.error(f"Donation creation failed: {e}")
        return Response({'error': 'Payment setup failed'}, status=500)
    
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        print(f"✅ Webhook verified: {event['type']}")
        
        # 🔍 DEBUG: Focus on checkout.session.completed
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            print(f"🔍 Session ID: {session.get('id')}")
            print(f"🔍 Session metadata: {session.get('metadata', {})}")
            print(f"🔍 All session keys: {list(session.keys())}")
            
            donation_id = session['metadata'].get('donation_id')
            print(f"🔍 Looking for donation ID: {donation_id} (type: {type(donation_id)})")
            
            if donation_id:
                try:
                    # Try both string and int versions
                    donation = Donation.objects.get(id=int(donation_id))
                    print(f"✅ Found donation: ${donation.amount} - current status: {donation.payment_status}")
                    
                    old_status = donation.payment_status
                    donation.payment_status = 'completed'
                    donation.stripe_payment_intent_id = session.get('payment_intent', '')
                    donation.save()
                    
                    print(f"✅ Donation {donation_id} updated: {old_status} → completed")
                    
                    # Check campaign total
                    campaign = donation.campaign
                    print(f"💰 Campaign total now: ${campaign.current_amount}")
                    
                except Donation.DoesNotExist:
                    print(f"❌ Donation {donation_id} not found in database")
                    # Show recent donations for debugging
                    recent_donations = Donation.objects.order_by('-created_at')[:5]
                    print("🔍 Recent donations:")
                    for d in recent_donations:
                        print(f"  ID: {d.id}, Amount: ${d.amount}, Session: {d.stripe_session_id}")
                        
                except ValueError as e:
                    print(f"❌ Invalid donation_id format: {e}")
            else:
                print(f"❌ No donation_id in session metadata")
                print(f"🔍 Available metadata keys: {list(session.get('metadata', {}).keys())}")
        
    except Exception as e:
        print(f"❌ Webhook error: {e}")
        import traceback
        print(f"🔍 Full traceback: {traceback.format_exc()}")
        return Response({'error': 'Invalid signature'}, status=400)
    
    return Response({'status': 'success'})
@api_view(['GET'])
@permission_classes([AllowAny])
def payment_success(request):
    session_id = request.GET.get('session_id')
    if session_id:
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            donation_id = session['metadata'].get('donation_id')
            return Response({
                'status': 'success',
                'donation_id': donation_id,
                'amount': session['amount_total'] / 100
            })
        except:
            pass
    return Response({'status': 'success'})

@api_view(['GET'])
@permission_classes([AllowAny])
def payment_cancel(request):
    return Response({'status': 'cancelled', 'message': 'Payment was cancelled'})