from django.core.management.base import BaseCommand
from django.utils import timezone
from decimal import Decimal

from donations.models import Campaign


class Command(BaseCommand):
    help = "Create the 1st Annual Silent Auction campaign (deactivates existing campaigns)"

    def handle(self, *args, **options):
        # Deactivate all current campaigns
        deactivated = Campaign.objects.filter(is_active=True).update(is_active=False)
        if deactivated:
            self.stdout.write(f"Deactivated {deactivated} existing campaign(s)")

        # Create new campaign
        campaign = Campaign.objects.create(
            title="Matt's Freedom Fundraiser — 1st Annual Silent Auction",
            description=(
                "A community fundraiser to support Matt Raynor, a Hampton Bays commercial "
                "fisherman who became tetraplegic after a spinal cord injury. Live music, "
                "a silent auction, 50/50 raffle, food, drinks, kids activities, and a night "
                "of community. Every dollar raised goes directly to Matt's recovery fund — "
                "helping cover the daily costs of living with a spinal cord injury that most "
                "people never think about."
            ),
            goal_amount=Decimal("10000.00"),
            current_amount=Decimal("0.00"),
            is_active=True,
            start_date=timezone.now(),
        )

        self.stdout.write(self.style.SUCCESS(
            f'Created campaign: "{campaign.title}" (goal: ${campaign.goal_amount})'
        ))
