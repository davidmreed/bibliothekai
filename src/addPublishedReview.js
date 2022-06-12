import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';
import AddPublishedReview from 'bib/addPublishedReview';

const app = createElement('bib-add-published-review', {
    is: AddPublishedReview
});
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#lwc').appendChild(app);
