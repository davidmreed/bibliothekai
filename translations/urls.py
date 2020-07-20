from django.urls import path

from . import views

urlpatterns = [
    path('translations/', views.TranslationIndexView.as_view(), name='translation_index'),
    path('translation/<int:pk>', views.TranslationDetailView.as_view(), name='translation_detail'),
    path('texts/', views.SourceTextIndexView.as_view(), name='source_text_index'),
    path('text/<int:pk>', views.SourceTextDetailView.as_view(), name='source_text_detail'),
    path('volumes/', views.VolumeIndexView.as_view(), name='volume_index'),
    path('volume/<int:pk>', views.VolumeDetailView.as_view(), name='volume_detail'),
    path('authors/', views.AuthorIndexView.as_view(), name='author_index'),
    path('author/<int:pk>', views.AuthorDetailView.as_view(), name='author_detail'),
]
