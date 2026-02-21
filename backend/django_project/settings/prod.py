from .base import *
import os
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

# ---------------- DATABASE ----------------
DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    try:
        parsed = dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )

        if "ENGINE" not in parsed:
            parsed["ENGINE"] = "django.db.backends.postgresql"

        # Handle empty database name (common Fly.io issue)
        if not parsed.get("NAME"):
            app_name = os.environ.get("FLY_APP_NAME", "mff-v2")
            parsed["NAME"] = app_name.replace("-app", "")

        required_fields = ["ENGINE", "NAME", "USER", "HOST", "PORT"]
        missing_fields = [field for field in required_fields if not parsed.get(field)]

        if missing_fields:
            raise ImproperlyConfigured(f"Missing database configuration fields: {missing_fields}")

        DATABASES = {"default": parsed}

    except ImproperlyConfigured:
        raise
    except Exception as e:
        if "postgres://" in DATABASE_URL or "postgresql://" in DATABASE_URL:
            try:
                import re
                match = re.match(r'postgres(?:ql)?://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', DATABASE_URL)
                if match:
                    user, password, host, port, database = match.groups()
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
                else:
                    raise ImproperlyConfigured("Could not parse DATABASE_URL format")
            except ImproperlyConfigured:
                raise
            except Exception:
                raise ImproperlyConfigured(f"Could not configure database: {e}")
        else:
            raise ImproperlyConfigured(f"Invalid DATABASE_URL format: {e}")
else:
    raise ImproperlyConfigured("DATABASE_URL environment variable is required in production")

# ---------------- HOSTS ----------------
FLY_APP_NAME = os.environ.get("FLY_APP_NAME", "mff-v2")

ALLOWED_HOSTS = [
    f"{FLY_APP_NAME}.fly.dev",
    "mff-v2.fly.dev",
]

custom_hosts = os.environ.get("DJANGO_ALLOWED_HOSTS", "")
if custom_hosts:
    ALLOWED_HOSTS.extend([host.strip() for host in custom_hosts.split(",") if host.strip()])

# ---------------- CORS & CSRF ----------------
CORS_ALLOWED_ORIGINS = [
    f"https://{FLY_APP_NAME}.fly.dev",
    "https://mff-v2.fly.dev",
    "https://mff-v2.netlify.app",
    "https://mattsfreedomfundraiser.com",
    "https://www.mattsfreedomfundraiser.com",
]

CSRF_TRUSTED_ORIGINS = [
    f"https://{FLY_APP_NAME}.fly.dev",
    "https://mff-v2.fly.dev",
    "https://mff-v2.netlify.app",
    "https://mattsfreedomfundraiser.com",
    "https://www.mattsfreedomfundraiser.com",
]

frontend_url = os.environ.get("FRONTEND_URL", "")
if frontend_url and frontend_url not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append(frontend_url)
    CSRF_TRUSTED_ORIGINS.append(frontend_url)

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = False

# ---------------- LOGGING ----------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {message}",
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
            "level": "WARNING",
            "propagate": False,
        },
    },
}
