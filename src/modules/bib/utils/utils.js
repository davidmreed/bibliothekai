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

/*
export function getNestedProp(record, prop) {
    return prop.split('.').reduce((cur, acc) => acc[cur], record);
}
*/

export function getNestedProp(record, prop) {
    let elements = prop.split('.');
    let cur = record;

    for (let e of elements) {
        cur = cur[e];
    }

    return cur;
}

export function setNestedProperty(target, prop, value) {
    let elements = prop.split('.');
    let cur;

    if (elements.length > 1) {
        cur = target[elements.shift()];
    } else {
        cur = target;
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (elements.length > 1) {
            cur = cur[elements.shift()];
        } else {
            cur[elements.shift()] = value;
            break;
        }
    }
}

export function oxfordCommaList(ls) {
    return ls.reduce((acc, cur, index, array) => {
        let joiner;
        if (array.length === 1 || index === 0) {
            joiner = '';
        } else if (array.length === 2) {
            joiner = ' and ';
        } else if (array.length >= 3 && index < array.length - 1) {
            joiner = ', ';
        } else {
            joiner = ', and ';
        }
        return acc + joiner + cur;
    }, '');
}
