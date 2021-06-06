from translations.permissions import (
    filter_queryset_approval,
    filter_queryset_parent_approval,
)
import graphene
from graphene_django import DjangoObjectType, DjangoListField

import logging

from . import models

logger = logging.getLogger(__name__)


class FilteredDefaultQueryset:
    @classmethod
    def get_queryset(cls, queryset, info):
        return filter_queryset_approval(queryset, info.context.user)


class VolumeResource(FilteredDefaultQueryset, DjangoObjectType):
    class Meta:
        model = models.Feature
        exclude_fields = ["has_facing_text"]

    feature_accompanying_introduction = graphene.Boolean()
    feature_accompanying_notes = graphene.Boolean()
    feature_accompanying_commentary = graphene.Boolean()
    feature_sample_passage = graphene.Boolean()
    feature_facing_text = graphene.Boolean()

    def resolve_feature_accompanying_introduction(root, info, **kwargs):
        return root.has_accompanying_introduction

    def resolve_feature_accompanying_notes(root, info, **kwargs):
        return root.has_accompanying_notes

    def resolve_feature_accompanying_commentary(root, info, **kwargs):
        return root.has_accompanying_commentary

    def resolve_feature_sample_passage(root, info, **kwargs):
        return root.sample_passage and root.sample_passage != ""

    def resolve_feature_facing_text(root, info, **kwargs):
        return root.has_facing_text

    def get_queryset(cls, queryset, info):
        return filter_queryset_parent_approval(
            models.Feature,
            queryset.filter(feature="TR").order_by("-volume__published_date"),
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

    full_name = graphene.String()

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

    translations = graphene.List(VolumeResource)

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
    volumes = DjangoListField(Volume)
    volume_resources = DjangoListField(VolumeResource)
    texts = DjangoListField(Text)
    persons = DjangoListField(Person)
    publishers = DjangoListField(Publisher)
    series = DjangoListField(Series)
    languages = DjangoListField(Language)
    reviews = DjangoListField(Review)
    published_reviews = DjangoListField(PublishedReview)

    text = graphene.Field(Text, id=graphene.Int())

    def resolve_text(root, info, **kwargs):
        id = kwargs.get("id")
        return models.SourceText.objects.get(pk=id)


schema = graphene.Schema(query=Query)
