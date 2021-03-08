import { createElement } from 'lwc';
import TranslationView from 'bib/translationView';
import '@lwc/synthetic-shadow';

const app = createElement('bib-translation-view', {
    is: TranslationView
});
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#lwc').appendChild(app);
