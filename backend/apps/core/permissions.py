from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    The request is authenticated as a user with is_staff=True, or is a read-only request.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
