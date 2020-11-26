from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericRelation, GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import When, Case
from django.contrib.auth.models import User

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


class Link(models.Model):
    class Meta:
        ordering = ["resource_type"]

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    link = models.URLField()
    source = models.CharField(max_length=255)
    resource_type = models.TextField(
        choices=[
            ("CO", "Get a Copy"),
            ("FT", "Full Text"),
            ("WS", "Website"),
            ("BO", "Bio"),
            ("RS", "Resources"),
        ]
    )

    def __str__(self):
        return f"Link {self.link}"


class Language(models.Model):
    class Meta:
        ordering = ["name"]

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Person(models.Model):
    class Meta:
        ordering = [
            Case(
                When(sole_name="", then="last_name"),
                When(last_name="", then="sole_name"),
            ),
            "first_name",
            "middle_name",
        ]

    first_name = models.CharField(max_length=255, blank=True)
    middle_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    sole_name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    links = GenericRelation(Link)

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

    def sort_name(self):
        if self.sole_name:
            return self.sole_name

        return f"{self.last_name}, {self.first_name} {self.middle_name}"

    def __str__(self):
        return self.sort_name()

    def translation_count(self):
        return self.feature_set.filter(feature="TR").count()


class SourceText(models.Model):
    class Meta:
        ordering = ["title"]

    title = models.CharField(max_length=255)
    original_language_title = models.CharField(max_length=255, blank=True)
    author = models.ForeignKey(Person, on_delete=models.PROTECT)
    language = models.ForeignKey(Language, on_delete=models.PROTECT)
    kind = models.TextField(choices=KIND_CHOICES)
    date = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    links = GenericRelation(Link)

    def __str__(self):
        return f"{self.title} ({self.author})"


class Publisher(models.Model):
    class Meta:
        ordering = ["name"]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    links = GenericRelation(Link)

    def __str__(self):
        return self.name


class Series(models.Model):
    class Meta:
        verbose_name_plural = "series"
        ordering = ["name"]

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Volume(models.Model):
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

    def bookshop_link(self):
        return f"https://bookshop.org/a/15029/{self.isbn.replace('-', '')}"

    def oclc_link(self):
        if self.oclc_number:
            return f"https://www.worldcat.org/oclc/{self.oclc_number}"
        elif self.isbn:
            return (
                f"https://www.worldcat.org/search?q=bn%3A{self.isbn}"
                "&qt=advanced&dblist=638"
            )

    def auto_links(self):
        links = []
        if self.isbn:
            links.append(
                Link(link=self.bookshop_link(), source="Bookshop", resource_type="CO")
            )
        if self.isbn or self.oclc_number:
            links.append(
                Link(link=self.oclc_link(), source="Worldcat", resource_type="CO")
            )

        return links

    def all_links(self):
        return self.auto_links() + list(self.links.all())

    def __str__(self):
        if self.published_date:
            return f"{self.title} ({self.publisher}, {self.published_date.year})"

        return self.title


class Feature(models.Model, AuthorNameMixin):
    class Meta:
        ordering = ["volume", "source_text", "feature"]

    feature_types = {
        "ED": "Edited",
        "IN": "Introduction",
        "CM": "Commentary",
        "TR": "Translation",
        "NT": "Notes",
    }

    volume = models.ForeignKey(Volume, on_delete=models.CASCADE)
    source_text = models.ForeignKey(
        SourceText, blank=True, null=True, on_delete=models.PROTECT
    )
    feature = models.CharField(max_length=2, choices=list(feature_types.items()),)
    persons = models.ManyToManyField(Person)
    language = models.ForeignKey(Language, on_delete=models.PROTECT)
    title = models.CharField(max_length=255, blank=True)
    kind = models.TextField(choices=KIND_CHOICES, blank=True)
    partial = models.BooleanField()
    description = models.TextField(blank=True)
    has_facing_text = models.BooleanField()

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


class Review(models.Model):
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
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    date_created = models.DateTimeField(auto_now_add=True)

    def readability_rating_string(self):
        return self.get_readability_rating_display() or _("Not Set")

    def closeness_rating_string(self):
        return self.get_closeness_rating_display() or _("Not Set")


class PublishedReview(models.Model, AuthorNameMixin):
    class Meta:
        ordering = ["title"]

    volume = models.ForeignKey(Volume, blank=True, on_delete=models.CASCADE)
    persons = models.ManyToManyField(Person)
    title = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255)
    links = GenericRelation(Link)

    def __str__(self):
        return f"Review of {self.volume} by {self.author_string()}"
