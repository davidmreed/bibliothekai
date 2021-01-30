from django.db.models import Q
from rest_framework import permissions


class CreateChildOfUnapprovedParent(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method == "POST":
            return (
                obj.get_parent().user == request.user and not obj.get_parent().approved
            )

        return False


class IsAuthenticatedCreateOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method == "POST":
            return request.user.is_authenticated

        return False


class IsOwnerEditOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners of an object to edit it."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method == "PATCH":
            return obj.user == request.user

        return False


def filter_queryset_approval(qs, user):
    if user.is_superuser:
        return qs

    return qs.filter(Q(approved=True) | Q(user=user))


def filter_queryset_parent_approval(model, qs, user):
    if user.is_superuser:
        return qs

    parent_relationship = model.parent_relationship

    return qs.filter(
        Q(**{f"{parent_relationship}.approved": True})
        | Q(**{f"{parent_relationship}.user": user})
    )


def approval_filtered_queryset(f):
    if type(f) is type:
        # We're decorating a class.
        def filter_qs(self):
            request_user = self.request.user
            return filter_queryset_approval(super.get_queryset(), request_user)

        f.get_queryset = filter_qs
        return f
    else:
        # We're decorating a function
        def filter_qs(self):
            request_user = self.request.user
            return filter_queryset_approval(f(self), request_user)

        return filter_qs
