import { decode } from 'lwr/routerUtils';

/**
 * helper: f(url) -> new URL
 * Query parameter values are URI decoded.

 * @param {string} url - URL string to turn into a URL object

 * @returns {object} { href, pathname, searchParams }

 * @example
 * {
 *      href: 'http://localhost:3001/products?lwr.mode=prod&lwr.locale=es#section',
 *      origin: 'http://localhost:3001',
 *      pathname: '/products',
 *      searchParams: {
 *          'lwr.mode': 'prod',
 *          'lwr.locale': 'es'
 *      }
 * }
 */
export function getUrlObject(url = '') {
  // Ensure this is a full URL.
  url = url || '';
  if (url.indexOf('://') < 0) {
    // get the current port string (or empty)
    const port = window.location.port ? `:${window.location.port}` : ''; // construct the new base url using the original protocol, hostname, and port

    const origin = `${window.location.protocol}//${window.location.hostname}${port}`; // does the path start with a slash? If so do nothing

    const prefix = url.charAt(0) === '/' ? '' : '/'; // construct the final URL

    url = origin + prefix + url;
  } // Parse the URL using an anchor.

  const searchParams = {};
  const link = document.createElement('a');
  link.href = url; // Pull the search params out of the search query string.

  const queryStr = link.search.substring(1);
  if (queryStr) {
    queryStr.split('&').forEach(pair => {
      const [key, value = ''] = pair.split('=');
      searchParams[decode(key)] = decode(value);
    });
  }
  return {
    href: link.href,
    origin: `${link.protocol}//${link.hostname}${link.port ? `:${link.port}` : ''}`,
    pathname: link.pathname.replace(/(\/)?/, '/'),
    // ensure there is a leading slash (IE11)
    searchParams
  };
}
/**
 * f(url) -> "/some/relative/path?param1=one&param2=two&param3"

 * @param {string} url - URL string to make relative, may be a no-op

 * @return {string}
 */

export function getRelativeUrl(url) {
  const urlObj = getUrlObject(url); // Remove port number from both href and origin before doing string replace.
  // The port number gets included on the origin in IE11 with https but not
  // href which breaks the string replace.

  const href = urlObj.href.replace(/:\d+/, '');
  const origin = urlObj.origin.replace(/:\d+/, '');
  return href.replace(origin, '');
}