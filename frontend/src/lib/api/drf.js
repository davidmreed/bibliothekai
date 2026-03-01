import { getEndpoint, getApiEndpoint, getCookie } from './django.js';

const getRecordsStore = new Map();
const recordCache = new Map();
const individualRecordCache = new Map();
const refreshesInProgress = new Map();

const nameFields = {
  publishers: 'name',
  persons: 'sort_name',
  volumes: 'title',
  texts: 'display_name',
  languages: 'name',
  series: 'name'
};

function getCacheKey(entityName, recordId) {
  return `${entityName}/${recordId}`;
}

function getRecordApiUrl(entityName, id) {
  return `${getApiEndpoint()}/${entityName}/${id}/`;
}

function getRecordUiUrl(entityName, id) {
  return `${getEndpoint()}/${entityName}/${id}`;
}

function cacheRecord(entityName, id, data) {
  const cacheKey = getCacheKey(entityName, id);
  const nameField = nameFields[entityName];
  const primaryName = nameField ? data[nameField] : undefined;

  data.name =
    primaryName ||
    data.full_name ||
    data.display_name ||
    data.title ||
    data.name;

  individualRecordCache.set(cacheKey, data);
  if (!recordCache.has(entityName)) {
    recordCache.set(entityName, []);
  }
  recordCache.get(entityName).push(data);
}

class getRecord {
  entityName;
  entityId;

  constructor(dataCallback) {
    this.dataCallback = dataCallback;
  }

  connect() {
    this.refresh();
  }

  disconnect() {}

  update(config) {
    if (
      this.entityName !== config.entityName ||
      this.entityId !== config.entityId
    ) {
      this.entityName = config.entityName;
      this.entityId = config.entityId;
      this.refresh();
    }
  }

  async refresh() {
    if (this.entityName && this.entityId) {
      try {
        const cacheKey = getCacheKey(this.entityName, this.entityId);
        if (individualRecordCache.has(cacheKey)) {
          this.dataCallback({
            data: individualRecordCache.get(cacheKey)
          });
        } else {
          const result = await fetch(
            new Request(getRecordApiUrl(this.entityName, this.entityId))
          );
          if (result.ok) {
            const data = await result.json();

            cacheRecord(this.entityName, this.entityId, data);
            this.dataCallback({ data });
          } else {
            throw new Error(`The API returned an error: ${result.status}.`);
          }
        }
      } catch (error) {
        this.dataCallback({ data: null, error });
      }
    }
  }
}

class getRecords {
  entityName;

  constructor(dataCallback) {
    this.dataCallback = dataCallback;
  }

  connect() {
    this._register();
    this.refresh();
  }

  _register() {
    if (this.entityName) {
      if (!getRecordsStore.has(this.entityName)) {
        getRecordsStore.set(this.entityName, new Set());
      }
      getRecordsStore.get(this.entityName).add(this);
    }
  }

  disconnect() {
    this._unregister();
  }

  _unregister() {
    if (this.entityName && getRecordsStore.has(this.entityName)) {
      getRecordsStore.get(this.entityName).delete(this);
    }
  }

  update(config) {
    if (this.entityName !== config.entityName) {
      this._unregister();
      this.entityName = config.entityName;
      this._register();
      this.refresh();
    }
  }

  async refresh() {
    if (this.entityName) {
      try {
        if (!recordCache.has(this.entityName)) {
          if (!refreshesInProgress.has(this.entityName)) {
            refreshesInProgress.set(
              this.entityName,
              getRecordsFromApi(this.entityName)
            );
          }

          await refreshesInProgress.get(this.entityName);

          if (refreshesInProgress.has(this.entityName)) {
            refreshesInProgress.delete(this.entityName);
          }
        }
        this.dataCallback({
          data: recordCache.get(this.entityName),
          error: null
        });
      } catch (error) {
        this.dataCallback({ data: null, error });
      }
    }
  }
}

async function getRecordsFromApi(entityName) {
  const result = await fetch(new Request(`${getApiEndpoint()}/${entityName}/`));
  if (result.ok) {
    const data = await result.json();

    data.forEach((elem) => cacheRecord(entityName, elem.id, elem));
  } else {
    throw new Error(`The API returned an error: ${result.status}.`);
  }
}

async function performDml(url, method, entityName, entityId, data) {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    const result = await response.json();
    cacheRecord(entityName, entityId, result);

    if (getRecordsStore.has(entityName) && getRecordsStore.get(entityName).size) {
      getRecordsStore.get(entityName).forEach((r) => r.refresh());
    }
    return result;
  }

  throw new Error(`The API returned an error: ${response.status}.`);
}

function createRecord(entityName, record) {
  const endpoint = getApiEndpoint();

  return performDml(`${endpoint}/${entityName}/`, 'POST', entityName, null, record);
}

function updateRecord(entityName, id, data) {
  const endpoint = getApiEndpoint();

  return performDml(
    `${endpoint}/${entityName}/${id}`,
    'PATCH',
    entityName,
    id,
    data
  );
}

export {
  createRecord,
  updateRecord,
  getRecord,
  getRecords,
  getRecordsFromApi,
  getRecordApiUrl,
  getRecordUiUrl
};
