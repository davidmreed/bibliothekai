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
    Review,
    Series,
]:
    admin.site.register(model)


class LinkInline(GenericTabularInline):
    model = Link
    extra = 1


class FeatureInline(admin.TabularInline):
    model = Feature
    extra = 1
    fields = [
        "persons",
        "source_text",
        "feature",
        "language",
        "kind",
        "partial",
        "has_facing_text",
        "title",
        "description",
    ]


@admin.register(Volume)
class VolumeAdmin(admin.ModelAdmin):
    date_hierarchy = "published_date"
    inlines = [FeatureInline, LinkInline]
    list_filter = ["publisher", "series"]


@admin.register(Publisher)
class PublisherAdmin(admin.ModelAdmin):
    inlines = [LinkInline]


@admin.register(PublishedReview)
class PublishedReviewAdmin(admin.ModelAdmin):
    filter_horizontal = ["volumes", "persons"]
    inlines = [LinkInline]


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    inlines = [LinkInline]


@admin.register(SourceText)
class SourceTextAdmin(admin.ModelAdmin):
    inlines = [LinkInline]
    list_filter = ["author", "language"]
