from rest_framework import generics
from apps.core.permissions import IsAdminOrReadOnly
from .models import Profile
from .serializers import ProfileSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    """
    GET /api/v1/portfolio/profile/
    PUT/PATCH /api/v1/portfolio/profile/
    
    Retrieves or updates the single portfolio Profile.
    Publicly readable, but only writable by admins.
    """
    serializer_class = ProfileSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_object(self):
        return Profile.get_solo()


from rest_framework import viewsets
from .models import SkillCategory, Skill
from .serializers import SkillCategorySerializer, SkillSerializer

class SkillCategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD for Skill Categories.
    """
    queryset = SkillCategory.objects.all()
    serializer_class = SkillCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None # Skills shouldn't really be paginated, we just need all of them


class SkillViewSet(viewsets.ModelViewSet):
    """
    CRUD for Skills.
    """
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None

from .models import Service
from .serializers import ServiceSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    """
    CRUD for Services.
    """
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None
