import {
    KernelEngine
} from "../KernelEngine.js";


import {
    RuntimeStateManager
} from "../manager/RuntimeStateManager.js";


import {
    createExecution
} from "../../store/executionStore.js";


import {
    toStoreExecution
} from "../adapter/ExecutionAdapter.js";


import {
    ExecutionState
} from "../state/ExecutionState.js";



export interface CreateExecutionRequest {

    executionId:string;

    projectId:string;

    mode:
        "free"
        |
        "deterministic";

    request:string;

}



export class ExecutionService {


    private engine =
        new KernelEngine();


    private stateManager =
        new RuntimeStateManager();



    create(
        input:CreateExecutionRequest
    ):ExecutionState {


        const execution =
            this.engine.createExecution(
                input
            );


        const stored =
            createExecution(
                toStoreExecution(
                    execution
                )
            );


        return {

            ...execution,

            status:
                stored.state as ExecutionState["status"]

        };

    }



    start(
        execution:ExecutionState
    ):ExecutionState {


        return this.stateManager.transition(
            execution,
            "running"
        );

    }



    complete(
        execution:ExecutionState
    ):ExecutionState {


        return this.stateManager.transition(
            execution,
            "completed"
        );

    }



    history(
        executionId:string
    ){

        return this.stateManager.history(
            executionId
        );

    }

}
