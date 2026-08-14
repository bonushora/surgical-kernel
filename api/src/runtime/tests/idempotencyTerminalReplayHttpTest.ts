import {
    resolve
} from "node:path";

import {
    spawn
} from "node:child_process";


const projectRoot =
    resolve(
        new URL(
            "../../..",
            import.meta.url
        ).pathname
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
            resolve(
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
                    String(port)
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
                "terminal-replay-http-org",

            projectId:
                "terminal-replay-http-project",

            actorId:
                "terminal-replay-http-actor"
        },

        mode:
            "deterministic",

        request:
            "HTTP terminal replay validation"
    };


    const headers = {
        "Content-Type":
            "application/json",

        "Idempotency-Key":
            "terminal-replay-http-key",

        "X-Operation-Id":
            "terminal-replay-operation-001",

        "X-Correlation-Id":
            "terminal-replay-correlation-001"
    };


    /*
     * FIRST REQUEST
     *
     * This request must create and execute
     * the operation normally.
     */

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
        first.status !== 200
    ) {

        throw new Error(
            `FAIL — first terminal replay request returned ${first.status}.`
        );

    }


    const firstResponse =
        await first.json();


    if (
        firstResponse.operationId !==
        "terminal-replay-operation-001"
    ) {

        throw new Error(
            "FAIL — first operation identity was not preserved."
        );

    }


    if (
        !firstResponse.executionId
    ) {

        throw new Error(
            "FAIL — first request did not produce execution identity."
        );

    }


    if (
        firstResponse.state !==
        "completed"
    ) {

        throw new Error(
            `FAIL — first request did not reach terminal state. Received: ${firstResponse.state}`
        );

    }


    const firstExecutionId =
        firstResponse.executionId;


    /*
     * SECOND REQUEST
     *
     * Same idempotency key and same fingerprint.
     *
     * Operation and correlation headers deliberately
     * remain identical here so this represents a
     * true terminal replay.
     */

    const replay =
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
        replay.status !== 200
    ) {

        throw new Error(
            `FAIL — terminal replay returned ${replay.status}.`
        );

    }


    const replayResponse =
        await replay.json();


    /*
     * TERMINAL IDENTITY MUST BE STABLE
     */

    if (
        replayResponse.operationId !==
        firstResponse.operationId
    ) {

        throw new Error(
            "FAIL — terminal replay changed operation identity."
        );

    }


    if (
        replayResponse.executionId !==
        firstExecutionId
    ) {

        throw new Error(
            "FAIL — terminal replay generated a second execution."
        );

    }


    if (
        replayResponse.state !==
        firstResponse.state
    ) {

        throw new Error(
            "FAIL — terminal replay changed execution state."
        );

    }


    if (
        replayResponse.status !==
        firstResponse.status
    ) {

        throw new Error(
            "FAIL — terminal replay changed operation status."
        );

    }


    /*
     * RESULT MUST ALSO BE REPLAYED.
     */

    if (
        JSON.stringify(
            replayResponse.result
        ) !==
        JSON.stringify(
            firstResponse.result
        )
    ) {

        throw new Error(
            "FAIL — terminal replay returned a different result."
        );

    }


    /*
     * RESPONSE IDENTITY HEADERS
     */

    const replayOperationHeader =
        replay.headers.get(
            "X-Operation-Id"
        );


    if (
        replayOperationHeader !==
        firstResponse.operationId
    ) {

        throw new Error(
            "FAIL — replay response operation identity header was not preserved."
        );

    }


    const replayCorrelationHeader =
        replay.headers.get(
            "X-Correlation-Id"
        );


    if (
        replayCorrelationHeader !==
        headers["X-Correlation-Id"]
    ) {

        throw new Error(
            "FAIL — replay response correlation identity header was not preserved."
        );

    }


    console.log(
        "PASS — first HTTP operation reached terminal state."
    );


    console.log(
        `PASS — terminal execution identity established: ${firstExecutionId}`
    );


    console.log(
        "PASS — second HTTP request reused persisted terminal result."
    );


    console.log(
        "PASS — terminal replay preserved operation identity."
    );


    console.log(
        "PASS — terminal replay preserved execution identity."
    );


    console.log(
        "PASS — terminal replay preserved status and state."
    );


    console.log(
        "PASS — terminal replay preserved result."
    );


    console.log(
        "PASS — terminal replay did not create a second execution."
    );


    console.log(
        "PASS — replay response identity headers preserved."
    );


    console.log(
        "IDEMPOTENCY HTTP TERMINAL REPLAY TEST — ALL CASES PASSED"
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

}
