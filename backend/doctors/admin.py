from django.contrib import admin
from .models import Doctor

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "get_user_full_name",
        "specialization",
        "phone",
        "created_at",
    )
    search_fields = (
        "user__first_name",
        "user__last_name",
        "specialization",
        "phone",
    )

    def get_user_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    get_user_full_name.short_description = "Lekarz"
