from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'scheduled_at', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('notes', 'patient__first_name', 'patient__last_name', 'doctor__full_name')
