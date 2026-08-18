import {
    readFileSync
} from "node:fs";

import {
    fileURLToPath
} from "node:url";

import type {
    DatabaseMigration
} from "./MigrationRunner.js";


const initialMigrationSql =
    readFileSync(
        fileURLToPath(
            new URL(
                "./migrations/001_initial.sql",
                import.meta.url
            )
        ),
        "utf-8"
    );


const executionStateMigrationSql =
    readFileSync(
        fileURLToPath(
            new URL(
                "./migrations/002_execution_state.sql",
                import.meta.url
            )
        ),
        "utf-8"
    );


const authorizationAuditMigrationSql =
    readFileSync(
        fileURLToPath(
            new URL(
                "./migrations/003_authorization_audit.sql",
                import.meta.url
            )
        ),
        "utf-8"
    );


const idempotencyMigrationSql =
    readFileSync(
        fileURLToPath(
            new URL(
                "./migrations/004_idempotency.sql",
                import.meta.url
            )
        ),
        "utf-8"
    );


const eventsMigrationSql =
    readFileSync(
        fileURLToPath(
            new URL(
                "./migrations/005_events.sql",
                import.meta.url
            )
        ),
        "utf-8"
    );


export const databaseMigrations:
    readonly DatabaseMigration[] =
    [
        {
            id:
                "001_initial",

            sql:
                initialMigrationSql
        },
        {
            id:
                "002_execution_state",

            sql:
                executionStateMigrationSql
        },
        {
            id:
                "003_authorization_audit",

            sql:
                authorizationAuditMigrationSql
        },
        {
            id:
                "004_idempotency",

            sql:
                idempotencyMigrationSql
        },
        {
            id:
                "005_events",

            sql:
                eventsMigrationSql
        }
    ];
