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
  languages?: Maybe<Array<Language>>;
  persons?: Maybe<Array<Person>>;
  publishedReviews?: Maybe<Array<PublishedReview>>;
  publishers?: Maybe<Array<Publisher>>;
  reviews?: Maybe<Array<Review>>;
  series?: Maybe<Array<Series>>;
  text?: Maybe<Text>;
  texts?: Maybe<Array<Text>>;
  volume?: Maybe<Volume>;
  volumeResources?: Maybe<Array<VolumeResource>>;
  volumes?: Maybe<Array<Volume>>;
};


export type QueryTextArgs = {
  id?: InputMaybe<Scalars['Int']>;
};


export type QueryVolumeArgs = {
  id?: InputMaybe<Scalars['Int']>;
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
  samplePassageLicenseLink?: Maybe<Scalars['String']>;
  samplePassageSource: Scalars['String'];
  samplePassageSourceLink?: Maybe<Scalars['String']>;
  samplePassageSpec: Scalars['String'];
  title: Scalars['String'];
  translations?: Maybe<Array<Maybe<VolumeResource>>>;
};

export type Person = {
  __typename?: 'Person';
  dateCreated: Scalars['DateTime'];
  description: Scalars['String'];
  features: Array<VolumeResource>;
  firstName: Scalars['String'];
  fullName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName: Scalars['String'];
  middleName: Scalars['String'];
  publishedReviews: Array<PublishedReview>;
  soleName: Scalars['String'];
  sortName?: Maybe<Scalars['String']>;
  sourceTexts: Array<Text>;
};

export type VolumeResource = {
  __typename?: 'VolumeResource';
  description: Scalars['String'];
  feature: TranslationsFeatureFeatureChoices;
  featureAccompanyingCommentary?: Maybe<Scalars['Boolean']>;
  featureAccompanyingIntroduction?: Maybe<Scalars['Boolean']>;
  featureAccompanyingNotes?: Maybe<Scalars['Boolean']>;
  featureFacingText?: Maybe<Scalars['Boolean']>;
  featureSamplePassage?: Maybe<Scalars['Boolean']>;
  format?: Maybe<TranslationsFeatureFormatChoices>;
  id: Scalars['ID'];
  language: Language;
  originalPublicationDate?: Maybe<Scalars['Date']>;
  partial: Scalars['Boolean'];
  persons: Array<Person>;
  samplePassage: Scalars['String'];
  sourceText?: Maybe<Text>;
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
  series?: Maybe<Series>;
  title: Scalars['String'];
};

export type PublishedReview = {
  __typename?: 'PublishedReview';
  dateCreated: Scalars['DateTime'];
  id: Scalars['ID'];
  location: Scalars['String'];
  persons: Array<Person>;
  publishedDate?: Maybe<Scalars['Date']>;
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
  closenessRating?: Maybe<TranslationsReviewClosenessRatingChoices>;
  content: Scalars['String'];
  dateCreated: Scalars['DateTime'];
  id: Scalars['ID'];
  readabilityRating?: Maybe<TranslationsReviewReadabilityRatingChoices>;
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

export type GetVolumeDetailsQueryVariables = Exact<{
  volumeId?: InputMaybe<Scalars['Int']>;
}>;


export type GetVolumeDetailsQuery = { __typename?: 'Query', volume?: { __typename?: 'Volume', title: string, description: string, isbn: string, featureGlossary: boolean, featureIndex: boolean, featureBibliography: boolean, featureMaps: boolean, publishedDate: any, publisher: { __typename?: 'Publisher', id: string, name: string }, series?: { __typename?: 'Series', id: string, name: string } | null, features: Array<{ __typename?: 'VolumeResource', id: string, title: string, feature: TranslationsFeatureFeatureChoices, partial: boolean, format?: TranslationsFeatureFormatChoices | null, featureFacingText?: boolean | null, samplePassage: string, persons: Array<{ __typename?: 'Person', id: string, fullName?: string | null }>, language: { __typename?: 'Language', id: string, name: string }, sourceText?: { __typename?: 'Text', title: string, format: TranslationsSourceTextFormatChoices, author: { __typename?: 'Person', id: string, fullName?: string | null }, language: { __typename?: 'Language', id: string, name: string } } | null }>, publishedReviews: Array<{ __typename?: 'PublishedReview', location: string, publishedDate?: any | null, title: string, persons: Array<{ __typename?: 'Person', id: string, fullName?: string | null }>, volumes: Array<{ __typename?: 'Volume', id: string, title: string, publishedDate: any }> }> } | null };
