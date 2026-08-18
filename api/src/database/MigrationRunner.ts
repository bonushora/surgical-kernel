import type {
    Pool,
    PoolClient
} from "pg";


export interface DatabaseMigration {

    id: string;

    sql: string;

}


async function ensureMigrationTable(
    client: PoolClient
): Promise<void> {

    await client.query(
        `
            CREATE TABLE IF NOT EXISTS surgical_kernel_schema_migrations (
                id TEXT PRIMARY KEY,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `
    );

}


export async function applyMigrations(
    pool: Pool,
    migrations: readonly DatabaseMigration[]
): Promise<void> {

    const client =
        await pool.connect();


    try {

        await client.query(
            "BEGIN"
        );


        await ensureMigrationTable(
            client
        );


        for (
            const migration
            of migrations
        ) {

            const applied =
                await client.query<{ id: string }>(
                    `
                        SELECT id
                        FROM surgical_kernel_schema_migrations
                        WHERE id = $1
                    `,
                    [
                        migration.id
                    ]
                );


            if (applied.rowCount !== 0) {

                continue;

            }


            await client.query(
                migration.sql
            );


            await client.query(
                `
                    INSERT INTO surgical_kernel_schema_migrations (
                        id
                    ) VALUES ($1)
                `,
                [
                    migration.id
                ]
            );

        }


        await client.query(
            "COMMIT"
        );

    } catch (error) {

        await client.query(
            "ROLLBACK"
        );

        throw error;

    } finally {

        client.release();

    }

}
