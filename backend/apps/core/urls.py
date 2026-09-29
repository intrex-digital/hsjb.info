from django.urls import path
from .views import PresignedUploadView

urlpatterns = [
    path("upload/presigned/", PresignedUploadView.as_view(), name="presigned-upload"),
]
