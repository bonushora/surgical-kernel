import {
    mkdtempSync,
    rmSync
} from "node:fs";

import {
    tmpdir
} from "node:os";

import {
    join
} from "node:path";

import {
    FileIdempotencyRepository
} from "../operation/FileIdempotencyRepository.js";

import {
    IdempotencyRegistry
} from "../operation/IdempotencyRegistry.js";


const testDirectory =
    mkdtempSync(
        join(
            tmpdir(),
            "surgical-kernel-idempotency-concurrency-"
        )
    );


try {

    const repository =
        new FileIdempotencyRepository(
            testDirectory
        );


    const registryA =
        new IdempotencyRegistry(
            repository
        );


    const registryB =
        new IdempotencyRegistry(
            repository
        );


    const key =
        "tenant-concurrency:project-a:key-001";


    const fingerprint =
        "fingerprint-concurrency";


    const results =
        await Promise.all([
            Promise.resolve().then(
                () =>
                    registryA.begin(
                        key,
                        fingerprint,
                        "operation-A",
                        "correlation-A"
                    )
            ),

            Promise.resolve().then(
                () =>
                    registryB.begin(
                        key,
                        fingerprint,
                        "operation-B",
                        "correlation-B"
                    )
            )
        ]);


    const newResults =
        results.filter(
            result =>
                result.kind === "new"
        );


    const existingResults =
        results.filter(
            result =>
                result.kind === "existing"
        );


    const conflictResults =
        results.filter(
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


    const stored =
        registryA.get(
            key
        );


    if (!stored) {

        throw new Error(
            "FAIL — concurrent operation was not persisted."
        );

    }


    const winner =
        newResults[0].record.operationId;


    if (
        stored.operationId !== winner
    ) {

        throw new Error(
            "FAIL — persisted operation identity does not match the NEW winner."
        );

    }


    console.log(
        "PASS — exactly one concurrent operation won."
    );


    console.log(
        "PASS — exactly one concurrent operation was detected as existing."
    );


    console.log(
        "PASS — no false idempotency conflict occurred."
    );


    console.log(
        `PASS — winning operation identity preserved: ${winner}`
    );


    console.log(
        "IDEMPOTENCY CONCURRENCY TEST — ALL CASES PASSED"
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
