import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';
import AddVolume from 'bib/addVolume';

const app = createElement('bib-add-volume', {
    is: AddVolume
});
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#lwc').appendChild(app);
