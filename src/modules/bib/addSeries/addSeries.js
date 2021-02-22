import { LightningElement } from 'lwc';
import { createRecord } from 'bib/drf';

export default class AddSeries extends LightningElement {
    name = '';
    error = '';

    handleChange(event) {
        const field = event.target.name;

        if (field === 'name') {
            this.name = event.target.value;
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

        try {
            let result = await createRecord('series', { name: this.name });

            this.dispatchEvent(new CustomEvent('save', { detail: result.id }));
        } catch (error) {
            this.error = error;
        }
    }
}
