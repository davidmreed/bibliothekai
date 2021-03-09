from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline

from .models import (
    AlternateName,
    Feature,
    Language,
    Link,
    Person,
    PublishedReview,
    Publisher,
    Review,
    Series,
    SourceText,
    UserSubmission,
    Volume,
)

for model in [Language, Review, Series, UserSubmission]:
    admin.site.register(model)


class LinkInline(GenericTabularInline):
    model = Link
    extra = 1


class AlternateNameInline(GenericTabularInline):
    model = AlternateName
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
        "sample_passage",
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
    inlines = [AlternateNameInline, LinkInline]
    exclude = ["sort_name"]


@admin.register(SourceText)
class SourceTextAdmin(admin.ModelAdmin):
    inlines = [AlternateNameInline, LinkInline]
    list_filter = ["author", "language"]
