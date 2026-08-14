import type {
    IdempotencyRecord
} from "./IdempotencyRegistry.js";


export interface IdempotencyRepository {

    get(
        key: string
    ): IdempotencyRecord | undefined;


    createIfAbsent(
        record: IdempotencyRecord
    ): boolean;


    save(
        record: IdempotencyRecord
    ): void;


    clear(): void;

}
