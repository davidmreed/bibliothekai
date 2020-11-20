from django.views import generic
from django.db.models import When, Case

from .models import SourceText, Feature, Volume, Person


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
            Person.objects.annotate(
                sort_key=Case(
                    When(sole_name="", then="last_name"),
                    When(last_name="", then="sole_name"),
                )
            )
            .filter(sourcetext__title__isnull=False)
            .distinct()
            .order_by("sort_key", "first_name", "middle_name")
        )


class TranslatorIndexView(generic.ListView):
    template_name = "translations/translator_index.html"

    def get_queryset(self):
        return (
            Person.objects.annotate(
                sort_key=Case(
                    When(sole_name="", then="last_name"),
                    When(last_name="", then="sole_name"),
                )
            )
            .filter(feature__feature__exact="TR")
            .distinct()
            .order_by("sort_key", "first_name", "middle_name")
        )


class PersonDetailView(generic.DetailView):
    model = Person
    template_name = "translations/person_detail.html"
