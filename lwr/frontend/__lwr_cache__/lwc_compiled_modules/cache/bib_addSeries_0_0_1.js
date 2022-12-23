import { registerDecorators as _registerDecorators, registerComponent as _registerComponent, LightningElement } from "lwc";
import _tmpl from "./addSeries.html";
import { createRecord } from 'bib/api';
class AddSeries extends LightningElement {
  constructor(...args) {
    super(...args);
    this.name = '';
    this.error = '';
  }
  handleChange(event) {
    this[event.currentTarget.dataset.name] = event.currentTarget.value;
  }
  checkValidity() {
    let form = this.template.querySelector('form');
    let status = form.checkValidity();
    if (!status) {
      this.template.querySelectorAll(':invalid').forEach(elem => {
        elem.classList.add('is-invalid');
        elem.addEventListener('change', () => elem.classList.remove('is-invalid'));
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
      let result = await createRecord('series', {
        name: this.name
      });
      this.dispatchEvent(new CustomEvent('save', {
        detail: result.id
      }));
    } catch (error) {
      this.error = error;
    }
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators(AddSeries, {
  fields: ["name", "error"]
});
export default _registerComponent(AddSeries, {
  tmpl: _tmpl
});