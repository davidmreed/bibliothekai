import { LightningElement } from 'lwc';
import { createRecord } from 'bib/drf';

export default class AddPerson extends LightningElement {
    firstName = '';
    middleName = '';
    lastName = '';
    description = '';

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

    checkValidity() {
        let form = this.template.querySelector('form');
        let status = form.checkValidity();

        if (!status) {
            this.template.querySelectorAll(':invalid').forEach((elem) => {
                elem.classList.add('is-invalid');
                elem.addEventListener('change', () =>
                    elem.classList.remove('is-invalid')
                );
            });
        }

        return status;
    }

    async create(event) {
        // Validate data.

        event.preventDefault();

        if (!this.checkValidity()) {
            return;
        }

        let record = {
            first_name: this.firstName,
            middle_name: this.middleName,
            last_name: this.lastName,
            description: this.description
        };

        try {
            let result = await createRecord('persons', record);
            this.dispatchEvent(new CustomEvent('save', { detail: result.id }));
        } catch (error) {
            this.error = error;
        }
    }
}
