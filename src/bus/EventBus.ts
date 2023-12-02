const eventBus = {
    on(event: string, callback: any) {
        document.addEventListener(event, (e) => callback(e));
    },

    dispatch(event: string, data: any) {
        document.dispatchEvent(new CustomEvent(event, { detail: data }));
    },

    remove(event: any, callback: (e: Event) => void) {
        document.removeEventListener(event, callback);
    }
}

export default eventBus;