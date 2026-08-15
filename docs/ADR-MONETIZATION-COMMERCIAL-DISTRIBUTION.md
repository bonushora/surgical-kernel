# ADR — Surgical Kernel: Monetização, Distribuição e Arquitetura Comercial

**Status:** APPROVED / FROZEN  
**Data:** 2026-08-15  
**Projeto:** Surgical Kernel  
**Branch de registro:** feature/ai-provider-abstraction  
**Natureza:** Decisão arquitetural/estratégica  
**Implementação imediata:** NÃO  
**Execução:** Em momento oportuno, após maturidade técnica e validação comercial/jurídica

---

## 1. Decisão

Fica aprovada e congelada a estratégia de que o Surgical Kernel deverá possuir uma arquitetura comercial capaz de atender tanto:

1. clientes corporativos;
2. profissionais especializados;
3. organizações e instituições;
4. e, quando comercialmente apropriado, clientes pessoa física.

A arquitetura não deverá assumir que o Surgical Kernel é exclusivamente um produto B2B.

O produto deverá permanecer tecnicamente preparado para diferentes modelos de monetização, planos, perfis de cliente, tenants e jurisdições.

---

## 2. Distribuição por meio do ChatGPT

Fica aprovada a estratégia de avaliar e, quando tecnicamente e contratualmente permitido, disponibilizar o Surgical Kernel como App/integração no ChatGPT.

O ChatGPT poderá funcionar como:

- canal de distribuição;
- canal de descoberta;
- canal de demonstração;
- interface de experiência;
- canal de aquisição de usuários;
- potencial canal comercial.

A utilização do ChatGPT como canal deverá respeitar integralmente:

- termos de uso;
- políticas aplicáveis;
- regras específicas para Apps;
- regras de monetização;
- requisitos técnicos;
- limitações de integração;
- requisitos de privacidade;
- requisitos de segurança;
- demais condições impostas pela plataforma.

O Surgical Kernel não deverá depender arquiteturalmente de uma única plataforma de distribuição.

---

## 3. Monetização

O Surgical Kernel deverá ser projetado para suportar diferentes modelos comerciais, incluindo, conforme o produto e o mercado:

- assinatura;
- cobrança por plano;
- cobrança por uso;
- cobrança por operação;
- cobrança por volume;
- cobrança por módulo;
- cobrança por funcionalidades especializadas;
- planos corporativos;
- contratos institucionais;
- licenciamento;
- serviços especializados;
- modelos híbridos.

A estratégia comercial definitiva de cada produto poderá variar por mercado, perfil de cliente e jurisdição.

---

## 4. Arquitetura de Tenants

O modelo multi-tenant do Surgical Kernel deverá permitir associação entre:

- usuário;
- organização;
- tenant;
- projeto;
- produto;
- módulo;
- função;
- caso;
- evidência;
- operação;
- plano comercial;
- regras de faturamento.

Um tenant poderá possuir regras comerciais próprias quando necessário.

A autorização deverá permanecer separada da cobrança.

Pagamento ou assinatura não deverá substituir:

- identidade;
- autenticação;
- autorização;
- RBAC;
- ABAC;
- políticas;
- isolamento de tenant;
- auditoria.

---

## 5. Arquitetura de Pagamentos

A arquitetura deverá permanecer desacoplada de um único processador de pagamentos.

Deverá ser possível integrar diferentes provedores conforme:

- país;
- moeda;
- método de pagamento;
- custo;
- disponibilidade;
- compliance;
- tributação;
- requisitos regulatórios;
- necessidade de split;
- perfil do cliente.

O Surgical Kernel deverá evitar dependência arquitetural irreversível de um único PSP.

---

## 6. Brasil

Para operações brasileiras, a arquitetura deverá contemplar meios de pagamento legalmente permitidos e comercialmente adequados ao mercado nacional, incluindo:

- PIX;
- cartão de crédito;
- outros meios legalmente disponíveis quando necessários.

A implementação futura deverá observar legislação brasileira, regras fiscais, consumeristas, financeiras, tributárias, de proteção de dados e demais normas aplicáveis ao modelo efetivamente adotado.

A escolha do provedor de pagamentos deverá considerar custo, cobertura, disponibilidade, antifraude, recorrência, split e integração.

---

## 7. Estados Unidos

Para operações nos Estados Unidos, a arquitetura deverá permitir utilização de infraestrutura de pagamentos apropriada ao mercado americano, incluindo cartões e demais meios disponíveis e legalmente aplicáveis.

A escolha definitiva do provedor deverá considerar:

- custo;
- cobertura;
- processamento internacional;
- conversão de moeda;
- recurring billing;
- marketplace/split quando necessário;
- antifraude;
- compliance;
- capacidade de expansão internacional.

A infraestrutura americana não deverá obrigar a startup brasileira a abandonar sua arquitetura de pagamentos brasileira.

---

## 8. Internacionalização

A arquitetura deverá permitir adaptação por jurisdição.

Cada país poderá possuir:

- métodos de pagamento específicos;
- moeda específica;
- tributação específica;
- regras de faturamento específicas;
- requisitos de identificação;
- requisitos de proteção de dados;
- regras de consumidor;
- requisitos de compliance.

O objetivo arquitetural é permitir que a camada comercial adapte-se à jurisdição sem contaminar o núcleo determinístico do Surgical Kernel.

---

## 9. Split de Pagamentos

Fica aprovada a preparação arquitetural para eventual utilização de split de pagamentos.

O split poderá ser necessário em cenários como:

- marketplace;
- múltiplos prestadores;
- parceiros;
- organizações;
- afiliados;
- distribuidores;
- fornecedores;
- módulos especializados;
- ecossistema de terceiros.

O mecanismo de split deverá ser implementado somente quando houver caso de negócio concreto e após validação jurídica, fiscal e regulatória da jurisdição correspondente.

O Surgical Kernel não deverá presumir que todo pagamento precisa ser dividido.

---

## 10. Surgical Kernel Forense

O Surgical Kernel Forense constitui módulo especializado direcionado, entre outros, a:

- peritos em computação forense;
- auditores;
- bancos;
- seguradoras;
- instituições financeiras;
- organizações que necessitem de investigação digital;
- outros clientes institucionais ou profissionais credenciados.

O módulo poderá possuir:

- tenant especializado;
- planos comerciais específicos;
- regras de faturamento próprias;
- controle de acesso especializado;
- políticas específicas;
- requisitos adicionais de segurança;
- trilhas de auditoria reforçadas.

A monetização do módulo poderá ser distinta da monetização do Surgical Kernel genérico.

---

## 11. Cadeia de Custódia

O Surgical Kernel Forense deverá ser arquitetado para suportar cadeia de custódia digital automatizada e auditável.

A arquitetura deverá preservar, quando aplicável:

- identidade da evidência;
- origem;
- aquisição;
- timestamp;
- hash;
- transformação;
- derivação;
- responsável pela operação;
- contexto;
- autorização;
- histórico;
- integridade;
- eventos de acesso;
- eventos de processamento;
- relação entre evidências originais e derivadas.

A adaptação às legislações de diferentes países deverá ocorrer por meio de políticas, perfis jurisdicionais e mecanismos especializados.

Não deverá existir uma presunção de que uma única política de cadeia de custódia seja juridicamente válida em todas as jurisdições.

---

## 12. Nuvem e Integridade Probatória

Fica aprovada a arquitetura que permita processamento em nuvem quando tecnicamente e juridicamente apropriado.

A utilização de nuvem não deverá, por si só, ser considerada incompatível com integridade probatória.

A arquitetura deverá preservar mecanismos técnicos como:

- hashing;
- integridade;
- controle de acesso;
- identidade;
- timestamps;
- trilha de auditoria;
- versionamento;
- registro de operações;
- cadeia de custódia;
- isolamento de tenants;
- evidência de alterações;
- reprodução determinística quando aplicável.

A validade jurídica final de uma evidência dependerá da legislação, normas técnicas, procedimentos de aquisição e requisitos do tribunal ou autoridade competente da respectiva jurisdição.

O Surgical Kernel deverá fornecer mecanismos técnicos para suportar esses requisitos, mas não deverá declarar automaticamente que uma evidência é juridicamente admissível em qualquer país.

---

## 13. Separação entre Núcleo e Camada Comercial

O núcleo determinístico do Surgical Kernel deverá permanecer independente da camada comercial.

Separar conceitualmente:

**Core**
- identidade;
- autorização;
- políticas;
- operações;
- execução;
- idempotência;
- auditoria;
- eventos;
- evidências;
- governança.

**Commercial Layer**
- planos;
- preços;
- assinatura;
- faturamento;
- cobrança;
- pagamentos;
- split;
- impostos;
- promoções;
- limites comerciais;
- entitlement.

A camada comercial poderá determinar o que um cliente contratou, mas não deverá contornar as políticas de segurança e autorização do Kernel.

---

## 14. Entitlements

O futuro sistema comercial deverá permitir transformar condições comerciais em entitlements controláveis.

Exemplos:

- módulos disponíveis;
- quantidade de operações;
- quantidade de usuários;
- armazenamento;
- capacidade de processamento;
- recursos forenses;
- APIs;
- retenção;
- nível de auditoria;
- suporte;
- SLA.

Entitlements deverão ser avaliados por uma camada própria e permanecer subordinados à autorização e às políticas de segurança.

---

## 15. Pessoa Física

Não fica estabelecida restrição arquitetural que impeça clientes pessoa física.

A entrada de pessoa física deverá ser avaliada individualmente conforme:

- produto;
- risco;
- complexidade;
- preço;
- suporte;
- compliance;
- proteção de dados;
- modelo de negócio.

Produtos de menor complexidade poderão ser adequados ao consumidor final, enquanto módulos de alto risco, como funcionalidades forenses especializadas, poderão permanecer prioritariamente orientados a profissionais e organizações.

---

## 16. Pessoa Jurídica / Enterprise

O modelo corporativo permanece como eixo prioritário para funcionalidades de maior complexidade.

A arquitetura deverá suportar:

- organizações;
- múltiplos usuários;
- RBAC;
- ABAC;
- MFA;
- auditoria;
- políticas;
- contratos;
- planos corporativos;
- limites;
- billing;
- múltiplos projetos;
- múltiplos módulos;
- integração empresarial.

---

## 17. Compliance e Jurisdição

Nenhuma arquitetura comercial deverá ser implementada presumindo que uma regra de determinado país seja universal.

Antes da ativação comercial em uma nova jurisdição deverão ser avaliados, conforme aplicável:

- legislação local;
- tributação;
- proteção de dados;
- consumerismo;
- pagamentos;
- faturamento;
- retenção de dados;
- requisitos de segurança;
- requisitos específicos do setor;
- requisitos judiciais ou regulatórios.

---

## 18. Estratégia de Provedores

A startup poderá utilizar diferentes provedores de pagamento no Brasil, Estados Unidos e demais países.

A seleção deverá considerar custo-benefício e não somente popularidade.

Critérios mínimos:

- custo por transação;
- mensalidades;
- recorrência;
- cobertura geográfica;
- moedas;
- PIX;
- cartões;
- antifraude;
- chargeback;
- split;
- marketplace;
- APIs;
- webhooks;
- reconciliação;
- suporte;
- compliance;
- escalabilidade.

A escolha definitiva de provedores será realizada em fase comercial própria.

---

## 19. Decisão sobre Implementação

Esta ADR NÃO autoriza implementação imediata de:

- gateway de pagamento;
- cobrança;
- assinatura;
- split;
- marketplace financeiro;
- integração bancária;
- tributação automatizada;
- billing definitivo.

Neste momento fica congelada apenas a arquitetura e a estratégia.

A implementação será aberta posteriormente mediante nova fase formal do Surgical DevOps.

---

## 20. Princípio Fundamental

O Surgical Kernel deverá ser construído como infraestrutura governada e independente do mecanismo comercial.

A monetização poderá evoluir.

Os meios de pagamento poderão mudar.

Os provedores poderão mudar.

Os países poderão possuir regras diferentes.

Os canais de distribuição poderão mudar.

O núcleo determinístico, de governança, identidade, autorização, auditoria e execução deverá permanecer estável e protegido dessas mudanças.

---

## 21. Estado da Decisão

**STATUS: APPROVED / FROZEN**

Esta decisão passa a constituir referência arquitetural para futuras fases de:

- monetização;
- billing;
- pagamentos;
- SaaS;
- marketplace;
- distribuição;
- integração com ChatGPT;
- expansão internacional;
- Surgical Kernel Forense.

Nenhuma implementação comercial deverá ser iniciada sem abertura de fase específica e validação correspondente.

