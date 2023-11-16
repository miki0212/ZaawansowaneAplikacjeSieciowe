import { BaseEvent } from "./BaseEvent";
export class StartGameEvent extends BaseEvent {
    constructor(evtName) {
        super(evtName);
    }
}
