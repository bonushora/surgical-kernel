import {
    getEvents
} from "../events/EventStore.js";


import {
    ReplayState
} from "./ReplayState.js";



export async function replayExecution(
    executionId:string
):Promise<ReplayState | null> {


    const events =
        await getEvents(
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

        context:
            first.payload.context,

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

        result:
            last.payload.result,

        reconstructed:
            true,

        eventCount:
            events.length

    };

}
