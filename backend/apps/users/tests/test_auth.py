"""
Comprehensive authentication endpoint tests.

Covers:
  - Login: success, bad credentials, inactive user, missing fields
  - Cookie security attributes
  - Cookie-based auth on protected endpoints
  - /me endpoint: success, field contents, unauthenticated
  - Logout: cookie clearing, response body
  - Token blacklist after logout
  - Standard error envelope format on auth failures
"""

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.users.models import CustomUser


class TestLoginEndpoint(APITestCase):
    """POST /api/v1/auth/login/"""

    def setUp(self):
        self.url = reverse("login")
        self.user = CustomUser.objects.create_user(
            email="user@hsjb.info",
            password="StrongPass1!",
            first_name="Test",
            last_name="User",
        )

    # ── Happy path ────────────────────────────────────────────────────────────

    def test_success_returns_200(self):
        r = self.client.post(
            self.url, {"email": "user@hsjb.info", "password": "StrongPass1!"}, format="json"
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_success_response_envelope(self):
        r = self.client.post(
            self.url, {"email": "user@hsjb.info", "password": "StrongPass1!"}, format="json"
        )
        self.assertEqual(r.data["status"], "ok")
        self.assertEqual(r.data["message"], "Successfully logged in.")

    def test_tokens_not_in_response_body(self):
        """JWT tokens must NOT appear in the JSON body (security requirement)."""
        r = self.client.post(
            self.url, {"email": "user@hsjb.info", "password": "StrongPass1!"}, format="json"
        )
        self.assertNotIn("access", r.data)
        self.assertNotIn("refresh", r.data)

    def test_access_cookie_set(self):
        r = self.client.post(
            self.url, {"email": "user@hsjb.info", "password": "StrongPass1!"}, format="json"
        )
        self.assertIn("access", r.cookies)

    def test_refresh_cookie_set(self):
        r = self.client.post(
            self.url, {"email": "user@hsjb.info", "password": "StrongPass1!"}, format="json"
        )
        self.assertIn("refresh", r.cookies)

    def test_access_cookie_is_httponly(self):
        r = self.client.post(
            self.url, {"email": "user@hsjb.info", "password": "StrongPass1!"}, format="json"
        )
        self.assertTrue(r.cookies["access"]["httponly"])

    def test_refresh_cookie_is_httponly(self):
        r = self.client.post(
            self.url, {"email": "user@hsjb.info", "password": "StrongPass1!"}, format="json"
        )
        self.assertTrue(r.cookies["refresh"]["httponly"])

    def test_cookies_samesite_lax(self):
        r = self.client.post(
            self.url, {"email": "user@hsjb.info", "password": "StrongPass1!"}, format="json"
        )
        self.assertEqual(r.cookies["access"]["samesite"], "Lax")
        self.assertEqual(r.cookies["refresh"]["samesite"], "Lax")

    def test_jwt_payload_contains_email(self):
        """Custom claim: email is embedded in the token payload."""
        import base64, json
        r = self.client.post(
            self.url, {"email": "user@hsjb.info", "password": "StrongPass1!"}, format="json"
        )
        token = r.cookies["access"].value
        # Decode without verification — we just want to inspect claims
        payload_b64 = token.split(".")[1]
        # Pad to multiple of 4
        payload_b64 += "=" * (-len(payload_b64) % 4)
        payload = json.loads(base64.b64decode(payload_b64))
        self.assertEqual(payload["email"], "user@hsjb.info")

    # ── Failure paths ─────────────────────────────────────────────────────────

    def test_wrong_password_returns_401(self):
        r = self.client.post(
            self.url, {"email": "user@hsjb.info", "password": "wrongpassword"}, format="json"
        )
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_nonexistent_email_returns_401(self):
        r = self.client.post(
            self.url, {"email": "nobody@hsjb.info", "password": "StrongPass1!"}, format="json"
        )
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_missing_email_returns_400(self):
        r = self.client.post(self.url, {"password": "StrongPass1!"}, format="json")
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_password_returns_400(self):
        r = self.client.post(self.url, {"email": "user@hsjb.info"}, format="json")
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_inactive_user_cannot_login(self):
        self.user.is_active = False
        self.user.save()
        r = self.client.post(
            self.url, {"email": "user@hsjb.info", "password": "StrongPass1!"}, format="json"
        )
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn("access", r.cookies)

    def test_no_cookies_set_on_failure(self):
        r = self.client.post(
            self.url, {"email": "user@hsjb.info", "password": "wrong"}, format="json"
        )
        self.assertNotIn("access", r.cookies)
        self.assertNotIn("refresh", r.cookies)

    def test_error_response_uses_standard_envelope(self):
        r = self.client.post(
            self.url, {"email": "user@hsjb.info", "password": "wrong"}, format="json"
        )
        self.assertEqual(r.data["status"], "error")
        self.assertIn("code", r.data)
        self.assertIn("message", r.data)


class TestCurrentUserEndpoint(APITestCase):
    """GET /api/v1/auth/me/"""

    def setUp(self):
        self.url = reverse("current-user")
        self.user = CustomUser.objects.create_user(
            email="me@hsjb.info",
            password="StrongPass1!",
            first_name="Jane",
            last_name="Doe",
        )

    def test_authenticated_returns_200(self):
        self.client.force_authenticate(user=self.user)
        r = self.client.get(self.url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_returns_correct_email(self):
        self.client.force_authenticate(user=self.user)
        r = self.client.get(self.url)
        self.assertEqual(r.data["email"], "me@hsjb.info")

    def test_returns_name_fields(self):
        self.client.force_authenticate(user=self.user)
        r = self.client.get(self.url)
        self.assertEqual(r.data["first_name"], "Jane")
        self.assertEqual(r.data["last_name"], "Doe")

    def test_non_staff_user_is_not_staff(self):
        self.client.force_authenticate(user=self.user)
        r = self.client.get(self.url)
        self.assertFalse(r.data["is_staff"])
        self.assertFalse(r.data["is_superuser"])

    def test_staff_user_flagged_correctly(self):
        staff = CustomUser.objects.create_user(
            email="staff@hsjb.info", password="test", is_staff=True
        )
        self.client.force_authenticate(user=staff)
        r = self.client.get(self.url)
        self.assertTrue(r.data["is_staff"])

    def test_unauthenticated_returns_401(self):
        r = self.client.get(self.url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_password_not_in_response(self):
        self.client.force_authenticate(user=self.user)
        r = self.client.get(self.url)
        self.assertNotIn("password", r.data)

    def test_via_cookie_authentication(self):
        """Verify the full cookie-based auth flow with a real token."""
        login_r = self.client.post(
            reverse("login"),
            {"email": "me@hsjb.info", "password": "StrongPass1!"},
            format="json",
        )
        self.client.cookies["access"] = login_r.cookies["access"].value
        r = self.client.get(self.url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data["email"], "me@hsjb.info")


class TestLogoutEndpoint(APITestCase):
    """POST /api/v1/auth/logout/"""

    def setUp(self):
        self.login_url = reverse("login")
        self.logout_url = reverse("logout")
        self.me_url = reverse("current-user")
        self.user = CustomUser.objects.create_user(
            email="logout@hsjb.info", password="StrongPass1!"
        )

    def _login(self):
        r = self.client.post(
            self.login_url,
            {"email": "logout@hsjb.info", "password": "StrongPass1!"},
            format="json",
        )
        self.client.cookies["access"] = r.cookies["access"].value
        self.client.cookies["refresh"] = r.cookies["refresh"].value
        return r

    def test_logout_returns_200(self):
        self._login()
        r = self.client.post(self.logout_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_logout_response_envelope(self):
        self._login()
        r = self.client.post(self.logout_url)
        self.assertEqual(r.data["status"], "ok")
        self.assertEqual(r.data["message"], "Successfully logged out.")

    def test_logout_clears_access_cookie(self):
        self._login()
        r = self.client.post(self.logout_url)
        self.assertIn("access", r.cookies)
        self.assertEqual(r.cookies["access"].value, "")

    def test_logout_clears_refresh_cookie(self):
        self._login()
        r = self.client.post(self.logout_url)
        self.assertIn("refresh", r.cookies)
        self.assertEqual(r.cookies["refresh"].value, "")

    def test_logout_without_cookie_still_returns_200(self):
        """Logout must be idempotent; clients without cookies should get 200."""
        r = self.client.post(self.logout_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_token_blacklisted_after_logout(self):
        """After logout the refresh token must be in the blacklist DB table."""
        from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
        self._login()
        self.client.post(self.logout_url)
        self.assertTrue(BlacklistedToken.objects.exists())

    def test_me_returns_401_after_logout(self):
        """Accessing /me after logout (with cleared cookies) must return 401."""
        self._login()
        self.client.post(self.logout_url)
        # Clear cookies to simulate the browser dropping them
        self.client.cookies.clear()
        r = self.client.get(self.me_url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)
