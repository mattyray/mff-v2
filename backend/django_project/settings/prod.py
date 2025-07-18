# django_project/settings/prod.py - FIXED CORS AND HOSTS
from .base import *
import os
import sys
import dj_database_url
from django.core.exceptions import ImproperlyConfigured

DEBUG = False

# ---------------- SECURITY ----------------
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# ---------------- STATIC FILES ----------------
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
STATIC_ROOT = BASE_DIR / "staticfiles"

# ---------------- DATABASE (IMPROVED ERROR HANDLING) ----------------
DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    try:
        print(f"🔍 Raw DATABASE_URL: {DATABASE_URL[:50]}...", file=sys.stderr)
        
        parsed = dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
        
        # Add engine if missing
        if "ENGINE" not in parsed:
            parsed["ENGINE"] = "django.db.backends.postgresql"
        
        print(f"✅ DEBUG: Parsed DATABASE_URL → {parsed}", file=sys.stderr)
        
        # 🔥 FIX: Handle empty database name (common Fly.io issue)
        if not parsed.get("NAME") or parsed.get("NAME") == "":
            # Try to extract database name from the app name
            app_name = os.environ.get("FLY_APP_NAME", "mff-v2")
            # Remove the "-app" suffix if present for database name
            db_name = app_name.replace("-app", "")
            parsed["NAME"] = db_name
            print(f"🔧 Fixed empty database name: using '{db_name}'", file=sys.stderr)
        
        # Validate all required database fields
        required_fields = ["ENGINE", "NAME", "USER", "HOST", "PORT"]
        missing_fields = [field for field in required_fields if not parsed.get(field)]
        
        if missing_fields:
            print(f"❌ Missing database fields: {missing_fields}", file=sys.stderr)
            raise ImproperlyConfigured(f"Missing database configuration fields: {missing_fields}")
        
        DATABASES = {"default": parsed}
        print(f"✅ Database configured successfully: {parsed['NAME']}@{parsed['HOST']}", file=sys.stderr)
        
    except Exception as e:
        print(f"❌ Database configuration error: {e}", file=sys.stderr)
        print(f"Raw DATABASE_URL was: {DATABASE_URL}", file=sys.stderr)
        
        # 🔥 FALLBACK: Try manual parsing if dj_database_url fails
        if "postgres://" in DATABASE_URL or "postgresql://" in DATABASE_URL:
            print("🔧 Attempting manual DATABASE_URL parsing...", file=sys.stderr)
            try:
                import re
                # Parse postgres://user:password@host:port/database
                match = re.match(r'postgres(?:ql)?://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', DATABASE_URL)
                if match:
                    user, password, host, port, database = match.groups()
                    # Remove query parameters if present
                    database = database.split('?')[0]
                    
                    DATABASES = {
                        "default": {
                            "ENGINE": "django.db.backends.postgresql",
                            "NAME": database,
                            "USER": user,
                            "PASSWORD": password,
                            "HOST": host,
                            "PORT": int(port),
                            "CONN_MAX_AGE": 600,
                            "CONN_HEALTH_CHECKS": True,
                        }
                    }
                    print(f"✅ Manual parsing successful: {database}@{host}", file=sys.stderr)
                else:
                    raise Exception("Could not parse DATABASE_URL format")
            except Exception as manual_error:
                print(f"❌ Manual parsing also failed: {manual_error}", file=sys.stderr)
                raise ImproperlyConfigured(f"Could not configure database: {e}")
        else:
            raise ImproperlyConfigured(f"Invalid DATABASE_URL format: {e}")
else:
    print("❌ No DATABASE_URL environment variable found", file=sys.stderr)
    raise ImproperlyConfigured("DATABASE_URL environment variable is required in production")

# ---------------- HOSTS (FIXED) ----------------
# Get app name from Fly.io environment - CORRECTED DEFAULT
FLY_APP_NAME = os.environ.get("FLY_APP_NAME", "mff-v2")

# Base allowed hosts
ALLOWED_HOSTS = [
    f"{FLY_APP_NAME}.fly.dev",
    "mff-v2.fly.dev",  # 🔥 FIXED: Use correct app name
    "localhost",
    "127.0.0.1",
]

# Add custom allowed hosts from environment
custom_hosts = os.environ.get("DJANGO_ALLOWED_HOSTS", "")
if custom_hosts:
    ALLOWED_HOSTS.extend([host.strip() for host in custom_hosts.split(",") if host.strip()])

# 🔥 FIXED: CSRF settings with correct URLs
CSRF_TRUSTED_ORIGINS = [
    f"https://{FLY_APP_NAME}.fly.dev",
    "https://mff-v2.fly.dev",
    "https://mff-v2.netlify.app",  # 🔥 ADDED: Netlify URL
]

# 🔥 FIXED: CORS settings with correct URLs
CORS_ALLOWED_ORIGINS = [
    f"https://{FLY_APP_NAME}.fly.dev", 
    "https://mff-v2.fly.dev",
    "https://mff-v2.netlify.app",  # 🔥 ADDED: Netlify URL
]

# Add frontend URL from environment if provided
frontend_url = os.environ.get("FRONTEND_URL", "")
if frontend_url and frontend_url not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append(frontend_url)
    CSRF_TRUSTED_ORIGINS.append(frontend_url)

# 🔥 ADDED: Additional CORS settings for better compatibility
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = False  # Keep this False for security

print(f"🔧 CORS configured for: {CORS_ALLOWED_ORIGINS}", file=sys.stderr)
print(f"🔧 CSRF trusted origins: {CSRF_TRUSTED_ORIGINS}", file=sys.stderr)
print(f"🔧 Allowed hosts: {ALLOWED_HOSTS}", file=sys.stderr)

# ---------------- LOGGING (IMPROVED) ----------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "django.db.backends": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}

print(f"✅ Production settings loaded for {FLY_APP_NAME}", file=sys.stderr)