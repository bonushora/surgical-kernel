# ADR-001 — Surgical Forensics como módulo especializado do Surgical Kernel

**Status:** APPROVED / FROZEN  
**Data:** 2026-08-12

## Contexto

O Surgical Kernel possui como objetivo atuar como infraestrutura genérica de governança determinística, execução controlada, eventos, persistência, auditoria e replay.

Foi identificada a possibilidade de utilização dessa infraestrutura para processos de perícia computacional, especialmente para rastreabilidade de evidências, cadeia de custódia, auditoria das operações e reprodutibilidade dos procedimentos realizados durante uma investigação pericial.

## Decisão

Fica aprovado e congelado que o **Surgical Forensics será desenvolvido como um módulo/produto especializado separado do Surgical Kernel, porém nativamente integrado ao Kernel**.

O Surgical Kernel permanecerá genérico e não receberá funcionalidades específicas do domínio de perícia computacional diretamente em seu núcleo.

## Responsabilidades

### Surgical Kernel

O Kernel continuará fornecendo as capacidades fundamentais de infraestrutura:

- governança de execução;
- Policy Engine;
- EventStore;
- persistência de eventos;
- MemoryEventRepository;
- FileEventRepository;
- auditoria;
- rastreabilidade;
- replay determinístico;
- controle de operações;
- integridade dos registros.

### Surgical Forensics

O módulo especializado será responsável pelas capacidades específicas de perícia computacional, incluindo:

- gerenciamento de casos periciais;
- identificação e gerenciamento de evidências;
- cadeia de custódia;
- registro e validação de hashes;
- aquisição de evidências;
- evidências derivadas;
- genealogia das evidências;
- timeline forense;
- registro de procedimentos;
- ferramentas e versões utilizadas;
- achados periciais;
- rastreabilidade da análise;
- suporte à geração da documentação utilizada na elaboração de laudos.

## Integração

A relação arquitetural aprovada é:

```text
                 SURGICAL KERNEL
              ─────────────────────
              núcleo de governança
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   Policy Engine   EventStore    Audit/Replay
        │              │              │
        └──────────────┼──────────────┘
                       │
             Surgical Forensics
             ───────────────────
             módulo especializado
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   Case Manager   Evidence Chain   Forensic
                  of Custody       Analysis
                       │
                       ▼
                  Report / Laudo

O Surgical Forensics utilizará os mecanismos de governança e rastreabilidade do Surgical Kernel, mas permanecerá desacoplado do domínio específico de perícia.

Princípio arquitetural

A separação deverá preservar a seguinte regra:

Forensics conhece perícia. Kernel conhece governança da execução.

Consequências
Positivas
preserva a generalidade do Surgical Kernel;
evita acoplamento do núcleo ao domínio forense;
permite evolução independente do Surgical Forensics;
permite que o mesmo Kernel suporte outros módulos especializados;
possibilita auditoria e reprodutibilidade das operações forenses;
permite futura criação de produtos verticais baseados no Kernel.
Negativas
haverá uma camada adicional de integração entre Kernel e Forensics;
o módulo forense deverá definir seus próprios modelos e regras de domínio;
algumas capacidades deverão ser expostas pelo Kernel por interfaces estáveis.
Estado

Esta decisão está APROVADA E CONGELADA.

Qualquer alteração desta arquitetura deverá ocorrer somente mediante autorização arquitetural explícita.
