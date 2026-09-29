"""
API v1 URL registry.

Each domain app registers its own urls.py here under its resource prefix.
All endpoints live under /api/v1/<resource>/.
"""

from django.urls import path  # noqa: F401 – imported for future use

urlpatterns: list = [
    # App URL includes will be added here as apps are built, e.g.:
    # path("profile/", include("apps.profiles.urls")),
    # path("skills/", include("apps.skills.urls")),
    # path("education/", include("apps.resume.urls")),
    # path("posts/", include("apps.blog.urls")),
    # path("services/", include("apps.services.urls")),
    # path("contact/", include("apps.contact.urls")),
    # path("auth/", include("apps.accounts.urls")),
]
