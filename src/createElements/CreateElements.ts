//Można dodać aby było użyte w każdym możliwym miejscu w aplikacji
//I dodać jeszcze kilka wariantów funkcji
//Albo można to po prostu wypierdolic, też dobry pomysł

export function createElement(elementName: keyof HTMLElementTagNameMap): HTMLElement;
export function createElement(elementName: keyof HTMLElementTagNameMap, id: string): HTMLElement;
export function createElement(elementName: keyof HTMLElementTagNameMap, id: string, type: string): HTMLElement;
export function createElement(elementName: keyof HTMLElementTagNameMap, id: string, type: string, value: string): HTMLElement;

export function createElement(elementName: keyof HTMLElementTagNameMap, id?: string, type?: string, value?: string) {
    let element;
    if (elementName === 'input') {
        element = createInputElement(elementName) as HTMLInputElement;

        if (type) {
            element.type = type;
        }

        if (value) {
            element.value = value;
        }

    } else {
        element = document.createElement('div') as HTMLDivElement;
    }

    if (id) {
        element.id = id;
    }


    return element;
}

const createInputElement = (elementName: keyof HTMLElementTagNameMap) => {
    return document.createElement(elementName);
}

