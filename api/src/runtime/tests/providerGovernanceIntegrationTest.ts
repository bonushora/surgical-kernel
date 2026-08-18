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

class CountingProvider implements AIProvider {

    readonly provider =
        "counting-provider";

    readonly model =
        "counting-model-v1";

    public calls = 0;

    async execute(
        input: AIProviderRequest
    ): Promise<AIProviderResponse> {

        this.calls++;

        return {

            output:
                `INTEGRATION_PROVIDER_RESPONSE:${input.request}`,

            provider:
                "counting-provider",

            model:
                "counting-model-v1"

        };

    }

}

class DenyPolicy implements ProviderPolicy {

    authorize(
        input: AIProviderRequest
    ): ProviderPolicyDecision {

        return {

            decisionId:
                "provider-governance-deny",

            allowed:
                false,

            provider:
                "counting-provider",

            model:
                "counting-model-v1",

            reason:
                "Integration test denial."

        };

    }

}

class AllowPolicy implements ProviderPolicy {

    authorize(
        input: AIProviderRequest
    ): ProviderPolicyDecision {

        return {

            decisionId:
                "provider-governance-allow",

            allowed:
                true,

            provider:
                "counting-provider",

            model:
                "counting-model-v1",

            reason:
                "Integration test authorization."

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

function createRuntime(
    provider: CountingProvider,
    providerPolicy: ProviderPolicy
) {

    return createAIProviderRuntime({

        providers: [
            {
                provider: provider.provider,
                model: provider.model,
                capabilities: [],
                implementation: provider
            }
        ],

        providerPolicy

    });

}

function createRequest(
    mode:
        "free"
        |
        "deterministic"
) {

    const role: ExecutionRole =
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
                "provider-governance-integration",

            role

        },

        projectId:
            "bonushora",

        mode,

        request:
            "provider governance integration"

    };

}

console.log(
    "=================================================="
);

console.log(
    "PROVIDER GOVERNANCE INTEGRATION TEST"
);

console.log(
    "=================================================="
);

console.log(
    "===== CASE 1 — POLICY DENY MUST BLOCK PROVIDER ====="
);

const deniedProvider =
    new CountingProvider();

const deniedService =
    new ExecutionService(
        createRuntime(
            deniedProvider,
            new DenyPolicy()
        )
    );

const deniedExecution =
await deniedService.create(
createRequest("deterministic")
);

const deniedResult =
await deniedService.execute(
deniedExecution
);

console.log(
"DENIED RESULT:",
JSON.stringify(
deniedResult,
null,
2
)
);

assert(
deniedResult.status ===
"failed",
"Execution should be marked as failed after policy denial."
);

assert(
deniedResult.result?.metadata?.governance ===
"denied",
"Execution must record governance denial."
);

assert(
deniedProvider.calls === 0,
"Provider must not execute after policy denial."
);


const deniedEvents =
await getEvents(
    deniedExecution.executionId
);

console.log(
"DENIED EVENTS:",
JSON.stringify(
    deniedEvents,
    null,
    2
)
);

assert(
deniedEvents.length === 2,
"Denied execution should produce created + failed events."
);

assert(
deniedEvents[0].type ===
"execution.created",
"First denied event must be execution.created."
);

assert(
deniedEvents[1].type ===
"execution.failed",
"Second denied event must be execution.failed."
);

assert(
deniedEvents[1].payload.state ===
"failed",
"execution.failed must contain failed state."
);

assert(
deniedEvents[1].payload.result?.metadata?.governance ===
"denied",
"execution.failed must preserve governance denial metadata."
);

const deniedReplay =
await replayExecution(
    deniedExecution.executionId
);

console.log(
"DENIED REPLAY:",
JSON.stringify(
    deniedReplay,
    null,
    2
)
);

assert(
deniedReplay !== null,
"Denied execution must be reconstructable by replay."
);

assert(
deniedReplay?.state ===
"failed",
"Replay must reconstruct failed state."
);

assert(
deniedReplay?.result?.metadata?.governance ===
"denied",
"Replay must preserve governance denial metadata."
);

console.log(
"PASS — execution.failed persisted in Event Ledger."
);

console.log(
"PASS — denied execution reconstructed by replay."
);

console.log(
"PASS — policy denied execution without invoking provider."
);

console.log(
"PASS — provider calls:",
deniedProvider.calls
);

console.log(
    "===== CASE 2 — POLICY ALLOW MUST REACH PROVIDER ====="
);

const allowedProvider =
    new CountingProvider();

const allowedService =
    new ExecutionService(
        createRuntime(
            allowedProvider,
            new AllowPolicy()
        )
    );

const allowedExecution =
    await allowedService.create(
        createRequest("deterministic")
    );

const executed =
    await allowedService.execute(
        allowedExecution
    );

assert(
    allowedProvider.calls === 1,
    "Provider should execute exactly once."
);

assert(
    executed.result?.provider ===
        "counting-provider",
    "Unexpected provider."
);

assert(
    executed.result?.model ===
        "counting-model-v1",
    "Unexpected model."
);

assert(
    executed.result?.output ===
        "INTEGRATION_PROVIDER_RESPONSE:provider governance integration",
    "Unexpected provider output."
);

console.log(
    "PASS — provider calls:",
    allowedProvider.calls
);

console.log(
    "===== CASE 3 — FREE MODE WITH ALLOW POLICY ====="
);

const freeProvider =
    new CountingProvider();

const freeService =
    new ExecutionService(
        createRuntime(
            freeProvider,
            new AllowPolicy()
        )
    );

const freeExecution =
    await freeService.create(
        createRequest("free")
    );

const freeResult =
    await freeService.execute(
        freeExecution
    );

assert(
    freeProvider.calls === 1,
    "Injected allow policy should permit the provider."
);

assert(
    freeResult.result?.provider ===
        "counting-provider",
    "Unexpected provider in free-mode integration."
);

console.log(
    "PASS — injected policy controls authorization."
);

console.log(
    "=================================================="
);

console.log(
    "PROVIDER GOVERNANCE INTEGRATION TEST — ALL CASES PASSED"
);

console.log(
    "=================================================="
);
