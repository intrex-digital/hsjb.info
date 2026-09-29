"""
Tests for the CustomUser model and UserManager.
"""

import pytest
from django.utils import timezone
from apps.users.models import CustomUser


@pytest.mark.django_db
class TestCustomUserModel:
    def test_create_user_basic(self):
        user = CustomUser.objects.create_user(
            email="alice@hsjb.info",
            password="SecurePass1!",
        )
        assert user.email == "alice@hsjb.info"
        assert user.is_active is True
        assert user.is_staff is False
        assert user.is_superuser is False

    def test_create_user_normalises_email(self):
        user = CustomUser.objects.create_user(
            email="Alice@HSJB.INFO",
            password="SecurePass1!",
        )
        # Django's normalise_email lowercases the domain part only
        assert user.email == "Alice@hsjb.info"

    def test_create_user_requires_email(self):
        with pytest.raises(ValueError, match="Email is required"):
            CustomUser.objects.create_user(email="", password="test")

    def test_password_is_hashed(self):
        user = CustomUser.objects.create_user(email="bob@hsjb.info", password="plain")
        assert user.password != "plain"
        assert user.check_password("plain") is True

    def test_create_superuser(self):
        su = CustomUser.objects.create_superuser(
            email="admin@hsjb.info",
            password="AdminPass1!",
        )
        assert su.is_staff is True
        assert su.is_superuser is True
        assert su.is_active is True

    def test_create_superuser_rejects_non_staff(self):
        with pytest.raises(ValueError):
            CustomUser.objects.create_superuser(
                email="admin2@hsjb.info",
                password="AdminPass1!",
                is_staff=False,
            )

    def test_create_superuser_rejects_non_superuser(self):
        with pytest.raises(ValueError):
            CustomUser.objects.create_superuser(
                email="admin3@hsjb.info",
                password="AdminPass1!",
                is_superuser=False,
            )

    def test_full_name_property(self):
        user = CustomUser.objects.create_user(
            email="carol@hsjb.info",
            password="test",
            first_name="Carol",
            last_name="Smith",
        )
        assert user.full_name == "Carol Smith"

    def test_full_name_falls_back_to_email(self):
        user = CustomUser.objects.create_user(email="dan@hsjb.info", password="test")
        assert user.full_name == "dan@hsjb.info"

    def test_str_returns_email(self):
        user = CustomUser.objects.create_user(email="eve@hsjb.info", password="test")
        assert str(user) == "eve@hsjb.info"

    def test_username_field_is_email(self):
        assert CustomUser.USERNAME_FIELD == "email"

    def test_required_fields_empty(self):
        # REQUIRED_FIELDS is used by createsuperuser CLI, should not include email
        assert CustomUser.REQUIRED_FIELDS == []

    def test_date_joined_set_on_creation(self):
        before = timezone.now()
        user = CustomUser.objects.create_user(email="frank@hsjb.info", password="test")
        after = timezone.now()
        assert before <= user.date_joined <= after

    def test_password_changed_at_null_by_default(self):
        user = CustomUser.objects.create_user(email="grace@hsjb.info", password="test")
        assert user.password_changed_at is None
