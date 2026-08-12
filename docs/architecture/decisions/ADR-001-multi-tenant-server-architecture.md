# ADR-001 — Multi-Tenant Server Architecture

**Status:** APPROVED / FROZEN  
**Date:** 2026-08-12  
**Scope:** Surgical Kernel / Surgical Server

## Decision

Every project integrated with the Surgical Kernel must natively support
multi-tenant operation.

A project may act as:

- Consumer
- Provider
- Consumer and Provider simultaneously

Projects may interact with:

- other projects/tenants;
- external clients.

## Architectural Principles

1. Multi-tenancy is mandatory.
2. Tenant, project, actor and external client are distinct concepts.
3. Project-to-project interaction is a first-class execution model.
4. Project-to-external-client interaction is a first-class execution model.
5. Every execution must preserve tenant and project context.
6. Authorization must be evaluated independently from the requested target.
7. `targetProjectId` identifies an intended destination; it does not constitute authorization.
8. Tenant and project isolation must be enforced by the execution model.
9. Policies, identity and auditability must remain associated with the execution context.
10. The Surgical Kernel remains transversal to projects and governs their executions.
11. Multi-tenancy does not imply shared physical infrastructure.
12. Shared processes, databases or runtime instances are implementation choices, not architectural requirements.
13. The architecture must allow future migration from a single host to distributed infrastructure without changing the Kernel execution contract.

## Conceptual Model

```text
                    SURGICAL KERNEL
                          |
        +-----------------+-----------------+
        |                 |                 |
     PROJECT A          PROJECT B          PROJECT C
      TENANT             TENANT             TENANT
        |                 |                 |
    Consumer/          Consumer/          Consumer/
    Provider           Provider           Provider
        |                 |                 |
        +-----------------+-----------------+
                          |
                 Governed Interactions
                          |
              +-----------+-----------+
              |                       |
        Project/Tenant          External Client
Isolation Requirement

Multi-tenancy must not depend solely on identifiers supplied by a request.

The execution model must establish and preserve:

tenant identity;
project identity;
actor identity;
role;
authorization context;
target context;
execution provenance.

A target project is a routing/execution target, not an authorization grant.

Consequences
Positive
Projects can become interoperable providers and consumers.
External clients can consume project capabilities.
The Kernel becomes a reusable governance layer rather than a
project-specific runtime.
The architecture can scale from a local server to distributed
infrastructure.
Constraint

The Kernel must enforce strong logical isolation between tenants and
projects regardless of whether infrastructure is shared.

Frozen Decision

This architecture is approved and frozen.

Any change to these principles requires explicit architectural approval.
