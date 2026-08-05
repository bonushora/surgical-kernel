import {
    ExecutionService
} from "../service/ExecutionService.js";


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
            "execution service validation"

    });



console.log(
    "CREATED:",
    JSON.stringify(execution)
);



const running =
    service.start(
        execution
    );


console.log(
    "RUNNING:",
    JSON.stringify(running)
);



const completed =
    service.complete(
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
