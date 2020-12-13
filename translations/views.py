from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.views import generic
from django.urls import reverse, reverse_lazy


from .models import SourceText, Feature, Volume, Person, Review, PublishedReview
from users.models import User


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
    paginate_by = 10

    def get_queryset(self):
        return (
            Person.objects.prefetch_related("sourcetext_set")
            .filter(sourcetext__title__isnull=False)
            .distinct()
        )


class VolumeDetailView(generic.DetailView):
    model = Volume
    template_name = "translations/volume_detail.html"

    def get_features(self):
        return self.get_object().feature_set.order_by("source_text", "feature")

    def get_reviews(self):
        return self.get_object().review_set.order_by("-date_created").all()[:5]

    def get_published_reviews(self):
        return self.get_object().publishedreview_set.all()[:5]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["features"] = self.get_features()
        context["reviews"] = self.get_reviews()
        context["publishedreviews"] = self.get_published_reviews()
        return context


class VolumeIndexView(generic.ListView):
    template_name = "translations/volume_index.html"

    def get_queryset(self):
        return Volume.objects.order_by("published_date")


class AuthorIndexView(generic.ListView):
    template_name = "translations/author_index.html"
    paginate_by = 20

    def get_queryset(self):
        return Person.objects.filter(sourcetext__title__isnull=False).distinct()


class TranslatorIndexView(generic.ListView):
    template_name = "translations/translator_index.html"
    paginate_by = 20

    def get_queryset(self):
        return Person.objects.filter(feature__feature__exact="TR").distinct()


class ReviewIndexView(generic.ListView):
    model = Review
    template_name = "translations/review_list.html"
    paginate_by = 10

    def get_volume(self):
        volume_id = self.kwargs["vol"]
        return get_object_or_404(Volume, pk=volume_id)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["volume"] = self.get_volume()
        return context

    def get_queryset(self):
        return Review.objects.filter(volume=self.get_volume())


class PublishedReviewIndexView(generic.ListView):
    model = PublishedReview
    template_name = "translations/publishedreview_list.html"
    paginate_by = 10

    def get_volume(self):
        volume_id = self.kwargs["vol"]
        return get_object_or_404(Volume, pk=volume_id)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["volume"] = self.get_volume()
        return context

    def get_queryset(self):
        return PublishedReview.objects.filter(volumes=self.get_volume())


class PersonDetailView(generic.DetailView):
    model = Person
    template_name = "translations/person_detail.html"


class UserDetailView(generic.DetailView):
    model = User
    template_name = "translations/user_detail.html"


class UserReviewDetailView(generic.DetailView):
    model = Review
    template_name = "translations/user_review_detail.html"


class PublishedReviewDetailView(generic.DetailView):
    model = PublishedReview
    template_name = "translations/published_review_detail.html"


class ReviewCreateView(LoginRequiredMixin, generic.edit.CreateView):
    model = Review
    fields = [
        "title",
        "closeness_rating",
        "readability_rating",
        "recommended",
        "content",
    ]

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.user = self.request.user
        pk = self.kwargs["vol"]
        volume = get_object_or_404(Volume, pk=pk)  # FIXME: This doesn't work
        self.object.volume_id = volume.id
        self.object.save()
        return HttpResponseRedirect(reverse("volume_detail", kwargs={"pk": volume.id}))


class ReviewUpdateView(LoginRequiredMixin, generic.edit.UpdateView):
    model = Review
    fields = [
        "title",
        "closeness_rating",
        "readability_rating",
        "recommended",
        "content",
    ]
    success_url = reverse_lazy("index")  # TODO: redirect back to the Volume

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user=self.request.user)


class ReviewDeleteView(LoginRequiredMixin, generic.edit.DeleteView):
    model = Review
    success_url = reverse_lazy("index")

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user=self.request.user)


class SearchView(generic.TemplateView):
    template_name = "translations/search.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        user_query = self.request.GET.get("query")
        query = SearchQuery(user_query)  # , search_type="websearch")

        person_vector = SearchVector("sort_name", weight="A") + SearchVector(
            "description", weight="C"
        )

        persons = (
            Person.objects.annotate(rank=SearchRank(person_vector, query))
            .order_by("-rank")
            .filter(search=query)
        )

        volume_vector = (
            SearchVector("title", weight="A")
            + SearchVector("isbn", weight="A")
            + SearchVector("series__name", weight="B")
            + SearchVector("publisher__name", weight="B")
            + SearchVector("description", weight="B")
        )

        volumes = (
            Volume.objects.annotate(rank=SearchRank(volume_vector, query))
            .order_by("-rank")
            .filter(search=query)
        )

        source_text_vector = (
            SearchVector("title", weight="A")
            + SearchVector("original_language_title", weight="A")
            + SearchVector("author__sort_name", weight="A")
            + SearchVector("description", weight="B")
            + SearchVector("language", weight="C")
        )

        source_texts = (
            SourceText.objects.annotate(rank=SearchRank(source_text_vector, query))
            .order_by("-rank")
            .filter(search=query)
        )

        context["persons"] = persons
        context["volumes"] = volumes
        context["source_texts"] = source_texts

        return context
