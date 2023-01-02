import { LightningElement, wire } from 'lwc';
import { graphQL } from 'bib/api';
import { GetTextsQuery, GetTextsQueryVariables } from 'gql';

const QUERY_TEXTS = /* GraphQL */`
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
    searchTerm: string = '';
    recordData;
    filteredRecordData = [];

    // TODO
    @wire(graphQL, { query: QUERY_TEXTS })
    updateRecordData({ data, error }: { data: GetTextsQuery, error: any }) {
        if (data) {
            this.recordData = data.texts.map(
                (t) => ({
                    title: t.title, pageReference: {
                        type: 'textPage',
                        attributes: { textId: `${t.id}` }
                    }
                })
            );
            this.updateSearchResults();
        }
    }

    updateSearchResults() {
        if (this.searchTerm) {
            this.filteredRecordData = this.recordData.filter((f) =>
                f.title.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        } else {
            this.filteredRecordData = this.recordData;
        }
    }

    handleSearch(event: KeyboardEvent) {
        this.searchTerm = event.currentTarget.value;
        this.updateSearchResults();
    }
}
