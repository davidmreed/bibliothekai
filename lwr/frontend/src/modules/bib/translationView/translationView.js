import { LightningElement, wire, track, api } from 'lwc';
import { NavigationContext, generateUrl, navigate } from 'lwr/navigation';

import { graphQL } from 'bib/api';
import { FilterCriteria } from 'bib/dataTable';

function normalize(record, enumValues) {
    // Some features are flags on the Feature, some on the Volume.
    // We also need a flat list for the pill view.

    record.featureNames = [];
    record.format = enumValues.get(record.format);

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

const TRANSLATION_GRAPHQL_QUERY = `
query getTranslations($textId: Int) {
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

export default class TranslationView extends LightningElement {
    columns = [
        {
            id: 'volume.title',
            name: 'Title',
            targetEntity: 'volumes',
            targetEntityId: 'volume.id',
            valueType: 'link'
        },
        {
            id: 'persons',
            name: 'Translator',
            targetEntity: 'persons',
            targetEntityId: 'id',
            targetEntityName: 'fullName',
            valueType: 'link-list'
        },
        {
            id: 'volume.publisher.name',
            name: 'Publisher',
            valueType: 'string'
        },
        {
            id: 'volume.publishedDate',
            name: 'Published',
            valueType: 'year'
        },
        {
            id: 'originalPublicationDate',
            name: 'First Published',
            valueType: 'year'
        },
        { id: 'language.name', name: 'Language', valueType: 'string' },
        { id: 'format', name: 'Format', valueType: 'string' },
        {
            id: 'featureNames',
            name: 'Resources',
            valueType: 'pill-list',
            pills: {
                Introduction: 'primary',
                Notes: 'warning',
                Commentary: 'danger',
                Glossary: 'info',
                Index: 'secondary',
                Bibliography: 'dark',
                Maps: 'success',
                'Facing Text': 'danger',
                'Sample Passage': 'info'
            }
        }
    ];
    selectedIds = [];
    allowsSelection = false;
    showingFilters = false;
    selectedFilterFormat = '';
    selectedFilterLanguage = '';
    selectedFilterCoverage = '';
    records = [];
    error;

    parameters;

    translationPath;

    @api textId;

    @wire(NavigationContext)
    navContext;

    @wire(graphQL, {
        query: TRANSLATION_GRAPHQL_QUERY,
        variables: '$parameters'
    })
    provision({ data, error }) {
        if (data) {
            let enumValues = new Map(
                data.data.__type.enumValues.map((o) => [o.name, o.description])
            );
            if (data.data.text.translations) {
                this.records = data.data.text.translations.map((r) =>
                    normalize(r, enumValues)
                );
            } else {
                this.records = []
            }
        }
        if (error) {
            this.error = error;
        }
        this.template.querySelector('.spinner-grow').classList.add('d-none');
    }

    @track
    filterCriteria = new FilterCriteria([], 'originalPublicationDate', false);

    get hasSelection() {
        return !!this.selectedIds.length;
    }

    get filterTitle() {
        return this.showingFilters ? 'Clear Filters' : 'Show Filters';
    }

    get availableLanguages() {
        let seen = new Set();
        let languages = [];

        this.records.forEach((r) => {
            if (!seen.has(r.language.id)) {
                languages.push(r.language);
                seen.add(r.language.id);
            }
        });

        return languages;
    }

    get allowComparisons() {
        return this.records.reduce(
            (acc, cur) => acc || cur.featureSamplePassage,
            false
        );
    }

    get translationCompareUrl() {
        return `/${this.translationPath}`;
    }

    connectedCallback() {
        this.parameters = { textId: Number(this.textId) };
    }

    handleSort(event) {
        this.filterCriteria = new FilterCriteria(
            this.filterCriteria.filters,
            event.detail.sortColumn,
            event.detail.sortAscending
        );
    }

    handleNavigation(event) {
        event.preventDefault();
        navigate(this.navContext, { type: event.currentTarget.dataset.pageType });
    }

    handleSelectionChange(event) {
        this.selectedIds = event.detail;
    }

    handleFilterChange(event) {
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

        this.filterCriteria = new FilterCriteria(
            this.filterCriteria.filters
                .filter((f) => f.column !== feature)
                .concat(
                    required ||
                        (feature === 'partial' && this.selectedFilterCoverage)
                        ? [{ column: feature, value: required }]
                        : []
                ),
            this.filterCriteria.sortColumn,
            this.filterCriteria.sortAscending
        );
    }

    handleToggleFilters() {
        this.showingFilters = !this.showingFilters;

        if (!this.showingFilters) {
            this.filterCriteria = new FilterCriteria(
                [],
                this.filterCriteria.sortColumn,
                this.filterCriteria.sortAscending
            );
        }
    }
}
