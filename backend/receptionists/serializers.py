from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Receptionist

class ReceptionistUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email"]
        extra_kwargs = {"email": {"required": False}}

class ReceptionistSerializer(serializers.ModelSerializer):
    user = ReceptionistUserSerializer(required=False)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="user",
        write_only=True,
        required=False,
    )
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Receptionist
        fields = [
            "id", "user", "user_id", "full_name",
            "phone", "work_shift", "created_at"
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
