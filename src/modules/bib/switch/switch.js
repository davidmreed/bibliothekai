import { LightningElement, api } from 'lwc';

export default class Switch extends LightningElement {
    _value = false;

    @api label;

    @api
    set value(v) {
        this._value = v;

        let cb = this.template.querySelector('.custom-control-input');
        if (cb) {
            cb.checked = this._value;
        }
    }

    get value() {
        return this._value;
    }

    renderedCallback() {
        let cb = this.template.querySelector('.custom-control-input');
        cb.checked = this._value;
    }

    handleClick(event) {
        event.stopPropagation();
        this._value = event.currentTarget.checked;
        this.dispatchEvent(new CustomEvent('change'));
    }
}
