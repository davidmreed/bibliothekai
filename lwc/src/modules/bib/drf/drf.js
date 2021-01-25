const getRecordsStore = new Map();

function getEndpoint() {
    return process.env.ENDPOINT;
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
        if (this.entityName !== config.entityName || this.nameField !== config.nameField) {
            this._unregister();
            this.entityName = config.entityName;
            this.nameField = config.nameField;
            this._register();
            this._refresh();
        }
    }

    _refresh() {
        let endpoint = getEndpoint();
        fetch(
            new Request(
                `${endpoint}/${this.entityName}/`,
            )
        ).then(result => result.json())
            .then(data => {
                this.dataCallback(
                    data.map((elem) => { return { "id": elem.id, "name": elem[this.nameField] } })
                );
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
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function createRecord(entity, record) {
    let endpoint = getEndpoint();

    return new Promise((resolve, reject) => {
        fetch(
            `${endpoint}/${entity}/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(record)
            }
        ).then(response => {
            if (getRecordsStore.has(entity)) {
                getRecordsStore.get(entity).forEach(r => r._refresh());
            }
            resolve(response.json());
        }).catch(reason => reject(reason));
    });
}