from rest_framework import permissions
from users.utils import get_user_role

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser

class IsDoctor(permissions.BasePermission):
    def has_permission(self, request, view):
        return get_user_role(request.user) == "doctor"

class IsReceptionist(permissions.BasePermission):
    def has_permission(self, request, view):
        return get_user_role(request.user) == "receptionist"

class IsPatient(permissions.BasePermission):
    def has_permission(self, request, view):
        return get_user_role(request.user) == "patient"

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Używane np. przy wizytach lub danych pacjenta — pozwala właścicielowi lub adminowi.
    """
    def has_object_permission(self, request, view, obj):
        role = get_user_role(request.user)
        if request.user.is_superuser:
            return True
        if hasattr(obj, "user") and obj.user == request.user:
            return True
        if hasattr(obj, "patient") and obj.patient.user == request.user:
            return True
        if hasattr(obj, "doctor") and obj.doctor.user == request.user:
            return True
        return False
