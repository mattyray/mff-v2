from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "Matt Freedom Fundraiser API v2",
        "endpoints": {
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
    # Add these as we create the URL files:
    # path("api/donations/", include("donations.urls")),
    # path("api/campaigns/", include("donations.urls_campaigns")),  
    # path("api/profile/", include("profiles.urls")),
]