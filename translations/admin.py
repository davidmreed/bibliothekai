from django.contrib import admin
from .models import Language, Translation, Volume, Person, PersonRole, SourceText, Publisher, Review, PublishedReview, Series

admin.site.register(Language)
admin.site.register(Person)
admin.site.register(PersonRole)
admin.site.register(SourceText)
admin.site.register(Publisher)
admin.site.register(Review)
admin.site.register(PublishedReview)
admin.site.register(Series)

class AuthorInline(admin.TabularInline):
    model=Translation.authors.through

class PersonRoleInline(admin.TabularInline):
    model=PersonRole

class TranslationInline(admin.TabularInline):
    model=Translation.publications.through

@admin.register(Translation)
class TranslationAdmin(admin.ModelAdmin):
    inlines=[AuthorInline, TranslationInline]
    exclude=('authors', 'publications',)

@admin.register(Volume)
class VolumeAdmin(admin.ModelAdmin):
    date_hierarchy='published_date'
    inlines=[PersonRoleInline, TranslationInline]
