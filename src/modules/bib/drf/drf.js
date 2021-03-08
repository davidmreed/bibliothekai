const getRecordsStore = new Map();
const recordCache = new Map();
const individualRecordCache = new Map();

const nameFields = {
    publishers: 'name',
    persons: 'sort_name',
    volumes: 'title',
    texts: 'display_name',
    languages: 'name',
    series: 'name'
};

function getEndpoint() {
    // eslint-disable-next-line no-undef
    return process.env.ENDPOINT;
}

function getApiEndpoint() {
    return `${getEndpoint()}/api`;
}

export function getRecordApiUrl(entityName, id) {
    return `${getApiEndpoint()}/${entityName}/${id}/`;
}

export function getRecordUiUrl(entityName, id) {
    return `${getEndpoint()}/${entityName}/${id}`;
}

export async function getRecord(entityName, recordId) {
    // TODO: Optimize further. Make it fetch exactly one record.
    let cacheKey = `${entityName}/${recordId}`;
    if (!individualRecordCache.has(cacheKey)) {
        await getRecordsFromApi(entityName);
    }

    return individualRecordCache.get(cacheKey);
}

export class getRecords {
    entityName;

    constructor(dataCallback) {
        this.dataCallback = dataCallback;
    }

    connect() {
        this._register();
        this._refresh();
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
            this._refresh();
        }
    }

    async _refresh() {
        if (this.entityName) {
            try {
                if (!recordCache.has(this.entityName)) {
                    await getRecordsFromApi(this.entityName);
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

function getCookie(name) {
    // From Django documentation

    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }
    return cookieValue;
}

export async function getRecordsFromApi(entityName) {
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
            let cacheKey = `${entityName}/${elem.id}`;
            individualRecordCache.set(cacheKey, elem);
        });
    } else {
        throw new Error(`The API returned an error: ${result.status}.`);
    }
}

export async function createRecord(entity, record) {
    let endpoint = getApiEndpoint();

    let response = await fetch(`${endpoint}/${entity}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(record)
    });

    if (response.ok) {
        let result = await response.json();
        if (recordCache.has(entity)) {
            recordCache.delete(entity);
        }
        if (getRecordsStore.has(entity) && getRecordsStore.get(entity).size) {
            // Make exactly one API call to refresh the cache.
            // TODO: fetch only the new record.
            await getRecordsFromApi(entity);
            getRecordsStore.get(entity).forEach((r) => r._refresh());
        }
        return result;
    }

    throw new Error(`The API returned an error: ${response.status}.`);
}

export function sortRecordsByName(a, b) {
    return sortRecordsByProperty('name', true, a, b);
}

export function sortRecordsByProperty(property, ascending, a, b) {
    return sortRecordsByGetter(
        (r) => getNestedProp(r, property),
        ascending,
        a,
        b
    );
}

export function sortRecordsByGetter(getter, ascending, a, b) {
    let nameA = getter(a).toUpperCase();
    let nameB = getter(b).toUpperCase();
    const factor = ascending ? 1 : -1;

    if (nameA < nameB) {
        return -1 * factor;
    }
    if (nameA > nameB) {
        return 1 * factor;
    }
    return 0;
}

export function getNestedProp(record, prop) {
    if (!prop) {
        console.log(`Got undefined prop with record ${JSON.stringify(record)}`);
    }
    let elements = prop.split('.');
    let cur = record;

    for (let e of elements) {
        cur = cur[e];
    }

    return cur;
}
