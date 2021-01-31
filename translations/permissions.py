from django.db.models import Q
from rest_framework import permissions


class CreateChildOfUnapprovedParent(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method == "POST":
            serializer = view.get_serializer(data=request.data)

            if serializer.is_valid():
                parent = serializer.validated_data[
                    view.serializer_class.Meta.model.parent_relationship
                ]

                return parent.user == request.user and not parent.approved

        return False


class IsAuthenticatedCreateOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
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

        if request.method == "PATCH" and request.user.is_authenticated:
            return obj.user == request.user

        return False

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return False


def filter_queryset_approval(qs, user):
    if user.is_superuser:
        return qs

    if user.is_authenticated:
        return qs.filter(Q(approved=True) | Q(user=user))

    return qs.filter(Q(approved=True))


def filter_queryset_parent_approval(model, qs, user):
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


def approval_filtered_queryset(f):
    def filter_qs(self):
        request_user = self.request.user
        return filter_queryset_approval(f(self), request_user)

    return filter_qs


class ApprovalFilteredQuerysetMixin:
    def get_queryset(self):
        if hasattr(self, "model"):
            # View class
            return filter_queryset_approval(self.model.objects.all(), self.request.user)
        else:
            # Viewset class
            return filter_queryset_approval(
                self.serializer_class.Meta.model.objects.all(), self.request.user
            )
