from .base import *

DEBUG = True

# Fixed database name!
DATABASES = {
    "default": env.db_url("DATABASE_URL", default="postgresql://postgres:postgres_password@db:5432/donations_db")
}

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "backend"]

CORS_ALLOW_ALL_ORIGINS = True


# Fixed CORS ports!
# Fixed CORS ports!
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5174",  # ✅ Change from 8004 to 5174
    "http://127.0.0.1:5174",  # ✅ Change from 8004 to 5174
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5174",  # ✅ Change this too
    "http://127.0.0.1:5174",  # ✅ Change this too
]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
FRONTEND_URL = env("FRONTEND_URL", default="http://localhost:5173")
