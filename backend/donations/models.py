from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal

User = get_user_model()

class Campaign(models.Model):
    """
    Matt's fundraising campaigns - usually one active at a time
    Examples: "Help Matt Find Accessible Housing", "Equipment Fund"
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)
    featured_image = models.URLField(blank=True)
    featured_video_url = models.URLField(blank=True)  # Add this
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
        
    @property
    def progress_percentage(self):
        """Calculate percentage toward goal"""
        if self.goal_amount and self.goal_amount > 0:
            return min(100, (self.current_amount / self.goal_amount) * 100)
        return 0
class Donation(models.Model):
    """
    Individual donations - people can donate any amount they want
    """
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    # Campaign relationship
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='donations')
    
    # Donation details
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    
    # Donor information (all optional)
    donor_name = models.CharField(max_length=100, blank=True)
    donor_email = models.EmailField(blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    is_anonymous = models.BooleanField(default=False)
    message = models.TextField(blank=True)
    
    # Payment processing
    stripe_session_id = models.CharField(max_length=200, unique=True)
    stripe_payment_intent_id = models.CharField(max_length=200, blank=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    # Communication tracking
    receipt_sent = models.BooleanField(default=False)
    receipt_sent_at = models.DateTimeField(null=True, blank=True)
    
    # Future: Recurring donations
    is_recurring = models.BooleanField(default=False)
    stripe_subscription_id = models.CharField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        donor = self.donor_name or "Anonymous"
        return f"${self.amount} from {donor}"
    
    def save(self, *args, **kwargs):
        """Update campaign total when donation is completed"""
        is_new = self.pk is None
        old_status = None
        
        if not is_new:
            old_donation = Donation.objects.get(pk=self.pk)
            old_status = old_donation.payment_status
        
        super().save(*args, **kwargs)
        
        # Update campaign total if payment status changed to completed
        if (is_new and self.payment_status == 'completed') or \
           (old_status != 'completed' and self.payment_status == 'completed'):
            self.campaign.current_amount += Decimal(str(self.amount))
            self.campaign.save()
        
        # Subtract if refunded
        elif old_status == 'completed' and self.payment_status == 'refunded':
            self.campaign.current_amount -= self.amount
            self.campaign.save()

class CampaignUpdate(models.Model):
    """
    Updates Matt can post - text, photos, or video blogs
    """
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='updates')
    
    title = models.CharField(max_length=200)
    # "Video Update: Housing Search Progress!" 
    
    content = models.TextField()
    # Text description/summary of the video
    
    # Media - flexible for images or videos
    image_url = models.URLField(blank=True)
    # Thumbnail or photo
    
    video_url = models.URLField(blank=True) 
    # YouTube embed, Vimeo, or direct video file
    
    video_embed_code = models.TextField(blank=True)
    # Full YouTube/Vimeo embed code if needed
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.created_at.strftime('%b %d, %Y')}"
    
    @property
    def has_video(self):
        return bool(self.video_url or self.video_embed_code)