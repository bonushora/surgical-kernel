import {
    ExecutionState,
    ExecutionMode
} from "./state/ExecutionState.js";


export interface CreateExecutionInput {

    executionId: string;

    projectId: string;

    mode: ExecutionMode;

    request: string;

}


export class KernelEngine {


    createExecution(
        input: CreateExecutionInput
    ): ExecutionState {


        const now =
            new Date().toISOString();


        return {

            executionId:
                input.executionId,

            projectId:
                input.projectId,

            mode:
                input.mode,

            request:
                input.request,

            status:
                "initialized",

            createdAt:
                now,

            updatedAt:
                now

        };

    }


    transition(
        execution: ExecutionState,
        status: ExecutionState["status"]
    ): ExecutionState {


        return {

            ...execution,

            status,

            updatedAt:
                new Date().toISOString()

        };

    }

}
