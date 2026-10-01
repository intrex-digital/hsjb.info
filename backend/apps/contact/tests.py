from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from .models import ContactMessage

class ContactApiTests(APITestCase):
    def test_submit_contact_message(self):
        url = reverse("contact-list")
        data = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Hello",
            "message": "This is a test message."
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(ContactMessage.objects.first().email, "john@example.com")

    def test_validation_errors(self):
        url = reverse("contact-list")
        data = {
            "name": "",
            "email": "invalid-email",
            "subject": "",
            "message": ""
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data["detail"])
        self.assertIn("email", response.data["detail"])
