from rest_framework import permissions, views, response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import MeSerializer

# Używamy gotowych widoków SimpleJWT do /login i /refresh
class LoginView(TokenObtainPairView):
    """
    Przyjmuje {"username": "...", "password": "..."} i zwraca access/refresh JWT.
    """
    pass

class RefreshView(TokenRefreshView):
    """
    Przyjmuje {"refresh": "..."} i zwraca nowy access.
    """
    pass

class MeView(views.APIView):
    """
    Zwraca informacje o aktualnie zalogowanym użytkowniku (na podstawie JWT).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return response.Response(MeSerializer(request.user).data)
