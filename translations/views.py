from django.shortcuts import render
from django.http import HttpResponse
from django.views import generic

from .models import Translation, SourceText, Volume, Person

class TranslationDetailView(generic.DetailView):
    model = Translation
    template_name = 'translations/translation_detail.html'

class TranslationIndexView(generic.ListView):
    template_name = 'translations/translation_index.html'

    def get_queryset(self):
        return Translation.objects.order_by('source_text')

class SourceTextDetailView(generic.DetailView):
    model = SourceText
    template_name = 'translations/source_text_detail.html'

class SourceTextIndexView(generic.ListView):
    template_name = 'translations/source_text_index.html'

    def get_queryset(self):
        return SourceText.objects.order_by('author')

class VolumeDetailView(generic.DetailView):
    model = Volume
    template_name = 'translations/volume_detail.html'

class VolumeIndexView(generic.ListView):
    template_name = 'translations/volume_index.html'

    def get_queryset(self):
        return Volume.objects.order_by('published_date')

class AuthorDetailView(generic.DetailView):
    model = Person
    template_name = 'translations/author_detail.html'

class AuthorIndexView(generic.ListView):
    template_name = 'translations/author_index.html'

    def get_queryset(self):
        return Volume.objects.order_by('published_date')
