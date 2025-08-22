# Production Dockerfile for Donation Platform
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    # For WeasyPrint (PDF generation)
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    libffi-dev \
    shared-mime-info \
    # Cleanup
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy requirements and install Python packages
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip wheel
RUN pip install --no-cache-dir -r requirements.txt

# Set build-time environment variables
ENV DJANGO_SETTINGS_MODULE=django_project.settings.base
ENV DJANGO_SECRET_KEY=build-time-secret-key
ENV DATABASE_URL=sqlite:///tmp/build.db
ENV CLOUDINARY_URL=cloudinary://dummy:dummy@dummy
ENV STRIPE_SECRET_KEY=sk_test_dummy
ENV STRIPE_PUBLISHABLE_KEY=pk_test_dummy

# Copy project
COPY . /app/

# Create directories
RUN mkdir -p /app/staticfiles /app/media

# Collect static files
RUN python manage.py collectstatic --noinput || echo "Collectstatic failed, continuing..."

# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/health/', timeout=10)" || exit 1

# Default command
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120", "django_project.wsgi:application"]