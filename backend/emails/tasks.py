# backend/emails/tasks.py
from celery import shared_task
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import logging

from .models import EmailTemplate, EmailLog
from donations.models import Donation

logger = logging.getLogger(__name__)

@shared_task
def send_thank_you_email(donation_id):
    """
    Send thank you email after successful donation
    Called from stripe webhook when donation status changes to 'completed'
    """
    try:
        print(f"📧 Processing thank you email for donation {donation_id}")
        
        # Get the donation
        donation = Donation.objects.get(id=donation_id)
        
        # Skip if anonymous or no email
        if donation.is_anonymous or not donation.donor_email:
            print(f"⏭️  Skipping email - anonymous: {donation.is_anonymous}, no email: {not donation.donor_email}")
            return f"Skipped email for donation {donation_id} (anonymous or no email)"
        
        # Check if email already sent
        existing_log = EmailLog.objects.filter(
            donation=donation,
            was_sent=True
        ).first()
        
        if existing_log:
            print(f"⏭️  Email already sent for donation {donation_id}")
            return f"Email already sent for donation {donation_id}"
        
        # Get email template
        template = EmailTemplate.objects.filter(
            name='thank_you_email', 
            is_active=True
        ).first()
        
        if not template:
            print(f"❌ No active thank you email template found")
            return f"No email template found"
        
        # Prepare context variables
        context = {
            'donor_name': donation.donor_name or 'Friend',
            'amount': float(donation.amount),
            'campaign_title': donation.campaign.title,
            'campaign_description': donation.campaign.description,
            'current_total': float(donation.campaign.current_amount),
            'goal_amount': float(donation.campaign.goal_amount),
            'progress_percentage': donation.campaign.progress_percentage,
            'donation_date': donation.created_at.strftime('%B %d, %Y'),
            'message': donation.message
        }
        
        # Format subject and content
        subject = template.subject.format(**context)
        html_content = template.html_content.format(**context)
        
        # Send via SendGrid
        message = Mail(
            from_email=settings.DEFAULT_FROM_EMAIL,
            to_emails=donation.donor_email,
            subject=subject,
            html_content=html_content
        )
        
        sg = SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)
        response = sg.send(message)
        
        # Log successful email
        EmailLog.objects.create(
            recipient_email=donation.donor_email,
            subject=subject,
            donation=donation,
            was_sent=True,
            sent_at=timezone.now()
        )
        
        print(f"✅ Thank you email sent to {donation.donor_email}")
        return f"Email sent to {donation.donor_email}"
        
    except Donation.DoesNotExist:
        error_msg = f"Donation {donation_id} not found"
        print(f"❌ {error_msg}")
        return error_msg
        
    except Exception as e:
        error_msg = f"Email failed for donation {donation_id}: {str(e)}"
        print(f"❌ {error_msg}")
        
        # Log failed email attempt
        try:
            EmailLog.objects.create(
                recipient_email=donation.donor_email if 'donation' in locals() else 'unknown',
                subject=f"Failed: Thank you email",
                donation=donation if 'donation' in locals() else None,
                was_sent=False
            )
        except:
            pass  # Don't fail if logging fails
            
        return error_msg

@shared_task
def send_campaign_update_notification(campaign_update_id):
    """
    Send notification to all donors when a campaign update is posted
    Future feature - not implemented yet
    """
    print(f"📧 Campaign update notification task - not implemented yet")
    return "Campaign update notifications not implemented"

@shared_task
def send_donation_receipt(donation_id):
    """
    Send formal receipt for tax purposes
    Future feature - could generate PDF receipt
    """
    print(f"📧 Donation receipt task - not implemented yet")
    return "Donation receipts not implemented"