

export abstract class BaseAbstractTemplate {
    createPage(): void {
        throw new Error('Methond not implemented');
    };

    bindHandlers(): void {
        throw new Error('Methond not implemented');
    };
}