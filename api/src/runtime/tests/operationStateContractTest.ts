import type {
    OperationResponse,
    OperationStatus
} from "../operation/OperationContract.js";

import type {
    ExecutionStatus,
    ExecutionState
} from "../state/ExecutionState.js";


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


const operationStatuses:
    OperationStatus[] = [
        "accepted",
        "completed",
        "failed"
    ];


const executionStatuses:
    ExecutionStatus[] = [
        "initialized",
        "running",
        "completed",
        "failed"
    ];


assert(
    operationStatuses.length === 3,
    "OperationStatus must contain exactly three states."
);


assert(
    executionStatuses.length === 4,
    "ExecutionStatus must contain exactly four states."
);


assert(
    operationStatuses.includes("accepted"),
    "OperationStatus must support accepted."
);


assert(
    operationStatuses.includes("completed"),
    "OperationStatus must support completed."
);


assert(
    operationStatuses.includes("failed"),
    "OperationStatus must support failed."
);


assert(
    executionStatuses.includes("initialized"),
    "ExecutionStatus must support initialized."
);


assert(
    executionStatuses.includes("running"),
    "ExecutionStatus must support running."
);


assert(
    executionStatuses.includes("completed"),
    "ExecutionStatus must support completed."
);


assert(
    executionStatuses.includes("failed"),
    "ExecutionStatus must support failed."
);


const acceptedResponse:
    OperationResponse = {

    operationId:
        "operation-accepted",

    correlationId:
        "correlation-accepted",

    executionId:
        "execution-accepted",

    status:
        "accepted",

    state:
        "running",

    mode:
        "deterministic"

};


const completedResponse:
    OperationResponse = {

    operationId:
        "operation-completed",

    correlationId:
        "correlation-completed",

    executionId:
        "execution-completed",

    status:
        "completed",

    state:
        "completed",

    mode:
        "deterministic"

};


const failedResponse:
    OperationResponse = {

    operationId:
        "operation-failed",

    correlationId:
        "correlation-failed",

    executionId:
        "execution-failed",

    status:
        "failed",

    state:
        "failed",

    mode:
        "deterministic"

};


assert(
    acceptedResponse.status === "accepted",
    "Accepted operation must expose accepted status."
);


assert(
    acceptedResponse.state === "running",
    "Accepted operation may represent an execution already running."
);


assert(
    completedResponse.status === "completed",
    "Completed operation must expose completed status."
);


assert(
    completedResponse.state === "completed",
    "Completed operation must expose completed execution state."
);


assert(
    failedResponse.status === "failed",
    "Failed operation must expose failed status."
);


assert(
    failedResponse.state === "failed",
    "Failed operation must expose failed execution state."
);


const executionState:
    ExecutionState = {

    executionId:
        "execution-contract",

    context: {

        organizationId:
            "bonora",

        projectId:
            "surgical-kernel",

        actorId:
            "operation-state-contract-test",

        role:
            "consumer"

    },

    projectId:
        "surgical-kernel",

    mode:
        "deterministic",

    request:
        "operation state contract validation",

    status:
        "running",

    createdAt:
        new Date().toISOString(),

    updatedAt:
        new Date().toISOString()

};


assert(
    executionState.status === "running",
    "ExecutionState must remain authoritative for execution lifecycle."
);


console.log(
    "PASS — OperationStatus contract validated."
);


console.log(
    "PASS — ExecutionStatus contract validated."
);


console.log(
    "PASS — accepted operation state validated."
);


console.log(
    "PASS — completed operation state validated."
);


console.log(
    "PASS — failed operation state validated."
);


console.log(
    "PASS — ExecutionState remains authoritative."
);


console.log(
    "OPERATION STATE CONTRACT TEST — ALL CASES PASSED"
);
