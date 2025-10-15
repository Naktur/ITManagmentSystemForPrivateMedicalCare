from rest_framework import serializers
from .models import Doctor

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'full_name', 'specialization', 'user', 'created_at']
        read_only_fields = ['created_at']
