import {
    getExecutionIds,
    getEvents
} from "../events/EventStore.js";

import {
    replayExecution
} from "../replay/EventReplay.js";

import {
    restoreExecution
} from "../../store/executionStore.js";

import {
    Execution
} from "../../store/executionStore.js";


export function recoverExecutions(): number {

    const executionIds =
        getExecutionIds();

    let recovered = 0;


    for (
        const executionId
        of executionIds
    ) {

        const events =
            getEvents(
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
         * RECOVERY V1.1
         *
         * An execution whose latest event is
         * execution.completed is terminal.
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
        ) {

            continue;

        }


        const replay =
            replayExecution(
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


        restoreExecution(
            execution
        );


        recovered += 1;

    }


    return recovered;

}
