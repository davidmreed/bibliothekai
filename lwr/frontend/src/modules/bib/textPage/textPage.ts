import { LightningElement, wire, api } from 'lwc';
import {
    PageReference,
    CurrentPageReference,
    navigate,
    NavigationContext,
    ContextId
} from 'lwr/navigation';
import { graphQL } from 'bib/api';
import { Breadcrumb } from 'bib/breadcrumbs';
import { Crumb } from 'bib/link';
import { GetTextDetailsQuery, GetTextDetailsQueryVariables } from 'src/gql';
import {
    Column,
    COLUMN_STRING_TYPE,
    COLUMN_HYPERLINK_TYPE,
    COLUMN_HYPERLINK_LIST_TYPE,
    COLUMN_PILL_LIST_TYPE,
    COLUMN_YEAR_TYPE,
    DataTableRecord,
    Pill,
    SortDirection
} from 'bib/dataTable';

const TEXT_DETAILS_QUERY = /* GraphQL */ `
    query getTextDetails($textId: String) {
        __type(name: "TranslationsFeatureFormatChoices") {
            enumValues {
                name
                description
            }
        }
        text(id: $textId) {
            id
            title
            author {
                id
                fullName
            }
            language {
                name
            }
            format
            date
            description
            translations {
                id
                originalPublicationDate
                format
                partial
                featureSamplePassage
                featureAccompanyingNotes
                featureAccompanyingCommentary
                featureAccompanyingIntroduction
                featureFacingText
                language {
                    id
                    name
                }
                volume {
                    id
                    title
                    publishedDate
                    featureGlossary
                    featureBibliography
                    featureMaps
                    featureIndex
                    publisher {
                        name
                    }
                }
                persons {
                    id
                    fullName
                    sortName
                }
            }
        }
    }
`;
// TODO: alternate names + links

type Text = GetTextDetailsQuery['text'];

type TranslationRecord = Exclude<
    Exclude<
        Exclude<Text, null | undefined>['translations'],
        null | undefined
    >[number],
    null | undefined
>;

type EnrichedTranslation = TranslationRecord & {
    featureNames: string[];
};

type Language = TranslationRecord['language'];

function normalize(plainRecord: TranslationRecord): EnrichedTranslation {
    // Some features are flags on the Feature, some on the Volume.
    // We also need a flat list for the pill view.
    let record: EnrichedTranslation = { ...plainRecord, featureNames: [] };

    if (record.featureAccompanyingIntroduction) {
        record.featureNames.push('Introduction');
    }
    if (record.featureAccompanyingNotes) {
        record.featureNames.push('Notes');
    }
    if (record.featureAccompanyingCommentary) {
        record.featureNames.push('Commentary');
    }
    if (record.volume.featureGlossary) {
        record.featureNames.push('Glossary');
    }
    if (record.volume.featureIndex) {
        record.featureNames.push('Index');
    }
    if (record.volume.featureBibliography) {
        record.featureNames.push('Bibliography');
    }
    if (record.volume.featureMaps) {
        record.featureNames.push('Maps');
    }
    if (record.featureFacingText) {
        record.featureNames.push('Facing Text');
    }
    if (record.featureSamplePassage) {
        record.featureNames.push('Sample Passage');
    }

    return record;
}

const PILLS: Record<string, string> = {
    Introduction: 'primary',
    Notes: 'warning',
    Commentary: 'danger',
    Glossary: 'info',
    Index: 'secondary',
    Bibliography: 'dark',
    Maps: 'success',
    'Facing Text': 'danger',
    'Sample Passage': 'info'
};

const columns: Column[] = [
    {
        columnId: 'volumeTitle',
        name: 'Title',
        valueType: COLUMN_HYPERLINK_TYPE,
        valueGetter: (r: DataTableRecord): Crumb => ({
            pageReference: {
                type: 'volumePage',
                attributes: { volumeId: (r as EnrichedTranslation).volume.id }
            },
            title: (r as EnrichedTranslation).volume.title
        })
    },
    {
        columnId: 'persons',
        name: 'Translator',
        valueType: COLUMN_HYPERLINK_LIST_TYPE,
        valueGetter: (r: DataTableRecord): Crumb[] =>
            (r as EnrichedTranslation).persons.map(
                (p): Crumb => ({
                    pageReference: {
                        type: 'volumeListPage',
                        attributes: { authorId: p.id }
                    },
                    title: p.fullName || ''
                })
            )
    },
    {
        columnId: 'publisherName',
        valueGetter: (r: DataTableRecord): string =>
            (r as EnrichedTranslation).volume.publisher.name,
        name: 'Publisher',
        valueType: COLUMN_STRING_TYPE
    },
    {
        columnId: 'volumePublishedDate',
        valueGetter: (r: DataTableRecord): string =>
            (r as EnrichedTranslation).volume.publishedDate.substring(0, 4),
        name: 'Published',
        valueType: COLUMN_YEAR_TYPE
    },
    {
        columnId: 'volumeOriginalPublicationDate',
        valueGetter: (r: DataTableRecord): string =>
            (r as EnrichedTranslation).originalPublicationDate.substring(0, 4),
        name: 'First Published',
        valueType: COLUMN_YEAR_TYPE
    },
    {
        columnId: 'languageName',
        name: 'Language',
        valueType: COLUMN_STRING_TYPE,
        valueGetter: (r: DataTableRecord): string =>
            (r as EnrichedTranslation).language.name
    },
    {
        columnId: 'format',
        name: 'Format',
        valueType: COLUMN_STRING_TYPE,
        valueGetter: (r: DataTableRecord) =>
            (r as EnrichedTranslation).format === 'VR' ? 'Verse' : 'Prose'
    },
    {
        columnId: 'resources',
        name: 'Resources',
        valueType: COLUMN_PILL_LIST_TYPE,
        valueGetter: (r: DataTableRecord) =>
            (r as EnrichedTranslation).featureNames.map(
                (f: string): Pill => ({
                    name: f,
                    className: `badge badge-pill badge-${
                        PILLS[f] || ''
                    } mr-1 mb-1`
                })
            )
    }
];
interface Attributes {
    textId: string;
}

export interface FilterState {
    filterIntroduction?: boolean;
    filterNotes?: boolean;
    filterCommentary?: boolean;
    filterGlossary?: boolean;
    filterIndex?: boolean;
    filterBibliography?: boolean;
    filterMaps?: boolean;
    filterSamplePassage?: boolean;
    filterFacingText?: boolean;
    filterFormat?: 'PR' | 'VR';
    filterLanguage?: string;
    filterComplete?: boolean;
}

interface PageReferenceState extends FilterState {
    sortColumn?: string;
    sortDirection?: SortDirection;
}

const FILTER_STATE_BOOLEAN_PROPS = [
    'filterIntroduction',
    'filterNotes',
    'filterCommentary',
    'filterGlossary',
    'filterIndex',
    'filterBibliography',
    'filterMaps',
    'filterSamplePassage',
    'filterFacingText'
];

function stateFromPageReference(pr: PageReference): FilterState {
    let state: FilterState = {};

    for (const prop of FILTER_STATE_BOOLEAN_PROPS) {
        if (prop in pr.state) {
            state[prop] = true; // TODO: why does this warn?
        }
    }

    if (
        'filterFormat' in pr.state &&
        (pr.state.filterFormat === 'Prose' || pr.state.filterFormat === 'Verse')
    ) {
        state.filterFormat = pr.state.filterFormat === 'Prose' ? 'PR' : 'VR';
    }
    if ('filterLanguage' in pr.state) {
        state.filterLanguage = pr.state.filterLanguage;
    }

    return state;
}

function pageReferenceFromState(s: FilterState): Record<string, any> {
    let stateMap: Record<string, any> = {};

    for (const prop of FILTER_STATE_BOOLEAN_PROPS) {
        // FIXME: if we don't do this, we get phantom props
        // because they are in s, but set to undefined.
        if (prop in s && s[prop] !== undefined) {
            stateMap[prop] = true;
        }
    }

    if (
        'filterFormat' in s &&
        (s.filterFormat === 'PR' || s.filterFormat === 'VR')
    ) {
        stateMap.filterFormat = s.filterFormat === 'PR' ? 'Prose' : 'Verse';
    }
    if ('filterLanguage' in s) {
        stateMap.filterLanguage = s.filterLanguage;
    }

    return stateMap;
}

export default class TextPage extends LightningElement {
    columns: Column[] = columns;
    showingFilters = false;
    records: EnrichedTranslation[] = [];
    error: any;
    translationPath?: string;

    @wire(CurrentPageReference)
    setPageReference(pageReference: PageReference | null) {
        this.pageReference = pageReference;

        if (this.pageReference) {
            // Parse GraphQL parameters out of our pageReference attributes.
            this.queryParameters = {
                textId: this.pageReference.attributes.textId
            };

            // Parse sort and filter data out of our pageReference state.
            this.filterState = stateFromPageReference(this.pageReference);
            // These values just do nothing if they're invalid (as supplied by the user).
            if (this.pageReference.state.sortColumn) {
                this.sortColumn = this.pageReference.state.sortColumn;
            }
            if (this.pageReference.state.sortDirection) {
                this.sortDirection = this.pageReference.state.sortDirection;
            }
        }
    }
    pageReference?: PageReference;
    @wire(NavigationContext) navContext?: ContextId;

    text?: Text;
    queryParameters?: GetTextDetailsQueryVariables;
    loaded: boolean = false;
    sortColumn?: string = 'volumeOriginalPublicationDate';
    sortDirection: SortDirection = SortDirection.Descending;
    filterState: FilterState = {};

    get filters() {
        return [
            (r: EnrichedTranslation): boolean =>
                !!(
                    (this.filterState.filterIntroduction
                        ? r.featureAccompanyingIntroduction
                        : true) &&
                    (this.filterState.filterNotes
                        ? r.featureAccompanyingNotes
                        : true) &&
                    (this.filterState.filterCommentary
                        ? r.featureAccompanyingCommentary
                        : true) &&
                    (this.filterState.filterGlossary
                        ? r.volume.featureGlossary
                        : true) &&
                    (this.filterState.filterIndex
                        ? r.volume.featureIndex
                        : true) &&
                    (this.filterState.filterBibliography
                        ? r.volume.featureBibliography
                        : true) &&
                    (this.filterState.filterMaps
                        ? r.volume.featureMaps
                        : true) &&
                    (this.filterState.filterSamplePassage
                        ? r.featureSamplePassage
                        : true) &&
                    (this.filterState.filterFacingText
                        ? r.featureFacingText
                        : true) &&
                    (this.filterState.filterFormat
                        ? this.filterState.filterFormat === r.format
                        : true) &&
                    (this.filterState.filterLanguage
                        ? this.filterState.filterLanguage === r.language.id
                        : true) &&
                    (this.filterState.filterComplete ? !r.partial : true)
                )
        ];
    }

    @wire(graphQL, { query: TEXT_DETAILS_QUERY, variables: '$queryParameters' })
    provisionText({ data, error }: { data: GetTextDetailsQuery; error: any }) {
        if (data && data.text) {
            this.text = data.text;
            this.loaded = true;
            if (data.text.translations) {
                this.records = data.text.translations.map((r) => normalize(r));
            } else {
                this.records = [];
            }
        }
        if (error) {
            this.error = error;
        }
        this.loaded = true;
    }

    get crumbs(): Breadcrumb[] {
        return [
            {
                pageReference: { type: 'home' },
                title: 'Home',
                currentPage: false
            },
            {
                pageReference: {
                    type: 'authorPage',
                    attributes: { authorId: this.text?.author.id }
                },
                title: this.text?.author.fullName || '',
                currentPage: false
            },
            {
                pageReference: {
                    type: 'textPage',
                    attributes: { textId: this.text?.id }
                },
                title: this.text?.title || '',
                currentPage: true
            }
        ];
    }

    handleSort(
        event: CustomEvent<{ sortColumn: string; sortDirection: SortDirection }>
    ) {
        let state: PageReferenceState = {
            sortColumn: event.detail.sortColumn,
            sortDirection: event.detail.sortDirection,
            ...pageReferenceFromState(this.filterState)
        };

        navigate(this.navContext, {
            ...this.pageReference,
            state: state
        });
    }

    get filterTitle(): string {
        return this.showingFilters ? 'Clear Filters' : 'Show Filters';
    }

    get availableLanguages(): Language[] {
        let seen: Set<string> = new Set();
        let languages: Language[] = [];

        this.records.forEach((r) => {
            if (!seen.has(r.language.id)) {
                languages.push(r.language);
                seen.add(r.language.id);
            }
        });

        return languages;
    }

    get allowComparisons(): boolean {
        return this.records.reduce(
            (acc, cur) => acc || cur.featureSamplePassage || false,
            false
        );
    }

    get translationCompareUrl() {
        return `/${this.translationPath}`;
    }

    handleFilterChange(event: MouseEvent) {
        if (event.currentTarget && event.currentTarget instanceof HTMLElement) {
            let newState: FilterState = { ...this.filterState };

            if (event.currentTarget.dataset.feature) {
                // This is a feature checkbox. Its `data-feature` attribute stores the name
                // of the FilterState property it controls.
                newState[event.currentTarget.dataset.feature] = event
                    .currentTarget.value
                    ? true
                    : undefined;
            } else if (event.currentTarget.name === 'format') {
                if (event.currentTarget.value !== '') {
                    newState.filterFormat = event.currentTarget.value;
                } else {
                    delete newState.filterFormat;
                }
            } else if (event.currentTarget.name === 'language') {
                if (event.currentTarget.value !== '') {
                    newState.filterLanguage = event.currentTarget.value;
                } else {
                    delete newState.filterLanguage;
                }
            } else if (event.currentTarget.name === 'coverage') {
                // TODO: UI allows filtering for partials.
                newState.filterComplete =
                    event.currentTarget.value === 'Complete' ? true : undefined;
            }

            let state: PageReferenceState = {
                sortColumn: this.sortColumn || undefined, // FIXME: gross
                sortDirection: this.sortDirection,
                ...pageReferenceFromState(newState)
            };

            navigate(this.navContext, {
                ...this.pageReference,
                state: state
            });
        }
    }

    handleToggleFilters() {
        this.showingFilters = !this.showingFilters;

        if (!this.showingFilters) {
            this.dispatchEvent(
                new CustomEvent('filterchange', { detail: { state: {} } })
            );
        }
    }
}
