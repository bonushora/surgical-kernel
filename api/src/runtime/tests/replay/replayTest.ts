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

        projectId:
            "bonushora",

        mode:
            "deterministic",

        request:
            "replay validation"

    });



service.start(
    execution
);


service.complete(
    execution
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
