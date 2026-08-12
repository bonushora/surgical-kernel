export type ExecutionRole =
    | "consumer"
    | "provider";


export interface ExecutionContext {

    organizationId: string;

    projectId: string;

    actorId: string;

    role: ExecutionRole;

    targetProjectId?: string;

}
