import { LightningElement } from 'lwc';
import { createRecord, getRecordApiUrl } from 'bib/drf';

export default class AddPublisher extends LightningElement {
    name = "";
    link = "";

    get isFormValid() {
        return !!this.name;
    }

    handleChange(event) {
        const field = event.target.name;
        if (field === 'name') {
            this.name = event.target.value;
        } else if (field === 'link') {
            this.link = event.target.value;
        }
        if (this.isFormValid) {
            this.markFormValid();
        }
    }

    getValidityElement() {
        return this.template.querySelector(".validity");
    }

    markFormInvalid(tab, message) {
        let validityElem = this.getValidityElement(tab);
        validityElem.classList.add("is-invalid");
        validityElem.classList.add("form-control");
        validityElem.classList.add("mb-2");
        if (message) {
            validityElem.innerText = message;
        }
    }

    markFormValid(tab) {
        let validityElem = this.getValidityElement(tab);
        if (validityElem.classList.contains("is-invalid")) {
            validityElem.classList.remove("is-invalid");
            validityElem.classList.remove("form-control");
            validityElem.classList.remove("mb-2");
        }
    }

    async create(event) {
        // Validate data.

        if (!this.isFormValid) {
            this.markFormInvalid();
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.markFormValid();

        try {
            let result = await createRecord("publishers", { name: this.name });
            if (this.link) {
                let link = {
                    content_object: getRecordApiUrl("publishers", result.id),
                    link: this.link,
                    source: this.name,
                    resource_type: "Website"
                };
                await createRecord("links", link);
            }

            this.dispatchEvent(new CustomEvent('save', { detail: result.id }));
        } catch (error) {
            this.markFormInvalid(error);
            this.dispatchEvent(new CustomEvent('error', { detail: error }))
        }
    }
}
