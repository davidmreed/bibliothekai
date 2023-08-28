import { LightningElement, wire } from 'lwc';
import { graphQL } from 'bib/api';
import { GetTextsQuery } from 'src/gql';
import { Crumb } from 'bib/link';

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
    recordData: Crumb[] = [];
    filteredRecordData: Crumb[] = [];

    @wire(graphQL, { query: QUERY_TEXTS })
    updateRecordData({ data, error }: { data: GetTextsQuery, error: any }) {
        if (data && data.texts) {
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
        if (event.currentTarget && event.currentTarget instanceof HTMLInputElement) {
            this.searchTerm = event.currentTarget.value;
            this.updateSearchResults();
        }
    }
}
