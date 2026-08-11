import {
    ExecutionContext
} from "../context/ExecutionContext.js";

export type ExecutionEventType =
    | "execution.created"
    | "execution.started"
    | "execution.completed";


export interface ExecutionEvent {

    eventId: string;

    executionId: string;

    type:
        ExecutionEventType;


    timestamp: string;


    payload: {

        context: ExecutionContext;

        projectId: string;

        mode: string;

        request: string;

        state: string;

    };

}
