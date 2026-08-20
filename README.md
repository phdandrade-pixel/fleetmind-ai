# FleetMind AI — Protótipo (PBL)

**A inteligência que move o transporte.**

Protótipo funcional da plataforma FleetMind AI: gera uma base de dados
sintética de frota, treina modelos preditivos de risco (falha mecânica de
veículos e necessidade de apoio a motoristas) e expõe tudo em um dashboard
interativo com um "Super Agente" de IA para perguntas em linguagem natural.

- **[BUSINESS_MODEL.md](BUSINESS_MODEL.md)** — Business Model Canvas oficial
  (persona, segmentos, receita, parceiros), usado para orientar as decisões
  de produto deste protótipo.
- **[pitch/](pitch/)** — pitch executivo de 5 minutos (deck `.pptx` +
  roteiro/evidências/ROI) para apresentar o FleetMind AI a investidores,
  transportadoras e parceiros.

## Arquitetura

```
FleetMind-AI/
├── data/
│   └── generate_synthetic_data.py   # gera data/fleetmind.db (SQLite)
├── ml/
│   ├── train_predictive_model.py    # treina os modelos (RandomForest)
│   └── models/                      # modelos treinados (.joblib)
├── backend/
│   ├── main.py                      # API FastAPI
│   ├── database.py
│   ├── scoring.py                   # calcula scores de risco em tempo real
│   └── ai_agent.py                  # "Super Agente" de IA (Q&A)
├── frontend/
│   └── app.py                       # Dashboard Streamlit
└── requirements.txt
```

Fluxo de dados: **Telemetria/GPS/Manutenção (sintéticos) → SQLite → Features
agregadas → Modelos preditivos (scikit-learn) → API FastAPI → Dashboard
Streamlit + Copiloto de IA.**

Isso corresponde, em escala de protótipo, à visão do FleetMind AI: integrar
dados de veículos, motoristas e operação em uma única inteligência que
antecipa riscos e recomenda ações.

## Como rodar

### 1) Instalar dependências (uma vez)
```bash
python -m venv venv
./venv/Scripts/pip install -r requirements.txt
```

### 2) Gerar a base sintética
```bash
./venv/Scripts/python data/generate_synthetic_data.py
```
Gera `data/fleetmind.db` com ~120 veículos, ~150 motoristas e ~4.000 viagens,
incluindo telemetria (temperatura de motor, pressão de óleo, vibração,
frenagens bruscas...), clima, trânsito, manutenção e alertas.

### 3) Treinar os modelos preditivos
```bash
./venv/Scripts/python ml/train_predictive_model.py
```
Treina e salva em `ml/models/`:
- `vehicle_failure_risk.joblib` — probabilidade de falha mecânica por veículo
- `driver_support_risk.joblib` — probabilidade de o motorista precisar de apoio

### 4) Subir o backend (API)
```bash
./venv/Scripts/python -m uvicorn backend.main:app --reload --port 8000
```
Ou use `start_backend.ps1`.

### 5) Subir o dashboard
Em outro terminal:
```bash
./venv/Scripts/python -m streamlit run frontend/app.py
```
Ou use `start_frontend.ps1`.

Acesse `http://localhost:8501`.

## Publicar online (para compartilhar um link com colegas)

Esta máquina bloqueia túneis (localtunnel/Cloudflare Tunnel — a rede corporativa
derruba as portas que eles usam). O caminho que funciona em qualquer rede é
hospedar o backend e o frontend na nuvem, gratuitamente:

1. **Suba este repositório para o GitHub.**
   ```bash
   git remote add origin https://github.com/<seu-usuario>/fleetmind-ai.git
   git push -u origin master
   ```
   (Crie o repositório vazio antes, em github.com/new — sem README/license, para
   não conflitar com o que já existe aqui.)

2. **Backend → [Render](https://render.com)** (gratuito)
   - "New +" → "Web Service" → conecte o repositório do GitHub.
   - O arquivo [render.yaml](render.yaml) já configura tudo automaticamente
     (build gera a base sintética e treina os modelos; start sobe a API).
   - Ao terminar o deploy, copie a URL pública (algo como
     `https://fleetmind-ai-backend.onrender.com`).

3. **Frontend → [Streamlit Community Cloud](https://share.streamlit.io)** (gratuito)
   - "New app" → conecte o mesmo repositório.
   - Main file path: `frontend/app.py`.
   - Em "Advanced settings → Secrets", adicione:
     ```toml
     API_URL = "https://fleetmind-ai-backend.onrender.com"
     ```
     (usando a URL do passo 2).
   - Deploy. Você recebe um link `https://<algo>.streamlit.app` — esse é o link
     fixo que pode ser compartilhado com qualquer colega, de qualquer rede.

> O plano gratuito do Render "dorme" após 15 min sem uso — a primeira requisição
> depois disso demora ~30-60s para acordar o backend. Normal para demo de PBL.

## O que o protótipo demonstra

- **Agente de Ação (autônomo)** — [backend/agent_engine.py](backend/agent_engine.py).
  Para cada situação nova, a IA decide e **executa** a ação imediatamente:
  liga/instrui o motorista ("reduza a velocidade agora"), recalcula e envia
  o desvio de rota, notifica o cliente sobre atraso. Se o motorista não
  responde a tempo (simulado por probabilidade ligada ao score de risco) ou
  a severidade é crítica, o próprio agente **escala automaticamente para um
  operador humano** (`Ana Souza`, `Carlos Lima`...), que "liga" para reforçar
  a orientação. Toda a decisão fica registrada como uma linha do tempo
  auditável por situação (tabela `agent_actions`, endpoint `/agent-actions`).
- **Central de Comunicação (relato por voz do motorista)** — simulação de
  áudio→texto: o motorista "fala" o que vê na via (acidente, via
  interditada, trânsito, defeito no veículo...). A IA classifica o relato e
  propaga o risco para os **demais veículos na mesma rota** (tabela
  `road_events`, endpoint `/road-events`), disparando novas situações de
  "alteração de rota" que o agente resolve automaticamente — a
  inteligência coletiva da rede.
- **Painel Operacional (Kanban)** — a tela principal do dashboard, resumida
  e com drill-down: cada coluna reflete o estado da ação da IA
  (🤖 IA Atuando Agora → 🧑‍💼 Escalado para Operador → ✅ Resolvido), e os
  cartões são agrupados por tipo de situação (🔧 manutenção urgente,
  🧑‍✈️ atenção ao motorista, 🗺️ alteração de rota, ⏱️ risco de atraso,
  🚨 alerta crítico). Expanda um grupo para ver os casos individuais, e cada
  cartão tem sua linha do tempo de ações da IA/operador/motorista.
- **Visão geral da frota** em tempo real (KPIs, ranking de risco, distribuição).
- **Risco preditivo de falha por veículo**, calculado a partir de telemetria
  agregada (temperatura de motor, pressão de óleo, vibração, desgaste de
  freio) e histórico de manutenção.
- **Risco/apoio ao motorista**, calculado a partir de fadiga, excesso de
  velocidade, frenagens bruscas e distração.
- **Alertas operacionais** gerados a partir de eventos críticos de telemetria
  e comportamento.
- **Copiloto / Super Agente de IA**: perguntas em linguagem natural como
  "Qual veículo apresenta maior risco de falha?" ou "Qual rota é mais
  segura?" — hoje resolvidas por um motor de intenções + consulta aos dados,
  com um ponto de extensão claro (`backend/ai_agent.py::answer`) para plugar
  um LLM real (Claude/GPT) quando houver uma chave de API disponível.

## Extensões sugeridas para a apresentação do TCC/PBL

1. Plugar um LLM real no Copiloto (Claude API) para respostas mais ricas e
   memória de conversa.
2. Adicionar mapa geográfico real (Google Maps/OSM) com posição dos veículos.
3. Simular "inteligência coletiva": quando um veículo sintético reporta
   clima severo, propagar alerta para veículos próximos na mesma rota.
4. Adicionar autenticação e multi-tenant (uma transportadora por conta).
