import { createElement } from 'lwc';
import CompareTranslations from 'bib/compareTranslations';
import '@lwc/synthetic-shadow';

const app = createElement('bib-compare-translations', {
    is: CompareTranslations
});
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#lwc').appendChild(app);
