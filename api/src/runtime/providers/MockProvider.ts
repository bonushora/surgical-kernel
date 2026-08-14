import type {
    AIProvider,
    AIProviderRequest,
    AIProviderResponse
} from "./AIProvider.js";


export class MockProvider
    implements AIProvider {

    readonly provider =
        "mock";

    readonly model =
        "mock-deterministic-v1";


    async execute(
        input: AIProviderRequest
    ): Promise<AIProviderResponse> {

        if (
            process.env.SURGICAL_TEST_FORCE_FAILURE ===
            "true"
        ) {

            throw new Error(
                "Forced provider failure for deterministic test."
            );

        }


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
