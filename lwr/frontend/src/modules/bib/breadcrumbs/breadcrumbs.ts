import { LightningElement, api } from 'lwc';
import { Crumb } from '../link/link.js';

interface Breadcrumb extends Crumb {
    currentPage: boolean;
}

export default class Breadcrumbs extends LightningElement {
    @api crumbs: Breadcrumb[] | null = null;
}
