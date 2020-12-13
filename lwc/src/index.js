// https://salesforce.stackexchange.com/questions/323613/lightning-open-source-use-of-base-components

import { createElement } from 'lwc';
import POC from 'bib/poc';
import '@lwc/synthetic-shadow';

const app = createElement('bib-poc', { is: POC });
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#main').appendChild(app);
