import { BaseEvent, evtNames } from "./BaseEvent.js";

export class StartGameEvent extends BaseEvent {
    public data: any;
    constructor(evtName: evtNames) {
        super(evtName);
    }
}