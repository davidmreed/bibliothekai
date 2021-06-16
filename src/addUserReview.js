import { createElement } from 'lwc';
import AddUserReview from 'bib/addUserReview';
import '@lwc/synthetic-shadow';

const app = createElement('bib-add-user-review', {
    is: AddUserReview
});
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#lwc').appendChild(app);
