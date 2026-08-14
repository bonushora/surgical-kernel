import {
    mkdtempSync,
    readFileSync,
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


const testDirectory =
    mkdtempSync(
        join(
            tmpdir(),
            "surgical-kernel-idempotency-multiprocess-"
        )
    );


const key =
    "tenant-multiprocess:project-a:key-001";


const fingerprint =
    "fingerprint-multiprocess";


const projectRoot =
    resolve(
        new URL(
            "../../..",
            import.meta.url
        ).pathname
    );

const repositoryModule =
    resolve(
        projectRoot,
        "dist/runtime/operation/FileIdempotencyRepository.js"
    );

const registryModule =
    resolve(
        projectRoot,
        "dist/runtime/operation/IdempotencyRegistry.js"
    );

const worker =
    `
import {
    FileIdempotencyRepository
} from "file://${repositoryModule}";

import {
    IdempotencyRegistry
} from "file://${registryModule}";

const repository =
    new FileIdempotencyRepository(
        process.argv[2]
    );

const registry =
    new IdempotencyRegistry(
        repository
    );

const result =
    registry.begin(
        process.argv[3],
        process.argv[4],
        process.argv[5],
        process.argv[6]
    );

console.log(
    JSON.stringify({
        kind: result.kind,
        operationId: result.record.operationId,
        correlationId: result.record.correlationId
    })
);
`;


const workerFile =
    join(
        testDirectory,
        "worker.mjs"
    );


const {
    writeFileSync
} = await import("node:fs");


writeFileSync(
    workerFile,
    worker
);


function runWorker(
    operationId: string,
    correlationId: string
): Promise<string> {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const child =
                spawn(
                    process.execPath,
                    [
                        workerFile,
                        testDirectory,
                        key,
                        fingerprint,
                        operationId,
                        correlationId
                    ],
                    {
                        stdio: [
                            "ignore",
                            "pipe",
                            "pipe"
                        ]
                    }
                );


            let stdout =
                "";


            let stderr =
                "";


            child.stdout.on(
                "data",
                data => {
                    stdout +=
                        data.toString();
                }
            );


            child.stderr.on(
                "data",
                data => {
                    stderr +=
                        data.toString();
                }
            );


            child.on(
                "error",
                reject
            );


            child.on(
                "close",
                code => {

                    if (
                        code !== 0
                    ) {

                        reject(
                            new Error(
                                stderr ||
                                `Worker exited with code ${code}`
                            )
                        );

                        return;

                    }


                    resolve(
                        stdout.trim()
                    );

                }
            );

        }
    );

}


try {

    const results =
        await Promise.all([
            runWorker(
                "operation-process-A",
                "correlation-process-A"
            ),

            runWorker(
                "operation-process-B",
                "correlation-process-B"
            )
        ]);


    const parsed =
        results.map(
            value =>
                JSON.parse(value)
        );


    const newResults =
        parsed.filter(
            result =>
                result.kind === "new"
        );


    const existingResults =
        parsed.filter(
            result =>
                result.kind === "existing"
        );


    const conflictResults =
        parsed.filter(
            result =>
                result.kind === "conflict"
        );


    if (
        newResults.length !== 1
    ) {

        throw new Error(
            `FAIL — expected exactly one NEW result, received ${newResults.length}.`
        );

    }


    if (
        existingResults.length !== 1
    ) {

        throw new Error(
            `FAIL — expected exactly one EXISTING result, received ${existingResults.length}.`
        );

    }


    if (
        conflictResults.length !== 0
    ) {

        throw new Error(
            `FAIL — expected zero CONFLICT results, received ${conflictResults.length}.`
        );

    }


    const files =
        await (
            await import("node:fs/promises")
        ).readdir(
            testDirectory
        );


    const records =
        files.filter(
            file =>
                file.endsWith(".json")
        );


    if (
        records.length !== 1
    ) {

        throw new Error(
            `FAIL — expected exactly one persisted idempotency record, found ${records.length}.`
        );

    }


    const persisted =
        JSON.parse(
            readFileSync(
                join(
                    testDirectory,
                    records[0]
                ),
                "utf-8"
            )
        );


    const winner =
        newResults[0].operationId;


    if (
        persisted.operationId !== winner
    ) {

        throw new Error(
            "FAIL — persisted operation identity does not match the unique winner."
        );

    }


    console.log(
        "PASS — two independent Node processes competed for the same key."
    );


    console.log(
        "PASS — exactly one process became NEW."
    );


    console.log(
        "PASS — exactly one process became EXISTING."
    );


    console.log(
        "PASS — no CONFLICT occurred."
    );


    console.log(
        `PASS — persisted winner preserved: ${winner}`
    );


    console.log(
        "PASS — exactly one idempotency record was persisted."
    );


    console.log(
        "IDEMPOTENCY MULTI-PROCESS TEST — ALL CASES PASSED"
    );

} finally {

    rmSync(
        testDirectory,
        {
            recursive: true,
            force: true
        }
    );

}
