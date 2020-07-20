from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class Language(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Person(models.Model):
    first_name = models.CharField(max_length=255, blank=True)
    middle_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    sole_name = models.CharField(max_length=255, blank=True)

    def clean(self):
        if (not self.sole_name and (not self.first_name or not self.last_name)) or \
            (self.sole_name and (self.first_name or self.middle_name or self.last_name)):
            raise ValidationError(_('Populate either the Sole Name or the First Name and Last Name fields'))

    def __str__(self):
        if self.sole_name:
            return self.sole_name

        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"

        return f"{self.first_name} {self.last_name}"

class SourceText(models.Model):
    title = models.CharField(max_length=255)
    original_language_title = models.CharField(max_length=255)
    author = models.ForeignKey(Person, on_delete=models.PROTECT)
    language = models.ForeignKey(Language, on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.title} ({self.author})"

class Publisher(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)

    def __str__(self):
        return self.name

class Series(models.Model):
    name = models.CharField(max_length=255)

class Volume(models.Model):
    title = models.CharField(max_length=255)
    published_date = models.DateField(blank=True)
    publisher = models.ForeignKey(Publisher, on_delete=models.PROTECT)
    series = models.ForeignKey(Series, on_delete=models.PROTECT, null=True, blank=True)
    people = models.ManyToManyField(Person, through='PersonRole')
    isbn = models.CharField(max_length=32, blank=True)

    def __str__(self):
        if self.published_date:
            return f"{self.title} ({self.published_date.year})"

        return self.title

class PersonRole(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    volume = models.ForeignKey(Volume, on_delete=models.CASCADE)
    role = models.CharField(max_length=2, choices=[('ED', 'Editor'), ('AU', 'Author'), ('IN', 'Introducer'), ('CM', 'Commentator')])

class Translation(models.Model):
    title = models.CharField(max_length=255, blank=True)
    authors = models.ManyToManyField(Person)
    language = models.ForeignKey(Language, on_delete=models.PROTECT)
    publications = models.ManyToManyField(Volume, blank=True)
    source_text = models.ForeignKey(SourceText, on_delete=models.PROTECT)
    partial = models.BooleanField()
    description = models.TextField(blank=True)

    def display_title(self):
        if self.title:
            return self.title

        return self.source_text.title

    def author_string(self):
        authors = self.authors.all()
        if len(authors) < 3:
            return " and ".join(str(a) for a in authors)
        else:
            first = ", ".join(str(a) for a in authors[:-1])
            last = str(authors[-1])
            return f"{first}, and {last}"
    def __str__(self):
        title = self.title or self.source_text.title
        return f"{title} (trans. {self.author_string()})"

class Review(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    volume = models.ForeignKey(Volume, on_delete=models.CASCADE)

class PublishedReview(models.Model):
    url = models.URLField()
    volume = models.ForeignKey(Volume, blank=True, on_delete=models.CASCADE)
    author = models.ForeignKey(Person, on_delete=models.PROTECT)
