# backend/emails/management/commands/update_email_template_transition.py
from django.core.management.base import BaseCommand
from emails.models import EmailTemplate

class Command(BaseCommand):
    help = 'Update email template for the independence transition campaign'

    def handle(self, *args, **options):
        # Updated thank you email template for independence transition
        thank_you_template = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #0F172A;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            background: linear-gradient(135deg, #0F172A 0%, #1E40AF 50%, #0891B2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 30px;
        }}
        .content {{
            background: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}
        .donation-details {{
            background: #F0F9FF;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #1E40AF;
        }}
        .progress-bar {{
            background: #E5E7EB;
            height: 20px;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }}
        .progress-fill {{
            background: linear-gradient(90deg, #1E40AF 0%, #0891B2 100%);
            height: 100%;
            border-radius: 10px;
            width: {progress_percentage}%;
        }}
        .footer {{
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            color: #6B7280;
        }}
        .cta-button {{
            display: inline-block;
            background: #1E40AF;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            margin: 15px 0;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🏠 Thank You, {donor_name}!</h1>
        <p>You're helping me take the final step to independence</p>
    </div>
    
    <div class="content">
        <h2>The Last Mile</h2>
        <p>Dear {donor_name},</p>
        
        <p>I am deeply grateful for your donation of <strong>${amount}</strong> to my independence transition campaign. After two years of preparation, I'm moving out of the nursing home on November 3rd to my hometown of Hampton Bays, and your contribution helps ensure I can do this with confidence.</p>
        
        <div class="donation-details">
            <h3>Donation Details</h3>
            <p><strong>Amount:</strong> ${amount}</p>
            <p><strong>Date:</strong> {donation_date}</p>
            <p><strong>Campaign:</strong> The Last Mile - Independence Transition</p>
        </div>
        
        <h3>Campaign Progress</h3>
        <p>Thanks to supporters like you, we've raised <strong>${current_total}</strong> of our ${goal_amount} goal!</p>
        
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <p style="text-align: center; margin-top: 10px;">
            <strong>{progress_percentage:.1f}% Complete</strong>
        </p>
        
        <h3>What Your Support Means</h3>
        <p>Your donation creates a security blanket during this critical transition:</p>
        <ul>
            <li>🏠 Bridge funding while government processes finish</li>
            <li>🚿 Freedom to use the accessible shower I raised money for</li>
            <li>👥 Ability to hang out with friends in Hampton Bays</li>
            <li>☀️ Getting out in the sun and hearing birds instead of being locked up</li>
        </ul>
        
        <p>As a C5-C6 tetraplegic who taught himself to code and built a career as a software engineer, I've proven that with the right support, anything is possible. I'm 60% through the care process, have two caregivers registered, and am interviewing more this week. Everything is in the oven - your support helps me finish what I started.</p>
        
        <p>I'll be 2 years sober on November 1st, just days before my move-out. This journey has been about more than just physical independence - it's been about spiritual growth through Buddhism and Taoism, building a career, and proving that disability doesn't limit potential.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://mattsfreedomfundraiser.com" class="cta-button">
                Follow My Journey
            </a>
        </div>
        
        <p>Thank you for being part of this final mile. November 3rd can't come soon enough!</p>
        
        <p>With endless gratitude,<br>
        <strong>Matthew Raynor</strong><br>
        <em>The Last Mile to Independence</em> 🏠💪</p>
    </div>
    
    <div class="footer">
        <p>You're receiving this email because you supported Matthew's independence transition campaign.</p>
        <p>Matthew Raynor - From Southampton nursing home to Hampton Bays independence</p>
    </div>
</body>
</html>
        """
        
        # Create or update the template
        template, created = EmailTemplate.objects.update_or_create(
            name='thank_you_email',
            defaults={
                'subject': 'Thank you for supporting my independence, {donor_name}! 🏠',
                'html_content': thank_you_template.strip(),
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(
                self.style.SUCCESS('✅ Created independence transition email template')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS('✅ Updated independence transition email template')
            )