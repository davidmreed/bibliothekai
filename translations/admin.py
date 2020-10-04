from django.contrib import admin
from .models import (
    Language,
    Volume,
    Person,
    Feature,
    SourceText,
    Publisher,
    Review,
    PublishedReview,
    Series,
)

admin.site.register(Language)
admin.site.register(Person)
admin.site.register(SourceText)
admin.site.register(Publisher)
admin.site.register(Review)
admin.site.register(PublishedReview)
admin.site.register(Series)


class AuthorInline(admin.TabularInline):
    model = Feature.persons.through


class FeatureInline(admin.TabularInline):
    model = Feature


@admin.register(Volume)
class VolumeAdmin(admin.ModelAdmin):
    date_hierarchy = "published_date"
    inlines = [FeatureInline]
