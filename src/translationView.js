import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';
import TranslationView from 'bib/translationView';

const app = createElement('bib-translation-view', {
    is: TranslationView
});
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#lwc').appendChild(app);
