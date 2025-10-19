from django.db import models
from django.contrib.auth.models import User

class Doctor(models.Model):
    """
    Każdy lekarz to dokładnie jeden użytkownik (OneToOneField).
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="doctor_profile")
    specialization = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["user__last_name"]

    def __str__(self):
        return f"dr {self.user.first_name} {self.user.last_name}".strip()

    def delete(self, *args, **kwargs):
        """
        Przy usuwaniu lekarza usuń też powiązanego użytkownika.
        """
        user = self.user
        super().delete(*args, **kwargs)
        if user:
            user.delete()
