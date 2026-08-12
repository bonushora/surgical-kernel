import {
    ExecutionService
} from "../../service/ExecutionService.js";


import {
    replayExecution
} from "../../replay/EventReplay.js";



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
    service.start(
        execution
    );


const completed =
    service.complete(
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
