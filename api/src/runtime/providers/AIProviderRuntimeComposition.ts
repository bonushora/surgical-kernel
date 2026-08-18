import {
    AIProviderRegistry,
    type AIProviderDescriptor
} from "./AIProviderRegistry.js";

import {
    AIProviderResolver
} from "./AIProviderResolver.js";

import {
    MockProvider
} from "./MockProvider.js";

import {
    DeterministicProviderPolicy,
    type ProviderPolicy
} from "./ProviderPolicy.js";

export interface AIProviderRuntime {

    registry: AIProviderRegistry;

    resolver: AIProviderResolver;

    providerPolicy: ProviderPolicy;

}

export interface AIProviderRuntimeConfiguration {

    providers: readonly AIProviderDescriptor[];

    providerPolicy: ProviderPolicy;

}

export function createAIProviderRuntime(
    configuration: AIProviderRuntimeConfiguration
): AIProviderRuntime {

    const registry =
        new AIProviderRegistry();

    for (
        const provider
        of configuration.providers
    ) {

        registry.register(provider);

    }

    return {

        registry,

        resolver:
            new AIProviderResolver(
                registry
            ),

        providerPolicy:
            configuration.providerPolicy

    };

}

export function createDefaultAIProviderRuntime(): AIProviderRuntime {

    const provider =
        new MockProvider();

    return createAIProviderRuntime({

        providers: [
            {
                provider:
                    provider.provider,

                model:
                    provider.model,

                capabilities:
                    ["text-generation"],

                implementation:
                    provider
            }
        ],

        providerPolicy:
            new DeterministicProviderPolicy()

    });

}
