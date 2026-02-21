from environ import Env
from pathlib import Path
from django.core.exceptions import ImproperlyConfigured
import stripe
import os
import sys

# Cloudinary Configuration
import cloudinary
import cloudinary.uploader
import cloudinary.api

# Initialize environment variables
env = Env()

FRONTEND_URL = env("FRONTEND_URL", default="http://localhost:5173")

# Cloudinary setup
cloudinary_url = env('CLOUDINARY_URL', default='')
if cloudinary_url:
    import re
    match = re.match(r'cloudinary://(\d+):([^@]+)@(.+)', cloudinary_url)
    if match:
        api_key, api_secret, cloud_name = match.groups()
        CLOUDINARY_STORAGE = {
            'CLOUD_NAME': cloud_name,
            'API_KEY': api_key,
            'API_SECRET': api_secret,
        }
    else:
        CLOUDINARY_STORAGE = {
            'CLOUD_NAME': env('CLOUDINARY_CLOUD_NAME', default='placeholder'),
            'API_KEY': env('CLOUDINARY_API_KEY', default='dummy'),
            'API_SECRET': env('CLOUDINARY_API_SECRET', default='dummy'),
        }
else:
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': env('CLOUDINARY_CLOUD_NAME', default='placeholder'),
        'API_KEY': env('CLOUDINARY_API_KEY', default='dummy'),
        'API_SECRET': env('CLOUDINARY_API_SECRET', default='dummy'),
    }

cloudinary.config(
    cloud_name=CLOUDINARY_STORAGE['CLOUD_NAME'],
    api_key=CLOUDINARY_STORAGE['API_KEY'],
    api_secret=CLOUDINARY_STORAGE['API_SECRET'],
    secure=True
)

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY = env('STRIPE_PUBLISHABLE_KEY', default='pk_test_dummy')
STRIPE_SECRET_KEY = env('STRIPE_SECRET_KEY', default='sk_test_dummy')
STRIPE_WEBHOOK_SECRET = env('STRIPE_WEBHOOK_SECRET', default='whsec_dummy')
stripe.api_key = STRIPE_SECRET_KEY

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = env("DJANGO_SECRET_KEY", default=None)
if not SECRET_KEY:
    raise ImproperlyConfigured("DJANGO_SECRET_KEY environment variable is required")
DEBUG = env.bool("DJANGO_DEBUG", default=False)

# Hosts
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=[
    "localhost", "127.0.0.1", "0.0.0.0", "backend", "*.fly.dev"
])

# Celery Worker Detection
IS_CELERY = (
    os.environ.get('IS_CELERY_WORKER') == 'true' or
    'celery' in sys.argv[0] or
    'worker' in sys.argv or
    'beat' in sys.argv
)

# CSRF Exemptions for donation platform
CSRF_EXEMPT_URLS = [
    r'^/api/donations/stripe/webhook/$',
]

class DisableCSRFMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        import re
        for pattern in CSRF_EXEMPT_URLS:
            if re.match(pattern, request.path_info):
                setattr(request, '_dont_enforce_csrf_checks', True)
        return self.get_response(request)

# Application Configuration
if IS_CELERY:
    INSTALLED_APPS = [
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        'cloudinary_storage',
        'cloudinary',

        # Donation platform apps
        'accounts.apps.AccountsConfig',
        'donations.apps.DonationsConfig',
        'emails.apps.EmailsConfig',

        # Celery
        'django_celery_beat',
        'django_celery_results',
        'rest_framework',
        'rest_framework.authtoken',
    ]

    MIDDLEWARE = [
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
    ]

    ROOT_URLCONF = 'django_project.celery_urls'

else:
    INSTALLED_APPS = [
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        'cloudinary_storage',
        'cloudinary',

        'accounts.apps.AccountsConfig',

        # Donation platform apps
        'donations.apps.DonationsConfig',
        'emails.apps.EmailsConfig',

        # Allauth (kept for existing DB tables)
        'django.contrib.sites',
        'allauth',
        'allauth.account',
        'allauth.socialaccount',
        'allauth.socialaccount.providers.google',

        # API
        'corsheaders',
        'rest_framework',
        'rest_framework.authtoken',
        'django_celery_beat',
        'django_celery_results',
    ]

    MIDDLEWARE = [
        'corsheaders.middleware.CorsMiddleware',
        'django_project.settings.base.DisableCSRFMiddleware',
        'django.middleware.security.SecurityMiddleware',
        'whitenoise.middleware.WhiteNoiseMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'allauth.account.middleware.AccountMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
    ]

    ROOT_URLCONF = 'django_project.urls'

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR.parent / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'django_project.wsgi.application'

# Database
DATABASES = {
    "default": env.db_url("DATABASE_URL", default="sqlite:///tmp/build.db")
}

# Authentication
AUTH_USER_MODEL = 'accounts.CustomUser'
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# Allauth settings (kept for existing DB tables)
SITE_ID = env.int("DJANGO_SITE_ID", default=1)
ACCOUNT_LOGIN_METHODS = {'email'}
ACCOUNT_EMAIL_VERIFICATION = 'optional'

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['profile', 'email'],
        'APP': {
            'client_id': env('GOOGLE_CLIENT_ID', default='test-client-id'),
            'secret': env('GOOGLE_CLIENT_SECRET', default='test-secret'),
        }
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# Email Configuration
EMAIL_BACKEND = env("EMAIL_BACKEND", default="django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST = env("EMAIL_HOST", default="smtp.gmail.com")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default="")
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="mnraynor90@gmail.com")

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
    },
}

# CORS (only for non-Celery)
if not IS_CELERY:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    CORS_ALLOW_CREDENTIALS = True

# Celery
CELERY_BROKER_URL = env('CELERY_BROKER_URL', default='redis://redis:6379/0')
CELERY_RESULT_BACKEND = 'django-db'
CELERY_TIMEZONE = TIME_ZONE

# Default field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
