import {
    ExecutionService
} from "../../service/ExecutionService.js";


import {
    getEvents
} from "../../events/EventStore.js";



const service =
    new ExecutionService();



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
                "event-pipeline-test",

            role:
                "consumer"
        },

        projectId:
            "bonushora",

        mode:
            "deterministic",

        request:
            "event pipeline validation"

    });



const running =
await service.start(
    execution
);

await service.complete(
    running
);



const events =
    getEvents(
        execution.executionId
    );



console.log(
    JSON.stringify(
        events,
        null,
        2
    )
);
