from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
import stripe

from .models import Campaign, Donation, CampaignUpdate
from .serializers import CampaignSerializer, DonationSerializer, CampaignUpdateSerializer

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
def create_donation(request):
    amount = request.data.get('amount')
    campaign = Campaign.objects.filter(is_active=True).first()
    
    if not amount or not campaign:
        return Response({'error': 'Missing amount or no active campaign'}, status=400)
    
    # Create Stripe session
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {'name': f'Donation to {campaign.title}'},
                'unit_amount': int(float(amount) * 100),
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=f"{settings.FRONTEND_URL}/success",
        cancel_url=f"{settings.FRONTEND_URL}/cancel",
    )
    
    # Save donation
    Donation.objects.create(
        campaign=campaign,
        amount=amount,
        donor_name=request.data.get('donor_name', ''),
        donor_email=request.data.get('donor_email', ''),
        message=request.data.get('message', ''),
        stripe_session_id=session.id,
        payment_status='pending'
    )
    
    return Response({'checkout_url': session.url})

@api_view(['POST'])
def stripe_webhook(request):
    """Handle payment completion"""
    # TODO: Add webhook signature verification for production
    event = stripe.Webhook.construct_event(
        request.body, 
        request.META.get('HTTP_STRIPE_SIGNATURE'),
        settings.STRIPE_WEBHOOK_SECRET
    )
    
    if event['type'] == 'checkout.session.completed':
        session_id = event['data']['object']['id']
        try:
            donation = Donation.objects.get(stripe_session_id=session_id)
            donation.payment_status = 'completed'
            donation.save()  # Auto-updates campaign total
        except Donation.DoesNotExist:
            pass
    
    return Response({'status': 'success'})