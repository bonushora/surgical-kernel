import type {
    OperationResponse
} from "./OperationContract.js";

import {
    FileIdempotencyRepository
} from "./FileIdempotencyRepository.js";

import type {
    IdempotencyRepository
} from "./IdempotencyRepository.js";


export type IdempotencyState =
    | "pending"
    | "completed"
    | "failed";


export interface IdempotencyRecord {

    key: string;

    fingerprint: string;

    operationId: string;

    correlationId: string;

    state: IdempotencyState;

    response?: OperationResponse;

}


export type IdempotencyBeginResult =
    | {
        kind: "new";
        record: IdempotencyRecord;
    }
    | {
        kind: "existing";
        record: IdempotencyRecord;
    }
    | {
        kind: "conflict";
        record: IdempotencyRecord;
    };


export class IdempotencyRegistry {

    private readonly repository:
        IdempotencyRepository;


    constructor(
        repository:
            IdempotencyRepository =
            new FileIdempotencyRepository()
    ) {

        this.repository =
            repository;

    }


    begin(
        key: string,
        fingerprint: string,
        operationId: string,
        correlationId: string
    ): IdempotencyBeginResult {

        const record: IdempotencyRecord = {

            key,

            fingerprint,

            operationId,

            correlationId,

            state:
                "pending"

        };


        try {

            const created =
                this.repository.createIfAbsent(
                    record
                );


            if (
                created
            ) {

                return {

                    kind:
                        "new",

                    record

                };

            }

        } catch (error) {

            if (
                !(
                    error instanceof Error &&
                    "code" in error &&
                    error.code === "EEXIST"
                )
            ) {
                throw error;
            }

        }


        const existing =
            this.repository.get(
                key
            );


        if (!existing) {

            throw new Error(
                `Idempotency record could not be resolved after concurrent creation: ${key}`
            );

        }


        if (
            existing.fingerprint !==
            fingerprint
        ) {

            return {

                kind:
                    "conflict",

                record:
                    existing

            };

        }


        return {

            kind:
                "existing",

            record:
                existing

        };

    }


    complete(
        key: string,
        response: OperationResponse
    ): void {

        const record =
            this.repository.get(
                key
            );


        if (!record) {

            throw new Error(
                `Idempotency record not found: ${key}`
            );

        }


        this.repository.save({

            ...record,

            state:
                "completed",

            response

        });

    }


    fail(
        key: string
    ): void {

        const record =
            this.repository.get(
                key
            );


        if (!record) {

            return;

        }


        this.repository.save({

            ...record,

            state:
                "failed"

        });

    }


    get(
        key: string
    ): IdempotencyRecord | undefined {

        return this.repository.get(
            key
        );

    }


    clear(): void {

        this.repository.clear();

    }

}
