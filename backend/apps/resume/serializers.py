from rest_framework import serializers
from .models import (
    Education,
    Training,
    Certification,
    IndustrialProject,
    TrainingProject,
)

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = "__all__"


class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = "__all__"


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = "__all__"


class IndustrialProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndustrialProject
        fields = "__all__"


class TrainingProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingProject
        fields = "__all__"
