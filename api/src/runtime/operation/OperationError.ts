export type OperationErrorCode =
    | "INVALID_OPERATION"
    | "INVALID_CONTEXT"
    | "EXECUTION_NOT_FOUND"
    | "OPERATION_NOT_FOUND"
    | "IDEMPOTENCY_CONFLICT"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "EXECUTION_FAILED"
    | "INTERNAL_ERROR";


export interface OperationError {

    code: OperationErrorCode;

    message: string;

    operationId: string;

    correlationId: string;

    details?:
        Record<string, unknown>;

}


export function createOperationErrorResponse(
    error: OperationError
){

    return {

        error: {

            code:
                error.code,

            message:
                error.message,

            operationId:
                error.operationId,

            correlationId:
                error.correlationId,

            ...(error.details
                ? {
                    details:
                        error.details
                }
                : {})

        }

    };

}
