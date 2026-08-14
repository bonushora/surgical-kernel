export const AUDIT_QUERY_HEADERS = {

    organizationId:
        "x-organization-id",

    projectId:
        "x-project-id",

    actorId:
        "x-actor-id"

} as const;


export interface AuditQueryHeaders {

    organizationId?: string;

    projectId?: string;

    actorId?: string;

}
