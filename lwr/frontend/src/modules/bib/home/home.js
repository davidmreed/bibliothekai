import { LightningElement, api, track, wire } from 'lwc';
import { graphQL } from 'bib/api';
import { createRouter } from '@lwrjs/router/routes';
import { NavigationContext, generateUrl, navigate } from 'lwr/navigation';

const GRAPHQL_QUERY_TEXTS = `
query getTexts {
    texts {
        id
        title
        author {
            id
            fullName
        }
    }
}
`;

export default class Home extends LightningElement {
    searchTerm = '';
    recordData;
    filteredRecordData = [];

    @wire(NavigationContext)
    navContext;

    router = createRouter();

    @wire(graphQL, { query: GRAPHQL_QUERY_TEXTS })
    updateRecordData({ data, error }) {
        if (data) {
            this.recordData = data.texts;
            this.updateSearchResults();
        }
    }

    updateSearchResults() {
        if (this.searchTerm) {
            this.filteredRecordData = this.recordData.filter((f) =>
                f.title.includes(this.searchTerm)
            );
        } else {
            this.filteredRecordData = this.recordData;
        }

        this.filteredRecordData = this.filteredRecordData.map((f) => {
            return {
                ...f,
                url: generateUrl(this.navContext, {
                    type: 'textPage',
                    attributes: { textId: f.id }
                })
            };
        });
    }

    handleNavigation(event) {
        event.preventDefault();
        navigate(this.navContext, {
            type: 'textPage',
            attributes: { textId: event.currentTarget.dataset.id }
        });
    }

    handleSearch(event) {
        this.searchTerm = event.currentTarget.value;
        this.updateSearchResults();
    }
}
