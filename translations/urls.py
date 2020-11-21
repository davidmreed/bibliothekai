from django.urls import path
from django.conf.urls import include, url
from . import views

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
    path(
        "volume/<int:pk>/review", views.ReviewCreateView.as_view(), name="review_create"
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
]
