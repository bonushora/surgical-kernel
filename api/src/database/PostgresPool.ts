import {
    Pool
} from "pg";

import {
    loadPostgresConfig,
    PostgresConfig
} from "./PostgresConfig.js";


export function createPostgresPool(
    config: PostgresConfig =
        loadPostgresConfig()
): Pool {

    return new Pool({

        connectionString:
            config.connectionString

    });

}


export async function closePostgresPool(
    pool: Pool
): Promise<void> {

    await pool.end();

}
