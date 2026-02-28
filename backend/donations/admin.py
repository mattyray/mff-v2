from django.contrib import admin
from .models import Campaign, Donation, CampaignUpdate

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ['title', 'current_amount', 'goal_amount', 'is_active']
    readonly_fields = ['current_amount', 'progress_percentage']
    list_filter = ['is_active']

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ['amount', 'ticket_quantity', 'donor_name', 'donor_email', 'payment_status', 'created_at']
    readonly_fields = ['stripe_session_id', 'stripe_payment_intent_id']
    list_filter = ['payment_status', 'campaign']

@admin.register(CampaignUpdate)
class CampaignUpdateAdmin(admin.ModelAdmin):
    list_display = ['title', 'campaign', 'created_at']
    readonly_fields = ['created_at']