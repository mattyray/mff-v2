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
    "http://localhost:5174",  
    "http://127.0.0.1:5174",  
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5174",  
    "http://127.0.0.1:5174",  
]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
FRONTEND_URL = env("FRONTEND_URL", default="http://localhost:5173")
SENDGRID_API_KEY = ""  # Empty for now

# Replace the console backend with Gmail SMTP
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env("GMAIL_USER", default="")
EMAIL_HOST_PASSWORD = env("GMAIL_APP_PASSWORD", default="")
DEFAULT_FROM_EMAIL = env("GMAIL_USER", default="")