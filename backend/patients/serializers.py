# backend/patients/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Patient


class PatientUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email"]
        extra_kwargs = {"email": {"required": False}}


class PatientSerializer(serializers.ModelSerializer):
    # do edycji / odczytu
    user = PatientUserSerializer(required=False)
    # do tworzenia (POST) – opcjonalne, bo przypniemy też w perform_create
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="user",
        write_only=True,
        required=False,
    )
    # do list/selectów
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Patient
        fields = [
            "id",
            "user",
            "user_id",
            "full_name",
            "pesel",
            "phone",
            "email",
            "created_at",
        ]
        read_only_fields = ["created_at"]

    def get_full_name(self, obj):
        fn = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return fn or obj.user.username

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        return super().update(instance, validated_data)
