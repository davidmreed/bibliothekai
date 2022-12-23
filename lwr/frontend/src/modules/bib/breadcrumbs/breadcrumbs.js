import { LightningElement, api, wire } from 'lwc';
import { NavigationContext, navigate } from 'lwr/navigation';
/*
type Breadcrumb = {
    title: string;
    pageReference: PageReference;
    url: string;
}*/

export default class Breadcrumbs extends LightningElement {
    @wire(NavigationContext) navContext;
    @api crumbs;

    handleNavigation(event) {
        event.preventDefault();
        navigate(this.navContext, this.crumbs[event.currentTarget.dataset.index].pageReference);
    }

}