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

The Source Text view is barely functional. It needs
- Data table built out

## Publication

The Publication view shows details of a volume.

This view includes information about all of the features of the volume, including translations (with their translators), notes, and introductions.

Publication view is more or less finished at basic level. Does not yet include library or purchase links. Embedded source texts and features are correctly ordered.

Need to add:
- Reviews
- Features that don't have an associated source text.

## Author

This view shows an author bio (from public sources) and includes a table of source texts or features authored.

This view is barely usable. It needs:
- Data table

# TODO

- [ ] Add a Format Details field to both Source Text and Feature, especially for Homeric translation
  - [ ] Or make Format a text field
- [ ] Make the Format fields usable only for Translations
- [ ] Add feature for Greek text and marker for has ap crit
- [ ] Index by volume
- [ ] Browse by series
- [ ] Does Volume need a description field?
- [ ] Does Series need a lookup to Publisher?
- [ ] Make card decks break at a maximum of 3 across
- [ ] Introductions without source texts break in the admin UI
- [ ] Add reviews to models
- [ ] Build form for adding translations
- [ ] Consider having the Author page show translations for all of the author's works.
- [ ] Make the Texts page sort correctly by author
- [ ] Description field for Features on the Volume detail pages loses line breaks
- [ ] The Person Detail page should coalesce features for the same text in the same volume
- [ ] Need Inline for PublishedReview on Volume
- [ ] Make Person detail page show reviews published
- [X] We should order the list of translations on a source text page
- [X] We should render links in a consistent order
- [X] Track OCLC numbers and render Worldcat links (can also generate links via ISBN (https://www.worldcat.org/search?q=bn%3A978-0393971675&qt=advanced&dblist=638))
- [X] Generate Bookshop purchase links (https://bookshop.org/a/15029/9780140440393)
- [ ] Generate Amazon purchase links
- [ ] Generate Abebooks purchase links
- [ ] Server 500 error if you try to save a Volume with no Persons
- [ ] Move publisher information on the Volume detail page
- [ ] Show series information on the Volume detail page
- [ ] Import Great Books of the Western World catalog
- [ ] Import Loeb Classical Library catalog
- [ ] Import Les Belles Lettres catalog
- [ ] Import Aris & Phillips catalog
- [ ] Import University of Chicago catalog
- [ ] Import Focus Philosophical Library catalog
- [ ] Import Landmark catalog
- [ ] Tracking for spurious source texts