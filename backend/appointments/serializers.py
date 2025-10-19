from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.user.get_full_name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.user.get_full_name", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient",
            "patient_name",
            "doctor",
            "doctor_name",
            "scheduled_at",
            "status",
            "notes",
            "created_at",
        ]
        read_only_fields = ["created_at"]

    def update(self, instance, validated_data):
        # Pozwala na aktualizację tylko wybranych pól
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
