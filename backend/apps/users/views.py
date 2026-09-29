from django.conf import settings
from rest_framework import status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomUser


class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", "first_name", "last_name", "bio", "avatar_url", "is_staff", "is_superuser"]



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Customizes the JWT payload if needed.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token["email"] = user.email
        token["is_staff"] = user.is_staff
        return token


class CookieTokenObtainPairView(TokenObtainPairView):
    """
    Extends SimpleJWT's login view to return the tokens in httpOnly cookies
    instead of the JSON response body.
    """
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == status.HTTP_200_OK:
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")
            
            # Remove tokens from the JSON response
            del response.data["access"]
            del response.data["refresh"]
            
            response.data["message"] = "Successfully logged in."
            response.data["status"] = "ok"

            # Set access token cookie
            response.set_cookie(
                key="access",
                value=access_token,
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds(),
                httponly=True,
                samesite="Lax",
                secure=not settings.DEBUG,
            )
            
            # Set refresh token cookie
            response.set_cookie(
                key="refresh",
                value=refresh_token,
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds(),
                httponly=True,
                samesite="Lax",
                secure=not settings.DEBUG,
            )
            
        return response


class LogoutView(APIView):
    """
    Clears the JWT cookies and blacklists the refresh token if provided.
    Open to all — even unauthenticated clients must be able to clear stale cookies.
    """
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        response = Response({"status": "ok", "message": "Successfully logged out."}, status=status.HTTP_200_OK)
        
        # Optionally blacklist the refresh token
        refresh_token = request.COOKIES.get("refresh")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                # If it's already blacklisted or invalid, just ignore and clear cookies anyway
                pass
                
        # Clear cookies
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        
        return response


class CurrentUserView(APIView):
    """
    Returns the currently authenticated user's profile data.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
