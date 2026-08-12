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
    ExecutionContext
} from "../context/ExecutionContext.js";

import {
    appendEvent
} from "../events/EventStore.js";

import {
    ExecutionEvent
} from "../events/ExecutionEvent.js";

import {
    AIProvider
} from "../providers/AIProvider.js";

import {
    MockProvider
} from "../providers/MockProvider.js";


export interface CreateExecutionRequest {

    executionId:string;

    context: ExecutionContext;

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


    private provider:
        AIProvider;


    constructor(
        provider: AIProvider =
            new MockProvider()
    ){

        this.provider =
            provider;

    }


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

                context:
                    execution.context,

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
                stored.state as
                ExecutionState["status"]

        };

    }


    async execute(
        execution: ExecutionState
    ): Promise<ExecutionState> {


        const result =
            await this.provider.execute({

                request:
                    execution.request,

                context:
                    execution.context,

                projectId:
                    execution.projectId,

                mode:
                    execution.mode

            });


        const updated: ExecutionState = {

            ...execution,

            result,

            updatedAt:
                new Date().toISOString()

        };


        updateExecution(
            execution.executionId,
            {
                result,
                updatedAt:
                    updated.updatedAt
            }
        );


        return updated;

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

                context:
                    execution.context,

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

                context:
                    execution.context,

                projectId:
                    execution.projectId,

                mode:
                    execution.mode,

                request:
                    execution.request,

                state:
                    updated.status,

                result:
                    updated.result

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
