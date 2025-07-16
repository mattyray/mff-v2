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
        
        # CREATE STRIPE SESSION FIRST (before database record)
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
                'campaign_id': str(campaign.id),
                'amount': str(data['amount']),
                'donor_name': data.get('donor_name', ''),
                'donor_email': data.get('donor_email', ''),
            }
        )
        
        # NOW create donation record with actual session ID
        donation = Donation.objects.create(
            campaign=campaign,
            amount=data['amount'],
            donor_name=data.get('donor_name', ''),
            donor_email=data.get('donor_email', ''),
            message=data.get('message', ''),
            is_anonymous=data.get('is_anonymous', False),
            stripe_session_id=session.id,  # Real session ID, not empty string
            payment_status='pending'
        )
        
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
    except Exception as e:
        logger.error(f"Webhook signature verification failed: {e}")
        return Response({'error': 'Invalid signature'}, status=400)
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        donation_id = session['metadata'].get('donation_id')
        
        if donation_id:
            try:
                donation = Donation.objects.get(id=donation_id)
                donation.payment_status = 'completed'
                donation.stripe_payment_intent_id = session.get('payment_intent', '')
                donation.save()
                
                logger.info(f"Donation {donation_id} completed: ${donation.amount}")
                
            except Donation.DoesNotExist:
                logger.error(f"Donation {donation_id} not found")
    
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