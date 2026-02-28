from decimal import Decimal
from django.db.models import Sum
from rest_framework import serializers
from .models import Campaign, Donation, CampaignUpdate

class CampaignSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.ReadOnlyField()
    tickets_sold = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = [
            'id', 'title', 'description', 'goal_amount',
            'current_amount', 'progress_percentage', 'tickets_sold', 'is_active',
            'start_date', 'end_date', 'featured_image', 'featured_video_url',
            'created_at', 'updated_at'
        ]

    def get_tickets_sold(self, obj):
        result = obj.donations.filter(
            payment_status='completed'
        ).aggregate(total=Sum('ticket_quantity'))
        return result['total'] or 0

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = [
            'id', 'amount', 'ticket_quantity', 'donor_name',
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
    ticket_quantity = serializers.IntegerField(min_value=0, default=0)
    donation_amount = serializers.DecimalField(
        max_digits=8, decimal_places=2,
        min_value=Decimal('0'), max_value=Decimal('25000'),
        default=Decimal('0')
    )
    donor_name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    donor_email = serializers.EmailField(required=False, allow_blank=True)
    message = serializers.CharField(max_length=500, required=False, allow_blank=True)
    is_anonymous = serializers.BooleanField(default=False)

    def validate(self, data):
        ticket_qty = data.get('ticket_quantity', 0)
        donation_amt = data.get('donation_amount', Decimal('0'))
        if ticket_qty == 0 and donation_amt <= 0:
            raise serializers.ValidationError(
                'Please select at least one ticket or enter a donation amount.'
            )
        return data
