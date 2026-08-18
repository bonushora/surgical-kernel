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

import {
    IdempotencyRegistry
} from "../runtime/operation/IdempotencyRegistry.js";

import {
    getIdempotencyRepository
} from "../runtime/persistence/PersistenceComposition.js";

import {
    createOperationFingerprint
} from "../runtime/operation/OperationFingerprint.js";

import {
    DeterministicOperationAuthorizationPolicy
} from "../runtime/authorization/OperationAuthorization.js";

import {
    appendAuthorizationAudit
} from "../runtime/audit/AuthorizationAuditStore.js";


const router =
    Router();


const executionService =
    new ExecutionService();


const idempotencyRegistry =
    new IdempotencyRegistry(
        getIdempotencyRepository()
    );


const authorizationPolicy =
    new DeterministicOperationAuthorizationPolicy();


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


        const authorizationDecision =
            authorizationPolicy.authorize({

                context:
                    input.context,

                mode:
                    input.mode,

                request:
                    input.request

            });


        await appendAuthorizationAudit({

            auditId:
                crypto.randomUUID(),

            type:
                "authorization.decision",

            timestamp:
                new Date().toISOString(),

            operationId,

            correlationId,

            decisionId:
                authorizationDecision.decisionId,

            organizationId:
                authorizationDecision.organizationId,

            projectId:
                authorizationDecision.projectId,

            actorId:
                authorizationDecision.actorId,

            mode:
                input.mode,

            decision:
                authorizationDecision.allowed
                    ? "allowed"
                    : "denied",

            reason:
                authorizationDecision.reason,

            idempotencyKey

        });


        if (
            !authorizationDecision.allowed
        ) {

            return res.status(403)
                .json(
                    createOperationErrorResponse({

                        code:
                            "FORBIDDEN",

                        message:
                            authorizationDecision.reason ??
                            "Operation authorization failed.",

                        operationId,

                        correlationId,

                        details: {

                            decisionId:
                                authorizationDecision.decisionId,

                            organizationId:
                                authorizationDecision.organizationId,

                            projectId:
                                authorizationDecision.projectId,

                            actorId:
                                authorizationDecision.actorId

                        }

                    })
                );

        }


        try {

            if (idempotencyKey) {

                const fingerprint =
                    createOperationFingerprint({

                        context:
                            input.context,

                        mode:
                            input.mode,

                        request:
                            input.request

                    });


                const idempotency =
                    await idempotencyRegistry.begin(

                        [
                            input.context.organizationId,
                            input.context.projectId,
                            idempotencyKey
                        ].join(":"),

                        fingerprint,

                        operationId,

                        correlationId

                    );


                if (
                    idempotency.kind ===
                    "conflict"
                ) {

                    return res.status(409)
                        .json(
                            createOperationErrorResponse({

                                code:
                                    "IDEMPOTENCY_CONFLICT",

                                message:
                                    "Idempotency key was already used for a different operation.",

                                operationId,

                                correlationId,

                                details: {

                                    existingOperationId:
                                        idempotency.record.operationId,

                                    existingCorrelationId:
                                        idempotency.record.correlationId

                                }

                            })
                        );

                }


                if (
                    idempotency.kind ===
                    "existing"
                ) {

                    if (
                        idempotency.record.response
                    ) {

                        const terminalResponse =
                            idempotency.record.response;

                        res.setHeader(
                            OPERATION_HEADERS.operationId,
                            idempotency.record.operationId
                        );

                        res.setHeader(
                            OPERATION_HEADERS.correlationId,
                            idempotency.record.correlationId
                        );

                        return res
                            .status(
                                terminalResponse.status
                            )
                            .json(
                                terminalResponse.body
                            );

                    }


                    return res.status(409)
                        .json(
                            createOperationErrorResponse({

                                code:
                                    "IDEMPOTENCY_CONFLICT",

                                message:
                                    "An operation with this idempotency key is already in progress.",

                                operationId:

                                    idempotency.record.operationId,

                                correlationId:

                                    idempotency.record.correlationId

                            })
                        );

                }

            }


            const execution =
                await executionService.create({

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
                await executionService.start(
                    execution
                );


            const executed =
                await executionService.execute(
                    started
                );


            const completed =
                await executionService.complete(
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


            if (idempotencyKey) {

                await idempotencyRegistry.complete(

                    [
                        input.context.organizationId,
                        input.context.projectId,
                        idempotencyKey
                    ].join(":"),

                    response

                );

            }


            return res.json(
                response
            );

        } catch (error) {

            const failureResponse =
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

                });

            if (idempotencyKey) {

                await idempotencyRegistry.fail(

                    [
                        input.context.organizationId,
                        input.context.projectId,
                        idempotencyKey
                    ].join(":"),

                    failureResponse

                );

            }

            return res
                .status(500)
                .json(
                    failureResponse
                );

        }

    }
);


export default router;
