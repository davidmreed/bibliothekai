import { createElement } from 'lwc';
import AddPublishedReview from 'bib/addPublishedReview';
import '@lwc/synthetic-shadow';

const app = createElement('bib-add-published-review', {
    is: AddPublishedReview
});
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#main').appendChild(app);
