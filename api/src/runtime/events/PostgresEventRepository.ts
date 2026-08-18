import type {
    Pool
} from "pg";

import type {
    EventRepository
} from "./EventRepository.js";

import type {
    ExecutionEvent
} from "./ExecutionEvent.js";


interface EventRow {

    event_id: string;

    execution_id: string;

    type: ExecutionEvent["type"];

    timestamp: Date;

    payload: ExecutionEvent["payload"];

}


function toExecutionEvent(
    row: EventRow
): ExecutionEvent {

    return {

        eventId:
            row.event_id,

        executionId:
            row.execution_id,

        type:
            row.type,

        timestamp:
            row.timestamp.toISOString(),

        payload:
            row.payload

    };

}


export class PostgresEventRepository
implements EventRepository {

    constructor(
        private readonly pool: Pool
    ) {}


    async append(
        event: ExecutionEvent
    ): Promise<ExecutionEvent> {

        await this.pool.query(
            `
                INSERT INTO surgical_kernel.execution_events (
                    event_id,
                    execution_id,
                    type,
                    timestamp,
                    payload
                ) VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                )
            `,
            [
                event.eventId,
                event.executionId,
                event.type,
                event.timestamp,
                event.payload
            ]
        );


        return event;

    }


    async getEvents(
        executionId: string
    ): Promise<ExecutionEvent[]> {

        const result =
            await this.pool.query<EventRow>(
                `
                    SELECT
                        event_id,
                        execution_id,
                        type,
                        timestamp,
                        payload
                    FROM surgical_kernel.execution_events
                    WHERE execution_id = $1
                    ORDER BY event_sequence ASC
                `,
                [
                    executionId
                ]
            );


        return result.rows.map(
            toExecutionEvent
        );

    }


    async getExecutionIds(): Promise<string[]> {

        const result =
            await this.pool.query<{ execution_id: string }>(
                `
                    SELECT
                        execution_id
                    FROM surgical_kernel.execution_events
                    GROUP BY execution_id
                    ORDER BY MIN(event_sequence) ASC
                `
            );


        return result.rows.map(
            row => row.execution_id
        );

    }


    async clear(): Promise<void> {

        await this.pool.query(
            `
                DELETE FROM surgical_kernel.execution_events
            `
        );

    }

}
