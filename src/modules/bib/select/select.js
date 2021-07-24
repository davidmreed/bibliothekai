import { LightningElement, api } from 'lwc';

export default class Select extends LightningElement {
    _value;
    _options;

    noSelectionKey = '';

    constructor() {
        super();

        this.initMaps();
    }

    get value() {
        return this._value;
    }

    @api set value(v) {
        this._value = v;
    }

    get options() {
        return this._options;
    }

    @api set options(o) {
        this._options = (o || []).map((opt) => ({
            name: opt.name,
            value: opt.value,
            htmlValue: String(opt.value)
        }));

        this.initMaps();

        this._options.forEach((opt) => {
            if (this._valueToHtmlValueMap.has(opt.value)) {
                throw new Error(`Duplicate option values on ${opt.value}.`);
            }
            if (this._htmlValueToValueMap.has(opt.htmlValue)) {
                throw new Error(
                    `Duplicate HTML option values on ${opt.value}.`
                );
            }
            this._valueToHtmlValueMap.set(opt.value, opt.htmlValue);
            this._htmlValueToValueMap.set(opt.htmlValue, opt.value);
        });
    }

    get selectedHtmlValue() {
        return this._valueToHtmlValueMap.get(this.value);
    }

    get htmlSelect() {
        return this.template.querySelector('.form-control');
    }

    renderedCallback() {
        // Handle race condition between setting value and options on the <select> element.
        this.htmlSelect.value = this.selectedHtmlValue;
    }

    initMaps() {
        this._valueToHtmlValueMap = new Map();
        this._htmlValueToValueMap = new Map();
        this._htmlValueToValueMap.set('', undefined);
        this._valueToHtmlValueMap.set(undefined, '');
    }

    handleChange(event) {
        event.stopPropagation();

        let htmlSelect = this.htmlSelect.selectedOptions[0].value;
        this._value = this._htmlValueToValueMap.get(htmlSelect);

        this.dispatchEvent(new CustomEvent('change'));
    }
}
