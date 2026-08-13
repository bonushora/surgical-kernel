import {
    ExecutionService
} from "../service/ExecutionService.js";

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
    ProviderPolicy
} from "../providers/ProviderPolicy.js";

class RegistryExecutionTestProvider
    implements AIProvider {

    readonly provider =
        "registry-execution-test";

    readonly model =
        "registry-execution-test-v1";

    async execute(
        input: AIProviderRequest
    ): Promise<AIProviderResponse> {

        return {

            output:
                `REGISTRY_EXECUTION_TEST:${input.request}`,

            provider:
                this.provider,

            model:
                this.model,

            metadata: {

                projectId:
                    input.projectId,

                mode:
                    input.mode,

                organizationId:
                    input.context.organizationId,

                actorId:
                    input.context.actorId

            }

        };

    }

}

const registry =
    new AIProviderRegistry();

const provider =
    new RegistryExecutionTestProvider();

registry.register({

    provider:
        provider.provider,

    model:
        provider.model,

    implementation:
        provider

});

const resolver =
    new AIProviderResolver(
        registry
    );

const policy:
    ProviderPolicy = {

    authorize() {

        return {

            allowed:
                true,

            provider:
                provider.provider,

            model:
                provider.model,

            reason:
                "Registry execution integration test."

        };

    }

};

const service =
    new ExecutionService(
        undefined,
        policy,
        registry,
        resolver
    );

const execution =
    service.create({

        executionId:
            crypto.randomUUID(),

        context: {

            organizationId:
                "bonora",

            projectId:
                "bonushora",

            actorId:
                "registry-execution-test",

            role:
                "consumer"

        },

        projectId:
            "bonushora",

        mode:
            "deterministic",

        request:
            "registry execution integration"

    });

const result =
    await service.execute(
        execution
    );

if (
    result.result?.provider !==
    provider.provider
) {

    throw new Error(
        "FAIL — ExecutionService não utilizou o provider resolvido pelo Registry."
    );

}

if (
    result.result?.model !==
    provider.model
) {

    throw new Error(
        "FAIL — ExecutionService utilizou model diferente do Registry."
    );

}

if (
    result.result?.output !==
    "REGISTRY_EXECUTION_TEST:registry execution integration"
) {

    throw new Error(
        "FAIL — resposta do provider registrado não foi preservada."
    );

}

console.log(
    "=================================================="
);

console.log(
    "REGISTRY → RESOLVER → EXECUTION SERVICE TEST"
);

console.log(
    "=================================================="
);

console.log(
    "PASS — provider registrado no AIProviderRegistry."
);

console.log(
    "PASS — AIProviderResolver resolveu o provider autorizado."
);

console.log(
    "PASS — ExecutionService executou o provider resolvido."
);

console.log(
    "PASS — provider correto confirmado."
);

console.log(
    "PASS — model correto confirmado."
);

console.log(
    "PASS — output correto confirmado."
);

console.log(
    "=================================================="
);

console.log(
    "REGISTRY → RESOLVER → EXECUTION SERVICE TEST — ALL CASES PASSED"
);

console.log(
    "=================================================="
);
