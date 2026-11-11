const pptxgen = require("pptxgenjs");

// ---------- Marca FleetMind AI ----------
const NAVY = "001028", NAVY2 = "0C2440", TEAL = "007880", TEAL_L = "4FD1D9";
const WARM = "C9622A", WHITE = "FFFFFF", GRAY_BG = "E9EEF2", GRAY_LN = "D6DEE4";
const MUTED = "4A5560", MUTED_D = "AFC3CC";
const HEAD = "Cambria", BODY = "Calibri";
const TOTAL = 18;

const LOGO = "../assets/logo_icon_transparent.png";
const LOGO_W = "../assets/logo_icon_white.png";
const RATIO = 280 / 580;
const KANBAN = "../assets/screens/kanban.png";

const p = new pptxgen();
p.layout = "LAYOUT_WIDE";
p.title = "FleetMind AI - Apresentacao executiva";

let n = 0;
function slide(dark) {
  const s = p.addSlide();
  s.background = { color: dark ? NAVY : WHITE };
  n += 1;
  s.addText(`${n} / ${TOTAL}`, { x: 12.3, y: 7.05, w: 0.9, h: 0.3, fontFace: BODY, fontSize: 9, align: "right", color: dark ? "5A6C8C" : "A9B4C6", margin: 0 });
  const w = 0.62;
  s.addImage({ path: dark ? LOGO_W : LOGO, x: 12.2, y: 0.4, w, h: w * RATIO });
  return s;
}
function kicker(s, t, dark) {
  s.addText(t.toUpperCase(), { x: 0.6, y: 0.45, w: 9, h: 0.35, fontFace: BODY, fontSize: 12, bold: true, charSpacing: 2, color: dark ? TEAL_L : TEAL, margin: 0 });
}
function title(s, t, dark, y = 0.9, size = 30) {
  s.addText(t, { x: 0.6, y, w: 11.4, h: 1.0, fontFace: HEAD, fontSize: size, bold: true, color: dark ? WHITE : NAVY, margin: 0, valign: "top", lineSpacing: size + 4 });
}
function card(s, x, y, w, h, fill = GRAY_BG, line = GRAY_LN) {
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: line, width: 1 } });
}
function note(s, t) { s.addNotes(t); }
// Faixa "Em uma frase": o pitch do slide em linguagem simples.
function band(s, text, dark, y = 6.45) {
  s.addShape("roundRect", { x: 0.6, y, w: 12.1, h: 0.45, rectRadius: 0.08, fill: { color: dark ? NAVY2 : "E3F1F2" }, line: { color: dark ? "24406E" : "BFDCDF", width: 1 } });
  s.addText([{ text: "Em uma frase:  ", options: { bold: true, color: dark ? TEAL_L : TEAL } }, { text, options: { color: dark ? WHITE : NAVY } }], { x: 0.8, y, w: 11.7, h: 0.45, valign: "middle", fontFace: BODY, fontSize: 12.5, margin: 0 });
}
function src(s, t, dark) {
  s.addText(t, { x: 0.6, y: 6.95, w: 11.4, h: 0.4, fontFace: BODY, italic: true, fontSize: 9, color: dark ? "7E91B0" : MUTED, margin: 0 });
}

/* 1 CAPA */
{
  const s = slide(true);
  s.addImage({ path: LOGO_W, x: 0.8, y: 1.6, w: 1.9, h: 1.9 * RATIO });
  s.addText("FleetMind AI", { x: 0.8, y: 2.7, w: 11, h: 1.2, fontFace: HEAD, fontSize: 58, bold: true, color: WHITE, margin: 0 });
  s.addText("A inteligência que move o transporte.", { x: 0.8, y: 3.9, w: 11, h: 0.6, fontFace: HEAD, italic: true, fontSize: 24, color: TEAL_L, margin: 0 });
  s.addText("Fleet Intelligence Platform: IA que prevê riscos, age em tempo real e transforma dados de frota em economia, segurança e menos carbono.", { x: 0.8, y: 4.75, w: 9.6, h: 0.9, fontFace: BODY, fontSize: 16, color: MUTED_D, margin: 0, lineSpacing: 22 });
  s.addText("Apresentação executiva · Banca avaliadora e investidores", { x: 0.8, y: 6.5, w: 10, h: 0.4, fontFace: BODY, fontSize: 13, color: TEAL_L, margin: 0 });
  note(s, "Abertura (20s). O FleetMind AI e uma plataforma de inteligencia operacional para frotas. Hoje vamos mostrar o problema, o produto que ja esta funcionando, o retorno para o cliente e o que precisamos para escalar.");
}

/* 2 PROBLEMA */
{
  const s = slide(false);
  kicker(s, "O problema");
  title(s, "Frotas têm dados demais e decisão tardia");
  const items = [
    ["53%", "das mortes em rodovias federais em 2024 envolveram caminhões e ônibus, que são só 4% da frota.", "PRF / Agência Brasil, 2024", WARM],
    ["62%", "das transportadoras relataram rentabilidade menor no 1º tri/2025, e 47% renegociavam contratos ou cortavam rotas.", "NTC&Logística", WARM],
    ["40%", "do CO₂ do transporte rodoviário (~270 milhões de toneladas em 2024) vem dos caminhões.", "Inventário Nacional de Emissões (IEMA/MMA/MT)", TEAL],
  ];
  items.forEach((it, i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 2.2, 3.85, 3.6);
    s.addText(it[0], { x, y: 2.4, w: 3.85, h: 1.3, align: "center", fontFace: HEAD, fontSize: 60, bold: true, color: it[3], margin: 0 });
    s.addText(it[1], { x: x + 0.3, y: 3.8, w: 3.25, h: 1.5, align: "center", fontFace: BODY, fontSize: 15, color: NAVY, margin: 0, lineSpacing: 20 });
    s.addText(it[2], { x: x + 0.3, y: 5.3, w: 3.25, h: 0.35, align: "center", fontFace: BODY, italic: true, fontSize: 10, color: MUTED, margin: 0 });
  });
  s.addText("Os dados existem em rastreador, telemetria, manutenção e TMS (sistema de gestão de transporte), mas ninguém os converte em ação a tempo. Cada desperdício não corrigido sai direto do lucro.", { x: 0.6, y: 5.9, w: 12, h: 0.5, fontFace: HEAD, italic: true, fontSize: 13, color: NAVY, margin: 0 });
  band(s, "a margem está apertada e o dado já existe; falta transformá-lo em ação a tempo.", false);
  note(s, "Problema (40s). O transporte rodoviario concentra mortes e custo. As empresas ja tem dados, mas a decisao e reativa: o gestor descobre o problema depois que ele aconteceu.");
}

/* 3 MERCADO */
{
  const s = slide(false);
  kicker(s, "Oportunidade");
  title(s, "Um mercado de 2,24 milhões de caminhões");
  const f = [
    ["TAM", "≈ R$ 0,8 a 1,3 bi/ano", "Mercado total: se todos os 2,24 mi de caminhões usassem o FleetMind, a R$ 29,90 a R$ 49,90 por veículo por mês.", 7.6, NAVY],
    ["SAM", "a dimensionar", "Mercado que dá para atender: frotas de 100 a 2.000 veículos. Empresas movem 68% das cargas (CNT). Tamanho exato a levantar no RNTRC/ANTT.", 6.2, NAVY2],
    ["SOM", "R$ 1,8 a 3 mi/ano", "Mercado que vamos conquistar: meta de 5.000 veículos em 3 anos, só em assinatura, sem contar a parte da economia.", 4.8, TEAL],
  ];
  f.forEach((r, i) => {
    const w = r[3], x = 0.6 + (7.6 - w) / 2, y = 2.0 + i * 1.35;
    s.addShape("roundRect", { x, y, w, h: 1.2, rectRadius: 0.1, fill: { color: r[4] }, line: { type: "none" } });
    s.addText(r[0], { x: x + 0.25, y: y + 0.1, w: 1.0, h: 0.4, fontFace: HEAD, bold: true, fontSize: 16, color: TEAL_L, margin: 0 });
    s.addText(r[1], { x: x + 0.2, y: y + 0.1, w: w - 0.4, h: 0.4, align: "right", fontFace: HEAD, bold: true, fontSize: 17, color: WHITE, margin: 0 });
    s.addText(r[2], { x: x + 0.25, y: y + 0.55, w: w - 0.5, h: 0.6, fontFace: BODY, fontSize: 11, color: "DCE5F2", margin: 0, lineSpacing: 14 });
  });
  card(s, 8.5, 2.0, 4.2, 4.05);
  s.addText("Mercado global", { x: 8.75, y: 2.15, w: 3.7, h: 0.4, fontFace: HEAD, bold: true, fontSize: 16, color: NAVY, margin: 0 });
  s.addText("US$ 37,7 bi → 70,3 bi", { x: 8.75, y: 2.65, w: 3.7, h: 0.6, fontFace: HEAD, bold: true, fontSize: 23, color: TEAL, margin: 0 });
  s.addText("gestão de frotas, 2025 a 2030 (13,3% ao ano).", { x: 8.75, y: 3.3, w: 3.7, h: 0.6, fontFace: BODY, fontSize: 12, color: MUTED, margin: 0 });
  s.addText("US$ 8,5 bi → 19,8 bi", { x: 8.75, y: 4.05, w: 3.7, h: 0.6, fontFace: HEAD, bold: true, fontSize: 23, color: TEAL, margin: 0 });
  s.addText("IA aplicada a frotas, 2025 a 2034.", { x: 8.75, y: 4.7, w: 3.7, h: 0.5, fontFace: BODY, fontSize: 12, color: MUTED, margin: 0 });
  s.addText("Quanto menor a faixa, mais realista a meta. A receita também cresce com a parte da economia comprovada.", { x: 8.75, y: 5.3, w: 3.7, h: 0.7, fontFace: BODY, bold: true, fontSize: 11.5, color: TEAL, margin: 0, lineSpacing: 15 });
  band(s, "o mercado de assinaturas chega perto de R$ 1 bi por ano; começamos por frotas de 100 a 2.000 veículos.", false, 6.2);
  src(s, "Fontes: Sindipeças (2024); CNT via Agência Infra; MarketsandMarkets e Precedence Research. TAM = 2,24 mi × R$ 358,80 a R$ 598,80 por ano. TAM e SOM são estimativas da equipe; preços são hipóteses não validadas.");
  note(s, "Mercado (40s). O Brasil tem 2,24 milhoes de caminhoes. Com assinatura de R$ 29,90 a R$ 49,90 por veiculo por mes, o mercado total fica perto de R$ 1 bilhao por ano. Nosso foco sao frotas de 100 a 2.000 veiculos; o tamanho exato desse segmento ainda precisa ser levantado. TAM e SOM sao estimativas da equipe e os precos sao hipoteses.");
}

/* 4 SOLUCAO */
{
  const s = slide(false);
  kicker(s, "A solução");
  title(s, "Uma camada de inteligência sobre o que a empresa já tem");
  const st = [["DADOS", "Telemetria, GPS, câmeras, ERP/TMS, trânsito, clima, radares e notícias"], ["IA", "Correlaciona eventos internos e externos"], ["PREVISÃO", "Antecipa falhas e riscos"], ["DECISÃO", "Recomenda a melhor ação"], ["AÇÃO", "Executa, notifica e aprende"]];
  st.forEach((x, i) => {
    const bx = 0.6 + i * 2.45, last = i === 4;
    card(s, bx, 2.3, 2.2, 2.4, last ? TEAL : GRAY_BG, last ? TEAL : GRAY_LN);
    s.addText(x[0], { x: bx + 0.15, y: 2.55, w: 1.9, h: 0.5, fontFace: HEAD, bold: true, fontSize: 18, color: last ? WHITE : NAVY, margin: 0 });
    s.addText(x[1], { x: bx + 0.15, y: 3.15, w: 1.9, h: 1.3, fontFace: BODY, fontSize: 12, color: last ? "E3F1F2" : MUTED, margin: 0, lineSpacing: 15 });
    if (!last) s.addText("→", { x: bx + 2.17, y: 3.1, w: 0.4, h: 0.5, align: "center", fontSize: 20, bold: true, color: "9AA9C4", margin: 0 });
  });
  s.addShape("roundRect", { x: 0.6, y: 5.2, w: 12.1, h: 1.0, rectRadius: 0.1, fill: { color: "F7E9E0" }, line: { color: "EDD0BE", width: 1 } });
  s.addText([{ text: "Não substitui telemetria, TMS ou rastreamento. ", options: { bold: true, color: WARM } }, { text: "Integra o que o cliente já usa, de vários fornecedores, e adiciona a inteligência que falta, sem exigir mais hardware.", options: { color: NAVY } }], { x: 0.9, y: 5.2, w: 11.5, h: 1.0, valign: "middle", fontFace: BODY, fontSize: 15, margin: 0 });
  band(s, "o FleetMind é o cérebro que liga os dados da frota, prevê o risco e age antes do problema acontecer.", false);
  note(s, "Solucao (35s). Dado vira previsao, previsao vira decisao, decisao vira acao. O FleetMind nao concorre com a telemetria ou o TMS, ele se integra e adiciona a camada de inteligencia.");
}

/* 5 PRODUTO */
{
  const s = slide(false);
  kicker(s, "O produto em funcionamento");
  title(s, "Painel Operacional: a IA já agiu, o gestor só acompanha");
  s.addImage({ path: KANBAN, x: 0.6, y: 2.0, w: 8.0, h: 8.0 * (606 / 1234) });
  s.addShape("rect", { x: 0.6, y: 2.0, w: 8.0, h: 8.0 * (606 / 1234), fill: { type: "none" }, line: { color: GRAY_LN, width: 1 } });
  const c = [["IA atuando agora", "Instrui o motorista, recalcula rota e avisa o cliente em tempo real."], ["Escalado para operador", "Se o motorista não responde ou o risco é crítico, o caso vai para um humano."], ["Linha do tempo auditável", "Cada ação registra quem agiu (IA, operador ou motorista) e quando."]];
  c.forEach((r, i) => {
    const y = 2.0 + i * 1.32;
    card(s, 8.9, y, 3.8, 1.2);
    s.addText(r[0], { x: 9.1, y: y + 0.08, w: 3.4, h: 0.35, fontFace: HEAD, bold: true, fontSize: 14, color: TEAL, margin: 0 });
    s.addText(r[1], { x: 9.1, y: y + 0.45, w: 3.4, h: 0.7, fontFace: BODY, fontSize: 11, color: NAVY, margin: 0, lineSpacing: 13 });
  });
  s.addText("Dashboard no ar, ligado a um servidor de dados e a modelos de IA. Dados da demonstração: 120 veículos e 4.000 viagens sintéticos.", { x: 0.6, y: 6.0, w: 12, h: 0.35, fontFace: BODY, italic: true, fontSize: 11, color: MUTED, margin: 0 });
  band(s, "o gestor vê o que a IA já resolveu e só atua quando ela chama um humano.", false);
  note(s, "Produto (60s). Esta e a tela real. A IA ja decidiu e agiu sobre cada situacao. Quando o motorista nao responde ou o risco e critico, o proprio agente escala para um operador humano. Tudo fica registrado.");
}

/* 5A VALOR POR PESSOA */
{
  const s = slide(false);
  kicker(s, "Valor para cada pessoa");
  title(s, "Menos alertas, mais decisão: quem ganha o quê");
  const v = [
    ["Dono ou diretoria", "Menos desperdício de diesel e de paradas, e prova do ROI em reais.", "Condição: economia auditável."],
    ["Gestor de frota", "Fila curta de alertas priorizados por impacto e com explicação, em vez de mais um painel.", "Condição: poucos alertas e baixo falso positivo."],
    ["Manutenção", "Sinais de falha recorrente antes da quebra e registro do que foi feito.", "Condição: dados de manutenção integráveis."],
    ["Motorista", "Sem tela nova no MVP, menos retrabalho e menos risco de fadiga.", "Condição: dados usados para orientar, não para punir."],
  ];
  v.forEach((r, i) => {
    const x = 0.6 + i * 3.05;
    card(s, x, 2.0, 2.9, 3.9);
    s.addText(r[0], { x: x + 0.2, y: 2.15, w: 2.5, h: 0.45, fontFace: HEAD, bold: true, fontSize: 16, color: TEAL, margin: 0 });
    s.addText(r[1], { x: x + 0.2, y: 2.75, w: 2.5, h: 1.9, fontFace: BODY, fontSize: 13, color: NAVY, margin: 0, lineSpacing: 17 });
    s.addText(r[2], { x: x + 0.2, y: 4.8, w: 2.5, h: 0.9, fontFace: BODY, italic: true, fontSize: 11.5, color: MUTED, margin: 0, lineSpacing: 15 });
  });
  band(s, "cada pessoa recebe só o que precisa, e o dado serve para orientar, nunca para punir.", false);
  note(s, "Valor por pessoa (35s). Cada papel recebe algo diferente: o dono ve o ROI em reais, o gestor ve poucos alertas priorizados, a manutencao ve a falha antes da quebra e o motorista nao ganha tela nova. O dado e usado para orientar, nao para punir.");
}

/* 6 AGENTE + REDE */
{
  const s = slide(true);
  kicker(s, "Agente de ação e inteligência coletiva", true);
  title(s, "Um motorista fala. A frota inteira fica mais segura.", true);
  const st = [["Motorista relata", "\"Acidente à frente, pista parcialmente interditada.\""], ["IA classifica", "Tipo: acidente. Severidade: crítica."], ["Rede é avisada", "Todos os veículos na mesma rota recebem o risco."], ["Desvio enviado", "A IA recalcula e envia a nova rota, sem esperar ninguém."]];
  st.forEach((x, i) => {
    const bx = 0.6 + i * 3.1;
    s.addShape("roundRect", { x: bx, y: 2.4, w: 2.85, h: 2.5, rectRadius: 0.1, fill: { color: NAVY2 }, line: { color: "24406E", width: 1 } });
    s.addShape("oval", { x: bx + 0.2, y: 2.6, w: 0.5, h: 0.5, fill: { color: TEAL }, line: { type: "none" } });
    s.addText(String(i + 1), { x: bx + 0.2, y: 2.6, w: 0.5, h: 0.5, align: "center", valign: "middle", fontFace: HEAD, bold: true, fontSize: 16, color: WHITE, margin: 0 });
    s.addText(x[0], { x: bx + 0.2, y: 3.2, w: 2.45, h: 0.45, fontFace: HEAD, bold: true, fontSize: 16, color: WHITE, margin: 0 });
    s.addText(x[1], { x: bx + 0.2, y: 3.7, w: 2.45, h: 1.1, fontFace: BODY, fontSize: 12, color: MUTED_D, margin: 0, lineSpacing: 15 });
  });
  s.addText("Cada viagem torna toda a plataforma mais inteligente: é o efeito de rede que protege a vantagem competitiva.", { x: 0.6, y: 5.5, w: 12, h: 0.8, fontFace: HEAD, italic: true, fontSize: 18, color: TEAL_L, margin: 0, lineSpacing: 24 });
  band(s, "quando um motorista avisa um problema na via, todos os outros veículos da rota já desviam.", true);
  note(s, "Agente e rede (45s). O motorista relata por voz o que ve na via. A IA classifica e propaga o risco para os outros veiculos da rota, que recebem o desvio automaticamente. Quanto mais veiculos, mais inteligente a rede.");
}

/* 6A ECOSSISTEMA DE DADOS */
{
  const s = slide(false);
  kicker(s, "Ecossistema de dados");
  title(s, "Um cérebro conectado a tudo que afeta a viagem");
  const cats = [
    ["Via e infraestrutura", "OpenStreetMap, DNIT, obras, pedágios, pontos de apoio", 0],
    ["Trânsito", "Waze, Google, TomTom, PRF, eventos e greves", 0],
    ["Radares e fiscalização", "Radarbot, concessionárias, DER, balanças", 0],
    ["Clima", "INMET, CPTEC, Climatempo, radar de chuva, vento e neblina", 1],
    ["Desastres e emergências", "Defesa Civil, Cemaden, alagamentos, interdições", 0],
    ["Segurança e carga", "Roubo de carga por trecho, seguradoras, risco da rota", 0],
    ["Mídias sociais e notícias", "X, Telegram, portais, rádios de trânsito", 0],
    ["Veículo", "Telemetria, câmeras com IA, sensores de pneu, motor e carga", 1],
    ["Motorista", "Jornada, fadiga, comportamento, relatos por voz", 1],
    ["Operação", "TMS, ERP, manutenção, abastecimento, janelas de entrega", 1],
    ["Mercado e regulação", "ANP, preço de frete, ANTT, CONTRAN, LGPD", 0],
    ["Rede FleetMind", "Relatos dos motoristas e histórico de ações da IA", 1],
  ];
  cats.forEach((c, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 0.6 + col * 3.05, y = 2.0 + row * 1.4, live = c[2] === 1;
    card(s, x, y, 2.9, 1.28, live ? "E3F1F2" : GRAY_BG, live ? TEAL : GRAY_LN);
    s.addText(c[0], { x: x + 0.15, y: y + 0.07, w: 2.6, h: 0.33, fontFace: HEAD, bold: true, fontSize: 13.5, color: NAVY, margin: 0 });
    s.addText(c[1], { x: x + 0.15, y: y + 0.42, w: 2.6, h: 0.5, fontFace: BODY, fontSize: 10.5, color: MUTED, margin: 0, lineSpacing: 13 });
    s.addText(live ? "NO PROTÓTIPO (DADOS SIMULADOS)" : "PRÓXIMAS INTEGRAÇÕES", { x: x + 0.15, y: y + 0.97, w: 2.6, h: 0.25, fontFace: BODY, bold: true, fontSize: 8.5, charSpacing: 1, color: live ? TEAL : MUTED, margin: 0 });
  });
  s.addText("Mais de 100 bases mapeadas pela equipe. As integrações reais dependem de acordos, licenças e da lei de proteção de dados (LGPD).", { x: 0.6, y: 6.1, w: 12, h: 0.3, fontFace: BODY, italic: true, fontSize: 11, color: MUTED, margin: 0 });
  band(s, "quanto mais fontes de dados conectadas, melhor a rota e mais cedo o alerta.", false);
  note(s, "Ecossistema de dados (45s). O valor do FleetMind cresce com a quantidade de fontes conectadas: via, transito, radares, clima, desastres, seguranca, redes sociais, veiculo, motorista e operacao. Cinco dessas familias ja existem no prototipo com dados simulados. As demais sao o plano de integracao, sujeito a acordos e a LGPD.");
}

/* 6B DE DADOS A ROTA */
{
  const s = slide(true);
  kicker(s, "Mais fontes, melhor decisão", true);
  title(s, "Cada nova fonte deixa a rota mais segura e o alerta mais cedo", true);
  const st = [["Fontes", "Radares, trânsito, clima, desastres, notícias e rede de motoristas"], ["Fusão e verificação", "Cruza as fontes e só confirma o que aparece em mais de uma"], ["Risco por trecho", "Cada trecho ganha um score que muda a cada minuto"], ["Ação", "Alerta ao motorista, desvio automático e aviso à operação"]];
  st.forEach((x, i) => {
    const bx = 0.6 + i * 3.1, last = i === 3;
    s.addShape("roundRect", { x: bx, y: 2.2, w: 2.85, h: 1.9, rectRadius: 0.1, fill: { color: last ? TEAL : NAVY2 }, line: { color: last ? TEAL : "24406E", width: 1 } });
    s.addText(x[0], { x: bx + 0.2, y: 2.35, w: 2.45, h: 0.45, fontFace: HEAD, bold: true, fontSize: 16, color: WHITE, margin: 0 });
    s.addText(x[1], { x: bx + 0.2, y: 2.85, w: 2.45, h: 1.15, fontFace: BODY, fontSize: 12, color: last ? "E3F1F2" : MUTED_D, margin: 0, lineSpacing: 15 });
    if (!last) s.addText("→", { x: bx + 2.82, y: 2.85, w: 0.3, h: 0.5, align: "center", fontSize: 18, bold: true, color: TEAL_L, margin: 0 });
  });
  s.addShape("roundRect", { x: 0.6, y: 4.3, w: 12.1, h: 1.05, rectRadius: 0.1, fill: { color: NAVY2 }, line: { color: "24406E", width: 1 } });
  s.addText([{ text: "Exemplo: ", options: { bold: true, color: TEAL_L } }, { text: "radar móvel reportado, chuva forte à frente e um acidente citado em rede social. Juntas, as três fontes elevam o risco do trecho, e o motorista recebe o desvio antes de chegar.", options: { color: WHITE } }], { x: 0.9, y: 4.3, w: 11.5, h: 1.05, valign: "middle", fontFace: BODY, fontSize: 14, margin: 0, lineSpacing: 19 });
  const b = ["Alerta antecipado ao motorista", "Rota mais segura e mais rápida", "Operação decide com contexto"];
  b.forEach((t, i) => s.addText(t, { x: 0.6 + i * 4.1, y: 5.5, w: 3.9, h: 0.4, fontFace: HEAD, bold: true, fontSize: 15, color: TEAL_L, margin: 0 }));
  s.addText("Informação de rede social só vira alerta depois de confirmação cruzada, para evitar boato.", { x: 0.6, y: 5.98, w: 12, h: 0.35, fontFace: BODY, italic: true, fontSize: 12, color: MUTED_D, margin: 0 });
  band(s, "juntar várias fontes e conferir antes de alertar gera avisos confiáveis e rotas melhores.", true);
  note(s, "De dados a rota (40s). As fontes sao fundidas e verificadas, cada trecho recebe um score de risco e o sistema age: alerta o motorista, envia o desvio e avisa a operacao. Quanto mais fontes, mais cedo o alerta. Informacao de rede social so vira alerta com confirmacao cruzada.");
}

/* 7 IA PREDITIVA */
{
  const s = slide(false);
  kicker(s, "IA preditiva");
  title(s, "Dois modelos já treinados e rodando no protótipo");
  const cards = [
    ["Risco de falha do veículo", "AUC 0,79", "Mais pesam: pressão do óleo, desgaste de freio, vibração e temperatura do motor.", "Alimenta a manutenção preditiva."],
    ["Apoio ao motorista", "AUC 0,97", "Mais pesam: fadiga, distração e experiência do motorista.", "Alimenta o copiloto e a escalada para humano."],
  ];
  cards.forEach((c, i) => {
    const x = 0.6 + i * 6.15;
    card(s, x, 2.0, 5.95, 3.4);
    s.addText(c[0], { x: x + 0.3, y: 2.15, w: 5.3, h: 0.45, fontFace: HEAD, bold: true, fontSize: 18, color: NAVY, margin: 0 });
    s.addText(c[1], { x: x + 0.3, y: 2.65, w: 5.3, h: 1.0, fontFace: HEAD, bold: true, fontSize: 46, color: TEAL, margin: 0 });
    s.addText(c[2], { x: x + 0.3, y: 3.7, w: 5.3, h: 0.8, fontFace: BODY, fontSize: 13, color: NAVY, margin: 0, lineSpacing: 17 });
    s.addText(c[3], { x: x + 0.3, y: 4.6, w: 5.3, h: 0.5, fontFace: BODY, bold: true, fontSize: 13, color: TEAL, margin: 0 });
  });
  s.addText("AUC mede o quanto o modelo separa casos de risco dos normais: 1,0 é perfeito e 0,5 é um palpite. Resultados em dados sintéticos, para provar o método. O desempenho real será medido com clientes no piloto.", { x: 0.6, y: 5.55, w: 12, h: 0.7, fontFace: BODY, italic: true, fontSize: 12, color: MUTED, margin: 0, lineSpacing: 16 });
  band(s, "a IA já indica quais veículos tendem a falhar e quais motoristas precisam de ajuda.", false);
  note(s, "IA preditiva (30s). Random Forest treinado em dados sinteticos. O objetivo e provar o metodo, nao prometer essa precisao em campo. O piloto mede o desempenho real.");
}

/* 8 ECONOMIA */
{
  const s = slide(false);
  kicker(s, "Valor econômico");
  title(s, "Para 1.000 veículos, o cliente empata com R$ 30,50 de economia por veículo por mês");
  s.addChart(p.charts.BAR, [{ name: "Benefício líquido no ano (R$ mil)", labels: ["R$ 30", "R$ 50", "R$ 100"], values: [-6.3, 233.7, 833.7] }], {
    x: 0.6, y: 2.1, w: 6.4, h: 3.65, barDir: "col", chartColors: [TEAL], showValue: true, dataLabelFormatCode: "#,##0.0", dataLabelColor: NAVY, dataLabelFontSize: 12, dataLabelPosition: "outEnd",
    showTitle: true, title: "Benefício líquido no ano, por economia de cada veículo por mês (R$ mil)", titleFontSize: 12, titleColor: NAVY, titleFontFace: BODY,
    catAxisLabelColor: NAVY, catAxisLabelFontSize: 12, valAxisLabelColor: MUTED, valAxisLabelFontSize: 10, valGridLine: { color: GRAY_LN, size: 0.5 }, catGridLine: { style: "none" }, showLegend: false, valAxisMinVal: -100, valAxisMaxVal: 1000,
  });
  const rows = [["Economia/veículo/mês", "R$ 30", "R$ 50", "R$ 100"], ["Benefício líquido", "−R$ 6,3 mil", "R$ 233,7 mil", "R$ 833,7 mil"], ["ROI no ano 1", "≈ 0%", "64%", "228%"], ["Retorno do investimento", "12,2 meses", "7,3 meses", "3,7 meses"]];
  rows.forEach((r, ri) => r.forEach((cell, ci) => {
    const x = 7.3 + (ci === 0 ? 0 : 1.7 + (ci - 1) * 1.23), w = ci === 0 ? 1.7 : 1.23, y = 2.0 + ri * 0.55;
    s.addShape("rect", { x, y, w, h: 0.55, fill: { color: ri === 0 ? NAVY : (ci === 2 ? "DFF0F1" : WHITE) }, line: { color: GRAY_LN, width: 0.75 } });
    s.addText(cell, { x: x + 0.05, y, w: w - 0.1, h: 0.55, align: ci === 0 ? "left" : "center", valign: "middle", fontFace: BODY, fontSize: ri === 0 ? 10.5 : 11, bold: ri === 0 || ci === 2, color: ri === 0 ? WHITE : NAVY, margin: 0 });
  }));
  s.addText("ROI = quanto o cliente ganha para cada real investido. Retorno do investimento = em quantos meses a economia paga o gasto.", { x: 7.3, y: 4.3, w: 5.4, h: 0.6, fontFace: BODY, bold: true, fontSize: 11, color: TEAL, margin: 0, lineSpacing: 14 });
  s.addText("Custo para o cliente: R$ 29,90 por veículo por mês (R$ 358.800 por ano) mais R$ 7.500 de implantação, ou R$ 366.300 no 1º ano. As economias são hipóteses a medir no piloto, com baseline auditável.", { x: 7.3, y: 4.95, w: 5.4, h: 0.85, fontFace: BODY, fontSize: 11, color: MUTED, margin: 0, lineSpacing: 14 });
  band(s, "com R$ 50 de economia por veículo por mês, o cliente recupera o investimento em cerca de 7 meses.", false, 6.0);
  src(s, "Preços de referência (hipóteses não validadas): R$ 29,90 por veículo por mês com 1.000 veículos. O custo de servir (nuvem, IA, APIs e suporte) ainda não foi medido e é a principal variável do piloto. O modelo híbrido soma 15% da economia comprovada, não incluídos nesta conta.");
  note(s, "Valor (50s). Para 1.000 veiculos o cliente paga R$ 366.300 no primeiro ano. Ele empata se economizar cerca de R$ 30,50 por veiculo por mes. Com R$ 50 o ROI e de 64% e o retorno em 7 meses. Com R$ 100, 228%. Essas economias sao hipoteses: o piloto vai medir com baseline auditavel.");
}

/* 9 ESG */
{
  const s = slide(false);
  kicker(s, "Impacto ESG");
  title(s, "Cada 1% de diesel poupado reduz cerca de 1% do carbono");
  const k = [["~270 mi t", "de CO₂ no transporte rodoviário do Brasil em 2024"], ["40%", "dessas emissões vêm dos caminhões"], ["≈ 1%", "menos CO₂ para cada 1% de diesel evitado"], ["4.176 t", "CO₂e por ano da frota de demonstração"]];
  k.forEach((r, i) => {
    const x = 0.6 + i * 3.1, hl = i === 2;
    card(s, x, 2.0, 2.9, 1.3, hl ? TEAL : GRAY_BG, hl ? TEAL : GRAY_LN);
    s.addText(r[0], { x: x + 0.15, y: 2.08, w: 2.6, h: 0.6, fontFace: HEAD, bold: true, fontSize: 26, color: hl ? WHITE : NAVY, margin: 0 });
    s.addText(r[1], { x: x + 0.15, y: 2.7, w: 2.6, h: 0.55, fontFace: BODY, fontSize: 10.5, color: hl ? "E3F1F2" : MUTED, margin: 0, lineSpacing: 13 });
  });
  s.addChart(p.charts.BAR, [{ name: "tCO2e evitadas", labels: ["1% de diesel", "2% de diesel", "5% de diesel"], values: [41.8, 83.5, 208.8] }], {
    x: 0.6, y: 3.45, w: 6.6, h: 2.6, barDir: "bar", chartColors: [TEAL], showValue: true, dataLabelFormatCode: "0.0", dataLabelColor: NAVY, dataLabelFontSize: 11, dataLabelPosition: "outEnd",
    showTitle: true, title: "CO₂e evitado na frota de demonstração, por diesel poupado (t/ano)", titleFontSize: 12, titleColor: NAVY, titleFontFace: BODY,
    catAxisLabelColor: NAVY, catAxisLabelFontSize: 11, valAxisLabelColor: MUTED, valAxisLabelFontSize: 9, valGridLine: { color: GRAY_LN, size: 0.5 }, catGridLine: { style: "none" }, showLegend: false, valAxisMaxVal: 250,
  });
  card(s, 7.5, 3.45, 5.2, 2.6);
  s.addText("Medimos antes de prometer", { x: 7.75, y: 3.55, w: 4.7, h: 0.4, fontFace: HEAD, bold: true, fontSize: 15, color: NAVY, margin: 0 });
  s.addText([
    { text: "O piloto mede os litros de diesel antes e depois", options: { bullet: true, breakLine: true } },
    { text: "O CO₂ cai na mesma proporção do consumo", options: { bullet: true, breakLine: true } },
    { text: "Não prometemos percentual de ESG antes de medir", options: { bullet: true, breakLine: true } },
    { text: "O resultado alimenta o relatório ESG do cliente", options: { bullet: true } },
  ], { x: 7.75, y: 3.98, w: 4.7, h: 1.5, fontFace: BODY, fontSize: 12.5, color: NAVY, margin: 0, paraSpaceAfter: 4 });
  s.addText("Caminhões e ônibus: ~6% da frota e quase metade das emissões.", { x: 7.75, y: 5.5, w: 4.7, h: 0.45, fontFace: BODY, bold: true, fontSize: 11.5, color: TEAL, margin: 0 });
  band(s, "gastar menos diesel significa emitir menos carbono, e o piloto vai medir quanto.", false, 6.2);
  src(s, "Fonte: Inventário Nacional de Emissões (IEMA/MMA/MT), via Mundo Logística. tCO₂e = toneladas de CO₂ equivalente. Os 4.176 t e as barras usam a frota sintética de 120 veículos e o fator de 2,6 kgCO₂e/l, premissa a trocar pelo oficial do GHG Protocol. São ilustrações, não metas.");
  note(s, "ESG (40s). Caminhoes emitem 40% do CO2 do transporte rodoviario. O CO2 do diesel cai na mesma proporcao do consumo: cada 1% de diesel evitado reduz cerca de 1% das emissoes da frota. Por isso nao prometemos percentual de ESG antes de medir. O piloto mede litros antes e depois. Os numeros do grafico sao ilustracoes sobre a frota de demonstracao.");
}

/* 10 MODELO DE NEGOCIO */
{
  const s = slide(false);
  kicker(s, "Modelo de negócio");
  title(s, "Modelo híbrido: mensalidade menor mais parte da economia comprovada");
  card(s, 0.6, 2.0, 4.6, 3.55, NAVY, NAVY);
  s.addText("R$ 29,90 a 49,90", { x: 0.85, y: 2.15, w: 4.2, h: 0.8, fontFace: HEAD, bold: true, fontSize: 32, color: WHITE, margin: 0 });
  s.addText("por veículo por mês (assinatura SaaS)", { x: 0.85, y: 2.95, w: 4.2, h: 0.35, fontFace: BODY, fontSize: 14, color: TEAL_L, margin: 0 });
  s.addText("R$ 49,90 com 100 veículos e R$ 29,90 com 1.000, mais R$ 7.500 de implantação.", { x: 0.85, y: 3.4, w: 4.2, h: 0.65, fontFace: BODY, fontSize: 12, color: MUTED_D, margin: 0, lineSpacing: 16 });
  s.addText("+ 15% da economia comprovada (faixa de 10 a 20%)", { x: 0.85, y: 4.15, w: 4.2, h: 0.6, fontFace: BODY, bold: true, fontSize: 14, color: TEAL_L, margin: 0, lineSpacing: 18 });
  s.addText("SaaS: assinatura em vez de compra, com receita que se repete todo mês. Preços são hipóteses não validadas.", { x: 0.85, y: 4.85, w: 4.2, h: 0.6, fontFace: BODY, fontSize: 10.5, color: MUTED_D, margin: 0, lineSpacing: 14 });
  const hdr = ["Modelo de cobrança", "Vantagem", "Risco"], cx = [5.5, 7.55, 10.15], cwid = [2.0, 2.55, 2.55];
  hdr.forEach((h, i) => s.addText(h.toUpperCase(), { x: cx[i] + 0.1, y: 2.0, w: cwid[i] - 0.1, h: 0.3, fontFace: BODY, bold: true, fontSize: 9.5, charSpacing: 1, color: MUTED, margin: 0 }));
  const mod = [["Por veículo por mês", "Receita previsível, simples de vender", "Cliente paga mesmo sem resultado", 0], ["Por módulo", "Entrada barata e venda adicional", "Fragmenta o valor, mais complexidade comercial", 0], ["Por economia gerada", "Risco zero para o cliente", "Exige baseline auditável, receita volátil", 0], ["Híbrido (recomendado)", "Alinha interesses e reduz a barreira de entrada", "Contrato mais complexo", 1]];
  mod.forEach((r, i) => {
    const y = 2.35 + i * 0.8, hl = r[3] === 1;
    s.addShape("roundRect", { x: 5.5, y, w: 7.2, h: 0.72, rectRadius: 0.08, fill: { color: hl ? "E3F1F2" : GRAY_BG }, line: { color: hl ? TEAL : GRAY_LN, width: hl ? 1.5 : 1 } });
    s.addText(r[0], { x: cx[0] + 0.1, y, w: cwid[0] - 0.15, h: 0.72, valign: "middle", fontFace: BODY, bold: true, fontSize: 12, color: hl ? TEAL : NAVY, margin: 0 });
    s.addText(r[1], { x: cx[1] + 0.1, y, w: cwid[1] - 0.15, h: 0.72, valign: "middle", fontFace: BODY, fontSize: 10.5, color: NAVY, margin: 0, lineSpacing: 13 });
    s.addText(r[2], { x: cx[2] + 0.1, y, w: cwid[2] - 0.15, h: 0.72, valign: "middle", fontFace: BODY, fontSize: 10.5, color: MUTED, margin: 0, lineSpacing: 13 });
  });
  s.addText("Meta em 18 meses: 1.000 veículos pagantes, ou R$ 0,36 a 0,6 mi por ano de assinatura, mais 15% da economia comprovada.", { x: 0.6, y: 5.8, w: 12, h: 0.35, fontFace: HEAD, italic: true, fontSize: 13, color: NAVY, margin: 0 });
  band(s, "o cliente paga pouco para entrar e divide conosco a economia que a IA provar.", false);
  note(s, "Modelo (35s). Comparamos quatro formas de cobrar e recomendamos a hibrida: mensalidade menor, de R$ 29,90 a R$ 49,90 por veiculo conforme o tamanho da frota, mais 15% da economia comprovada. Os precos sao hipoteses nao validadas. Com 1.000 veiculos pagantes, a assinatura gera de R$ 0,36 a R$ 0,6 milhao por ano.");
}

/* 11 DIFERENCIAL */
{
  const s = slide(false);
  kicker(s, "Diferencial competitivo");
  title(s, "O diferencial não é ter IA: é integrar, priorizar por R$ e provar a economia");
  const x0 = 0.6, cw = [2.0, 5.0, 5.1], y0 = 2.0;
  const hdr = ["", "Concorrentes (exemplo: Cobli)", "FleetMind"];
  const rows = [
    ["Cliente-alvo", "~5.000 clientes, 85% com frotas abaixo de 250 veículos", "Frotas de 100 a 2.000 veículos"],
    ["Tecnologia", "Câmera com IA (fadiga, celular, distância) e chat com IA generativa no painel, previsto", "Integra vários fornecedores e prioriza os alertas por impacto em R$"],
    ["Prova de economia", "Alegação de até 20% menos consumo, sem metodologia divulgada", "Economia medida com baseline auditável, com cobrança ligada ao resultado"],
    ["Cobrança", "Não divulgada", "Mensalidade menor mais 15% da economia comprovada"],
  ];
  let cxs = [x0, x0 + cw[0], x0 + cw[0] + cw[1]];
  hdr.forEach((h, i) => {
    s.addShape("rect", { x: cxs[i], y: y0, w: cw[i], h: 0.5, fill: { color: i === 2 ? TEAL : (i === 1 ? NAVY : WHITE) }, line: { color: i === 0 ? WHITE : WHITE, width: 0.5 } });
    s.addText(h, { x: cxs[i] + 0.1, y: y0, w: cw[i] - 0.2, h: 0.5, valign: "middle", fontFace: BODY, bold: true, fontSize: 12, color: WHITE, margin: 0 });
  });
  rows.forEach((r, ri) => {
    const y = y0 + 0.5 + ri * 0.8;
    r.forEach((cell, ci) => {
      s.addShape("rect", { x: cxs[ci], y, w: cw[ci], h: 0.8, fill: { color: ci === 2 ? "E3F1F2" : (ci === 0 ? GRAY_BG : WHITE) }, line: { color: GRAY_LN, width: 0.5 } });
      s.addText(cell, { x: cxs[ci] + 0.12, y, w: cw[ci] - 0.24, h: 0.8, valign: "middle", fontFace: BODY, bold: ci === 0, fontSize: ci === 0 ? 12 : 11.5, color: ci === 2 ? NAVY : (ci === 0 ? NAVY : MUTED), margin: 0, lineSpacing: 14 });
    });
  });
  s.addText("Como a Cobli caminha para IA generativa, o nosso diferencial é integração multifornecedor, priorização por R$ e prova de economia. A levantar: Michelin Connected Fleet, Sascar e Geotab.", { x: 0.6, y: 5.8, w: 12, h: 0.4, fontFace: HEAD, italic: true, fontSize: 12.5, color: NAVY, margin: 0, lineSpacing: 16 });
  s.addText("Baseline auditável = medição antes do uso, que serve de comparação para provar a economia. Fontes: Convergência Digital (jun/2024) e Mundo Logística (set/2022).", { x: 0.6, y: 6.2, w: 12, h: 0.25, fontFace: BODY, fontSize: 10, color: MUTED, margin: 0 });
  band(s, "outros mostram dados e câmeras; o FleetMind prova em reais quanto a frota economizou.", false, 6.5);
  note(s, "Diferencial (35s). O concorrente mais documentado e a Cobli, forte em frotas pequenas e camera com IA. Como ela caminha para IA generativa, nosso diferencial nao pode ser ter IA. E integrar varios fornecedores, priorizar alertas por impacto em reais e provar a economia com baseline auditavel. A alegacao de ate 20% menos consumo e do fornecedor e nao tem metodologia divulgada.");
}

/* 12 ROADMAP */
{
  const s = slide(false);
  kicker(s, "Validação e implantação");
  title(s, "Do protótipo funcionando ao ROI comprovado");
  const st = [["Hoje", "Protótipo no ar: dashboard, API, IA e agente", true], ["Piloto", "20 a 50 veículos, 90 a 120 dias", false], ["Medição", "Antes × depois: diesel, manutenção, paradas e custo de servir", false], ["Prova de ROI", "Resultado documentado com o cliente", false], ["Escala", "Contrato Enterprise e expansão", false]];
  s.addShape("line", { x: 1.6, y: 2.65, w: 9.9, h: 0, line: { color: GRAY_LN, width: 2 } });
  st.forEach((r, i) => {
    const cx = 0.6 + i * 2.5;
    s.addShape("oval", { x: cx + 0.7, y: 2.3, w: 0.7, h: 0.7, fill: { color: r[2] ? TEAL : (i === 3 ? WARM : NAVY) }, line: { type: "none" } });
    s.addText(r[2] ? "✓" : String(i), { x: cx + 0.7, y: 2.3, w: 0.7, h: 0.7, align: "center", valign: "middle", fontFace: HEAD, bold: true, fontSize: 20, color: WHITE, margin: 0 });
    s.addText(r[0], { x: cx, y: 3.2, w: 2.1, h: 0.4, align: "center", fontFace: HEAD, bold: true, fontSize: 15, color: NAVY, margin: 0 });
    s.addText(r[1], { x: cx, y: 3.65, w: 2.1, h: 0.9, align: "center", fontFace: BODY, fontSize: 11.5, color: MUTED, margin: 0, lineSpacing: 14 });
  });
  card(s, 0.6, 4.6, 12.1, 1.7, NAVY, NAVY);
  s.addText("Já entregue no protótipo", { x: 0.9, y: 4.68, w: 5, h: 0.35, fontFace: HEAD, bold: true, fontSize: 14, color: TEAL_L, margin: 0 });
  s.addText([
    { text: "Painel Operacional com agente de ação e escalada para humano", options: { bullet: true, breakLine: true } },
    { text: "Modelos preditivos de falha e de risco do motorista", options: { bullet: true, breakLine: true } },
    { text: "Abas de Economia & ROI e de ESG com premissas editáveis", options: { bullet: true, breakLine: true } },
    { text: "Publicado na nuvem, com link compartilhável", options: { bullet: true } },
  ], { x: 0.9, y: 5.05, w: 11.4, h: 1.2, fontFace: BODY, fontSize: 12, color: WHITE, margin: 0, paraSpaceAfter: 2 });
  band(s, "o protótipo já funciona; agora provamos o retorno em um piloto real com poucos veículos.", false);
  note(s, "Validacao (40s). Nao vamos construir tudo de uma vez. O prototipo ja esta no ar. O proximo passo e um piloto de 90 a 120 dias para medir antes e depois e provar o ROI com um cliente real.");
}

/* 13 RISCOS */
{
  const s = slide(false);
  kicker(s, "Riscos e mitigações");
  title(s, "Os três riscos principais e como tratamos cada um");
  const r = [
    ["Adoção e confiança", "Motoristas e gestores podem desconfiar de decisões da IA.", "Piloto com métricas abertas, humano com decisão final e IA que recomenda antes de agir sozinha."],
    ["Qualidade e integração de dados", "Telemetria de fabricantes diferentes e conectividade instável nas rodovias.", "APIs abertas com parceiros, MVP só com dados essenciais e verificação cruzada de fontes externas, como redes sociais."],
    ["Dados do motorista e responsabilidade", "Dados de motorista são pessoais (LGPD) e podem ser usados de forma punitiva. Quem responde por uma recomendação da IA?", "Dados usados para orientar, não para punir. Minimização, explicação com evidência e decisão final humana."],
  ];
  r.forEach((c, i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 2.0, 3.85, 4.0);
    s.addText(c[0], { x: x + 0.25, y: 2.15, w: 3.4, h: 0.6, fontFace: HEAD, bold: true, fontSize: 17, color: NAVY, margin: 0, valign: "top" });
    s.addText(c[1], { x: x + 0.25, y: 2.85, w: 3.4, h: 1.0, fontFace: BODY, fontSize: 12, color: MUTED, margin: 0, lineSpacing: 15 });
    s.addText("Mitigação", { x: x + 0.25, y: 3.95, w: 3.4, h: 0.3, fontFace: BODY, bold: true, fontSize: 11, color: TEAL, charSpacing: 1, margin: 0 });
    s.addText(c[2], { x: x + 0.25, y: 4.3, w: 3.4, h: 1.55, fontFace: BODY, fontSize: 12, color: NAVY, margin: 0, lineSpacing: 15 });
  });
  band(s, "conhecemos os três maiores riscos e já temos uma resposta para cada um.", false, 6.3);
  note(s, "Riscos (30s). Adocao, dados e responsabilidade. Para cada um ja temos uma mitigacao no desenho do produto e no plano de piloto.");
}

/* 14 O PEDIDO */
{
  const s = slide(true);
  kicker(s, "O investimento", true);
  title(s, "Buscamos R$ 1,5 mi para provar o ROI e chegar a 1.000 veículos", true);
  s.addChart(p.charts.DOUGHNUT, [{ name: "Uso", labels: ["Produto e IA", "Pilotos e implantação", "Comercial e parcerias", "Infra, segurança e LGPD", "Reserva"], values: [40, 25, 20, 10, 5] }], {
    x: 0.5, y: 2.0, w: 5.2, h: 4.1, holeSize: 55, chartColors: [TEAL, TEAL_L, "7FA8B5", "AFC3CC", "5A6C8C"],
    showLegend: true, legendPos: "b", legendColor: WHITE, legendFontSize: 11, showPercent: true, showValue: false, dataLabelColor: NAVY, dataLabelFontSize: 11, dataBorder: { pt: 1, color: NAVY },
  });
  const m = [["3 pilotos", "pelo menos 100 veículos em operação real"], ["1.000 veículos pagantes", "R$ 0,36 a 0,6 mi por ano de assinatura, mais 15% da economia"], ["ROI medido e publicado", "resultado de antes × depois com clientes"], ["1 parceria estratégica", "montadora, telemetria ou seguradora"]];
  s.addText("Metas em 18 meses", { x: 6.2, y: 2.0, w: 6, h: 0.4, fontFace: HEAD, bold: true, fontSize: 17, color: TEAL_L, margin: 0 });
  m.forEach((r, i) => {
    const y = 2.5 + i * 0.87;
    s.addShape("roundRect", { x: 6.2, y, w: 6.5, h: 0.77, rectRadius: 0.1, fill: { color: NAVY2 }, line: { color: "24406E", width: 1 } });
    s.addText(r[0], { x: 6.4, y: y + 0.06, w: 6.1, h: 0.35, fontFace: HEAD, bold: true, fontSize: 15, color: WHITE, margin: 0 });
    s.addText(r[1], { x: 6.4, y: y + 0.41, w: 6.1, h: 0.3, fontFace: BODY, fontSize: 12, color: MUTED_D, margin: 0 });
  });
  band(s, "R$ 1,5 mi leva o produto de protótipo a 1.000 veículos pagantes e ao ROI provado em 18 meses.", true, 6.25);
  src(s, "Rodada = captação de recursos de investidores. Proposta da equipe, a ajustar na negociação. Uso: produto e IA 40%, pilotos 25%, comercial 20%, infraestrutura e segurança 10%, reserva 5%.", true);
  note(s, "O pedido (45s). Propomos uma rodada de R$ 1,5 milhao para 18 meses. 40% em produto e IA, 25% em pilotos e implantacao, 20% em comercial e parcerias. Ao final: 3 pilotos, 1.000 veiculos pagantes e o ROI medido. O valor e uma proposta da equipe, aberta a negociacao.");
}

/* 15 ENCERRAMENTO */
{
  const s = slide(true);
  s.addImage({ path: LOGO_W, x: 0.8, y: 1.0, w: 1.5, h: 1.5 * RATIO });
  s.addText("O futuro da gestão de frotas não será apenas saber onde cada veículo está.", { x: 0.8, y: 2.1, w: 11.6, h: 1.0, fontFace: HEAD, bold: true, fontSize: 28, color: WHITE, margin: 0, lineSpacing: 34 });
  s.addText("Será saber o que está acontecendo, o que vai acontecer e qual decisão tomar antes que o problema aconteça.", { x: 0.8, y: 3.2, w: 11.2, h: 1.0, fontFace: HEAD, italic: true, fontSize: 20, color: TEAL_L, margin: 0, lineSpacing: 26 });
  s.addShape("roundRect", { x: 0.8, y: 4.65, w: 11.7, h: 1.25, rectRadius: 0.1, fill: { color: NAVY2 }, line: { color: "24406E", width: 1 } });
  s.addText([{ text: "Convite: ", options: { bold: true, color: TEAL_L } }, { text: "transportadoras parceiras para o piloto, parceiros tecnológicos estratégicos e investidores para construir com a gente a camada de inteligência do transporte.", options: { color: WHITE } }], { x: 1.1, y: 4.65, w: 11.1, h: 1.25, valign: "middle", fontFace: BODY, fontSize: 15, margin: 0, lineSpacing: 20 });
  s.addText("FleetMind AI", { x: 0.8, y: 6.25, w: 6, h: 0.5, fontFace: HEAD, bold: true, fontSize: 24, color: WHITE, margin: 0 });
  s.addText("A inteligência que move o transporte.", { x: 4.2, y: 6.33, w: 8, h: 0.4, fontFace: BODY, italic: true, fontSize: 14, color: TEAL_L, margin: 0 });
  note(s, "Encerramento (30s). ERPs organizaram os recursos da empresa e CRMs organizaram os clientes. O FleetMind quer organizar a decisao operacional das frotas. Convidamos transportadoras, parceiros e investidores a construir isso conosco.");
}

p.writeFile({ fileName: "FleetMind_AI_Apresentacao_Executiva.pptx" }).then(() => console.log("ok", n));
