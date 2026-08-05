import {
    KernelEngine
} from "../KernelEngine.js";

import {
    RuntimeStateManager
} from "../manager/RuntimeStateManager.js";


const engine =
    new KernelEngine();


const manager =
    new RuntimeStateManager();



const execution =
    engine.createExecution({

        executionId:
            crypto.randomUUID(),

        projectId:
            "bonushora",

        mode:
            "deterministic",

        request:
            "state manager validation"

    });



console.log(
    "INITIAL:",
    JSON.stringify(execution)
);



const running =
    manager.transition(
        execution,
        "running"
    );



console.log(
    "RUNNING:",
    JSON.stringify(running)
);



const completed =
    manager.transition(
        running,
        "completed"
    );



console.log(
    "COMPLETED:",
    JSON.stringify(completed)
);



console.log(
    "HISTORY:",
    JSON.stringify(
        manager.history(
            execution.executionId
        )
    )
);
