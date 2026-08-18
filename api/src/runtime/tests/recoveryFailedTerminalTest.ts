import {
    ExecutionService
} from "../service/ExecutionService.js";

import {
    createAIProviderRuntime
} from "../providers/AIProviderRuntimeComposition.js";

import {
    recoverExecutions
} from "../recovery/ExecutionRecovery.js";

import {
    getEvents
} from "../events/EventStore.js";

import type {
    AIProvider,
    AIProviderRequest,
    AIProviderResponse
} from "../providers/AIProvider.js";

import type {
    ProviderPolicy,
    ProviderPolicyDecision
} from "../providers/ProviderPolicy.js";


class TestProvider implements AIProvider {

    readonly provider =
        "recovery-test-provider";

    readonly model =
        "recovery-test-model";

    async execute(
        input: AIProviderRequest
    ): Promise<AIProviderResponse> {

        return {

            output:
                `UNEXPECTED_PROVIDER_EXECUTION:${input.request}`,

            provider:
                "recovery-test-provider",

            model:
                "recovery-test-model"

        };

    }

}


class DenyPolicy implements ProviderPolicy {

    authorize(
        input: AIProviderRequest
    ): ProviderPolicyDecision {

        return {

            decisionId:
                "recovery-failed-terminal-deny",

            allowed:
                false,

            provider:
                "recovery-test-provider",

            model:
                "recovery-test-model",

            reason:
                "Recovery terminal test denial."

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


console.log(
    "=================================================="
);

console.log(
    "RECOVERY FAILED TERMINAL TEST"
);

console.log(
    "=================================================="
);


const provider =
    new TestProvider();

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
                new DenyPolicy()

        })
    );


const execution =
    await service.create({

        executionId:
            crypto.randomUUID(),

        context: {

            organizationId:
                "bonora",

            projectId:
                "bonushora",

            actorId:
                "recovery-failed-terminal-test",

            role:
                "consumer"

        },

        projectId:
            "bonushora",

        mode:
            "deterministic",

        request:
            "recovery failed terminal validation"

    });


const failed =
    await service.execute(
        execution
    );


assert(
    failed.status ===
        "failed",

    "Denied execution must end as failed."
);


const eventsBeforeRecovery =
    await getEvents(
        execution.executionId
    );


assert(
    eventsBeforeRecovery.length === 2,

    "Failed execution must contain created + failed events."
);


assert(
    eventsBeforeRecovery[1].type ===
        "execution.failed",

    "Latest event must be execution.failed."
);


console.log(
    "EVENTS BEFORE RECOVERY:",
    JSON.stringify(
        eventsBeforeRecovery,
        null,
        2
    )
);


const recovered =
    await recoverExecutions();


console.log(
    "RECOVERED COUNT:",
    recovered
);


const eventsAfterRecovery =
    await getEvents(
        execution.executionId
    );


assert(
    eventsAfterRecovery.length ===
        eventsBeforeRecovery.length,

    "Terminal failed execution must not generate additional recovery events."
);


assert(
    eventsAfterRecovery[
        eventsAfterRecovery.length - 1
    ].type ===
        "execution.failed",

    "execution.failed must remain the terminal event after recovery."
);


console.log(
    "PASS — execution.failed is terminal."
);

console.log(
    "PASS — failed execution was not replayed by recovery."
);

console.log(
    "PASS — Event Ledger remained unchanged."
);

console.log(
    "=================================================="
);

console.log(
    "RECOVERY FAILED TERMINAL TEST — ALL CASES PASSED"
);

console.log(
    "=================================================="
);
