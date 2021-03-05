from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"persons", views.PersonViewSet, basename="person")
router.register(r"languages", views.LanguageViewSet, basename="language")
router.register(r"texts", views.SourceTextViewSet, basename="text")
router.register(r"volumes", views.VolumeViewSet, basename="volume")
router.register(r"publishers", views.PublisherViewSet, basename="publisher")
router.register(r"series", views.SeriesViewSet, basename="series")
router.register(r"features", views.FeatureViewSet, basename="feature")
router.register(r"reviews", views.ReviewViewSet, basename="review")
router.register(
    r"published-reviews", views.PublishedReviewViewSet, basename="published-review"
)
router.register(r"links", views.LinkViewSet, basename="link")
router.register(
    r"alternate-names", views.AlternateNameViewSet, basename="alternate-name"
)


urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("texts/", views.SourceTextIndexView.as_view(), name="source_text_index"),
    path("authors/", views.AuthorIndexView.as_view(), name="author_index"),
    path("translators/", views.TranslatorIndexView.as_view(), name="translator_index"),
    path(
        "texts/<int:pk>/",
        views.SourceTextDetailView.as_view(),
        name="source_text_detail",
    ),
    path("persons/<int:pk>/", views.PersonDetailView.as_view(), name="person_detail"),
    path("users/<int:pk>/", views.UserDetailView.as_view(), name="user_detail"),
    path(
        "published-reviews/<int:pk>/",
        views.PublishedReviewDetailView.as_view(),
        name="published_review_detail",
    ),
    path("volumes/<int:pk>/", views.VolumeDetailView.as_view(), name="volume_detail"),
    path(
        "volumes/<int:vol>/translation/<int:pk>",
        views.TranslationDetailView.as_view(),
        name="translation_detail",
    ),
    path(
        "volumes/<int:vol>/reviews/",
        views.ReviewIndexView.as_view(),
        name="review_list",
    ),
    path(
        "volumes/<int:vol>/published-reviews/",
        views.PublishedReviewIndexView.as_view(),
        name="publishedreview_list",
    ),
    path(
        "volumes/<int:vol>/published-reviews/add/",
        views.PublishedReviewLWCView.as_view(),
        name="publishedreview_add",
    ),
    path("volumes/add/", views.VolumeLWCView.as_view(), name="volume_add",),
    path(
        "volumes/<int:vol>/review/",
        views.ReviewCreateView.as_view(),
        name="review_create",
    ),
    path(
        "reviews/<int:pk>/",
        views.UserReviewDetailView.as_view(),
        name="user_review_detail",
    ),
    path(
        "reviews/<int:pk>/update/",
        views.ReviewUpdateView.as_view(),
        name="review_update",
    ),
    path(
        "reviews/<int:pk>/delete/",
        views.ReviewDeleteView.as_view(),
        name="review_delete",
    ),
    path("search/", views.SearchView.as_view(), name="search"),
    path("submit/", views.UserSubmissionCreateView.as_view(), name="submit"),
    path("api/", include(router.urls)),
    path("trans/", views.TranslationsLWCView.as_view(), name="translation_lwc",),
]
