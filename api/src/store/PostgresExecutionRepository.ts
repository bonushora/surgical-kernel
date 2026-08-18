import type {
    Pool
} from "pg";

import type {
    ExecutionRepository
} from "./ExecutionRepository.js";

import type {
    Execution
} from "./executionStore.js";


interface ExecutionRow {

    execution_id: string;

    context: Execution["context"];

    project_id: string;

    mode: string;

    request: string;

    state: string;

    created_at: Date;

    result: Execution["result"] | null;

    updated_at: Date | null;

}


function toExecution(
    row: ExecutionRow
): Execution {

    return {

        executionId:
            row.execution_id,

        context:
            row.context,

        projectId:
            row.project_id,

        mode:
            row.mode,

        request:
            row.request,

        state:
            row.state,

        createdAt:
            row.created_at.toISOString(),

        result:
            row.result ?? undefined,

        updatedAt:
            row.updated_at?.toISOString()

    };

}


export class PostgresExecutionRepository
implements ExecutionRepository {

    constructor(
        private readonly pool: Pool
    ) {}


    async create(
        execution: Execution
    ): Promise<Execution> {

        const result =
            await this.pool.query<ExecutionRow>(
                `
                    INSERT INTO surgical_kernel.executions (
                        execution_id,
                        context,
                        project_id,
                        mode,
                        request,
                        state,
                        created_at,
                        result,
                        updated_at
                    ) VALUES (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6,
                        $7,
                        $8,
                        $9
                    )
                    ON CONFLICT (execution_id)
                    DO UPDATE SET
                        context = EXCLUDED.context,
                        project_id = EXCLUDED.project_id,
                        mode = EXCLUDED.mode,
                        request = EXCLUDED.request,
                        state = EXCLUDED.state,
                        created_at = EXCLUDED.created_at,
                        result = EXCLUDED.result,
                        updated_at = EXCLUDED.updated_at
                    RETURNING
                        execution_id,
                        context,
                        project_id,
                        mode,
                        request,
                        state,
                        created_at,
                        result,
                        updated_at
                `,
                [
                    execution.executionId,
                    execution.context,
                    execution.projectId,
                    execution.mode,
                    execution.request,
                    execution.state,
                    execution.createdAt,
                    execution.result ?? null,
                    execution.updatedAt ?? null
                ]
            );


        return toExecution(
            result.rows[0]
        );

    }


    async restore(
        execution: Execution
    ): Promise<Execution> {

        return this.create(
            execution
        );

    }


    async update(
        executionId: string,
        update: Partial<Execution>
    ): Promise<Execution | undefined> {

        const assignments =
            [
                "updated_at = NOW()"
            ];

        const values: unknown[] = [];


        const addUpdate = (
            property: keyof Execution,
            column: string
        ): void => {

            if (
                !Object.prototype.hasOwnProperty.call(
                    update,
                    property
                )
            ) {

                return;

            }


            values.push(
                update[property]
            );

            assignments.push(
                `${column} = $${values.length}`
            );

        };


        addUpdate(
            "context",
            "context"
        );

        addUpdate(
            "projectId",
            "project_id"
        );

        addUpdate(
            "mode",
            "mode"
        );

        addUpdate(
            "request",
            "request"
        );

        addUpdate(
            "state",
            "state"
        );

        addUpdate(
            "createdAt",
            "created_at"
        );

        addUpdate(
            "result",
            "result"
        );


        values.push(
            executionId
        );


        const result =
            await this.pool.query<ExecutionRow>(
                `
                    UPDATE surgical_kernel.executions
                    SET ${assignments.join(", ")}
                    WHERE execution_id = $${values.length}
                    RETURNING
                        execution_id,
                        context,
                        project_id,
                        mode,
                        request,
                        state,
                        created_at,
                        result,
                        updated_at
                `,
                values
            );


        const row =
            result.rows[0];


        return row
            ? toExecution(row)
            : undefined;

    }


    async get(
        executionId: string
    ): Promise<Execution | undefined> {

        const result =
            await this.pool.query<ExecutionRow>(
                `
                    SELECT
                        execution_id,
                        context,
                        project_id,
                        mode,
                        request,
                        state,
                        created_at,
                        result,
                        updated_at
                    FROM surgical_kernel.executions
                    WHERE execution_id = $1
                `,
                [
                    executionId
                ]
            );


        const row =
            result.rows[0];


        return row
            ? toExecution(row)
            : undefined;

    }


    async getAll(): Promise<Execution[]> {

        const result =
            await this.pool.query<ExecutionRow>(
                `
                    SELECT
                        execution_id,
                        context,
                        project_id,
                        mode,
                        request,
                        state,
                        created_at,
                        result,
                        updated_at
                    FROM surgical_kernel.executions
                `
            );


        return result.rows.map(
            toExecution
        );

    }

}
