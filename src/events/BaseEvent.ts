
export type evtNames = 'start-game';

export class BaseEvent extends Event {
    constructor(evtName: evtNames) {
        super(evtName);
    }
}