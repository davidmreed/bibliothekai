import { registerDecorators as _registerDecorators, registerComponent as _registerComponent, LightningElement } from "lwc";
import _tmpl from "./addPerson.html";
import { createRecord } from 'bib/api';
class AddPerson extends LightningElement {
  constructor(...args) {
    super(...args);
    this.firstName = '';
    this.middleName = '';
    this.lastName = '';
    this.description = '';
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
    let record = {
      first_name: this.firstName,
      middle_name: this.middleName,
      last_name: this.lastName,
      description: this.description
    };
    try {
      let result = await createRecord('persons', record);
      this.dispatchEvent(new CustomEvent('save', {
        detail: result.id
      }));
    } catch (error) {
      this.error = error;
    }
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators(AddPerson, {
  fields: ["firstName", "middleName", "lastName", "description"]
});
export default _registerComponent(AddPerson, {
  tmpl: _tmpl
});