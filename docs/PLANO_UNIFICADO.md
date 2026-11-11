# FleetMind AI

**Inteligência artificial aplicada à eficiência operacional de frotas rodoviárias de cargas no Brasil**

Plano de inovação empresarial aplicada — versão integral de trabalho
NOVA SBE | ITL — Programa de Pós-Graduação em Inovação | 2026
Autoria: a preencher | Orientação: a preencher

> Documento unificado do projeto **PBL – FleetMind IA**, compilado em 11/11/2026 a partir do *Plano Estruturado FleetMind* (.docx) e do contexto do projeto já registrado.

---

## 0. Contexto do projeto PBL

- **Projeto:** FleetMind AI — trabalho em grupo feito em aula presencial sobre a transformação no transporte e logística (nov/2026).
- **Protótipo:** app em Streamlit (registrado como o formato do projeto do grupo; sem especificações técnicas adicionais disponíveis neste histórico).
- **Plano de referência:** este documento (60 páginas previstas, com distribuição por seção na tabela abaixo).
- **Fontes consolidadas:** (1) Plano_Estruturado_FleetMind.docx; (2) contexto do projeto guardado no histórico. O projeto "PBL – FleetMind IA" ainda não tinha documentos anexados e não foram encontrados outros arquivos do FleetMind no histórico acessível — se houver apresentação, código do app ou notas do grupo, basta enviar que incorporo.

### Observações de normalização feitas na compilação

- A numeração do .docx original estava inconsistente (sumário com "4. Diagnóstico" repetido, subseções "1.x/2.x/…" dentro de capítulos 3–9). Renumerei de forma contínua: capítulos 3–9 e subseções correspondentes (ex.: 3.1, 4.1, 7.2.1).
- A tabela de distribuição de páginas veio invertida na conversão e foi reconstruída abaixo.
- Corrigida a grafia "multiforncedor" → "multifornecedor". Nenhum conteúdo foi alterado além disso.

---

## Plano editorial — distribuição de páginas

| Nº | Seção | Páginas | Conteúdo |
|----|-------|--------:|----------|
| 1 | Capa e identificação institucional | 2 | título, instituição, curso, autoria, orientação, local e ano |
| 2 | Elementos pré-textuais | 5 | resumo, abstract, palavras-chave, sumário, listas de tabelas, figuras e siglas quando aplicáveis |
| 3 | Abertura | 4 | contexto setorial, problema prático, pergunta de pesquisa, objetivos, justificativa e delimitação |
| 4 | Fundamentação conceitual | 12 | transporte rodoviário brasileiro, estrutura de custos, gestão por exceção, IA, APIs, LGPD, inovação e literatura |
| 5 | Metodologia | 4 | abordagem, amostra, entrevistas, fontes, indicadores, análise e limitações |
| 6 | Análise e diagnóstico | 13 | entrevistas, dados secundários, processos, dores, concorrentes, benchmarking, matriz de priorização e achados |
| 7 | Proposta de solução e projeção | 12 | arquitetura, MVP, modelo de negócio, SaaS e success fee, custos, ROI, riscos e implantação |
| 8 | Considerações finais | 3 | resposta à pergunta, recomendações, limitações e próximos passos |
| 9 | Referências e apêndices | 5 | bibliografia conferida, roteiro de entrevistas, checklist de API, indicadores e regras de auditoria |
| | **TOTAL** | **60** | |

Meta sujeita à extensão real das evidências e à diagramação final; a tabela define metas por seção, não páginas já preenchidas. As seções de diagnóstico, literatura e validação precisam ser aprofundadas com fontes e dados reais para atingir a extensão acadêmica de forma substantiva.

---

## Nota metodológica e status do projeto

Este documento é uma versão integral estruturada para desenvolvimento acadêmico e discussão empresarial. O FleetMind AI é uma proposta em estágio de concepção; não se afirma que a plataforma esteja implantada, que entrevistas tenham sido realizadas, que integrações estejam contratadas ou que economias tenham sido observadas. Números comerciais são hipóteses de modelagem e devem ser validados. As seções de pesquisa empírica indicam protocolos e resultados esperados, sem simular evidências inexistentes.

## 2. Elementos pré-textuais

### Resumo

O presente plano investiga a oportunidade de aplicação de inteligência artificial sobre dados já disponíveis em transportadoras rodoviárias brasileiras de médio e grande porte. Parte-se da hipótese de que informações operacionais distribuídas entre plataformas de rastreamento, telemetria, manutenção e sistemas de gestão não são convertidas, com a velocidade e consistência necessárias, em decisões de redução de desperdícios. Propõe-se o FleetMind AI como camada de inteligência integrada via APIs, sem comercialização de hardware, capaz de identificar anomalias, priorizar eventos e recomendar intervenções gerenciais. O estudo combina revisão documental, pesquisa aplicada planejada, benchmarking, arquitetura conceitual, modelo de negócio SaaS e success fee e análise de cenários. A viabilidade depende da qualidade dos dados, do acesso às APIs, da precisão dos alertas, do custo de servir e da comprovação de economias incrementais. Recomenda-se um piloto controlado antes de expansão comercial.

**Palavras-chave:** transporte rodoviário de cargas; inteligência artificial; gestão de frotas; inovação; eficiência operacional; SaaS; remuneração por desempenho.

### Abstract

This applied business innovation plan examines the opportunity to use artificial intelligence on operational data already available to medium and large Brazilian road freight carriers. It proposes FleetMind AI as an API-connected intelligence layer, without supplying telematics or camera hardware, to detect operational anomalies, prioritize critical events and recommend managerial actions. The plan combines conceptual grounding, a field research protocol, competitive benchmarking, solution architecture, SaaS and performance-based pricing, and scenario-based feasibility assessment. All economic results are illustrative assumptions, not observed outcomes. A controlled pilot is recommended to validate technical integration, user adoption, unit economics and attributable savings.

### Sumário

- 3. Abertura do trabalho — introdução e problema de investigação
- 4. Fundamentação conceitual e contexto setorial
- 5. Metodologia de pesquisa aplicada
- 6. Análise e diagnóstico de mercado
- 7. Proposta de solução e projeção — FleetMind AI
  - 7.1 A solução FleetMind AI
  - 7.2 Modelo de negócio e viabilidade econômico-financeira
  - 7.3 Plano de implementação e validação
  - 7.4 Governança, riscos e conformidade
- 8. Considerações finais
- 9. Referências e apêndices (Apêndices A–F: entrevistas, integração, indicadores, benchmarking, success fee, evidências)

---

## 3. Abertura do trabalho — Introdução e problema de investigação

O transporte rodoviário de cargas sustenta fluxos produtivos, comerciais e de abastecimento no Brasil. A gestão de frotas enfrenta pressões simultâneas por eficiência, segurança, confiabilidade das entregas e controle de custos. A digitalização multiplicou a disponibilidade de dados, mas o valor econômico depende da capacidade de converter sinais em decisões concretas.

### 3.1 Contexto e oportunidade

Transportadoras podem utilizar, simultaneamente, plataformas de localização, telemetria, gestão de manutenção, abastecimento, TMS, ERP e sistemas de segurança. Esses instrumentos foram adquiridos para necessidades específicas e nem sempre oferecem uma visão integrada orientada à ação. A coexistência de múltiplos sistemas não comprova, por si só, fragmentação prejudicial; essa condição deve ser testada com usuários e processos reais.

A hipótese empresarial é que uma camada adicional de interpretação e priorização possa gerar mais valor que a aquisição de outro sistema transacional. O FleetMind pretende conectar-se às soluções existentes via interfaces autorizadas e produzir recomendações rastreáveis.

### 3.2 Problema prático

Problema proposto: gestores de grandes frotas podem enfrentar dificuldade para identificar, priorizar e corrigir desperdícios operacionais em tempo hábil, apesar da disponibilidade de dados em sistemas distintos.

O problema deve ser operacionalizado em perguntas mensuráveis: quanto tempo decorre entre o evento e sua identificação? Quantos alertas exigem intervenção? Quantas anomalias são tratadas? Qual o custo associado? Como se comprova que a ação recomendada alterou o resultado?

### 3.3 Questão de investigação

Como uma camada de inteligência artificial integrada por APIs aos sistemas existentes pode apoiar a redução de custos operacionais e a qualidade da decisão em transportadoras rodoviárias de médio e grande porte no Brasil?

### 3.4 Objetivo geral

Avaliar a viabilidade técnica, operacional, comercial e econômico-financeira de uma solução de inteligência artificial para identificar anomalias, priorizar oportunidades de redução de custos e recomendar ações na gestão de grandes frotas rodoviárias.

### 3.5 Objetivos específicos

Mapear os fluxos de dados e as principais decisões de gestão; identificar dores prioritárias e disposição a pagar; comparar alternativas tecnológicas e comerciais; delimitar um MVP viável; definir métricas de avaliação e desenho de piloto; estimar custos, receitas e sensibilidade da viabilidade; propor governança e roadmap de implementação.

### 3.6 Delimitações

O estudo concentra-se no transporte rodoviário de cargas e em empresas com operações de frota relevantes. Não abrange desenvolvimento de ERP/TMS, venda de hardware, instalação de câmeras, substituição de rastreadores, direção autônoma ou decisão automatizada em situações críticas. Copiloto de voz ao motorista e inteligência colaborativa entre transportadoras ficam em fases futuras.

### 3.7 Hipóteses de trabalho

H1: a consolidação de eventos de múltiplos sistemas reduz o tempo de identificação de anomalias relevantes. H2: alertas priorizados elevam a taxa de tratamento de ocorrências. H3: intervenções baseadas em evidências podem gerar economia incremental mensurável em categorias selecionadas. H4: o custo variável por veículo permite precificação SaaS escalável. Nenhuma hipótese deve ser considerada confirmada antes do piloto.

## 4. Fundamentação conceitual e contexto setorial

A fundamentação combina economia dos transportes, gestão operacional, arquitetura de dados e adoção de inteligência artificial. O objetivo não é demonstrar que IA é intrinsecamente superior, mas definir em quais processos sua utilização agrega valor verificável.

### 4.1 Transporte rodoviário brasileiro

A relevância do modal rodoviário para a logística brasileira e suas diferenças regionais devem ser contextualizadas com séries e levantamentos oficiais atualizados. Entre as fontes prioritárias estão a ANTT, o IBGE e a CNT. Indicadores como frota registrada, perfil empresarial, intensidade de utilização e custos operacionais precisam ser extraídos com período, definição e metodologia explícitos.

Evita-se empregar percentuais setoriais genéricos sem fonte, porque a composição de custos varia por carga, distância, tipo de veículo, regime de contratação, rota e estrutura de manutenção.

### 4.2 Custos e eficiência operacional

O custo total de operação pode ser decomposto em combustível, pneus, manutenção, pessoal, pedágios, seguros, depreciação, financiamento, tributos e custos administrativos. Para o MVP, é recomendável selecionar categorias com registros confiáveis e decisões gerenciais acionáveis.

Uma anomalia de consumo só é interpretável após controlar carga, percurso, relevo, congestionamento, sazonalidade e perfil do veículo. Uma comparação simples entre motoristas pode produzir conclusões injustas e recomendações ineficazes.

### 4.3 Digitalização e integração de sistemas

GPS e telemetria produzem observações; TMS e ERP contextualizam viagens, ordens, entregas e custos; sistemas de manutenção registram intervenções e falhas. O desafio tecnológico é criar chaves de associação, normalizar horários, tratar qualidade de dados e estabelecer governança de acesso.

O desenho asset-light reduz investimento físico, mas não elimina custos de integração, licenciamento de APIs, ingestão, armazenamento mínimo, processamento, segurança e suporte.

### 4.4 Inteligência artificial como apoio à decisão

O uso de IA pode combinar regras de negócio, estatística, detecção de anomalias, modelos preditivos e modelos de linguagem para explicar evidências. Não é necessário utilizar modelos generativos em toda operação: verificações determinísticas e algoritmos leves podem ser mais econômicos, auditáveis e robustos.

Modelos generativos são úteis para consultas em linguagem natural e sínteses, mas devem operar sobre dados autorizados e apresentar evidências, incertezas e limites. Recomendações de alto impacto exigem validação humana.

### 4.5 Gestão por exceção

A gestão por exceção prioriza desvios que merecem intervenção, em vez de exigir acompanhamento contínuo de todos os indicadores. Um sistema útil deve ordenar eventos por impacto potencial, urgência, confiança e capacidade de ação. O sucesso não é medido pela quantidade de alertas emitidos, mas pelo número de problemas relevantes tratados com eficácia.

### 4.6 Inovação e vantagem competitiva

A inovação proposta é predominantemente de processo e modelo de negócio: reaproveitar infraestrutura informacional existente, inserir uma camada analítica e monetizar valor de gestão. A vantagem competitiva potencial depende de conectores reutilizáveis, qualidade das recomendações, experiência do gestor, velocidade de implantação e capacidade de provar retorno.

### 4.7 Barreiras de adoção

Principais barreiras: resistência a mais uma plataforma, dificuldade de integração, dados incompletos, receio de uso punitivo de informações, falsos positivos, sobrecarga de notificações e percepção de ROI insuficiente. A proposta deve mostrar complementaridade às ferramentas existentes, não sugerir que os investimentos anteriores foram inúteis.

### 4.8 Segurança, privacidade e responsabilidade

A Lei Geral de Proteção de Dados exige avaliação de finalidade, necessidade, base legal, transparência, controles de acesso, segurança e responsabilidades entre agentes de tratamento. Dados de motoristas podem ser pessoais; a solução não deve presumir autorização irrestrita para seu uso. A arquitetura deve prever minimização, retenção definida, segregação entre clientes e rastreabilidade de decisões.

## 5. Metodologia de pesquisa aplicada

A investigação deve seguir abordagem aplicada, exploratória e descritiva, combinando dados secundários, entrevistas semiestruturadas, análise de processos e modelagem de viabilidade. Este capítulo especifica o método proposto; não relata trabalho de campo ainda não realizado.

### 5.1 Desenho da pesquisa

Etapa documental: coletar estatísticas setoriais, custos e tendências com metadados de fonte e data. Etapa qualitativa: entrevistar gestores e especialistas para mapear decisões e dores. Etapa comparativa: avaliar concorrentes e alternativas de integração. Etapa experimental: piloto com linha de base e indicadores predefinidos. Etapa econômica: testar cenários e sensibilidade de preços e custos.

### 5.2 População e amostragem

A população-alvo são transportadoras rodoviárias brasileiras de médio e grande porte, especialmente frotas a partir de aproximadamente 100 veículos. Como plano de pesquisa, recomenda-se amostragem intencional de 8 a 15 entrevistas com gestores de operações, manutenção, controladoria e TI, distribuídas entre diferentes perfis de operação. Essa faixa é proposta metodológica, não amostra efetivamente alcançada.

### 5.3 Instrumentos de coleta

Roteiro de entrevista no Apêndice A; checklist de sistemas e integrações no Apêndice B; formulário de indicadores e linha de base no Apêndice C; matriz de benchmarking no Apêndice D. As entrevistas devem ser registradas com consentimento e sem exposição de informações comerciais sensíveis.

### 5.4 Tratamento dos dados

A análise qualitativa pode agrupar falas por tema: custo, risco, informação, integração, confiança e adoção. A análise quantitativa deve calcular medidas normalizadas por quilometragem, veículo ativo, viagem ou tonelada-quilômetro quando disponíveis. É necessário separar diferenças de perfil operacional de efeitos potencialmente atribuíveis à plataforma.

### 5.5 Critérios de avaliação

Relevância do problema, frequência, impacto econômico, disponibilidade de dados, capacidade de intervenção, facilidade de integração, custo de servir e disposição a pagar. A decisão de MVP deve priorizar oportunidades com evidência acessível e ação gerencial clara.

### 5.6 Limitações metodológicas

Entrevistas intencionais não representam estatisticamente todo o setor. Estudos antes/depois são vulneráveis a sazonalidade e mudanças operacionais. Atribuição de economias exige contrafactual plausível, preferencialmente grupo de comparação, normalização e registro das intervenções. Resultados não devem ser extrapolados indiscriminadamente.

## 6. Análise e diagnóstico de mercado

O diagnóstico é construído como estrutura analítica a validar em campo. A oportunidade só será confirmada se houver dor relevante, lacuna nas soluções existentes e disposição a pagar por uma camada adicional de inteligência.

### 6.1 Jornada decisória do gestor

Uma ocorrência operacional percorre as etapas de captura, registro, interpretação, priorização, encaminhamento, intervenção e verificação. O FleetMind deve concentrar-se nas transições em que o processo atual é lento ou dependente de análise manual. Cada etapa pode ser medida por tempo, taxa de erro, retrabalho e custo.

### 6.2 Mapa de dores candidatas

D1: desperdícios de combustível não identificados em tempo útil. D2: reincidência de eventos de condução e operação sem ação corretiva. D3: falhas recorrentes de manutenção detectadas tardiamente. D4: excesso de alertas com baixa priorização. D5: esforço manual para consolidar indicadores de múltiplas plataformas.

A seleção final não deve partir apenas da atratividade narrativa: cada dor precisa de frequência, impacto, disponibilidade de dados e intervenção verificável.

### 6.3 Segmentação do mercado

Segmento prioritário: transportadoras com 100 a 2.000 veículos e maturidade digital suficiente para permitir integração via API. Grandes grupos com mais de 2.000 veículos podem oferecer escala, mas tendem a demandar requisitos adicionais de segurança, governança e compras corporativas. A segmentação por tamanho deve ser cruzada com tipo de operação e sistemas instalados.

### 6.4 Cliente, usuário e influenciadores

Cliente contratante: transportadora. Comprador econômico: diretoria de operações, finanças ou tecnologia. Usuário principal do MVP: gestor de frota e equipe de controle. Influenciadores: manutenção, segurança, TI, jurídico e controladoria. Motoristas são afetados pelo tratamento de dados, mesmo sem interface própria no MVP.

### 6.5 Concorrência e alternativas

As alternativas incluem sistemas de rastreamento, telemetria, vídeo, gestão de manutenção, BI, TMS e módulos analíticos oferecidos por fornecedores existentes. A análise competitiva precisa verificar quais já oferecem priorização inteligente e recomendações, evitando posicionar o FleetMind sobre uma lacuna não demonstrada.

O benchmarking deverá avaliar preço efetivo, escopo, API, interoperabilidade, recursos de IA, SLAs, suporte e requisitos de implantação. Nomes e preços de concorrentes devem ser preenchidos após pesquisa documental validada.

### 6.6 Matriz de priorização

Critérios sugeridos com pesos: impacto econômico 30%; disponibilidade/qualidade dos dados 25%; possibilidade de ação 20%; facilidade de integração 15%; tempo de demonstração de valor 10%. Esses pesos são hipóteses de gestão e devem ser discutidos com especialistas e usuários.

### 6.7 Diagnóstico preliminar e decisão

Hipótese de posicionamento: 'menos desperdício e melhores decisões com os dados que a frota já produz'. O benefício primário deve ser econômico e demonstrável; segurança e produtividade gerencial podem funcionar como benefícios associados. A decisão de avançar dependerá de entrevistas e dados de piloto.

### 6.8 Quadro de priorização inicial — sujeito a validação

| Oportunidade                | Valor potencial           | Complexidade | Decisão inicial               |
|-----------------------------|---------------------------|--------------|-------------------------------|
| Anomalias de combustível    | Alto, se dados confiáveis | Média        | Priorizar diagnóstico         |
| Alertas de condução         | Médio/alto                | Média        | Priorizar eventos disponíveis |
| Manutenção preditiva ampla  | Potencial alto            | Alta         | Fase posterior                |
| Copiloto de voz             | Valor indireto            | Alta         | Fora do MVP                   |
| Torre de controle analítica | Transversal               | Média        | Núcleo do MVP                 |

## 7. Proposta de solução e projeção — FleetMind AI

### 7.1 A solução FleetMind AI

O FleetMind AI é concebido como software de inteligência operacional que se conecta aos sistemas existentes. Não comercializa câmeras, rastreadores ou sensores. Sua unidade central de valor é a recomendação gerencial baseada em evidências.

#### 7.1.1 Proposta de valor

Para transportadoras com grandes frotas que possuem múltiplos sistemas, o FleetMind identifica e prioriza anomalias operacionais e recomenda ações para reduzir desperdícios. Diferentemente de um painel meramente descritivo, pretende ligar evento, contexto, impacto potencial e ação sugerida, preservando a decisão humana.

#### 7.1.2 Escopo mínimo viável

Módulo 1: conectores autorizados para fontes prioritárias. Módulo 2: normalização de veículos, eventos e períodos. Módulo 3: regras e modelos simples de detecção de anomalias. Módulo 4: fila de oportunidades com impacto estimado e explicação. Módulo 5: interface de consulta gerencial e registro de ações. Módulo 6: relatório de resultados e auditoria.

#### 7.1.3 Arquitetura lógica

Camada de origem: telemetria, rastreamento, TMS/ERP e manutenção do cliente. Camada de integração: APIs, autenticação, webhooks ou sincronização autorizada. Camada de qualidade: padronização, deduplicação, chaves de veículo e horários. Camada analítica: regras, indicadores, anomalias e classificação. Camada de experiência: fila de eventos, copiloto do gestor e relatórios. Camada transversal: segurança, observabilidade, auditoria e governança.

#### 7.1.4 Exemplo de fluxo de decisão

Um veículo apresenta consumo acima do esperado para rota e carga comparáveis. O sistema identifica o desvio, verifica disponibilidade de dados, calcula confiança e potencial impacto, associa eventos relevantes e apresenta hipótese explicativa ao gestor. O gestor valida a ocorrência, define ação e registra resultado. A economia somente pode ser atribuída se houver medição posterior consistente e comparação adequada.

#### 7.1.5 Princípios de experiência

Exibir poucos eventos realmente relevantes; explicitar por que cada alerta foi emitido; mostrar dados de suporte; indicar incerteza; permitir ignorar ou corrigir falsos positivos; registrar ações e desfechos; permitir filtros por operação e período. O produto não deve exigir acompanhamento de uma nova tela durante toda a jornada.

#### 7.1.6 Estratégia de IA de baixo custo

Usar regras e estatística para triagem contínua, modelos preditivos apenas onde haja dados suficientes e IA generativa sob demanda para explicações e consultas. Adotar limites de uso, cache, processamento incremental, sumarização de eventos e políticas de retenção. Não ingerir vídeo bruto continuamente; preferir metadados e eventos disponibilizados pelas soluções existentes.

#### 7.1.7 Dependências técnicas

O acesso a dados depende de APIs documentadas, contratos de fornecedores, autenticação, limites de requisição, formatos, histórico disponível e autorização do cliente. Sistemas sem integração viável podem exigir adaptação de escopo. A proposta não deve prometer compatibilidade universal.

#### 7.1.8 Diferenciais a testar

Integração multifornecedor; priorização orientada a economia; explicabilidade; registro de intervenção e resultado; implementação sem hardware novo; preços escalonados; eventual success fee vinculado à economia comprovada. Esses diferenciais são hipóteses competitivas até que benchmarking e entrevistas os confirmem.

#### 7.1.9 Roadmap funcional

Fase 1: conectores, anomalias, alertas e copiloto do gestor. Fase 2: ampliação de categorias de custo, modelos preditivos calibrados e integrações adicionais. Fase 3: recursos ao motorista, inteligência agregada entre clientes mediante governança e novas funcionalidades de planejamento. O roadmap depende de resultados e não constitui compromisso de entrega.

### 7.2 Modelo de negócio e viabilidade econômico-financeira

A viabilidade comercial depende de preço competitivo para grandes frotas e margem de contribuição suficiente para sustentar infraestrutura, suporte e desenvolvimento. A proposta prevê SaaS escalonado e modelo híbrido com remuneração variável por resultados auditáveis.

#### 7.2.1 Estrutura de monetização

Modelo A — SaaS puro: preço mensal por veículo ativo, com funcionalidades-base padronizadas. Modelo B — SaaS híbrido: mensalidade-base reduzida e success fee sobre economia incremental comprovada e atribuível. Modelo C — Enterprise: contrato com volume mínimo, SLA, governança e escopo negociados. As três modalidades não devem ser somadas para a mesma contratação.

#### 7.2.2 Tabela progressiva de referência

A política indicativa para SaaS puro é R$ 49,90 por veículo/mês em 100 veículos; R$ 39,90 em 250; R$ 34,90 em 500; R$ 29,90 em 1.000; R$ 24,90 em 2.000; e R$ 19,90 em 5.000. São hipóteses de preço e não valores de mercado validados. A tabela pressupõe pacote-base padronizado e pode exigir compromissos mínimos de volume.

#### 7.2.3 Implantação e conectores

Taxa ilustrativa: R$ 3.000 para 100 veículos, R$ 4.000 para 250, R$ 5.000 para 500 e R$ 7.500 para 1.000. Acima disso, orçamento conforme complexidade. A lógica é cobrar por esforço de integração, não linearmente por equipamento. Conectores inéditos, APIs pagas e personalizações exigem orçamento específico.

#### 7.2.4 Success fee e condições de elegibilidade

Referência de 15% sobre economia incremental verificada, com faixa negociável de 10% a 20%. O pagamento exige definição contratual de categorias elegíveis, linha de base, normalização por operação, atribuição causal razoável, evidências, periodicidade, contestação e auditoria. Deve-se excluir economias já contratadas, fatores externos e ganhos não comprovados. Não existe success fee sobre economia meramente projetada.

#### 7.2.5 Receita e margem

Receita recorrente mensal = número de veículos faturáveis × tarifa contratada. Receita variável = percentual × economia elegível validada. Margem de contribuição do contrato = receita menos custos variáveis e custos diretos alocados. Resultado operacional depende ainda de despesas corporativas, tributos e investimento em produto.

#### 7.2.6 Custos relevantes

Infraestrutura em nuvem, ingestão e armazenamento mínimo, inferência de IA, APIs de terceiros, conectividade própria do software, observabilidade, segurança, suporte, implantação, Customer Success e evolução de conectores. Não incluir aquisição ou manutenção de rastreadores e câmeras, pois são ativos do cliente ou de fornecedores contratados.

#### 7.2.7 Cenários e sensibilidade

Modelar pelo menos três cenários: conservador com baixa economia comprovada e custo unitário elevado; base com adoção e integração estáveis; otimista com economia maior e menor custo por veículo. Sensibilizar quantidade de veículos, preço, custo variável, tarifa de API, custo fixo alocado, taxa de adoção e percentual de economia elegível.

#### 7.2.8 Unidade econômica e escala

Os preços reduzidos só são sustentáveis se conectores e rotinas analíticas forem reutilizáveis, a maior parte dos processos for automatizada e os custos de IA forem monitorados. Métricas: custo de servir por veículo, margem por cliente, CAC, LTV, churn, payback, ticket por contrato e custo de implantação recuperado.

#### 7.2.9 Condições comerciais

Sugerem-se contratos de 12 a 24 meses com mínimo de veículos, definição de veículo ativo, regras de entrada e saída da frota, SLA e tratamento de APIs de terceiros. Descontos por volume não devem eliminar margem. A cobrança de success fee deve ser separada, documentada e auditável.

#### Tabela de cenários SaaS puro — hipóteses

| Veículos | R$/veículo/mês | MRR           | ARR              | Setup         |
|----------|-----------------|---------------|------------------|---------------|
| 100      | R$ 49,90       | R$ 4.990,00  | R$ 59.880,00    | R$ 3.000,00  |
| 250      | R$ 39,90       | R$ 9.975,00  | R$ 119.700,00   | R$ 4.000,00  |
| 500      | R$ 34,90       | R$ 17.450,00 | R$ 209.400,00   | R$ 5.000,00  |
| 1000     | R$ 29,90       | R$ 29.900,00 | R$ 358.800,00   | R$ 7.500,00  |
| 2000     | R$ 24,90       | R$ 49.800,00 | R$ 597.600,00   | Sob orçamento |
| 5000     | R$ 19,90       | R$ 99.500,00 | R$ 1.194.000,00 | Sob orçamento |

#### Exemplo de 1.000 veículos — SaaS e success fee

SaaS puro: 1.000 × R$ 29,90 = R$ 29.900 mensais; R$ 358.800 anuais; setup indicativo de R$ 7.500. Se o cliente obtivesse economia incremental comprovada de R$ 100 por veículo/mês, a economia bruta seria R$ 100.000 mensais. Em uma alternativa híbrida, a mensalidade-base precisaria ser negociada separadamente; um success fee de 15% sobre essa economia elegível seria R$ 15.000/mês. Esse valor é ilustração matemática, não previsão de receita ou de resultado.

#### Fórmulas de avaliação

- Economia bruta elegível = custo contrafactual normalizado − custo observado ajustado.

- Success fee = percentual contratado × economia incremental elegível aprovada.

- Benefício líquido do cliente = economia elegível − mensalidades SaaS − success fee − implantação e outros custos do cliente.

- ROI do cliente = benefício líquido / investimento total do cliente, no período definido.

- Margem de contribuição = (receita − custos diretos variáveis e alocados) / receita.

### 7.3 Plano de implementação e validação

O plano recomenda uma implantação em etapas, com decisões de continuidade condicionadas a evidências técnicas, operacionais e financeiras.

#### 7.3.1 Fase zero — descoberta e seleção

Conduzir entrevistas, inventariar sistemas, definir categorias de custo, confirmar direitos de acesso e selecionar uma transportadora parceira. Critérios de entrada: patrocinador executivo, equipe operacional disponível, dados históricos suficientes e disposição para registrar intervenções.

#### 7.3.2 Fase um — arquitetura e integração

Mapear fornecedores, endpoints, limites e formatos; construir conectores mínimos; testar qualidade, latência, integridade e reconciliação de dados. Definir segurança, segregação de clientes, credenciais, logs e contingência para indisponibilidade de API.

#### 7.3.3 Fase dois — piloto controlado

Propor 20 a 50 veículos durante 90 a 120 dias, com baseline histórico e, se possível, grupo comparável sem intervenção. Selecionar poucas anomalias acionáveis e registrar alertas, recomendações, ações, custos e resultados. A escolha de tamanho e prazo deve ser confirmada por análise de poder estatístico e variabilidade operacional quando pertinente.

#### 7.3.4 Fase três — avaliação

Avaliar qualidade dos dados, precisão e utilidade dos alertas, taxa de adoção, custo de servir, tempo de resposta e economia elegível. Separar ganho atribuível de sazonalidade, troca de rota, renovação de frota, política de abastecimento ou outras iniciativas.

#### 7.3.5 Fase quatro — expansão

Escalar para novos veículos e clientes somente após atingir critérios mínimos de segurança, integração, satisfação, contribuição econômica e resultado operacional. Priorizar conectores de maior demanda e evitar customização excessiva.

#### 7.3.6 Critérios de decisão go/no-go

Exemplo de critérios a pactuar: estabilidade das APIs, qualidade de dados adequada, alertas acionáveis aceitos pelos gestores, custo por veículo compatível com preço e método de mensuração auditável. Limiares quantitativos devem ser definidos antes do piloto, não depois da observação dos resultados.

#### Cronograma indicativo

| Período       | Entregas                                      | Marco de decisão                 |
|---------------|-----------------------------------------------|----------------------------------|
| Semanas 1–3   | Descoberta, entrevistas, diagnóstico de dados | Problema e escopo confirmados    |
| Semanas 4–7   | Conectores, segurança, métricas e testes      | Integração tecnicamente viável   |
| Semanas 8–19  | Piloto controlado e acompanhamento            | Dados suficientes para avaliação |
| Semanas 20–22 | Avaliação, revisão econômica e relatório      | Escalar, ajustar ou encerrar     |

### 7.4 Governança, riscos e conformidade

A proposta exige controles proporcionais à criticidade dos dados e à influência das recomendações sobre pessoas e operações.

#### 7.4.1 Matriz de riscos

Risco técnico: indisponibilidade ou restrição de APIs. Mitigação: diagnóstico prévio, conectores versionados e fallback. Risco analítico: falsos positivos e vieses. Mitigação: validação humana, monitoramento de qualidade e revisão de regras. Risco econômico: custo de IA acima do preço. Mitigação: limites de uso e modelos leves. Risco comercial: baixa disposição a pagar. Mitigação: entrevistas e piloto. Risco jurídico: tratamento inadequado de dados pessoais. Mitigação: avaliação LGPD, contratos e políticas.

#### 7.4.2 Governança de dados

Inventariar dados e finalidades; classificar informações pessoais e empresariais; limitar acessos por perfil; definir retenção; criptografar trânsito e armazenamento; manter logs; documentar incidentes; estabelecer responsabilidades entre transportadora, FleetMind e fornecedores. Compartilhamento entre clientes exige avaliação jurídica específica e não é premissa do MVP.

#### 7.4.3 Governança de modelos

Registrar versão, dados de entrada, lógica de priorização, indicadores de desempenho, taxa de falsos positivos e mudanças de modelo. Explicações geradas por IA devem indicar evidências de origem e não criar fatos ausentes. Recomendações devem ter possibilidade de contestação e correção.

#### 7.4.4 Gestão de mudanças

Treinar gestores no uso das recomendações, explicar o que o sistema faz e não faz, definir quem responde por cada tipo de evento e monitorar adoção. A comunicação deve evitar linguagem de vigilância punitiva. A melhoria operacional depende da execução das ações recomendadas.

#### 7.4.5 Contratos e responsabilidade

Prever SLA, limites de responsabilidade, segurança, tratamento de dados, disponibilidade das APIs, mudanças de fornecedores, propriedade intelectual, auditoria de economia, pagamento de success fee e resolução de divergências. O instrumento contratual deve ser elaborado por assessoria jurídica.

#### 7.4.6 Sustentabilidade e efeitos indiretos

Economias de combustível podem ter efeitos ambientais, mas redução de emissões só deve ser quantificada com metodologia apropriada, fatores de emissão identificados e dados verificáveis. Não apresentar resultados ESG como alcançados antes de medição.

## 8. Considerações finais

O FleetMind AI apresenta uma oportunidade de inovação aplicada ao transporte rodoviário de cargas, desde que o projeto permaneça delimitado à transformação de dados existentes em decisões gerenciais capazes de reduzir desperdícios. O valor não reside em coletar mais informações, mas em identificar eventos relevantes, explicar sua importância, orientar intervenções e medir os resultados.

### 8.1 Síntese

A hipótese de negócio é plausível: transportadoras com infraestrutura digital instalada podem se beneficiar de integração analítica. Contudo, plausibilidade não equivale a demanda comprovada. O projeto precisa validar a existência da dor, a insuficiência das alternativas atuais e a capacidade de entregar retorno superior ao custo.

### 8.2 Recomendação executiva

Avançar com descoberta de clientes e piloto limitado, priorizando anomalias de custo operacional e produtividade decisória. Manter arquitetura asset-light, preço SaaS escalonado e success fee condicionado à comprovação. Não iniciar desenvolvimento de múltiplos módulos complexos antes da validação do núcleo.

### 8.3 Limitações

Este documento não contém resultados de entrevistas, benchmarking competitivo concluído, testes de integração ou dados de economia observada. As tabelas financeiras são hipóteses. A versão final acadêmica deverá incorporar evidências primárias e secundárias verificadas, análise crítica dos resultados e referências bibliográficas completas.

### 8.4 Contribuição esperada

O projeto pode contribuir com um modelo replicável de avaliação de soluções de IA em transportadoras, articulando diagnóstico operacional, integração tecnológica, mensuração de impacto e monetização baseada em resultados. A decisão empresarial recomendada é investir progressivamente, condicionado a marcos verificáveis.

## 9. Referências e apêndices

As fontes abaixo são indicações para pesquisa e conferência na versão acadêmica final. Não se atribuem a elas estatísticas específicas não consultadas neste documento.

- BRASIL. Lei nº 13.709, de 14 de agosto de 2018. Lei Geral de Proteção de Dados Pessoais (LGPD).

- AGÊNCIA NACIONAL DE TRANSPORTES TERRESTRES (ANTT). Portal institucional, registros e publicações sobre transporte rodoviário de cargas. Consultar edição e ano utilizados.

- CONFEDERAÇÃO NACIONAL DO TRANSPORTE (CNT). Pesquisas e estudos sobre transporte e infraestrutura. Consultar publicação e metodologia.

- INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA (IBGE). Estatísticas econômicas e de serviços de transporte. Consultar série e período.

- NIST. AI Risk Management Framework (AI RMF 1.0), 2023. Referência de governança de riscos de IA.

- ISO/IEC 27001:2022. Information security management systems — Requirements.

- OECD. OECD AI Principles. Consultar versão vigente.

- OSTERWALDER, A.; PIGNEUR, Y. Business Model Generation. Wiley, 2010.

- RIES, E. The Lean Startup. Crown Business, 2011.

### Apêndice A — Roteiro de entrevistas com transportadoras

1. Quantos veículos ativos compõem a frota e quais perfis operacionais predominam?

2. Quais sistemas de rastreamento, telemetria, manutenção, ERP e TMS são utilizados?

3. Quais decisões demandam consolidação manual de informações?

4. Quais são os três principais desperdícios operacionais percebidos?

5. Como esses desperdícios são mensurados hoje?

6. Que tipos de alertas são ignorados ou chegam tarde?

7. Quem decide e executa ações corretivas?

8. Que dados históricos e APIs podem ser disponibilizados?

9. Que benefícios justificariam a contratação de uma nova camada analítica?

10. Qual modelo de cobrança seria mais aceitável: SaaS, híbrido ou Enterprise?

11. Quais requisitos de segurança, privacidade e SLA seriam indispensáveis?

12. A empresa participaria de piloto controlado? Em quais condições?

### Apêndice B — Checklist de integração

- Fornecedor e sistema de origem identificados

- Contrato e autorização de acesso aos dados

- Documentação e versão de API disponíveis

- Método de autenticação e renovação de credenciais

- Limites de chamadas, custos e latência

- Campos de veículo, motorista, evento e tempo

- Histórico disponível e granularidade

- Taxa de dados ausentes e inconsistências

- Política de retenção e classificação LGPD

- Responsável técnico e processo de suporte

- Plano de contingência e encerramento de acesso

### Apêndice C — Dicionário de indicadores do piloto

| Indicador            | Definição sugerida                         | Cuidados                        |
|----------------------|--------------------------------------------|---------------------------------|
| Consumo normalizado  | Litros por 100 km ou km/l, conforme perfil | Controlar rota, carga e veículo |
| Custo por km         | Custos elegíveis / km operacional          | Mesma composição de custos      |
| Alertas acionáveis   | Alertas validados / alertas emitidos       | Amostragem e classificação      |
| Tempo de resposta    | Ação registrada − evento identificado      | Horários consistentes           |
| Taxa de resolução    | Ocorrências resolvidas / elegíveis         | Definir encerramento            |
| Economia incremental | Contrafactual − observado ajustado         | Evitar dupla contagem           |
| Custo de servir      | Custo direto do contrato / veículos        | Incluir APIs e IA               |
| Adoção do gestor     | Usuários ativos e ações registradas        | Medir utilidade, não só login   |

### Apêndice D — Matriz de benchmarking

| Dimensão     | Questões para comparação                               |
|--------------|--------------------------------------------------------|
| Cobertura    | Quais dados e eventos a solução contempla?             |
| Integração   | APIs abertas? Integrações com fornecedores locais?     |
| Inteligência | Alertas, anomalias, recomendações e explicabilidade?   |
| Operação     | Fluxos de tratamento, responsáveis e auditoria?        |
| Comercial    | Preço, setup, mínimos, contratos e tarifas adicionais? |
| Segurança    | LGPD, segregação, SLA e certificações?                 |
| Resultados   | Há estudos de caso verificáveis e metodologia de ROI?  |

### Apêndice E — Regras propostas para apuração do success fee

- Definir categoria de economia e custo elegível antes da medição.

- Registrar baseline e período de comparação com dados auditáveis.

- Normalizar variações de quilometragem, rota, carga, frota e sazonalidade.

- Registrar ações concretas relacionadas a alertas do FleetMind.

- Excluir efeitos de iniciativas paralelas não atribuíveis à plataforma.

- Evitar contabilizar o mesmo ganho em duas categorias.

- Estabelecer janela de medição, validação e contestação.

- Aplicar percentual contratual somente à economia incremental aprovada.

- Prever acesso do cliente aos cálculos e documentação de suporte.

- Permitir revisão ou suspensão da métrica se a qualidade dos dados se deteriorar.

### Apêndice F — Matriz de evidências para versão final

| Afirmação                       | Evidência exigida                     | Status   |
|---------------------------------|---------------------------------------|----------|
| Dor de fragmentação é relevante | Entrevistas e mapeamento de processos | Pendente |
| Integração é viável             | Teste de APIs e qualidade de dados    | Pendente |
| Alertas geram ação              | Registro de intervenções no piloto    | Pendente |
| Há economia incremental         | Baseline e comparação ajustada        | Pendente |
| Cliente aceita preço            | Entrevistas comerciais / piloto       | Pendente |
| Margem é sustentável            | Custos medidos de IA, API e suporte   | Pendente |

