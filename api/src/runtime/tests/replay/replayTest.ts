import {
    ExecutionService
} from "../../service/ExecutionService.js";

import {
    createDefaultAIProviderRuntime
} from "../../providers/AIProviderRuntimeComposition.js";


import {
    replayExecution
} from "../../replay/EventReplay.js";



const service =
    new ExecutionService(
        createDefaultAIProviderRuntime()
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
                "replay-test",

            role:
                "consumer"
        },

        projectId:
            "bonushora",

        mode:
            "deterministic",

        request:
            "replay validation"

    });



const running =
    await service.start(
        execution
    );


const completed =
    await service.complete(
        running
    );



const replay =
    replayExecution(
        execution.executionId
    );


console.log(
    JSON.stringify(
        replay,
        null,
        2
    )
);
