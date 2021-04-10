from translations.permissions import (
    filter_queryset_approval,
    filter_queryset_parent_approval,
)
import graphene
from graphene_django import DjangoObjectType

from . import models


class VolumeResourceType(DjangoObjectType):
    class Meta:
        model = models.Feature


class VolumeType(DjangoObjectType):
    class Meta:
        model = models.Volume


class PersonType(DjangoObjectType):
    class Meta:
        model = models.Person


class PublisherType(DjangoObjectType):
    class Meta:
        model = models.Publisher


class SeriesType(DjangoObjectType):
    class Meta:
        model = models.Series


class LanguageType(DjangoObjectType):
    class Meta:
        model = models.Language


class TextType(DjangoObjectType):
    class Meta:
        model = models.SourceText


class LinkType(DjangoObjectType):
    class Meta:
        model = models.Link


class AlternateNameType(DjangoObjectType):
    class Meta:
        model = models.AlternateName


class ReviewType(DjangoObjectType):
    class Meta:
        model = models.Review


class PublishedReviewType(DjangoObjectType):
    class Meta:
        model = models.PublishedReview


class Query(graphene.ObjectType):
    volumes = graphene.List(VolumeType)
    volume_resources = graphene.List(VolumeResourceType)
    texts = graphene.List(TextType)
    persons = graphene.List(PersonType)
    publishers = graphene.List(PublisherType)
    series = graphene.List(SeriesType)
    languages = graphene.List(LanguageType)
    reviews = graphene.List(ReviewType)
    published_reviews = graphene.List(PublishedReviewType)

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
        return models.Review.objects.all()

    def resolve_published_reviews(root, info):
        return filter_queryset_approval(models.PublishedReview.objects.all(), info.user)


schema = graphene.Schema(query=Query)
