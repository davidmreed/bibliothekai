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
        //{ id: 'volume.publisher.name', name: 'Publisher', valueType: 'string' }, // TODO: constant-ize
        { id: 'volume.published_date', name: 'Date', valueType: 'year' },
        //{ id: 'volume.language.name', name: 'Language', valueType: 'string' },
        { id: 'kind', name: 'Type', valueType: 'string' },
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
                'Facing Text': 'danger'
            }
        }
    ];
    selectedIds = [];
    allowsSelection = true;
    _records = [];
    _error;

    @wire(getRecords, { entityName: 'texts/1/translations' })
    provision({ data, error }) {
        if (data) {
            this._records = data.map((r) => normalizeFeatures(r));
        }
        if (error) {
            this._error = error;
        }
    }

    @track
    filterCriteria = new FilterCriteria([], 'volume.title', true);

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
        let feature = `feature_${event.target.dataset.feature}`;
        let required = event.target.checked;

        if (required) {
            this.filterCriteria = new FilterCriteria(
                this.filterCriteria.filters
                    .filter((f) => f.column !== feature)
                    .concat([{ column: feature, value: required }]),
                this.filterCriteria.sortColumn,
                this.filterCriteria.sortAscending
            );
        } else {
            this.filterCriteria = new FilterCriteria(
                this.filterCriteria.filters.filter((f) => f.column !== feature),
                this.filterCriteria.sortColumn,
                this.filterCriteria.sortAscending
            );
        }
    }
}
