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

import {
    DeterministicProviderPolicy,
    ProviderPolicy
} from "../providers/ProviderPolicy.js";

import {
    AIProviderRegistry
} from "../providers/AIProviderRegistry.js";

import {
    AIProviderResolver
} from "../providers/AIProviderResolver.js";

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


    private provider:
        AIProvider;


    private providerPolicy:
        ProviderPolicy;


    private registry:
        AIProviderRegistry;


    private resolver:
        AIProviderResolver;


    private providerInjected:
        boolean;


    constructor(
        provider?: AIProvider,

        providerPolicy?: ProviderPolicy,

        registry?: AIProviderRegistry,

        resolver?: AIProviderResolver
    ){

        this.providerInjected =
            provider !== undefined;


        this.provider =
            provider ??
            new MockProvider();


        this.providerPolicy =
            providerPolicy ??
            new DeterministicProviderPolicy();


        this.registry =
            registry ??
            new AIProviderRegistry();


        if (
            !this.registry.has(
                this.provider.provider,
                this.provider.model
            )
        ) {

            this.registry.register({

                provider:
                    this.provider.provider,

                model:
                    this.provider.model,

                capabilities:
                    this.providerInjected
                        ? []
                        : ["text-generation"],

                implementation:
                    this.provider

            });

        }


        this.resolver =
            resolver ??
            new AIProviderResolver(
                this.registry
            );

    }


    create(
        input: CreateExecutionRequest
    ): ExecutionState {

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


            updateExecution(
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


        appendEvent(
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


            updateExecution(
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


            appendEvent(
                failedEvent
            );


            return failed;

        }


        const result =
            await provider.execute(
                providerRequest
            );


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
        execution: ExecutionState
    ): ExecutionState {

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
        execution: ExecutionState
    ): ExecutionState {

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
        executionId: string
    ){

        return this.stateManager.history(
            executionId
        );

    }

}
