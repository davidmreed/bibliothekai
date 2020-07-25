# Mission

Collect and surface available translations for classical texts.
Make it easy for users to find translations meeting their needs.
Expose reviews of translations so users can evaluate them.

# Primary Views

## Source Text

The Source Text view provides:
 - Facets of the source text, such as Author, Original Language, Format (prose or verse), Date, Description (sourced from Wikipedia or other free source).
 - Links to other sources of information (Stanford Encyclopedia of Philosophy, Wikipedia).
 - A searchable, filterable list of published translations, with at least the following facets:
    - Translator(s)
    - Language
    - Publisher
    - Publication Date
    - Format (prose or verse)
    - Features (notes, introduction)
    - User review score
    - Detail links

## Publication

The Publication view shows details of a volume.

This view includes information about all of the features of the volume, including translations (with their translators), notes, and introductions.

## Author

This view shows an author bio (from public sources) and includes a table of source texts or features authored.

# TODO

- [ ] Redesign the PersonRole and Translation objects to be more generic Features. Eliminate the use of Translation as an independent object. We'll handle that with views.
- [ ] Determine what we want the Author view to look like
