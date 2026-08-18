import {
    ExecutionService
} from "../service/ExecutionService.js";

import {
    AIProvider,
    AIProviderRequest,
    AIProviderResponse
} from "../providers/AIProvider.js";

import {
    getEvents
} from "../events/EventStore.js";

import {
    replayExecution
} from "../replay/EventReplay.js";


class TestProvider implements AIProvider {

    readonly provider =
        "test-provider";

    readonly model =
        "test-model-v1";

    async execute(
        input: AIProviderRequest
    ): Promise<AIProviderResponse> {

        return {

            output:
                `TEST_PROVIDER_RESPONSE:${input.request}`,

            provider:
                "test-provider",

            model:
                "test-model-v1",

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


const provider =
    new TestProvider();


const providerPolicy = {

    authorize(
        context: any
    ) {

        return {

            decisionId:
                "ai-provider-lifecycle",

            allowed:
                true,

            provider:
                "test-provider",

            model:
                "test-model-v1",

            requiredCapabilities:
                [],

            reason:
                "Lifecycle test provider explicitly authorized."

        };

    }

};


const service =
    new ExecutionService(
        provider,
        providerPolicy
    );


const execution =
    await service.create({

        executionId:
            crypto.randomUUID(),

        context: {

            organizationId:
                "bonora",

            projectId:
                "bonushora",

            actorId:
                "ai-provider-lifecycle-test",

            role:
                "consumer"

        },

        projectId:
            "bonushora",

        mode:
            "deterministic",

        request:
            "provider abstraction validation"

    });


console.log(
    "CREATED:",
    JSON.stringify(
        execution,
        null,
        2
    )
);


const running =
    await service.start(
        execution
    );


console.log(
    "RUNNING:",
    JSON.stringify(
        running,
        null,
        2
    )
);


const executed =
    await service.execute(
        running
    );


console.log(
    "EXECUTED:",
    JSON.stringify(
        executed,
        null,
        2
    )
);


if (
    !executed.result
) {

    throw new Error(
        "FAIL: ExecutionResult was not produced."
    );

}


if (
    executed.result.provider !==
    "test-provider"
) {

    throw new Error(
        "FAIL: Unexpected provider."
    );

}


if (
    executed.result.model !==
    "test-model-v1"
) {

    throw new Error(
        "FAIL: Unexpected model."
    );

}


if (
    executed.result.output !==
    "TEST_PROVIDER_RESPONSE:provider abstraction validation"
) {

    throw new Error(
        "FAIL: Unexpected provider output."
    );

}


const completed =
    await service.complete(
        executed
    );


console.log(
    "COMPLETED:",
    JSON.stringify(
        completed,
        null,
        2
    )
);


if (
    completed.status !==
    "completed"
) {

    throw new Error(
        "FAIL: Execution did not complete."
    );

}


const events =
    await getEvents(
        execution.executionId
    );


console.log(
    "EVENTS:",
    JSON.stringify(
        events,
        null,
        2
    )
);


const completedEvent =
    events.find(
        event =>
            event.type ===
            "execution.completed"
    );


if (
    !completedEvent
) {

    throw new Error(
        "FAIL: execution.completed event not found."
    );

}


if (
    completedEvent.payload.result?.provider !==
    "test-provider"
) {

    throw new Error(
        "FAIL: Provider result not persisted in completed event."
    );

}


const replay =
    await replayExecution(
        execution.executionId
    );


console.log(
    "REPLAY:",
    JSON.stringify(
        replay,
        null,
        2
    )
);


if (
    replay?.result?.provider !==
    "test-provider"
) {

    throw new Error(
        "FAIL: Provider result not reconstructed by replay."
    );

}


if (
    replay?.result?.output !==
    "TEST_PROVIDER_RESPONSE:provider abstraction validation"
) {

    throw new Error(
        "FAIL: Provider output not reconstructed by replay."
    );

}


console.log(
    ""
);

console.log(
    "=================================================="
);

console.log(
    "AI PROVIDER LIFECYCLE TEST — PASS"
);

console.log(
    "=================================================="
);
