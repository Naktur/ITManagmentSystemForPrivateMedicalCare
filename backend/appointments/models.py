from django.db import models
from patients.models import Patient
from doctors.models import Doctor

class Appointment(models.Model):
    """
    Wizyta łączy pacjenta i lekarza w konkretnym terminie.
    """
    class Status(models.TextChoices):
        SCHEDULED = 'scheduled', 'Zaplanowana'
        COMPLETED = 'completed', 'Zrealizowana'
        CANCELED = 'canceled', 'Anulowana'

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    scheduled_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-scheduled_at']
        indexes = [
            models.Index(fields=['scheduled_at']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.patient} → {self.doctor} @ {self.scheduled_at:%Y-%m-%d %H:%M}"
