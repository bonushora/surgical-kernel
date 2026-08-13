import {
    Router
} from "express";

import {
    ExecutionService
} from "../runtime/service/ExecutionService.js";

import {
    OPERATION_HEADERS
} from "../runtime/operation/OperationHeaders.js";

import type {
    OperationRequest,
    OperationResponse
} from "../runtime/operation/OperationContract.js";

import {
    createOperationErrorResponse
} from "../runtime/operation/OperationError.js";


const router =
    Router();


const executionService =
    new ExecutionService();


router.post(
    "/operations",
    async (req, res) => {

        const operationId =
            req.header(
                OPERATION_HEADERS.operationId
            ) ??
            crypto.randomUUID();


        const correlationId =
            req.header(
                OPERATION_HEADERS.correlationId
            ) ??
            crypto.randomUUID();


        const idempotencyKey =
            req.header(
                OPERATION_HEADERS.idempotencyKey
            );


        res.setHeader(
            OPERATION_HEADERS.operationId,
            operationId
        );


        res.setHeader(
            OPERATION_HEADERS.correlationId,
            correlationId
        );


        if (idempotencyKey) {

            res.setHeader(
                OPERATION_HEADERS.idempotencyKey,
                idempotencyKey
            );

        }


        const input =
            req.body as Partial<OperationRequest>;


        if (
            !input.context ||
            !input.mode ||
            typeof input.request !== "string"
        ) {

            return res.status(400)
                .json(
                    createOperationErrorResponse({

                        code:
                            "INVALID_OPERATION",

                        message:
                            "Operation requires context, mode and request.",

                        operationId,

                        correlationId

                    })
                );

        }


        try {

            const execution =
                executionService.create({

                    executionId:
                        crypto.randomUUID(),

                    context:
                        input.context,

                    projectId:
                        input.context.projectId,

                    mode:
                        input.mode,

                    request:
                        input.request

                });


            const started =
                executionService.start(
                    execution
                );


            const executed =
                await executionService.execute(
                    started
                );


            const completed =
                executionService.complete(
                    executed
                );


            const response:
                OperationResponse = {

                operationId,

                correlationId,

                executionId:
                    completed.executionId,

                status:
                    completed.status === "failed"
                        ? "failed"
                        : "completed",

                state:
                    completed.status,

                mode:
                    completed.mode,

                result:
                    completed.result

            };


            return res.json(
                response
            );

        } catch (error) {

            return res.status(500)
                .json(
                    createOperationErrorResponse({

                        code:
                            "EXECUTION_FAILED",

                        message:
                            error instanceof Error
                                ? error.message
                                : "Operation execution failed.",

                        operationId,

                        correlationId,

                        details:
                            idempotencyKey
                                ? {
                                    idempotencyKey
                                }
                                : undefined

                    })
                );

        }

    }
);


export default router;
