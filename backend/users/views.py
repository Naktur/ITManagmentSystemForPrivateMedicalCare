from rest_framework import permissions, views, response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.models import User
from .serializers import MeSerializer, RegisterSerializer
from rest_framework import generics, status
from rest_framework.response import Response
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

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        print("📥 REQUEST DATA:", request.data)  # 🔍 LOGUJEMY dane przychodzące
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("❌ VALIDATION ERRORS:", serializer.errors)  # 🔍 LOGUJEMY błąd
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        return Response(RegisterSerializer(user).data, status=status.HTTP_201_CREATED)