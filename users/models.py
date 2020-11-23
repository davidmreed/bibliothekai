from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    profile = models.TextField(blank=True, null=True)
    display_name = models.CharField(max_length=255)
