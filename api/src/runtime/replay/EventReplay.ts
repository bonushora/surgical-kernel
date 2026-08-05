import {
    getEvents
} from "../events/EventStore.js";


import {
    ReplayState
} from "./ReplayState.js";



export function replayExecution(
    executionId:string
):ReplayState | null {


    const events =
        getEvents(
            executionId
        );


    if(events.length === 0){

        return null;

    }


    const first =
        events[0];


    const last =
        events[
            events.length - 1
        ];



    return {

        executionId,

        projectId:
            first.payload.projectId,

        mode:
            first.payload.mode as
            "free"
            |
            "deterministic",

        request:
            first.payload.request,

        state:
            last.payload.state,

        reconstructed:
            true,

        eventCount:
            events.length

    };

}
