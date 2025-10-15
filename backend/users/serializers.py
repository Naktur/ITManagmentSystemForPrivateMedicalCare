from django.contrib.auth.models import User
from rest_framework import serializers

class MeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'is_staff', 'is_superuser']

    def get_full_name(self, obj):
        fn = f"{obj.first_name} {obj.last_name}".strip()
        return fn or obj.username
