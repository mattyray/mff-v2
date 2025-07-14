from django.db import models
from donations.models import Donation, CampaignUpdate

class EmailTemplate(models.Model):
    """
    Email templates Matt can customize
    """
    name = models.CharField(max_length=100)
    # "Thank You Email" or "Update Notification"
    
    subject = models.CharField(max_length=200)
    # "Thank you for supporting my journey!"
    
    html_content = models.TextField()
    # Email HTML with variables like {{donor_name}}, {{amount}}
    
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name


class EmailLog(models.Model):
    """
    Track emails sent - prevent duplicates and debug issues
    """
    recipient_email = models.EmailField()
    subject = models.CharField(max_length=200)
    
    # What triggered this email
    donation = models.ForeignKey(Donation, on_delete=models.SET_NULL, null=True, blank=True)
    campaign_update = models.ForeignKey(CampaignUpdate, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Status
    was_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.subject} → {self.recipient_email}"