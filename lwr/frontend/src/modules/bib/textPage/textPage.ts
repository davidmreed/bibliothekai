import { LightningElement, wire } from 'lwc';
import { PageReference, CurrentPageReference, navigate, NavigationContext, ContextId } from 'lwr/navigation';
import { graphQL } from 'bib/api';
import { Breadcrumb } from 'bib/breadcrumbs';
import { GetTextDetailsQuery, GetTextDetailsQueryVariables } from 'src/gql';
import { SortDirection } from 'bib/dataTable';

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

interface Attributes {
    textId: string;
}

export interface FilterState {
    filterIntroduction?: boolean;
    filterNotes?: boolean;
    filterCommentary?: boolean;
    filterGlossary?: boolean;
    filterIndex?: boolean;
    filterBibliography?: boolean;
    filterMaps?: boolean;
    filterSamplePassage?: boolean;
    filterFacingText?: boolean;
    filterFormat?: "PR" | "VR";
    filterLanguage?: string;
    filterComplete?: boolean;
}

interface PageReferenceState extends FilterState {
    sortColumn?: string;
    sortDirection?: SortDirection;
}

const FILTER_STATE_BOOLEAN_PROPS = ["filterIntroduction", "filterNotes", "filterCommentary",
    "filterGlossary", "filterIndex", "filterBibliography", "filterMaps", "filterSamplePassage",
    "filterFacingText"];

function stateFromPageReference(pr: PageReference): FilterState {
    let state: FilterState = {};

    for (const prop of FILTER_STATE_BOOLEAN_PROPS) {
        if (prop in pr.state) {
            state[prop] = true; // TODO: why does this warn?
        }
    }

    if (
        "filterFormat" in pr.state &&
        (pr.state.filterFormat === "Prose" || pr.state.filterFormat === "Verse")
    ) {
        state.filterFormat = pr.state.filterFormat === "Prose" ? "PR" : "VR";
    }
    if ("filterLanguage" in pr.state) {
        state.filterLanguage = pr.state.filterLanguage;
    }

    return state;
}

function pageReferenceFromState(s: FilterState): Record<string, any> {
    let stateMap: Record<string, any> = {};

    for (const prop of FILTER_STATE_BOOLEAN_PROPS) {
        // FIXME: if we don't do this, we get phantom props 
        // because they are in s, but set to undefined.
        if (prop in s && s[prop] !== undefined) {
            stateMap[prop] = true;
        }
    }

    if (
        "filterFormat" in s &&
        (s.filterFormat === "PR" || s.filterFormat === "VR")
    ) {
        stateMap.filterFormat = s.filterFormat === "PR" ? "Prose" : "Verse";
    }
    if ("filterLanguage" in s) {
        stateMap.filterLanguage = s.filterLanguage;
    }

    return stateMap;
}


export default class TextPage extends LightningElement {
    @wire(CurrentPageReference)
    setPageReference(pageReference: PageReference | null) {
        this.pageReference = pageReference;

        if (this.pageReference) {
            // Parse GraphQL parameters out of our pageReference attributes.
            this.queryParameters = {
                textId: this.pageReference.attributes.textId
            };

            // Parse sort and filter data out of our pageReference state.
            this.filterState = stateFromPageReference(this.pageReference);
            // These values just do nothing if they're invalid (as supplied by the user).
            this.sortColumn = this.pageReference.state.sortColumn;
            this.sortDirection = this.pageReference.state.sortDirection
        }
    }
    pageReference: PageReference;
    @wire(NavigationContext) navContext: ContextId;

    text: Text | null = null;
    queryParameters: GetTextDetailsQueryVariables | null = null;
    loaded: boolean = false;
    sortColumn: string | null = null;
    sortDirection: SortDirection = SortDirection.Ascending;
    filterState: FilterState = {}

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

    handleFilterChange(event: CustomEvent<FilterState>) {
        // Convert filter data back into URL parameters and fire a navigation event.
        // Then, `connectedCallback()` will re-capture those parameters and cascade updates down
        // through the component tree.

        let state: PageReferenceState = {
            sortColumn: this.sortColumn || undefined, // FIXME: gross
            sortDirection: this.sortDirection,
            ...pageReferenceFromState(event.detail)
        };

        navigate(this.navContext, {
            ...this.pageReference,
            state: state
        });
    }

    handleSort(event: CustomEvent<{ sortColumn: string, sortDirection: SortDirection }>) {
        let state: PageReferenceState = {
            sortColumn: event.detail.sortColumn,
            sortDirection: event.detail.sortDirection,
            ...pageReferenceFromState(this.filterState)
        };

        navigate(this.navContext, {
            ...this.pageReference,
            state: state
        });
    };
}
