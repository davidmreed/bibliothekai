import { LightningElement } from 'lwc';
import { createRouter } from '@lwrjs/router/routes';

export default class App extends LightningElement {
    router = createRouter();
}