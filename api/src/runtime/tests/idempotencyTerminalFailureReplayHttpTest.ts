import {
    rmSync
} from "node:fs";

import {
    join,
    resolve
} from "node:path";

import {
    spawn
} from "node:child_process";

import {
    tmpdir
} from "node:os";


const projectRoot =
    resolve(
        new URL(
            "../../..",
            import.meta.url
        ).pathname
    );


const testDirectory =
    join(
        tmpdir(),
        `surgical-kernel-idempotency-terminal-failure-${Date.now()}`
    );


const port =
    19080 +
    Math.floor(
        Math.random() * 1000
    );


const server =
    spawn(
        process.execPath,
        [
            join(
                projectRoot,
                "dist/server.js"
            )
        ],
        {
            cwd:
                projectRoot,

            env: {
                ...process.env,

                PORT:
                    String(port),

                SURGICAL_TEST_FORCE_FAILURE:
                    "true"
            },

            stdio: [
                "ignore",
                "pipe",
                "pipe"
            ]
        }
    );


let output =
    "";

let errorOutput =
    "";


server.stdout.on(
    "data",
    chunk => {
        output +=
            chunk.toString();
    }
);


server.stderr.on(
    "data",
    chunk => {
        errorOutput +=
            chunk.toString();
    }
);


const sleep =
    (ms: number) =>
        new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    ms
                )
        );


try {

    let healthy =
        false;


    for (
        let attempt = 0;
        attempt < 50;
        attempt++
    ) {

        try {

            const response =
                await fetch(
                    `http://127.0.0.1:${port}/health`
                );


            if (
                response.ok
            ) {

                healthy =
                    true;

                break;

            }

        } catch {
            // Server still starting.
        }


        await sleep(100);

    }


    if (
        !healthy
    ) {

        throw new Error(
            `HTTP server did not become ready.\n${output}\n${errorOutput}`
        );

    }


    const body = {

        context: {

            organizationId:
                "http-failure-org",

            projectId:
                "http-failure-project",

            actorId:
                "http-failure-actor"

        },

        mode:
            "deterministic",

        request:
            "HTTP terminal failure replay test"

    };


    const headers = {

        "Content-Type":
            "application/json",

        "Idempotency-Key":
            "http-terminal-failure-key",

        "X-Operation-Id":
            "operation-failure-001",

        "X-Correlation-Id":
            "correlation-failure-001"

    };


    const first =
        await fetch(
            `http://127.0.0.1:${port}/v1/operations`,
            {
                method:
                    "POST",

                headers,

                body:
                    JSON.stringify(
                        body
                    )

            }
        );


    if (
        first.status !== 500
    ) {

        throw new Error(
            `FAIL — first failure operation returned ${first.status}, expected 500.`
        );

    }


    const firstResponse =
        await first.json();


    if (
        firstResponse.error?.code !==
        "EXECUTION_FAILED"
    ) {

        throw new Error(
            "FAIL — first failure did not return EXECUTION_FAILED."
        );

    }


    const firstOperationId =
        firstResponse.error.operationId;


    const firstCorrelationId =
        firstResponse.error.correlationId;


    if (
        firstOperationId !==
        "operation-failure-001"
    ) {

        throw new Error(
            "FAIL — first failure operation identity was not preserved."
        );

    }


    if (
        firstCorrelationId !==
        "correlation-failure-001"
    ) {

        throw new Error(
            "FAIL — first failure correlation identity was not preserved."
        );

    }


    const second =
        await fetch(
            `http://127.0.0.1:${port}/v1/operations`,
            {
                method:
                    "POST",

                headers: {

                    ...headers,

                    "X-Operation-Id":
                        "operation-failure-002",

                    "X-Correlation-Id":
                        "correlation-failure-002"

                },

                body:
                    JSON.stringify(
                        body
                    )

            }
        );


    if (
        second.status !== 500
    ) {

        throw new Error(
            `FAIL — terminal failure replay returned ${second.status}, expected 500.`
        );

    }


    const secondResponse =
        await second.json();


    if (
        secondResponse.error?.code !==
        "EXECUTION_FAILED"
    ) {

        throw new Error(
            "FAIL — terminal failure replay did not preserve EXECUTION_FAILED."
        );

    }


    if (
        secondResponse.error.operationId !==
        firstOperationId
    ) {

        throw new Error(
            "FAIL — terminal failure replay created a different operation identity."
        );

    }


    if (
        secondResponse.error.correlationId !==
        firstCorrelationId
    ) {

        throw new Error(
            "FAIL — terminal failure replay created a different correlation identity."
        );

    }


    if (
        secondResponse.error.message !==
        firstResponse.error.message
    ) {

        throw new Error(
            "FAIL — terminal failure replay changed the original failure message."
        );

    }


    const replayOperationHeader =
        second.headers.get(
            "X-Operation-Id"
        );


    if (
        replayOperationHeader !==
        firstOperationId
    ) {

        throw new Error(
            "FAIL — replay response operation identity header was not preserved."
        );

    }


    const replayCorrelationHeader =
        second.headers.get(
            "X-Correlation-Id"
        );


    if (
        replayCorrelationHeader !==
        firstCorrelationId
    ) {

        throw new Error(
            "FAIL — replay response correlation identity header was not preserved."
        );

    }


    console.log(
        "PASS — first HTTP operation reached terminal failure."
    );


    console.log(
        `PASS — terminal failure operation identity established: ${firstOperationId}`
    );


    console.log(
        "PASS — second HTTP request reused persisted terminal failure."
    );


    console.log(
        "PASS — terminal failure replay preserved operation identity."
    );


    console.log(
        "PASS — terminal failure replay preserved correlation identity."
    );


    console.log(
        "PASS — terminal failure replay preserved error code."
    );


    console.log(
        "PASS — terminal failure replay preserved error message."
    );


    console.log(
        "PASS — terminal failure replay did not create a second execution."
    );


    console.log(
        "PASS — replay response identity headers preserved."
    );


    console.log(
        "IDEMPOTENCY HTTP TERMINAL FAILURE REPLAY TEST — ALL CASES PASSED"
    );


} finally {

    server.kill(
        "SIGTERM"
    );


    await sleep(200);


    if (
        !server.killed
    ) {

        server.kill(
            "SIGKILL"
        );

    }


    rmSync(
        testDirectory,
        {
            recursive:
                true,

            force:
                true
        }
    );

}
