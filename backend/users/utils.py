from django.contrib.auth.models import User

def get_user_role(user: User) -> str:
    """
    Zwraca rolę użytkownika: admin, doctor, patient, receptionist lub unknown.
    """
    if not user or not user.is_authenticated:
        return "anonymous"
    if user.is_superuser:
        return "admin"
    if hasattr(user, "doctor_profile"):
        return "doctor"
    if hasattr(user, "patient_profile"):
        return "patient"
    if hasattr(user, "receptionist_profile"):
        return "receptionist"
    return "unknown"
