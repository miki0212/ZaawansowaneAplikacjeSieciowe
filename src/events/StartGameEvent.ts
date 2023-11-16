import { BaseEvent, evtNames } from "./BaseEvent";

export class StartGameEvent extends BaseEvent {
    constructor(evtName: evtNames) {
        super(evtName);
    }
}