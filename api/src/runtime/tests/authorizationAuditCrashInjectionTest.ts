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


const currentDirectory =
    dirname(
        fileURLToPath(
            import.meta.url
        )
    );


const storageDirectory =
    join(
        currentDirectory,
        "../storage/authorization-audit"
    );


const auditId =
    `authorization-crash-${crypto.randomUUID()}`;


const operationId =
    `authorization-crash-operation-${crypto.randomUUID()}`;


const event = {

    auditId,

    type:
        "authorization.decision" as const,

    timestamp:
        new Date().toISOString(),

    operationId,

    correlationId:
        "authorization-crash-correlation",

    decisionId:
        "authorization-crash-decision",

    organizationId:
        "bonora",

    projectId:
        "surgical-kernel",

    actorId:
        "authorization-crash-test",

    mode:
        "deterministic",

    decision:
        "denied" as const,

    reason:
        "Crash boundary validation."

};


console.log(
    "=================================================="
);

console.log(
    "AUTHORIZATION AUDIT CRASH INJECTION TEST"
);

console.log(
    "=================================================="
);


const crashingRepository =
    new FileAuthorizationAuditRepository(
        () => {

            throw new Error(
                "INJECTED_CRASH_BEFORE_RENAME"
            );

        }
    );


let crashObserved =
    false;


try {

    await crashingRepository.append(
        event
    );

} catch (error) {

    crashObserved = true;

    assert(
        error instanceof Error &&
        error.message ===
            "INJECTED_CRASH_BEFORE_RENAME",
        "Injected crash must be observed."
    );

}


assert(
    crashObserved,
    "Crash injection must interrupt the commit boundary."
);


const committedFile =
    join(
        storageDirectory,
        `${auditId}.json`
    );


const temporaryFile =
    `${committedFile}.tmp`;


assert(
    !existsSync(
        committedFile
    ),
    "Final audit file must not exist before atomic rename."
);


assert(
    existsSync(
        temporaryFile
    ),
    "Temporary audit artifact must exist after injected crash."
);


console.log(
    "PASS — injected crash interrupted atomic rename."
);

console.log(
    "PASS — final authorization audit file was not falsely committed."
);

console.log(
    "PASS — temporary artifact remained distinguishable from committed audit."
);


const recoveredRepository =
    new FileAuthorizationAuditRepository();


const recovered =
    await recoveredRepository
        .getByOperationId(
            operationId
        );


assert(
    recovered.length === 0,
    "Uncommitted authorization audit must not be recoverable."
);


console.log(
    "PASS — uncommitted authorization audit was not reconstructed."
);


await recoveredRepository.clear();


const remainingFiles =
    existsSync(
        storageDirectory
    )
    ?
    readdirSync(
        storageDirectory
    )
    :
    [];


assert(
    !remainingFiles.includes(
        `${auditId}.json`
    ),
    "Final crash-test audit file must not remain."
);


assert(
    !remainingFiles.includes(
        `${auditId}.json.tmp`
    ),
    "Temporary crash-test artifact must be removed."
);


console.log(
    "PASS — crash-test artifacts cleaned."
);

console.log(
    "=================================================="
);

console.log(
    "AUTHORIZATION AUDIT CRASH INJECTION TEST — ALL CASES PASSED"
);

console.log(
    "=================================================="
);
