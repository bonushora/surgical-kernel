export interface Execution {
    executionId: string;
    projectId: string;
    mode: string;
    request: string;
    state: string;
    createdAt: string;
}


const executions = new Map<string, Execution>();


export function createExecution(
    execution: Execution
) {

    executions.set(
        execution.executionId,
        execution
    );

    return execution;
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
