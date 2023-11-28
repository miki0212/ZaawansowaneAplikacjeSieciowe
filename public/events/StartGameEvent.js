import { BaseEvent } from "./BaseEvent.js";
export class StartGameEvent extends BaseEvent {
    constructor(evtName) {
        super(evtName);
    }
}
