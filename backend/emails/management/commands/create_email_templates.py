from django.core.management.base import BaseCommand
from emails.models import EmailTemplate

class Command(BaseCommand):
    help = 'Create default email templates'

    def handle(self, *args, **options):
        # Thank you email template
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
        <h1>🌊 Thank You, {donor_name}!</h1>
        <p>Your support means everything to me</p>
    </div>
    
    <div class="content">
        <h2>Your Generous Donation</h2>
        <p>Dear {donor_name},</p>
        
        <p>I am deeply grateful for your donation of <strong>${amount}</strong> to "{campaign_title}". Your contribution brings me one step closer to securing accessible housing and continuing my journey as a developer.</p>
        
        <div class="donation-details">
            <h3>Donation Details</h3>
            <p><strong>Amount:</strong> ${amount}</p>
            <p><strong>Date:</strong> {donation_date}</p>
            <p><strong>Campaign:</strong> {campaign_title}</p>
        </div>
        
        <h3>Campaign Progress</h3>
        <p>Thanks to supporters like you, we've raised <strong>${current_total}</strong> of our ${goal_amount} goal!</p>
        
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <p style="text-align: center; margin-top: 10px;">
            <strong>{progress_percentage:.1f}% Complete</strong>
        </p>
        
        <h3>What This Means</h3>
        <p>Your donation helps fund:</p>
        <ul>
            <li>🚿 Roll-in shower and bathroom modifications</li>
            <li>🏠 Caregiver-friendly living accommodations</li>
            <li>📍 Strategic location near my support network</li>
            <li>♿ Complete accessibility setup for independence</li>
        </ul>
        
        <p>As a quadriplegic developer who taught himself to code after a diving accident, I'm working to prove that disability doesn't limit potential - it just changes the approach. Your support helps me continue inspiring others while building a more accessible future.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://mattfreedomfundraiser.com" class="cta-button">
                Follow My Journey
            </a>
        </div>
        
        <p>With heartfelt gratitude,<br>
        <strong>Matt Raynor</strong><br>
        <em>From Sea to Source Code</em> 🌊💻</p>
    </div>
    
    <div class="footer">
        <p>You're receiving this email because you made a donation to Matt's fundraising campaign.</p>
        <p>Matt Freedom Fundraiser • Hampton Bays, NY</p>
    </div>
</body>
</html>
        """
        
        # Create or update the template
        template, created = EmailTemplate.objects.update_or_create(
            name='thank_you_email',
            defaults={
                'subject': 'Thank you for your support, {donor_name}! 🌊',
                'html_content': thank_you_template.strip(),
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(
                self.style.SUCCESS('✅ Created thank you email template')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS('✅ Updated thank you email template')
            )