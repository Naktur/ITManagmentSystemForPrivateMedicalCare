from rest_framework import viewsets, permissions, filters
from .models import Appointment
from .serializers import AppointmentSerializer
from users.utils import get_user_role

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    Pełny CRUD wizyt.
    """
    queryset = Appointment.objects.select_related('patient', 'doctor').all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    # Search nie ma sensu po datetime, ale po notatkach już tak
    search_fields = ['notes', 'status']
    ordering_fields = ['scheduled_at', 'created_at', 'status']
    ordering = ['-scheduled_at']

    def get_queryset(self):
        user = self.request.user
        role = get_user_role(user)

        if role == "admin":
            return self.queryset

        if role == "doctor":
            return self.queryset.filter(doctor__user=user)

        if role == "receptionist":
            return self.queryset

        if role == "patient":
            return self.queryset.filter(patient__user=user)

        return Appointment.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        role = get_user_role(user)

        if role == "patient":
            # Pacjent może umawiać tylko wizytę dla siebie
            serializer.save(patient=user.patient_profile)
        else:
            serializer.save()

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True  # ✅ pozwól na częściową aktualizację
        return super().update(request, *args, **kwargs)
