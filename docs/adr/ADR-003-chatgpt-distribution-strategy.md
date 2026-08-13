# ADR-003 — Surgical Kernel: Estratégia de Distribuição via ChatGPT

**Status:** APPROVED / FROZEN  
**Date:** 2026-08-13

## Context

O Surgical Kernel está evoluindo de um mecanismo de execução para
uma infraestrutura de governança determinística para aplicações
e operações de IA.

O projeto deverá possuir canais de distribuição que permitam que
terceiros conheçam, experimentem e consumam suas capacidades sem
comprometer seus princípios arquiteturais de segurança,
governança, identidade, autorização, auditoria, idempotência e
isolamento multi-tenant.

A plataforma ChatGPT é considerada um possível canal estratégico
de distribuição, descoberta, demonstração e aquisição de usuários
para o Surgical Kernel.

## Decision

O Surgical Kernel deverá perseguir como objetivo estratégico sua
futura disponibilização na plataforma ChatGPT, por meio do mecanismo
de integração/aplicação que estiver oficialmente disponível e
adequado ao projeto no momento da publicação.

A disponibilização não será considerada apenas uma questão de
integração técnica.

Antes da publicação, o Surgical Kernel deverá atingir um nível
adequado de maturidade técnica, segurança, governança,
documentação, experiência de integração e capacidade de demonstrar
valor de forma confiável.

## Publication Gate

A preparação para publicação no ChatGPT somente deverá ser iniciada
quando o projeto atingir um nível de maturidade considerado
suficiente.

O gate deverá considerar, no mínimo:

- identidade de operação;
- autorização e políticas;
- idempotência;
- isolamento multi-tenant;
- auditoria e rastreabilidade;
- recuperação e replay determinísticos;
- estabilidade da API;
- tratamento seguro de falhas;
- documentação pública adequada;
- experiência de integração;
- demonstração clara do valor do Surgical Kernel.

## Alert Condition

Quando o Surgical Kernel atingir o nível de maturidade considerado
suficiente para iniciar a preparação/submissão à plataforma
ChatGPT, deverá ser emitido explicitamente o seguinte alerta:

> ALERTA — SURGICAL KERNEL PRONTO PARA INICIAR A DISPONIBILIZAÇÃO NO CHATGPT

Esse alerta representa um gate estratégico do projeto e não significa
publicação automática.

## Architectural Constraint

A estratégia de distribuição via ChatGPT não altera nem substitui
a arquitetura central do Surgical Kernel.

Continuam obrigatórios:

- governança determinística;
- identidade de operação;
- RBAC + ABAC;
- autorização granular;
- MFA para operações críticas quando aplicável;
- auditoria;
- isolamento multi-tenant;
- rastreabilidade;
- idempotência;
- recuperação e replay;
- separação entre o Surgical Kernel e produtos especializados.

O ChatGPT deverá ser tratado como canal de consumo/distribuição,
e não como autoridade de governança do Surgical Kernel.

## Commercial Strategy

A futura disponibilização no ChatGPT poderá funcionar como canal
de descoberta, demonstração, aquisição e distribuição do Surgical
Kernel.

Qualquer estratégia de publicidade ou monetização dentro do
ecossistema ChatGPT deverá ser avaliada separadamente conforme as
condições comerciais e os mecanismos oficialmente disponíveis no
momento da decisão.

## Consequences

### Positive

- amplia o potencial de descoberta do Surgical Kernel;
- reduz a distância entre demonstração e consumo;
- cria um canal adicional de distribuição;
- permite demonstrar governança de IA em um ambiente de alto alcance;
- reforça a necessidade de uma API estável e uma experiência de
  integração bem definida.

### Negative

- exige maior maturidade de segurança e documentação;
- cria requisitos adicionais de produto e integração;
- aumenta a superfície operacional exposta;
- exige acompanhamento das regras e capacidades da plataforma
  ChatGPT no momento da publicação.

## Final Decision

**APPROVED / FROZEN**

A disponibilização do Surgical Kernel no ChatGPT passa a fazer parte
oficial do objetivo estratégico do projeto.

A implementação continua seguindo o roadmap técnico atual.

