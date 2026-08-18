import type {
    IdempotencyRecord
} from "./IdempotencyRegistry.js";


export interface IdempotencyRepository {

    get(
        key: string
    ): Promise<IdempotencyRecord | undefined>;


    createIfAbsent(
        record: IdempotencyRecord
    ): Promise<boolean>;


    save(
        record: IdempotencyRecord
    ): Promise<void>;


    clear(): Promise<void>;

}
