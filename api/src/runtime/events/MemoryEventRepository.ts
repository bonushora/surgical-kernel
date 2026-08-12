import {
    ExecutionEvent
} from "./ExecutionEvent.js";


import {
    EventRepository
} from "./EventRepository.js";



export class MemoryEventRepository
implements EventRepository {


    private events =
        new Map<string, ExecutionEvent[]>();



    append(
        event: ExecutionEvent
    ): ExecutionEvent {


        const current =
            this.events.get(
                event.executionId
            )
            ??
            [];


        current.push(
            event
        );


        this.events.set(
            event.executionId,
            current
        );


        return event;

    }



    getEvents(
        executionId:string
    ):ExecutionEvent[] {


        return (
            this.events.get(
                executionId
            )
            ??
            []
        );

    }



    getExecutionIds():string[] {

        return Array.from(
            this.events.keys()
        );

    }



    clear():void {

        this.events.clear();

    }

}
