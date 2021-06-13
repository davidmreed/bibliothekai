import { LightningElement, api } from 'lwc';

export default class PopUpMenu extends LightningElement {
    _value;

    @api label;

    @api
    set value(v) {
        this._value = v;
        this.template.querySelector('input').checked = this._value;
    }

    get value() {
        return this._value;
    }

    handleClick(event) {
        event.stopPropagation();
        this._value = event.currentTarget.checked;
        this.dispatchEvent(new CustomEvent('change'));
    }
}
