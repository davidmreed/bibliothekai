from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline

from .models import (
    AlternateName,
    Edition,
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

for model in [Language, Review, UserSubmission]:
    admin.site.register(model)


class LinkInline(GenericTabularInline):
    model = Link
    extra = 1


class AlternateNameInline(GenericTabularInline):
    model = AlternateName
    extra = 1

class EditionInline(admin.TabularInline):
    model = Edition
    extra = 0

class FeatureInline(admin.TabularInline):
    model = Feature
    extra = 1
    show_change_link = True
    fields = [
        "persons",
        "source_text",
        "feature",
        "language",
        "format",
        "partial",
        "has_facing_text",
        "title",
    ]


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    fieldsets = (
        (
            None,
            {
                "fields": [
                    "volume",
                    "source_text",
                    "title",
                    "persons",
                    "feature",
                    "language",
                    "format",
                    "original_publication_date",
                    "partial",
                    "has_facing_text",
                ]
            },
        ),
        ("Details", {"fields": ["description", "sample_passage"]}),
    )


@admin.register(Volume)
class VolumeAdmin(admin.ModelAdmin):
    inlines = [FeatureInline, EditionInline, LinkInline]
    list_filter = ["approved", "publisher", "series"]


@admin.register(Publisher)
class PublisherAdmin(admin.ModelAdmin):
    inlines = [LinkInline]
    list_filter = ["approved"]


@admin.register(PublishedReview)
class PublishedReviewAdmin(admin.ModelAdmin):
    filter_horizontal = ["volumes", "persons"]
    inlines = [LinkInline]
    list_filter = ["approved"]


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    inlines = [AlternateNameInline, LinkInline]
    exclude = ["sort_name"]
    list_filter = ["approved"]


@admin.register(SourceText)
class SourceTextAdmin(admin.ModelAdmin):
    inlines = [AlternateNameInline, LinkInline]
    list_filter = ["approved", "author", "language"]


@admin.register(Series)
class SeriesAdmin(admin.ModelAdmin):
    list_filter = ["approved"]
