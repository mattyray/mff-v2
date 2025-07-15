from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "Matt Freedom Fundraiser API v2",
        "endpoints": {
            "current_campaign": "/api/donations/campaign/",
            "recent_donations": "/api/donations/recent/",
            "campaign_updates": "/api/donations/updates/",
            "create_donation": "/api/donations/create/",
            "accounts": "/api/accounts/",
            "admin": "/admin/",
        }
    })

def health_check(request):
    return JsonResponse({"status": "healthy", "service": "matt-freedom-fundraiser"})

urlpatterns = [
    path("", api_root),
    path("health/", health_check),
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/donations/", include("donations.urls")),
]