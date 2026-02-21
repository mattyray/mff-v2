# CLAUDE.md — Matt Freedom Fundraiser v2

## Project Overview

Full-stack fundraising platform for collecting donations with Stripe payments, real-time campaign tracking, and automated donor communications.

## Tech Stack

- **Backend:** Django 5.1.6 + DRF 3.15.2, Python 3.12, PostgreSQL 16, Celery + Redis, Stripe, SendGrid
- **Frontend:** React 19 + TypeScript 5.8, Vite 6.3, Tailwind CSS 3.4, Axios
- **Deployment:** Fly.io (backend), Netlify (frontend), Docker Compose (dev)

## Project Structure

```
mff-v2/
├── backend/                    # Django REST API (port 8003 dev)
│   ├── accounts/               # Email-based auth, Google OAuth (allauth)
│   ├── donations/              # Campaign, Donation, CampaignUpdate models + Stripe
│   ├── emails/                 # EmailTemplate, EmailLog, Celery tasks
│   ├── profiles/               # User profiles
│   ├── django_project/         # Settings, URLs, WSGI/ASGI, Celery config
│   │   └── settings/           # base.py, dev.py, prod.py, test.py
│   ├── templates/              # Django HTML templates
│   ├── docker-compose.yml      # PostgreSQL, Redis, Django, Celery worker
│   ├── Dockerfile / Dockerfile.dev
│   ├── fly.toml                # Fly.io deployment (region: ewr)
│   ├── requirements.txt        # Production deps
│   └── requirements-dev.txt    # Dev tools (black, flake8, mypy, pytest)
├── frontend/                   # React SPA (port 5173 dev)
│   ├── src/
│   │   ├── components/         # CampaignPage, UserMenu, ErrorBoundary
│   │   │   └── sections/       # Hero, Progress, Donation, Updates, Supporters
│   │   ├── services/api.ts     # Axios client with interceptors
│   │   ├── hooks/useAuth.ts    # Auth hook
│   │   ├── types/index.ts      # TypeScript types
│   │   ├── App.tsx             # Root component with routing
│   │   └── main.tsx            # Entry point
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── netlify.toml
└── docker.sh                   # Docker helper script
```

## Development Commands

### Backend
```bash
# Docker (preferred)
docker-compose up -d                          # Start all services
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py test

# Local
cd backend
python manage.py runserver 8003
celery -A django_project worker --loglevel=info
pytest
```

### Frontend
```bash
cd frontend
npm install
npm run dev       # Vite dev server on :5173
npm run build     # tsc -b && vite build
npm run lint      # ESLint
```

### Docker Helper
```bash
./docker.sh build | up | logs | migrate | shell | clean | status
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/donations/campaign/` | Active campaign |
| GET | `/api/donations/recent/` | Recent donations |
| GET | `/api/donations/updates/` | Campaign updates |
| POST | `/api/donations/create/` | Create donation (Stripe checkout) |
| POST | `/api/donations/stripe/webhook/` | Stripe webhook handler |
| GET | `/api/donations/success/` | Success page |
| GET | `/api/donations/cancel/` | Cancel page |
| POST | `/api/accounts/auth/google/` | Google OAuth |
| POST | `/api/accounts/signup/` | Registration |
| POST | `/api/accounts/login/` | Login |
| GET | `/api/accounts/me/` | Current user |
| GET | `/health/` | Health check |

## Key Architecture

### Stripe Payment Flow
1. Frontend submits donation → `POST /api/donations/create/`
2. Backend creates Donation record + Stripe checkout session → returns `checkout_url`
3. User redirected to Stripe Checkout
4. Stripe sends webhook on completion → Backend verifies signature
5. Donation status updated to "completed", campaign total incremented
6. Celery task queued for thank-you email

### Authentication
- Custom email-based User model (no username field)
- Django Allauth for Google OAuth
- Token + Session authentication on DRF endpoints

### Task Queue
- Celery worker with Redis broker
- Tasks: thank-you emails (`emails/tasks.py`)
- Results stored via django-celery-results

## Environment Variables

### Backend (`backend/.env`)
`DJANGO_SECRET_KEY`, `DEBUG`, `DATABASE_URL`, `CLOUDINARY_URL`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `SENDGRID_API_KEY`, `DEFAULT_FROM_EMAIL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FRONTEND_URL`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`

### Frontend (`frontend/.env.local`)
`VITE_API_BASE_URL`, `VITE_API_TOKEN`, `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_GOOGLE_CLIENT_ID`, `VITE_FACEBOOK_APP_ID`

## Conventions

- **Python:** snake_case, Black formatting, flake8 linting
- **React:** PascalCase components, functional components + hooks only
- **Styling:** Tailwind utility classes (no CSS modules)
- **API:** REST with DRF serializers, `/api/{app}/{resource}/` URL pattern
- **Settings:** Split settings module (base/dev/prod/test)
- **Docker ports:** PostgreSQL 5433, Redis 6380, Django 8003 (mapped from standard internal ports)

## Database

PostgreSQL with these core models:
- `accounts.CustomUser` — email-based auth
- `donations.Campaign` — goal_amount, current_amount, title, description, featured_image, video_url
- `donations.Donation` — amount, donor info, payment_status, stripe_session_id, donation_id (UUID)
- `donations.CampaignUpdate` — title, content, linked to campaign
- `emails.EmailTemplate` — reusable email templates
- `emails.EmailLog` — audit trail for sent emails
