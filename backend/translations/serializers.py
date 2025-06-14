from generic_relations.relations import GenericRelatedField
from rest_framework import serializers

from translations.models import (
    FORMAT_CHOICES,
    AlternateName,
    Feature,
    Language,
    Link,
    Person,
    PublishedReview,
    Publisher,
    Rating,
    Review,
    Series,
    SourceText,
    Volume,
)


class ChoiceField(serializers.ChoiceField):
    def to_representation(self, obj):
        if obj == "" and self.allow_blank:
            return obj
        return self._choices.get(obj, "")

    def to_internal_value(self, data):
        # To support inserts with the value
        if data == "" and self.allow_blank:
            return ""

        str_choices = {str(k): k for k in self._choices}

        if data in self._choices:
            return data
        if data in str_choices:
            return str_choices[data]

        for key, val in self._choices.items():
            if val == data:
                return key
        self.fail("invalid_choice", input=data)


class LinkSerializer(serializers.ModelSerializer):
    resource_type = ChoiceField(choices=Link.RESOURCE_TYPE_CHOICES)
    content_object = GenericRelatedField(
        {
            Volume: serializers.HyperlinkedRelatedField(
                queryset=Volume.objects.all(),
                view_name="volume-detail",
            ),
            PublishedReview: serializers.HyperlinkedRelatedField(
                queryset=PublishedReview.objects.all(),
                view_name="published-review-detail",
            ),
            Person: serializers.HyperlinkedRelatedField(
                queryset=Person.objects.all(),
                view_name="person-detail",
            ),
            SourceText: serializers.HyperlinkedRelatedField(
                queryset=SourceText.objects.all(),
                view_name="text-detail",
            ),
            Publisher: serializers.HyperlinkedRelatedField(
                queryset=Publisher.objects.all(),
                view_name="publisher-detail",
            ),
        }
    )

    class Meta:
        model = Link
        fields = ["id", "link", "source", "resource_type", "content_object"]


class AlternateNameSerializer(serializers.ModelSerializer):
    alternate_name_type = ChoiceField(choices=AlternateName.ALTERNATE_NAME_TYPE_CHOICES)
    content_object = GenericRelatedField(
        {
            Person: serializers.HyperlinkedRelatedField(
                queryset=Person.objects.all(),
                view_name="person-detail",
            ),
            SourceText: serializers.HyperlinkedRelatedField(
                queryset=SourceText.objects.all(),
                view_name="text-detail",
            ),
        }
    )

    class Meta:
        model = AlternateName
        fields = ["id", "name", "alternate_name_type", "content_object"]


class PersonSerializer(serializers.ModelSerializer):
    sort_name = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Person
        fields = [
            "id",
            "first_name",
            "last_name",
            "middle_name",
            "sole_name",
            "sort_name",
            "full_name",
            "description",
        ]


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "name"]


class SourceTextSerializer(serializers.ModelSerializer):
    format = ChoiceField(choices=FORMAT_CHOICES)
    author = serializers.HyperlinkedRelatedField(
        queryset=Person.objects.all(),
        view_name="person-detail",
    )
    language = serializers.HyperlinkedRelatedField(
        queryset=Language.objects.all(),
        view_name="language-detail",
    )

    display_name = serializers.CharField(read_only=True)

    class Meta:
        model = SourceText
        fields = [
            "id",
            "title",
            "author",
            "language",
            "format",
            "date",
            "description",
            "sample_passage",
            "sample_passage_spec",
            "sample_passage_source",
            "display_name",
        ]


class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = ["id", "name"]


class SeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Series
        fields = ["id", "name"]


class FeatureSerializer(serializers.ModelSerializer):
    format = ChoiceField(choices=FORMAT_CHOICES, default="Prose", required=False)
    feature = ChoiceField(choices=Feature.FEATURE_CHOICES)
    persons = serializers.HyperlinkedRelatedField(
        queryset=Person.objects.all(), view_name="person-detail", many=True
    )
    volume = serializers.HyperlinkedRelatedField(
        queryset=Volume.objects.all(),
        view_name="volume-detail",  # FIXME: all of these querysets need to be sanitized
    )
    text = serializers.HyperlinkedRelatedField(
        source="source_text",
        queryset=SourceText.objects.all(),
        view_name="text-detail",
        required=False,
    )

    language = serializers.HyperlinkedRelatedField(
        queryset=Language.objects.all(), view_name="language-detail"
    )
    partial = serializers.BooleanField(default=False)
    description = serializers.CharField(required=False)
    title = serializers.CharField(required=False, max_length=255)
    has_facing_text = serializers.BooleanField(default=False)

    class Meta:
        model = Feature
        fields = [
            "id",
            "volume",
            "text",
            "feature",
            "persons",
            "language",
            "title",
            "format",
            "partial",
            "description",
            "has_facing_text",
            "sample_passage",
            "original_publication_date",
        ]


class VolumeSerializer(serializers.ModelSerializer):
    features = serializers.HyperlinkedRelatedField(
        view_name="feature-detail", many=True, required=False, read_only=True
    )
    publisher = serializers.HyperlinkedRelatedField(
        queryset=Publisher.objects.all(), view_name="publisher-detail"
    )
    series = serializers.HyperlinkedRelatedField(
        queryset=Series.objects.all(), view_name="series-detail", required=False
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
            "feature_maps",
            "feature_index",
            "feature_bibliography",
            "feature_glossary",
        ]


class ReviewSerializer(serializers.ModelSerializer):
    closeness_rating = ChoiceField(choices=Rating.choices)
    readability_rating = ChoiceField(choices=Rating.choices)
    user = serializers.HyperlinkedRelatedField(read_only=True, view_name="user-detail")
    volume = serializers.HyperlinkedRelatedField(
        queryset=Volume.objects.all(), view_name="volume-detail"
    )

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
    volumes = serializers.HyperlinkedRelatedField(
        view_name="volume-detail", many=True, queryset=Volume.objects.all()
    )
    persons = serializers.HyperlinkedRelatedField(
        view_name="person-detail", many=True, queryset=Person.objects.all()
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
        ]
