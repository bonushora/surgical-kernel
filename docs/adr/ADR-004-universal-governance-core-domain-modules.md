# ADR-004 — Universal Governance Core and Domain-Specific Modules

**Status:** APPROVED / FROZEN  
**Date:** 2026-08-17

## Context

The Surgical Kernel is being evolved as a universal deterministic governance
core. It provides transversal capabilities such as governed execution,
policies, events, persistence, auditability, idempotency, recovery and replay.

Different markets and user groups may require capabilities that are specific to
their domains. Those requirements must be evaluated without allowing a target
audience, a marketing label or a vertical roadmap to contaminate the universal
Kernel.

## Decision

The Surgical Kernel remains the universal deterministic governance core.

Domain-specific capabilities may be implemented as specialized modules that
use the Kernel's stable governance capabilities. A module must not be created
merely because a target audience exists.

A proposed module requires a demonstrable domain-specific basis, including:

- a concrete domain problem;
- domain-specific requirements;
- domain-specific policies;
- domain objects and concepts;
- regulatory or compliance requirements, where applicable;
- additional functionality beyond the universal Kernel; and
- independent commercial value.

The following are initial candidate domains only. They are not frozen final
modules, and their names do not authorize implementation:

- Surgical Dev;
- Surgical Agent;
- Surgical Enterprise;
- Surgical Banking;
- Surgical Forensics;
- Surgical Security;
- Surgical Government;
- Surgical Health;
- Surgical Industrial; and
- Surgical Research.

Surgical Forensics remains a first-class specialization. It must not be
subordinated to banking, developer, or any other vertical requirements.

## Architectural Constraints

Domain-specific requirements must not contaminate the universal Surgical
Kernel. The Kernel remains responsible for universal deterministic governance;
specialized modules remain responsible for their own domain models, policies,
compliance obligations and additional functionality.

New modules will be evaluated through a future Surgical Kernel Domain Matrix
before implementation. The matrix will provide the explicit evaluation
mechanism for domain problems, requirements, policies, objects, compliance,
additional functionality and independent commercial value.

This decision does not authorize implementation of Surgical Dev, Surgical
Agent, Surgical Enterprise, Surgical Banking, Surgical Forensics, Surgical
Security, Surgical Government, Surgical Health, Surgical Industrial, Surgical
Research, or any other specialized module.

## Consequences

### Positive

- preserves the Surgical Kernel as a reusable universal governance core;
- permits domain specialization without coupling vertical concerns into the
  Kernel;
- gives Surgical Forensics an explicit first-class architectural position;
- establishes objective criteria for deciding whether a module is warranted;
- supports independent evolution and commercial evaluation of future modules.

### Negative

- domain proposals require explicit analysis before implementation;
- specialized modules must maintain their own domain models and requirements;
- a future Domain Matrix will add an architectural evaluation step.

## Final Decision

**APPROVED / FROZEN**

This decision establishes the architectural boundary between the universal
Surgical Kernel and future domain-specific modules. Any implementation or
change that crosses this boundary requires a separate explicit architectural
decision.
