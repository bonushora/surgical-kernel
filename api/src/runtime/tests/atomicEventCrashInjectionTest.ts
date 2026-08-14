import {
    appendEvent,
    getEvents,
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

import {
    spawnSync
} from "node:child_process";


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
    `crash-boundary-${crypto.randomUUID()}`;


const ledger =
    join(
        testDirectory,
        `${executionId}.json`
    );


const temporaryLedger =
    `${ledger}.tmp`;


const basePayload = {

    context: {

        organizationId:
            "crash-boundary-test",

        projectId:
            "surgical-kernel",

        actorId:
            "crash-boundary-test",

        role:
            "consumer" as const

    },

    projectId:
        "surgical-kernel",

    mode:
        "deterministic",

    request:
        "crash boundary test"

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
    "ATOMIC EVENT CRASH INJECTION TEST"
);

console.log(
    "=================================================="
);


try {

    if (
        process.env.SURGICAL_CRASH_CHILD ===
        "1"
    ) {

        configureEventRepository(
            new FileEventRepository(
                () => {

                    console.log(
                        "CRASH HOOK — process terminating before rename."
                    );

                    process.exit(
                        137
                    );

                }
            )
        );


        appendEvent(
            eventTwo
        );


        throw new Error(
            "FAIL: crash child unexpectedly reached rename."
        );

    }


    configureEventRepository(
        new FileEventRepository()
    );


    appendEvent(
        eventOne
    );


    const beforeCrash =
        getEvents(
            executionId
        );


    assert(
        beforeCrash.length === 1,
        "Initial committed ledger must contain exactly one event."
    );


    assert(
        beforeCrash[0].type ===
            "execution.created",
        "Initial ledger must contain execution.created."
    );


    console.log(
        "PASS — initial event committed."
    );


    const child =
        spawnSync(
            "npx",
            [
                "tsx",
                fileURLToPath(
                    import.meta.url
                )
            ],
            {
                env: {
                    ...process.env,
                    SURGICAL_CRASH_CHILD:
                        "1"
                },
                encoding:
                    "utf-8"
            }
        );


    console.log(
        child.stdout
    );


    console.error(
        child.stderr
    );


    assert(
        child.status === 137,
        `Crash child must terminate with status 137. Got: ${child.status}`
    );


    console.log(
        "PASS — child process crashed at commit boundary."
    );


    const afterCrash =
        getEvents(
            executionId
        );


    assert(
        afterCrash.length === 1,
        "Ledger must still contain only the previously committed event."
    );


    assert(
        afterCrash[0].type ===
            "execution.created",
        "Previously committed event must remain intact after crash."
    );


    console.log(
        "PASS — committed ledger remained intact after crash."
    );


    const directoryEntries =
        readdirSync(
            testDirectory
        );

    console.log(
        "FILES AFTER CRASH:",
        JSON.stringify(
            directoryEntries.filter(
                file =>
                    file.startsWith(
                        executionId
                    )
            ),
            null,
            2
        )
    );


    if (
        existsSync(
            temporaryLedger
        )
    ) {

        console.log(
            "PASS — temporary artifact exists after injected crash."
        );

        rmSync(
            temporaryLedger
        );

    } else {

        console.log(
            "INFO — temporary artifact was not observable after child termination."
        );

    }


    const afterCleanup =
        getEvents(
            executionId
        );


    assert(
        afterCleanup.length === 1,
        "Cleanup of temporary artifact must not alter committed ledger."
    );


    assert(
        afterCleanup[0].type ===
            "execution.created",
        "Committed ledger must remain recoverable after cleanup."
    );


    console.log(
        "PASS — committed ledger survived temporary artifact cleanup."
    );


    console.log(
        "=================================================="
    );

    console.log(
        "ATOMIC EVENT CRASH INJECTION TEST — ALL CASES PASSED"
    );

    console.log(
        "=================================================="
    );


} finally {

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
