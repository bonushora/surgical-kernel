import { randomUUID } from "node:crypto";

import type {
    AIProviderRequest
} from "./AIProvider.js";

export interface ProviderPolicyDecision {

    decisionId: string;

    allowed: boolean;

    provider: string;

    model: string;

    requiredCapabilities?:
        readonly string[];

    reason?: string;

}

export interface ProviderPolicy {

    authorize(
        input: AIProviderRequest
    ): ProviderPolicyDecision;

}

export class DeterministicProviderPolicy
implements ProviderPolicy {

    authorize(
        input: AIProviderRequest
    ): ProviderPolicyDecision {

        if (
            !input.context.organizationId
        ) {

            return {

                decisionId:
                    randomUUID(),

                allowed: false,

                provider:
                    "mock",

                model:
                    "mock-deterministic-v1",

                reason:
                    "Missing organization context."

            };

        }

        if (
            !input.context.projectId
        ) {

            return {

                decisionId:
                    randomUUID(),

                allowed: false,

                provider:
                    "mock",

                model:
                    "mock-deterministic-v1",

                reason:
                    "Missing project context."

            };

        }

        if (
            input.projectId !==
            input.context.projectId
        ) {

            return {

                decisionId:
                    randomUUID(),

                allowed: false,

                provider:
                    "mock",

                model:
                    "mock-deterministic-v1",

                reason:
                    "Execution project does not match execution context."

            };

        }

        if (
            input.mode ===
            "deterministic"
        ) {

            return {

                decisionId:
                    randomUUID(),

                allowed: true,

                provider:
                    "mock",

                model:
                    "mock-deterministic-v1",

                requiredCapabilities:
                    ["text-generation"],

                reason:
                    "Deterministic mock provider explicitly authorized."

            };

        }

        return {

            decisionId:
                randomUUID(),

            allowed: false,

            provider:
                "mock",

            model:
                "mock-deterministic-v1",

            reason:
                "Provider execution is not authorized for this mode."

        };

    }

}
