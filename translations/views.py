from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import generic
from django.urls import reverse_lazy
from .models import SourceText, Feature, Volume, Person, Review


class IndexView(generic.TemplateView):
    template_name = "translations/index.html"


class SourceTextDetailView(generic.DetailView):
    model = SourceText
    template_name = "translations/source_text_detail.html"

    def get_translations(self):
        return (
            Feature.objects.filter(source_text=self.get_object())
            .filter(feature="TR")
            .order_by("-volume__published_date")
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["translations"] = self.get_translations()
        return context


class SourceTextIndexView(generic.ListView):
    template_name = "translations/source_text_index.html"

    def get_queryset(self):
        return SourceText.objects.order_by(
            "author__last_name",
            "author__sole_name",
            "author__first_name",
            "author__middle_name",
            "title",
        )


class VolumeDetailView(generic.DetailView):
    model = Volume
    template_name = "translations/volume_detail.html"

    def get_features(self):
        return self.get_object().feature_set.order_by("source_text", "feature")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["features"] = self.get_features()
        return context


class VolumeIndexView(generic.ListView):
    template_name = "translations/volume_index.html"

    def get_queryset(self):
        return Volume.objects.order_by("published_date")


class AuthorIndexView(generic.ListView):
    template_name = "translations/author_index.html"

    def get_queryset(self):
        return (
            Person.objects.filter(sourcetext__title__isnull=False)
            .distinct()
            .order_by("last_name", "first_name", "sole_name")
        )


class TranslatorIndexView(generic.ListView):
    template_name = "translations/translator_index.html"

    def get_queryset(self):
        return (
            Person.objects.filter(feature__feature__exact="TR")
            .distinct()
            .order_by("last_name", "first_name", "sole_name")
        )


class PersonDetailView(generic.DetailView):
    model = Person
    template_name = "translations/person_detail.html"


class ReviewCreateView(LoginRequiredMixin, generic.edit.CreateView):
    model = Review
    fields = ["title", "content"]


class ReviewUpdateView(LoginRequiredMixin, generic.edit.UpdateView):
    model = Review
    fields = ["title", "content"]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user=self.request.user)


class ReviewDeleteView(LoginRequiredMixin, generic.edit.DeleteView):
    model = Review
    success_url = reverse_lazy("index")

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user=self.request.user)
