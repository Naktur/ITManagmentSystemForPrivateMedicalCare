# backend/patients/views.py
from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from .models import Patient
from .serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.select_related("user").all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["user__first_name", "user__last_name", "pesel", "email", "phone"]
    ordering_fields = ["user__last_name", "created_at"]
    ordering = ["user__last_name"]

    def perform_create(self, serializer):
        """
        Jawnie przypinamy użytkownika – działa niezależnie od tego,
        czy frontend wyśle user_id czy nie.
        """
        user_id = self.request.data.get("user_id")
        if not user_id:
            raise ValidationError({"user_id": ["To pole jest wymagane."]})
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise ValidationError({"user_id": ["Nieprawidłowy użytkownik."]})
        serializer.save(user=user)
