import {
    Router
} from "express";

import {
    queryAuthorizationAudits
} from "../runtime/audit/AuthorizationAuditStore.js";

import type {
    AuthorizationAuditDecision
} from "../runtime/audit/AuthorizationAuditEvent.js";

import type {
    AuthorizationAuditQuery
} from "../runtime/audit/AuthorizationAuditQuery.js";

import {
    DeterministicAuditQueryAuthorizationPolicy
} from "../runtime/audit/AuditQueryAuthorization.js";

import type {
    ExecutionContext
} from "../runtime/context/ExecutionContext.js";

import {
    AUDIT_QUERY_HEADERS
} from "../runtime/operation/AuditQueryHeaders.js";


const router =
    Router();


const authorizationPolicy =
    new DeterministicAuditQueryAuthorizationPolicy();


function optionalQueryValue(
    value: unknown
): string | undefined {

    if (
        typeof value !== "string"
    ) {

        return undefined;

    }


    if (
        value.trim().length === 0
    ) {

        return undefined;

    }


    return value;

}


function requiredHeader(
    value: string | undefined,
    fallback: string
): string {

    if (
        value === undefined ||
        value.trim().length === 0
    ) {

        return fallback;

    }


    return value;

}


router.get(
    "/authorization-audit",
    async (req, res) => {

        const context: ExecutionContext = {

            organizationId:
                requiredHeader(
                    req.header(
                        AUDIT_QUERY_HEADERS.organizationId
                    ),
                    "unknown"
                ),

            projectId:
                requiredHeader(
                    req.header(
                        AUDIT_QUERY_HEADERS.projectId
                    ),
                    "unknown"
                ),

            actorId:
                requiredHeader(
                    req.header(
                        AUDIT_QUERY_HEADERS.actorId
                    ),
                    "anonymous"
                ),

            role:
                "consumer"

        };


        const decision =
            optionalQueryValue(
                req.query.decision
            );


        if (
            decision !== undefined &&
            decision !== "allowed" &&
            decision !== "denied"
        ) {

            return res.status(400)
                .json({

                    error:
                        "Invalid authorization audit decision.",

                    allowedValues: [
                        "allowed",
                        "denied"
                    ]

                });

        }


        const query: AuthorizationAuditQuery = {

            operationId:
                optionalQueryValue(
                    req.query.operationId
                ),

            correlationId:
                optionalQueryValue(
                    req.query.correlationId
                ),

            decisionId:
                optionalQueryValue(
                    req.query.decisionId
                ),

            organizationId:
                optionalQueryValue(
                    req.query.organizationId
                ),

            projectId:
                optionalQueryValue(
                    req.query.projectId
                ),

            actorId:
                optionalQueryValue(
                    req.query.actorId
                ),

            decision:
                decision as
                AuthorizationAuditDecision
                |
                undefined,

            idempotencyKey:
                optionalQueryValue(
                    req.query.idempotencyKey
                )

        };


        const authorization =
            authorizationPolicy.authorize({

                context,

                query

            });


        res.setHeader(
            "x-audit-query-decision-id",
            authorization.decisionId
        );


        if (
            !authorization.allowed
        ) {

            return res.status(403)
                .json({

                    error: {

                        code:
                            "FORBIDDEN",

                        message:
                            authorization.reason,

                        details: {

                            decisionId:
                                authorization.decisionId,

                            organizationId:
                                authorization.organizationId,

                            projectId:
                                authorization.projectId,

                            actorId:
                                authorization.actorId

                        }

                    }

                });

        }


        const scopedQuery: AuthorizationAuditQuery = {

            ...query,

            organizationId:
                authorization.organizationId,

            projectId:
                authorization.projectId

        };


        const audits =
            queryAuthorizationAudits(
                scopedQuery
            );


        return res.json({

            count:
                audits.length,

            audits

        });

    }
);


export default router;
