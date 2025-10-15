from django.db import models

class Patient(models.Model):
    """
    Podstawowy model Pacjenta do rejestracji wizyt.
    """
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    pesel = models.CharField(max_length=11, blank=True)  # opcjonalnie
    date_of_birth = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=32, blank=True)
    email = models.EmailField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.last_name} {self.first_name}".strip()
