import {
    ExecutionEvent
} from "./ExecutionEvent.js";


export interface EventRepository {


    append(
        event: ExecutionEvent
    ): Promise<ExecutionEvent>;



    getEvents(
        executionId:string
    ): Promise<ExecutionEvent[]>;



    getExecutionIds(): Promise<string[]>;



    clear(): Promise<void>;

}
