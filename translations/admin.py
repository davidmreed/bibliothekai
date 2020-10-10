from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline
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
    Link,
)

for model in [
    Language,
    Person,
    SourceText,
    Publisher,
    Review,
    PublishedReview,
    Series,
]:
    admin.site.register(model)


class LinkInline(GenericTabularInline):
    model = Link


class AuthorInline(admin.TabularInline):
    model = Feature.persons.through


class FeatureInline(admin.TabularInline):
    model = Feature
    extra = 1


@admin.register(Volume)
class VolumeAdmin(admin.ModelAdmin):
    date_hierarchy = "published_date"
    inlines = [FeatureInline, LinkInline]
