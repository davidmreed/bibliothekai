/**
* Copyright (c) 2021, salesforce.com, inc.
* All rights reserved.
* SPDX-License-Identifier: MIT
* For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
*/
/* LWR ESM Module Loader v0.8.8 */
/**
 * Simplified version of the AMD Import Metadata Resolver.
 * Just reads the ImportMetadata at construction time.
 */
class ImportResolver {
  constructor(config) {
    var _a, _b;
    this.importURICache = new Map();
    this.modifiers = '';
    this.normalizeMetadata(config);
    // only fetch mappings if fingerprints is ON
    this.mappingEndpoint = (config === null || config === void 0 ? void 0 : config.importMappings) ? undefined : (_a = config === null || config === void 0 ? void 0 : config.endpoints) === null || _a === void 0 ? void 0 : _a.uris.mapping;
    if ((_b = config === null || config === void 0 ? void 0 : config.endpoints) === null || _b === void 0 ? void 0 : _b.modifiers) {
      // Add URI modifiers to mapping endpoint query
      this.modifiers = Object.entries(config.endpoints.modifiers).reduce((q, [k, v]) => q += `${k}=${v}&`, '?');
    }
  }
  normalizeMetadata(importMetada) {
    // Normalize the URI cache to optimize retrieval
    if (importMetada && importMetada.imports) {
      for (const [uri, value] of Object.entries(importMetada.imports)) {
        if (uri && value) {
          const specifiers = Array.isArray(value) ? value : [];
          specifiers.forEach(specifier => {
            this.importURICache.set(specifier, uri);
          });
        }
      }
    }
  }
  async fetchMappings(specifier) {
    const mappingUri = `${this.mappingEndpoint}${encodeURIComponent(specifier)}${this.modifiers}`;
    const res = await globalThis.fetch(mappingUri);
    if (res.ok) {
      const mappings = await res.json();
      this.normalizeMetadata(mappings);
    }
  }
  async resolve(specifier) {
    let uri = this.importURICache.get(specifier);
    if (!uri && this.mappingEndpoint) {
      await this.fetchMappings(specifier);
      uri = this.importURICache.get(specifier);
    }
    return uri;
  }
}

/**
 * Simplified version of the AMD Import Metadata Resolver.
 * Just read the legacy ImportMap at construction time.
 */
class ImportResolverLegacy {
  constructor(importMap) {
    this.importURICache = importMap && importMap.imports ? importMap : {
      imports: {}
    };
  }
  /**
   * Resolves the URL for a specifier if it is in the global imports
   * This is using the pre-fingerprints importMappings syntax
   * @param specifier - Id of module we are looking for an id for
   */
  legacyResolve(specifier) {
    return this.importURICache.imports[specifier];
  }
}

// Singleton state:
let esmLoaderConfig;
let resolver;
let resolverLegacy;
function init(config) {
  // Save config from globalThis.LWR
  esmLoaderConfig = config;
  const {
    imports,
    index,
    importMappings,
    endpoints
  } = config;
  resolver = new ImportResolver({
    imports,
    index,
    endpoints,
    importMappings
  });
  resolverLegacy = new ImportResolverLegacy(importMappings);
}
async function load(specifier, importer) {
  const uri = await resolveUrl(specifier, importer);
  return import(uri);
}
async function resolveUrl(specifier, importer) {
  let uri;
  if (!resolver || !resolverLegacy) {
    throw new Error('The ESM Loader was not initialized');
  }
  // Check if the URI is in the import metadata
  uri = await resolver.resolve(specifier);
  if (uri) {
    return uri;
  }
  // Check if the URI is in the legacy import metadata
  uri = resolverLegacy.legacyResolve(specifier);
  if (uri) {
    return uri;
  }
  // Else fall back to the module endpoint
  uri = specifier;
  // do not alter the specifier if it is already a URL
  if (uri.indexOf('://') < 0 && !uri.startsWith('/')) {
    // add the specifier and importer to the default URI
    const {
      endpoints
    } = esmLoaderConfig;
    if (endpoints && endpoints.uris && endpoints.uris.module) {
      uri = endpoints.uris.module + encodeURIComponent(specifier);
      if (importer) {
        uri += `?importer=${encodeURIComponent(importer)}`;
      }
      if (endpoints.modifiers) {
        // Add URI modifiers to query
        uri += Object.entries(endpoints.modifiers).reduce((q, [k, v]) => q += `${k}=${v}&`, importer ? '&' : '?');
      }
    }
  }
  return uri;
}
export { init, load };