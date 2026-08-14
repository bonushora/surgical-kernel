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


export function appendAuthorizationAudit(
    event: AuthorizationAuditEvent
): AuthorizationAuditEvent {

    return repository.append(
        event
    );

}


export function getAuthorizationAuditsByOperationId(
    operationId: string
): AuthorizationAuditEvent[] {

    return repository.getByOperationId(
        operationId
    );

}


export function getAllAuthorizationAudits():
    AuthorizationAuditEvent[] {

    return repository.getAll();

}


export function queryAuthorizationAudits(
    query: AuthorizationAuditQuery
): AuthorizationAuditEvent[] {

    return repository.query(
        query
    );

}


export function clearAuthorizationAudits(): void {

    repository.clear();

}
