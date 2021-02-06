import { LightningElement, api, wire } from 'lwc';
import { getRecords, sortRecordsByName } from 'bib/drf';

export default class PopUpMenu extends LightningElement {
    @wire(getRecords, { entityName: '$entityName', nameField: '$nameField' })
    setEntities({ data, error }) {
        if (data) {
            this.entities = data;
            this.entities.sort(sortRecordsByName);
            // Handle race condition between setting value and loading entities.
            this.template.querySelector(".entities").value = this.value;
        } else {
            this.setErrorStatus(error);
        }
        this.template.querySelector(".spinner-grow").classList.add("d-none");
    }
    entities = [];
    @api entityName;
    @api nameField;
    @api allowAdd;
    @api labelText;
    @api value;


    @api
    getSelectedId() {
        return Array.from(
            this.template.querySelector('.entities').selectedOptions
        ).map(
            (f) => Number(f.value)
        )[0];
    }

    @api
    getSelectedRecord() {
        return this.entities.filter(e => e.id === this.getSelectedId())[0];
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
        this.dispatchEvent(new CustomEvent('change', { detail: this.getSelectedRecord() }));
    }

    getValidityElement() {
        return this.template.querySelector(".validity");
    }

    setErrorStatus(message) {
        let validityElem = this.getValidityElement();
        validityElem.innerText = message;
        validityElem.classList.remove("d-none");
    }

    get entityCount() {
        return this.entities.length;
    }
}
