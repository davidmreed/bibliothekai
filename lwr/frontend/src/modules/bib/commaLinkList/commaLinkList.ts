import { LightningElement, api } from 'lwc';
import { Crumb } from '../link/link.js';

export default class CommaLinkList extends LightningElement {
    @api values: Crumb[] | null = null;

    get useComma() {
        return this.values.length > 2;
    }
}
