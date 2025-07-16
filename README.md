# Matt Freedom Fundraiser v2 🌊

A donation platform for **Matt Raynor** - quadriplegic developer raising funds for accessible housing.

## 🎯 **CURRENT STATUS**

### ✅ **COMPLETED**
- **Frontend**: Ocean-themed redesign complete, mobile-responsive
- **Backend**: Django API working, database models implemented
- **Dev Environment**: Hybrid Docker + local setup functional

### 🚧 **IMMEDIATE NEEDS**
1. **Stripe Payment Integration** (2-3 hours)
2. **Email Automation** (1 hour) 
3. **Production Deployment** (1-2 hours)

---

## 🗃️ **DATABASE SCHEMA**

### **Core Models (Working)**
```python
Campaign
├── title, description, goal_amount
├── current_amount (auto-calculated)
├── progress_percentage (property)
├── featured_image (URL)
└── is_active (boolean)

Donation  
├── campaign (ForeignKey)
├── amount, donor_name, donor_email
├── stripe_session_id, payment_status
├── receipt_sent (boolean)
└── created_at

CampaignUpdate
├── campaign (ForeignKey)  
├── title, content
├── video_url, image_url
└── created_at
```

### **Models Needing Work**
```python
EmailTemplate # Basic structure, needs templates
EmailLog      # Tracking only, no automation yet
```

---

## 🔌 **API STATUS**

### **Working Endpoints**
```
GET  /api/donations/campaign/     # Current campaign data
GET  /api/donations/recent/       # Recent donations  
GET  /api/donations/updates/      # Campaign updates
GET  /api/accounts/me/            # User profile
POST /api/accounts/auth/google/   # Google OAuth
```

### **Needs Implementation**
```python
# donations/views.py - create_donation function
POST /api/donations/create/       # 50% done, needs Stripe completion
POST /api/donations/stripe/webhook/ # Basic structure, needs verification

# Missing entirely:
POST /api/donations/success/      # Payment success handling  
POST /api/donations/cancel/       # Payment cancellation
```

---

## 💳 **STRIPE INTEGRATION STATUS**

### **Current Implementation**
```python
# donations/views.py - Line 45
def create_donation(request):
    # ✅ Basic Stripe session creation
    # ✅ Donation model creation  
    # ❌ Missing proper error handling
    # ❌ Missing metadata for tracking
    # ❌ Missing success/cancel URLs
```

### **Needs Building**
```python
# 1. Complete create_donation function
stripe.checkout.Session.create(
    payment_method_types=['card'],
    line_items=[...],
    mode='payment',
    success_url=f"{settings.FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
    cancel_url=f"{settings.FRONTEND_URL}/cancel",
    metadata={'donation_id': donation.id}  # ← Missing
)

# 2. Webhook signature verification  
def stripe_webhook(request):
    # ❌ No signature verification (CRITICAL for production)
    # ❌ No error handling
    # ❌ No email triggering

# 3. Success/Cancel pages (frontend)
# ❌ /success page - confirm payment, show thank you
# ❌ /cancel page - handle abandoned payments
```

---

## 📧 **EMAIL AUTOMATION STATUS**

### **Current Setup**
```python
# emails/models.py - ✅ Complete
EmailTemplate  # Template storage
EmailLog       # Sent email tracking

# emails/tasks.py - ❌ Empty file
# Need: Celery task for sending thank you emails
```

### **Needs Implementation**
```python
# emails/tasks.py
@shared_task
def send_thank_you_email(donation_id):
    # Get donation + template
    # Render HTML with donor name, amount
    # Send via SendGrid
    # Log success/failure
    
# Trigger from: donations/views.py webhook
```

---

## 🔧 **DEVELOPMENT SETUP**

### **Quick Start**
```bash
# Backend (Docker)
cd backend && docker-compose up backend db redis celery_worker -d

# Frontend (Local)  
cd frontend && npm run dev

# URLs
Frontend: http://localhost:5173
Backend:  http://localhost:8003
Admin:    http://localhost:8003/admin
```

### **Environment Variables**
```bash
# backend/.env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...  
STRIPE_WEBHOOK_SECRET=whsec_...     # ← Need for webhook verification
SENDGRID_API_KEY=...
FRONTEND_URL=http://localhost:5173

# frontend/.env  
VITE_API_BASE_URL=http://localhost:8003
```

---

## 📋 **IMMEDIATE TASK BREAKDOWN**

### **1. Complete Stripe Integration**
```python
# File: backend/donations/views.py

# Fix create_donation function:
- Add proper error handling
- Include metadata for tracking  
- Set correct success/cancel URLs

# Fix stripe_webhook function:  
- Add signature verification
- Handle checkout.session.completed event
- Update donation.payment_status = 'completed'  
- Trigger email task

# Add frontend success/cancel pages
```

### **2. Email Automation**
```python
# File: backend/emails/tasks.py
- Create send_thank_you_email Celery task
- HTML template with donor name, amount
- SendGrid integration  
- Update EmailLog for tracking
```

### **3. Production Deployment**
```bash
# Backend: Fly.io
- Set production environment variables
- Configure PostgreSQL connection
- Set up domain/SSL

# Frontend: Netlify
- Connect to git repository
- Set VITE_API_BASE_URL to production
- Configure redirect rules
```

---

## 🐛 **KNOWN ISSUES**

### **Backend**
- Donation form validation could be stronger
- No recurring payments (future feature)
- Basic admin interface (functional but basic)

### **Frontend**  
- No loading states during payment processing
- No error handling for failed API calls
- Recent donations count is hardcoded (47)

---

## 📁 **KEY FILES FOR NEXT SESSION**

### **Primary Focus**
```
backend/donations/views.py        # Stripe integration
backend/emails/tasks.py           # Email automation  
frontend/src/services/api.ts      # API calls
```

### **Secondary**
```
backend/donations/admin.py        # Admin interface polish
backend/django_project/settings/  # Environment config
fly.toml                         # Deployment config
```

---

## 🎯 **SUCCESS CRITERIA**

- [ ] User can complete donation via Stripe
- [ ] Payment webhooks update database correctly  
- [ ] Thank you emails send automatically
- [ ] Live on production URLs
- [ ] Matt can manage content via admin

---

**For Next Chat**: "Frontend design complete. Need to finish Stripe payment processing and deploy to production. Focus on donations/views.py Stripe integration."