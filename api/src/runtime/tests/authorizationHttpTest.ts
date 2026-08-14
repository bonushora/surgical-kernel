import {
    spawn
} from "node:child_process";

import {
    resolve
} from "node:path";


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


async function stopServer(): Promise<void> {

    if (
        server.exitCode === null
    ) {

        server.kill(
            "SIGTERM"
        );

        await sleep(200);

    }

}


async function main(): Promise<void> {

    console.log(
        "=================================================="
    );

    console.log(
        "HTTP AUTHORIZATION BOUNDARY TEST"
    );

    console.log(
        "=================================================="
    );


    try {

        console.log(
            "===== SERVER STARTUP ====="
        );


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


        console.log(
            "PASS — HTTP server became ready."
        );


        console.log(
            "===== CASE 1 — UNKNOWN ORGANIZATION ====="
        );


        const unknownOrganizationResponse =
            await fetch(
                `http://127.0.0.1:${port}/v1/operations`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "X-Operation-Id":
                            "authorization-http-001",

                        "X-Correlation-Id":
                            "authorization-correlation-001"
                    },

                    body:
                        JSON.stringify({

                            context: {

                                organizationId:
                                    "unknown",

                                projectId:
                                    "bonushora",

                                actorId:
                                    "authorization-http-actor"

                            },

                            mode:
                                "deterministic",

                            request:
                                "authorization HTTP denial test"

                        })
                }
            );


        if (
            unknownOrganizationResponse.status !==
            403
        ) {

            throw new Error(
                `FAIL — unknown organization returned ${unknownOrganizationResponse.status}, expected 403.`
            );

        }


        const unknownOrganizationBody =
            await unknownOrganizationResponse.json();


        if (
            unknownOrganizationBody.error?.code !==
            "FORBIDDEN"
        ) {

            throw new Error(
                "FAIL — unknown organization did not return FORBIDDEN."
            );

        }


        if (
            !unknownOrganizationBody.error?.details?.decisionId
        ) {

            throw new Error(
                "FAIL — authorization decision identity was not returned."
            );

        }


        if (
            unknownOrganizationBody.error?.details?.organizationId !==
            "unknown"
        ) {

            throw new Error(
                "FAIL — denied organization identity was not preserved."
            );

        }


        if (
            unknownOrganizationBody.error?.details?.projectId !==
            "bonushora"
        ) {

            throw new Error(
                "FAIL — denied project identity was not preserved."
            );

        }


        if (
            unknownOrganizationBody.error?.details?.actorId !==
            "authorization-http-actor"
        ) {

            throw new Error(
                "FAIL — denied actor identity was not preserved."
            );

        }


        console.log(
            "PASS — unknown organization rejected with HTTP 403 FORBIDDEN."
        );


        console.log(
            "===== CASE 2 — UNKNOWN PROJECT ====="
        );


        const unknownProjectResponse =
            await fetch(
                `http://127.0.0.1:${port}/v1/operations`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "X-Operation-Id":
                            "authorization-http-002",

                        "X-Correlation-Id":
                            "authorization-correlation-002"
                    },

                    body:
                        JSON.stringify({

                            context: {

                                organizationId:
                                    "bonora",

                                projectId:
                                    "unknown",

                                actorId:
                                    "authorization-http-actor"

                            },

                            mode:
                                "deterministic",

                            request:
                                "authorization HTTP project denial test"

                        })
                }
            );


        if (
            unknownProjectResponse.status !==
            403
        ) {

            throw new Error(
                `FAIL — unknown project returned ${unknownProjectResponse.status}, expected 403.`
            );

        }


        const unknownProjectBody =
            await unknownProjectResponse.json();


        if (
            unknownProjectBody.error?.code !==
            "FORBIDDEN"
        ) {

            throw new Error(
                "FAIL — unknown project did not return FORBIDDEN."
            );

        }


        console.log(
            "PASS — unknown project rejected with HTTP 403 FORBIDDEN."
        );


        console.log(
            "===== CASE 3 — ANONYMOUS ACTOR ====="
        );


        const anonymousResponse =
            await fetch(
                `http://127.0.0.1:${port}/v1/operations`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "X-Operation-Id":
                            "authorization-http-003",

                        "X-Correlation-Id":
                            "authorization-correlation-003"
                    },

                    body:
                        JSON.stringify({

                            context: {

                                organizationId:
                                    "bonora",

                                projectId:
                                    "bonushora",

                                actorId:
                                    "anonymous"

                            },

                            mode:
                                "deterministic",

                            request:
                                "authorization HTTP actor denial test"

                        })
                }
            );


        if (
            anonymousResponse.status !==
            403
        ) {

            throw new Error(
                `FAIL — anonymous actor returned ${anonymousResponse.status}, expected 403.`
            );

        }


        const anonymousBody =
            await anonymousResponse.json();


        if (
            anonymousBody.error?.code !==
            "FORBIDDEN"
        ) {

            throw new Error(
                "FAIL — anonymous actor did not return FORBIDDEN."
            );

        }


        console.log(
            "PASS — anonymous actor rejected with HTTP 403 FORBIDDEN."
        );


        console.log(
            "===== CASE 4 — VALID OPERATION ====="
        );


        const validResponse =
            await fetch(
                `http://127.0.0.1:${port}/v1/operations`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "X-Operation-Id":
                            "authorization-http-004",

                        "X-Correlation-Id":
                            "authorization-correlation-004"
                    },

                    body:
                        JSON.stringify({

                            context: {

                                organizationId:
                                    "bonora",

                                projectId:
                                    "bonushora",

                                actorId:
                                    "authorization-http-valid-actor"

                            },

                            mode:
                                "deterministic",

                            request:
                                "authorization HTTP allow test"

                        })
                }
            );


        if (
            validResponse.status !==
            200
        ) {

            const body =
                await validResponse.text();

            throw new Error(
                `FAIL — valid operation returned ${validResponse.status}: ${body}`
            );

        }


        const validBody =
            await validResponse.json();


        if (
            !validBody.executionId
        ) {

            throw new Error(
                "FAIL — authorized operation did not reach execution."
            );

        }


        if (
            validBody.status !==
            "completed"
        ) {

            throw new Error(
                `FAIL — authorized operation returned status ${validBody.status}.`
            );

        }


        if (
            validBody.operationId !==
            "authorization-http-004"
        ) {

            throw new Error(
                "FAIL — authorized operation identity was not preserved."
            );

        }


        console.log(
            "PASS — valid operation passed authorization and executed."
        );


        console.log(
            "===== CASE 5 — AUTHORIZATION BEFORE IDEMPOTENCY ====="
        );


        const deniedWithIdempotencyKey =
            await fetch(
                `http://127.0.0.1:${port}/v1/operations`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Idempotency-Key":
                            "authorization-denied-idempotency",

                        "X-Operation-Id":
                            "authorization-http-005",

                        "X-Correlation-Id":
                            "authorization-correlation-005"
                    },

                    body:
                        JSON.stringify({

                            context: {

                                organizationId:
                                    "unknown",

                                projectId:
                                    "bonushora",

                                actorId:
                                    "authorization-http-actor"

                            },

                            mode:
                                "deterministic",

                            request:
                                "authorization before idempotency test"

                        })
                }
            );


        if (
            deniedWithIdempotencyKey.status !==
            403
        ) {

            throw new Error(
                `FAIL — denied operation with idempotency key returned ${deniedWithIdempotencyKey.status}, expected 403.`
            );

        }


        const deniedWithIdempotencyBody =
            await deniedWithIdempotencyKey.json();


        if (
            deniedWithIdempotencyBody.error?.code !==
            "FORBIDDEN"
        ) {

            throw new Error(
                "FAIL — authorization did not execute before idempotency."
            );

        }


        console.log(
            "PASS — authorization boundary executes before idempotency."
        );


        console.log(
            "=================================================="
        );

        console.log(
            "HTTP AUTHORIZATION BOUNDARY TEST — ALL CASES PASSED"
        );

        console.log(
            "=================================================="
        );


    } finally {

        await stopServer();

    }

}


main()
    .catch(
        async error => {

            console.error(
                error
            );

            await stopServer();

            process.exit(
                1
            );

        }
    );
