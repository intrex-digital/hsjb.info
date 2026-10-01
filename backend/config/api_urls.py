"""
API v1 URL registry.

Each domain app registers its own urls.py here under its resource prefix.
All endpoints live under /api/v1/<resource>/.
"""

from django.urls import include, path

urlpatterns: list = [
    path("core/", include("apps.core.urls")),
    # App URL includes will be added here as apps are built, e.g.:
    # path("profile/", include("apps.profiles.urls")),
    # path("skills/", include("apps.skills.urls")),
    path("resume/", include("apps.resume.urls")),
    path("blog/", include("apps.blog.urls")),
    path("contact/", include("apps.contact.urls")),
    path("portfolio/", include("apps.portfolio.urls")),
    path("auth/", include("apps.users.urls")),
]
