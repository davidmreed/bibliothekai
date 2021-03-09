import { LightningElement, wire, track } from 'lwc';
import { getRecords } from 'bib/drf';
import { FilterCriteria } from 'bib/dataTable';

function normalizeFeatures(record) {
    // Some features are flags on the Feature, some on the Volume.
    // We also need a flat list for the pill view.

    record.feature_maps = record.volume.feature_maps;
    record.feature_index = record.volume.feature_index;
    record.feature_bibliography = record.volume.feature_bibliography;
    record.feature_glossary = record.volume.feature_glossary;
    record.feature_facingtext = record.has_facing_text;

    record.featureNames = [];

    if (record.feature_introduction) {
        record.featureNames.push('Introduction');
    }
    if (record.feature_notes) {
        record.featureNames.push('Notes');
    }
    if (record.feature_glossary) {
        record.featureNames.push('Glossary');
    }
    if (record.feature_index) {
        record.featureNames.push('Index');
    }
    if (record.feature_bibliography) {
        record.featureNames.push('Bibliography');
    }
    if (record.feature_maps) {
        record.featureNames.push('Maps');
    }
    if (record.feature_facingtext) {
        record.featureNames.push('Facing Text');
    }
    if (record.feature_sample_passage) {
        record.featureNames.push('Sample Passage');
    }

    return record;
}

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
            targetEntityName: 'full_name',
            valueType: 'link-list'
        },
        { id: 'publisher.name', name: 'Publisher', valueType: 'string' }, // TODO: constant-ize
        { id: 'volume.published_date', name: 'Date', valueType: 'year' },
        { id: 'language.name', name: 'Language', valueType: 'string' },
        { id: 'kind', name: 'Format', valueType: 'string' },
        {
            id: 'featureNames',
            name: 'Features',
            valueType: 'pill-list',
            pills: {
                Introduction: 'primary',
                Notes: 'warning',
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

    translationPath;

    @wire(getRecords, { entityName: '$translationPath' })
    provision({ data, error }) {
        if (data) {
            this.records = data.map((r) => normalizeFeatures(r));
        }
        if (error) {
            this.error = error;
        }
        this.template.querySelector('.spinner-grow').classList.add('d-none');
    }

    @track
    filterCriteria = new FilterCriteria([], 'volume.published_date', false);

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

    renderedCallback() {
        // If we're being displayed within a text's path,
        // load translations for that text.
        const regex = /texts\/([0-9]+)\//;
        const loc = document.location.pathname;
        const textIdMatch = loc.match(regex);

        if (textIdMatch && textIdMatch.length === 2) {
            this.translationPath = `texts/${textIdMatch[1]}/translations`;
        } else {
            this._error = 'No text found';
        }
    }

    handleSort(event) {
        this.filterCriteria = new FilterCriteria(
            this.filterCriteria.filters,
            event.detail.sortColumn,
            event.detail.sortAscending
        );
    }

    handleSelectionChange(event) {
        this.selectedIds = event.detail;
    }

    handleFilterChange(event) {
        let feature;
        let required;

        if (event.target.dataset.feature) {
            // This is a feature checkbox
            feature = `feature_${event.target.dataset.feature}`;
            required = event.target.checked;
        } else if (event.target.name === 'format') {
            feature = 'kind';
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
