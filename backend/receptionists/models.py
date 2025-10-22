from django.db import models
from django.contrib.auth.models import User

class Receptionist(models.Model):
    """
    Każda recepcjonistka to dokładnie jeden użytkownik (OneToOneField).
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="receptionist_profile")
    phone = models.CharField(max_length=50, blank=True)
    work_shift = models.CharField(max_length=100, blank=True)  # np. "8:00–16:00"
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["user__last_name"]

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} (recepcjonistka)"

    def delete(self, *args, **kwargs):
        user = self.user
        super().delete(*args, **kwargs)
        if user:
            user.delete()
