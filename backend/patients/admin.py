from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('id', 'last_name', 'first_name', 'pesel', 'phone', 'email', 'created_at')
    search_fields = ('first_name', 'last_name', 'pesel', 'email', 'phone')
