import { LightningElement, api, wire } from 'lwc';
import {
    NavigationContext,
    PageReference,
    generateUrl,
    navigate,
    ContextId
} from 'lwr/navigation';

export interface Crumb {
    title: string;
    pageReference: PageReference;
}

export default class Link extends LightningElement {
    @wire(NavigationContext) navContext: ContextId;
    @api crumb: Crumb | null = null;

    get url(): string | null {
        if (this.navContext && this.crumb) {
            return generateUrl(this.navContext, this.crumb.pageReference);
        } else {
            return null;
        }
    }

    handleNavigation(event: MouseEvent) {
        if (this.crumb && this.navContext) {
            event.preventDefault();
            navigate(this.navContext, this.crumb.pageReference);
        }
    }
}