from typing import Callable
from django.db.models import Q, QuerySet
from rest_framework import permissions
from users.models import User


class CreateChildOfUnapprovedParent(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method == "POST":
            serializer = view.get_serializer(data=request.data)

            if not serializer.is_valid():
                return True  # Let the API return a data-based error.

            parent = serializer.validated_data[
                view.serializer_class.Meta.model.parent_relationship
            ]

            return parent.user == request.user and not parent.approved

        return False


class IsAuthenticatedCreateOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method == "POST":
            return request.user.is_authenticated

        return False


class IsOwnerEditOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners of an object to edit it."""

    def has_object_permission(self, request, view, obj) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.user.is_superuser:
            return True

        if request.user.is_authenticated:
            if request.method in ["PATCH", "DELETE"]:
                return obj.user == request.user
            elif request.method == "CREATE":
                return True

        if request.method in permissions.SAFE_METHODS:
            return True

        return False


def filter_queryset_approval(qs, user: User) -> bool:
    if user.is_superuser:
        return qs

    if user.is_authenticated:
        return qs.filter(Q(approved=True) | Q(user=user))

    return qs.filter(Q(approved=True))


def filter_queryset_parent_approval(model, qs: QuerySet, user: User) -> QuerySet:
    if user.is_superuser:
        return qs

    parent_relationship = model.parent_relationship

    if user.is_authenticated:
        return qs.filter(
            Q(**{f"{parent_relationship}__approved": True})
            | Q(**{f"{parent_relationship}__user": user})
        )
    else:
        return qs.filter(Q(**{f"{parent_relationship}__approved": True}))


def approval_filtered_queryset(f: Callable[[], QuerySet]) -> Callable:
    def filter_qs(self):
        request_user = self.request.user
        return filter_queryset_approval(f(self), request_user)

    return filter_qs


class ApprovalFilteredQuerysetMixin:
    def get_queryset(self) -> QuerySet:
        if hasattr(self, "model"):
            # View class
            return filter_queryset_approval(self.model.objects.all(), self.request.user)
        else:
            # Viewset class
            return filter_queryset_approval(
                self.serializer_class.Meta.model.objects.all(), self.request.user
            )
