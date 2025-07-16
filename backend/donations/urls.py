from django.urls import path
from . import views

app_name = 'donations'

urlpatterns = [
    path('campaign/', views.CurrentCampaignView.as_view(), name='current-campaign'),
    path('recent/', views.RecentDonationsView.as_view(), name='recent-donations'),
    path('updates/', views.CampaignUpdatesView.as_view(), name='campaign-updates'),
    path('create/', views.create_donation, name='create-donation'),
    path('stripe/webhook/', views.stripe_webhook, name='stripe-webhook'),
    path('success/', views.payment_success, name='payment-success'),
    path('cancel/', views.payment_cancel, name='payment-cancel'),
]