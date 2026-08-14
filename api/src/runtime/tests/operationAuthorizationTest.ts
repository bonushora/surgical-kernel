import {
    DeterministicOperationAuthorizationPolicy
} from "../authorization/OperationAuthorization.js";


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


function request(
    organizationId: string,
    projectId: string,
    actorId: string
) {

    return {

        context: {

            organizationId,

            projectId,

            actorId,

            role:
                "consumer" as const

        },

        mode:
            "deterministic" as const,

        request:
            "operation authorization validation"

    };

}


const policy =
    new DeterministicOperationAuthorizationPolicy();


console.log(
    "=================================================="
);

console.log(
    "OPERATION AUTHORIZATION TEST"
);

console.log(
    "=================================================="
);


console.log(
    "===== CASE 1 — VALID OPERATION ====="
);

const allowed =
    policy.authorize(
        request(
            "bonora",
            "bonushora",
            "authorization-test-actor"
        )
    );

assert(
    allowed.allowed === true,
    "Valid operation should be authorized."
);

assert(
    Boolean(allowed.decisionId),
    "Authorization decision must have an identity."
);

assert(
    allowed.organizationId === "bonora",
    "Organization identity must be preserved."
);

assert(
    allowed.projectId === "bonushora",
    "Project identity must be preserved."
);

assert(
    allowed.actorId === "authorization-test-actor",
    "Actor identity must be preserved."
);

console.log(
    "PASS — valid operation authorized."
);


console.log(
    "===== CASE 2 — UNKNOWN ORGANIZATION ====="
);

const unknownOrganization =
    policy.authorize(
        request(
            "unknown",
            "bonushora",
            "authorization-test-actor"
        )
    );

assert(
    unknownOrganization.allowed === false,
    "Unknown organization must be denied."
);

console.log(
    "PASS — unknown organization denied."
);


console.log(
    "===== CASE 3 — UNKNOWN PROJECT ====="
);

const unknownProject =
    policy.authorize(
        request(
            "bonora",
            "unknown",
            "authorization-test-actor"
        )
    );

assert(
    unknownProject.allowed === false,
    "Unknown project must be denied."
);

console.log(
    "PASS — unknown project denied."
);


console.log(
    "===== CASE 4 — ANONYMOUS ACTOR ====="
);

const anonymousActor =
    policy.authorize(
        request(
            "bonora",
            "bonushora",
            "anonymous"
        )
    );

assert(
    anonymousActor.allowed === false,
    "Anonymous actor must be denied."
);

console.log(
    "PASS — anonymous actor denied."
);


console.log(
    "===== CASE 5 — MISSING ACTOR ====="
);

const missingActor =
    policy.authorize(
        request(
            "bonora",
            "bonushora",
            ""
        )
    );

assert(
    missingActor.allowed === false,
    "Missing actor must be denied."
);

console.log(
    "PASS — missing actor denied."
);


console.log(
    "=================================================="
);

console.log(
    "OPERATION AUTHORIZATION TEST — ALL CASES PASSED"
);

console.log(
    "=================================================="
);
