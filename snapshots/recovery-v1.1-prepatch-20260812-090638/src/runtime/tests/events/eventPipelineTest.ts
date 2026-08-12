import {
    ExecutionService
} from "../../service/ExecutionService.js";


import {
    getEvents
} from "../../events/EventStore.js";



const service =
    new ExecutionService();



const execution =
    service.create({

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



service.start(
    execution
);


service.complete(
    execution
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
