import {
    ExecutionContext
} from "../runtime/context/ExecutionContext.js";

export interface Execution {

    executionId: string;

    context: ExecutionContext;

    projectId: string;

    mode: string;

    request: string;

    state: string;

    createdAt: string;

    updatedAt?: string;

}


const executions =
    new Map<string, Execution>();



export function createExecution(
    execution: Execution
) {

    executions.set(
        execution.executionId,
        execution
    );

    return execution;

}



export function updateExecution(
    executionId:string,
    update:Partial<Execution>
){

    const current =
        executions.get(
            executionId
        );


    if(!current){

        return undefined;

    }


    const updated = {

        ...current,

        ...update,

        updatedAt:
            new Date().toISOString()

    };


    executions.set(
        executionId,
        updated
    );


    return updated;

}



export function getExecution(
    executionId:string
){

    return executions.get(
        executionId
    );

}



export function getAllExecutions(){

    return Array.from(
        executions.values()
    );

}
