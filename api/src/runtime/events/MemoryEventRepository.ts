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



    async append(
        event: ExecutionEvent
    ): Promise<ExecutionEvent> {


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



    async getEvents(
        executionId:string
    ):Promise<ExecutionEvent[]> {


        return (
            this.events.get(
                executionId
            )
            ??
            []
        );

    }



    async getExecutionIds():Promise<string[]> {

        return Array.from(
            this.events.keys()
        );

    }



    async clear():Promise<void> {

        this.events.clear();

    }

}
