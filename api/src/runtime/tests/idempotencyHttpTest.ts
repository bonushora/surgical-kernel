import {
    mkdtempSync,
    rmSync
} from "node:fs";

import {
    tmpdir
} from "node:os";

import {
    join,
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


const testDirectory =
    mkdtempSync(
        join(
            tmpdir(),
            "surgical-kernel-idempotency-http-"
        )
    );


const port =
    18080 +
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
                "http-test-org",

            projectId:
                "http-test-project",

            actorId:
                "http-test-actor"
        },

        mode:
            "deterministic",

        request:
            "HTTP idempotency test request"
    };


    const headers = {
        "Content-Type":
            "application/json",

        "Idempotency-Key":
            "http-idempotency-key",

        "X-Operation-Id":
            "operation-http-001",

        "X-Correlation-Id":
            "correlation-http-001"
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
        first.status !== 200
    ) {

        throw new Error(
            `FAIL — first HTTP operation returned ${first.status}.`
        );

    }


    const firstResponse =
        await first.json();


    if (
        firstResponse.operationId !==
        "operation-http-001"
    ) {

        throw new Error(
            "FAIL — first operation identity was not preserved."
        );

    }


    if (
        !firstResponse.executionId
    ) {

        throw new Error(
            "FAIL — first operation did not return execution identity."
        );

    }


    const firstExecutionId =
        firstResponse.executionId;


    const duplicate =
        await fetch(
            `http://127.0.0.1:${port}/v1/operations`,
            {
                method:
                    "POST",

                headers: {
                    ...headers,

                    "X-Operation-Id":
                        "operation-http-002",

                    "X-Correlation-Id":
                        "correlation-http-002"
                },

                body:
                    JSON.stringify(
                        body
                    )
            }
        );


    if (
        duplicate.status !== 200
    ) {

        throw new Error(
            `FAIL — duplicate HTTP operation returned ${duplicate.status}.`
        );

    }


    const duplicateResponse =
        await duplicate.json();


    if (
        duplicateResponse.operationId !==
        "operation-http-001"
    ) {

        throw new Error(
            "FAIL — duplicate returned a different operation identity."
        );

    }


    if (
        duplicateResponse.executionId !==
        firstExecutionId
    ) {

        throw new Error(
            "FAIL — duplicate executed a second operation."
        );

    }


    const conflictBody = {
        ...body,

        request:
            "DIFFERENT HTTP REQUEST"
    };


    const conflict =
        await fetch(
            `http://127.0.0.1:${port}/v1/operations`,
            {
                method:
                    "POST",

                headers: {
                    ...headers,

                    "X-Operation-Id":
                        "operation-http-003",

                    "X-Correlation-Id":
                        "correlation-http-003"
                },

                body:
                    JSON.stringify(
                        conflictBody
                    )
            }
        );


    if (
        conflict.status !== 409
    ) {

        throw new Error(
            `FAIL — idempotency conflict returned ${conflict.status}, expected 409.`
        );

    }


    const conflictResponse =
        await conflict.json();

    if (
        conflictResponse.error?.code !==
        "IDEMPOTENCY_CONFLICT"
    ) {

        throw new Error(
            "FAIL — HTTP conflict did not return IDEMPOTENCY_CONFLICT."
        );

    }


    const operationHeader =
        first.headers.get(
            "X-Operation-Id"
        );


    if (
        operationHeader !==
        "operation-http-001"
    ) {

        throw new Error(
            "FAIL — operation identity header was not preserved."
        );

    }


    const correlationHeader =
        first.headers.get(
            "X-Correlation-Id"
        );


    if (
        correlationHeader !==
        "correlation-http-001"
    ) {

        throw new Error(
            "FAIL — correlation identity header was not preserved."
        );

    }


    console.log(
        "PASS — first HTTP operation completed."
    );

    console.log(
        "PASS — duplicate HTTP operation reused persisted idempotency result."
    );

    console.log(
        `PASS — execution identity preserved: ${firstExecutionId}`
    );

    console.log(
        "PASS — HTTP idempotency conflict returned 409."
    );

    console.log(
        "PASS — operation identity header preserved."
    );

    console.log(
        "PASS — correlation identity header preserved."
    );

    console.log(
        "IDEMPOTENCY HTTP TEST — ALL CASES PASSED"
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
