import { LightningElement, api } from 'lwc';

export default class Feature extends LightningElement {
    @api translation = false;
    @api introduction = false;
    @api notes = false;
    @api partial = false;
    @api language = 'English';
    @api kind = 'Prose';
    @api people = [];
    @api description = '';
    @api title = '';


}
