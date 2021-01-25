import { LightningElement } from 'lwc';
import { createRecord } from 'bib/drf';

export default class AddPerson extends LightningElement {
    firstName = "";
    middleName = "";
    lastName = "";
    description = "";

    get isFormValid() {
        return !!this.firstName && !!this.lastName;
    }

    handleChange(event) {
        const field = event.target.name;
        if (field === 'first_name') {
            this.firstName = event.target.value;
        } else if (field === 'middle_name') {
            this.middleName = event.target.value;
        } else if (field === 'last_name') {
            this.lastName = event.target.value;
        } else if (field === 'description') {
            this.description = event.target.value;
        }
    }

    getValidityElement() {
        return this.template.querySelector(".validity");
    }

    markFormInvalid(tab) {
        let validityElem = this.getValidityElement(tab);
        validityElem.classList.add("is-invalid");
        validityElem.classList.add("form-control");
        validityElem.classList.add("mb-2");
    }

    markFormValid(tab) {
        let validityElem = this.getValidityElement(tab);
        if (validityElem.classList.contains("is-invalid")) {
            validityElem.classList.remove("is-invalid");
            validityElem.classList.remove("form-control");
            validityElem.classList.remove("mb-2");
        }
    }

    create(event) {
        // Validate data.

        if (!this.isFormValid) {
            this.markFormInvalid();
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.markFormValid();

        let record = {
            first_name: this.firstName,
            middle_name: this.middleName,
            last_name: this.lastName,
            description: this.description
        };

        createRecord(
            "persons",
            record
        ).then(result => {
            this.dispatchEvent(new CustomEvent('save', { detail: result.id }));
        }).catch(error => {
            this.dispatchEvent(new CustomEvent('error', { detail: error }))
        });
    }
}
