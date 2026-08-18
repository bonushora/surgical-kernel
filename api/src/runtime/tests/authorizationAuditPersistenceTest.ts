import {
    FileAuthorizationAuditRepository
} from "../audit/FileAuthorizationAuditRepository.js";

import {
    existsSync,
    readdirSync
} from "node:fs";

import {
    fileURLToPath
} from "node:url";

import {
    dirname,
    join
} from "node:path";


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
    new FileAuthorizationAuditRepository();


const auditId =
    `authorization-persistence-${crypto.randomUUID()}`;


const event = {

    auditId,

    type:
        "authorization.decision" as const,

    timestamp:
        new Date().toISOString(),

    operationId:
        "authorization-persistence-operation",

    correlationId:
        "authorization-persistence-correlation",

    decisionId:
        "authorization-persistence-decision",

    organizationId:
        "bonora",

    projectId:
        "surgical-kernel",

    actorId:
        "persistence-test-actor",

    mode:
        "deterministic",

    decision:
        "denied" as const,

    reason:
        "Persistence boundary validation.",

    idempotencyKey:
        "authorization-persistence-idempotency"

};


console.log(
    "=================================================="
);

console.log(
    "AUTHORIZATION AUDIT PERSISTENCE TEST"
);

console.log(
    "=================================================="
);


await repository.clear();


await repository.append(
    event
);


const directory =
    dirname(
        fileURLToPath(
            import.meta.url
        )
    );


const storageDirectory =
    join(
        directory,
        "../storage/authorization-audit"
    );


const files =
    readdirSync(
        storageDirectory
    );


assert(
    files.includes(
        `${auditId}.json`
    ),
    "Persisted authorization audit file must exist."
);


assert(
    !files.includes(
        `${auditId}.json.tmp`
    ),
    "Temporary authorization audit file must not remain."
);


console.log(
    "PASS — authorization audit persisted to disk."
);


const reconstructedRepository =
    new FileAuthorizationAuditRepository();


const reconstructed =
    await reconstructedRepository
        .getByOperationId(
            event.operationId
        );


assert(
    reconstructed.length === 1,
    "Persisted authorization audit must be reconstructable."
);


assert(
    reconstructed[0].auditId ===
        auditId,
    "Audit identity must survive reconstruction."
);


assert(
    reconstructed[0].operationId ===
        event.operationId,
    "Operation identity must survive reconstruction."
);


assert(
    reconstructed[0].correlationId ===
        event.correlationId,
    "Correlation identity must survive reconstruction."
);


assert(
    reconstructed[0].decisionId ===
        event.decisionId,
    "Decision identity must survive reconstruction."
);


assert(
    reconstructed[0].decision ===
        "denied",
    "Authorization decision must survive reconstruction."
);


assert(
    reconstructed[0].organizationId ===
        event.organizationId,
    "Organization identity must survive reconstruction."
);


assert(
    reconstructed[0].projectId ===
        event.projectId,
    "Project identity must survive reconstruction."
);


assert(
    reconstructed[0].actorId ===
        event.actorId,
    "Actor identity must survive reconstruction."
);


assert(
    reconstructed[0].idempotencyKey ===
        event.idempotencyKey,
    "Idempotency identity must survive reconstruction."
);


console.log(
    "PASS — persisted authorization audit reconstructed."
);

console.log(
    "PASS — operation/correlation/decision identities preserved."
);

console.log(
    "PASS — organization/project/actor identities preserved."
);

console.log(
    "PASS — idempotency identity preserved."
);


await reconstructedRepository.clear();


const remaining =
    await reconstructedRepository.getAll();


assert(
    remaining.length === 0,
    "Audit storage must be clean after test."
);


console.log(
    "PASS — test storage cleaned."
);

console.log(
    "=================================================="
);

console.log(
    "AUTHORIZATION AUDIT PERSISTENCE TEST — ALL CASES PASSED"
);

console.log(
    "=================================================="
);
