import {
    ExecutionContext
} from "../context/ExecutionContext.js";

import {
    ExecutionResult
} from "../state/ExecutionResult.js";

export interface ReplayState {

    executionId:string;

    context: ExecutionContext;

    projectId:string;

    mode:
        "free"
        |
        "deterministic";

    request:string;

    state:string;

    result?: ExecutionResult;

    reconstructed:boolean;

    eventCount:number;

}
