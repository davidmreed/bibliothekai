import { registerDecorators as _registerDecorators } from "lwc";
import { getCookie, getApiEndpoint } from './django.js';
class graphQL {
  constructor(dataCallback) {
    this.query = void 0;
    this.variables = void 0;
    this.dataCallback = void 0;
    this.dataCallback = dataCallback;
  }
  connect() {
    this.refresh();
  }
  disconnect() {}
  update(config) {
    if (this.query !== config.query || this.variables !== config.variables) {
      this.query = config.query;
      this.variables = config.variables;
      this.refresh();
    }
  }
  async refresh() {
    if (this.query) {
      let endpoint = getApiEndpoint();
      let result = await fetch(`${endpoint}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          query: this.query,
          variables: this.variables
        })
      });
      if (result.ok) {
        this.dataCallback({
          data: await result.json()
        });
      } else {
        this.dataCallback({
          error: `The API returned an error: ${result.status}.`
        });
      }
    }
  }
}
_registerDecorators(graphQL, {
  fields: ["query", "variables", "dataCallback"]
});
export { graphQL };