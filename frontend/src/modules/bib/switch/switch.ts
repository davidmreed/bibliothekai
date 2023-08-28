import { LightningElement, api } from 'lwc';

export default class Switch extends LightningElement {
    _value: boolean = false;
    @api label: string = '';

    @api
    set value(v) {
        this._value = v;

        let cb: HTMLInputElement | null = this.template.querySelector('.custom-control-input');
        if (cb) {
            cb.checked = this._value;
        }
    }

    get value() {
        return this._value;
    }

    renderedCallback() {
        let cb: HTMLInputElement | null = this.template.querySelector('.custom-control-input');
        if (cb) {
            cb.checked = this._value;
        }
    }

    handleClick(event: MouseEvent) {
        event.stopPropagation();
        let cb: HTMLInputElement | null = this.template.querySelector('.custom-control-input');
        if (cb) {
            this._value = cb.checked;
        }
        this.dispatchEvent(new CustomEvent('change'));
    }
}
