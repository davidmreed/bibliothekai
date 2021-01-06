from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import generic
from django.urls import reverse_lazy
from rest_framework import viewsets

from .models import User
from .serializers import UserSerializer


class UserUpdateView(LoginRequiredMixin, generic.edit.UpdateView):
    model = User
    fields = [
        "display_name",
        "profile",
    ]
    template_name = "translations/user_update.html"
    success_url = reverse_lazy("index")

    def get_object(self):
        return User.objects.get(id=self.request.user.id)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
