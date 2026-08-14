export type AuthorizationAuditDecision =
    | "allowed"
    | "denied";


export interface AuthorizationAuditEvent {

    auditId: string;

    type:
        "authorization.decision";

    timestamp: string;

    operationId: string;

    correlationId: string;

    decisionId: string;

    organizationId: string;

    projectId: string;

    actorId?: string;

    mode: string;

    decision:
        AuthorizationAuditDecision;

    reason?: string;

    idempotencyKey?: string;

}
