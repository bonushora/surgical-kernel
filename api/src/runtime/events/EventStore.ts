import {
    ExecutionEvent
} from "./ExecutionEvent.js";


const events =
    new Map<string, ExecutionEvent[]>();



export function appendEvent(
    event: ExecutionEvent
) {

    const current =
        events.get(event.executionId)
        ??
        [];


    current.push(
        event
    );


    events.set(
        event.executionId,
        current
    );


    return event;

}



export function getEvents(
    executionId:string
):ExecutionEvent[] {


    return (
        events.get(executionId)
        ??
        []
    );

}
