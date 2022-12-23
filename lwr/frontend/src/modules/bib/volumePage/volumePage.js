import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference, generateUrl, NavigationContext } from 'lwr/navigation';
import { graphQL } from 'bib/api';

const VOLUME_DETAILS_QUERY = `
query getVolumeDetails($volumeId: Int) {
    volume(id: $volumeId) {
        title
        publisher {
            id
            name
        }
        series {
            id
            name
        }
        description
        isbn
        featureGlossary
        featureIndex
        featureBibliography
        featureMaps
        features {
            id
            title
            persons {
                id
                fullName
            }
            language {
                id
                name
            }
            feature
            partial
            format
            featureFacingText
            samplePassage
            sourceText {
                title
                author {
                    id
                    fullName
                }
                language {
                    id
                    name
                }
                format
            }
        }
        publishedDate
        publishedReviews {
            persons {
                id
                fullName
            }
            volumes {
                id
                title
                publishedDate
            }
            location
            publishedDate
            title
        }
    }
}
`

// TODO: alternate names + links

class VolumeElementResource {
    resourceType;
    persons;
    language;

    constructor(resourceType, persons, language) {
        this.resourceType = resourceType;
        this.persons = persons;
        this.language = language;
    }
}

class VolumeElementTranslation {
    format;
    language;
    persons;
    title;
    partial;

    constructor(data) {
        this.feature = data.feature;
        this.language = data.language;
        this.persons = data.persons;
        this.title = data.title;
        this.partial = data.partial;
    }
}

class VolumeElement {
    sourceText;
    translation;
    resources;

    constructor(sourceText, translation) {
        this.sourceText = sourceText;
        this.translation = translation;
        this.resources = [];
    }
}

class Volume {
    title;
    description;
    isbn;
    publisher;
    featureGlossary;
    featureIndex;
    featureBibliography;
    featureMaps;
    publishedDate;

    elements;

    constructor(data) {
        // process the inbound data from GraphQL into something easier to work with.
        // First, find all of the volume data
        console.log(JSON.stringify(data));
        for (let key of ["title", "description", "isbn", "publisher", "featureGlossary", "featureIndex", "featureBibliography", "featureMaps", "publishedDate"]) {
            this[key] = data[key];
        }

        // Now, group the features by source text and construct VolumeElements for them.
        let translationFeatures = data.features.filter((f) => f.feature === 'TR');
        let otherFeatures = data.features.filter((f) => f.feature !== 'TR');
        let elements = {};

        for (let feature of translationFeatures) {
            elements[feature.sourceText] = new VolumeElement(
                feature.sourceText,
                new VolumeElementTranslation(feature)
            );
        }
        for (let feature of otherFeatures) {
            let element = elements[feature.sourceText];
            element.resources.push(new VolumeElementResource(feature.feature, feature.persons, feature.language));
        }

        this.elements = Array.from(Object.values(elements));
        console.log(JSON.stringify(this.elements));
    }
}

export default class VolumePage extends LightningElement {
    @wire(CurrentPageReference) pageReference;
    @wire(NavigationContext) navContext;

    volume;
    crumbs;
    queryParameters;

    // FIXME: the wire adapter doesn't catch returns that have the `errors` key w/a 200
    @wire(graphQL, { query: VOLUME_DETAILS_QUERY, variables: '$queryParameters' })
    provisionVolume({ data, error }) {
        if (data && data.data) {
            this.volume = new Volume(data.data.volume);
            this.updateBreadcrumbs();
        } else {
            alert(`Got an error: ${JSON.stringify(error)}`);
        }
    }

    updateBreadcrumbs() {
        this.crumbs = [
            { pageReference: { type: 'home' }, title: "Home" },
            { pageReference: { type: 'volumeListPage', attributes: { publisherId: this.volume.publisher.id } }, title: this.volume.publisher.name },
            { pageReference: { type: 'volumePage', attributes: { volumeId: String(this.volume.id) } }, title: this.volume.title, currentPage: true }
        ].map((p) => ({ url: generateUrl(this.navContext, p.pageReference), ...p }));
    }

    connectedCallback() {
        this.queryParameters = { 'volumeId': Number(this.pageReference.attributes.volumeId) };
    }
}
