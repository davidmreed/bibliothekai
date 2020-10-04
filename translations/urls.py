from django.urls import path

from . import views

urlpatterns = [
    path("texts/", views.SourceTextIndexView.as_view(), name="source_text_index"),
    path(
        "text/<int:pk>", views.SourceTextDetailView.as_view(), name="source_text_detail"
    ),
    path("volume/<int:pk>", views.VolumeDetailView.as_view(), name="volume_detail"),
    path("person/<int:pk>", views.PersonDetailView.as_view(), name="person_detail"),
]
