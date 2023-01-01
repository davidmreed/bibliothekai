import { LightningElement, wire } from 'lwc';
import {
    CurrentPageReference,
    NavigationContext,
    generateUrl
} from 'lwr/navigation';
import { graphQL } from 'bib/api';

const TEXT_DETAILS_QUERY = `
query getTextDetails($textId: Int) {
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

export default class TextPage extends LightningElement {
    @wire(CurrentPageReference) pageReference;
    @wire(NavigationContext) navContext;

    text;
    queryParameters;
    crumbs = [];

    @wire(graphQL, { query: TEXT_DETAILS_QUERY, variables: '$queryParameters' })
    provisionText({ data, error }) {
        if (data) {
            this.text = data.text;
            this.updateBreadcrumbs();
        } else {
            alert(`Got an error: ${JSON.stringify(error)}`);
        }
    }

    updateBreadcrumbs() {
        this.crumbs = [
            { pageReference: { type: 'home' }, title: 'Home' },
            {
                pageReference: {
                    type: 'authorPage',
                    attributes: { authorId: this.text.author.id }
                },
                title: this.text.author.fullName
            },
            {
                pageReference: {
                    type: 'textPage',
                    attributes: { textId: String(this.text.id) }
                },
                title: this.text.title,
                currentPage: true
            }
        ].map((p) => ({
            url: generateUrl(this.navContext, p.pageReference),
            ...p
        }));
    }

    connectedCallback() {
        this.queryParameters = {
            textId: Number(this.pageReference.attributes.textId)
        };
    }
}
