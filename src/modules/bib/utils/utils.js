export default function setNestedProperty(target, prop, value) {
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
