// https://salesforce.stackexchange.com/questions/323613/lightning-open-source-use-of-base-components

import { createElement } from 'lwc';
import AddPublishedReview from 'bib/addPublishedReview';
import '@lwc/synthetic-shadow';

const app = createElement('bib-add-published-review', { is: AddPublishedReview });
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#main').appendChild(app);
