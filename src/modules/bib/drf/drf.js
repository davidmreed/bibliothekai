const getRecordsStore = new Map();

function getEndpoint() {
    // eslint-disable-next-line no-undef
    return process.env.ENDPOINT;
}

function getApiEndpoint() {
    return `${getEndpoint()}/api`
}

export function getRecordApiUrl(entityName, id) {
    return `${getApiEndpoint()}/${entityName}/${id}/`;
}

export function getRecordUiUrl(entityName, id) {
    return `${getEndpoint()}/${entityName}/${id}`;
}

export class getRecords {
    entityName;
    nameField;

    constructor(dataCallback) {
        this.dataCallback = dataCallback;
    }

    connect() {
        this._register();
        if (this.entityName) {
            this._refresh();
        }
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
        if (
            this.entityName !== config.entityName ||
            this.nameField !== config.nameField
        ) {
            this._unregister();
            this.entityName = config.entityName;
            this.nameField = config.nameField;
            this._register();
            this._refresh();
        }
    }

    _refresh() {
        let endpoint = getApiEndpoint();
        fetch(new Request(`${endpoint}/${this.entityName}/`))
            .then(result => {
                if (result.ok) {
                    result.json().then(data => {
                        this.dataCallback(
                            {
                                data: data.map((elem) => {
                                    return { id: elem.id, name: elem[this.nameField] };
                                }),
                                error: null
                            }
                        );
                    });
                } else {
                    this.dataCallback({ data: null, error: `The API returned an error: ${result.status}.` })
                }
            }).catch(error => {
                this.dataCallback({ data: null, error });
            });
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

export function createRecord(entity, record) {
    let endpoint = getApiEndpoint();

    return new Promise((resolve, reject) => {
        fetch(`${endpoint}/${entity}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(record)
        })
            .then((response) => {
                if (response.ok) {
                    if (getRecordsStore.has(entity)) {
                        getRecordsStore.get(entity).forEach((r) => r._refresh());
                    }
                    resolve(response.json());
                } else {
                    reject(`The API returned an error: ${response.status}.`);
                }
            })
            .catch((reason) => reject(reason));
    });
}
