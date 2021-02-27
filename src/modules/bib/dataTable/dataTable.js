import { LightningElement, api } from 'lwc';
import { sortRecordsByProp } from 'bib/drf';

export default class DataTable extends LightningElement {
    @api records;
    @api columns;
    @api filterCriteria;
    @api allowsSelection;

    handleColumnClick(event) {

    }
}