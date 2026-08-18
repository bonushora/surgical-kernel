import {
    appendAuthorizationAudit,
    configureAuthorizationAuditRepository,
    getAuthorizationAuditsByOperationId
} from "../audit/AuthorizationAuditStore.js";

import {
    MemoryAuthorizationAuditRepository
} from "../audit/MemoryAuthorizationAuditRepository.js";


function assert(
    condition: boolean,
    message: string
): void {

    if (!condition) {

        throw new Error(
            `FAIL — ${message}`
        );

    }

}


const repository =
    new MemoryAuthorizationAuditRepository();


configureAuthorizationAuditRepository(
    repository
);


const operationId =
    "authorization-audit-operation";


const correlationId =
    "authorization-audit-correlation";


const allowed =
    await appendAuthorizationAudit({

        auditId:
            crypto.randomUUID(),

        type:
            "authorization.decision",

        timestamp:
            new Date().toISOString(),

        operationId,

        correlationId,

        decisionId:
            "authorization-decision-allowed",

        organizationId:
            "bonora",

        projectId:
            "surgical-kernel",

        actorId:
            "audit-test-actor",

        mode:
            "deterministic",

        decision:
            "allowed",

        reason:
            "Operation explicitly authorized.",

        idempotencyKey:
            "audit-idempotency-key"

    });


assert(
    allowed.decision ===
        "allowed",
    "Allowed decision must be persisted."
);


const denied =
    await appendAuthorizationAudit({

        auditId:
            crypto.randomUUID(),

        type:
            "authorization.decision",

        timestamp:
            new Date().toISOString(),

        operationId:
            "authorization-audit-denied",

        correlationId:
            "authorization-audit-denied-correlation",

        decisionId:
            "authorization-decision-denied",

        organizationId:
            "unknown",

        projectId:
            "surgical-kernel",

        actorId:
            "audit-test-actor",

        mode:
            "deterministic",

        decision:
            "denied",

        reason:
            "Unknown organization."

    });


assert(
    denied.decision ===
        "denied",
    "Denied decision must be persisted."
);


const operationAudits =
    await getAuthorizationAuditsByOperationId(
        operationId
    );


assert(
    operationAudits.length ===
        1,
    "Operation audit lookup must return exactly one event."
);


assert(
    operationAudits[0].operationId ===
        operationId,
    "Operation identity must be preserved."
);


assert(
    operationAudits[0].correlationId ===
        correlationId,
    "Correlation identity must be preserved."
);


assert(
    operationAudits[0].decisionId ===
        "authorization-decision-allowed",
    "Decision identity must be preserved."
);


assert(
    operationAudits[0].organizationId ===
        "bonora",
    "Organization identity must be preserved."
);


assert(
    operationAudits[0].projectId ===
        "surgical-kernel",
    "Project identity must be preserved."
);


assert(
    operationAudits[0].actorId ===
        "audit-test-actor",
    "Actor identity must be preserved."
);


assert(
    operationAudits[0].idempotencyKey ===
        "audit-idempotency-key",
    "Idempotency identity must be preserved."
);


console.log(
    "=================================================="
);

console.log(
    "AUTHORIZATION AUDIT TEST"
);

console.log(
    "=================================================="
);

console.log(
    "PASS — allowed authorization decision persisted."
);

console.log(
    "PASS — denied authorization decision persisted."
);

console.log(
    "PASS — operation identity preserved."
);

console.log(
    "PASS — correlation identity preserved."
);

console.log(
    "PASS — decision identity preserved."
);

console.log(
    "PASS — organization/project/actor identity preserved."
);

console.log(
    "PASS — idempotency identity preserved."
);

console.log(
    "=================================================="
);

console.log(
    "AUTHORIZATION AUDIT TEST — ALL CASES PASSED"
);

console.log(
    "=================================================="
);
