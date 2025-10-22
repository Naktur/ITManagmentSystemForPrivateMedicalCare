# backend/doctors/views.py
from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from .models import Doctor
from .serializers import DoctorSerializer
from users.utils import get_user_role
from appointments.models import Appointment

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.select_related("user").all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["user__first_name", "user__last_name", "specialization", "phone"]
    ordering_fields = ["user__last_name", "created_at"]
    ordering = ["user__last_name"]

    def get_queryset(self):
        user = self.request.user
        role = get_user_role(user)

        if role in ["admin", "receptionist"]:
            return self.queryset

        if role == "doctor":
            return self.queryset.filter(user=user)

        if role == "patient":
            doctor_ids = Appointment.objects.filter(patient__user=user).values_list("doctor_id", flat=True)
            return self.queryset.filter(id__in=doctor_ids).distinct()

        return Doctor.objects.none()

    def perform_create(self, serializer):
        role = get_user_role(self.request.user)
        if role != "admin":
            raise ValidationError("Tylko administrator może dodawać lekarzy.")
        user_id = self.request.data.get("user_id")
        if not user_id:
            raise ValidationError({"user_id": ["To pole jest wymagane."]})
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise ValidationError({"user_id": ["Nieprawidłowy użytkownik."]})
        serializer.save(user=user)
