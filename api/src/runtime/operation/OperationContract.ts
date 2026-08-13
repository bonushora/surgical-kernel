import type {
    ExecutionContext
} from "../context/ExecutionContext.js";

import type {
    ExecutionMode
} from "../state/ExecutionState.js";

import type {
    ExecutionResult
} from "../state/ExecutionResult.js";


export interface OperationRequest {

    context: ExecutionContext;

    mode: ExecutionMode;

    request: string;

}


export type OperationStatus =
    | "accepted"
    | "completed"
    | "failed";


export interface OperationMetadata {

    operationId: string;

    correlationId: string;

    executionId: string;

    idempotencyKey?: string;

}


export interface OperationResponse {

    operationId: string;

    correlationId: string;

    executionId: string;

    status: OperationStatus;

    state:
        "initialized"
        |
        "running"
        |
        "completed"
        |
        "failed";

    mode: ExecutionMode;

    result?: ExecutionResult;

}


export interface OperationErrorResponse {

    error: {

        code: string;

        message: string;

        operationId: string;

        correlationId: string;

        details?: Record<string, unknown>;

    };

}
