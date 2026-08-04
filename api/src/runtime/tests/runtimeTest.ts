import {
    KernelEngine
} from "../KernelEngine.js";

import {
    EventBus
} from "../events/EventBus.js";

import {
    SnapshotManager
} from "../snapshot/SnapshotManager.js";


const engine =
    new KernelEngine();


const events =
    new EventBus();


const snapshots =
    new SnapshotManager();



events.subscribe(
    (event) => {

        console.log(
            "EVENT:",
            JSON.stringify(event)
        );

    }
);



const execution =
    engine.createExecution({

        executionId:
            crypto.randomUUID(),

        projectId:
            "bonushora",

        mode:
            "deterministic",

        request:
            "runtime validation"

    });



console.log(
    "INITIAL STATE:",
    JSON.stringify(execution)
);



const running =
    engine.transition(
        execution,
        "running"
    );


console.log(
    "UPDATED STATE:",
    JSON.stringify(running)
);



events.publish({

    type:
        "EXECUTION_STARTED",

    executionId:
        running.executionId,

    timestamp:
        new Date().toISOString(),

    payload:{
        projectId:
            running.projectId
    }

});



const snapshot =
    snapshots.capture(
        running
    );


console.log(
    "SNAPSHOT:",
    JSON.stringify(snapshot)
);



const restored =
    snapshots.get(
        running.executionId
    );


console.log(
    "RESTORED:",
    JSON.stringify(restored)
);
