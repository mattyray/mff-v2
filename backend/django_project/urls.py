from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "MattFreedomFundraiser API",
        "version": "1.0",
        "endpoints": {
            "campaigns": "/api/campaigns/",
            "donations": "/api/donations/",
            "profile": "/api/profile/",
        }
    })

def health_check(request):
    return JsonResponse({"status": "healthy", "service": "donations-api"})

urlpatterns = [
    path("", api_root),
    path("health/", health_check, name="health-check"),
    path("admin/", admin.site.urls),
    
    # API endpoints
    path("api/accounts/", include("accounts.urls")),
    path("api/campaigns/", include("donations.urls_campaigns")),
    path("api/donations/", include("donations.urls_donations")),
    path("api/profile/", include("profiles.urls")),
    
    # Stripe webhook
    path("api/stripe/webhook/", include("donations.urls_stripe")),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)