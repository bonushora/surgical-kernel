import {
    createDefaultAIProviderRuntime
} from "../providers/AIProviderRuntimeComposition.js";

import {
    ExecutionService
} from "../service/ExecutionService.js";

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

const providerRuntime =
    createDefaultAIProviderRuntime();

const provider =
    providerRuntime.registry.resolve(
        "mock",
        "mock-deterministic-v1"
    );

assert(
    provider.provider === "mock",
    "Default runtime must register the mock provider."
);

const service =
    new ExecutionService(
        providerRuntime
    );

const execution =
    await service.create({

        executionId: crypto.randomUUID(),

        context: {
            organizationId: "bonora",
            projectId: "bonushora",
            actorId: "ai-provider-runtime-composition-test",
            role: "consumer"
        },

        projectId: "bonushora",
        mode: "deterministic",
        request: "runtime composition default provider"

    });

const result =
    await service.execute(execution);

assert(
    result.result?.provider === "mock",
    "ExecutionService must use the provider injected by runtime composition."
);

assert(
    result.result?.model === "mock-deterministic-v1",
    "Default runtime must preserve the mock model."
);

console.log(
    "AI PROVIDER RUNTIME COMPOSITION TEST — PASS"
);
