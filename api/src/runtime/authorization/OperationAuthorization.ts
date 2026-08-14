import type {
    ExecutionContext
} from "../context/ExecutionContext.js";


export interface OperationAuthorizationRequest {

    context: ExecutionContext;

    mode:
        "free"
        |
        "deterministic";

    request: string;

}


export interface OperationAuthorizationDecision {

    decisionId: string;

    allowed: boolean;

    organizationId: string;

    projectId: string;

    actorId: string;

    reason?: string;

}


export interface OperationAuthorizationPolicy {

    authorize(
        input: OperationAuthorizationRequest
    ): OperationAuthorizationDecision;

}


export class DeterministicOperationAuthorizationPolicy
implements OperationAuthorizationPolicy {

    authorize(
        input: OperationAuthorizationRequest
    ): OperationAuthorizationDecision {

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
                    "Operation authorization requires a valid organization identity."

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
                    "Operation authorization requires a valid project identity."

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
                    "Operation authorization requires a valid actor identity."

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
                "Operation explicitly authorized by deterministic operation policy."

        };

    }

}
