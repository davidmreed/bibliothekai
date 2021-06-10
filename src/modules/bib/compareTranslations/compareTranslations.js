import { graphQL, getRecordUiUrl } from 'bib/api';
import { LightningElement, track, wire } from 'lwc';
import { oxfordCommaList } from 'bib/utils';

const COMPARISON_GRAPHQL_QUERY = `
query getTranslations($textId: Int) {
    text(id: $textId) {
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
`;

export default class CompareTranslations extends LightningElement {
    data;
    error;
    parameters;
    showOriginal = true;

    @track
    translations = [];
    translationIds;

    @wire(graphQL, {
        query: COMPARISON_GRAPHQL_QUERY,
        variables: '$parameters'
    })
    provision({ data, error }) {
        if (data) {
            this.data = data.data;

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

            this.translations = this.translationIds
                .map((t) => this.translationById(t))
                .filter((t) => !!t);

            if (this.availableTranslations.length) {
                this.addTranslation();
            }
        }
        if (error) {
            this.error = error;
        }
    }

    async connectedCallback() {
        const regex = /texts\/([0-9]+)\/translations/;
        const loc = document.location.pathname;
        const textIdMatch = loc.match(regex);
        const urlQuery = new URLSearchParams(document.location.search);

        if (textIdMatch) {
            if (textIdMatch.length >= 2) {
                this.parameters = { textId: Number(textIdMatch[1]) };
            }

            this.translationIds = urlQuery.getAll('trans') || [];
            if (urlQuery.has('hideOriginal')) {
                this.showOriginal = false;
            }
        } else {
            this.error = 'The URL is not valid';
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
