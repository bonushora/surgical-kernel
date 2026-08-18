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
    PostgresAuthorizationAuditRepository
} from "../../runtime/audit/PostgresAuthorizationAuditRepository.js";

import type {
    AuthorizationAuditEvent
} from "../../runtime/audit/AuthorizationAuditEvent.js";


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


function createAudit(
    auditId: string,
    overrides: Partial<AuthorizationAuditEvent> = {}
): AuthorizationAuditEvent {

    return {

        auditId,

        type:
            "authorization.decision",

        timestamp:
            "2026-08-17T12:00:00.000Z",

        operationId:
            "postgres-audit-operation",

        correlationId:
            "postgres-audit-correlation",

        decisionId:
            "postgres-audit-decision",

        organizationId:
            "postgres-audit-organization",

        projectId:
            "postgres-audit-project",

        actorId:
            "postgres-audit-actor",

        mode:
            "deterministic",

        decision:
            "allowed",

        reason:
            "Authorization allowed.",

        idempotencyKey:
            "postgres-audit-idempotency",

        ...overrides

    };

}


if (!process.env.DATABASE_URL) {

    console.log(
        "SKIP — PostgreSQL authorization audit test requires DATABASE_URL."
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
            new PostgresAuthorizationAuditRepository(
                pool
            );


        await repository.clear();


        const allowed =
            createAudit(
                "postgres-audit-allowed"
            );

        const denied =
            createAudit(
                "postgres-audit-denied",
                {
                    timestamp:
                        "2026-08-17T12:01:00.000Z",

                    operationId:
                        "postgres-audit-denied-operation",

                    correlationId:
                        "postgres-audit-denied-correlation",

                    decisionId:
                        "postgres-audit-denied-decision",

                    organizationId:
                        "postgres-audit-denied-organization",

                    projectId:
                        "postgres-audit-denied-project",

                    actorId:
                        undefined,

                    decision:
                        "denied",

                    reason:
                        undefined,

                    idempotencyKey:
                        undefined
                }
            );


        const appended =
            await repository.append(
                allowed
            );


        await repository.append(
            denied
        );


        assert(
            appended.auditId === allowed.auditId &&
            appended.actorId === allowed.actorId &&
            appended.idempotencyKey === allowed.idempotencyKey,
            "append must preserve a complete audit event."
        );


        const byOperation =
            await repository.getByOperationId(
                allowed.operationId
            );


        assert(
            byOperation.length === 1 &&
            byOperation[0].auditId === allowed.auditId,
            "getByOperationId must return matching events."
        );


        const ordered =
            await repository.getAll();


        assert(
            ordered.length === 2 &&
            ordered[0].auditId === allowed.auditId &&
            ordered[1].auditId === denied.auditId,
            "getAll must return events ordered by timestamp."
        );


        const deniedMatches =
            await repository.query({
                organizationId:
                    denied.organizationId,

                projectId:
                    denied.projectId,

                decision:
                    "denied"
            });


        assert(
            deniedMatches.length === 1 &&
            deniedMatches[0].actorId === undefined &&
            deniedMatches[0].reason === undefined &&
            deniedMatches[0].idempotencyKey === undefined,
            "query must preserve optional-field omissions."
        );


        const overwritten =
            await repository.append(
                {
                    ...allowed,

                    decision:
                        "denied",

                    reason:
                        "Overwritten audit."
                }
            );


        const afterOverwrite =
            await repository.getAll();


        assert(
            overwritten.decision === "denied" &&
            afterOverwrite.length === 2 &&
            afterOverwrite[0].decision === "denied",
            "duplicate audit IDs must overwrite the persisted event."
        );


        const separatePool =
            createPostgresPool();


        try {

            const separateRepository =
                new PostgresAuthorizationAuditRepository(
                    separatePool
                );


            const persisted =
                await separateRepository.query({
                    decisionId:
                        allowed.decisionId,

                    idempotencyKey:
                        allowed.idempotencyKey
                });


            assert(
                persisted.length === 1 &&
                persisted[0].reason === "Overwritten audit.",
                "audit events must persist across repository instances."
            );

        } finally {

            await closePostgresPool(
                separatePool
            );

        }


        await repository.clear();


        assert(
            (await repository.getAll()).length === 0,
            "clear must remove all audit events."
        );


        console.log(
            "PASS — PostgreSQL authorization audit parity validated."
        );

    } finally {

        await closePostgresPool(
            pool
        );

    }

}
