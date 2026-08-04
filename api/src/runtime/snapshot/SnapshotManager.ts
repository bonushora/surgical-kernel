import {
    ExecutionState
} from "../state/ExecutionState.js";


export interface ExecutionSnapshot {

    executionId: string;

    capturedAt: string;

    state: ExecutionState;

}


export class SnapshotManager {


    private snapshots:
        Map<string, ExecutionSnapshot> =
            new Map();


    capture(
        state: ExecutionState
    ): ExecutionSnapshot {


        const snapshot: ExecutionSnapshot = {

            executionId:
                state.executionId,

            capturedAt:
                new Date().toISOString(),

            state:
                {
                    ...state
                }

        };


        this.snapshots.set(
            state.executionId,
            snapshot
        );


        return snapshot;

    }


    get(
        executionId: string
    ):
        ExecutionSnapshot | undefined {


        return this.snapshots.get(
            executionId
        );

    }

}
