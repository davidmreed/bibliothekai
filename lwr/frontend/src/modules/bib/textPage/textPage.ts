import { LightningElement, wire } from 'lwc';
import { PageReference, CurrentPageReference } from 'lwr/navigation';
import { graphQL } from 'bib/api';
import { Breadcrumb } from 'bib/breadcrumbs';
import { GetTextDetailsQuery, GetTextDetailsQueryVariables } from 'src/gql';

const TEXT_DETAILS_QUERY = /* GraphQL */`
query getTextDetails($textId: String) {
    text(id: $textId) {
        id
        title
        author {
            id
            fullName
        }
        language {
            name
        }
        format
        date
        description
    }
}
`;
// TODO: alternate names + links

type Text = GetTextDetailsQuery["text"];

export default class TextPage extends LightningElement {
    @wire(CurrentPageReference) pageReference: PageReference;

    text: Text | null = null;
    queryParameters: GetTextDetailsQueryVariables | null = null;
    loaded: boolean = false;

    @wire(graphQL, { query: TEXT_DETAILS_QUERY, variables: '$queryParameters' })
    provisionText({ data, error }: { data: GetTextDetailsQuery, error: any }) {
        if (data) {
            this.text = data.text;
            this.loaded = true;
        } else {
            alert(`Got an error: ${JSON.stringify(error)}`);
        }
    }

    get crumbs(): Breadcrumb[] {
        return [
            { pageReference: { type: 'home' }, title: 'Home', currentPage: false },
            {
                pageReference: {
                    type: 'authorPage',
                    attributes: { authorId: this.text?.author.id }
                },
                title: this.text?.author.fullName || '',
                currentPage: false
            },
            {
                pageReference: {
                    type: 'textPage',
                    attributes: { textId: this.text?.id }
                },
                title: this.text?.title || '',
                currentPage: true
            }
        ];
    }

    connectedCallback() {
        this.queryParameters = {
            textId: this.pageReference.attributes.textId
        };
    }
}
