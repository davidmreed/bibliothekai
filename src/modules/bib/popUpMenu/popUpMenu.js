import { LightningElement, api, wire } from 'lwc';
import { getRecords } from 'bib/api';
import { sortRecordsByName } from 'bib/utils';

export default class PopUpMenu extends LightningElement {
    @wire(getRecords, { entityName: '$entityName' })
    setEntities({ data, error }) {
        if (data) {
            this.entities = data;
            this.entities.sort(sortRecordsByName);
        } else {
            this.setErrorStatus(error);
        }
        // Handle race condition between setting value and loading entities.
        this.selectElement.value = this.value;
        this.template.querySelector('.spinner-grow').classList.add('d-none');
    }
    entities = [];
    @api entityName;
    @api allowAdd;
    @api labelText;

    error;
    _value;

    @api
    set value(v) {
        this._value = v;
    }

    get value() {
        return this._value;
    }

    get selectedId() {
        return Array.from(this.selectElement.selectedOptions).map((f) =>
            f === '' ? '' : Number(f.value)
        )[0];
    }

    renderedCallback() {
        // Handle race condition between setting value and loading entities.
        this.selectElement.value = this.value;
    }

    get shouldAllowAdd() {
        if (typeof this.allowAdd === 'boolean') {
            return this.allowAdd;
        }
        return this.allowAdd === 'true' ? true : false;
    }

    add() {
        this.dispatchEvent(new CustomEvent('add'));
    }

    handleChange() {
        this._value = this.selectedId;
        this.dispatchEvent(new CustomEvent('change'));
    }

    setErrorStatus(message) {
        this.error = message;
        this.selectElement.classList.add('is-invalid');
    }

    get selectElement() {
        return this.template.querySelector('.entities');
    }

    get entityCount() {
        return this.entities.length;
    }
}
