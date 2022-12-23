import { registerDecorators as _registerDecorators, registerComponent as _registerComponent, LightningElement } from "lwc";
import _tmpl from "./app.html";
import { createRouter } from '@lwrjs/router/routes';
class App extends LightningElement {
  constructor(...args) {
    super(...args);
    this.router = createRouter();
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators(App, {
  fields: ["router"]
});
export default _registerComponent(App, {
  tmpl: _tmpl
});