import {
    createExecution,
    getAllExecutions,
    getExecution,
    restoreExecution,
    updateExecution
} from "./executionStore.js";

import type {
    Execution
} from "./executionStore.js";

import type {
    ExecutionRepository
} from "./ExecutionRepository.js";


export class ExecutionStoreRepository
implements ExecutionRepository {

    async create(
        execution: Execution
    ): Promise<Execution> {

        return createExecution(
            execution
        );

    }


    async restore(
        execution: Execution
    ): Promise<Execution> {

        return restoreExecution(
            execution
        );

    }


    async update(
        executionId: string,
        update: Partial<Execution>
    ): Promise<Execution | undefined> {

        return updateExecution(
            executionId,
            update
        );

    }


    async get(
        executionId: string
    ): Promise<Execution | undefined> {

        return getExecution(
            executionId
        );

    }


    async getAll(): Promise<Execution[]> {

        return getAllExecutions();

    }

}
