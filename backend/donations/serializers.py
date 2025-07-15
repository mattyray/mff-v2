from rest_framework import serializers
from .models import Campaign, Donation, CampaignUpdate

class CampaignSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Campaign
        fields = [
            'id', 'title', 'description', 'goal_amount', 
            'current_amount', 'progress_percentage', 'is_active',
            'start_date', 'end_date', 'featured_image'
        ]

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = [
            'id', 'amount', 'donor_name', 'donor_email', 
            'is_anonymous', 'message', 'created_at'
        ]

class CampaignUpdateSerializer(serializers.ModelSerializer):
    has_video = serializers.ReadOnlyField()
    
    class Meta:
        model = CampaignUpdate
        fields = [
            'id', 'title', 'content', 'video_url', 
            'video_embed_code', 'image_url', 'has_video', 'created_at'
        ]

class CreateDonationSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=8, decimal_places=2, min_value=1)
    donor_name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    donor_email = serializers.EmailField(required=False, allow_blank=True)
    message = serializers.CharField(required=False, allow_blank=True)
    is_anonymous = serializers.BooleanField(default=False)