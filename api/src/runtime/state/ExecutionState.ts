import {
    ExecutionContext
} from "../context/ExecutionContext.js";

import {
    ExecutionResult
} from "./ExecutionResult.js";


export type ExecutionMode =
    | "free"
    | "deterministic";


export type ExecutionStatus =
    | "initialized"
    | "running"
    | "completed"
    | "failed";


export interface ExecutionState {

    executionId: string;

    context: ExecutionContext;

    projectId: string;

    mode: ExecutionMode;

    request: string;

    status: ExecutionStatus;

    createdAt: string;

    updatedAt: string;

    metadata?: Record<string, unknown>;

    result?: ExecutionResult;

}
