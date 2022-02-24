import { getEndpoint, getApiEndpoint, getCookie } from './django';

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

async function getRecord(entityName, recordId) {
    // TODO: Optimize further. Make it fetch exactly one record.
    let cacheKey = getCacheKey(entityName, recordId);

    if (!individualRecordCache.has(cacheKey)) {
        await getRecordsFromApi(entityName);
    }

    return individualRecordCache.get(cacheKey);
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
                        // We're the first to process this refresh.
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
    let result = await fetch(new Request(`${getApiEndpoint()}/${entityName}/`));
    if (result.ok) {
        let data = await result.json();

        // Populate the list-based record cache
        data.forEach((elem) => {
            elem.name = elem[nameFields[entityName]];
        });
        recordCache.set(entityName, data);

        // And the individual record cache
        data.forEach((elem) => {
            let cacheKey = getCacheKey(entityName, elem.id);
            individualRecordCache.set(cacheKey, elem);
        });
    } else {
        throw new Error(`The API returned an error: ${result.status}.`);
    }
}

async function createRecord(entityName, record) {
    let endpoint = getApiEndpoint();

    let response = await fetch(`${endpoint}/${entityName}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(record)
    });

    if (response.ok) {
        let result = await response.json();
        result.name = result[nameFields[entityName]];

        if (recordCache.has(entityName)) {
            recordCache.get(entityName).push(result);
        }

        let cacheKey = getCacheKey(entityName, result.id);
        individualRecordCache.set(cacheKey, result);

        if (
            getRecordsStore.has(entityName) &&
            getRecordsStore.get(entityName).size
        ) {
            getRecordsStore.get(entityName).forEach((r) => r.refresh());
        }
        return result;
    }

    throw new Error(`The API returned an error: ${response.status}.`);
}

export { createRecord, getRecord, getRecordsFromApi, getRecords, getRecordApiUrl, getRecordUiUrl };