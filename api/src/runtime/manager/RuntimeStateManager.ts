import {
    ExecutionState
} from "../state/ExecutionState.js";

import {
    recordTransition,
    getHistory
} from "../state/history/ExecutionHistory.js";



export class RuntimeStateManager {


    transition(
        execution: ExecutionState,
        nextStatus: ExecutionState["status"]
    ): ExecutionState {


        recordTransition(
            execution.executionId,
            execution.status,
            nextStatus
        );


        return {

            ...execution,

            status:
                nextStatus,

            updatedAt:
                new Date().toISOString()

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
