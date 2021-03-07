import { LightningElement, api } from 'lwc';

export default class CommaLinkList extends LightningElement {
    @api values;

    get useComma() {
        return this.values.length > 2;
    }
}
