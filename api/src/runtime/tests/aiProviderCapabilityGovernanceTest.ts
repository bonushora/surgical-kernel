import {
    AIProviderRegistry
} from "../providers/AIProviderRegistry.js";

import {
    AIProviderResolver
} from "../providers/AIProviderResolver.js";

import type {
    AIProvider,
    AIProviderRequest,
    AIProviderResponse
} from "../providers/AIProvider.js";

import type {
    ProviderPolicyDecision
} from "../providers/ProviderPolicy.js";


class CapabilityTestProvider
    implements AIProvider {

    readonly provider =
        "capability-test-provider";

    readonly model =
        "capability-test-model-v1";

    async execute(
        input: AIProviderRequest
    ): Promise<AIProviderResponse> {

        return {

            output:
                `CAPABILITY_TEST:${input.request}`,

            provider:
                this.provider,

            model:
                this.model

        };

    }

}


const registry =
    new AIProviderRegistry();

const provider =
    new CapabilityTestProvider();


registry.register({

    provider:
        provider.provider,

    model:
        provider.model,

    capabilities:
        [
            "text-generation",
            "structured-output"
        ],

    implementation:
        provider

});


const resolver =
    new AIProviderResolver(
        registry
    );


/*
 * CASE 1
 * Capability exigida existe.
 */
const compatibleDecision:
    ProviderPolicyDecision = {

    allowed:
        true,

    provider:
        provider.provider,

    model:
        provider.model,

    requiredCapabilities:
        ["text-generation"],

    reason:
        "Compatible capability test."

};


const resolvedCompatible =
    resolver.resolve(
        compatibleDecision
    );


if (
    resolvedCompatible !==
    provider
) {

    throw new Error(
        "FAIL — provider com capability compatível não foi resolvido."
    );

}


/*
 * CASE 2
 * Todas as capabilities exigidas existem.
 */
const multiCapabilityDecision:
    ProviderPolicyDecision = {

    allowed:
        true,

    provider:
        provider.provider,

    model:
        provider.model,

    requiredCapabilities:
        [
            "text-generation",
            "structured-output"
        ],

    reason:
        "Multi capability test."

};


const resolvedMulti =
    resolver.resolve(
        multiCapabilityDecision
    );


if (
    resolvedMulti !==
    provider
) {

    throw new Error(
        "FAIL — provider com múltiplas capabilities compatíveis não foi resolvido."
    );

}


/*
 * CASE 3
 * Capability ausente deve bloquear.
 */
let missingCapabilityBlocked =
    false;

try {

    resolver.resolve({

        allowed:
            true,

        provider:
            provider.provider,

        model:
            provider.model,

        requiredCapabilities:
            ["image-generation"],

        reason:
            "Missing capability test."

    });

} catch (
    error
) {

    missingCapabilityBlocked =
        error instanceof Error &&
        error.message.includes(
            "image-generation"
        );

}


if (
    !missingCapabilityBlocked
) {

    throw new Error(
        "FAIL — resolver permitiu capability inexistente."
    );

}


/*
 * CASE 4
 * Uma capability ausente em conjunto deve bloquear.
 */
let mixedCapabilityBlocked =
    false;

try {

    resolver.resolve({

        allowed:
            true,

        provider:
            provider.provider,

        model:
            provider.model,

        requiredCapabilities:
            [
                "text-generation",
                "image-generation"
            ],

        reason:
            "Mixed capability test."

    });

} catch (
    error
) {

    mixedCapabilityBlocked =
        error instanceof Error &&
        error.message.includes(
            "image-generation"
        );

}


if (
    !mixedCapabilityBlocked
) {

    throw new Error(
        "FAIL — resolver permitiu conjunto com capability ausente."
    );

}


/*
 * CASE 5
 * Decision denied nunca pode alcançar capability resolution.
 */
let deniedBlocked =
    false;

try {

    resolver.resolve({

        allowed:
            false,

        provider:
            provider.provider,

        model:
            provider.model,

        requiredCapabilities:
            ["text-generation"],

        reason:
            "Denied capability test."

    });

} catch {

    deniedBlocked =
        true;

}


if (
    !deniedBlocked
) {

    throw new Error(
        "FAIL — resolver aceitou decisão de policy negada."
    );

}


console.log(
    "=================================================="
);

console.log(
    "AI PROVIDER CAPABILITY GOVERNANCE TEST"
);

console.log(
    "=================================================="
);

console.log(
    "PASS — capability requerida compatível foi resolvida."
);

console.log(
    "PASS — múltiplas capabilities compatíveis foram resolvidas."
);

console.log(
    "PASS — capability ausente foi bloqueada."
);

console.log(
    "PASS — conjunto com capability ausente foi bloqueado."
);

console.log(
    "PASS — decisão denied foi bloqueada."
);

console.log(
    "=================================================="
);

console.log(
    "AI PROVIDER CAPABILITY GOVERNANCE TEST — ALL CASES PASSED"
);

console.log(
    "=================================================="
);
