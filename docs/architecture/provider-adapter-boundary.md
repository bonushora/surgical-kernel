# Surgical Kernel — Provider Adapter Boundary

## Status

**Fase:** 5.4  
**Status:** Consolidado  
**Arquitetura:** Provider Boundary via `AIProvider`

---

## Objetivo

O Surgical Kernel não executa diretamente SDKs, APIs ou implementações
específicas de provedores externos de IA.

A comunicação com qualquer provider ocorre exclusivamente através do
contrato `AIProvider`.

```text
ExecutionService
       |
       v
ProviderPolicy
       |
       v
AIProvider
       |
       +---- MockProvider
       |
       +---- External Provider Adapter
       |
       +---- Future Provider
Boundary oficial

Arquivo:

api/src/runtime/providers/AIProvider.ts

Contrato:

export interface AIProvider {

    execute(
        input: AIProviderRequest
    ): Promise<AIProviderResponse>;

}

Esse contrato representa o limite entre o Runtime do Surgical Kernel
e a implementação concreta do provedor de IA.

Responsabilidades do Kernel

O Kernel controla:

ExecutionContext
organizationId
projectId
actorId
execution mode
ProviderPolicy
autorização
lifecycle
persistência
Event Ledger
replay
recovery
resultado da execução

O Kernel não deve depender de SDK específico de IA.

Responsabilidades do Provider

O provider concreto controla:

autenticação junto ao serviço externo;
montagem da chamada específica;
comunicação HTTP/SDK;
transformação da resposta externa;
identificação do provider;
identificação do model;
metadata específica do provider.
Regra fundamental

Nenhum SDK externo de IA deve ser importado diretamente por:

ExecutionService
KernelEngine
RuntimeStateManager
EventStore
EventReplay
ExecutionRecovery
SnapshotManager

Integrações externas devem permanecer atrás de:

AIProvider
Governance Boundary

Antes de qualquer chamada ao provider:

ExecutionService
       |
       v
ProviderPolicy.authorize()
       |
       +---- DENY ----> execution.failed
       |
       +---- ALLOW ---> AIProvider.execute()

A política possui autoridade para impedir a execução.

Um provider nunca deve ser chamado antes da autorização.

Deterministic Mode

No modo:

deterministic

o provider deve ser explicitamente autorizado pela ProviderPolicy.

A implementação atual utiliza:

MockProvider
mock-deterministic-v1

Essa implementação permanece como provider oficial de validação
determinística enquanto integrações externas não forem homologadas.

Proibição arquitetural

Não criar uma segunda abstração artificial:

ProviderAdapter
       |
       v
AIProvider
       |
       v
Provider

enquanto não existir uma responsabilidade concreta que justifique
essa camada.

O contrato AIProvider já constitui o Provider Adapter Boundary.

Evolução futura

Quando um provider externo for introduzido:

ExecutionService
       |
       v
ProviderPolicy
       |
       v
AIProvider
       |
       +---- OpenAIProvider
       |
       +---- AnthropicProvider
       |
       +---- AzureProvider
       |
       +---- LocalProvider

Cada implementação deverá:

implementar AIProvider;
permanecer isolada do Kernel;
não alterar ExecutionService;
não alterar KernelEngine;
não acessar diretamente o EventStore;
retornar AIProviderResponse;
preservar provider e model;
permitir auditoria e replay através do resultado persistido.
Estado aprovado

O boundary atual é considerado suficiente para a Fase 5.4.

Nenhuma mudança estrutural adicional no Runtime é necessária nesta fase.

