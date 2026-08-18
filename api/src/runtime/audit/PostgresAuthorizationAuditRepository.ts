import type {
    Pool
} from "pg";

import type {
    AuthorizationAuditEvent
} from "./AuthorizationAuditEvent.js";

import type {
    AuthorizationAuditQuery
} from "./AuthorizationAuditQuery.js";

import type {
    AuthorizationAuditRepository
} from "./AuthorizationAuditRepository.js";


interface AuthorizationAuditRow {

    audit_id: string;

    type: AuthorizationAuditEvent["type"];

    timestamp: Date;

    operation_id: string;

    correlation_id: string;

    decision_id: string;

    organization_id: string;

    project_id: string;

    actor_id: string | null;

    mode: string;

    decision: AuthorizationAuditEvent["decision"];

    reason: string | null;

    idempotency_key: string | null;

}


function toAuthorizationAuditEvent(
    row: AuthorizationAuditRow
): AuthorizationAuditEvent {

    return {

        auditId:
            row.audit_id,

        type:
            row.type,

        timestamp:
            row.timestamp.toISOString(),

        operationId:
            row.operation_id,

        correlationId:
            row.correlation_id,

        decisionId:
            row.decision_id,

        organizationId:
            row.organization_id,

        projectId:
            row.project_id,

        actorId:
            row.actor_id ?? undefined,

        mode:
            row.mode,

        decision:
            row.decision,

        reason:
            row.reason ?? undefined,

        idempotencyKey:
            row.idempotency_key ?? undefined

    };

}


export class PostgresAuthorizationAuditRepository
implements AuthorizationAuditRepository {

    constructor(
        private readonly pool: Pool
    ) {}


    async append(
        event: AuthorizationAuditEvent
    ): Promise<AuthorizationAuditEvent> {

        const result =
            await this.pool.query<AuthorizationAuditRow>(
                `
                    INSERT INTO surgical_kernel.authorization_audits (
                        audit_id,
                        type,
                        timestamp,
                        operation_id,
                        correlation_id,
                        decision_id,
                        organization_id,
                        project_id,
                        actor_id,
                        mode,
                        decision,
                        reason,
                        idempotency_key
                    ) VALUES (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6,
                        $7,
                        $8,
                        $9,
                        $10,
                        $11,
                        $12,
                        $13
                    )
                    ON CONFLICT (audit_id)
                    DO UPDATE SET
                        type = EXCLUDED.type,
                        timestamp = EXCLUDED.timestamp,
                        operation_id = EXCLUDED.operation_id,
                        correlation_id = EXCLUDED.correlation_id,
                        decision_id = EXCLUDED.decision_id,
                        organization_id = EXCLUDED.organization_id,
                        project_id = EXCLUDED.project_id,
                        actor_id = EXCLUDED.actor_id,
                        mode = EXCLUDED.mode,
                        decision = EXCLUDED.decision,
                        reason = EXCLUDED.reason,
                        idempotency_key = EXCLUDED.idempotency_key
                    RETURNING *
                `,
                [
                    event.auditId,
                    event.type,
                    event.timestamp,
                    event.operationId,
                    event.correlationId,
                    event.decisionId,
                    event.organizationId,
                    event.projectId,
                    event.actorId ?? null,
                    event.mode,
                    event.decision,
                    event.reason ?? null,
                    event.idempotencyKey ?? null
                ]
            );


        return toAuthorizationAuditEvent(
            result.rows[0]
        );

    }


    async getByOperationId(
        operationId: string
    ): Promise<AuthorizationAuditEvent[]> {

        return this.query({
            operationId
        });

    }


    async query(
        query: AuthorizationAuditQuery
    ): Promise<AuthorizationAuditEvent[]> {

        const filters: Array<
            [
                keyof AuthorizationAuditQuery,
                string
            ]
        > = [
            [
                "operationId",
                "operation_id"
            ],
            [
                "correlationId",
                "correlation_id"
            ],
            [
                "decisionId",
                "decision_id"
            ],
            [
                "organizationId",
                "organization_id"
            ],
            [
                "projectId",
                "project_id"
            ],
            [
                "actorId",
                "actor_id"
            ],
            [
                "decision",
                "decision"
            ],
            [
                "idempotencyKey",
                "idempotency_key"
            ]
        ];

        const clauses: string[] = [];
        const values: unknown[] = [];


        for (
            const [
                property,
                column
            ] of filters
        ) {

            const value =
                query[property];


            if (value === undefined) {

                continue;

            }


            values.push(
                value
            );

            clauses.push(
                `${column} = $${values.length}`
            );

        }


        const result =
            await this.pool.query<AuthorizationAuditRow>(
                `
                    SELECT *
                    FROM surgical_kernel.authorization_audits
                    ${
                        clauses.length > 0
                            ? `WHERE ${clauses.join(" AND ")}`
                            : ""
                    }
                    ORDER BY timestamp ASC
                `,
                values
            );


        return result.rows.map(
            toAuthorizationAuditEvent
        );

    }


    async getAll(): Promise<AuthorizationAuditEvent[]> {

        return this.query({});

    }


    async clear(): Promise<void> {

        await this.pool.query(
            `
                DELETE FROM surgical_kernel.authorization_audits
            `
        );

    }

}
