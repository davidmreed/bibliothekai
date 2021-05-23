import { runGraphQLQuery, getRecordUiUrl } from 'bib/drf';
import { LightningElement } from 'lwc';
import { oxfordCommaList } from 'bib/utils';
export default class CompareTranslations extends LightningElement {
    recordId;
    data;
    error;

    firstTranslation;
    secondTranslation;
    firstTranslationId = '';
    secondTranslationId = '';

    async connectedCallback() {
        const regex = /texts\/([0-9]+)\/translations(?:\/?([0-9,]+)?)/;
        const loc = document.location.pathname;
        const textIdMatch = loc.match(regex);

        if (textIdMatch) {
            if (textIdMatch.length >= 2) {
                this.recordId = [Number(textIdMatch[1])];
            }
            if (textIdMatch.length >= 3 && textIdMatch[2]) {
                let translationIds = textIdMatch[2].split(',');
                if (translationIds.length >= 1) {
                    this.firstTranslationId = translationIds[0];
                }
                if (translationIds.length >= 2) {
                    this.secondTranslationId = translationIds[1];
                }
            }
        } else {
            this.error = 'The URL is not valid';
            return;
        }

        try {
            let query = `
            {
                text(id: ${this.recordId}) {
                    id
                    title
                    samplePassage
                    samplePassageSource
                    samplePassageSourceLink
                    samplePassageLicense
                    samplePassageLicenseLink    
                    translations {
                        id
                        title
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

            this.data.text.url = getRecordUiUrl('texts', this.data.text.id);

            // Enrich data with URLs and presentation strings.
            for (let trans of this.data.text.translations) {
                trans.volume.url = getRecordUiUrl('volumes', trans.volume.id);
                trans.title = trans.title || trans.volume.title;
                trans.personsLinks = trans.persons.map((p) => ({
                    name: p.fullName,
                    href: getRecordUiUrl('persons', p.id),
                    id: p.id
                }));
                let dateString = '';
                if (trans.volume.publishedDate) {
                    trans.volume.publishedYear = trans.volume.publishedDate.substring(
                        0,
                        4
                    );
                    dateString = `,  ${trans.volume.publishedYear}`;
                }
                let transString = oxfordCommaList(
                    trans.persons.map((p) => p.fullName)
                );

                trans.displayName = `${trans.volume.title} (${trans.volume.publisher.name}${dateString}), trans. ${transString}`;
            }
            // If we have prepopulated Ids, set the current translation values.
            if (this.firstTranslationId) {
                this.firstTranslation = this.translationById(
                    this.firstTranslationId
                );
            }
            if (this.secondTranslationId) {
                this.secondTranslation = this.translationById(
                    this.secondTranslationId
                );
            }
        } catch (e) {
            this.error = e;
        }
    }

    renderedCallback() {
        // Deal with race conditions.
        this.template.querySelector(
            "select[name='firstTranslation']"
        ).value = this.firstTranslationId;
        this.template.querySelector(
            "select[name='secondTranslation']"
        ).value = this.secondTranslationId;
    }

    translationById(id) {
        return this.data.text.translations.filter((f) => f.id === id)[0];
    }

    handleChange(event) {
        let selectedTranslation = this.translationById(
            event.currentTarget.selectedOptions[0].value
        );

        if (event.currentTarget.name === 'firstTranslation') {
            this.firstTranslation = selectedTranslation;
            this.firstTranslationId = selectedTranslation.id;
        } else {
            this.secondTranslation = selectedTranslation;
            this.secondTranslationId = selectedTranslation.id;
        }

        let idString = '';

        if (this.firstTranslationId) {
            idString = `/${this.firstTranslationId}`;
            if (this.secondTranslationId) {
                idString += `,${this.secondTranslationId}`;
            }
        } else {
            if (this.secondTranslationId) {
                idString = `/,${this.secondTranslationId}`;
            }
        }

        window.history.pushState(
            {},
            '',
            `/texts/${this.recordId}/translations${idString}`
        );
    }
}
