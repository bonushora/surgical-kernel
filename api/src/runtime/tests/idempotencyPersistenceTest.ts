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
            "surgical-kernel-idempotency-"
        )
    );


try {

    const repository =
        new FileIdempotencyRepository(
            testDirectory
        );


    const key =
        "persistence-test:project-a:key-001";


    const fingerprint =
        "fingerprint-persistence-a";


    const operationId =
        "operation-persistence-001";


    const correlationId =
        "correlation-persistence-001";


    const firstRegistry =
        new IdempotencyRegistry(
            repository
        );


    const first =
        firstRegistry.begin(
            key,
            fingerprint,
            operationId,
            correlationId
        );


    if (
        first.kind !== "new"
    ) {

        throw new Error(
            "FAIL — first persistent operation was not registered as new."
        );

    }


    const response = {

        operationId,

        correlationId,

        executionId:
            "execution-persistence-001",

        status:
            "completed" as const,

        state:
            "completed" as const,

        mode:
            "deterministic" as const

    };


    firstRegistry.complete(
        key,
        response
    );


    console.log(
        "PASS — operation persisted through first registry."
    );


    const secondRegistry =
        new IdempotencyRegistry(
            repository
        );


    const reconstructed =
        secondRegistry.begin(
            key,
            fingerprint,
            "operation-persistence-002",
            "correlation-persistence-002"
        );


    if (
        reconstructed.kind !== "existing"
    ) {

        throw new Error(
            "FAIL — persisted idempotency record was not reconstructed."
        );

    }


    if (
        reconstructed.record.operationId !==
        operationId
    ) {

        throw new Error(
            "FAIL — persisted operation identity was not preserved."
        );

    }


    if (
        reconstructed.record.correlationId !==
        correlationId
    ) {

        throw new Error(
            "FAIL — persisted correlation identity was not preserved."
        );

    }


    if (
        !reconstructed.record.response ||
        !("executionId" in reconstructed.record.response.body) ||
        reconstructed.record.response.body.executionId !==
        "execution-persistence-001"
    ) {

        throw new Error(
            "FAIL — persisted response was not reconstructed."
        );

    }


    console.log(
        "PASS — persisted record reconstructed by new registry."
    );

    console.log(
        "PASS — operation identity preserved."
    );

    console.log(
        "PASS — correlation identity preserved."
    );

    console.log(
        "PASS — completed response preserved."
    );

    console.log(
        "IDEMPOTENCY PERSISTENCE TEST — ALL CASES PASSED"
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
