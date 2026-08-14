import {
    ExecutionService
} from "../service/ExecutionService.js";

import type {
    AIProvider,
    AIProviderRequest,
    AIProviderResponse
} from "../providers/AIProvider.js";

import type {
    ProviderPolicy,
    ProviderPolicyDecision
} from "../providers/ProviderPolicy.js";


class InjectedCapabilityProvider
    implements AIProvider {

    readonly provider =
        "injected-capability-provider";

    readonly model =
        "injected-capability-model-v1";

    public calls = 0;

    async execute(
        input: AIProviderRequest
    ): Promise<AIProviderResponse> {

        this.calls++;

        return {

            output:
                `INJECTED_PROVIDER_EXECUTED:${input.request}`,

            provider:
                this.provider,

            model:
                this.model

        };

    }

}


class CapabilityAllowPolicy
    implements ProviderPolicy {

    authorize(
        input: AIProviderRequest
    ): ProviderPolicyDecision {

        return {

            decisionId:
                "injected-capability-allow",

            allowed:
                true,

            provider:
                "injected-capability-provider",

            model:
                "injected-capability-model-v1",

            requiredCapabilities: [
                "capability-that-injected-provider-must-not-bypass"
            ],

            reason:
                "Capability governance integration test."

        };

    }

}


class DenyPolicy
    implements ProviderPolicy {

    authorize(
        input: AIProviderRequest
    ): ProviderPolicyDecision {

        return {

            decisionId:
                "injected-capability-deny",

            allowed:
                false,

            provider:
                "injected-capability-provider",

            model:
                "injected-capability-model-v1",

            reason:
                "Explicit policy denial."

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


import type {
    ExecutionRole
} from "../context/ExecutionContext.js";


function createRequest() {

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
                "injected-capability-governance-test",

            role

        },

        projectId:
            "bonushora",

        mode:
            "deterministic" as const,

        request:
            "injected provider capability governance"

    };

}


console.log(
    "=================================================="
);

console.log(
    "AI PROVIDER INJECTED CAPABILITY GOVERNANCE TEST"
);

console.log(
    "=================================================="
);


console.log(
    "===== CASE 1 — INJECTED PROVIDER + REQUIRED CAPABILITY ====="
);


const capabilityProvider =
    new InjectedCapabilityProvider();

const capabilityService =
    new ExecutionService(
        capabilityProvider,
        new CapabilityAllowPolicy()
    );

const capabilityExecution =
    capabilityService.create(
        createRequest()
    );

const capabilityResult =
    await capabilityService.execute(
        capabilityExecution
    );

console.log(
    "RESULT:",
    JSON.stringify(
        capabilityResult,
        null,
        2
    )
);


assert(
    capabilityProvider.calls === 0,
    "Injected provider must not execute when required capability cannot be governed."
);

assert(
    capabilityResult.status ===
        "failed",
    "Execution must fail when capability governance is not satisfied."
);

console.log(
    "PASS — injected provider did not bypass capability governance."
);


console.log(
    "===== CASE 2 — INJECTED PROVIDER + EXPLICIT POLICY DENY ====="
);


const deniedProvider =
    new InjectedCapabilityProvider();

const deniedService =
    new ExecutionService(
        deniedProvider,
        new DenyPolicy()
    );

const deniedExecution =
    deniedService.create(
        createRequest()
    );

const deniedResult =
    await deniedService.execute(
        deniedExecution
    );

console.log(
    "RESULT:",
    JSON.stringify(
        deniedResult,
        null,
        2
    )
);


assert(
    deniedProvider.calls === 0,
    "Injected provider must not execute after explicit policy denial."
);

assert(
    deniedResult.status ===
        "failed",
    "Execution must fail after explicit policy denial."
);

console.log(
    "PASS — explicit policy denial blocked injected provider."
);


console.log(
    "=================================================="
);

console.log(
    "AI PROVIDER INJECTED CAPABILITY GOVERNANCE TEST — ALL CASES PASSED"
);

console.log(
    "=================================================="
);
