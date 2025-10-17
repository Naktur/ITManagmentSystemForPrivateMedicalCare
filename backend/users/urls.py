from django.urls import path
from .views import LoginView, RefreshView, MeView, RegisterView

urlpatterns = [
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('refresh/', RefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),
    path("register/", RegisterView.as_view(), name="register"),
]
