from django.db import models
from django.contrib.auth.models import User

class Doctor(models.Model):
    """
    Lekarz może (ale nie musi) być powiązany z kontem User (np. do logowania).
    """
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='doctors')
    full_name = models.CharField(max_length=200)  # cache nazwy (np. "dr Jan Kowalski")
    specialization = models.CharField(max_length=200, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['full_name']

    def __str__(self):
        return self.full_name
