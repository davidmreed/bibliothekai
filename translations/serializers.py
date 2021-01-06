from rest_framework import serializers

from translations.models import (
    Person,
    Language,
    SourceText,
    Publisher,
    Series,
    Volume,
    Feature,
    Review,
    Rating,
    PublishedReview,
    Link,
    KIND_CHOICES,
)


class ChoiceField(serializers.ChoiceField):
    def to_representation(self, obj):
        if obj == "" and self.allow_blank:
            return obj
        return self._choices.get(
            obj, ""
        )  # FIXME: probably the wrong solution to blank kind fields.

    def to_internal_value(self, data):
        # To support inserts with the value
        if data == "" and self.allow_blank:
            return ""

        for key, val in self._choices.items():
            if val == data:
                return key
        self.fail("invalid_choice", input=data)


class LinkSerializer(serializers.ModelSerializer):
    resource_type = ChoiceField(choices=Link.RESOURCE_TYPE_CHOICES)

    class Meta:
        model = Link
        fields = ["id", "link", "source", "resource_type"]


class PersonSerializer(serializers.ModelSerializer):
    links = LinkSerializer(many=True)

    class Meta:
        model = Person
        fields = [
            "id",
            "first_name",
            "last_name",
            "middle_name",
            "sole_name",
            "sort_name",
            "description",
            "links",
        ]


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "name"]


class SourceTextSerializer(serializers.ModelSerializer):
    kind = ChoiceField(choices=KIND_CHOICES)
    links = LinkSerializer(many=True)

    class Meta:
        model = SourceText
        fields = [
            "id",
            "title",
            "original_language_title",
            "author",
            "language",
            "kind",
            "date",
            "description",
            "links",
        ]


class PublisherSerializer(serializers.ModelSerializer):
    links = LinkSerializer(many=True)

    class Meta:
        model = Publisher
        fields = ["id", "name", "links"]


class SeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Series
        fields = ["id", "name"]


class FeatureSerializer(serializers.ModelSerializer):
    kind = ChoiceField(choices=KIND_CHOICES)
    feature = ChoiceField(choices=Feature.FEATURE_CHOICES)

    class Meta:
        model = Feature
        fields = [
            "id",
            "volume",
            "source_text",
            "feature",
            "persons",
            "language",
            "title",
            "kind",
            "partial",
            "description",
            "has_facing_text",
        ]


class VolumeSerializer(serializers.ModelSerializer):
    features = FeatureSerializer(many=True)
    links = LinkSerializer(many=True)

    class Meta:
        model = Volume
        fields = [
            "id",
            "title",
            "published_date",
            "publisher",
            "series",
            "isbn",
            "oclc_number",
            "description",
            "features",
            "links",
        ]


class ReviewSerializer(serializers.ModelSerializer):
    closeness_rating = ChoiceField(choices=Rating.choices)
    readability_rating = ChoiceField(choices=Rating.choices)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "title",
            "closeness_rating",
            "readability_rating",
            "recommended",
            "content",
            "volume",
            "user",
            "date_created",
        ]


class PublishedReviewSerializer(serializers.ModelSerializer):
    links = LinkSerializer(many=True)

    class Meta:
        model = PublishedReview
        fields = [
            "id",
            "title",
            "volumes",
            "persons",
            "location",
            "published_date",
            "links",
        ]
