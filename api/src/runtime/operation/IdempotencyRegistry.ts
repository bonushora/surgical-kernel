import type {
    OperationResponse
} from "./OperationContract.js";


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

    private readonly records =
        new Map<string, IdempotencyRecord>();


    begin(
        key: string,
        fingerprint: string,
        operationId: string,
        correlationId: string
    ): IdempotencyBeginResult {

        const existing =
            this.records.get(
                key
            );


        if (!existing) {

            const record: IdempotencyRecord = {

                key,

                fingerprint,

                operationId,

                correlationId,

                state:
                    "pending"

            };


            this.records.set(
                key,
                record
            );


            return {

                kind:
                    "new",

                record

            };

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
            this.records.get(
                key
            );


        if (!record) {

            throw new Error(
                `Idempotency record not found: ${key}`
            );

        }


        this.records.set(
            key,
            {

                ...record,

                state:
                    "completed",

                response

            }

        );

    }


    fail(
        key: string
    ): void {

        const record =
            this.records.get(
                key
            );


        if (!record) {

            return;

        }


        this.records.set(
            key,
            {

                ...record,

                state:
                    "failed"

            }

        );

    }


    get(
        key: string
    ): IdempotencyRecord | undefined {

        return this.records.get(
            key
        );

    }


    clear(): void {

        this.records.clear();

    }

}
