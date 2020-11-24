from django.contrib.auth import get_user_model
from django import forms


class SignupForm(forms.ModelForm):
    class Meta:
        model = get_user_model()
        fields = ["display_name", "profile"]

    def signup(self, request, user):
        user.display_name = self.cleaned_data["display_name"]
        user.profile = self.cleaned_data["profile"]
        user.save()
