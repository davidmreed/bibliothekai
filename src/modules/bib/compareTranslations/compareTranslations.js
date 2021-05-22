import { runGraphQLQuery, getRecordUiUrl } from 'bib/drf';
import { LightningElement } from 'lwc';

export default class CompareTranslations extends LightningElement {
    recordId;
    data;
    error;

    async connectedCallback() {
        const regex = /texts\/([0-9]+)\//;
        const loc = document.location.pathname;
        const textIdMatch = loc.match(regex);

        if (textIdMatch && textIdMatch.length === 2) {
            this.recordId = [Number(textIdMatch[1])];
        }
        // TODO: error handling.

        try {
            let query = `
            {
                text(id: ${this.recordId}) {
                    title
                    samplePassage
                    samplePassageSource
                    samplePassageSourceLink
                    samplePassageLicense
                    samplePassageLicenseLink    
                    translations {
                        id
                        samplePassage
                        volume {
                            id
                            title
                            publisher {
                                name
                            }
                            publishedDate
                        }
                        persons {
                            id
                            fullName
                        }
                    }
                }
            }
            `; // FIXME: graphQL variables.
            let result = await runGraphQLQuery(query);
            this.data = result.data;

            // Add links for the Volume and all Persons.
            for (let trans of this.data.text.translations) {
                trans.volume.url = getRecordUiUrl('volumes', trans.volume.id);
                trans.personsLinks = trans.persons.map((p) => ({
                    name: p.fullName,
                    href: getRecordUiUrl('persons', p.id),
                    id: p.id
                }));
            }
        } catch (e) {
            this.error = e;
        }
    }
}
