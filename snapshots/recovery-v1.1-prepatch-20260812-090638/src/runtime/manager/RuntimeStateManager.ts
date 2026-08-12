import {
    ExecutionState
} from "../state/ExecutionState.js";

import {
    recordTransition,
    getHistory
} from "../state/history/ExecutionHistory.js";



export class RuntimeStateManager {


    private readonly allowedTransitions:
        Record<
            ExecutionState["status"],
            ExecutionState["status"][]
        > = {

            initialized: [
                "running",
                "failed"
            ],

            running: [
                "completed",
                "failed"
            ],

            completed: [],

            failed: []

        };


    transition(
        execution: ExecutionState,
        nextStatus: ExecutionState["status"]
    ): ExecutionState {


        const allowed =
            this.allowedTransitions[
                execution.status
            ];


        if (!allowed.includes(nextStatus)) {

            throw new Error(
                `Invalid execution state transition: ` +
                `${execution.status} -> ${nextStatus}`
            );

        }


        const updatedAt =
            new Date().toISOString();


        recordTransition(
            execution.executionId,
            execution.status,
            nextStatus
        );


        return {

            ...execution,

            status:
                nextStatus,

            updatedAt

        };

    }



    history(
        executionId:string
    ){

        return getHistory(
            executionId
        );

    }

}
