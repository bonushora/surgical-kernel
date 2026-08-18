import {
    ExecutionService
} from "../service/ExecutionService.js";

import {
    createAIProviderRuntime
} from "../providers/AIProviderRuntimeComposition.js";

import {
    getEvents
} from "../events/EventStore.js";

import {
    replayExecution
} from "../replay/EventReplay.js";

import type {
    AIProvider,
    AIProviderRequest,
    AIProviderResponse
} from "../providers/AIProvider.js";

import type {
    ProviderPolicy,
    ProviderPolicyDecision
} from "../providers/ProviderPolicy.js";

import type {
    ExecutionRole
} from "../context/ExecutionContext.js";


class FailingProvider
    implements AIProvider {

    readonly provider =
        "failing-provider";

    readonly model =
        "failing-model-v1";

    public calls =
        0;

    async execute(
        input: AIProviderRequest
    ): Promise<AIProviderResponse> {

        this.calls++;

        throw new Error(
            "Simulated provider runtime failure."
        );

    }

}


class AllowPolicy
    implements ProviderPolicy {

    authorize(
        input: AIProviderRequest
    ): ProviderPolicyDecision {

        return {

            decisionId:
                "runtime-failure-governance",

            allowed:
                true,

            provider:
                "failing-provider",

            model:
                "failing-model-v1",

            reason:
                "Runtime failure governance test."

        };

    }

}


function assert(
    condition: boolean,
    message: string
): void {

    if (!condition) {

        throw new Error(
            `FAIL: ${message}`
        );

    }

}


function createRequest() {

    const role:
        ExecutionRole =
        "consumer";

    return {

        executionId:
            crypto.randomUUID(),

        context: {

            organizationId:
                "bonora",

            projectId:
                "bonushora",

            actorId:
                "runtime-failure-governance-test",

            role

        },

        projectId:
            "bonushora",

        mode:
            "deterministic" as const,

        request:
            "provider runtime failure governance"

    };

}


console.log(
    "=================================================="
);

console.log(
    "AI PROVIDER RUNTIME FAILURE GOVERNANCE TEST"
);

console.log(
    "=================================================="
);


const provider =
    new FailingProvider();


const service =
    new ExecutionService(
        createAIProviderRuntime({

            providers: [
                {
                    provider: provider.provider,
                    model: provider.model,
                    capabilities: [],
                    implementation: provider
                }
            ],

            providerPolicy:
                new AllowPolicy()

        })
    );


const execution =
    await service.create(
        createRequest()
    );


const result =
    await service.execute(
        execution
    );


console.log(
    "RESULT:"
);

console.log(
    JSON.stringify(
        result,
        null,
        2
    )
);


assert(
    provider.calls === 1,
    "Provider should be invoked exactly once."
);


assert(
    result.status ===
        "failed",
    "Provider runtime failure must produce failed execution."
);


assert(
    result.result?.metadata?.governance ===
        "provider-error",
    "Runtime failure must be classified as provider-error."
);


assert(
    result.result?.metadata?.reason ===
        "Simulated provider runtime failure.",
    "Provider runtime error reason must be preserved."
);


assert(
    result.result?.provider ===
        "failing-provider",
    "Failed execution must preserve provider identity."
);


assert(
    result.result?.model ===
        "failing-model-v1",
    "Failed execution must preserve model identity."
);


const events =
    await getEvents(
        execution.executionId
    );


console.log(
    "EVENTS:"
);

console.log(
    JSON.stringify(
        events,
        null,
        2
    )
);


assert(
    events.length === 2,
    "Runtime failure should produce created + failed events."
);


assert(
    events[0].type ===
        "execution.created",
    "First event must be execution.created."
);


assert(
    events[1].type ===
        "execution.failed",
    "Second event must be execution.failed."
);


assert(
    events[1].payload.state ===
        "failed",
    "execution.failed must contain failed state."
);


assert(
    events[1].payload.result?.metadata?.governance ===
        "provider-error",
    "execution.failed must preserve provider-error governance metadata."
);


const replay =
    await replayExecution(
        execution.executionId
    );


console.log(
    "REPLAY:"
);

console.log(
    JSON.stringify(
        replay,
        null,
        2
    )
);


assert(
    replay !== null,
    "Failed execution must be reconstructable by replay."
);


assert(
    replay?.state ===
        "failed",
    "Replay must reconstruct failed state."
);


assert(
    replay?.result?.metadata?.governance ===
        "provider-error",
    "Replay must preserve provider-error metadata."
);


assert(
    replay?.result?.metadata?.reason ===
        "Simulated provider runtime failure.",
    "Replay must preserve provider runtime failure reason."
);


console.log(
    "PASS — provider was invoked exactly once."
);

console.log(
    "PASS — provider runtime failure became failed execution."
);

console.log(
    "PASS — provider identity was preserved."
);

console.log(
    "PASS — model identity was preserved."
);

console.log(
    "PASS — execution.failed was persisted."
);

console.log(
    "PASS — provider-error governance metadata was persisted."
);

console.log(
    "PASS — failed execution was reconstructed by replay."
);

console.log(
    "PASS — provider runtime failure reason survived replay."
);

console.log(
    "=================================================="
);

console.log(
    "AI PROVIDER RUNTIME FAILURE GOVERNANCE TEST — ALL CASES PASSED"
);

console.log(
    "=================================================="
);
