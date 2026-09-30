from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.models import CustomUser
from .models import Education, Training, Certification

class ResumeTests(APITestCase):
    def setUp(self):
        self.admin = CustomUser.objects.create_user(
            email="admin@hsjb.info",
            password="adminpassword",
            is_staff=True,
        )
        self.education_url = "/api/v1/resume/education/"

    def test_admin_can_create_education(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post(self.education_url, {
            "degree": "B.Sc Computer Science",
            "institution": "University",
            "location": "City",
            "start_date": "2015-09-01",
            "end_date": "2019-06-01",
            "is_current": False,
            "description": "Learned a lot."
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Education.objects.count(), 1)
        self.assertEqual(res.data["degree"], "B.Sc Computer Science")

    def test_public_can_read_education(self):
        Education.objects.create(degree="Test Degree", institution="Test Inst")
        res = self.client.get(self.education_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["degree"], "Test Degree")

    def test_public_cannot_create_education(self):
        res = self.client.post(self.education_url, {
            "degree": "B.Sc Computer Science",
            "institution": "University"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
