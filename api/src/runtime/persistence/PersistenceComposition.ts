import type {
    ExecutionRepository
} from "../../store/ExecutionRepository.js";

import {
    ExecutionStoreRepository
} from "../../store/ExecutionStoreRepository.js";

import {
    PostgresExecutionRepository
} from "../../store/PostgresExecutionRepository.js";

import {
    closePostgresPool,
    createPostgresPool
} from "../../database/PostgresPool.js";

import type {
    Pool
} from "pg";

import {
    loadPostgresConfig
} from "../../database/PostgresConfig.js";

import {
    applyMigrations
} from "../../database/MigrationRunner.js";

import {
    databaseMigrations
} from "../../database/MigrationRegistry.js";

import {
    configureAuthorizationAuditRepository
} from "../audit/AuthorizationAuditStore.js";

import {
    FileAuthorizationAuditRepository
} from "../audit/FileAuthorizationAuditRepository.js";

import {
    PostgresAuthorizationAuditRepository
} from "../audit/PostgresAuthorizationAuditRepository.js";

import {
    configureEventRepository
} from "../events/EventStore.js";

import {
    FileEventRepository
} from "../events/FileEventRepository.js";

import {
    PostgresEventRepository
} from "../events/PostgresEventRepository.js";

import {
    FileIdempotencyRepository
} from "../operation/FileIdempotencyRepository.js";

import type {
    IdempotencyRepository
} from "../operation/IdempotencyRepository.js";

import {
    PostgresIdempotencyRepository
} from "../operation/PostgresIdempotencyRepository.js";


export interface PersistenceComposition {

    executionRepository?: ExecutionRepository;

}


let executionRepository:
    ExecutionRepository =
    new ExecutionStoreRepository();


let idempotencyRepository:
    IdempotencyRepository =
    new FileIdempotencyRepository();


let postgresPool:
    Pool
    | undefined;


export function configurePersistence(
    composition: PersistenceComposition = {}
): void {

    executionRepository =
        composition.executionRepository ??
        new ExecutionStoreRepository();

}


export function getExecutionRepository(): ExecutionRepository {

    return executionRepository;

}


export function getIdempotencyRepository(): IdempotencyRepository {

    return idempotencyRepository;

}


export async function configurePersistenceFromEnvironment(
    environment: NodeJS.ProcessEnv = process.env
): Promise<void> {

    const mode =
        environment.PERSISTENCE_MODE ??
        "filesystem";


    if (
        mode === "filesystem"
    ) {

        configurePersistence();

        configureAuthorizationAuditRepository(
            new FileAuthorizationAuditRepository()
        );

        idempotencyRepository =
            new FileIdempotencyRepository();

        configureEventRepository(
            new FileEventRepository()
        );

        return;

    }


    if (
        mode !== "postgres"
    ) {

        throw new Error(
            "PERSISTENCE_MODE must be either filesystem or postgres."
        );

    }


    const pool =
        postgresPool ??
        createPostgresPool(
            loadPostgresConfig(
                environment
            )
        );


    postgresPool =
        pool;


    await applyMigrations(
        pool,
        databaseMigrations
    );


    configurePersistence({
        executionRepository:
            new PostgresExecutionRepository(
                pool
            )
    });


    configureAuthorizationAuditRepository(
        new PostgresAuthorizationAuditRepository(
            pool
        )
    );


    idempotencyRepository =
        new PostgresIdempotencyRepository(
            pool
        );


    configureEventRepository(
        new PostgresEventRepository(
            pool
        )
    );

}


export async function closePersistence(): Promise<void> {

    if (!postgresPool) {

        return;

    }


    const pool =
        postgresPool;


    postgresPool =
        undefined;


    await closePostgresPool(
        pool
    );

}
