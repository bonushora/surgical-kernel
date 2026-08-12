import {
    ExecutionState
} from "../state/ExecutionState.js";

import {
    ExecutionContext
} from "../context/ExecutionContext.js";

import {
    ExecutionResult
} from "../state/ExecutionResult.js";


export interface StoreExecution {

    executionId: string;

    context: ExecutionContext;

    projectId: string;

    mode: string;

    request: string;

    state: string;

    createdAt: string;

    result?: ExecutionResult;

}


export function toStoreExecution(
    execution: ExecutionState
): StoreExecution {


    return {

        executionId:
            execution.executionId,

        context:
            execution.context,

        projectId:
            execution.projectId,

        mode:
            execution.mode,

        request:
            execution.request,

        state:
            execution.status,

        createdAt:
            execution.createdAt,

        result:
            execution.result

    };

}
