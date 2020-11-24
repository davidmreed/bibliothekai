from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


class UserAdmin(BaseUserAdmin):
    list_display = ["email", "display_name", "is_active", "is_staff", "is_superuser"]


admin.site.register(User, UserAdmin)
