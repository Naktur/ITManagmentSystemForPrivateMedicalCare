from rest_framework import viewsets, permissions, filters
from .models import Patient
from .serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    """
    Pełny CRUD pacjentów.
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    # proste filtrowanie: ?search=Kowalski
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'pesel', 'phone', 'email']
    ordering_fields = ['last_name', 'created_at']
    ordering = ['last_name', 'first_name']
