from rest_framework import serializers
from .models import Doctor
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "full_name"]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source="user", write_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ["id", "user", "user_id", "specialization", "phone", "full_name", "created_at"]
        read_only_fields = ["created_at"]

    def get_full_name(self, obj):
        # pole pomocnicze, by frontend miał co wyświetlić
        return f"{obj.user.first_name} {obj.user.last_name}".strip()
