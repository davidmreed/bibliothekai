import { LightningElement, wire, track, api } from 'lwc';

import { graphQL } from 'bib/api';
import { Crumb } from 'bib/link';
import {
    FilterCriteria,
    Column,
    COLUMN_STRING_TYPE,
    COLUMN_HYPERLINK_TYPE,
    COLUMN_HYPERLINK_LIST_TYPE,
    COLUMN_PILL_LIST_TYPE,
    COLUMN_YEAR_TYPE,
    DataTableRecord,
    Pill
} from 'bib/dataTable';

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
    humanFormat: string;
};

function normalize(
    plainRecord: TranslationRecord,
    enumValues: Map<String, String>
): EnrichedTranslation {
    // Some features are flags on the Feature, some on the Volume.
    // We also need a flat list for the pill view.
    let record: EnrichedTranslation = { ...plainRecord, featureNames: [], humanFormat: enumValues.get(plainRecord.format) || 'Prose' };

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
        valueGetter: (r: DataTableRecord) => String((r as EnrichedTranslation).format)
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
    selectedFilterFormat = '';
    selectedFilterLanguage = '';
    selectedFilterCoverage = '';
    records: EnrichedTranslation[] = [];
    error: any;

    parameters: GetTranslationsQueryVariables | null = null;

    translationPath: string | null = null;

    @api textId: string | null = null;

    @wire(graphQL, {
        query: TRANSLATION_GRAPHQL_QUERY,
        variables: '$parameters'
    })
    provision({ data, error }: { data: GetTranslationsQuery; error: any }) {
        if (data && data.text) {
            let enumValues = new Map(
                data.__type?.enumValues?.map((o) => [o.name, o.description])
            );
            if (data.text.translations) {
                this.records = data.text.translations.map((r) =>
                    normalize(r, enumValues)
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

    @track
    filterCriteria: FilterCriteria = {
        filters: [],
        sortColumn: 'originalPublicationDate',
        sortAscending: false
    };

    get filterTitle(): string {
        return this.showingFilters ? 'Clear Filters' : 'Show Filters';
    }

    get availableLanguages() {
        let seen = new Set();
        let languages: string[] = [];

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

    handleSort(event: CustomEvent<{ sortColumn: string, sortAscending: boolean }>) {
        this.filterCriteria = {
            filters: this.filterCriteria.filters,
            sortColumn: event.detail.sortColumn,
            sortAscending: event.detail.sortAscending
        };
    }

    handleFilterChange(event: MouseEvent) {
        let feature;
        let required;

        if (event.target.dataset.feature) {
            // This is a feature checkbox
            feature = event.target.dataset.feature;
            required = event.target.value;
        } else if (event.target.name === 'format') {
            feature = 'format';
            required = this.selectedFilterFormat = event.target.value;
        } else if (event.target.name === 'language') {
            feature = 'language.id';
            this.selectedFilterLanguage = event.target.value;
            required = Number(this.selectedFilterLanguage);
        } else if (event.target.name === 'coverage') {
            feature = 'partial';
            this.selectedFilterCoverage = event.target.value;
            if (this.selectedFilterCoverage) {
                required = this.selectedFilterCoverage === 'Partial';
            }
        }

        this.filterCriteria = {
            ...this.filterCriteria,
            filters: this.filterCriteria.filters
                .filter((f) => f.column !== feature)
                .concat(
                    required ||
                        (feature === 'partial' && this.selectedFilterCoverage)
                        ? [{ column: feature, value: required }]
                        : []
                )
        };
    }

    handleToggleFilters() {
        this.showingFilters = !this.showingFilters;

        if (!this.showingFilters) {
            this.filterCriteria = {
                ...this.filterCriteria,
                filters: []
            };
        }
    }
}
