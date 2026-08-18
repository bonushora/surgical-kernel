import {
    AuthorizationAuditEvent
} from "./AuthorizationAuditEvent.js";

import {
    AuthorizationAuditQuery
} from "./AuthorizationAuditQuery.js";


export interface AuthorizationAuditRepository {

    append(
        event: AuthorizationAuditEvent
    ): Promise<AuthorizationAuditEvent>;


    getByOperationId(
        operationId: string
    ): Promise<AuthorizationAuditEvent[]>;


    query(
        query: AuthorizationAuditQuery
    ): Promise<AuthorizationAuditEvent[]>;


    getAll(): Promise<AuthorizationAuditEvent[]>;


    clear(): Promise<void>;

}
