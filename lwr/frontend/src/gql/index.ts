export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Date: any;
};

export type Query = {
  __typename?: 'Query';
  languages: Array<Language>;
  persons: Array<Person>;
  publishedReviews: Array<PublishedReview>;
  publishers: Array<Publisher>;
  reviews: Array<Review>;
  series: Array<Series>;
  text: Maybe<Text>;
  texts: Array<Text>;
  volume: Maybe<Volume>;
  volumeResources: Array<VolumeResource>;
  volumes: Array<Volume>;
  volumesBy: Array<Maybe<Volume>>;
};


export type QueryTextArgs = {
  id: Scalars['String'];
};


export type QueryVolumeArgs = {
  id: Scalars['String'];
};


export type QueryVolumesByArgs = {
  entityId: Scalars['String'];
  entityName: Scalars['String'];
};

export type Language = {
  __typename?: 'Language';
  id: Scalars['ID'];
  name: Scalars['String'];
  sourceTexts: Array<Text>;
};

export type Text = {
  __typename?: 'Text';
  author: Person;
  date: Scalars['String'];
  description: Scalars['String'];
  format: TranslationsSourceTextFormatChoices;
  id: Scalars['ID'];
  language: Language;
  samplePassage: Scalars['String'];
  samplePassageLicense: Scalars['String'];
  samplePassageLicenseLink: Maybe<Scalars['String']>;
  samplePassageSource: Scalars['String'];
  samplePassageSourceLink: Maybe<Scalars['String']>;
  samplePassageSpec: Scalars['String'];
  title: Scalars['String'];
  translations: Array<Maybe<VolumeResource>>;
};

export type Person = {
  __typename?: 'Person';
  dateCreated: Scalars['DateTime'];
  description: Scalars['String'];
  features: Array<VolumeResource>;
  firstName: Scalars['String'];
  fullName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  middleName: Scalars['String'];
  publishedReviews: Array<PublishedReview>;
  soleName: Scalars['String'];
  sortName: Maybe<Scalars['String']>;
  sourceTexts: Array<Text>;
};

export type VolumeResource = {
  __typename?: 'VolumeResource';
  description: Scalars['String'];
  feature: TranslationsFeatureFeatureChoices;
  featureAccompanyingCommentary: Scalars['Boolean'];
  featureAccompanyingIntroduction: Scalars['Boolean'];
  featureAccompanyingNotes: Scalars['Boolean'];
  featureFacingText: Scalars['Boolean'];
  featureSamplePassage: Scalars['Boolean'];
  format: Maybe<TranslationsFeatureFormatChoices>;
  id: Scalars['ID'];
  language: Language;
  originalPublicationDate: Maybe<Scalars['Date']>;
  partial: Scalars['Boolean'];
  persons: Array<Person>;
  samplePassage: Scalars['String'];
  sourceText: Maybe<Text>;
  title: Scalars['String'];
  volume: Volume;
};

/** An enumeration. */
export enum TranslationsFeatureFeatureChoices {
  /** Commentary */
  Cm = 'CM',
  /** Edited */
  Ed = 'ED',
  /** Introduction */
  In = 'IN',
  /** Notes */
  Nt = 'NT',
  /** Translation */
  Tr = 'TR'
}

/** An enumeration. */
export enum TranslationsFeatureFormatChoices {
  /** Prose */
  Pr = 'PR',
  /** Verse */
  Vr = 'VR'
}

export type Volume = {
  __typename?: 'Volume';
  dateCreated: Scalars['DateTime'];
  description: Scalars['String'];
  featureBibliography: Scalars['Boolean'];
  featureGlossary: Scalars['Boolean'];
  featureIndex: Scalars['Boolean'];
  featureMaps: Scalars['Boolean'];
  features: Array<VolumeResource>;
  id: Scalars['ID'];
  isbn: Scalars['String'];
  oclcNumber: Scalars['String'];
  publishedDate: Scalars['Date'];
  publishedReviews: Array<PublishedReview>;
  publisher: Publisher;
  reviews: Array<Review>;
  series: Maybe<Series>;
  title: Scalars['String'];
};

export type PublishedReview = {
  __typename?: 'PublishedReview';
  dateCreated: Scalars['DateTime'];
  id: Scalars['ID'];
  location: Scalars['String'];
  persons: Array<Person>;
  publishedDate: Maybe<Scalars['Date']>;
  title: Scalars['String'];
  volumes: Array<Volume>;
};

export type Publisher = {
  __typename?: 'Publisher';
  dateCreated: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  volumes: Array<Volume>;
};

export type Review = {
  __typename?: 'Review';
  closenessRating: Maybe<TranslationsReviewClosenessRatingChoices>;
  content: Scalars['String'];
  dateCreated: Scalars['DateTime'];
  id: Scalars['ID'];
  readabilityRating: Maybe<TranslationsReviewReadabilityRatingChoices>;
  recommended: Scalars['Boolean'];
  title: Scalars['String'];
  volume: Volume;
};

/** An enumeration. */
export enum TranslationsReviewClosenessRatingChoices {
  /** Low */
  A_1 = 'A_1',
  /** Average */
  A_2 = 'A_2',
  /** Excellent */
  A_3 = 'A_3'
}

/** An enumeration. */
export enum TranslationsReviewReadabilityRatingChoices {
  /** Low */
  A_1 = 'A_1',
  /** Average */
  A_2 = 'A_2',
  /** Excellent */
  A_3 = 'A_3'
}

export type Series = {
  __typename?: 'Series';
  dateCreated: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  volumes: Array<Volume>;
};

/** An enumeration. */
export enum TranslationsSourceTextFormatChoices {
  /** Prose */
  Pr = 'PR',
  /** Verse */
  Vr = 'VR'
}

/**
 * One possible value for a given Enum. Enum values are unique values, not a
 * placeholder for a string or numeric value. However an Enum value is returned in
 * a JSON response as a string.
 */
export type __EnumValue = {
  __typename?: '__EnumValue';
  name: Scalars['String'];
  description: Maybe<Scalars['String']>;
  isDeprecated: Scalars['Boolean'];
  deprecationReason: Maybe<Scalars['String']>;
};

/**
 * Object and Interface types are described by a list of Fields, each of which has
 * a name, potentially a list of arguments, and a return type.
 */
export type __Field = {
  __typename?: '__Field';
  name: Scalars['String'];
  description: Maybe<Scalars['String']>;
  args: Array<__InputValue>;
  type: __Type;
  isDeprecated: Scalars['Boolean'];
  deprecationReason: Maybe<Scalars['String']>;
};

/**
 * Arguments provided to Fields or Directives and the input fields of an
 * InputObject are represented as Input Values which describe their type and
 * optionally a default value.
 */
export type __InputValue = {
  __typename?: '__InputValue';
  name: Scalars['String'];
  description: Maybe<Scalars['String']>;
  type: __Type;
  /** A GraphQL-formatted string representing the default value for this input value. */
  defaultValue: Maybe<Scalars['String']>;
};

/**
 * The fundamental unit of any GraphQL Schema is the type. There are many kinds of
 * types in GraphQL as represented by the `__TypeKind` enum.
 *
 * Depending on the kind of a type, certain fields describe information about that
 * type. Scalar types provide no information beyond a name and description, while
 * Enum types provide their values. Object and Interface types provide the fields
 * they describe. Abstract types, Union and Interface, provide the Object types
 * possible at runtime. List and NonNull types compose other types.
 */
export type __Type = {
  __typename?: '__Type';
  kind: __TypeKind;
  name: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  fields: Maybe<Array<__Field>>;
  interfaces: Maybe<Array<__Type>>;
  possibleTypes: Maybe<Array<__Type>>;
  enumValues: Maybe<Array<__EnumValue>>;
  inputFields: Maybe<Array<__InputValue>>;
  ofType: Maybe<__Type>;
};


/**
 * The fundamental unit of any GraphQL Schema is the type. There are many kinds of
 * types in GraphQL as represented by the `__TypeKind` enum.
 *
 * Depending on the kind of a type, certain fields describe information about that
 * type. Scalar types provide no information beyond a name and description, while
 * Enum types provide their values. Object and Interface types provide the fields
 * they describe. Abstract types, Union and Interface, provide the Object types
 * possible at runtime. List and NonNull types compose other types.
 */
export type __TypeFieldsArgs = {
  includeDeprecated?: InputMaybe<Scalars['Boolean']>;
};


/**
 * The fundamental unit of any GraphQL Schema is the type. There are many kinds of
 * types in GraphQL as represented by the `__TypeKind` enum.
 *
 * Depending on the kind of a type, certain fields describe information about that
 * type. Scalar types provide no information beyond a name and description, while
 * Enum types provide their values. Object and Interface types provide the fields
 * they describe. Abstract types, Union and Interface, provide the Object types
 * possible at runtime. List and NonNull types compose other types.
 */
export type __TypeEnumValuesArgs = {
  includeDeprecated?: InputMaybe<Scalars['Boolean']>;
};

/** An enum describing what kind of type a given `__Type` is. */
export enum __TypeKind {
  /** Indicates this type is a scalar. */
  Scalar = 'SCALAR',
  /** Indicates this type is an object. `fields` and `interfaces` are valid fields. */
  Object = 'OBJECT',
  /** Indicates this type is an interface. `fields` and `possibleTypes` are valid fields. */
  Interface = 'INTERFACE',
  /** Indicates this type is a union. `possibleTypes` is a valid field. */
  Union = 'UNION',
  /** Indicates this type is an enum. `enumValues` is a valid field. */
  Enum = 'ENUM',
  /** Indicates this type is an input object. `inputFields` is a valid field. */
  InputObject = 'INPUT_OBJECT',
  /** Indicates this type is a list. `ofType` is a valid field. */
  List = 'LIST',
  /** Indicates this type is a non-null. `ofType` is a valid field. */
  NonNull = 'NON_NULL'
}

export type GetTextsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTextsQuery = { __typename?: 'Query', texts: Array<{ __typename?: 'Text', id: string, title: string, author: { __typename?: 'Person', id: string, fullName: string } }> };

export type GetTextDetailsQueryVariables = Exact<{
  textId: Scalars['String'];
}>;


export type GetTextDetailsQuery = { __typename?: 'Query', __type: { __typename?: '__Type', enumValues: Array<{ __typename?: '__EnumValue', name: string, description: string | null }> | null } | null, text: { __typename?: 'Text', id: string, title: string, format: TranslationsSourceTextFormatChoices, date: string, description: string, author: { __typename?: 'Person', id: string, fullName: string }, language: { __typename?: 'Language', name: string }, translations: Array<{ __typename?: 'VolumeResource', id: string, originalPublicationDate: any | null, format: TranslationsFeatureFormatChoices | null, partial: boolean, featureSamplePassage: boolean, featureAccompanyingNotes: boolean, featureAccompanyingCommentary: boolean, featureAccompanyingIntroduction: boolean, featureFacingText: boolean, language: { __typename?: 'Language', id: string, name: string }, volume: { __typename?: 'Volume', id: string, title: string, publishedDate: any, featureGlossary: boolean, featureBibliography: boolean, featureMaps: boolean, featureIndex: boolean, publisher: { __typename?: 'Publisher', name: string } }, persons: Array<{ __typename?: 'Person', id: string, fullName: string, sortName: string | null }> } | null> } | null };

export type GetVolumesByEntityQueryVariables = Exact<{
  entityType: Scalars['String'];
  entityId: Scalars['String'];
}>;


export type GetVolumesByEntityQuery = { __typename?: 'Query', volumesBy: Array<{ __typename?: 'Volume', title: string, publishedDate: any, description: string, publisher: { __typename?: 'Publisher', id: string, name: string }, series: { __typename?: 'Series', id: string, name: string } | null, features: Array<{ __typename?: 'VolumeResource', feature: TranslationsFeatureFeatureChoices, format: TranslationsFeatureFormatChoices | null, partial: boolean, persons: Array<{ __typename?: 'Person', id: string, fullName: string }> }> } | null> };

export type GetVolumeDetailsQueryVariables = Exact<{
  volumeId: Scalars['String'];
}>;


export type GetVolumeDetailsQuery = { __typename?: 'Query', volume: { __typename?: 'Volume', id: string, title: string, description: string, isbn: string, featureGlossary: boolean, featureIndex: boolean, featureBibliography: boolean, featureMaps: boolean, publishedDate: any, publisher: { __typename?: 'Publisher', id: string, name: string }, series: { __typename?: 'Series', id: string, name: string } | null, features: Array<{ __typename?: 'VolumeResource', id: string, title: string, feature: TranslationsFeatureFeatureChoices, partial: boolean, format: TranslationsFeatureFormatChoices | null, featureFacingText: boolean, samplePassage: string, persons: Array<{ __typename?: 'Person', id: string, fullName: string }>, language: { __typename?: 'Language', id: string, name: string }, sourceText: { __typename?: 'Text', id: string, title: string, format: TranslationsSourceTextFormatChoices, author: { __typename?: 'Person', id: string, fullName: string }, language: { __typename?: 'Language', id: string, name: string } } | null }>, publishedReviews: Array<{ __typename?: 'PublishedReview', location: string, publishedDate: any | null, title: string, persons: Array<{ __typename?: 'Person', id: string, fullName: string }>, volumes: Array<{ __typename?: 'Volume', id: string, title: string, publishedDate: any }> }> } | null };
