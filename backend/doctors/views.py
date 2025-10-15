from rest_framework import viewsets, permissions, filters
from .models import Doctor
from .serializers import DoctorSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    """
    Pełny CRUD lekarzy.
    """
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['full_name', 'specialization']
    ordering_fields = ['full_name', 'created_at']
    ordering = ['full_name']
