import type {
    ExecutionMode
}
from "./ExecutionMode";

import type {
    ExecutionStatus
}
from "./ExecutionStatus";


export type OperationStatus =
    | "accepted"
    | "completed"
    | "failed";


export interface OperationResponse {

    operationId: string;

    correlationId: string;

    executionId: string;

    status: OperationStatus;

    state: ExecutionStatus;

    mode: ExecutionMode;

    result?: Record<string, unknown>;

}
