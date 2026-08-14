import type {
    AuthorizationAuditQuery
} from "./AuthorizationAuditQuery.js";

import type {
    ExecutionContext
} from "../context/ExecutionContext.js";


export interface AuditQueryAuthorizationRequest {

    context: ExecutionContext;

    query: AuthorizationAuditQuery;

}


export interface AuditQueryAuthorizationDecision {

    decisionId: string;

    allowed: boolean;

    organizationId: string;

    projectId: string;

    actorId: string;

    reason: string;

}


export interface AuditQueryAuthorizationPolicy {

    authorize(
        input: AuditQueryAuthorizationRequest
    ): AuditQueryAuthorizationDecision;

}


export class DeterministicAuditQueryAuthorizationPolicy
implements AuditQueryAuthorizationPolicy {

    authorize(
        input: AuditQueryAuthorizationRequest
    ): AuditQueryAuthorizationDecision {

        const organizationId =
            input.context.organizationId;

        const projectId =
            input.context.projectId;

        const actorId =
            input.context.actorId;


        if (
            !organizationId ||
            organizationId === "unknown"
        ) {

            return {

                decisionId:
                    crypto.randomUUID(),

                allowed:
                    false,

                organizationId,

                projectId,

                actorId,

                reason:
                    "Audit query authorization requires a valid organization identity."

            };

        }


        if (
            !projectId ||
            projectId === "unknown"
        ) {

            return {

                decisionId:
                    crypto.randomUUID(),

                allowed:
                    false,

                organizationId,

                projectId,

                actorId,

                reason:
                    "Audit query authorization requires a valid project identity."

            };

        }


        if (
            !actorId ||
            actorId === "anonymous"
        ) {

            return {

                decisionId:
                    crypto.randomUUID(),

                allowed:
                    false,

                organizationId,

                projectId,

                actorId,

                reason:
                    "Audit query authorization requires a valid actor identity."

            };

        }


        if (
            input.query.organizationId !== undefined &&
            input.query.organizationId !== organizationId
        ) {

            return {

                decisionId:
                    crypto.randomUUID(),

                allowed:
                    false,

                organizationId,

                projectId,

                actorId,

                reason:
                    "Audit query organization scope does not match the authorized organization."

            };

        }


        if (
            input.query.projectId !== undefined &&
            input.query.projectId !== projectId
        ) {

            return {

                decisionId:
                    crypto.randomUUID(),

                allowed:
                    false,

                organizationId,

                projectId,

                actorId,

                reason:
                    "Audit query project scope does not match the authorized project."

            };

        }


        if (
            input.query.actorId !== undefined &&
            input.query.actorId !== actorId
        ) {

            return {

                decisionId:
                    crypto.randomUUID(),

                allowed:
                    false,

                organizationId,

                projectId,

                actorId,

                reason:
                    "Audit query actor scope does not match the authorized actor."

            };

        }


        return {

            decisionId:
                crypto.randomUUID(),

            allowed:
                true,

            organizationId,

            projectId,

            actorId,

            reason:
                "Audit query explicitly authorized by deterministic tenant and project scope policy."

        };

    }

}
