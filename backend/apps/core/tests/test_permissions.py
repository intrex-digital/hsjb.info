from django.urls import path
from rest_framework import status
from rest_framework.response import Response
from rest_framework.test import APITestCase
from rest_framework.views import APIView
from apps.core.permissions import IsAdminOrReadOnly
from apps.users.models import CustomUser

class DummyView(APIView):
    permission_classes = [IsAdminOrReadOnly]
    
    def get(self, request):
        return Response({"status": "ok"})
        
    def post(self, request):
        return Response({"status": "created"}, status=status.HTTP_201_CREATED)

urlpatterns = [
    path("dummy/", DummyView.as_view(), name="dummy"),
]

from django.test import override_settings

@override_settings(ROOT_URLCONF=__name__)
class PermissionTests(APITestCase):
    def setUp(self):
        self.admin_user = CustomUser.objects.create_superuser(
            email="admin@hsjb.info", password="testpassword"
        )
        self.normal_user = CustomUser.objects.create_user(
            email="user@hsjb.info", password="testpassword"
        )

    def test_unauthenticated_read(self):
        response = self.client.get("/dummy/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_write_fails(self):
        response = self.client.post("/dummy/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_normal_user_read(self):
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get("/dummy/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_normal_user_write_fails(self):
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.post("/dummy/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_write_success(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post("/dummy/")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
