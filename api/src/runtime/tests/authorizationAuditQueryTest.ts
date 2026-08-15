import {
    appendAuthorizationAudit,
    getAllAuthorizationAudits,
    clearAuthorizationAudits
} from "../audit/AuthorizationAuditStore.js";

import {
    AuthorizationAuditEvent
} from "../audit/AuthorizationAuditEvent.js";

import {
    createServer
} from "node:http";


function assert(
    condition: boolean,
    message: string
): void {

    if (!condition) {

        throw new Error(
            `FAIL: ${message}`
        );

    }

}


interface HttpResult {

    status: number;

    body: any;

}


interface AuditQueryIdentity {

    organizationId?: string;

    projectId?: string;

    actorId?: string;

}


function request(
    port: number,
    path: string,
    identity: AuditQueryIdentity = {}
): Promise<HttpResult> {

    return new Promise(
        (resolve, reject) => {

            import("node:http")
                .then(
                    ({
                        request: httpRequest
                    }) => {

                        const req =
                            httpRequest(
                                {
                                    hostname:
                                        "127.0.0.1",

                                    port,

                                    path,

                                    method:
                                        "GET",

                                    headers: {

                                        Accept:
                                            "application/json",

                                        ...(identity.organizationId !== undefined
                                            ? {
                                                "x-organization-id":
                                                    identity.organizationId
                                            }
                                            : {}),

                                        ...(identity.projectId !== undefined
                                            ? {
                                                "x-project-id":
                                                    identity.projectId
                                            }
                                            : {}),

                                        ...(identity.actorId !== undefined
                                            ? {
                                                "x-actor-id":
                                                    identity.actorId
                                            }
                                            : {})

                                    }

                                },
                                res => {

                                    let body =
                                        "";

                                    res.on(
                                        "data",
                                        chunk => {

                                            body +=
                                                chunk;

                                        }
                                    );


                                    res.on(
                                        "end",
                                        () => {

                                            let parsed;

                                            try {

                                                parsed =
                                                    JSON.parse(
                                                        body
                                                    );

                                            } catch {

                                                parsed =
                                                    body;

                                            }


                                            resolve({

                                                status:
                                                    res.statusCode ??
                                                    0,

                                                body:
                                                    parsed

                                            });

                                        }
                                    );

                                }
                            );


                        req.on(
                            "error",
                            reject
                        );


                        req.end();

                    }
                );

        }
    );

}


function createAudit(
    overrides:
        Partial<AuthorizationAuditEvent>
): AuthorizationAuditEvent {

    return {

        auditId:
            crypto.randomUUID(),

        type:
            "authorization.decision",

        timestamp:
            new Date().toISOString(),

        operationId:
            crypto.randomUUID(),

        correlationId:
            crypto.randomUUID(),

        decisionId:
            crypto.randomUUID(),

        organizationId:
            "org-query-test",

        projectId:
            "project-query-test",

        actorId:
            "actor-query-test",

        mode:
            "deterministic",

        decision:
            "allowed",

        reason:
            "query regression",

        idempotencyKey:
            `idem-${crypto.randomUUID()}`,

        ...overrides

    };

}


console.log(
    "=================================================="
);

console.log(
    "AUTHORIZATION AUDIT QUERY TEST"
);

console.log(
    "=================================================="
);


const appModule =
    await import(
        "../../app.js"
    );


const app =
    appModule.default;


if (!app) {

    throw new Error(
        "FAIL: server module must export Express app for query testing."
    );

}


const server =
    createServer(
        app
    );


await new Promise<void>(
    resolve => {

        server.listen(
            0,
            "127.0.0.1",
            () => resolve()
        );

    }
);


const address =
    server.address();


assert(
    address !== null &&
    typeof address !== "string",
    "HTTP test server must expose an address."
);


const port =
    (address as any).port;


try {

    clearAuthorizationAudits();


    const allowed =
        createAudit({

            operationId:
                "operation-query-allowed",

            correlationId:
                "correlation-query-allowed",

            decisionId:
                "decision-query-allowed",

            organizationId:
                "org-alpha",

            projectId:
                "project-alpha",

            actorId:
                "actor-alpha",

            decision:
                "allowed",

            idempotencyKey:
                "idem-alpha"

        });


    const denied =
        createAudit({

            operationId:
                "operation-query-denied",

            correlationId:
                "correlation-query-denied",

            decisionId:
                "decision-query-denied",

            organizationId:
                "org-beta",

            projectId:
                "project-beta",

            actorId:
                "actor-beta",

            decision:
                "denied",

            reason:
                "denied for regression",

            idempotencyKey:
                "idem-beta"

        });


    const sameOperation =
        createAudit({

            operationId:
                allowed.operationId,

            correlationId:
                "correlation-query-second",

            decisionId:
                "decision-query-second",

            organizationId:
                "org-alpha",

            projectId:
                "project-alpha",

            actorId:
                "actor-alpha",

            decision:
                "denied",

            idempotencyKey:
                "idem-alpha-second"

        });


    appendAuthorizationAudit(
        allowed
    );

    appendAuthorizationAudit(
        denied
    );

    appendAuthorizationAudit(
        sameOperation
    );


    console.log(
        "PASS — seed authorization audits persisted."
    );


    const alphaIdentity: AuditQueryIdentity = {

        organizationId:
            "org-alpha",

        projectId:
            "project-alpha",

        actorId:
            "actor-alpha"

    };


    console.log(
        "===== CASE 1 — QUERY WITH AUTHORIZED TENANT SCOPE ====="
    );


    const all =
        await request(
            port,
            "/v1/authorization-audit",
            alphaIdentity
        );


    assert(
        all.status === 200,
        `authorized tenant query must return HTTP 200. Got ${all.status}`
    );


    assert(
        all.body.count === 2,
        `authorized tenant query must return 2 org-alpha audits. Got ${all.body.count}`
    );


    assert(
        all.body.audits.every(
            (event: AuthorizationAuditEvent) =>
                event.organizationId ===
                "org-alpha"
        ),
        "authorized tenant query leaked another organization."
    );


    console.log(
        "PASS — query is scoped to the authorized organization."
    );


    console.log(
        "===== CASE 2 — OPERATION FILTER WITHIN AUTHORIZED SCOPE ====="
    );


    const byOperation =
        await request(
            port,
            `/v1/authorization-audit?operationId=${allowed.operationId}`,
            alphaIdentity
        );


    assert(
        byOperation.status === 200,
        "operation filter must return HTTP 200."
    );


    assert(
        byOperation.body.count === 2,
        "operation filter must return both alpha audits for operation."
    );


    assert(
        byOperation.body.audits.every(
            (event: AuthorizationAuditEvent) =>
                event.organizationId ===
                "org-alpha" &&
                event.operationId ===
                allowed.operationId
        ),
        "operation filter returned an unrelated audit."
    );


    console.log(
        "PASS — operation filter respects tenant scope."
    );


    console.log(
        "===== CASE 3 — CORRELATION FILTER ====="
    );


    const byCorrelation =
        await request(
            port,
            `/v1/authorization-audit?correlationId=${allowed.correlationId}`,
            alphaIdentity
        );


    assert(
        byCorrelation.status === 200 &&
        byCorrelation.body.count === 1 &&
        byCorrelation.body.audits[0].correlationId ===
            allowed.correlationId &&
        byCorrelation.body.audits[0].organizationId ===
            "org-alpha",
        "correlationId filter failed."
    );


    console.log(
        "PASS — correlationId filter respects tenant scope."
    );


    console.log(
        "===== CASE 4 — DECISION FILTER WITHIN TENANT ====="
    );


    const byDecision =
        await request(
            port,
            "/v1/authorization-audit?decision=denied",
            alphaIdentity
        );


    assert(
        byDecision.status === 200 &&
        byDecision.body.count === 1,
        "tenant-scoped denied query must return one alpha audit."
    );


    assert(
        byDecision.body.audits.every(
            (event: AuthorizationAuditEvent) =>
                event.decision ===
                "denied" &&
                event.organizationId ===
                "org-alpha"
        ),
        "decision filter leaked the beta denied audit."
    );


    console.log(
        "PASS — decision filter is tenant-scoped."
    );


    console.log(
        "===== CASE 5 — CROSS-TENANT ORGANIZATION QUERY ====="
    );


    const crossOrganization =
        await request(
            port,
            "/v1/authorization-audit?organizationId=org-beta",
            alphaIdentity
        );


    assert(
        crossOrganization.status === 403,
        `cross-tenant organization query must return HTTP 403. Got ${crossOrganization.status}`
    );


    assert(
        crossOrganization.body.error?.code ===
            "FORBIDDEN",
        "cross-tenant organization query must return FORBIDDEN."
    );


    console.log(
        "PASS — cross-tenant organization query rejected."
    );


    console.log(
        "===== CASE 6 — CROSS-PROJECT QUERY ====="
    );


    const crossProject =
        await request(
            port,
            "/v1/authorization-audit?projectId=project-beta",
            alphaIdentity
        );


    assert(
        crossProject.status === 403,
        `cross-project query must return HTTP 403. Got ${crossProject.status}`
    );


    assert(
        crossProject.body.error?.code ===
            "FORBIDDEN",
        "cross-project query must return FORBIDDEN."
    );


    console.log(
        "PASS — cross-project query rejected."
    );


    console.log(
        "===== CASE 7 — CROSS-ACTOR QUERY ====="
    );


    const crossActor =
        await request(
            port,
            "/v1/authorization-audit?actorId=actor-beta",
            alphaIdentity
        );


    assert(
        crossActor.status === 403,
        `cross-actor query must return HTTP 403. Got ${crossActor.status}`
    );


    assert(
        crossActor.body.error?.code ===
            "FORBIDDEN",
        "cross-actor query must return FORBIDDEN."
    );


    console.log(
        "PASS — cross-actor query rejected."
    );


    console.log(
        "===== CASE 8 — DECISION ID CROSS-TENANT NON-DISCLOSURE ====="
    );


    const betaDecision =
        await request(
            port,
            `/v1/authorization-audit?decisionId=${denied.decisionId}`,
            alphaIdentity
        );


    assert(
        betaDecision.status === 200,
        "cross-tenant decisionId lookup must remain HTTP 200."
    );


    assert(
        betaDecision.body.count === 0,
        "cross-tenant decisionId lookup must return zero records."
    );


    console.log(
        "PASS — cross-tenant decision identity is not disclosed."
    );


    console.log(
        "===== CASE 9 — IDEMPOTENCY CROSS-TENANT NON-DISCLOSURE ====="
    );


    const betaIdempotency =
        await request(
            port,
            `/v1/authorization-audit?idempotencyKey=${denied.idempotencyKey}`,
            alphaIdentity
        );


    assert(
        betaIdempotency.status === 200,
        "cross-tenant idempotency lookup must remain HTTP 200."
    );


    assert(
        betaIdempotency.body.count === 0,
        "cross-tenant idempotency lookup must return zero records."
    );


    console.log(
        "PASS — cross-tenant idempotency identity is not disclosed."
    );


    console.log(
        "===== CASE 10 — COMBINED FILTER WITHIN AUTHORIZED TENANT ====="
    );


    const combined =
        await request(
            port,
            "/v1/authorization-audit?organizationId=org-alpha&decision=denied",
            alphaIdentity
        );


    assert(
        combined.status === 200 &&
        combined.body.count === 1 &&
        combined.body.audits[0].auditId ===
            sameOperation.auditId,
        "combined tenant-scoped filters failed."
    );


    assert(
        combined.body.audits[0].organizationId ===
            "org-alpha",
        "combined filters returned an unauthorized organization."
    );


    console.log(
        "PASS — combined filters respect authorized tenant scope."
    );


    console.log(
        "===== CASE 11 — INVALID DECISION ====="
    );


    const invalid =
        await request(
            port,
            "/v1/authorization-audit?decision=unknown"
        );


    assert(
        invalid.status === 400,
        `invalid decision must return HTTP 400. Got ${invalid.status}`
    );


    console.log(
        "PASS — invalid decision rejected with HTTP 400."
    );


    console.log(
        "===== CASE 12 — READ ONLY ====="
    );


    const before =
        getAllAuthorizationAudits()
            .map(
                event =>
                    event.auditId
            );


    await request(
        port,
        "/v1/authorization-audit?organizationId=org-alpha"
    );


    const after =
        getAllAuthorizationAudits()
            .map(
                event =>
                    event.auditId
            );


    assert(
        JSON.stringify(before) ===
        JSON.stringify(after),
        "audit query modified the authorization ledger."
    );


    console.log(
        "PASS — audit query is read-only."
    );


    console.log(
        "===== CASE 13 — IDENTITY PRESERVATION ====="
    );


    const identity =
        byOperation.body.audits.find(
            (event: AuthorizationAuditEvent) =>
                event.auditId ===
                allowed.auditId
        );


    assert(
        identity !== undefined,
        "expected audit identity not found."
    );


    assert(
        identity.operationId ===
            allowed.operationId,
        "operation identity was not preserved."
    );


    assert(
        identity.correlationId ===
            allowed.correlationId,
        "correlation identity was not preserved."
    );


    assert(
        identity.decisionId ===
            allowed.decisionId,
        "decision identity was not preserved."
    );


    assert(
        identity.organizationId ===
            allowed.organizationId,
        "organization identity was not preserved."
    );


    assert(
        identity.projectId ===
            allowed.projectId,
        "project identity was not preserved."
    );


    assert(
        identity.actorId ===
            allowed.actorId,
        "actor identity was not preserved."
    );


    assert(
        identity.idempotencyKey ===
            allowed.idempotencyKey,
        "idempotency identity was not preserved."
    );


    console.log(
        "PASS — audit identities preserved through HTTP query."
    );


} finally {

    clearAuthorizationAudits();

    await new Promise<void>(
        resolve =>
            server.close(
                () => resolve()
            )
    );

}


console.log(
    "=================================================="
);

console.log(
    "AUTHORIZATION AUDIT QUERY TEST — ALL CASES PASSED"
);

console.log(
    "=================================================="
);
