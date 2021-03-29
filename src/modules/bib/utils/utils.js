export default function setNestedProperty(target, detail) {
    for (let prop of detail) {
        let elements = prop.split('.');
        let cur = target[elements.shift()];

        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (elements.length > 1) {
                cur = cur[elements.shift()];
            } else {
                cur[elements.shift()] = detail[prop];
                break;
            }
        }
    }
}