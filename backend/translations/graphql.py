import logging

from django.db.models import Q
import graphene
from graphene_django import DjangoListField, DjangoObjectType

from translations.permissions import (
    filter_queryset_approval,
    filter_queryset_parent_approval,
)

from . import models

logger = logging.getLogger(__name__)


class FilteredDefaultQueryset:
    @classmethod
    def get_queryset(cls, queryset, info):
        return filter_queryset_approval(queryset, info.context.user)


class VolumeResource(DjangoObjectType):
    class Meta:
        model = models.Feature
        exclude_fields = ["has_facing_text"]

    feature_accompanying_introduction = graphene.Boolean(required=True)
    feature_accompanying_notes = graphene.Boolean(required=True)
    feature_accompanying_commentary = graphene.Boolean(required=True)
    feature_sample_passage = graphene.Boolean(required=True)
    feature_facing_text = graphene.Boolean(required=True)

    def resolve_feature_accompanying_introduction(root, info, **kwargs):
        return root.has_accompanying_introduction()

    def resolve_feature_accompanying_notes(root, info, **kwargs):
        return root.has_accompanying_notes()

    def resolve_feature_accompanying_commentary(root, info, **kwargs):
        return root.has_accompanying_commentary()

    def resolve_feature_sample_passage(root, info, **kwargs):
        return bool(root.sample_passage and root.sample_passage != "")

    def resolve_feature_facing_text(root, info, **kwargs):
        return root.has_facing_text

    @classmethod
    def get_queryset(cls, queryset, info):
        return filter_queryset_parent_approval(
            models.Feature,
            queryset,
            info.context.user,
        )


class Volume(FilteredDefaultQueryset, DjangoObjectType):
    class Meta:
        model = models.Volume
        exclude_fields = ["approved"]


class Person(FilteredDefaultQueryset, DjangoObjectType):
    class Meta:
        model = models.Person
        exclude_fields = ["approved"]

    full_name = graphene.String(required=True)

    def resolve_full_name(root, info, **kwargs):
        return root.full_name()


class Publisher(FilteredDefaultQueryset, DjangoObjectType):
    class Meta:
        model = models.Publisher
        exclude_fields = ["approved"]


class Series(FilteredDefaultQueryset, DjangoObjectType):
    class Meta:
        model = models.Series
        exclude_fields = ["approved"]


class Language(DjangoObjectType):
    class Meta:
        model = models.Language
        exclude_fields = ["features"]


class Text(FilteredDefaultQueryset, DjangoObjectType):
    class Meta:
        model = models.SourceText
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
            "sample_passage_source_link",
            "sample_passage_license",
            "sample_passage_license_link",
        ]

    translations = graphene.List(VolumeResource, required=True)

    def resolve_translations(root, info, **kwargs):
        return filter_queryset_parent_approval(
            models.Feature,
            models.Feature.objects.filter(source_text=root)
            .filter(feature="TR")
            .order_by("-volume__published_date"),
            info.context.user,
        )


class Link(DjangoObjectType):
    class Meta:
        model = models.Link


class AlternateName(DjangoObjectType):
    class Meta:
        model = models.AlternateName


class Review(DjangoObjectType):
    class Meta:
        model = models.Review

    @classmethod
    def get_queryset(cls, queryset, info):
        return filter_queryset_parent_approval(
            models.Review,
            queryset,
            info.context.user,
        )


class PublishedReview(FilteredDefaultQueryset, DjangoObjectType):
    class Meta:
        model = models.PublishedReview
        exclude_fields = ["approved"]


class Query(graphene.ObjectType):
    volumes = DjangoListField(Volume, required=True)
    volume_resources = DjangoListField(VolumeResource, required=True)
    texts = DjangoListField(Text, required=True)
    persons = DjangoListField(Person, required=True)
    publishers = DjangoListField(Publisher, required=True)
    series = DjangoListField(Series, required=True)
    languages = DjangoListField(Language, required=True)
    reviews = DjangoListField(Review, required=True)
    published_reviews = DjangoListField(PublishedReview, required=True)

    text = graphene.Field(Text, id=graphene.String(required=True))
    volume = graphene.Field(Volume, id=graphene.String(required=True))
    volumes_by = graphene.List(
        Volume,
        required=True,
        entity_name=graphene.String(required=True),
        entity_id=graphene.String(required=True),
    )

    def resolve_volumes_by(root, info, entity_name: str, entity_id: str, **kwargs):
        if entity_name.lower() == "person":
            return models.Volume.objects.filter(
                Q(features__persons__id=entity_id)
                | Q(features__source_text__author_id=entity_id)
            ).distinct()
        elif entity_name.lower() == "series":
            return models.Volume.objects.filter(series_id=entity_id)
        elif entity_name.lower() == "publisher":
            return models.Volume.objects.filter(publisher_id=entity_id)

        return []

    def resolve_text(root, info, **kwargs):
        id = kwargs.get("id")
        return models.SourceText.objects.get(pk=id)

    def resolve_volume(root, info, **kwargs):
        id = kwargs.get("id")
        return models.Volume.objects.get(pk=id)


schema = graphene.Schema(query=Query)
