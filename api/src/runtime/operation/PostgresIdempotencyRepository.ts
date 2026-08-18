import type {
    Pool
} from "pg";

import type {
    IdempotencyRecord
} from "./IdempotencyRegistry.js";

import type {
    IdempotencyRepository
} from "./IdempotencyRepository.js";


interface IdempotencyRow {

    idempotency_key: string;

    fingerprint: string;

    operation_id: string;

    correlation_id: string;

    state: IdempotencyRecord["state"];

    response: IdempotencyRecord["response"] | null;

}


function toRecord(
    row: IdempotencyRow
): IdempotencyRecord {

    return {

        key:
            row.idempotency_key,

        fingerprint:
            row.fingerprint,

        operationId:
            row.operation_id,

        correlationId:
            row.correlation_id,

        state:
            row.state,

        response:
            row.response ?? undefined

    };

}


export class PostgresIdempotencyRepository
implements IdempotencyRepository {

    constructor(
        private readonly pool: Pool
    ) {}


    async get(
        key: string
    ): Promise<IdempotencyRecord | undefined> {

        const result =
            await this.pool.query<IdempotencyRow>(
                `
                    SELECT
                        idempotency_key,
                        fingerprint,
                        operation_id,
                        correlation_id,
                        state,
                        response
                    FROM surgical_kernel.idempotency_records
                    WHERE idempotency_key = $1
                `,
                [
                    key
                ]
            );


        const row =
            result.rows[0];


        return row
            ? toRecord(row)
            : undefined;

    }


    async createIfAbsent(
        record: IdempotencyRecord
    ): Promise<boolean> {

        const result =
            await this.pool.query(
                `
                    INSERT INTO surgical_kernel.idempotency_records (
                        idempotency_key,
                        fingerprint,
                        operation_id,
                        correlation_id,
                        state,
                        response
                    ) VALUES (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6
                    )
                    ON CONFLICT (idempotency_key)
                    DO NOTHING
                `,
                [
                    record.key,
                    record.fingerprint,
                    record.operationId,
                    record.correlationId,
                    record.state,
                    record.response ?? null
                ]
            );


        return result.rowCount === 1;

    }


    async save(
        record: IdempotencyRecord
    ): Promise<void> {

        await this.pool.query(
            `
                INSERT INTO surgical_kernel.idempotency_records (
                    idempotency_key,
                    fingerprint,
                    operation_id,
                    correlation_id,
                    state,
                    response
                ) VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                )
                ON CONFLICT (idempotency_key)
                DO UPDATE SET
                    fingerprint = EXCLUDED.fingerprint,
                    operation_id = EXCLUDED.operation_id,
                    correlation_id = EXCLUDED.correlation_id,
                    state = EXCLUDED.state,
                    response = EXCLUDED.response
            `,
            [
                record.key,
                record.fingerprint,
                record.operationId,
                record.correlationId,
                record.state,
                record.response ?? null
            ]
        );

    }


    async clear(): Promise<void> {

        await this.pool.query(
            `
                DELETE FROM surgical_kernel.idempotency_records
            `
        );

    }

}
