from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.models import CustomUser
from .models import Profile

class ProfileViewTests(APITestCase):
    def setUp(self):
        self.url = reverse("portfolio-profile")
        self.admin = CustomUser.objects.create_user(
            email="admin@hsjb.info",
            password="adminpassword",
            is_staff=True,
        )
        self.user = CustomUser.objects.create_user(
            email="user@hsjb.info",
            password="userpassword",
            is_staff=False,
        )
        
    def test_get_creates_solo_profile(self):
        self.assertEqual(Profile.objects.count(), 0)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Profile.objects.count(), 1)
        self.assertEqual(response.data["name"], "Your Name")
        self.assertEqual(response.data["headline"], "Full Stack Developer")
        
    def test_unauthenticated_put_fails(self):
        response = self.client.put(self.url, {"name": "Hacked Name"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_authenticated_non_admin_put_fails(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.put(self.url, {"name": "Hacked Name"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_admin_put_succeeds(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(
            self.url,
            {
                "name": "Jane Doe",
                "headline": "Lead Engineer",
                "short_bio": "I code.",
                "hero_image_url": "https://example.com/hero.jpg",
                "about_text": "I do stuff.",
                "about_image_url": "https://example.com/about.jpg",
                "email": "jane@hsjb.info",
                "github_url": "https://github.com",
                "linkedin_url": "https://linkedin.com",
                "twitter_url": "https://twitter.com",
                "resume_url": "https://example.com/resume.pdf",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Jane Doe")
        self.assertEqual(response.data["headline"], "Lead Engineer")
        
        # Verify in DB
        profile = Profile.objects.first()
        self.assertEqual(profile.name, "Jane Doe")
        
    def test_admin_patch_succeeds(self):
        self.client.force_authenticate(user=self.admin)
        # First ensure it exists
        self.client.get(self.url)
        
        response = self.client.patch(
            self.url,
            {"name": "Patched Name"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Patched Name")
        
        # Headline should remain unchanged
        self.assertEqual(response.data["headline"], "Full Stack Developer")

class SkillTests(APITestCase):
    def setUp(self):
        self.admin = CustomUser.objects.create_user(
            email="admin@hsjb.info",
            password="adminpassword",
            is_staff=True,
        )
        self.category_url = "/api/v1/portfolio/skill-categories/"
        self.skill_url = "/api/v1/portfolio/skills/"

    def test_admin_can_create_skill_category_and_skill(self):
        self.client.force_authenticate(user=self.admin)
        
        # Create Category
        res_cat = self.client.post(self.category_url, {"name": "Frontend", "order": 1}, format="json")
        self.assertEqual(res_cat.status_code, status.HTTP_201_CREATED)
        cat_id = res_cat.data["id"]
        
        # Create Skill
        res_skill = self.client.post(self.skill_url, {
            "name": "React",
            "proficiency": 90,
            "category": cat_id,
            "order": 1
        }, format="json")
        self.assertEqual(res_skill.status_code, status.HTTP_201_CREATED)
        
        # Verify nested serialization on category
        res_cat_get = self.client.get(f"{self.category_url}{cat_id}/")
        self.assertEqual(res_cat_get.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_cat_get.data["skills"]), 1)
        self.assertEqual(res_cat_get.data["skills"][0]["name"], "React")


class ServiceTests(APITestCase):
    def setUp(self):
        self.admin = CustomUser.objects.create_user(
            email="admin@hsjb.info",
            password="adminpassword",
            is_staff=True,
        )
        self.service_url = "/api/v1/portfolio/services/"

    def test_admin_can_create_service(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post(self.service_url, {
            "title": "Web Development",
            "description": "Building cool websites.",
            "price_range": "$100/hr",
            "is_active": True
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["title"], "Web Development")

    def test_public_can_read_service(self):
        from .models import Service
        Service.objects.create(title="SEO", description="Search Engine Optimization", is_active=True)
        res = self.client.get(self.service_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["title"], "SEO")
