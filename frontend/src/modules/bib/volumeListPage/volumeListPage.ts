import { LightningElement, wire } from 'lwc';
import {
    CurrentPageReference,
    NavigationContext,
    ContextId,
    PageReference
} from 'lwr/navigation';
import { graphQL } from 'bib/api';
import { Breadcrumb } from 'bib/breadcrumbs';
import { GetVolumesByEntityQuery, GetVolumesByEntityQueryVariables } from 'src/gql';

const VOLUME_LIST_QUERY = /* GraphQL */ `
query getVolumesByEntity($entityType: String!, $entityId: String!) {
    volumesBy(entityName: $entityType, entityId: $entityId) {
        id
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
            id
            sourceText {
                title
            }
            feature
            format
            partial
            persons {
                id
                fullName
            }
        }
    }
}
`;
type Volume = GetVolumesByEntityQuery['volumesBy'][number];

export default class VolumeListPage extends LightningElement {
    volumes?: Volume[];
    queryParameters?: GetVolumesByEntityQueryVariables;
    pageReference?: PageReference;
    loaded: boolean = false;

    @wire(NavigationContext) navContext?: ContextId;
    @wire(CurrentPageReference)
    setPageReference(pageReference: PageReference | null) {
        this.pageReference = pageReference;

        if (this.pageReference) {
            // Parse GraphQL parameters out of our pageReference attributes.
            this.queryParameters = {
                entityType: this.pageReference.attributes.entityType,
                entityId: this.pageReference.attributes.entityId
            };
        }
    }

    get isPerson(): boolean {
        return this.queryParameters?.entityType === 'person';
    }

    get isSeries(): boolean {
        return this.queryParameters?.entityType === 'series';
    }

    get isPublisher(): boolean {
        return this.queryParameters?.entityType === 'publisher';
    }

    @wire(graphQL, {
        query: VOLUME_LIST_QUERY,
        variables: '$queryParameters'
    })
    provisionVolumes({
        data,
        error
    }: {
        data: GetVolumesByEntityQuery;
        error: any;
    }) {
        if (data && data.volumesBy) {
            this.volumes = data.volumesBy;
            this.loaded = true;
        } else {
            alert(`Got an error: ${JSON.stringify(error)}`);
            this.loaded = false;
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
}
