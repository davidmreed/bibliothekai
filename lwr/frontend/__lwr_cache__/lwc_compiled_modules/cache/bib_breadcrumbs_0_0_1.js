import { registerDecorators as _registerDecorators, registerComponent as _registerComponent, LightningElement } from "lwc";
import _tmpl from "./breadcrumbs.html";
import { NavigationContext, navigate } from 'lwr/navigation';
/*
type Breadcrumb = {
    title: string;
    pageReference: PageReference;
    url: string;
}*/

class Breadcrumbs extends LightningElement {
  constructor(...args) {
    super(...args);
    this.navContext = void 0;
    this.crumbs = void 0;
  }
  handleNavigation(event) {
    event.preventDefault();
    navigate(this.navContext, this.crumbs[event.currentTarget.dataset.index].pageReference);
  }
  /*LWC compiler v2.17.0*/
}
_registerDecorators(Breadcrumbs, {
  publicProps: {
    crumbs: {
      config: 0
    }
  },
  wire: {
    navContext: {
      adapter: NavigationContext,
      config: function ($cmp) {
        return {};
      }
    }
  }
});
export default _registerComponent(Breadcrumbs, {
  tmpl: _tmpl
});