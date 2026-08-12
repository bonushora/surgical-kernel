import {
    ExecutionEvent
} from "./ExecutionEvent.js";


export interface EventRepository {


    append(
        event: ExecutionEvent
    ): ExecutionEvent;



    getEvents(
        executionId:string
    ): ExecutionEvent[];



    getExecutionIds(): string[];



    clear():void;

}
