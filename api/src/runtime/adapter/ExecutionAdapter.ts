import {
    ExecutionState
} from "../state/ExecutionState.js";


export interface StoreExecution {

    executionId: string;

    projectId: string;

    mode: string;

    request: string;

    state: string;

    createdAt: string;

}


export function toStoreExecution(
    execution: ExecutionState
): StoreExecution {


    return {

        executionId:
            execution.executionId,

        projectId:
            execution.projectId,

        mode:
            execution.mode,

        request:
            execution.request,

        state:
            execution.status,

        createdAt:
            execution.createdAt

    };

}
