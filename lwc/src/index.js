import { createElement } from 'lwc';
import POC from 'bib/poc';

const app = createElement('bib-poc', { is: POC });
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#main').appendChild(app);
