# backend/donations/management/commands/update_campaign_transition.py
from django.core.management.base import BaseCommand
from donations.models import Campaign
from decimal import Decimal

class Command(BaseCommand):
    help = 'Update campaign for Matthew\'s independence transition fundraiser'

    def handle(self, *args, **options):
        # Update the main campaign
        campaign, created = Campaign.objects.update_or_create(
            id=1,  # Your main campaign ID
            defaults={
                'title': 'The Last Mile: Supporting My Independence Journey',
                'description': '''After two years of meticulous planning, I'm finally moving out on November 3rd to my hometown of Hampton Bays – and I need your help with the last piece of the puzzle.

The apartment is renovated and looks absolutely amazing. I'm about 60% done with the care process – I've been approved for 24-hour care and already have two people registered as caregivers. I'm working on a third, and I have two interviews this week with people who can do overnights. I've built a career as a software engineer, creating everything from luxury delivery platforms to AI applications. I've found spiritual grounding through Buddhism and Taoism, and I'll be 2 years sober on November 1st with the support of my AA community.

The challenge: The caregiver registration process takes forever. One of my current caregivers took three months to get registered – I don't know why it took so long. The next one was quicker, but it's still a significantly long process. I'm 4-5 weeks into registering additional people, and while everything is in the oven, I can't control the government timeline.

I'm raising $6,000 to cover 2-3 months of care costs while we finish the registration process. This creates a security blanket so I can move forward with confidence, knowing I'll have the support I need during the transition. Any amount helps – I always end up needing to pay people extra for various things, and every dollar makes a difference.

I want to be able to use the shower I raised money for. I want to hang out with my friends. I want to drive my wheelchair around Hampton Bays, be out in the sun underneath the sky, and hear birds instead of being locked up in a nursing home. With your support, I'll be able to do all of that more comfortably.

The Hampton Bays community and my recovery family have been incredible throughout this journey. This is the last mile of a two-year journey toward independence. Everything is in the oven – I just need help bridging the gap while the bureaucracy catches up.''',
                'goal_amount': Decimal('6000.00'),
                'current_amount': Decimal('0.00'),  # Reset for new campaign
                'is_active': True,
                'featured_video_url': '',  # Add new video URL if you have one
                'featured_image': '',  # Add new image URL if you have one
            }
        )
        
        if created:
            self.stdout.write(
                self.style.SUCCESS(f'✅ Created new campaign: {campaign.title}')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f'✅ Updated campaign: {campaign.title}')
            )
            
        self.stdout.write(
            self.style.SUCCESS(f'💰 Goal: ${campaign.goal_amount}')
        )
        self.stdout.write(
            self.style.SUCCESS(f'📍 Current: ${campaign.current_amount}')
        )
        self.stdout.write(
            self.style.SUCCESS(f'📅 Focus: Independence transition - November 3rd move-out')
        )