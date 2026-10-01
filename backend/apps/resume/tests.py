from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.models import CustomUser
from .models import Education, Training, Certification, IndustrialProject, TrainingProject

class ResumeTests(APITestCase):
    def setUp(self):
        self.admin = CustomUser.objects.create_user(
            email="admin@hsjb.info",
            password="adminpassword",
            is_staff=True,
        )
        self.education_url = "/api/v1/resume/education/"
        self.training_url = "/api/v1/resume/training/"
        self.certification_url = "/api/v1/resume/certifications/"
        self.industrial_project_url = "/api/v1/resume/industrial-projects/"
        self.training_project_url = "/api/v1/resume/training-projects/"

    # Education Tests
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

    # Training Tests
    def test_admin_can_create_training(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post(self.training_url, {
            "title": "Advanced Kubernetes",
            "institution": "Cloud Institute",
            "start_date": "2023-01-01",
            "end_date": "2023-03-01",
            "is_current": False,
            "description": "Production cluster orchestration."
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Training.objects.count(), 1)

    def test_public_can_read_training(self):
        Training.objects.create(title="Systems Design", institution="Academy")
        res = self.client.get(self.training_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

    # Certification Tests
    def test_admin_can_create_certification(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post(self.certification_url, {
            "name": "AWS Certified Solutions Architect",
            "issuer": "Amazon Web Services",
            "issue_date": "2023-08-01",
            "credential_id": "AWS-12345",
            "credential_url": "https://aws.amazon.com/verify"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Certification.objects.count(), 1)

    def test_public_can_read_certifications(self):
        Certification.objects.create(name="CKA", issuer="Linux Foundation")
        res = self.client.get(self.certification_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

    # Industrial Project Tests
    def test_admin_can_create_industrial_project(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post(self.industrial_project_url, {
            "title": "FinTech Gateway",
            "role": "Lead Architect",
            "company": "PayTech",
            "start_date": "2022-01-01",
            "description": "High throughput payment gateway.",
            "technologies": "Django, Postgres, Redis"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(IndustrialProject.objects.count(), 1)

    def test_public_can_read_industrial_projects(self):
        IndustrialProject.objects.create(title="Project Alpha", role="Lead", company="Acme")
        res = self.client.get(self.industrial_project_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

    # Training Project Tests
    def test_admin_can_create_training_project(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post(self.training_project_url, {
            "title": "React Masterclass",
            "role": "Instructor",
            "institution": "Dev Academy",
            "description": "Taught React & TypeScript to 50 engineers.",
            "technologies": "React, TypeScript"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TrainingProject.objects.count(), 1)

    def test_public_can_read_training_projects(self):
        TrainingProject.objects.create(title="Bootcamp", role="Trainer", institution="Enterprise")
        res = self.client.get(self.training_project_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
