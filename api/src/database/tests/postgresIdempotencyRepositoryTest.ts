import {
    applyMigrations
} from "../MigrationRunner.js";

import {
    databaseMigrations
} from "../MigrationRegistry.js";

import {
    closePostgresPool,
    createPostgresPool
} from "../PostgresPool.js";

import {
    IdempotencyRegistry
} from "../../runtime/operation/IdempotencyRegistry.js";

import {
    PostgresIdempotencyRepository
} from "../../runtime/operation/PostgresIdempotencyRepository.js";

import type {
    IdempotencyRecord
} from "../../runtime/operation/IdempotencyRegistry.js";


function assert(
    condition: boolean,
    message: string
): void {

    if (!condition) {

        throw new Error(
            `FAIL — ${message}`
        );

    }

}


function createRecord(
    overrides: Partial<IdempotencyRecord> = {}
): IdempotencyRecord {

    return {

        key:
            "postgres-idempotency-key",

        fingerprint:
            "postgres-idempotency-fingerprint",

        operationId:
            "postgres-idempotency-operation",

        correlationId:
            "postgres-idempotency-correlation",

        state:
            "pending",

        ...overrides

    };

}


if (!process.env.DATABASE_URL) {

    console.log(
        "SKIP — PostgreSQL idempotency repository test requires DATABASE_URL."
    );

} else {

    const pool =
        createPostgresPool();


    try {

        await applyMigrations(
            pool,
            databaseMigrations
        );


        const repository =
            new PostgresIdempotencyRepository(
                pool
            );


        await repository.clear();


        const record =
            createRecord();


        const results =
            await Promise.all([
                repository.createIfAbsent(
                    record
                ),

                repository.createIfAbsent({
                    ...record,

                    operationId:
                        "postgres-idempotency-race-b"
                }),

                repository.createIfAbsent({
                    ...record,

                    fingerprint:
                        "postgres-idempotency-conflict"
                })
            ]);


        assert(
            results.filter(
                created => created
            ).length === 1,
            "exactly one concurrent createIfAbsent call must win."
        );


        const persistedPending =
            await repository.get(
                record.key
            );


        assert(
            persistedPending?.fingerprint === record.fingerprint &&
            persistedPending.state === "pending",
            "the unique winner must preserve the pending record."
        );


        const registry =
            new IdempotencyRegistry(
                repository
            );


        const existing =
            await registry.begin(
                record.key,
                record.fingerprint,
                "postgres-idempotency-replay-operation",
                "postgres-idempotency-replay-correlation"
            );


        assert(
            existing.kind === "existing" &&
            existing.record.operationId === record.operationId,
            "same fingerprint must resolve the existing record."
        );


        const conflict =
            await registry.begin(
                record.key,
                "postgres-idempotency-different-fingerprint",
                "postgres-idempotency-conflict-operation",
                "postgres-idempotency-conflict-correlation"
            );


        assert(
            conflict.kind === "conflict",
            "different fingerprint must resolve as a conflict."
        );


        const response = {

            operationId:
                record.operationId,

            correlationId:
                record.correlationId,

            executionId:
                "postgres-idempotency-execution",

            status:
                "completed" as const,

            state:
                "completed" as const,

            mode:
                "deterministic" as const

        };


        await registry.complete(
            record.key,
            response
        );


        const completed =
            await repository.get(
                record.key
            );


        assert(
            completed?.state === "completed" &&
            completed.response?.status === 200 &&
            "executionId" in completed.response.body &&
            completed.response.body.executionId ===
            "postgres-idempotency-execution",
            "terminal response must persist through save."
        );


        const separatePool =
            createPostgresPool();


        try {

            const separateRepository =
                new PostgresIdempotencyRepository(
                    separatePool
                );


            const persisted =
                await separateRepository.get(
                    record.key
                );


            assert(
                persisted?.state === "completed" &&
                persisted.response !== undefined &&
                "executionId" in persisted.response.body &&
                persisted.response?.body.executionId ===
                "postgres-idempotency-execution",
                "completed idempotency state must survive repository replacement."
            );

        } finally {

            await closePostgresPool(
                separatePool
            );

        }


        assert(
            await repository.get(
                "postgres-idempotency-missing"
            ) === undefined,
            "missing idempotency records must remain undefined."
        );


        await repository.clear();


        assert(
            await repository.get(
                record.key
            ) === undefined,
            "clear must remove idempotency records."
        );


        console.log(
            "PASS — PostgreSQL idempotency repository parity validated."
        );

    } finally {

        await closePostgresPool(
            pool
        );

    }

}
