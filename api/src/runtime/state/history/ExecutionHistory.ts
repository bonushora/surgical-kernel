import {
    ExecutionState
} from "../ExecutionState.js";


export interface ExecutionHistoryEntry {

    executionId: string;

    previousStatus:
        ExecutionState["status"];

    nextStatus:
        ExecutionState["status"];

    timestamp: string;

}



const history =
    new Map<string, ExecutionHistoryEntry[]>();



export function recordTransition(
    executionId: string,
    previousStatus: ExecutionState["status"],
    nextStatus: ExecutionState["status"]
): ExecutionHistoryEntry {


    const entry: ExecutionHistoryEntry = {

        executionId,

        previousStatus,

        nextStatus,

        timestamp:
            new Date().toISOString()

    };


    const current =
        history.get(executionId) ?? [];


    current.push(entry);


    history.set(
        executionId,
        current
    );


    return entry;

}



export function getHistory(
    executionId: string
): ExecutionHistoryEntry[] {


    return (
        history.get(executionId)
        ??
        []
    );

}
