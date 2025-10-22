# backend/patients/views.py
from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from .models import Patient
from .serializers import PatientSerializer
from users.utils import get_user_role
from appointments.models import Appointment

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.select_related("user").all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["user__first_name", "user__last_name", "pesel", "email", "phone"]
    ordering_fields = ["user__last_name", "created_at"]
    ordering = ["user__last_name"]

    def get_queryset(self):
        user = self.request.user
        role = get_user_role(user)

        if role in ["admin", "receptionist"]:
            return self.queryset

        if role == "doctor":
            patient_ids = Appointment.objects.filter(doctor__user=user).values_list("patient_id", flat=True)
            return self.queryset.filter(id__in=patient_ids).distinct()

        if role == "patient":
            return self.queryset.filter(user=user)

        return Patient.objects.none()

    def perform_create(self, serializer):
        user_id = self.request.data.get("user_id")
        if not user_id:
            raise ValidationError({"user_id": ["To pole jest wymagane."]})
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise ValidationError({"user_id": ["Nieprawidłowy użytkownik."]})

        role = get_user_role(self.request.user)
        if role in ["admin", "doctor", "receptionist"]:
            serializer.save(user=user)
        else:
            raise ValidationError("Nie masz uprawnień do dodawania pacjentów.")