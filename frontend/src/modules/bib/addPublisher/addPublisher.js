import { LightningElement } from 'lwc';
import { createRecord, getRecordApiUrl } from 'bib/api';

export default class AddPublisher extends LightningElement {
    name = '';
    link = '';
    error = '';

    handleChange(event) {
        this[event.currentTarget.dataset.name] = event.currentTarget.value;
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
            let result = await createRecord('publishers', { name: this.name });
            if (this.link) {
                let link = {
                    content_object: getRecordApiUrl('publishers', result.id),
                    link: this.link,
                    source: this.name,
                    resource_type: 'Website'
                };
                await createRecord('links', link);
            }

            this.dispatchEvent(new CustomEvent('save', { detail: result.id }));
        } catch (error) {
            this.error = error;
        }
    }
}
