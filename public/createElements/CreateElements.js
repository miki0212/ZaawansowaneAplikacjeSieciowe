//Można dodać aby było użyte w każdym możliwym miejscu w aplikacji
//I dodać jeszcze kilka wariantów funkcji
//Albo można to po prostu wypierdolic, też dobry pomysł
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
