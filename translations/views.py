from django.views import generic

from .models import SourceText, Volume, Person


class SourceTextDetailView(generic.DetailView):
    model = SourceText
    template_name = "translations/source_text_detail.html"

    def get_volumes(self):
        return Volume.objects.filter(feature__source_text=self.get_object()).distinct()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["volumes"] = self.get_volumes()
        return context


class SourceTextIndexView(generic.ListView):
    template_name = "translations/source_text_index.html"

    def get_queryset(self):
        return SourceText.objects.order_by("author")


class VolumeDetailView(generic.DetailView):
    model = Volume
    template_name = "translations/volume_detail.html"

    def get_features(self):
        return self.get_object().feature_set.order_by("source_text").order_by("feature")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["features"] = self.get_features()
        return context


class VolumeIndexView(generic.ListView):
    template_name = "translations/volume_index.html"

    def get_queryset(self):
        return Volume.objects.order_by("published_date")


class PersonDetailView(generic.DetailView):
    model = Person
    template_name = "translations/person_detail.html"

