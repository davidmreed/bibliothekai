import { LightningElement, api } from 'lwc';
import { Crumb } from 'bib/link';

export default class CommaLinkList extends LightningElement {
    @api values: Crumb[] = [];

    get useComma() {
        return this.values.length > 2;
    }
}
