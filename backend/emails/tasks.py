# backend/emails/tasks.py
from celery import shared_task
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
import logging
from decimal import Decimal

from .models import EmailTemplate, EmailLog
from donations.models import Donation

logger = logging.getLogger(__name__)

@shared_task
def send_thank_you_email(donation_id):
    """
    Send thank you email after successful donation
    Works with console backend, SMTP, and SendGrid
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
            
            # Create a basic fallback email
            subject = f"Thank you for your donation, {donation.donor_name or 'Friend'}!"
            html_content = f"""
            <h2>Thank you for your support!</h2>
            <p>Dear {donation.donor_name or 'Friend'},</p>
            <p>Thank you for your generous donation of ${donation.amount} to {donation.campaign.title}.</p>
            <p>Your support means everything to me.</p>
            <p>With gratitude,<br>Matt Raynor</p>
            """
        else:
            # Use template
            try:
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
                    'message': donation.message or ''
                }
                
                # Format subject and content
                subject = template.subject.format(**context)
                html_content = template.html_content.format(**context)
                
            except Exception as template_error:
                print(f"⚠️  Template formatting error: {template_error}")
                # Fall back to basic email
                subject = f"Thank you for your donation, {donation.donor_name or 'Friend'}!"
                html_content = f"""
                <h2>Thank you for your support!</h2>
                <p>Dear {donation.donor_name or 'Friend'},</p>
                <p>Thank you for your generous donation of ${donation.amount} to {donation.campaign.title}.</p>
                <p>Your support means everything to me.</p>
                <p>With gratitude,<br>Matt Raynor</p>
                """
        
        # Create plain text version
        plain_text_content = f"""
        Thank you for your donation!
        
        Dear {donation.donor_name or 'Friend'},
        
        Thank you for your generous donation of ${donation.amount} to {donation.campaign.title}.
        
        Your support means everything to me.
        
        With gratitude,
        Matt Raynor
        """
        
        # Send email using Django's built-in email system
        # This works with console backend, SMTP, and SendGrid
        try:
            print(f"📤 Sending email to {donation.donor_email}")
            print(f"📧 Subject: {subject}")
            print(f"📧 Backend: {settings.EMAIL_BACKEND}")
            
            send_mail(
                subject=subject,
                message=plain_text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[donation.donor_email],
                html_message=html_content,
                fail_silently=False,
            )
            
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
            
        except Exception as email_error:
            print(f"❌ Email sending failed: {email_error}")
            
            # Log failed email
            EmailLog.objects.create(
                recipient_email=donation.donor_email,
                subject=subject,
                donation=donation,
                was_sent=False
            )
            
            return f"Email failed: {str(email_error)}"
        
    except Donation.DoesNotExist:
        error_msg = f"Donation {donation_id} not found"
        print(f"❌ {error_msg}")
        return error_msg
        
    except Exception as e:
        error_msg = f"Email task failed for donation {donation_id}: {str(e)}"
        print(f"❌ {error_msg}")
        
        # Try to log failed email attempt
        try:
            if 'donation' in locals():
                EmailLog.objects.create(
                    recipient_email=donation.donor_email,
                    subject=f"Failed: Thank you email",
                    donation=donation,
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
    print(f"📧 Campaign update notification task for update {campaign_update_id} - not implemented yet")
    return "Campaign update notifications not implemented"

@shared_task
def send_donation_receipt(donation_id):
    """
    Send formal receipt for tax purposes
    Future feature - could generate PDF receipt
    """
    print(f"📧 Donation receipt task for donation {donation_id} - not implemented yet")
    return "Donation receipts not implemented"

@shared_task
def test_email_task():
    """
    Test task to verify Celery is working
    """
    print("📧 Test email task executed successfully")
    return "Test email task completed"