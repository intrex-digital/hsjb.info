from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.models import CustomUser

class PresignedUploadViewTests(APITestCase):
    def setUp(self):
        self.admin_user = CustomUser.objects.create_superuser(
            email="admin@hsjb.info",
            password="adminpassword123",
        )
        self.normal_user = CustomUser.objects.create_user(
            email="user@hsjb.info",
            password="userpassword123",
        )
        self.url = reverse("presigned-upload")

    def test_unauthenticated_fails(self):
        response = self.client.post(self.url, {"filename": "test.png", "content_type": "image/png"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_admin_fails(self):
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.post(self.url, {"filename": "test.png", "content_type": "image/png"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch("apps.core.views.boto3.client")
    def test_admin_success(self, mock_boto_client):
        mock_s3 = mock_boto_client.return_value
        mock_s3.generate_presigned_post.return_value = {
            "url": "https://bucket.example.com",
            "fields": {"key": "value"}
        }

        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(self.url, {"filename": "test.png", "content_type": "image/png"}, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("presigned_data", response.data)
        self.assertIn("public_url", response.data)
        self.assertIn("object_key", response.data)
        
        # Verify the mock was called correctly
        mock_s3.generate_presigned_post.assert_called_once()
        call_args = mock_s3.generate_presigned_post.call_args[1]
        self.assertIn("media/uploads/", call_args["Key"])
        self.assertIn("-test.png", call_args["Key"])
        self.assertEqual(call_args["Fields"]["Content-Type"], "image/png")
