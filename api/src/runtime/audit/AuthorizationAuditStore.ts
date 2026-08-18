import {
    AuthorizationAuditEvent
} from "./AuthorizationAuditEvent.js";

import {
    AuthorizationAuditRepository
} from "./AuthorizationAuditRepository.js";

import {
    AuthorizationAuditQuery
} from "./AuthorizationAuditQuery.js";

import {
    FileAuthorizationAuditRepository
} from "./FileAuthorizationAuditRepository.js";


let repository:
    AuthorizationAuditRepository =
    new FileAuthorizationAuditRepository();


export function configureAuthorizationAuditRepository(
    nextRepository: AuthorizationAuditRepository
): void {

    repository =
        nextRepository;

}


export async function appendAuthorizationAudit(
    event: AuthorizationAuditEvent
): Promise<AuthorizationAuditEvent> {

    return await repository.append(
        event
    );

}


export async function getAuthorizationAuditsByOperationId(
    operationId: string
): Promise<AuthorizationAuditEvent[]> {

    return await repository.getByOperationId(
        operationId
    );

}


export async function getAllAuthorizationAudits():
    Promise<AuthorizationAuditEvent[]> {

    return await repository.getAll();

}


export async function queryAuthorizationAudits(
    query: AuthorizationAuditQuery
): Promise<AuthorizationAuditEvent[]> {

    return await repository.query(
        query
    );

}


export async function clearAuthorizationAudits(): Promise<void> {

    await repository.clear();

}
