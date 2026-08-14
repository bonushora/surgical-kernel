import {
    AuthorizationAuditEvent
} from "./AuthorizationAuditEvent.js";

import {
    AuthorizationAuditQuery
} from "./AuthorizationAuditQuery.js";


export interface AuthorizationAuditRepository {

    append(
        event: AuthorizationAuditEvent
    ): AuthorizationAuditEvent;


    getByOperationId(
        operationId: string
    ): AuthorizationAuditEvent[];


    query(
        query: AuthorizationAuditQuery
    ): AuthorizationAuditEvent[];


    getAll(): AuthorizationAuditEvent[];


    clear(): void;

}
