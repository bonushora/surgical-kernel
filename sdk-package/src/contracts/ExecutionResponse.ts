import type {
    ExecutionMode
}
from "./ExecutionMode";


import type {
    ExecutionStatus
}
from "./ExecutionStatus";


export interface ExecutionResponse {

    executionId: string;

    status: "accepted";

    mode: ExecutionMode;

    state: ExecutionStatus;

}
