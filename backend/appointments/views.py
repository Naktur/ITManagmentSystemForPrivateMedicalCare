from rest_framework import viewsets, permissions, filters
from .models import Appointment
from .serializers import AppointmentSerializer

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

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True  # ✅ pozwól na częściową aktualizację
        return super().update(request, *args, **kwargs)
