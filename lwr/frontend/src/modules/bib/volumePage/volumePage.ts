import { LightningElement, wire } from 'lwc';
import {
    CurrentPageReference,
    PageReference,
} from 'lwr/navigation';
import { GetVolumeDetailsQuery, GetVolumeDetailsQueryVariables } from 'src/gql';
import { graphQL } from 'bib/api';
import { Breadcrumb } from 'bib/breadcrumbs';

const VOLUME_DETAILS_QUERY = /* GraphQL */ `
    query getVolumeDetails($volumeId: String) {
        volume(id: $volumeId) {
            id
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

    constructor(id, resourceType, persons, language) {
        this.id = id;
        this.resourceType = resourceType;
        this.persons = persons
            .map((f) => ({
                title: f.fullName,
                pageReference: {
                    pageType: 'authorPage',
                    attributes: { authorId: f.id }
                }
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

    constructor(data) {
        this.feature = data.feature;
        this.language = data.language;
        this.persons = data.persons
            .map((f) => ({
                title: f.fullName,
                pageReference: {
                    pageType: 'authorPage',
                    attributes: { authorId: f.id }
                }
            }));
        this.title = data.title;
        this.partial = data.partial;
        this.format = data.format;
    }
}

class VolumeElement {
    sourceText;
    translation: VolumeElementTranslation;
    resources: VolumeElementResource[];

    constructor(sourceText, translation) {
        this.sourceText = sourceText;
        this.translation = translation;
        this.resources = [];
    }
}

type Volume = GetVolumeDetailsQuery["volume"];

export default class VolumePage extends LightningElement {
    @wire(CurrentPageReference) pageReference: PageReference;

    volume: Volume | null = null;
    volumeElements: VolumeElement[] = [];
    queryParameters: GetVolumeDetailsQueryVariables | null = null;

    @wire(graphQL, {
        query: VOLUME_DETAILS_QUERY,
        variables: '$queryParameters'
    })
    provisionVolume({ data, error }: { data: GetVolumeDetailsQuery, error: any }) {
        if (data && data.volume) {
            this.volume = data.volume;
            this.updateVolumeElements();
        } else {
            alert(`Got an error: ${JSON.stringify(error)}`);
        }
    }

    updateVolumeElements() {
        // Now, group the features by source text and construct VolumeElements for them.
        if (!this.volume) {
            return;
        }

        let translationFeatures = this.volume.features.filter(
            (f) => f.feature === 'TR' && f.sourceText
        );
        let otherFeatures = this.volume.features.filter((f) => f.feature !== 'TR' && f.sourceText);
        let elements: Record<string, VolumeElement> = {};

        for (let feature of translationFeatures) {
            elements[feature.sourceText.id] = new VolumeElement(
                feature.sourceText,
                new VolumeElementTranslation(feature)
            );
        }
        for (let feature of otherFeatures) {
            let element = elements[feature.sourceText.id];
            element.resources.push(
                new VolumeElementResource(
                    feature.id,
                    feature.feature,
                    feature.persons,
                    feature.language,
                )
            );
        }

        this.volumeElements = Array.from(Object.values(elements));
    }

    get crumbs(): Breadcrumb[] {
        return [
            { pageReference: { type: 'home' }, title: 'Home', currentPage: false },
            {
                pageReference: {
                    type: 'publisherPage',
                    attributes: { publisherId: this.volume?.publisher.id }
                },
                title: this.volume?.publisher.name || '',
                currentPage: false
            },
            {
                pageReference: {
                    type: 'volumePage',
                    attributes: { volumeId: this.volume?.id }
                },
                title: this.volume?.title || '',
                currentPage: true
            }
        ];
    }

    connectedCallback() {
        this.queryParameters = {
            volumeId: this.pageReference.attributes.volumeId
        };
    }
}
