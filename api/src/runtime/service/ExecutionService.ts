import {
    KernelEngine
} from "../KernelEngine.js";

import {
    RuntimeStateManager
} from "../manager/RuntimeStateManager.js";

import {
    getExecutionRepository
} from "../persistence/PersistenceComposition.js";

import type {
    ExecutionRepository
} from "../../store/ExecutionRepository.js";

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

import type {
    AIProviderRuntime
} from "../providers/AIProviderRuntimeComposition.js";

export interface CreateExecutionRequest {

    executionId: string;

    context: ExecutionContext;

    projectId: string;

    mode:
        "free"
        |
        "deterministic";

    request: string;

}

export class ExecutionService {

    private engine =
        new KernelEngine();


    private stateManager =
        new RuntimeStateManager();


    private providerPolicy:
        AIProviderRuntime["providerPolicy"];


    private resolver:
        AIProviderRuntime["resolver"];


    private executionRepository:
        ExecutionRepository;


    constructor(
        providerRuntime: AIProviderRuntime,

        executionRepository:
            ExecutionRepository =
            getExecutionRepository()
    ){

        this.providerPolicy =
            providerRuntime.providerPolicy;


        this.resolver =
            providerRuntime.resolver;


        this.executionRepository =
            executionRepository;

    }


    async create(
        input: CreateExecutionRequest
    ): Promise<ExecutionState> {

        const execution =
            this.engine.createExecution(
                input
            );


        const stored =
            await this.executionRepository.create(
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


        await appendEvent(
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

        const providerRequest = {

            request:
                execution.request,

            context:
                execution.context,

            projectId:
                execution.projectId,

            mode:
                execution.mode

        };


        const decision =
            this.providerPolicy.authorize(
                providerRequest
            );


        if (
            !decision.allowed
        ) {

            const failed: ExecutionState = {

                ...execution,

                status:
                    "failed",

                updatedAt:
                    new Date().toISOString(),

                result: {

                    output:
                        `Provider execution denied: ${decision.reason}`,

                    provider:
                        decision.provider,

                    model:
                        decision.model,

                    metadata: {

                        governance:
                            "denied",

                        reason:
                            decision.reason,

                        projectId:
                            execution.projectId,

                        mode:
                            execution.mode,

                        organizationId:
                            execution.context.organizationId,

                        actorId:
                            execution.context.actorId

                    }

                }

            };


            await this.executionRepository.update(
                execution.executionId,
                {

                    state:
                        failed.status,

                    result:
                        failed.result,

                    updatedAt:
                        failed.updatedAt

                }
            );


            const failedEvent: ExecutionEvent = {

            eventId:
                crypto.randomUUID(),

            executionId:
                execution.executionId,

            type:
                "execution.failed",

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
                    failed.status,

                result:
                    failed.result

            }

        };


        await appendEvent(
            failedEvent
        );


        return failed;

        }


        let provider: AIProvider;

        try {

            provider =
                this.resolver.resolve(
                    decision
                );

        } catch (
            error
        ) {

            const reason =
                error instanceof Error
                    ? error.message
                    : "Provider resolution failed.";

            const failed: ExecutionState = {

                ...execution,

                status:
                    "failed",

                updatedAt:
                    new Date().toISOString(),

                result: {

                    output:
                        `Provider execution denied: ${reason}`,

                    provider:
                        decision.provider,

                    model:
                        decision.model,

                    metadata: {

                        governance:
                            "denied",

                        reason,

                        projectId:
                            execution.projectId,

                        mode:
                            execution.mode,

                        organizationId:
                            execution.context.organizationId,

                        actorId:
                            execution.context.actorId

                    }

                }

            };


            await this.executionRepository.update(
                execution.executionId,
                {

                    state:
                        failed.status,

                    result:
                        failed.result,

                    updatedAt:
                        failed.updatedAt

                }
            );


            const failedEvent: ExecutionEvent = {

                eventId:
                    crypto.randomUUID(),

                executionId:
                    execution.executionId,

                type:
                    "execution.failed",

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
                        failed.status,

                    result:
                        failed.result

                }

            };


            await appendEvent(
                failedEvent
            );


            return failed;

        }


        let result;

        try {

            result =
                await provider.execute(
                    providerRequest
                );

        } catch (
            error
        ) {

            const reason =
                error instanceof Error
                    ? error.message
                    : "Provider execution failed.";

            const failed: ExecutionState = {

                ...execution,

                status:
                    "failed",

                updatedAt:
                    new Date().toISOString(),

                result: {

                    output:
                        `Provider execution failed: ${reason}`,

                    provider:
                        decision.provider,

                    model:
                        decision.model,

                    metadata: {

                        governance:
                            "provider-error",

                        reason,

                        projectId:
                            execution.projectId,

                        mode:
                            execution.mode,

                        organizationId:
                            execution.context.organizationId,

                        actorId:
                            execution.context.actorId

                    }

                }

            };


            await this.executionRepository.update(
                execution.executionId,
                {

                    state:
                        failed.status,

                    result:
                        failed.result,

                    updatedAt:
                        failed.updatedAt

                }
            );


            const failedEvent: ExecutionEvent = {

                eventId:
                    crypto.randomUUID(),

                executionId:
                    execution.executionId,

                type:
                    "execution.failed",

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
                        failed.status,

                    result:
                        failed.result

                }

            };


            await appendEvent(
                failedEvent
            );


            return failed;

        }


        const updated: ExecutionState = {

            ...execution,

            result,

            updatedAt:
                new Date().toISOString()

        };


        await this.executionRepository.update(
            execution.executionId,
            {

                result,

                updatedAt:
                    updated.updatedAt

            }
        );


        return updated;

    }


    async start(
        execution: ExecutionState
    ): Promise<ExecutionState> {

        const updated =
            this.stateManager.transition(
                execution,
                "running"
            );


        await this.executionRepository.update(
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


        await appendEvent(
            event
        );


        return updated;

    }


    async complete(
        execution: ExecutionState
    ): Promise<ExecutionState> {

        const updated =
            this.stateManager.transition(
                execution,
                "completed"
            );


        await this.executionRepository.update(
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


        await appendEvent(
            event
        );


        return updated;

    }


    history(
        executionId: string
    ){

        return this.stateManager.history(
            executionId
        );

    }

}
