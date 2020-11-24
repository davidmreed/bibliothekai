from django.urls import path
from . import views

urlpatterns = (
    path("user/profile/update/", views.UserUpdateView.as_view(), name="user_update",),
)
