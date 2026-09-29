"""
Standard pagination for the API.

Cursor-based pagination is used for feeds (infinite scroll).
Page-number pagination is kept for admin / simple list endpoints.

Response envelope:
    {
        "status": "ok",
        "count": 120,          # total items (page-number) or null (cursor)
        "next": "...",         # next page URL or null
        "previous": "...",     # previous page URL or null
        "results": [ ... ]
    }
"""

from __future__ import annotations

from rest_framework.pagination import CursorPagination, PageNumberPagination
from rest_framework.response import Response


class _EnvelopeMixin:
    """Mixin that wraps paginated results in the standard {status, ...} envelope."""

    def get_paginated_response(self, data) -> Response:
        return Response(
            {
                "status": "ok",
                "count": self.page.paginator.count if hasattr(self, "page") else None,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "results": data,
            }
        )

    def get_paginated_response_schema(self, schema: dict) -> dict:
        return {
            "type": "object",
            "required": ["status", "results"],
            "properties": {
                "status": {"type": "string", "example": "ok"},
                "count": {"type": "integer", "nullable": True},
                "next": {"type": "string", "format": "uri", "nullable": True},
                "previous": {"type": "string", "format": "uri", "nullable": True},
                "results": schema,
            },
        }


class StandardPageNumberPagination(_EnvelopeMixin, PageNumberPagination):
    """
    Page-number pagination for admin / list endpoints.

    Query params:
        ?page=2&page_size=20
    """

    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100
    page_query_param = "page"


class StandardCursorPagination(_EnvelopeMixin, CursorPagination):
    """
    Cursor-based pagination for feed endpoints (blog, comments, etc.).
    Stable under inserts; no total count.

    Query params:
        ?cursor=<opaque_string>&page_size=20
    """

    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 50
    ordering = "-created_at"

    def get_paginated_response(self, data) -> Response:
        return Response(
            {
                "status": "ok",
                "count": None,  # Cursor pagination has no total count
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "results": data,
            }
        )
