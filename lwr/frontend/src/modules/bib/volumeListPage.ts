import { LightningElement, wire } from 'lwc';
import {
    CurrentPageReference,
    generateUrl,
    NavigationContext,
    ContextId,
    PageReference
} from 'lwr/navigation';
import { graphQL } from 'bib/api';
import { Breadcrumb } from 'bib/breadcrumbs';

const VOLUME_LIST_QUERY = /* GraphQL */ `
volumes(filterType: $filterType, entityId: $entityId) {
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
    volumes;
    queryParameters;

    @wire(CurrentPageReference)
    setPageReference(pageReference: PageReference | null) {
        this.pageReference = pageReference;

        if (this.pageReference) {
            // Parse GraphQL parameters out of our pageReference attributes.
            this.queryParameters = {
                textId: this.pageReference.attributes.textId
            };
        }
    }
    pageReference?: PageReference;
    @wire(NavigationContext) navContext?: ContextId;

    @wire(graphQL, {
        query: VOLUME_LIST_QUERY,
        variables: '$queryParameters'
    })
    provisionVolumes({ data, error }) {
        if (data && data.data) {
        } else {
            alert(`Got an error: ${JSON.stringify(error)}`);
        }
    }

    get crumbs(): Breadcrumb[] {
        return [
            {
                pageReference: { type: 'home' },
                title: 'Home',
                currentPage: false
            },
            {
                pageReference: this.pageReference,
                title: this.title,
                currentPage: true
            }
        ];
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
