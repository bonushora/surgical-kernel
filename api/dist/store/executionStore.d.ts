export interface Execution {
    executionId: string;
    projectId: string;
    mode: string;
    request: string;
    state: string;
    createdAt: string;
}
export declare function createExecution(execution: Execution): Execution;
export declare function getExecution(executionId: string): Execution | undefined;
export declare function getAllExecutions(): Execution[];
