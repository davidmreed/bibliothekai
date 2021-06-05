import { runGraphQLQuery, getRecordUiUrl } from 'bib/drf';
import { LightningElement, track } from 'lwc';
import { oxfordCommaList } from 'bib/utils';

export default class CompareTranslations extends LightningElement {
    recordId;
    data;
    error;
    showOriginal = true;

    @track
    translations = [];

    async connectedCallback() {
        const regex = /texts\/([0-9]+)\/translations/;
        const loc = document.location.pathname;
        const textIdMatch = loc.match(regex);

        if (textIdMatch) {
            if (textIdMatch.length >= 2) {
                this.recordId = [Number(textIdMatch[1])];
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

            const urlQuery = new URLSearchParams(document.location.search);

            this.translations = urlQuery
                .getAll('trans')
                .map((t) => this.translationById(t))
                .filter((t) => !!t);

            if (this.availableTranslations.length) {
                this.addTranslation();
            }

            if (urlQuery.has('hideOriginal')) {
                this.showOriginal = false;
            }
        } catch (e) {
            this.error = e;
        }
    }

    get availableTranslations() {
        let claimedIds = this.translations.map((t) => t.id);
        return this.data.text.translations.filter(
            (t) => !!t.samplePassage && !claimedIds.includes(t.id)
        );
    }

    translationById(id) {
        return this.data.text.translations.filter((f) => f.id === id)[0];
    }

    handleChange(event) {
        let selectedTranslation = this.translationById(
            event.currentTarget.selectedOptions[0].value
        );
        let desiredIndex = event.currentTarget.name;

        this.translations[desiredIndex] = selectedTranslation;
        this.updateHistoryState();

        if (
            this.availableTranslations.length &&
            !this.translations.map((t) => t.id).includes('')
        ) {
            this.addTranslation();
        }
    }

    handleShowHideOriginal() {
        this.showOriginal = !this.showOriginal;
        this.updateHistoryState();
    }

    addTranslation() {
        this.translations.push({ id: '' });
    }

    handleRemoveTranslation(event) {
        let id = event.currentTarget.dataset.id;

        this.translations = this.translations.filter((t) => t.id !== id);
        this.updateHistoryState();

        if (
            this.availableTranslations.length &&
            !this.translations.map((t) => t.id).includes('')
        ) {
            this.addTranslation();
        }
    }

    updateHistoryState() {
        let idString =
            '?' +
            this.translations
                .filter((t) => !!t.id)
                .map((t) => `trans=${t.id}`)
                .join('&');

        if (!this.showOriginal) {
            idString += '&hideOriginal=true';
        }

        window.history.replaceState(
            null,
            null,
            `/texts/${this.recordId}/translations${idString}`
        );
    }
}
