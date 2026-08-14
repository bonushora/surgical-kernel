import {
    appendEvent,
    getEvents,
    getExecutionIds,
    configureEventRepository
} from "../events/EventStore.js";

import {
    FileEventRepository
} from "../events/FileEventRepository.js";

import {
    existsSync,
    rmSync,
    readdirSync
} from "node:fs";

import {
    join
} from "node:path";

import {
    fileURLToPath
} from "node:url";


function assert(
    condition: boolean,
    message: string
): void {

    if (!condition) {

        throw new Error(
            `FAIL: ${message}`
        );

    }

}


const testDirectory =
    fileURLToPath(
        new URL(
            "../storage/events/",
            import.meta.url
        )
    );


const executionId =
    `atomic-commit-${crypto.randomUUID()}`;


configureEventRepository(
    new FileEventRepository()
);


const basePayload = {

    context: {

        organizationId:
            "atomic-test",

        projectId:
            "surgical-kernel",

        actorId:
            "atomic-commit-test",

        role:
            "consumer" as const

    },

    projectId:
        "surgical-kernel",

    mode:
        "deterministic",

    request:
        "atomic commit boundary test"

};


const eventOne = {

    eventId:
        crypto.randomUUID(),

    executionId,

    type:
        "execution.created" as const,

    timestamp:
        new Date().toISOString(),

    payload: {

        ...basePayload,

        state:
            "initialized"

    }

};


const eventTwo = {

    eventId:
        crypto.randomUUID(),

    executionId,

    type:
        "execution.completed" as const,

    timestamp:
        new Date().toISOString(),

    payload: {

        ...basePayload,

        state:
            "completed"

    }

};


console.log(
    "=================================================="
);

console.log(
    "ATOMIC EVENT COMMIT BOUNDARY TEST"
);

console.log(
    "=================================================="
);


try {

    appendEvent(
        eventOne
    );


    const eventsAfterFirst =
        getEvents(
            executionId
        );


    assert(
        eventsAfterFirst.length === 1,
        "First event must be committed."
    );


    assert(
        eventsAfterFirst[0].type ===
            "execution.created",
        "First committed event must remain intact."
    );


    console.log(
        "PASS — first event committed."
    );


    appendEvent(
        eventTwo
    );


    const eventsAfterSecond =
        getEvents(
            executionId
        );


    assert(
        eventsAfterSecond.length === 2,
        "Second commit must preserve the first event."
    );


    assert(
        eventsAfterSecond[0].type ===
            "execution.created",
        "Previous event must remain preserved."
    );


    assert(
        eventsAfterSecond[1].type ===
            "execution.completed",
        "Second event must be appended."
    );


    console.log(
        "PASS — second commit preserved previous events."
    );


    const files =
        readdirSync(
            testDirectory
        );


    const temporaryFiles =
        files.filter(
            file =>
                file.startsWith(
                    `${executionId}.json.tmp`
                )
        );


    assert(
        temporaryFiles.length === 0,
        "Temporary commit artifacts must not remain."
    );


    console.log(
        "PASS — temporary commit artifact was removed."
    );


    const executionIds =
        getExecutionIds();


    assert(
        executionIds.includes(
            executionId
        ),
        "Committed execution must be discoverable."
    );


    console.log(
        "PASS — execution discovery remains valid."
    );


    console.log(
        "=================================================="
    );

    console.log(
        "ATOMIC EVENT COMMIT BOUNDARY TEST — ALL CASES PASSED"
    );

    console.log(
        "=================================================="
    );

} finally {

    const ledger =
        join(
            testDirectory,
            `${executionId}.json`
        );


    const temporaryLedger =
        `${ledger}.tmp`;


    if (
        existsSync(
            ledger
        )
    ) {

        rmSync(
            ledger
        );

    }


    if (
        existsSync(
            temporaryLedger
        )
    ) {

        rmSync(
            temporaryLedger
        );

    }

}
