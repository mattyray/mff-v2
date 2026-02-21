from celery import shared_task
from django.conf import settings
from django.utils import timezone
from django.utils.html import escape
from django.core.mail import send_mail
import logging

from .models import EmailTemplate, EmailLog
from donations.models import Donation

logger = logging.getLogger(__name__)


@shared_task
def send_thank_you_email(donation_id):
    """Send thank you email after successful donation"""
    try:
        donation = Donation.objects.get(id=donation_id)

        # Skip if anonymous or no email
        if donation.is_anonymous or not donation.donor_email:
            return f"Skipped email for donation {donation_id} (anonymous or no email)"

        # Check if email already sent
        if EmailLog.objects.filter(donation=donation, was_sent=True).exists():
            return f"Email already sent for donation {donation_id}"

        # Get email template
        template = EmailTemplate.objects.filter(
            name='thank_you_email',
            is_active=True
        ).first()

        # Escape user-provided values for HTML safety
        safe_donor_name = escape(donation.donor_name or 'Friend')
        safe_message = escape(donation.message or '')

        if not template:
            subject = f"Thank you for your donation, {safe_donor_name}!"
            html_content = f"""
            <h2>Thank you for your support!</h2>
            <p>Dear {safe_donor_name},</p>
            <p>Thank you for your generous donation of ${donation.amount} to {escape(donation.campaign.title)}.</p>
            <p>Your support means everything to me.</p>
            <p>With gratitude,<br>Matt Raynor</p>
            """
        else:
            try:
                context = {
                    'donor_name': safe_donor_name,
                    'amount': float(donation.amount),
                    'campaign_title': escape(donation.campaign.title),
                    'campaign_description': escape(donation.campaign.description),
                    'current_total': float(donation.campaign.current_amount),
                    'goal_amount': float(donation.campaign.goal_amount),
                    'progress_percentage': donation.campaign.progress_percentage,
                    'donation_date': donation.created_at.strftime('%B %d, %Y'),
                    'message': safe_message,
                }

                subject = template.subject.format(**context)
                html_content = template.html_content.format(**context)

            except Exception as template_error:
                logger.warning(f"Template formatting error: {template_error}")
                subject = f"Thank you for your donation, {safe_donor_name}!"
                html_content = f"""
                <h2>Thank you for your support!</h2>
                <p>Dear {safe_donor_name},</p>
                <p>Thank you for your generous donation of ${donation.amount} to {escape(donation.campaign.title)}.</p>
                <p>Your support means everything to me.</p>
                <p>With gratitude,<br>Matt Raynor</p>
                """

        plain_text_content = f"""
        Thank you for your donation!

        Dear {donation.donor_name or 'Friend'},

        Thank you for your generous donation of ${donation.amount} to {donation.campaign.title}.

        Your support means everything to me.

        With gratitude,
        Matt Raynor
        """

        try:
            send_mail(
                subject=subject,
                message=plain_text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[donation.donor_email],
                html_message=html_content,
                fail_silently=False,
            )

            EmailLog.objects.create(
                recipient_email=donation.donor_email,
                subject=subject,
                donation=donation,
                was_sent=True,
                sent_at=timezone.now()
            )

            logger.info(f"Thank you email sent for donation {donation_id}")
            return f"Email sent to {donation.donor_email}"

        except Exception as email_error:
            logger.error(f"Email sending failed for donation {donation_id}: {email_error}")

            EmailLog.objects.create(
                recipient_email=donation.donor_email,
                subject=subject,
                donation=donation,
                was_sent=False
            )

            return f"Email failed: {str(email_error)}"

    except Donation.DoesNotExist:
        logger.error(f"Donation {donation_id} not found")
        return f"Donation {donation_id} not found"

    except Exception as e:
        logger.error(f"Email task failed for donation {donation_id}: {e}")

        try:
            if 'donation' in locals():
                EmailLog.objects.create(
                    recipient_email=donation.donor_email,
                    subject="Failed: Thank you email",
                    donation=donation,
                    was_sent=False
                )
        except Exception:
            pass

        return f"Email task failed: {str(e)}"


@shared_task
def send_campaign_update_notification(campaign_update_id):
    """Send notification to all donors when a campaign update is posted (future feature)"""
    logger.info(f"Campaign update notification for update {campaign_update_id} - not implemented")
    return "Campaign update notifications not implemented"


@shared_task
def send_donation_receipt(donation_id):
    """Send formal receipt for tax purposes (future feature)"""
    logger.info(f"Donation receipt for donation {donation_id} - not implemented")
    return "Donation receipts not implemented"
