export function createElement(elementName, id, type, value) {
    let element;
    if (elementName === 'input') {
        element = createInputElement(elementName);
        if (type) {
            element.type = type;
        }
        if (value) {
            element.value = value;
        }
    }
    else {
        element = document.createElement('div');
    }
    if (id) {
        element.id = id;
    }
    return element;
}
const createInputElement = (elementName) => {
    return document.createElement(elementName);
};
