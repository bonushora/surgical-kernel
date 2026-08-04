const executions = new Map();
export function createExecution(execution) {
    executions.set(execution.executionId, execution);
    return execution;
}
export function getExecution(executionId) {
    return executions.get(executionId);
}
export function getAllExecutions() {
    return Array.from(executions.values());
}
