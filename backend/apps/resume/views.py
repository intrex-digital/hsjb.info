from rest_framework import viewsets
from apps.core.permissions import IsAdminOrReadOnly
from .models import (
    Education,
    Training,
    Certification,
    IndustrialProject,
    TrainingProject,
)
from .serializers import (
    EducationSerializer,
    TrainingSerializer,
    CertificationSerializer,
    IndustrialProjectSerializer,
    TrainingProjectSerializer,
)

class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None

class TrainingViewSet(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None

class CertificationViewSet(viewsets.ModelViewSet):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None

class IndustrialProjectViewSet(viewsets.ModelViewSet):
    queryset = IndustrialProject.objects.all()
    serializer_class = IndustrialProjectSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None

class TrainingProjectViewSet(viewsets.ModelViewSet):
    queryset = TrainingProject.objects.all()
    serializer_class = TrainingProjectSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None
