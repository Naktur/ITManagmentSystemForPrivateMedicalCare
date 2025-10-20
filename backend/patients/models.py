from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    GENDER_CHOICES = [
        ("male", "Mężczyzna"),
        ("female", "Kobieta"),
        ("other", "Inna/nie podano"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="patient_profile")
    pesel = models.CharField(max_length=11, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, default="")  # ⬅️ NOWE
    phone = models.CharField(max_length=32, blank=True)
    email = models.EmailField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["user__last_name"]

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

    def delete(self, *args, **kwargs):
        user = self.user
        super().delete(*args, **kwargs)
        if user:
            user.delete()
