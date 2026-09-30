from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EducationViewSet,
    TrainingViewSet,
    CertificationViewSet,
    IndustrialProjectViewSet,
    TrainingProjectViewSet,
)

router = DefaultRouter()
router.register(r"education", EducationViewSet, basename="education")
router.register(r"training", TrainingViewSet, basename="training")
router.register(r"certifications", CertificationViewSet, basename="certification")
router.register(r"industrial-projects", IndustrialProjectViewSet, basename="industrial-project")
router.register(r"training-projects", TrainingProjectViewSet, basename="training-project")

urlpatterns = [
    path("", include(router.urls)),
]
