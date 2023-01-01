import { LightningElement, api, track, wire } from 'lwc';
import {
    CurrentPageReference,
    generateUrl,
    NavigationContext
} from 'lwr/navigation';
import { GetVolumeDetailsQuery, GetVolumeDetailsQueryVariables } from '../gql)';
import { graphQL } from 'bib/api';

const VOLUME_DETAILS_QUERY = /* GraphQL */ `
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
                    id
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
`;

// TODO: alternate names + links

class VolumeElementResource {
    resourceType;
    persons;
    language;
    id;

    constructor(id, resourceType, persons, language, navContext) {
        this.id = id;
        this.resourceType = resourceType;
        this.persons = data.persons
            .map((f) => ({
                title: f.fullName,
                pageReference: {
                    pageType: 'volumeListPage',
                    attributes: { authorId: f.id }
                }
            }))
            .map((p) => ({
                url: generateUrl(navContext, p.pageReference),
                ...p
            }));
        this.language = language;
    }
}

class VolumeElementTranslation {
    format;
    language;
    persons;
    title;
    partial;

    constructor(data, navContext) {
        this.feature = data.feature;
        this.language = data.language;
        this.persons = data.persons
            .map((f) => ({
                title: f.fullName,
                pageReference: {
                    pageType: 'volumeListPage',
                    attributes: { authorId: f.id }
                }
            }))
            .map((p) => ({
                url: generateUrl(navContext, p.pageReference),
                ...p
            }));
        this.title = data.title;
        this.partial = data.partial;
        this.format = data.format;
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

    constructor(data, navContext) {
        // process the inbound data from GraphQL into something easier to work with.
        // First, find all of the volume data
        for (let key of [
            'title',
            'description',
            'isbn',
            'publisher',
            'featureGlossary',
            'featureIndex',
            'featureBibliography',
            'featureMaps',
            'publishedDate'
        ]) {
            this[key] = data[key];
        }

        // Now, group the features by source text and construct VolumeElements for them.
        let translationFeatures = data.features.filter(
            (f) => f.feature === 'TR'
        );
        let otherFeatures = data.features.filter((f) => f.feature !== 'TR');
        let elements = {};

        for (let feature of translationFeatures) {
            elements[feature.sourceText] = new VolumeElement(
                feature.sourceText,
                new VolumeElementTranslation(feature, navContext)
            );
        }
        for (let feature of otherFeatures) {
            let element = elements[feature.sourceText];
            element.resources.push(
                new VolumeElementResource(
                    feature.id,
                    feature.feature,
                    feature.persons,
                    feature.language,
                    navContext
                )
            );
        }

        this.elements = Array.from(Object.values(elements));
    }
}

interface Crumb {
    title: string;
    pageReference: PageReference;
    currentPage: boolean;
    url: string | null;
}

export default class VolumePage extends LightningElement {
    @wire(CurrentPageReference) pageReference;
    @wire(NavigationContext) navContext;

    volume;
    crumbs: Crumb[] = [];
    queryParameters: GetVolumeDetailsQueryVariables;

    @wire(graphQL, {
        query: VOLUME_DETAILS_QUERY,
        variables: '$queryParameters'
    })
    provisionVolume({ data: GetVolumeDetailsQuery, error }) {
        console.log(JSON.stringify(data));
        if (data) {
            this.volume = new Volume(data.volume, this.navContext);
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
                    type: 'volumeListPage',
                    attributes: { publisherId: this.volume.publisher.id }
                },
                title: this.volume.publisher.name
            },
            {
                pageReference: {
                    type: 'volumePage',
                    attributes: { volumeId: String(this.volume.id) }
                },
                title: this.volume.title,
                currentPage: true
            }
        ].map((p) => ({
            url: generateUrl(this.navContext, p.pageReference),
            ...p
        }));
    }

    connectedCallback() {
        this.queryParameters = {
            volumeId: Number(this.pageReference.attributes.volumeId)
        };
    }
}
