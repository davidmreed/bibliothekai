import { getRecordApiUrl } from './api/index.js';

const FEATURE_TRANSLATION = 'Translation';
const FEATURE_EDITED = 'Edited';

function createFeature(feature, uiExpanded) {
  return {
    persons: [],
    language: '',
    description: '',
    feature,
    sameAsTranslation: false,
    uiExpanded: !!uiExpanded
  };
}

function createTranslationFeature(uiExpanded) {
  return {
    ...createFeature(FEATURE_TRANSLATION, uiExpanded),
    partial: false,
    format: 'Prose',
    samplePassage: '',
    title: '',
    hasFacingText: false,
    originalPublicationDate: null
  };
}

function createFeatures(id) {
  return {
    id,
    features: [],
    defaultLanguage: '',
    text: ''
  };
}

function isFeatureValid(feature) {
  if (feature.feature === FEATURE_EDITED) {
    return !!feature.persons?.length;
  }

  return (
    (!!feature.persons?.length && !!feature.language) || feature.sameAsTranslation
  );
}

function isFeaturesValid(features) {
  return (features.features || []).reduce(
    (prev, cur) => prev && isFeatureValid(cur),
    true
  );
}

function hasFeature(features, featureName) {
  return (features.features || []).some((f) => f.feature === featureName);
}

function getFeature(features, featureName) {
  return (features.features || []).find((f) => f.feature === featureName);
}

function addFeature(features, featureName, uiExpanded) {
  const newFeature =
    featureName === FEATURE_TRANSLATION
      ? createTranslationFeature(uiExpanded)
      : createFeature(featureName, uiExpanded);

  if (features.defaultLanguage) {
    newFeature.language = features.defaultLanguage;
  }

  return {
    ...features,
    features: [...features.features, newFeature]
  };
}

function removeFeature(features, featureName) {
  return {
    ...features,
    features: features.features.filter((f) => f.feature !== featureName)
  };
}

function replaceFeature(features, updatedFeature) {
  return {
    ...features,
    features: features.features.map((f) =>
      f.feature === updatedFeature.feature ? updatedFeature : f
    )
  };
}

function featureToJson(feature, translation) {
  let persons;
  let language;

  if (translation && feature.sameAsTranslation) {
    persons = translation.persons;
    language = translation.language;
  } else {
    persons = feature.persons;
    language = feature.language;
  }

  const js = {
    persons: (persons || []).map((a) => getRecordApiUrl('persons', a)),
    language: getRecordApiUrl('languages', language),
    feature: feature.feature
  };

  if (feature.description) {
    js.description = feature.description;
  }

  return js;
}

function translationFeatureToJson(feature) {
  const js = featureToJson(feature);

  js.partial = feature.partial;
  js.format = feature.format;
  js.has_facing_text = feature.hasFacingText;
  js.original_publication_date = feature.originalPublicationDate;
  if (feature.samplePassage) {
    js.sample_passage = feature.samplePassage;
  }
  if (feature.title) {
    js.title = feature.title;
  }

  return js;
}

function getFeaturesPayload(features, volumeId) {
  const translation = getFeature(features, FEATURE_TRANSLATION);
  const items = (features.features || []).map((feature) =>
    feature.feature === FEATURE_TRANSLATION
      ? translationFeatureToJson(feature)
      : featureToJson(feature, translation)
  );
  const volumeUrl = getRecordApiUrl('volumes', volumeId);
  const textUrl = features.text ? getRecordApiUrl('texts', features.text) : null;

  items.forEach((f) => {
    f.volume = volumeUrl;
    if (textUrl) {
      f.text = textUrl;
    }
  });

  return items;
}

export {
  FEATURE_TRANSLATION,
  FEATURE_EDITED,
  createFeature,
  createTranslationFeature,
  createFeatures,
  isFeatureValid,
  isFeaturesValid,
  hasFeature,
  getFeature,
  addFeature,
  removeFeature,
  replaceFeature,
  getFeaturesPayload
};
