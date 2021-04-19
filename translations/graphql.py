from translations.permissions import (
    filter_queryset_approval,
    filter_queryset_parent_approval,
)
import graphene
from graphene_django import DjangoObjectType

import logging

logger = logging.getLogger(__name__)

from . import models


class VolumeResource(DjangoObjectType):
    class Meta:
        model = models.Feature


class Volume(DjangoObjectType):
    class Meta:
        model = models.Volume

    def resolve_published_reviews(root, info):
        return filter_queryset_approval(
            models.PublishedReview.objects.filter(volumes=root),
            info.context.user,
        )


class Person(DjangoObjectType):
    class Meta:
        model = models.Person

    def resolve_features(root, info):
        return filter_queryset_parent_approval(
            models.Feature,
            models.Feature.objects.filter(persons=root),
            info.context.user,
        )

    def resolve_source_texts(root, info):
        return filter_queryset_approval(
            models.SourceText.objects.filter(author=root),
            info.context.user,
        )

    def resolve_published_reviews(root, info):
        return filter_queryset_approval(
            models.PublishedReview.objects.filter(persons=root),
            info.context.user,
        )


class Publisher(DjangoObjectType):
    class Meta:
        model = models.Publisher

    def resolve_volumes(root, info):
        return filter_queryset_approval(
            models.Volume.objects.filter(publisher=root),
            info.context.user,
        )


class Series(DjangoObjectType):
    class Meta:
        model = models.Series

    def resolve_volumes(root, info):
        return filter_queryset_approval(
            models.Volume.objects.filter(series=root),
            info.context.user,
        )


class Language(DjangoObjectType):
    class Meta:
        model = models.Language
        exclude_fields = ["features"]

    def resolve_source_texts(root, info):
        return filter_queryset_approval(
            models.SourceText.objects.filter(language=root),
            info.context.user,
        )


class Text(DjangoObjectType):
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


class PublishedReview(DjangoObjectType):
    class Meta:
        model = models.PublishedReview


class Query(graphene.ObjectType):
    volumes = graphene.List(Volume)
    volume_resources = graphene.List(VolumeResource)
    texts = graphene.List(Text)
    persons = graphene.List(Person)
    publishers = graphene.List(Publisher)
    series = graphene.List(Series)
    languages = graphene.List(Language)
    reviews = graphene.List(Review)
    published_reviews = graphene.List(PublishedReview)

    def resolve_volumes(root, info):
        return filter_queryset_approval(models.Volume.objects.all(), info.context.user)

    def resolve_volume_resources(root, info):
        return filter_queryset_parent_approval(
            models.Feature,
            models.Feature.objects.all(),
            info.context.user,
        )

    def resolve_texts(root, info):
        return filter_queryset_approval(
            models.SourceText.objects.all(), info.context.user
        )

    def resolve_persons(root, info):
        return filter_queryset_approval(models.Person.objects.all(), info.context.user)

    def resolve_publishers(root, info):
        return filter_queryset_approval(
            models.Publisher.objects.all(), info.context.user
        )

    def resolve_series(root, info):
        return filter_queryset_approval(models.Series.objects.all(), info.context.user)

    def resolve_languages(root, info):
        return filter_queryset_approval(
            models.Language.objects.all(), info.context.user
        )

    def resolve_reviews(root, info):
        return filter_queryset_parent_approval(
            models.Review, models.Review.objects.all(), info.context.user
        )

    def resolve_published_reviews(root, info):
        return filter_queryset_approval(models.PublishedReview.objects.all(), info.user)


schema = graphene.Schema(query=Query)
