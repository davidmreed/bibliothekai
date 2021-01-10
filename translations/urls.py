from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"persons", views.PersonViewSet)
router.register(r"languages", views.LanguageViewSet)
router.register(r"texts", views.SourceTextViewSet)
router.register(r"volumes", views.VolumeViewSet)
router.register(r"publishers", views.PublisherViewSet)
router.register(r"series", views.SeriesViewSet)
router.register(r"features", views.FeatureViewSet)
router.register(r"reviews", views.ReviewViewSet)
router.register(r"publishedreviews", views.PublishedReviewViewSet)
router.register(r"links", views.LinkViewSet)
router.register(r"alternatenames", views.AlternateNameViewSet)


urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("texts/", views.SourceTextIndexView.as_view(), name="source_text_index"),
    path("authors/", views.AuthorIndexView.as_view(), name="author_index"),
    path("translators/", views.TranslatorIndexView.as_view(), name="translator_index"),
    path(
        "text/<int:pk>", views.SourceTextDetailView.as_view(), name="source_text_detail"
    ),
    path("volume/<int:pk>", views.VolumeDetailView.as_view(), name="volume_detail"),
    path("person/<int:pk>", views.PersonDetailView.as_view(), name="person_detail"),
    path("user/<int:pk>", views.UserDetailView.as_view(), name="user_detail"),
    path(
        "publishedreview/<int:pk>",
        views.PublishedReviewDetailView.as_view(),
        name="published_review_detail",
    ),
    path(
        "volume/<int:vol>/reviews",
        views.ReviewIndexView.as_view(),
        name="review_list",
    ),
    path(
        "volume/<int:vol>/published-reviews",
        views.PublishedReviewIndexView.as_view(),
        name="publishedreview_list",
    ),
    path(
        "volume/<int:vol>/review",
        views.ReviewCreateView.as_view(),
        name="review_create",
    ),
    path(
        "review/<int:pk>",
        views.UserReviewDetailView.as_view(),
        name="user_review_detail",
    ),
    path(
        "review/<int:pk>/update/",
        views.ReviewUpdateView.as_view(),
        name="review_update",
    ),
    path(
        "review/<int:pk>/delete/",
        views.ReviewDeleteView.as_view(),
        name="review_delete",
    ),
    path("search", views.SearchView.as_view(), name="search"),
    path("submit", views.UserSubmissionCreateView.as_view(), name="submit"),
    path("api/", include(router.urls)),
]
