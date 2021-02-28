from rest_framework.test import APIRequestFactory, force_authenticate
from django.test import TestCase

from unittest import mock
import pytest

from .views import PersonViewSet
from users.models import User


class TestPersonViewset(TestCase):
    def test_create_person(self):
        factory = APIRequestFactory()
        u = User()
        u.save()
        view = PersonViewSet.as_view({"post": "create"})
        request = factory.post("/api/persons")
        force_authenticate(request, user=u)

        response = view(request)

        assert response.status_code == 201
