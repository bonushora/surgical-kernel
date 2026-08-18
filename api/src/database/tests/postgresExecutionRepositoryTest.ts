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
    PostgresExecutionRepository
} from "../../store/PostgresExecutionRepository.js";

import type {
    Execution
} from "../../store/executionStore.js";


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


function createExecution(
    executionId: string,
    state: Execution["state"],
    overrides: Partial<Execution> = {}
): Execution {

    return {

        executionId,

        context: {
            organizationId:
                "postgres-repository-organization",

            projectId:
                "postgres-repository-project",

            actorId:
                "postgres-repository-actor",

            role:
                "consumer",

            targetProjectId:
                "postgres-repository-target"
        },

        projectId:
            "postgres-repository-project",

        mode:
            "deterministic",

        request:
            `request:${executionId}`,

        state,

        createdAt:
            "2026-08-17T12:00:00.000Z",

        ...overrides

    };

}


if (!process.env.DATABASE_URL) {

    console.log(
        "SKIP — PostgreSQL execution repository test requires DATABASE_URL."
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
            new PostgresExecutionRepository(
                pool
            );


        const initialized =
            createExecution(
                "postgres-repository-initialized",
                "initialized"
            );


        const created =
            await repository.create(
                initialized
            );


        assert(
            created.executionId === initialized.executionId &&
            created.context.targetProjectId ===
            initialized.context.targetProjectId &&
            created.result === undefined &&
            created.updatedAt === undefined,
            "create must preserve required fields and optional omissions."
        );


        const loaded =
            await repository.get(
                initialized.executionId
            );


        assert(
            loaded?.request === initialized.request &&
            loaded.context.actorId === initialized.context.actorId,
            "get must return the created execution."
        );


        for (
            const state
            of [
                "running",
                "completed",
                "failed"
            ] as const
        ) {

            const execution =
                createExecution(
                    `postgres-repository-${state}`,
                    state
                );


            await repository.create(
                execution
            );


            const persisted =
                await repository.get(
                    execution.executionId
                );


            assert(
                persisted?.state === state,
                `${state} state must persist.`
            );

        }


        const result = {

            output:
                "postgres repository result",

            provider:
                "postgres-repository-provider",

            model:
                "postgres-repository-model",

            metadata: {

                source:
                    "postgres-repository-test"

            }

        };


        const updated =
            await repository.update(
                initialized.executionId,
                {
                    state:
                        "running",

                    result,

                    updatedAt:
                        "2000-01-01T00:00:00.000Z"
                }
            );


        assert(
            updated?.state === "running" &&
            updated.result?.metadata?.source ===
            "postgres-repository-test" &&
            updated.updatedAt !== undefined &&
            updated.updatedAt !==
            "2000-01-01T00:00:00.000Z",
            "update must persist patches and own updatedAt."
        );


        const missing =
            await repository.update(
                "postgres-repository-missing",
                {
                    state:
                        "failed"
                }
            );


        assert(
            missing === undefined &&
            await repository.get(
                "postgres-repository-missing"
            ) === undefined,
            "missing executions must remain absent."
        );


        const recovered =
            createExecution(
                "postgres-repository-recovery",
                "failed",
                {
                    result,

                    createdAt:
                        "2026-08-17T13:00:00.000Z",

                    updatedAt:
                        "2026-08-17T14:00:00.000Z"
                }
            );


        await repository.restore(
            recovered
        );


        const separatePool =
            createPostgresPool();


        try {

            const separateRepository =
                new PostgresExecutionRepository(
                    separatePool
                );


            const reloaded =
                await separateRepository.get(
                    recovered.executionId
                );


            assert(
                reloaded?.state === "failed" &&
                reloaded.createdAt === recovered.createdAt &&
                reloaded.updatedAt === recovered.updatedAt &&
                reloaded.result?.output === recovered.result?.output,
                "restore must preserve recovery-relevant state across repositories."
            );

        } finally {

            await closePostgresPool(
                separatePool
            );

        }


        const all =
            await repository.getAll();


        assert(
            [
                initialized.executionId,
                "postgres-repository-running",
                "postgres-repository-completed",
                "postgres-repository-failed",
                recovered.executionId
            ].every(
                (executionId) =>
                    all.some(
                        (execution) =>
                            execution.executionId === executionId
                    )
            ),
            "getAll must include persisted executions."
        );


        console.log(
            "PASS — PostgreSQL execution repository parity validated."
        );

    } finally {

        await closePostgresPool(
            pool
        );

    }

}
