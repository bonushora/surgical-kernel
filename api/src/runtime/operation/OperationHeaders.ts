export const OPERATION_HEADERS = {

    operationId:
        "x-operation-id",

    correlationId:
        "x-correlation-id",

    idempotencyKey:
        "idempotency-key"

} as const;


export interface OperationHeaders {

    operationId?: string;

    correlationId?: string;

    idempotencyKey?: string;

}
