"""
Standard API error format and exception handler for DRF.

All errors are returned in the shape:
    {
        "status": "error",
        "code": "validation_error",        # machine-readable slug
        "message": "Human-readable message",
        "detail": { ... } | [...] | null   # extra data (field errors, etc.)
    }
"""

from __future__ import annotations

import logging
from typing import Any

from django.core.exceptions import PermissionDenied
from django.http import Http404
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler

logger = logging.getLogger(__name__)


def _error_code(exc: Exception) -> str:
    """Derive a snake_case error code from the exception class name."""
    if isinstance(exc, Http404):
        return "not_found"
    if isinstance(exc, PermissionDenied):
        return "permission_denied"
    name = type(exc).__name__
    # e.g. ValidationError → validation_error
    import re
    return re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()


def api_exception_handler(exc: Exception, context: dict[str, Any]) -> Response | None:
    """
    Custom DRF exception handler.

    Converts all DRF exceptions (and Django 404/403) into the standard envelope:
        {status, code, message, detail}
    """
    # Let DRF handle the response first (sets status code, WWW-Authenticate, etc.)
    response = drf_exception_handler(exc, context)

    if response is None:
        # Unhandled exception — let Django's 500 machinery deal with it.
        logger.exception("Unhandled exception in API view", exc_info=exc)
        return None

    code = _error_code(exc)

    if isinstance(exc, APIException):
        message = exc.default_detail if isinstance(exc.detail, list | dict) else str(exc.detail)
        detail = exc.detail
    elif isinstance(exc, Http404):
        message = "Not found."
        detail = None
    elif isinstance(exc, PermissionDenied):
        message = "You do not have permission to perform this action."
        detail = None
    else:
        message = str(exc)
        detail = None

    response.data = {
        "status": "error",
        "code": code,
        "message": message,
        "detail": detail,
    }
    return response
