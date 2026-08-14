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


    append(
        event: AuthorizationAuditEvent
    ): AuthorizationAuditEvent {

        this.events.push(
            event
        );

        return event;

    }


    getByOperationId(
        operationId: string
    ): AuthorizationAuditEvent[] {

        return this.events
            .filter(
                event =>
                    event.operationId ===
                    operationId
            );

    }


    query(
        query: AuthorizationAuditQuery
    ): AuthorizationAuditEvent[] {

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


    getAll(): AuthorizationAuditEvent[] {

        return [
            ...this.events
        ].sort(
            (a, b) =>
                a.timestamp.localeCompare(
                    b.timestamp
                )
        );

    }


    clear(): void {

        this.events = [];

    }

}
