const pptxgen = require("pptxgenjs");

// ---------- Marca FleetMind AI ----------
const NAVY = "001028", NAVY2 = "0C2440", TEAL = "007880", TEAL_L = "4FD1D9";
const WARM = "C9622A", WHITE = "FFFFFF", GRAY_BG = "E9EEF2", GRAY_LN = "D6DEE4";
const MUTED = "4A5560", MUTED_D = "AFC3CC";
const HEAD = "Cambria", BODY = "Calibri";
const TOTAL = 17;

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
    ["15,5%", "do PIB é custo logístico no Brasil. Nos EUA são 8,8%.", "ILOS, 2025", TEAL],
    ["20%", "das frotas brasileiras usam telemetria avançada. Nos EUA são 60%.", "Frotacia / Frost & Sullivan", TEAL],
  ];
  items.forEach((it, i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 2.2, 3.85, 3.6);
    s.addText(it[0], { x, y: 2.4, w: 3.85, h: 1.3, align: "center", fontFace: HEAD, fontSize: 60, bold: true, color: it[3], margin: 0 });
    s.addText(it[1], { x: x + 0.3, y: 3.8, w: 3.25, h: 1.5, align: "center", fontFace: BODY, fontSize: 15, color: NAVY, margin: 0, lineSpacing: 20 });
    s.addText(it[2], { x: x + 0.3, y: 5.3, w: 3.25, h: 0.35, align: "center", fontFace: BODY, italic: true, fontSize: 10, color: MUTED, margin: 0 });
  });
  s.addText("GPS, telemetria, câmeras, TMS e ERP geram milhares de eventos por dia. Falta transformar isso em uma decisão certa, no momento certo.", { x: 0.6, y: 6.1, w: 12, h: 0.6, fontFace: HEAD, italic: true, fontSize: 16, color: NAVY, margin: 0 });
  note(s, "Problema (40s). O transporte rodoviario concentra mortes e custo. As empresas ja tem dados, mas a decisao e reativa: o gestor descobre o problema depois que ele aconteceu.");
}

/* 3 MERCADO */
{
  const s = slide(false);
  kicker(s, "Oportunidade");
  title(s, "Um mercado grande e ainda pouco digitalizado");
  const f = [
    ["TAM", "≈ R$ 10,5 bi/ano", "2,24 mi de caminhões no Brasil × assinatura anual de R$ 4.680", 7.4, NAVY],
    ["SAM", "≈ R$ 5,5 bi/ano", "Tecnologia de gestão de frotas no Brasil (≈ US$ 1 bi, 2024)", 5.6, NAVY2],
    ["SOM", "R$ 30–50 mi/ano", "Meta em 3 anos: menos de 1% do SAM (6 a 10 mil veículos)", 3.8, TEAL],
  ];
  f.forEach((r, i) => {
    const w = r[3], x = 0.6 + (7.4 - w) / 2, y = 2.1 + i * 1.5;
    s.addShape("roundRect", { x, y, w, h: 1.3, rectRadius: 0.1, fill: { color: r[4] }, line: { type: "none" } });
    s.addText(r[0], { x: x + 0.25, y: y + 0.12, w: 1.2, h: 0.4, fontFace: HEAD, bold: true, fontSize: 16, color: TEAL_L, margin: 0 });
    s.addText(r[1], { x: x + 0.2, y: y + 0.1, w: w - 0.4, h: 0.4, align: "right", fontFace: HEAD, bold: true, fontSize: 17, color: WHITE, margin: 0 });
    s.addText(r[2], { x: x + 0.25, y: y + 0.6, w: w - 0.5, h: 0.6, fontFace: BODY, fontSize: 11, color: "C7D2E8", margin: 0, lineSpacing: 14 });
  });
  card(s, 8.4, 2.1, 4.3, 4.3);
  s.addText("Mercado global", { x: 8.7, y: 2.3, w: 3.8, h: 0.4, fontFace: HEAD, bold: true, fontSize: 16, color: NAVY, margin: 0 });
  s.addText("US$ 37,7 bi → 70,3 bi", { x: 8.7, y: 2.8, w: 3.8, h: 0.6, fontFace: HEAD, bold: true, fontSize: 24, color: TEAL, margin: 0 });
  s.addText("gestão de frotas, 2025 a 2030 (13,3% ao ano).", { x: 8.7, y: 3.45, w: 3.8, h: 0.6, fontFace: BODY, fontSize: 12, color: MUTED, margin: 0 });
  s.addText("US$ 8,5 bi → 19,8 bi", { x: 8.7, y: 4.2, w: 3.8, h: 0.6, fontFace: HEAD, bold: true, fontSize: 24, color: TEAL, margin: 0 });
  s.addText("IA aplicada a frotas, 2025 a 2034.", { x: 8.7, y: 4.85, w: 3.8, h: 0.5, fontFace: BODY, fontSize: 12, color: MUTED, margin: 0 });
  src(s, "Fontes: Sindipeças (2024); Frost & Sullivan via Frotacia; MarketsandMarkets e Precedence Research. TAM e SOM são estimativas da equipe.");
  note(s, "Mercado (40s). O Brasil tem 2,24 milhoes de caminhoes e so 20% das frotas usam telemetria avancada. Esse espaco e a oportunidade. TAM, SAM e SOM sao estimativas da equipe baseadas em fontes publicas.");
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
  s.addText([{ text: "Não substitui telemetria, TMS ou rastreamento. ", options: { bold: true, color: WARM } }, { text: "Integra o que o cliente já usa e adiciona a inteligência que falta, sem trocar a operação.", options: { color: NAVY } }], { x: 0.9, y: 5.2, w: 11.5, h: 1.0, valign: "middle", fontFace: BODY, fontSize: 15, margin: 0 });
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
    const y = 2.0 + i * 1.5;
    card(s, 8.9, y, 3.8, 1.35);
    s.addText(r[0], { x: 9.1, y: y + 0.1, w: 3.4, h: 0.4, fontFace: HEAD, bold: true, fontSize: 14, color: TEAL, margin: 0 });
    s.addText(r[1], { x: 9.1, y: y + 0.5, w: 3.4, h: 0.8, fontFace: BODY, fontSize: 11.5, color: NAVY, margin: 0, lineSpacing: 14 });
  });
  s.addText("Dashboard no ar, ligado a uma API e a modelos de IA. Dados da demonstração: 120 veículos e 4.000 viagens sintéticos.", { x: 0.6, y: 6.2, w: 12, h: 0.5, fontFace: BODY, italic: true, fontSize: 12, color: MUTED, margin: 0 });
  note(s, "Produto (60s). Esta e a tela real. A IA ja decidiu e agiu sobre cada situacao. Quando o motorista nao responde ou o risco e critico, o proprio agente escala para um operador humano. Tudo fica registrado.");
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
    ["Veículo", "Telemetria, OBD, câmeras ADAS/DMS, sensores IoT", 1],
    ["Motorista", "Jornada, fadiga, comportamento, relatos por voz", 1],
    ["Operação", "TMS, ERP, manutenção, abastecimento, janelas de entrega", 1],
    ["Mercado e regulação", "ANP, preço de frete, ANTT, CONTRAN, LGPD", 0],
    ["Rede FleetMind", "Relatos dos motoristas e histórico de ações da IA", 1],
  ];
  cats.forEach((c, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 0.6 + col * 3.05, y = 2.0 + row * 1.5, live = c[2] === 1;
    card(s, x, y, 2.9, 1.35, live ? "E3F1F2" : GRAY_BG, live ? TEAL : GRAY_LN);
    s.addText(c[0], { x: x + 0.15, y: y + 0.08, w: 2.6, h: 0.35, fontFace: HEAD, bold: true, fontSize: 13.5, color: NAVY, margin: 0 });
    s.addText(c[1], { x: x + 0.15, y: y + 0.45, w: 2.6, h: 0.55, fontFace: BODY, fontSize: 10.5, color: MUTED, margin: 0, lineSpacing: 13 });
    s.addText(live ? "NO PROTÓTIPO (DADOS SIMULADOS)" : "PRÓXIMAS INTEGRAÇÕES", { x: x + 0.15, y: y + 1.02, w: 2.6, h: 0.25, fontFace: BODY, bold: true, fontSize: 8.5, charSpacing: 1, color: live ? TEAL : MUTED, margin: 0 });
  });
  s.addText("Mais de 100 bases mapeadas pela equipe. As integrações reais dependem de acordos, licenças e conformidade com a LGPD.", { x: 0.6, y: 6.5, w: 12, h: 0.4, fontFace: BODY, italic: true, fontSize: 12, color: MUTED, margin: 0 });
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
  s.addShape("roundRect", { x: 0.6, y: 4.45, w: 12.1, h: 1.15, rectRadius: 0.1, fill: { color: NAVY2 }, line: { color: "24406E", width: 1 } });
  s.addText([{ text: "Exemplo: ", options: { bold: true, color: TEAL_L } }, { text: "radar móvel reportado, chuva forte à frente e um acidente citado em rede social. Juntas, as três fontes elevam o risco do trecho, e o motorista recebe o desvio antes de chegar.", options: { color: WHITE } }], { x: 0.9, y: 4.45, w: 11.5, h: 1.15, valign: "middle", fontFace: BODY, fontSize: 14, margin: 0, lineSpacing: 19 });
  const b = ["Alerta antecipado ao motorista", "Rota mais segura e mais rápida", "Operação decide com contexto"];
  b.forEach((t, i) => s.addText(t, { x: 0.6 + i * 4.1, y: 5.95, w: 3.9, h: 0.5, fontFace: HEAD, bold: true, fontSize: 15, color: TEAL_L, margin: 0 }));
  s.addText("Informação de rede social só vira alerta depois de confirmação cruzada, para evitar boato.", { x: 0.6, y: 6.5, w: 12, h: 0.4, fontFace: BODY, italic: true, fontSize: 12, color: MUTED_D, margin: 0 });
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
    card(s, x, 2.1, 5.95, 3.7);
    s.addText(c[0], { x: x + 0.3, y: 2.3, w: 5.3, h: 0.45, fontFace: HEAD, bold: true, fontSize: 18, color: NAVY, margin: 0 });
    s.addText(c[1], { x: x + 0.3, y: 2.85, w: 5.3, h: 1.0, fontFace: HEAD, bold: true, fontSize: 48, color: TEAL, margin: 0 });
    s.addText(c[2], { x: x + 0.3, y: 3.95, w: 5.3, h: 0.9, fontFace: BODY, fontSize: 13, color: NAVY, margin: 0, lineSpacing: 17 });
    s.addText(c[3], { x: x + 0.3, y: 4.95, w: 5.3, h: 0.5, fontFace: BODY, bold: true, fontSize: 13, color: TEAL, margin: 0 });
  });
  s.addText("Resultados obtidos em dados sintéticos. Servem para provar a arquitetura e o método. O desempenho real será medido com dados de clientes no piloto.", { x: 0.6, y: 6.05, w: 12, h: 0.6, fontFace: BODY, italic: true, fontSize: 12, color: MUTED, margin: 0 });
  note(s, "IA preditiva (30s). Random Forest treinado em dados sinteticos. O objetivo e provar o metodo, nao prometer essa precisao em campo. O piloto mede o desempenho real.");
}

/* 8 ECONOMIA */
{
  const s = slide(false);
  kicker(s, "Valor econômico");
  title(s, "Retorno em 4 a 15 meses, mesmo no cenário conservador");
  s.addChart(p.charts.BAR, [{ name: "Economia anual (R$ mil)", labels: ["Conservador", "Base", "Otimista"], values: [541, 1091, 1768] }], {
    x: 0.6, y: 2.0, w: 6.4, h: 4.0, barDir: "col", chartColors: [TEAL], showValue: true, dataLabelFormatCode: "#,##0", dataLabelColor: NAVY, dataLabelFontSize: 12, dataLabelPosition: "outEnd",
    showTitle: true, title: "Economia anual estimada (R$ mil)", titleFontSize: 13, titleColor: NAVY, titleFontFace: BODY,
    catAxisLabelColor: NAVY, catAxisLabelFontSize: 12, valAxisLabelColor: MUTED, valAxisLabelFontSize: 10, valGridLine: { color: GRAY_LN, size: 0.5 }, catGridLine: { style: "none" }, showLegend: false, valAxisMaxVal: 2200,
  });
  const rows = [["", "Conserv.", "Base", "Otimista"], ["ROI no ano 1", "−17%", "67%", "171%"], ["Retorno do investimento", "14,5 meses", "7,2 meses", "4,4 meses"]];
  rows.forEach((r, ri) => r.forEach((cell, ci) => {
    const x = 7.3 + (ci === 0 ? 0 : 1.9 + (ci - 1) * 1.15), w = ci === 0 ? 1.9 : 1.15, y = 2.1 + ri * 0.7;
    s.addShape("rect", { x, y, w, h: 0.7, fill: { color: ri === 0 ? NAVY : (ci === 2 ? "DFF0F1" : WHITE) }, line: { color: GRAY_LN, width: 0.75 } });
    s.addText(cell, { x: x + 0.05, y, w: w - 0.1, h: 0.7, align: ci === 0 ? "left" : "center", valign: "middle", fontFace: BODY, fontSize: ri === 0 ? 11 : 12, bold: ri === 0 || ci === 2, color: ri === 0 ? WHITE : NAVY, margin: 0 });
  }));
  s.addText("Investimento do cliente no ano 1: R$ 652 mil (120 veículos × R$ 390/mês + R$ 90 mil de implantação).", { x: 7.3, y: 4.35, w: 5.4, h: 0.7, fontFace: BODY, fontSize: 12, color: NAVY, margin: 0, lineSpacing: 16 });
  s.addText("Combustível, manutenção corretiva evitada, atrasos e sinistros evitados. O cenário conservador só fecha o caixa no segundo ano.", { x: 7.3, y: 5.1, w: 5.4, h: 0.9, fontFace: BODY, fontSize: 12, color: MUTED, margin: 0, lineSpacing: 16 });
  src(s, "HIPÓTESE a validar no piloto de 90–120 dias: ganho de 2 a 7% em combustível, 30 a 70% das falhas evitáveis, 10 a 35% de atrasos. Custos-base vêm dos dados da frota de demonstração. Combustível = 30–35% do custo operacional (CNT/NTC&Logística).");
  note(s, "Valor (50s). Mesmo no cenario conservador o cliente recupera o investimento em cerca de 14 meses. No base, 7 meses. Os percentuais de ganho sao hipoteses que o piloto vai validar, e o dashboard permite ajustar todas as premissas.");
}

/* 9 ESG */
{
  const s = slide(false);
  kicker(s, "Impacto ESG");
  title(s, "Menos diesel queimado, menos carbono emitido");
  const k = [["4.176 t", "CO₂e por ano da frota (linha de base)"], ["0,929 kg", "CO₂e por km rodado"], ["168,5 t", "CO₂e evitadas por ano, cenário base"], ["64.824 l", "de diesel não consumidos por ano"]];
  k.forEach((r, i) => {
    const x = 0.6 + i * 3.1, hl = i === 2;
    card(s, x, 2.0, 2.9, 1.5, hl ? TEAL : GRAY_BG, hl ? TEAL : GRAY_LN);
    s.addText(r[0], { x: x + 0.15, y: 2.15, w: 2.6, h: 0.7, fontFace: HEAD, bold: true, fontSize: 28, color: hl ? WHITE : NAVY, margin: 0 });
    s.addText(r[1], { x: x + 0.15, y: 2.85, w: 2.6, h: 0.6, fontFace: BODY, fontSize: 11, color: hl ? "E3F1F2" : MUTED, margin: 0, lineSpacing: 14 });
  });
  s.addChart(p.charts.BAR, [{ name: "tCO2e evitadas", labels: ["Conservador", "Base", "Otimista"], values: [84.3, 168.5, 294.9] }], {
    x: 0.6, y: 3.7, w: 6.6, h: 3.1, barDir: "bar", chartColors: [TEAL], showValue: true, dataLabelFormatCode: "0.0", dataLabelColor: NAVY, dataLabelFontSize: 11, dataLabelPosition: "outEnd",
    showTitle: true, title: "CO₂e evitado por cenário (t/ano)", titleFontSize: 12, titleColor: NAVY, titleFontFace: BODY,
    catAxisLabelColor: NAVY, catAxisLabelFontSize: 11, valAxisLabelColor: MUTED, valAxisLabelFontSize: 9, valGridLine: { color: GRAY_LN, size: 0.5 }, catGridLine: { style: "none" }, showLegend: false, valAxisMaxVal: 360,
  });
  card(s, 7.5, 3.7, 5.2, 3.1);
  s.addText("De onde vem a redução", { x: 7.75, y: 3.85, w: 4.7, h: 0.4, fontFace: HEAD, bold: true, fontSize: 15, color: NAVY, margin: 0 });
  s.addText([
    { text: "Rotas e desvios em acidente, clima e trânsito", options: { bullet: true, breakLine: true } },
    { text: "Condução orientada em tempo real", options: { bullet: true, breakLine: true } },
    { text: "Menos marcha lenta em atrasos", options: { bullet: true, breakLine: true } },
    { text: "Manutenção preditiva do motor", options: { bullet: true } },
  ], { x: 7.75, y: 4.3, w: 4.7, h: 1.7, fontFace: BODY, fontSize: 13, color: NAVY, margin: 0, paraSpaceAfter: 6 });
  s.addText("≈ 7.700 árvores equivalentes por ano (cenário base)", { x: 7.75, y: 6.1, w: 4.7, h: 0.5, fontFace: BODY, bold: true, fontSize: 12, color: TEAL, margin: 0 });
  src(s, "Escopo 1 (diesel). Fator de 2,6 kgCO₂e/l é premissa a trocar pelo fator oficial do Programa Brasileiro GHG Protocol. Base sintética de 120 veículos. Equivalência de árvores é ilustrativa.");
  note(s, "ESG (40s). O produto tambem reduz emissoes. Na base de demonstracao, a frota emite 4.176 toneladas de CO2e por ano. No cenario base evitamos 168 toneladas. O fator de emissao e uma premissa que sera substituida pelo oficial antes de qualquer divulgacao.");
}

/* 10 MODELO DE NEGOCIO */
{
  const s = slide(false);
  kicker(s, "Modelo de negócio");
  title(s, "SaaS B2B com receita recorrente por veículo");
  card(s, 0.6, 2.0, 4.6, 4.3, NAVY, NAVY);
  s.addText("R$ 390", { x: 0.9, y: 2.3, w: 4, h: 1.0, fontFace: HEAD, bold: true, fontSize: 54, color: WHITE, margin: 0 });
  s.addText("por veículo por mês", { x: 0.9, y: 3.3, w: 4, h: 0.4, fontFace: BODY, fontSize: 16, color: TEAL_L, margin: 0 });
  s.addText("R$ 4.680 por veículo por ano.", { x: 0.9, y: 4.0, w: 4, h: 0.4, fontFace: BODY, fontSize: 14, color: MUTED_D, margin: 0 });
  s.addText("Preço de partida, a validar com clientes. É menos de 1% do custo operacional anual de um caminhão pesado.", { x: 0.9, y: 4.6, w: 4, h: 1.3, fontFace: BODY, fontSize: 12, color: MUTED_D, margin: 0, lineSpacing: 16 });
  const rev = [["Assinatura por veículo e por usuário", "Receita recorrente principal"], ["Implantação e customizações", "Receita de entrada por cliente"], ["Integrações e APIs premium", "Expansão dentro do cliente"], ["Marketplace de parceiros", "Seguradoras, montadoras, telemetria"], ["Dashboards executivos e IA como serviço", "Consultoria em dados"]];
  rev.forEach((r, i) => {
    const y = 2.0 + i * 0.86;
    card(s, 5.5, y, 7.2, 0.74);
    s.addText(r[0], { x: 5.7, y, w: 3.9, h: 0.74, valign: "middle", fontFace: BODY, bold: true, fontSize: 13, color: NAVY, margin: 0 });
    s.addText(r[1], { x: 9.6, y, w: 3.0, h: 0.74, valign: "middle", fontFace: BODY, fontSize: 11.5, color: MUTED, margin: 0 });
  });
  s.addText("Meta em 18 meses: 500 veículos pagantes, ou R$ 2,34 mi de receita recorrente anual (500 × R$ 390 × 12).", { x: 0.6, y: 6.5, w: 12, h: 0.4, fontFace: HEAD, italic: true, fontSize: 14, color: NAVY, margin: 0 });
  note(s, "Modelo (35s). Assinatura por veiculo por mes, complementada por implantacao, integracoes, marketplace e servicos de IA. Com 500 veiculos pagantes chegamos a R$ 2,34 milhoes de receita recorrente anual.");
}

/* 11 DIFERENCIAL */
{
  const s = slide(false);
  kicker(s, "Diferencial competitivo");
  title(s, "Não é mais um rastreador: é uma IA que age");
  const cols = ["", "Rastreamento", "Telemetria", "TMS", "Vídeo", "FleetMind"];
  const rows = [["Localização em tempo real", 1, 1, 0, 0, 1], ["Dados de condução e motor", 0, 1, 0, 0, 1], ["Gestão de fretes e operação", 0, 0, 1, 0, 1], ["Visão computacional (fadiga/risco)", 0, 0, 0, 1, 1], ["IA preditiva e generativa", 0, 0, 0, 0, 1], ["Agente que age e escala para humano", 0, 0, 0, 0, 1], ["Aprende com a rede de veículos", 0, 0, 0, 0, 1]];
  const x0 = 0.6, c0 = 4.4, cw = 1.5, y0 = 2.0, rh = 0.5;
  cols.forEach((c, i) => {
    const x = i === 0 ? x0 : x0 + c0 + (i - 1) * cw, w = i === 0 ? c0 : cw;
    s.addShape("rect", { x, y: y0, w, h: 0.55, fill: { color: i === 5 ? TEAL : NAVY }, line: { color: WHITE, width: 0.5 } });
    s.addText(c, { x, y: y0, w, h: 0.55, align: "center", valign: "middle", fontFace: BODY, bold: true, fontSize: 11, color: WHITE, margin: 0 });
  });
  rows.forEach((r, ri) => {
    const y = y0 + 0.55 + ri * rh;
    s.addShape("rect", { x: x0, y, w: c0, h: rh, fill: { color: ri % 2 ? GRAY_BG : WHITE }, line: { color: GRAY_LN, width: 0.5 } });
    s.addText(r[0], { x: x0 + 0.12, y, w: c0 - 0.2, h: rh, valign: "middle", fontFace: BODY, fontSize: 12, color: NAVY, margin: 0 });
    for (let ci = 1; ci <= 5; ci++) {
      const x = x0 + c0 + (ci - 1) * cw;
      s.addShape("rect", { x, y, w: cw, h: rh, fill: { color: ci === 5 ? "E3F1F2" : (ri % 2 ? GRAY_BG : WHITE) }, line: { color: GRAY_LN, width: 0.5 } });
      s.addText(r[ci] ? "✓" : "–", { x, y, w: cw, h: rh, align: "center", valign: "middle", fontFace: BODY, bold: true, fontSize: 14, color: r[ci] ? TEAL : "C3CCDD", margin: 0 });
    }
  });
  s.addText("Gestão aumentada: o gestor lidera e decide, a IA monitora e recomenda 24 horas por dia. Não substitui o gestor, amplia a capacidade dele.", { x: 0.6, y: 6.2, w: 12, h: 0.6, fontFace: HEAD, italic: true, fontSize: 15, color: NAVY, margin: 0, lineSpacing: 20 });
  note(s, "Diferencial (35s). Cada categoria resolve uma parte do problema. O FleetMind combina tudo e adiciona o agente que age e a inteligencia coletiva. O modelo e de gestao aumentada: a IA apoia o gestor, nao o substitui.");
}

/* 12 ROADMAP */
{
  const s = slide(false);
  kicker(s, "Validação e implantação");
  title(s, "Do protótipo funcionando ao ROI comprovado");
  const st = [["Hoje", "Protótipo no ar: dashboard, API, IA e agente", true], ["Piloto", "20 a 50 veículos, 90 a 120 dias", false], ["Medição", "Antes × depois: risco, combustível, manutenção", false], ["Prova de ROI", "Resultado documentado com o cliente", false], ["Escala", "Contrato Enterprise e expansão", false]];
  s.addShape("line", { x: 1.6, y: 2.65, w: 9.9, h: 0, line: { color: GRAY_LN, width: 2 } });
  st.forEach((r, i) => {
    const cx = 0.6 + i * 2.5;
    s.addShape("oval", { x: cx + 0.7, y: 2.3, w: 0.7, h: 0.7, fill: { color: r[2] ? TEAL : (i === 3 ? WARM : NAVY) }, line: { type: "none" } });
    s.addText(r[2] ? "✓" : String(i), { x: cx + 0.7, y: 2.3, w: 0.7, h: 0.7, align: "center", valign: "middle", fontFace: HEAD, bold: true, fontSize: 20, color: WHITE, margin: 0 });
    s.addText(r[0], { x: cx, y: 3.2, w: 2.1, h: 0.4, align: "center", fontFace: HEAD, bold: true, fontSize: 15, color: NAVY, margin: 0 });
    s.addText(r[1], { x: cx, y: 3.65, w: 2.1, h: 0.9, align: "center", fontFace: BODY, fontSize: 11.5, color: MUTED, margin: 0, lineSpacing: 14 });
  });
  card(s, 0.6, 4.85, 12.1, 1.75, NAVY, NAVY);
  s.addText("Já entregue no protótipo", { x: 0.9, y: 4.95, w: 5, h: 0.4, fontFace: HEAD, bold: true, fontSize: 15, color: TEAL_L, margin: 0 });
  s.addText([
    { text: "Painel Operacional com agente de ação e escalada para humano", options: { bullet: true, breakLine: true } },
    { text: "Modelos preditivos de falha e de risco do motorista", options: { bullet: true, breakLine: true } },
    { text: "Abas de Economia & ROI e de ESG com premissas editáveis", options: { bullet: true, breakLine: true } },
    { text: "Publicado na nuvem, com link compartilhável", options: { bullet: true } },
  ], { x: 0.9, y: 5.35, w: 11.4, h: 1.2, fontFace: BODY, fontSize: 12.5, color: WHITE, margin: 0, paraSpaceAfter: 3 });
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
    ["Responsabilidade e regulação", "Quem responde por uma recomendação da IA? Dados de motoristas exigem LGPD.", "Humano decide nas ações críticas, contratos claros e conformidade com a LGPD desde o desenho."],
  ];
  r.forEach((c, i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 2.1, 3.85, 4.3);
    s.addText(c[0], { x: x + 0.25, y: 2.3, w: 3.4, h: 0.7, fontFace: HEAD, bold: true, fontSize: 17, color: NAVY, margin: 0, valign: "top" });
    s.addText(c[1], { x: x + 0.25, y: 3.05, w: 3.4, h: 1.1, fontFace: BODY, fontSize: 12.5, color: MUTED, margin: 0, lineSpacing: 16 });
    s.addText("Mitigação", { x: x + 0.25, y: 4.3, w: 3.4, h: 0.3, fontFace: BODY, bold: true, fontSize: 11, color: TEAL, charSpacing: 1, margin: 0 });
    s.addText(c[2], { x: x + 0.25, y: 4.65, w: 3.4, h: 1.6, fontFace: BODY, fontSize: 12.5, color: NAVY, margin: 0, lineSpacing: 16 });
  });
  note(s, "Riscos (30s). Adocao, dados e responsabilidade. Para cada um ja temos uma mitigacao no desenho do produto e no plano de piloto.");
}

/* 14 O PEDIDO */
{
  const s = slide(true);
  kicker(s, "O investimento", true);
  title(s, "Buscamos R$ 1,5 mi para provar o ROI e chegar a 500 veículos", true);
  s.addChart(p.charts.DOUGHNUT, [{ name: "Uso", labels: ["Produto e IA", "Pilotos e implantação", "Comercial e parcerias", "Infra, segurança e LGPD", "Reserva"], values: [40, 25, 20, 10, 5] }], {
    x: 0.5, y: 2.2, w: 5.2, h: 4.4, holeSize: 55, chartColors: [TEAL, TEAL_L, "7FA8B5", "AFC3CC", "5A6C8C"],
    showLegend: true, legendPos: "b", legendColor: WHITE, legendFontSize: 11, showPercent: true, showValue: false, dataLabelColor: NAVY, dataLabelFontSize: 11, dataBorder: { pt: 1, color: NAVY },
  });
  const m = [["3 pilotos", "pelo menos 100 veículos em operação real"], ["500 veículos pagantes", "R$ 2,34 mi de receita recorrente anual"], ["ROI medido e publicado", "resultado de antes × depois com clientes"], ["1 parceria estratégica", "montadora, telemetria ou seguradora"]];
  s.addText("Metas em 18 meses", { x: 6.2, y: 2.2, w: 6, h: 0.4, fontFace: HEAD, bold: true, fontSize: 17, color: TEAL_L, margin: 0 });
  m.forEach((r, i) => {
    const y = 2.75 + i * 0.98;
    s.addShape("roundRect", { x: 6.2, y, w: 6.5, h: 0.85, rectRadius: 0.1, fill: { color: NAVY2 }, line: { color: "24406E", width: 1 } });
    s.addText(r[0], { x: 6.4, y: y + 0.08, w: 6.1, h: 0.38, fontFace: HEAD, bold: true, fontSize: 15, color: WHITE, margin: 0 });
    s.addText(r[1], { x: 6.4, y: y + 0.45, w: 6.1, h: 0.35, fontFace: BODY, fontSize: 12, color: MUTED_D, margin: 0 });
  });
  src(s, "Proposta de captação da equipe, a ser ajustada na negociação. Distribuição: produto e IA 40%, pilotos 25%, comercial 20%, infraestrutura e segurança 10%, reserva 5%.", true);
  note(s, "O pedido (45s). Propomos uma rodada de R$ 1,5 milhao para 18 meses. 40% em produto e IA, 25% em pilotos e implantacao, 20% em comercial e parcerias. Ao final: 3 pilotos, 500 veiculos pagantes e o ROI medido. O valor e uma proposta da equipe, aberta a negociacao.");
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
