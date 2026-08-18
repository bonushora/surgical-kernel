import {
    applyMigrations
} from "../MigrationRunner.js";

import {
    databaseMigrations
} from "../MigrationRegistry.js";

import {
    loadPostgresConfig
} from "../PostgresConfig.js";

import {
    closePostgresPool,
    createPostgresPool
} from "../PostgresPool.js";


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


let missingConfigurationRejected =
    false;


try {

    loadPostgresConfig({});

} catch (error) {

    missingConfigurationRejected =
        error instanceof Error &&
        error.message ===
        "DATABASE_URL is required for PostgreSQL persistence.";

}


assert(
    missingConfigurationRejected,
    "missing DATABASE_URL must be rejected."
);


if (!process.env.DATABASE_URL) {

    console.log(
        "SKIP — PostgreSQL foundation connection test requires DATABASE_URL."
    );

} else {

    const pool =
        createPostgresPool();


    try {

        await applyMigrations(
            pool,
            databaseMigrations
        );


        const result =
            await pool.query<{ schema_name: string }>(
                `
                    SELECT schema_name
                    FROM information_schema.schemata
                    WHERE schema_name = 'surgical_kernel'
                `
            );


        assert(
            result.rowCount === 1,
            "initial migration must create the surgical_kernel schema."
        );


        console.log(
            "PASS — PostgreSQL foundation migration applied."
        );

    } finally {

        await closePostgresPool(
            pool
        );

    }

}
