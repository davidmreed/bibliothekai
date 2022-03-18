import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';
import CompareTranslations from 'bib/compareTranslations';

const app = createElement('bib-compare-translations', {
    is: CompareTranslations
});
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#lwc').appendChild(app);
