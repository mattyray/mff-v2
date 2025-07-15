from .base import *

DEBUG = True

# Fixed database name!
DATABASES = {
    "default": env.db_url("DATABASE_URL", default="postgresql://postgres:postgres_password@db:5432/donations_db")
}

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "backend"]

# Fixed CORS ports!
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8004",  # Frontend on 8004
    "http://127.0.0.1:8004",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:8004",
    "http://127.0.0.1:8004",
]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
FRONTEND_URL = env("FRONTEND_URL", default="http://localhost:8004")
