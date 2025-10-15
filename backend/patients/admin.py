from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "get_user_full_name",
        "pesel",
        "phone",
        "email",
        "created_at",
    )
    search_fields = (
        "user__first_name",
        "user__last_name",
        "pesel",
        "email",
        "phone",
    )

    def get_user_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    get_user_full_name.short_description = "Pacjent"
