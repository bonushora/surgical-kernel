import {
    AuthorizationAuditDecision,
    AuthorizationAuditEvent
} from "./AuthorizationAuditEvent.js";


export interface AuthorizationAuditQuery {

    operationId?: string;

    correlationId?: string;

    decisionId?: string;

    organizationId?: string;

    projectId?: string;

    actorId?: string;

    decision?: AuthorizationAuditDecision;

    idempotencyKey?: string;

}


export function matchesAuthorizationAuditQuery(
    event: AuthorizationAuditEvent,
    query: AuthorizationAuditQuery
): boolean {

    if (
        query.operationId !== undefined &&
        event.operationId !== query.operationId
    ) {
        return false;
    }


    if (
        query.correlationId !== undefined &&
        event.correlationId !== query.correlationId
    ) {
        return false;
    }


    if (
        query.decisionId !== undefined &&
        event.decisionId !== query.decisionId
    ) {
        return false;
    }


    if (
        query.organizationId !== undefined &&
        event.organizationId !== query.organizationId
    ) {
        return false;
    }


    if (
        query.projectId !== undefined &&
        event.projectId !== query.projectId
    ) {
        return false;
    }


    if (
        query.actorId !== undefined &&
        event.actorId !== query.actorId
    ) {
        return false;
    }


    if (
        query.decision !== undefined &&
        event.decision !== query.decision
    ) {
        return false;
    }


    if (
        query.idempotencyKey !== undefined &&
        event.idempotencyKey !== query.idempotencyKey
    ) {
        return false;
    }


    return true;

}
