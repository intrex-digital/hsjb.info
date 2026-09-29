"""
Tests for apps.core.exceptions and apps.core.pagination.
"""

import pytest
from django.test import RequestFactory
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework.request import Request

from apps.core.exceptions import api_exception_handler
from apps.core.pagination import StandardCursorPagination, StandardPageNumberPagination


# ─────────────────────────────────────────────────────────────────────────────
# Exception handler
# ─────────────────────────────────────────────────────────────────────────────


def make_context():
    factory = RequestFactory()
    drf_request = Request(factory.get("/api/test/"))
    return {"request": drf_request, "view": None}


class TestApiExceptionHandler:
    def test_not_found_shape(self):
        exc = NotFound()
        response = api_exception_handler(exc, make_context())
        assert response is not None
        assert response.status_code == status.HTTP_404_NOT_FOUND
        data = response.data
        assert data["status"] == "error"
        assert data["code"] == "not_found"
        assert isinstance(data["message"], str)

    def test_permission_denied_shape(self):
        exc = PermissionDenied()
        response = api_exception_handler(exc, make_context())
        assert response is not None
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data["status"] == "error"
        assert response.data["code"] == "permission_denied"

    def test_validation_error_shape(self):
        exc = ValidationError({"email": ["Enter a valid email address."]})
        response = api_exception_handler(exc, make_context())
        assert response is not None
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        data = response.data
        assert data["status"] == "error"
        assert data["code"] == "validation_error"
        assert "detail" in data
        assert "email" in data["detail"]

    def test_unhandled_exception_returns_none(self):
        exc = RuntimeError("boom")
        response = api_exception_handler(exc, make_context())
        assert response is None


# ─────────────────────────────────────────────────────────────────────────────
# Pagination
# ─────────────────────────────────────────────────────────────────────────────


class TestPaginationClasses:
    def test_page_number_pagination_defaults(self):
        p = StandardPageNumberPagination()
        assert p.page_size == 20
        assert p.max_page_size == 100
        assert p.page_size_query_param == "page_size"

    def test_cursor_pagination_defaults(self):
        p = StandardCursorPagination()
        assert p.page_size == 20
        assert p.max_page_size == 50
        assert p.ordering == "-created_at"
