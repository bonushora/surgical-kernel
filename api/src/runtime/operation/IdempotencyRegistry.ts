import type {
    OperationResponse,
    OperationErrorResponse
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


export type IdempotencyTerminalResponse =
    | {
        status: number;
        body: OperationResponse;
    }
    | {
        status: number;
        body: OperationErrorResponse;
    };


export interface IdempotencyRecord {

    key: string;

    fingerprint: string;

    operationId: string;

    correlationId: string;

    state: IdempotencyState;

    response?:
        IdempotencyTerminalResponse;

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


    async begin(
        key: string,
        fingerprint: string,
        operationId: string,
        correlationId: string
    ): Promise<IdempotencyBeginResult> {

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
                await this.repository.createIfAbsent(
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
            await this.repository.get(
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


    async complete(
        key: string,
        response: OperationResponse
    ): Promise<void> {

        const record =
            await this.repository.get(
                key
            );


        if (!record) {

            throw new Error(
                `Idempotency record not found: ${key}`
            );

        }


        await this.repository.save({

            ...record,

            state:
                "completed",

            response: {

                status:
                    200,

                body:
                    response

            }

        });

    }


    async fail(
        key: string,
        response: OperationErrorResponse
    ): Promise<void> {

        const record =
            await this.repository.get(
                key
            );


        if (!record) {

            return;

        }


        await this.repository.save({

            ...record,

            state:
                "failed",

            response: {

                status:
                    500,

                body:
                    response

            }

        });

    }


    async get(
        key: string
    ): Promise<IdempotencyRecord | undefined> {

        return await this.repository.get(
            key
        );

    }


    async clear(): Promise<void> {

        await this.repository.clear();

    }

}
