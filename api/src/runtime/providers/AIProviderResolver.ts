import type {
    AIProvider
} from "./AIProvider.js";

import type {
    ProviderPolicyDecision
} from "./ProviderPolicy.js";

import {
    AIProviderRegistry
} from "./AIProviderRegistry.js";

export class AIProviderResolver {

    constructor(
        private readonly registry:
            AIProviderRegistry
    ) {}

    resolve(
        decision: ProviderPolicyDecision
    ): AIProvider {

        if (
            !decision.allowed
        ) {

            throw new Error(
                "Cannot resolve a provider from a denied policy decision."
            );

        }

        const descriptor =
            this.registry.resolveDescriptor(
                decision.provider,
                decision.model
            );

        const requiredCapabilities =
            decision.requiredCapabilities ??
            [];

        const availableCapabilities =
            new Set(
                descriptor.capabilities
            );

        const missingCapabilities =
            requiredCapabilities.filter(
                capability =>
                    !availableCapabilities.has(
                        capability
                    )
            );

        if (
            missingCapabilities.length > 0
        ) {

            throw new Error(
                `AI provider capability denied: ${missingCapabilities.join(", ")}`
            );

        }

        return descriptor.implementation;

    }

}
