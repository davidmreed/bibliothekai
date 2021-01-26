from rest_framework import serializers
from generic_relations.relations import GenericRelatedField
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
    AlternateName,
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
    content_object = GenericRelatedField(
        {
            Volume: serializers.HyperlinkedRelatedField(
                queryset=Volume.objects.all(), view_name="volumes-detail",
            ),
            PublishedReview: serializers.HyperlinkedRelatedField(
                queryset=PublishedReview.objects.all(),
                view_name="published-reviews-detail",
            ),
            Person: serializers.HyperlinkedRelatedField(
                queryset=Person.objects.all(), view_name="persons-detail",
            ),
            SourceText: serializers.HyperlinkedRelatedField(
                queryset=SourceText.objects.all(), view_name="texts-detail",
            ),
            Publisher: serializers.HyperlinkedRelatedField(
                queryset=Publisher.objects.all(), view_name="publishers-detail",
            ),
        }
    )

    class Meta:
        model = Link
        fields = ["id", "link", "source", "resource_type", "content_object"]


class AlternateNameSerializer(serializers.ModelSerializer):
    alternate_name_type = ChoiceField(choices=AlternateName.ALTERNATE_NAME_TYPE_CHOICES)

    class Meta:
        model = AlternateName
        fields = ["id", "name", "alternate_name_type"]


class PersonSerializer(serializers.ModelSerializer):
    links = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Link.objects.all(), required=False
    )
    alternate_names = serializers.PrimaryKeyRelatedField(
        many=True, queryset=AlternateName.objects.all(), required=False
    )

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
            "alternate_names",
        ]


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "name"]


class SourceTextSerializer(serializers.ModelSerializer):
    kind = ChoiceField(choices=KIND_CHOICES)
    links = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Link.objects.all(), required=False
    )
    alternate_names = serializers.PrimaryKeyRelatedField(
        many=True, queryset=AlternateName.objects.all(), required=False
    )

    class Meta:
        model = SourceText
        fields = [
            "id",
            "title",
            "author",
            "language",
            "kind",
            "date",
            "description",
            "links",
            "alternate_names",
        ]


class PublisherSerializer(serializers.ModelSerializer):
    links = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Link.objects.all(), required=False
    )

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
    links = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Link.objects.all(), required=False
    )

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
    links = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Link.objects.all(), required=False
    )

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
