import {
    getExecutionIds,
    getEvents
} from "../events/EventStore.js";

import {
    replayExecution
} from "../replay/EventReplay.js";

import {
    getExecutionRepository
} from "../persistence/PersistenceComposition.js";

import type {
    Execution
} from "../../store/executionStore.js";

import type {
    ExecutionRepository
} from "../../store/ExecutionRepository.js";


export async function recoverExecutions(
    executionRepository:
        ExecutionRepository =
        getExecutionRepository()
): Promise<number> {

    const executionIds =
        await getExecutionIds();

    let recovered = 0;


    for (
        const executionId
        of executionIds
    ) {

        const events =
            await getEvents(
                executionId
            );


        if (events.length === 0) {

            continue;

        }


        const last =
            events[
                events.length - 1
            ];


        /*
         * RECOVERY V1.2
         *
         * An execution whose latest event is
     * execution.completed or execution.failed is terminal.
         *
         * This includes both:
         *
         * created -> started -> completed
         * created -> completed
         *
         * Any other lifecycle ending is considered
         * recoverable from the event ledger.
         */

        if (
            last.type ===
"execution.completed"
        ||
        last.type ===
        "execution.failed"
        ) {

            continue;

        }


        const replay =
            await replayExecution(
                executionId
            );


        if (!replay) {

            continue;

        }


        const first =
            events[0];


        const execution: Execution = {

            executionId:
                replay.executionId,

            context:
                replay.context,

            projectId:
                replay.projectId,

            mode:
                replay.mode,

            request:
                replay.request,

            state:
                replay.state,

            createdAt:
                first.timestamp,

            result:
                replay.result,

            updatedAt:
                last.timestamp

        };


        await executionRepository.restore(
            execution
        );


        recovered += 1;

    }


    return recovered;

}
