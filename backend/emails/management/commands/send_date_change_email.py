from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
import logging
import time

from emails.models import EmailLog
from donations.models import Donation

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Send date change announcement email to all past donors"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print emails that would be sent without actually sending",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]

        # Get unique donor emails, exclude test transactions
        emails = (
            Donation.objects.filter(
                payment_status="completed",
                donor_email__gt="",
            )
            .exclude(donor_email__in=["mnraynor90@gmail.com", "mnraynor90@gmailc.om"])
            .values_list("donor_email", "donor_name")
            .distinct("donor_email")
            .order_by("donor_email")
        )

        subject = "Date Change — Matt's Freedom Fundraiser Silent Auction is now May 14th"

        sent = 0
        failed = 0

        for donor_email, donor_name in emails:
            name = donor_name or "Friend"

            html_content = f"""
            <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="background: linear-gradient(135deg, #0F172A, #1E40AF, #0891B2); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Date Change</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Matt's Freedom Fundraiser</p>
                </div>

                <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb;">
                    <p style="font-size: 16px; color: #1f2937;">Hi {name},</p>

                    <p style="font-size: 16px; color: #1f2937; line-height: 1.6;">
                        We wanted to let you know that the <strong>1st Annual Silent Auction</strong>
                        has moved to a new date:
                    </p>

                    <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #92400E;">
                            Thursday, May 14, 2026
                        </p>
                        <p style="margin: 4px 0 0; color: #92400E;">
                            5:00 &ndash; 8:00 PM
                        </p>
                        <p style="margin: 4px 0 0; color: #92400E;">
                            Sundays on the Bay, Hampton Bays, NY
                        </p>
                    </div>

                    <p style="font-size: 16px; color: #1f2937; line-height: 1.6;">
                        Same place, same time, just a new date. Live music, a silent auction,
                        complimentary food and refreshments, and a night of community &mdash;
                        all to support Matt's recovery fund.
                    </p>

                    <p style="font-size: 16px; color: #1f2937; line-height: 1.6;">
                        If you haven't grabbed your tickets yet, they're $50 each:
                    </p>

                    <div style="text-align: center; margin: 24px 0;">
                        <a href="https://mattsfreedomfundraiser.com" style="display: inline-block; background: #1E40AF; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Get Your Tickets
                        </a>
                    </div>

                    <p style="font-size: 16px; color: #1f2937; line-height: 1.6;">
                        Thank you for your support &mdash; it means everything.
                    </p>

                    <p style="font-size: 16px; color: #1f2937;">
                        With gratitude,<br>
                        <strong>Matt Raynor</strong>
                    </p>
                </div>

                <div style="background: #f9fafb; padding: 16px 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                        You're receiving this because you donated to Matt's Freedom Fundraiser.
                    </p>
                </div>
            </div>
            """

            plain_text = f"""Hi {name},

We wanted to let you know that the 1st Annual Silent Auction has moved to a new date:

Thursday, May 14, 2026
5:00 - 8:00 PM
Sundays on the Bay, Hampton Bays, NY

Same place, same time, just a new date. Live music, a silent auction, complimentary food and refreshments, and a night of community -- all to support Matt's recovery fund.

If you haven't grabbed your tickets yet, they're $50 each at mattsfreedomfundraiser.com

Thank you for your support -- it means everything.

With gratitude,
Matt Raynor
"""

            if dry_run:
                self.stdout.write(f"  [DRY RUN] Would send to: {donor_email} ({name})")
                sent += 1
                continue

            try:
                send_mail(
                    subject=subject,
                    message=plain_text,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[donor_email],
                    html_message=html_content,
                    fail_silently=False,
                )

                EmailLog.objects.create(
                    recipient_email=donor_email,
                    subject=subject,
                    was_sent=True,
                    sent_at=timezone.now(),
                )

                sent += 1
                self.stdout.write(f"  Sent to: {donor_email}")

                # Small delay to avoid rate limiting
                time.sleep(0.5)

            except Exception as e:
                failed += 1
                logger.error(f"Failed to send to {donor_email}: {e}")
                self.stdout.write(self.style.ERROR(f"  Failed: {donor_email} - {e}"))

                EmailLog.objects.create(
                    recipient_email=donor_email,
                    subject=subject,
                    was_sent=False,
                )

        self.stdout.write("")
        if dry_run:
            self.stdout.write(self.style.WARNING(f"DRY RUN: {sent} emails would be sent"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Done: {sent} sent, {failed} failed"))
