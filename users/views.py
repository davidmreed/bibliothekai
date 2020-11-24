from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import generic
from django.urls import reverse_lazy

from .models import User


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
