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
