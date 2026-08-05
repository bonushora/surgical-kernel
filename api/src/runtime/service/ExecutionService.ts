import {
    KernelEngine
} from "../KernelEngine.js";


import {
    RuntimeStateManager
} from "../manager/RuntimeStateManager.js";


import {
    createExecution,
    updateExecution
} from "../../store/executionStore.js";


import {
    toStoreExecution
} from "../adapter/ExecutionAdapter.js";


import {
    ExecutionState
} from "../state/ExecutionState.js";


import {
    appendEvent
} from "../events/EventStore.js";


import {
    ExecutionEvent
} from "../events/ExecutionEvent.js";



export interface CreateExecutionRequest {

    executionId:string;

    projectId:string;

    mode:
        "free"
        |
        "deterministic";

    request:string;

}



export class ExecutionService {


    private engine =
        new KernelEngine();


    private stateManager =
        new RuntimeStateManager();



    create(
        input:CreateExecutionRequest
    ):ExecutionState {


        const execution =
            this.engine.createExecution(
                input
            );


        const stored =
            createExecution(
                toStoreExecution(
                    execution
                )
            );


        const event: ExecutionEvent = {

            eventId:
                crypto.randomUUID(),

            executionId:
                execution.executionId,

            type:
                "execution.created",

            timestamp:
                new Date().toISOString(),

            payload: {

                projectId:
                    execution.projectId,

                mode:
                    execution.mode,

                request:
                    execution.request,

                state:
                    execution.status

            }

        };


        appendEvent(
            event
        );


        return {

            ...execution,

            status:
                stored.state as ExecutionState["status"]

        };

    }



    start(
        execution:ExecutionState
    ):ExecutionState {


        const updated =
            this.stateManager.transition(
                execution,
                "running"
            );


        updateExecution(
            execution.executionId,
            {
                state:
                    updated.status,

                updatedAt:
                    updated.updatedAt
            }
        );


        const event: ExecutionEvent = {

            eventId:
                crypto.randomUUID(),

            executionId:
                execution.executionId,

            type:
                "execution.started",

            timestamp:
                new Date().toISOString(),

            payload: {

                projectId:
                    execution.projectId,

                mode:
                    execution.mode,

                request:
                    execution.request,

                state:
                    updated.status

            }

        };


        appendEvent(
            event
        );


        return updated;

    }



    complete(
        execution:ExecutionState
    ):ExecutionState {


        const updated =
            this.stateManager.transition(
                execution,
                "completed"
            );


        updateExecution(
            execution.executionId,
            {
                state:
                    updated.status,

                updatedAt:
                    updated.updatedAt
            }
        );


        const event: ExecutionEvent = {

            eventId:
                crypto.randomUUID(),

            executionId:
                execution.executionId,

            type:
                "execution.completed",

            timestamp:
                new Date().toISOString(),

            payload: {

                projectId:
                    execution.projectId,

                mode:
                    execution.mode,

                request:
                    execution.request,

                state:
                    updated.status

            }

        };


        appendEvent(
            event
        );


        return updated;

    }



    history(
        executionId:string
    ){

        return this.stateManager.history(
            executionId
        );

    }

}
