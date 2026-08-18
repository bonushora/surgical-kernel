import {
    AuthorizationAuditEvent
} from "./AuthorizationAuditEvent.js";

import {
    AuthorizationAuditRepository
} from "./AuthorizationAuditRepository.js";

import {
    AuthorizationAuditQuery,
    matchesAuthorizationAuditQuery
} from "./AuthorizationAuditQuery.js";


export class MemoryAuthorizationAuditRepository
implements AuthorizationAuditRepository {

    private events:
        AuthorizationAuditEvent[] = [];


    async append(
        event: AuthorizationAuditEvent
    ): Promise<AuthorizationAuditEvent> {

        this.events.push(
            event
        );

        return event;

    }


    async getByOperationId(
        operationId: string
    ): Promise<AuthorizationAuditEvent[]> {

        return this.events
            .filter(
                event =>
                    event.operationId ===
                    operationId
            );

    }


    async query(
        query: AuthorizationAuditQuery
    ): Promise<AuthorizationAuditEvent[]> {

        return this.events
            .filter(
                event =>
                    matchesAuthorizationAuditQuery(
                        event,
                        query
                    )
            )
            .sort(
                (a, b) =>
                    a.timestamp.localeCompare(
                        b.timestamp
                    )
            );

    }


    async getAll(): Promise<AuthorizationAuditEvent[]> {

        return [
            ...this.events
        ].sort(
            (a, b) =>
                a.timestamp.localeCompare(
                    b.timestamp
                )
        );

    }


    async clear(): Promise<void> {

        this.events = [];

    }

}
