import { LightningElement, api, wire } from 'lwc';
import { getRecords, sortRecordsByName } from 'bib/drf';

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
        this.template.querySelector(".entities").value = this.value;
        this.template.querySelector(".spinner-grow").classList.add("d-none");
    }
    entities = [];
    @api entityName;
    @api allowAdd;
    @api labelText;
    @api value;
    error;

    get selectedId() {
        return Array.from(
            this.template.querySelector('.entities').selectedOptions
        ).map(
            f => (f === '' ? '' : Number(f.value))
        )[0];
    }

    renderedCallback() {
        // Handle race condition between setting value and loading entities.
        this.template.querySelector(".entities").value = this.value;
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

    handleChange(event) {
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent('change', { detail: this.selectedId() }));
    }

    setErrorStatus(message) {
        this.error = message;
        this.selectElement.classList.add("is-invalid");
    }

    get selectElement() {
        return this.template.querySelector(".entities");
    }

    get entityCount() {
        return this.entities.length;
    }
}
