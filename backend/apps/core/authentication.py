from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed


class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class that reads the JWT access token from an httpOnly cookie
    as well as the standard Authorization header.
    """

    def authenticate(self, request):
        # Try to get the token from the cookie first
        raw_token = request.COOKIES.get("access")

        if raw_token is None:
            # Fall back to standard header authentication
            return super().authenticate(request)

        try:
            validated_token = self.get_validated_token(raw_token)
        except AuthenticationFailed:
            # If the cookie token is invalid/expired, we might want to clear it or just let it fail
            return None

        return self.get_user(validated_token), validated_token
