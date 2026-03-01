import { getCookie, getApiEndpoint } from './django.js';

async function graphQL(query, variables) {
  const endpoint = getApiEndpoint();

  const result = await fetch(`${endpoint}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({ query, variables })
  });

  if (result.ok) {
    return result.json();
  }

  throw new Error(`The API returned an error: ${result.status}.`);
}

export { graphQL };
