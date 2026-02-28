from decimal import Decimal

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import stripe
import logging

from .models import Campaign, Donation, CampaignUpdate
from .serializers import CampaignSerializer, DonationSerializer, CampaignUpdateSerializer, CreateDonationSerializer

logger = logging.getLogger(__name__)
stripe.api_key = settings.STRIPE_SECRET_KEY

TICKET_PRICE_CENTS = 5000  # $50.00
TICKET_PRICE = Decimal('50.00')


class DonationCreateThrottle(AnonRateThrottle):
    rate = '10/minute'


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
@throttle_classes([DonationCreateThrottle])
def create_donation(request):
    try:
        serializer = CreateDonationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': 'Invalid data', 'details': serializer.errors}, status=400)

        data = serializer.validated_data
        campaign = Campaign.objects.filter(is_active=True).first()
        if not campaign:
            return Response({'error': 'No active campaign'}, status=404)

        ticket_quantity = data.get('ticket_quantity', 0)
        donation_amount = data.get('donation_amount', Decimal('0'))
        ticket_total = Decimal(ticket_quantity) * TICKET_PRICE
        total_amount = ticket_total + donation_amount

        donation = Donation.objects.create(
            campaign=campaign,
            amount=total_amount,
            ticket_quantity=ticket_quantity,
            donor_name=data.get('donor_name', ''),
            donor_email=data.get('donor_email', ''),
            message=data.get('message', ''),
            is_anonymous=data.get('is_anonymous', False),
            stripe_session_id='',
            payment_status='pending'
        )

        logger.info(f"Created donation {donation.id} for ${total_amount} ({ticket_quantity} tickets)")

        # Build Stripe line items
        line_items = []
        if ticket_quantity > 0:
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': "Event Ticket — Matt's Freedom Fundraiser"},
                    'unit_amount': TICKET_PRICE_CENTS,
                },
                'quantity': ticket_quantity,
            })
        if donation_amount > 0:
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': f'Donation to {campaign.title}'},
                    'unit_amount': int(donation_amount * 100),
                },
                'quantity': 1,
            })

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=f"{settings.FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/cancel",
            metadata={
                'donation_id': str(donation.id),
                'campaign_id': str(campaign.id),
                'amount': str(total_amount),
                'ticket_quantity': str(ticket_quantity),
                'donor_name': data.get('donor_name', ''),
                'donor_email': data.get('donor_email', ''),
            }
        )

        donation.stripe_session_id = session.id
        donation.save()

        logger.info(f"Stripe session {session.id} created for donation {donation.id}")

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
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        logger.warning(f"Webhook signature verification failed: {e}")
        return Response({'error': 'Invalid signature'}, status=400)

    logger.info(f"Webhook received: {event['type']}")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        donation_id = session['metadata'].get('donation_id')

        if not donation_id:
            logger.warning("Webhook missing donation_id in metadata")
            return Response({'status': 'success'})

        try:
            donation = Donation.objects.get(id=int(donation_id))

            # Idempotency guard: skip if already completed
            if donation.payment_status == 'completed':
                logger.info(f"Donation {donation_id} already completed, skipping")
                return Response({'status': 'success'})

            donation.payment_status = 'completed'
            donation.stripe_payment_intent_id = session.get('payment_intent', '')
            donation.save()

            logger.info(f"Donation {donation_id} marked completed")

            # Queue thank-you email and owner notification
            from emails.tasks import send_thank_you_email, send_donation_notification
            send_thank_you_email.delay(donation.id)
            send_donation_notification.delay(donation.id)

        except Donation.DoesNotExist:
            logger.error(f"Donation {donation_id} not found")
            return Response({'error': 'Donation not found'}, status=500)
        except Exception as e:
            logger.error(f"Error processing donation {donation_id}: {e}")
            return Response({'error': 'Processing failed'}, status=500)

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
        except Exception:
            pass
    return Response({'status': 'success'})


@api_view(['GET'])
@permission_classes([AllowAny])
def payment_cancel(request):
    return Response({'status': 'cancelled', 'message': 'Payment was cancelled'})
