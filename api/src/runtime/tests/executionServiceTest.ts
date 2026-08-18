import {
    ExecutionService
} from "../service/ExecutionService.js";

import {
    createDefaultAIProviderRuntime
} from "../providers/AIProviderRuntimeComposition.js";


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
                "execution-service-test",

            role:
                "consumer"
        },

        projectId:
            "bonushora",

        mode:
            "deterministic",

        request:
            "execution service validation"

    });



console.log(
    "CREATED:",
    JSON.stringify(execution)
);



const running =
    await service.start(
        execution
    );


console.log(
    "RUNNING:",
    JSON.stringify(running)
);



const completed =
    await service.complete(
        running
    );


console.log(
    "COMPLETED:",
    JSON.stringify(completed)
);



console.log(
    "HISTORY:",
    JSON.stringify(
        service.history(
            execution.executionId
        )
    )
);
