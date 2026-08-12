import type {
    AIProvider,
    AIProviderRequest,
    AIProviderResponse
} from "./AIProvider.js";

export class MockProvider
    implements AIProvider {

    async execute(
        input: AIProviderRequest
    ): Promise<AIProviderResponse> {

        return {

            output:
                `Mock AI response for: ${input.request}`,

            provider:
                "mock",

            model:
                "mock-deterministic-v1",

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
