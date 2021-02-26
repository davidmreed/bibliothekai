from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericRelation, GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
import requests

from biblia import settings

KIND_CHOICES = [("PR", "Prose"), ("VR", "Verse")]


class AuthorNameMixin:
    def author_string(self):
        authors = list(self.persons.all())
        if len(authors) < 3:
            return " and ".join(str(a) for a in authors)
        else:
            first = ", ".join(str(a) for a in authors[:-1])
            last = str(authors[-1])
            return f"{first}, and {last}"


class UserCreatedMixin(models.Model):
    class Meta:
        abstract = True

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True, blank=True
    )
    date_created = models.DateTimeField(auto_now_add=True)


class UserCreatedApprovalMixin(UserCreatedMixin):
    class Meta:
        abstract = True

    approved = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.user and self.user.is_superuser:
            self.approved = True

        super().save(*args, **kwargs)


class Link(models.Model):
    class Meta:
        ordering = ["resource_type"]

    RESOURCE_TYPE_CHOICES = [
        ("CO", "Get a Copy"),
        ("FT", "Full Text"),
        ("WS", "Website"),
        ("BO", "Bio"),
        ("RS", "Resources"),
    ]

    parent_relationship = "content_object"

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    link = models.URLField()
    source = models.CharField(max_length=255)
    resource_type = models.TextField(choices=RESOURCE_TYPE_CHOICES)

    def __str__(self):
        return f"Link {self.link}"


class AlternateName(models.Model):
    ALTERNATE_NAME_TYPE_CHOICES = [
        ("OR", "Original Language Name"),
        ("TL", "Transliterated Original Language Name"),
        ("TR", "Alternate Name Translation"),
        ("NM", "Alternate Name"),
    ]
    parent_relationship = "content_object"

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    name = models.CharField(max_length=255, blank=False, null=False)
    alternate_name_type = models.CharField(
        max_length=2, choices=ALTERNATE_NAME_TYPE_CHOICES
    )

    def __str__(self):
        return f"Alternate Name {self.name}"


class Language(models.Model):
    class Meta:
        ordering = ["name"]

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Person(UserCreatedApprovalMixin):
    class Meta:
        ordering = ["sort_name"]

    first_name = models.CharField(max_length=255, blank=True)
    middle_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    sole_name = models.CharField(max_length=255, blank=True)
    sort_name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True)
    links = GenericRelation(Link)
    alternate_names = GenericRelation(AlternateName)

    def save(self, *args, **kwargs):
        self.sort_name = (
            self.sole_name
            if self.sole_name
            else f"{self.last_name}, {self.first_name} {self.middle_name}".strip()
        )
        super().save(*args, **kwargs)

    def clean(self):
        if (not self.sole_name and (not self.first_name or not self.last_name)) or (
            self.sole_name and (self.first_name or self.middle_name or self.last_name)
        ):
            raise ValidationError(
                _(
                    "Populate either the Sole Name or the First Name"
                    "and Last Name fields"
                )
            )

    def full_name(self):
        if self.sole_name:
            return self.sole_name

        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"

        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.sort_name

    def translation_count(self):
        return self.features.filter(feature="TR").count()

    def get_absolute_url(self):
        return reverse("person_detail", args=[str(self.id)])


class SourceText(UserCreatedApprovalMixin):
    class Meta:
        ordering = ["title"]

    title = models.CharField(max_length=255)
    author = models.ForeignKey(Person, on_delete=models.PROTECT)
    language = models.ForeignKey(Language, on_delete=models.PROTECT)
    kind = models.TextField(choices=KIND_CHOICES)
    date = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    sample_passage = models.TextField(blank=True)
    sample_passage_spec = models.CharField(max_length=255, blank=True)
    sample_passage_source = models.CharField(max_length=255, blank=True)
    links = GenericRelation(Link)
    alternate_names = GenericRelation(AlternateName)

    def display_name(self):
        return f"{self.title} ({self.author})"

    def __str__(self):
        return self.display_name()

    def get_absolute_url(self):
        return reverse("source_text_detail", args=[str(self.id)])

    def get_original_language_title(self):
        olt = self.alternate_names.filter(alternate_name_type="OR")

        if olt:
            return olt[0].name


class Publisher(UserCreatedApprovalMixin):
    class Meta:
        ordering = ["name"]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    links = GenericRelation(Link)

    def __str__(self):
        return self.name


class Series(UserCreatedApprovalMixin):
    class Meta:
        verbose_name_plural = "series"
        ordering = ["name"]

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Volume(UserCreatedApprovalMixin):
    class Meta:
        ordering = ["title"]

    title = models.CharField(max_length=255)
    published_date = models.DateField(blank=True)
    publisher = models.ForeignKey(Publisher, on_delete=models.PROTECT)
    series = models.ForeignKey(Series, on_delete=models.PROTECT, null=True, blank=True)
    isbn = models.CharField(max_length=32, blank=True)
    oclc_number = models.CharField(max_length=32, blank=True)
    links = GenericRelation(Link)
    description = models.TextField(blank=True)

    def __str__(self):
        if self.published_date:
            return f"{self.title} ({self.publisher}, {self.published_date.year})"

        return self.title

    def get_absolute_url(self):
        return reverse("volume_detail", args=[str(self.id)])

    def oclc_link(self):
        if self.oclc_number:
            return f"https://www.worldcat.org/oclc/{self.oclc_number}"
        elif self.isbn:
            return (
                f"https://www.worldcat.org/search?q=bn%3A{self.isbn}"
                "&qt=advanced&dblist=638"
            )

    def bookshop_link(self):
        if self.isbn:
            return f"https://bookshop.org/a/15029/{self.isbn.replace('-', '').replace(' ', '')}"

    def update_automatic_links(self):
        links = self.links.all()[:]

        # Do we need an OCLC link?
        url = self.oclc_link()
        if (
            url
            and not any(
                this_link.link.startswith("https://www.worldcat.org")
                for this_link in links
            )
            and requests.head(url).status_code != 404
        ):
            oclc = Link(
                content_object=self,
                link=self.oclc_link(),
                source="Worldcat Libraries",
                resource_type="CO",
            )
            oclc.save()

        url = self.bookshop_link()
        if (
            url
            and not any(
                this_link.link.startswith("https://bookshop.org") for this_link in links
            )
            and requests.head(url).status_code != 404
        ):
            bookshop = Link(
                content_object=self, link=url, source="Bookshop", resource_type="CO",
            )
            bookshop.save()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_automatic_links()


class Feature(models.Model, AuthorNameMixin):
    class Meta:
        ordering = [
            "volume",
            "source_text__author__sort_name",
            "source_text",
            "feature",
        ]

    feature_types = {
        "ED": "Edited",
        "IN": "Introduction",
        "CM": "Commentary",
        "TR": "Translation",
        "NT": "Notes",
    }

    parent_relationship = "volume"

    FEATURE_CHOICES = list(feature_types.items())

    volume = models.ForeignKey(
        Volume, related_name="features", on_delete=models.CASCADE
    )
    source_text = models.ForeignKey(
        SourceText, blank=True, null=True, on_delete=models.PROTECT
    )
    feature = models.CharField(max_length=2, choices=FEATURE_CHOICES)
    persons = models.ManyToManyField(Person, related_name="features")
    language = models.ForeignKey(Language, on_delete=models.PROTECT)
    title = models.CharField(max_length=255, blank=True)
    kind = models.TextField(choices=KIND_CHOICES, blank=True)
    partial = models.BooleanField()
    description = models.TextField(blank=True)
    has_facing_text = models.BooleanField()
    sample_passage = models.TextField(blank=True)

    def display_title(self):
        if self.title:
            return self.title
        if self.source_text:
            return self.source_text.title

        return self.get_feature_display()

    def has_accompanying_feature(self, feature_type):
        return (
            Feature.objects.filter(volume=self.volume, feature=feature_type).count() > 0
        )

    def has_accompanying_introduction(self):
        return self.has_accompanying_feature("IN")

    def has_accompanying_notes(self):
        return self.has_accompanying_feature("NT")

    def __str__(self):
        return (
            f"{self.display_title()} ({self.get_feature_display().lower()} by "
            f"{self.author_string()})"
        )


class Rating(models.IntegerChoices):
    LOW = 1
    AVERAGE = 2
    EXCELLENT = 3


class Review(UserCreatedMixin):
    class Meta:
        ordering = ["-date_created"]

    title = models.CharField(max_length=255, blank=True)
    closeness_rating = models.IntegerField(
        blank=True, null=True, choices=Rating.choices
    )
    readability_rating = models.IntegerField(
        blank=True, null=True, choices=Rating.choices
    )
    recommended = models.BooleanField()
    content = models.TextField()
    volume = models.ForeignKey(Volume, on_delete=models.CASCADE)

    def readability_rating_string(self):
        return self.get_readability_rating_display() or _("Not Set")

    def closeness_rating_string(self):
        return self.get_closeness_rating_display() or _("Not Set")

    def get_absolute_url(self):
        return reverse("user_review_detail", args=[str(self.id)])

    def __str__(self):
        return f"User Review of {self.volume.title} by {self.user.display_name}"


class PublishedReview(AuthorNameMixin, UserCreatedApprovalMixin):
    class Meta:
        ordering = ["title"]

    volumes = models.ManyToManyField(Volume)
    persons = models.ManyToManyField(Person)
    title = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255)
    published_date = models.DateField(null=True, blank=True)
    links = GenericRelation(Link)

    def volume_string(self):
        return ", ".join(v.title for v in self.volumes.all())

    def __str__(self):
        return f"Review of {self.volume_string()} by {self.author_string()}"

    def get_absolute_url(self):
        return reverse("published_review_detail", args=[str(self.id)])


class UserSubmission(UserCreatedMixin):
    processed = models.BooleanField(default=False)
    submission = models.TextField()
