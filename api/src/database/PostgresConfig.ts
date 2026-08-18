export interface PostgresConfig {

    connectionString: string;

}


export function loadPostgresConfig(
    environment: NodeJS.ProcessEnv = process.env
): PostgresConfig {

    const connectionString =
        environment.DATABASE_URL?.trim();


    if (!connectionString) {

        throw new Error(
            "DATABASE_URL is required for PostgreSQL persistence."
        );

    }


    return {

        connectionString

    };

}
