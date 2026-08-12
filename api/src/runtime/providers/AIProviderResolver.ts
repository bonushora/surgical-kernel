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

        return this.registry.resolve(
            decision.provider,
            decision.model
        );

    }

}
