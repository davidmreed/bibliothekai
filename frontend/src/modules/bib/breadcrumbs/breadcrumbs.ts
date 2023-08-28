import { LightningElement, api } from 'lwc';

import { Crumb } from 'bib/link';

export interface Breadcrumb extends Crumb {
    currentPage: boolean;
}

export default class Breadcrumbs extends LightningElement {
    @api crumbs: Breadcrumb[] | null = null;
}
