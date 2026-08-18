import type {
    Execution
} from "./executionStore.js";


export interface ExecutionRepository {

    create(
        execution: Execution
    ): Promise<Execution>;


    restore(
        execution: Execution
    ): Promise<Execution>;


    update(
        executionId: string,
        update: Partial<Execution>
    ): Promise<Execution | undefined>;


    get(
        executionId: string
    ): Promise<Execution | undefined>;


    getAll(): Promise<Execution[]>;

}
