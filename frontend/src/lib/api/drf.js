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

async function getRecord(entityName, entityId) {
  if (!entityName || !entityId) {
    return null;
  }

  const cacheKey = getCacheKey(entityName, entityId);
  if (individualRecordCache.has(cacheKey)) {
    return individualRecordCache.get(cacheKey);
  }

  const result = await fetch(new Request(getRecordApiUrl(entityName, entityId)));
  if (result.ok) {
    const data = await result.json();

    cacheRecord(entityName, entityId, data);
    return data;
  }

  throw new Error(`The API returned an error: ${result.status}.`);
}

async function getRecords(entityName) {
  if (!entityName) {
    return [];
  }

  if (!recordCache.has(entityName)) {
    if (!refreshesInProgress.has(entityName)) {
      refreshesInProgress.set(entityName, getRecordsFromApi(entityName));
    }

    await refreshesInProgress.get(entityName);

    if (refreshesInProgress.has(entityName)) {
      refreshesInProgress.delete(entityName);
    }
  }

  return recordCache.get(entityName);
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
