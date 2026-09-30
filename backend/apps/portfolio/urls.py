from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileView, SkillCategoryViewSet, SkillViewSet

router = DefaultRouter()
router.register(r"skill-categories", SkillCategoryViewSet, basename="skillcategory")
router.register(r"skills", SkillViewSet, basename="skill")

urlpatterns = [
    path("profile/", ProfileView.as_view(), name="portfolio-profile"),
    path("", include(router.urls)),
]
