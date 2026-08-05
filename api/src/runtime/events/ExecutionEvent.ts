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

        projectId: string;

        mode: string;

        request: string;

        state: string;

    };

}
