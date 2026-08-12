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

class RegistryTestProvider implements AIProvider {

readonly provider =
    "registry-test-provider";

readonly model =
    "registry-test-model-v1";

async execute(
    input: AIProviderRequest
): Promise<AIProviderResponse> {

    return {
        output:
            `REGISTRY_TEST:${input.request}`,
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
    new RegistryTestProvider();

registry.register({
    provider:
        provider.provider,

    model:
        provider.model,

    implementation:
        provider
});

if (
    !registry.has(
        "registry-test-provider",
        "registry-test-model-v1"
    )
) {

    throw new Error(
        "FAIL — provider não foi registrado."
    );

}

const resolver =
    new AIProviderResolver(
        registry
    );

const allowedDecision:
ProviderPolicyDecision = {

    allowed:
        true,

    provider:
        "registry-test-provider",

    model:
        "registry-test-model-v1",

    reason:
        "Registry resolver test."
};

const resolved =
    resolver.resolve(
        allowedDecision
    );

if (
    resolved !== provider
) {

    throw new Error(
        "FAIL — resolver não retornou a implementação registrada."
    );

}

let deniedBlocked =
    false;

try {

    resolver.resolve({

        allowed:
            false,

        provider:
            "registry-test-provider",

        model:
            "registry-test-model-v1",

        reason:
            "Denied test."

    });

} catch {

    deniedBlocked =
        true;

}

if (!deniedBlocked) {

    throw new Error(
        "FAIL — resolver permitiu decisão negada."
    );

}

let missingBlocked =
    false;

try {

    resolver.resolve({

        allowed:
            true,

        provider:
            "missing-provider",

        model:
            "missing-model",

        reason:
            "Missing provider test."

    });

} catch {

    missingBlocked =
        true;

}

if (!missingBlocked) {

    throw new Error(
        "FAIL — resolver aceitou provider inexistente."
    );

}

let duplicateBlocked =
    false;

try {

    registry.register({

        provider:
            "registry-test-provider",

        model:
            "registry-test-model-v1",

        implementation:
            provider

    });

} catch {

    duplicateBlocked =
        true;

}

if (!duplicateBlocked) {

    throw new Error(
        "FAIL — registry permitiu registro duplicado."
    );

}

console.log(
    "=================================================="
);

console.log(
    "AI PROVIDER REGISTRY / RESOLVER TEST"
);

console.log(
    "=================================================="
);

console.log(
    "PASS — provider registrado."
);

console.log(
    "PASS — registry.has() confirmou registro."
);

console.log(
    "PASS — resolver retornou implementação correta."
);

console.log(
    "PASS — decisão denied bloqueada."
);

console.log(
    "PASS — provider inexistente bloqueado."
);

console.log(
    "PASS — registro duplicado bloqueado."
);

console.log(
    "=================================================="
);

console.log(
    "AI PROVIDER REGISTRY / RESOLVER TEST — ALL CASES PASSED"
);

console.log(
    "=================================================="
);
