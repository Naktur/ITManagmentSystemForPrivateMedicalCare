from rest_framework import serializers
from .models import Appointment
from patients.serializers import PatientSerializer
from doctors.serializers import DoctorSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    # Zagnieżdżone wersje (read-only) + proste ID do tworzenia/edycji
    patient_detail = PatientSerializer(source='patient', read_only=True)
    doctor_detail = DoctorSerializer(source='doctor', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id',
            'patient', 'patient_detail',
            'doctor', 'doctor_detail',
            'scheduled_at',
            'status',
            'notes',
            'created_at',
        ]
        read_only_fields = ['created_at']
