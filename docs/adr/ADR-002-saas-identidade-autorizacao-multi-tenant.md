# ADR-002 — Arquitetura SaaS Multi-Tenant e Controle de Acesso

**Status:** APPROVED / FROZEN  
**Data:** 2026-08-12

## Contexto

O ecossistema Surgical será disponibilizado também no modelo SaaS, incluindo o Surgical Forensics como produto especializado construído sobre o Surgical Kernel.

Foi definida a necessidade de permitir que múltiplas organizações utilizem os produtos de forma isolada, mantendo controle granular sobre usuários, funções, casos, evidências e operações críticas.

## Decisão

Fica aprovado e congelado que a arquitetura SaaS do ecossistema Surgical utilizará:

- identidade única por usuário;
- arquitetura multi-tenant;
- isolamento entre organizações;
- controle de acesso baseado em RBAC;
- controle de acesso baseado em atributos (ABAC);
- autorização granular por organização, produto, módulo, função, caso, evidência e operação;
- MFA para operações críticas;
- trilha de auditoria integrada ao Surgical Kernel.

Não serão utilizados logins independentes para cada funcionalidade.

O usuário deverá autenticar-se uma única vez e, após a autenticação, o sistema determinará quais produtos, módulos e operações estão disponíveis de acordo com suas permissões.

## Arquitetura

```text
                 SURGICAL CLOUD / SaaS
                          │
                    Identity/Auth
                          │
                ┌─────────┴─────────┐
                │                   │
             Tenant A            Tenant B
                │                   │
          Organização X        Organização Y
                │                   │
          ┌─────┴─────┐       ┌─────┴─────┐
          │           │       │           │
      Forensics   Outros   Forensics    Outros
          │           │       │           │
          └─────┬─────┘       └─────┬─────┘
                │                   │
                └─────────┬─────────┘
                          │
                   Authorization
                          │
                   Surgical Kernel
                          │
                 EventStore / Audit
Modelo de autorização

A autorização deverá considerar, conforme o contexto:

Usuário
   +
Tenant / Organização
   +
Produto
   +
Módulo
   +
Função
   +
Caso
   +
Evidência
   +
Operação
   =
Permissão
Segurança

Operações de maior criticidade deverão utilizar autenticação multifator e controles adicionais de autorização.

Exemplos de operações críticas:

aquisição de evidência;
alteração de estado de custódia;
transferência de evidência;
encerramento de caso;
geração ou validação de documentação pericial;
operações administrativas sensíveis.

Cada operação crítica deverá produzir uma trilha de auditoria verificável.

Responsabilidades
Identity / Authentication

Responsável por:

autenticação;
sessão;
MFA;
identidade do usuário.
Authorization

Responsável por:

RBAC;
ABAC;
permissões;
escopo do tenant;
autorização de operações.
Surgical Kernel

Responsável pela governança das operações, eventos, persistência, auditoria e replay.

Surgical Forensics

Responsável pelo domínio de perícia computacional e pelas regras específicas de casos, evidências, cadeia de custódia e análise.

Modelo de produto

O Surgical Forensics será disponibilizado como SaaS especializado sobre o Surgical Kernel.

A contratação poderá futuramente considerar elementos como:

organização/tenant;
usuários;
casos;
armazenamento;
capacidade de processamento;
retenção;
auditoria;
relatórios;
recursos avançados.
Princípio arquitetural

A separação deverá preservar a seguinte regra:

Um usuário, uma identidade; múltiplos produtos e módulos, controlados por autorização granular.

Consequências
Positivas
experiência de acesso simplificada;
isolamento entre organizações;
segurança granular;
escalabilidade SaaS;
auditoria centralizada;
possibilidade de múltiplos produtos sobre a mesma identidade;
integração natural com o Surgical Kernel;
suporte a operações críticas com autenticação reforçada.
Negativas
maior complexidade no sistema de autorização;
necessidade de isolamento rigoroso entre tenants;
necessidade de governança adequada de identidades e permissões;
maior complexidade operacional para MFA e auditoria.
Estado

Esta decisão está APROVADA E CONGELADA.

Qualquer alteração desta arquitetura deverá ocorrer somente mediante autorização arquitetural explícita.
