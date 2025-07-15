from django.contrib import admin
from .models import EmailTemplate, EmailLog

@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'subject', 'is_active']

@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ['recipient_email', 'subject', 'was_sent', 'sent_at']
    readonly_fields = ['sent_at']
    list_filter = ['was_sent']
    
    def has_add_permission(self, request):
        return False  # Emails created automatically, not manually