import { LightningElement, wire, track, api } from 'lwc';

import { graphQL } from 'bib/api';
import { Crumb } from 'bib/link';
import {
    Column,
    COLUMN_STRING_TYPE,
    COLUMN_HYPERLINK_TYPE,
    COLUMN_HYPERLINK_LIST_TYPE,
    COLUMN_PILL_LIST_TYPE,
    COLUMN_YEAR_TYPE,
    DataTableRecord,
    Pill
} from 'bib/dataTable';

import { FilterState } from 'bib/textPage';

import {
    GetTranslationsQuery,
    GetTranslationsQueryVariables
} from 'src/gql';

type TranslationRecord = Exclude<
    Exclude<
        Exclude<GetTranslationsQuery['text'], null | undefined>['translations'],
        null | undefined
    >[number],
    null | undefined
>;

type EnrichedTranslation = TranslationRecord & {
    featureNames: string[];
};

type Language = TranslationRecord["language"];

function normalize(
    plainRecord: TranslationRecord,
): EnrichedTranslation {
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

const PILLS = {
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

const TRANSLATION_GRAPHQL_QUERY = /* GraphQL */ `
    query getTranslations($textId: String) {
        __type(name: "TranslationsFeatureFormatChoices") {
            enumValues {
                name
                description
            }
        }
        text(id: $textId) {
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
            (r as EnrichedTranslation).persons.map((p): Crumb => ({
                pageReference: {
                    type: 'volumeListPage',
                    attributes: { authorId: p.id }
                },
                title: p.fullName || ''
            }))
    },
    {
        columnId: 'publisherName',
        valueGetter: (r: DataTableRecord): string => (r as EnrichedTranslation).volume.publisher.name,
        name: 'Publisher',
        valueType: COLUMN_STRING_TYPE
    },
    {
        columnId: 'volumePublishedDate',
        valueGetter: (r: DataTableRecord): string => (r as EnrichedTranslation).volume.publishedDate.substring(0, 4),
        name: 'Published',
        valueType: COLUMN_YEAR_TYPE
    },
    {
        columnId: 'volumeOriginalPublicationDate',
        valueGetter: (r: DataTableRecord): string => (r as EnrichedTranslation).originalPublicationDate.substring(0, 4),
        name: 'First Published',
        valueType: COLUMN_YEAR_TYPE
    },
    {
        columnId: 'languageName',
        name: 'Language',
        valueType: COLUMN_STRING_TYPE,
        valueGetter: (r: DataTableRecord): string => (r as EnrichedTranslation).language.name
    },
    {
        columnId: 'format',
        name: 'Format',
        valueType: COLUMN_STRING_TYPE,
        valueGetter: (r: DataTableRecord) => (r as EnrichedTranslation).format === 'VR' ? 'Verse' : 'Prose'
    },
    {
        columnId: 'resources',
        name: 'Resources',
        valueType: COLUMN_PILL_LIST_TYPE,
        valueGetter: (r: DataTableRecord) =>
            (r as EnrichedTranslation).featureNames.map(
                (f: string): Pill => ({
                    name: f, className: `badge badge-pill badge-${PILLS[f] || ''} mr-1 mb-1`
                })
            )
    }
];


export default class TranslationView extends LightningElement {
    columns: Column[] = columns;
    showingFilters = false;
    records: EnrichedTranslation[] = [];
    error: any;
    parameters: GetTranslationsQueryVariables | null = null;
    translationPath: string | null = null;

    @api textId: string | null = null;
    @api sortColumn: string | null = null;
    @api sortAscending: boolean = false;
    @api filterState: FilterState = {};

    get filters() {
        return [(r: EnrichedTranslation): boolean => !!(
            (this.filterState.filterIntroduction ? r.featureAccompanyingIntroduction : true)
            && (this.filterState.filterNotes ? r.featureAccompanyingNotes : true)
            && (this.filterState.filterCommentary ? r.featureAccompanyingCommentary : true)
            && (this.filterState.filterGlossary ? r.volume.featureGlossary : true)
            && (this.filterState.filterIndex ? r.volume.featureIndex : true)
            && (this.filterState.filterBibliography ? r.volume.featureBibliography : true)
            && (this.filterState.filterMaps ? r.volume.featureMaps : true)
            && (this.filterState.filterSamplePassage ? r.featureSamplePassage : true)
            && (this.filterState.filterFacingText ? r.featureFacingText : true)
            && (this.filterState.filterFormat ? this.filterState.filterFormat === r.format : true)
            && (this.filterState.filterLanguage ? this.filterState.filterLanguage === r.language.id : true)
            && (this.filterState.filterComplete ? !r.partial : true))];
    }

    @wire(graphQL, {
        query: TRANSLATION_GRAPHQL_QUERY,
        variables: '$parameters'
    })
    provision({ data, error }: { data: GetTranslationsQuery; error: any }) {
        if (data && data.text) {
            if (data.text.translations) {
                this.records = data.text.translations.map((r) =>
                    normalize(r)
                );
            } else {
                this.records = [];
            }
        }
        if (error) {
            this.error = error;
        }
        this.template.querySelector('.spinner-grow')?.classList.add('d-none');
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

    connectedCallback() {
        this.parameters = { textId: this.textId };
    }


    handleFilterChange(event: MouseEvent) {
        if (event.currentTarget && event.currentTarget instanceof HTMLElement) {
            let newState: FilterState = { ...this.filterState };
            console.log("In TranslationView#handleFilterChange")

            if (event.currentTarget.dataset.feature) {
                // This is a feature checkbox. Its `data-feature` attribute stores the name
                // of the FilterState property it controls.
                newState[event.currentTarget.dataset.feature] = event.currentTarget.value ? true : undefined;
            } else if (event.currentTarget.name === 'format') {
                if (event.currentTarget.value !== "") {
                    newState.filterFormat = event.currentTarget.value;
                } else {
                    delete newState.filterFormat;
                }
            } else if (event.currentTarget.name === 'language') {
                if (event.currentTarget.value !== "") {
                    newState.filterLanguage = event.currentTarget.value;
                } else {
                    delete newState.filterLanguage;
                }
            } else if (event.currentTarget.name === 'coverage') {
                // TODO: UI allows filtering for partials.
                newState.filterComplete = event.currentTarget.value === 'Complete' ? true : undefined;
            }
            console.log(`Posting new state: ${JSON.stringify(newState)}`);
            this.dispatchEvent(new CustomEvent('filterchange', { detail: newState }));
        }
    }

    handleToggleFilters() {
        this.showingFilters = !this.showingFilters;

        if (!this.showingFilters) {
            this.dispatchEvent(new CustomEvent('filterchange', { detail: { state: {} } }));
        }
    }
}
