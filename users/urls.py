from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"users", views.UserViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path(
        "user/profile/update/",
        views.UserUpdateView.as_view(),
        name="user_update",
    ),
]
