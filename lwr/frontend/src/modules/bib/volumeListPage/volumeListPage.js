import { LightningElement, api, track, wire } from 'lwc';
import {
    CurrentPageReference,
    generateUrl,
    NavigationContext
} from 'lwr/navigation';
import { graphQL } from 'bib/api';

const VOLUME_LIST_QUERY = `
volumes(personId: $personId) {
    title
    publisher {
        id
        name
    }
    series {
        id
        name
    }
    publishedDate
    description
    features {
        feature
        format
        partial
        persons {
            id
            fullName
        }
    }
}
`;

export default class VolumeListPage extends LightningElement {
    @wire(CurrentPageReference) pageReference;
    @wire(NavigationContext) navContext;

    volumes;
    crumbs;
    queryParameters;

    // FIXME: the wire adapter doesn't catch returns that have the `errors` key w/a 200
    @wire(graphQL, {
        query: VOLUME_DETAILS_QUERY,
        variables: '$queryParameters'
    })
    provisionVolumes({ data, error }) {
        if (data && data.data) {
            this.volumes = new Volume(data.data.volume, this.navContext);
            this.updateBreadcrumbs();
        } else {
            alert(`Got an error: ${JSON.stringify(error)}`);
        }
    }

    updateBreadcrumbs() {
        this.crumbs = [
            { pageReference: { type: 'home' }, title: 'Home' },
            {
                pageReference: this.pageReference,
                title: this.title,
                currentPage: true
            }
        ].map((p) => ({
            url: generateUrl(this.navContext, p.pageReference),
            ...p
        }));
    }

    connectedCallback() {
        // Convert the parameters given in the pageReference
        // into query options for the backend.
        switch (this.pageReference.type) {
            case 'authorPage':
                this.queryParameters = this.pageReference.attributes;
                break;
            case 'seriesPage':
                break;
            case 'publisherPage':
                break;
        }
    }
}
