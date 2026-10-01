from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from .models import ContactMessage
from .serializers import ContactMessageSerializer

class ContactRateThrottle(AnonRateThrottle):
    scope = 'contact'

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ContactRateThrottle]

    def perform_create(self, serializer):
        message = serializer.save()

        # Simple email notification
        send_mail(
            subject=f"New Contact: {message.subject}",
            message=f"From: {message.name} <{message.email}>\n\n{message.message}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=True,
        )
