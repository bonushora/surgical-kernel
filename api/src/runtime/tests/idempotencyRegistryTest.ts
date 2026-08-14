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
            "surgical-kernel-idempotency-registry-"
        )
    );


try {

    const repository =
        new FileIdempotencyRepository(
            testDirectory
        );


    const registry =
        new IdempotencyRegistry(
            repository
        );


    const first =
        registry.begin(
            "tenant-a:project-a:key-001",
            "fingerprint-a",
            "operation-001",
            "correlation-001"
        );


    if (
        first.kind !== "new"
    ) {

        throw new Error(
            "FAIL — first idempotency registration was not new."
        );

    }


    const duplicatePending =
        registry.begin(
            "tenant-a:project-a:key-001",
            "fingerprint-a",
            "operation-002",
            "correlation-002"
        );


    if (
        duplicatePending.kind !== "existing"
    ) {

        throw new Error(
            "FAIL — duplicate pending operation was not detected."
        );

    }


    if (
        duplicatePending.record.operationId !==
        "operation-001"
    ) {

        throw new Error(
            "FAIL — duplicate returned a different operation identity."
        );

    }


    const conflict =
        registry.begin(
            "tenant-a:project-a:key-001",
            "fingerprint-b",
            "operation-003",
            "correlation-003"
        );


    if (
        conflict.kind !== "conflict"
    ) {

        throw new Error(
            "FAIL — same idempotency key with different fingerprint was accepted."
        );

    }


    const response = {

        operationId:
            "operation-001",

        correlationId:
            "correlation-001",

        executionId:
            "execution-001",

        status:
            "completed" as const,

        state:
            "completed" as const,

        mode:
            "deterministic" as const

    };


    registry.complete(
        "tenant-a:project-a:key-001",
        response
    );


    const duplicateCompleted =
        registry.begin(
            "tenant-a:project-a:key-001",
            "fingerprint-a",
            "operation-004",
            "correlation-004"
        );


    if (
        duplicateCompleted.kind !== "existing"
    ) {

        throw new Error(
            "FAIL — completed idempotent operation was not recovered."
        );

    }


    if (
        !duplicateCompleted.record.response ||
        !("executionId" in duplicateCompleted.record.response.body) ||
        duplicateCompleted.record.response.body.executionId !==
        "execution-001"
    ) {

        throw new Error(
            "FAIL — stored idempotent response was not preserved."
        );

    }


    console.log(
        "PASS — first operation registered."
    );


    console.log(
        "PASS — duplicate pending operation detected."
    );


    console.log(
        "PASS — idempotency conflict detected."
    );


    console.log(
        "PASS — completed operation response preserved."
    );


    console.log(
        "IDEMPOTENCY REGISTRY TEST — ALL CASES PASSED"
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
