# Matt Freedom Fundraiser v2 🌊

A purpose-built donation platform for **Matt Raynor** - a quadriplegic developer whose story of resilience and determination inspires thousands.

## 🎯 Project Goals

### Immediate Goals (Next 3 days)
- 🎯 **Launch MVP**: Accept donations with Stripe integration
- 📧 **Email automation**: Automatic thank you emails for donors  
- 📊 **Real-time progress**: Live campaign progress tracking
- 👨‍💼 **Admin dashboard**: Easy campaign management for Matt
- 🚀 **Deploy to production**: Live on Fly.io + Netlify
- 📱 **Mobile responsive**: Works perfectly on phones (concurrent development)

### Medium-Term Goals (1-3 Months)
- 📈 **Basic analytics**: Track total donations, donor count, progress trends
- 🔗 **YouTube integration**: Easy embedding of Matt's update videos
- 📱 **Mobile optimization**: Polish mobile experience
- 🏠 **Multiple campaigns**: Support different goals (housing, equipment, etc.)

### Long-Term Focus
- 🎯 **Keep it simple**: Focus on core donation functionality
- 🔧 **Maintainable**: Easy for Matt to manage independently
- ⚡ **Fast & reliable**: Prioritize performance over features

### What We're NOT Doing
- ❌ Built-in video hosting (use YouTube)
- ❌ Recurring donations (too complex for now)
- ❌ Community features (comments, forums)
- ❌ Platform scaling for others
- ❌ Complex custom branding

**Core Philosophy:** *"Simple, effective donation platform that gets out of Matt's way and lets his story do the talking."*

## 🏊‍♂️ Matt's Story

Matt Raynor was a commercial fisherman working the waters off Montauk when a diving accident on April 18, 2019, changed everything. The accident left him paralyzed from the collarbone down as a C5-C6 quadriplegic with no hand function.

Instead of giving up, Matt taught himself to code from a nursing home - typing one key at a time with a stylus on an old Windows PC. Today, he's a professional full-stack developer, aerial photographer, published author, and inspirational content creator who builds production-grade applications using adaptive tools, voice commands, and AI assistance.

**Learn more about Matt:**
- 🌐 [MatthewRaynor.com](https://matthewraynor.com) - Portfolio & Story
- 📖 **Book**: "Before Me After Me" - His memoir
- 📸 **Photography Portfolio** - Aerial drone photography
- 🎥 **YouTube Tutorials** - Coding & life content
- 📰 **DEV.to Article** - His developer journey

## 💡 Why This Platform?

This platform provides Matt with:
- ✅ **Simple donation system** - Any amount from $5 to $5,000+
- ✅ **Real-time progress tracking** - Toward specific goals (housing, equipment)
- ✅ **YouTube integration** - Embed his video updates easily
- ✅ **Professional alternative** - Better than scattered GoFundMe pages
- ✅ **Automated communication** - Thank donors and share progress
- ✅ **Complete control** - Matt manages everything through admin panel

## ✅ Current Status

### Completed ✅
- **Backend foundation** - Django + PostgreSQL + Redis + Celery
- **Frontend foundation** - React + TypeScript + Tailwind CSS
- **Database models** - Campaign, Donation, User, Email systems
- **API integration** - Frontend successfully loads campaign data
- **Authentication system** - Google OAuth + custom user model
- **CORS configuration** - Frontend ↔ Backend communication working
- **Development workflow** - Hybrid setup optimized for productivity
- **Deployment prep** - Docker + Netlify configurations ready

### Next Steps 🚧
- **Stripe integration** - Payment processing and webhooks
- **Donation form component** - Frontend donation interface
- **Email automation** - Thank you emails with Celery tasks
- **Admin panel setup** - Register models for campaign management
- **Production deployment** - Deploy to Fly.io + Netlify

## 🏗️ Architecture

### Development Setup (Hybrid)
```
Development:
  ├── Backend (Docker)
  │   ├── Django API (port 8003)
  │   ├── PostgreSQL (port 5433)
  │   ├── Redis (port 6380)
  │   └── Celery Worker
  └── Frontend (Local)
      └── React + Vite (port 5173)
```

### Production Deployment
```
Production:
  ├── Backend → Fly.io (Docker containers)
  │   ├── Django API + PostgreSQL + Redis
  │   └── Automatic scaling
  └── Frontend → Netlify
      ├── React build (npm run build)
      └── Global CDN distribution
```

### Why Hybrid Development?
- 🚀 **Fast development**: Frontend hot reload without Docker overhead
- 🔒 **Production ready**: Backend containers deploy directly to Fly.io
- 💰 **Cost effective**: Netlify free tier + Fly.io scaling
- 🎯 **Simple**: No complex Docker networking for frontend development

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for frontend development)
- Git

### Development Setup
```bash
# 1. Clone and start backend services (Docker)
git clone <repository-url>
cd matt-freedom-fundraiser-v2/backend
docker-compose up backend db redis celery_worker -d

# 2. Start frontend locally (faster development)
cd ../frontend
npm install
npm run dev

# 3. Create superuser (if needed)
docker-compose exec backend python manage.py createsuperuser
```

### Access Points
- **Backend API**: http://localhost:8003
- **Frontend**: http://localhost:5173 *(local npm dev server)*
- **Admin Panel**: http://localhost:8003/admin
- **Database**: PostgreSQL on port 5433
- **Redis**: Port 6380

## 💻 Tech Stack

### Backend
- **Framework**: Django 5.1.6 + Django REST Framework
- **Database**: PostgreSQL 16 (port 5433)
- **Task Queue**: Celery + Redis (port 6380)
- **Payments**: Stripe Checkout + Webhooks
- **Email**: SendGrid with HTML templates
- **Storage**: Cloudinary for images/videos
- **Containerization**: Docker + Docker Compose

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios (DonationAPI class)

### Deployment
- **Backend**: Fly.io with Docker containers
- **Frontend**: Netlify with automatic deployments
- **Database**: PostgreSQL on Fly.io

## 📊 Database Models

### Core Models
```python
Campaign                    # Matt's fundraising goals
├── title                  # "Help Matt Secure Accessible Housing"
├── description            # Full campaign story
├── goal_amount           # Target amount ($25,000)
├── current_amount        # Auto-calculated from donations
├── progress_percentage   # Real-time percentage (property)
├── is_active            # Only one active campaign
├── featured_image       # Hero image URL (Cloudinary)
└── start/end dates      # Campaign timeline

Donation                   # Individual contributions  
├── campaign              # ForeignKey to Campaign
├── amount               # Any amount donor chooses
├── donor_name/email     # Optional contact info
├── user                 # Optional account link
├── is_anonymous         # Privacy option
├── message              # Personal note to Matt
├── stripe_session_id    # Payment tracking
├── payment_status       # pending → completed → updates campaign total
├── receipt_sent         # Email automation tracking
└── is_recurring         # Future: monthly donations

CampaignUpdate            # Matt's video blog posts
├── campaign             # ForeignKey to Campaign  
├── title                # "Week 2: Found Great Apartments!"
├── content              # Text summary/description
├── video_url            # YouTube/Vimeo link
├── video_embed_code     # Full embed HTML
├── image_url            # Thumbnail or photo
└── has_video            # Property: bool check
```

## 🔧 Development Commands

### Daily Workflow
```bash
# Start backend services (Docker)
cd backend
docker-compose up backend db redis celery_worker -d

# Start frontend (local)
cd frontend
npm run dev

# Check services
docker-compose ps
curl http://localhost:8003/health/

# Stop services
docker-compose down  # Keeps data
docker-compose down -v  # Removes data (nuclear option)
```

### Django Commands
```bash
# Django management
docker-compose exec backend python manage.py shell
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

# Database access
docker-compose exec backend python manage.py shell
docker-compose exec db psql -U postgres -d donations_db
```

## 🌍 Environment Variables

### Backend (.env)
```bash
# Django
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://postgres:postgres_password@db:5432/donations_db

# Stripe payments
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Email automation
SENDGRID_API_KEY=your_sendgrid_key
DEFAULT_FROM_EMAIL=donations@mattfreedomfundraiser.com

# Media storage
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Social auth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8003
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🚨 Troubleshooting

### Frontend Not Loading
```bash
# Check if frontend is running on correct port
cd frontend
npm run dev  # Should show "Local: http://localhost:5173/"

# Check CORS errors in browser console
# Backend should allow: http://localhost:5173
```

### Backend Connection Issues
```bash
# Check backend services
docker-compose ps  # All should be "Up"
curl http://localhost:8003/health/  # Should return {"status": "healthy"}

# Restart backend if needed
docker-compose restart backend
```

### Port Conflicts
```bash
# If ports are in use, check what's running:
lsof -i :5173  # Frontend
lsof -i :8003  # Backend
lsof -i :5433  # PostgreSQL

# Stop conflicting services or change ports in docker-compose.yml
```

## 📋 Instructions for Continued Development

### For New Claude Sessions
When starting a new chat session with Claude:

1. **Attach this README** + current project code snapshots
2. **State your goal**: "Let's continue building Matt's donation platform. We need to work on [specific feature]"
3. **Mention current setup**: "We're using hybrid development - backend in Docker, frontend local on port 5173"

### Current Working Commands
```bash
# Backend (Docker)
cd backend && docker-compose up backend db redis celery_worker -d

# Frontend (Local) 
cd frontend && npm run dev

# Access: Backend http://localhost:8003, Frontend http://localhost:5173
```

### What's Working Now
- ✅ Campaign data loads from Django API to React frontend
- ✅ CORS configured properly, no connection errors
- ✅ Models, migrations, authentication all set up
- 🚧 Ready to add Stripe payments and email automation

## 📁 Project Structure
```
matt-freedom-fundraiser-v2/
├── backend/
│   ├── accounts/           # ✅ Custom user model
│   ├── donations/          # ✅ Core models (Campaign, Donation)
│   │   ├── models.py      # Campaign, Donation, CampaignUpdate
│   │   ├── admin.py       # 🚧 TODO: Register models
│   │   ├── views.py       # 🚧 TODO: Complete API endpoints
│   │   └── urls.py        # ✅ URL routing
│   ├── emails/            # ✅ Email automation models
│   │   ├── models.py      # EmailTemplate, EmailLog  
│   │   ├── tasks.py       # 🚧 TODO: Celery email tasks
│   │   └── templates/     # 🚧 TODO: Email HTML templates
│   ├── django_project/    # ✅ Settings configured
│   └── requirements.txt   # ✅ All dependencies
├── frontend/              # ✅ React setup
│   ├── src/
│   │   ├── components/    # ✅ Basic components, need donation form
│   │   ├── hooks/         # ✅ useAuth hook
│   │   ├── services/      # ✅ DonationAPI class
│   │   └── types/         # ✅ TypeScript definitions
│   └── package.json       # ✅ Dependencies installed
└── README.md              # ✅ This file
```

## 🎯 Next Development Priorities

### 1. Stripe Integration (High Priority)
```python
# donations/stripe_views.py - Payment processing
def create_donation_session(amount, donor_info):
    # Create Stripe checkout session
    # Save donation with status='pending'
    # Return checkout URL to frontend
    
def stripe_webhook(request):
    # Handle payment_intent.succeeded
    # Update donation.payment_status = 'completed'
    # Trigger thank you email
```

### 2. Donation Form Component (High Priority)
```typescript
// frontend/src/components/DonationForm.tsx
// Amount input + Stripe checkout integration
// Mobile-responsive design
```

### 3. Email Automation (Medium Priority)
```python
# emails/tasks.py - Celery tasks
@shared_task
def send_thank_you_email(donation_id):
    # Get donation, render template, send via SendGrid
```

### 4. Admin Panel (Medium Priority)
```python
# donations/admin.py - Register models for easy management
@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ['title', 'current_amount', 'goal_amount', 'progress_percentage']
```

## 💝 Support Matt's Work

- 🌐 **Visit**: [MatthewRaynor.com](https://matthewraynor.com)
- 📚 **Buy his book**: "Before Me After Me"
- 🎨 **Purchase photography**: His aerial drone prints
- 📢 **Share his story**: Help spread awareness
- ⭐ **Star this repository**: Show your support

---

**Development Philosophy**: *Keep it simple. Focus on core donation functionality. Let Matt's story and video updates drive engagement.*

**For Claude**: *This README is the single source of truth. When continuing development, always reference current status and next priorities listed above.*

Built with ❤️ for an incredible journey of resilience and determination.