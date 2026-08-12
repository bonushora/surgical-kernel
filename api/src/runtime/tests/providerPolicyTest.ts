import {
    DeterministicProviderPolicy
} from "../providers/ProviderPolicy.js";

import type {
    AIProviderRequest
} from "../providers/AIProvider.js";

const policy =
    new DeterministicProviderPolicy();


function request(
    overrides: Partial<AIProviderRequest> = {}
): AIProviderRequest {

    return {

        request:
            "provider policy validation",

        context: {

            organizationId:
                "bonora",

            projectId:
                "bonushora",

            actorId:
                "provider-policy-test",

            role:
                "consumer"

        },

        projectId:
            "bonushora",

        mode:
            "deterministic",

        ...overrides

    };

}


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


console.log(
    "===== CASE 1 — DETERMINISTIC ALLOW ====="
);

const allowed =
    policy.authorize(
        request()
    );

console.log(
    JSON.stringify(
        allowed,
        null,
        2
    )
);

assert(
    allowed.allowed === true,
    "Deterministic execution should be authorized."
);

assert(
    allowed.provider ===
        "mock",
    "Unexpected provider."
);

assert(
    allowed.model ===
        "mock-deterministic-v1",
    "Unexpected model."
);


console.log(
    "PASS"
);


console.log(
    "===== CASE 2 — FREE DENY ====="
);

const freeDenied =
    policy.authorize(
        request({
            mode:
                "free"
        })
    );

console.log(
    JSON.stringify(
        freeDenied,
        null,
        2
    )
);

assert(
    freeDenied.allowed === false,
    "Free execution should be denied."
);

assert(
    freeDenied.reason ===
        "Provider execution is not authorized for this mode.",
    "Unexpected denial reason."
);


console.log(
    "PASS"
);


console.log(
    "===== CASE 3 — PROJECT MISMATCH DENY ====="
);

const projectDenied =
    policy.authorize(
        request({
            projectId:
                "another-project"
        })
    );

console.log(
    JSON.stringify(
        projectDenied,
        null,
        2
    )
);

assert(
    projectDenied.allowed === false,
    "Project mismatch should be denied."
);


console.log(
    "PASS"
);


console.log(
    "===== CASE 4 — MISSING ORGANIZATION DENY ====="
);

const organizationDenied =
    policy.authorize(
        request({

            context: {

                organizationId:
                    "",

                projectId:
                    "bonushora",

                actorId:
                    "provider-policy-test",

                role:
                    "consumer"

            }

        })
    );

console.log(
    JSON.stringify(
        organizationDenied,
        null,
        2
    )
);

assert(
    organizationDenied.allowed === false,
    "Missing organization should be denied."
);


console.log(
    "PASS"
);


console.log(
    "===== CASE 5 — MISSING PROJECT DENY ====="
);

const projectContextDenied =
    policy.authorize(
        request({

            context: {

                organizationId:
                    "bonora",

                projectId:
                    "",

                actorId:
                    "provider-policy-test",

                role:
                    "consumer"

            }

        })
    );

console.log(
    JSON.stringify(
        projectContextDenied,
        null,
        2
    )
);

assert(
    projectContextDenied.allowed === false,
    "Missing project context should be denied."
);


console.log(
    "PASS"
);


console.log(
    "===== PROVIDER POLICY TEST — ALL CASES PASSED ====="
);
