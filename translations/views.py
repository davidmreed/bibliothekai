from django.db.models import Prefetch, Q
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from django.http import HttpResponseRedirect, Http404
from django.views import generic
from django.urls import reverse, reverse_lazy
from rest_framework import viewsets
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly
from .models import (
    SourceText,
    Feature,
    Volume,
    Person,
    Review,
    PublishedReview,
    Publisher,
    Series,
    Language,
    UserSubmission,
    Link,
    AlternateName,
)
from .serializers import (
    PersonSerializer,
    SourceTextSerializer,
    LanguageSerializer,
    PublisherSerializer,
    SeriesSerializer,
    VolumeSerializer,
    FeatureSerializer,
    ReviewSerializer,
    PublishedReviewSerializer,
    LinkSerializer,
    AlternateNameSerializer,
)

from users.models import User
from .permissions import (
    approval_filtered_queryset,
    filter_queryset_approval,
    filter_queryset_parent_approval,
    CreateChildOfUnapprovedParent,
    IsAuthenticatedCreateOrReadOnly,
    IsOwnerEditOrReadOnly,
    ApprovalFilteredQuerysetMixin,
)


class IndexView(generic.TemplateView):
    template_name = "translations/index.html"


class AboutView(generic.TemplateView):
    template_name = "translations/about.html"


class PublishedReviewLWCView(LoginRequiredMixin, generic.TemplateView):
    template_name = "lwc/add_published_review.html"


class VolumeLWCView(LoginRequiredMixin, generic.TemplateView):
    template_name = "lwc/add_volume.html"


class TranslationComparisonsView(generic.TemplateView):
    template_name = "lwc/compare_translations.html"


class SourceTextDetailView(ApprovalFilteredQuerysetMixin, generic.DetailView):
    model = SourceText
    template_name = "translations/source_text_detail.html"

    def get_translations(self):
        return filter_queryset_parent_approval(
            Feature,
            Feature.objects.filter(source_text=self.get_object())
            .filter(feature="TR")
            .order_by("-volume__published_date"),
            self.request.user,
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["translations"] = self.get_translations()
        return context


class SourceTextIndexView(generic.ListView):
    template_name = "translations/source_text_index.html"
    paginate_by = 20

    @approval_filtered_queryset
    def get_queryset(self):
        return (
            Person.objects.prefetch_related(
                Prefetch(
                    "source_texts",
                    queryset=filter_queryset_approval(
                        SourceText.objects.all(), self.request.user
                    ),
                )
            )
            .filter(source_texts__title__isnull=False)
            .distinct()
        )


class VolumeDetailView(ApprovalFilteredQuerysetMixin, generic.DetailView):
    model = Volume
    template_name = "translations/volume_detail.html"

    # No filter necessary (approval is at volume level)
    def get_features(self):
        return self.get_object().features.order_by("source_text", "feature")

    # No filter necessary (user reviews are not approved)
    def get_reviews(self):
        return self.get_object().reviews.order_by("-date_created").all()[:5]

    def get_published_reviews(self):
        return filter_queryset_approval(
            self.get_object().published_reviews.all(), self.request.user
        )[:5]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["features"] = self.get_features()
        context["reviews"] = self.get_reviews()
        context["publishedreviews"] = self.get_published_reviews()
        return context


class VolumeIndexView(generic.ListView):
    template_name = "translations/volume_index.html"

    @approval_filtered_queryset
    def get_queryset(self):
        return Volume.objects.order_by("published_date")


class AuthorIndexView(generic.ListView):
    template_name = "translations/author_index.html"
    paginate_by = 50

    @approval_filtered_queryset
    def get_queryset(self):
        return Person.objects.filter(
            Q(source_texts__title__isnull=False) & Q(source_texts__approved=True)
        ).distinct()


class TranslatorIndexView(generic.ListView):
    template_name = "translations/translator_index.html"
    paginate_by = 50

    @approval_filtered_queryset
    def get_queryset(self):
        return Person.objects.filter(
            Q(features__feature__exact="TR") & Q(features__volume__approved=True)
        ).distinct()


class ReviewIndexView(generic.ListView):
    model = Review
    template_name = "translations/review_list.html"
    paginate_by = 10

    def get_volume(self):
        volume_id = self.kwargs["vol"]
        volume = filter_queryset_approval(
            Volume.objects.filter(id=volume_id), self.request.user
        ).first()
        if not volume:
            raise Http404

        return volume

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["volume"] = self.get_volume()
        return context

    # No filter necessary (user reviews are not approved)
    def get_queryset(self):
        return Review.objects.filter(volume=self.get_volume())


class PublishedReviewIndexView(generic.ListView):
    model = PublishedReview
    template_name = "translations/publishedreview_list.html"
    paginate_by = 10

    def get_volume(self):
        volume_id = self.kwargs["vol"]
        volume = filter_queryset_approval(
            Volume.objects.filter(id=volume_id), self.request.user
        ).first()
        if not volume:
            raise Http404

        return volume

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["volume"] = self.get_volume()
        return context

    @approval_filtered_queryset
    def get_queryset(self):
        return PublishedReview.objects.filter(volumes=self.get_volume())


class PersonDetailView(ApprovalFilteredQuerysetMixin, generic.DetailView):
    model = Person
    template_name = "translations/person_detail.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["translations"] = self.get_translations()
        context["sourcetexts"] = self.get_sourcetexts()
        context["publishedreviews"] = self.get_publishedreviews()
        return context

    def get_translations(self):
        return filter_queryset_parent_approval(
            Feature,
            self.get_object().features.filter(feature="TR"),
            self.request.user,
        )

    @approval_filtered_queryset
    def get_publishedreviews(self):
        return self.get_object().published_reviews.all()

    @approval_filtered_queryset
    def get_sourcetexts(self):
        return self.get_object().source_texts.all()


class UserDetailView(generic.DetailView):
    model = User
    template_name = "translations/user_detail.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["reviews"] = self.get_reviews()
        return context

    def get_reviews(self):
        return filter_queryset_parent_approval(
            Review, self.get_object().review_set.all(), self.request.user
        )


class UserReviewDetailView(generic.DetailView):
    model = Review
    template_name = "translations/user_review_detail.html"


class PublishedReviewDetailView(ApprovalFilteredQuerysetMixin, generic.DetailView):
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
        pk = self.kwargs["vol"]
        volume = filter_queryset_approval(
            Volume.objects.filter(id=pk), self.request.user
        ).first()
        if volume:
            form.instance.volume_id = volume.id
            form.instance.user = self.request.user
            super().form_valid(form)
            return HttpResponseRedirect(
                reverse("volume_detail", kwargs={"pk": volume.id})
            )
        else:
            raise Http404


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
        query = SearchQuery(user_query, search_type="websearch")

        person_vector = (
            SearchVector("sort_name", weight="A")
            + SearchVector("description", weight="C")
            + SearchVector("alternate_names__name", weight="A")
        )

        persons = filter_queryset_approval(
            Person.objects.annotate(
                rank=SearchRank(person_vector, query), search=person_vector
            )
            .filter(search=query)
            .order_by("-rank"),
            self.request.user,
        )

        volume_vector = (
            SearchVector("title", weight="A")
            + SearchVector("isbn", weight="A")
            + SearchVector("series__name", weight="B")
            + SearchVector("publisher__name", weight="B")
            + SearchVector("description", weight="B")
        )

        volumes = filter_queryset_approval(
            Volume.objects.annotate(
                rank=SearchRank(volume_vector, query), search=volume_vector
            )
            .filter(search=query)
            .order_by("-rank"),
            self.request.user,
        )

        source_text_vector = (
            SearchVector("title", weight="A")
            + SearchVector("author__sort_name", weight="A")
            + SearchVector("description", weight="B")
            + SearchVector("language", weight="C")
            + SearchVector("alternate_names__name", weight="A")
        )

        source_texts = filter_queryset_approval(
            SourceText.objects.annotate(
                rank=SearchRank(source_text_vector, query), search=source_text_vector
            )
            .filter(search=query)
            .order_by("-rank"),
            self.request.user,
        )

        context["persons"] = persons
        context["volumes"] = volumes
        context["source_texts"] = source_texts

        return context


class UserSubmissionCreateView(LoginRequiredMixin, generic.edit.CreateView):
    model = UserSubmission
    fields = ["submission"]
    template_name = "translations/user_submission_create.html"

    def get_success_url(self):
        return reverse_lazy("index")

    def form_valid(self, form):
        form.instance.user = self.request.user
        super().form_valid(form)
        return HttpResponseRedirect(self.get_success_url())


class PublisherDetailView(ApprovalFilteredQuerysetMixin, generic.DetailView):
    model = Publisher
    template_name = "translations/publisher_detail.html"


class SeriesDetailView(ApprovalFilteredQuerysetMixin, generic.DetailView):
    model = Series
    template_name = "translations/series_detail.html"


# API views


class AutofillUserFieldMixin:
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PersonViewSet(
    ApprovalFilteredQuerysetMixin, AutofillUserFieldMixin, viewsets.ModelViewSet
):
    serializer_class = PersonSerializer
    permission_classes = [
        IsAuthenticatedCreateOrReadOnly | DjangoModelPermissionsOrAnonReadOnly
    ]
    queryset = Person.objects.none()  # Required for DjangoModelPermissions


class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]


class SourceTextViewSet(
    ApprovalFilteredQuerysetMixin, AutofillUserFieldMixin, viewsets.ModelViewSet
):
    serializer_class = SourceTextSerializer
    permission_classes = [
        IsAuthenticatedCreateOrReadOnly | DjangoModelPermissionsOrAnonReadOnly
    ]
    queryset = SourceText.objects.none()  # Required for DjangoModelPermissions


class VolumeViewSet(
    ApprovalFilteredQuerysetMixin, AutofillUserFieldMixin, viewsets.ModelViewSet
):
    serializer_class = VolumeSerializer
    permission_classes = [
        IsAuthenticatedCreateOrReadOnly | DjangoModelPermissionsOrAnonReadOnly
    ]
    queryset = Volume.objects.none()  # Required for DjangoModelPermissions


class PublisherViewSet(
    ApprovalFilteredQuerysetMixin, AutofillUserFieldMixin, viewsets.ModelViewSet
):
    serializer_class = PublisherSerializer
    permission_classes = [
        IsAuthenticatedCreateOrReadOnly | DjangoModelPermissionsOrAnonReadOnly
    ]
    queryset = Publisher.objects.none()  # Required for DjangoModelPermissions


class SeriesViewSet(
    ApprovalFilteredQuerysetMixin, AutofillUserFieldMixin, viewsets.ModelViewSet
):
    serializer_class = SeriesSerializer
    permission_classes = [
        IsAuthenticatedCreateOrReadOnly | DjangoModelPermissionsOrAnonReadOnly
    ]
    queryset = Series.objects.none()  # Required for DjangoModelPermissions


class FeatureViewSet(viewsets.ModelViewSet):
    serializer_class = FeatureSerializer
    permission_classes = [
        CreateChildOfUnapprovedParent | DjangoModelPermissionsOrAnonReadOnly
    ]
    queryset = Feature.objects.none()  # Required for DjangoModelPermissions

    def get_queryset(self):
        return filter_queryset_parent_approval(
            Feature, Feature.objects.all(), self.request.user
        )


class ReviewViewSet(AutofillUserFieldMixin, viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsOwnerEditOrReadOnly]

    def get_queryset(self):
        return filter_queryset_parent_approval(
            Review, Review.objects.all(), self.request.user
        )


class PublishedReviewViewSet(AutofillUserFieldMixin, viewsets.ModelViewSet):
    serializer_class = PublishedReviewSerializer
    permission_classes = [
        IsAuthenticatedCreateOrReadOnly | DjangoModelPermissionsOrAnonReadOnly
    ]
    queryset = PublishedReview.objects.none()  # Required for DjangoModelPermissions

    @approval_filtered_queryset
    def get_queryset(self):
        return PublishedReview.objects.all()


class LinkViewSet(viewsets.ModelViewSet):
    serializer_class = LinkSerializer
    permission_classes = [
        CreateChildOfUnapprovedParent | DjangoModelPermissionsOrAnonReadOnly
    ]
    queryset = Link.objects.none()  # Required for DjangoModelPermissions

    def list(self, request):
        raise MethodNotAllowed("GET", "A record id is required for this path.")

    def get_queryset(self):
        # TODO: This doesn't filter by parent approval state,
        # because it's a generic relation.
        return Link.objects.all()


class AlternateNameViewSet(viewsets.ModelViewSet):
    serializer_class = AlternateNameSerializer
    permission_classes = [
        CreateChildOfUnapprovedParent | DjangoModelPermissionsOrAnonReadOnly
    ]
    queryset = AlternateName.objects.none()  # Required for DjangoModelPermissions

    def list(self, request):
        raise MethodNotAllowed("GET", "A record id is required for this path.")

    def get_queryset(self):
        # TODO: This doesn't filter by parent approval state,
        # because it's a generic relation.

        return AlternateName.objects.all()
