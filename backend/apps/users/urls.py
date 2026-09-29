from django.urls import path
from .views import CookieTokenObtainPairView, LogoutView, CurrentUserView

urlpatterns = [
    path("login/", CookieTokenObtainPairView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
]
