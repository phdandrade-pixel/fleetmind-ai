const pptxgen = require("pptxgenjs");

// ---------- Paleta oficial da marca FleetMind AI ----------
const NAVY = "001028";   // primaria (tipografia/simbolo)
const NAVY2 = "0C2440";  // navy secundario, para cards sobre fundo escuro
const CYAN = "007880";   // teal (detalhe tecnologico/acento)
const CORAL = "C9622A";  // acento quente complementar (usado com moderacao)
const WHITE = "FFFFFF";
const TEXT_MUTED_DARK = "AFC3CC"; // texto secundario sobre navy
const TEXT_DARK = "001028";
const TEXT_MUTED = "4A5560"; // cinza escuro (texto secundario oficial)
const CARD_BG = "E9EEF2";    // cinza claro de apoio (oficial)
const CARD_BORDER = "D6DEE4";

const FONT_HEAD = "Cambria";
const FONT_BODY = "Calibri";

function newDeck() {
  const p = new pptxgen();
  p.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in
  p.defineSlideMaster({
    title: "BLANK",
    background: { color: WHITE },
  });
  return p;
}

function darkSlide(p) {
  const s = p.addSlide();
  s.background = { color: NAVY };
  return s;
}
function lightSlide(p) {
  const s = p.addSlide();
  s.background = { color: WHITE };
  return s;
}

function kicker(s, text, opts = {}) {
  s.addText(text.toUpperCase(), {
    x: opts.x ?? 0.6, y: opts.y ?? 0.45, w: opts.w ?? 8, h: 0.4,
    fontFace: FONT_BODY, fontSize: 13, bold: true, color: opts.color ?? CYAN,
    charSpacing: 2, margin: 0,
  });
}

function pageNum(s, n, dark) {
  s.addText(`${n} / 8`, {
    x: 12.5, y: 7.05, w: 0.7, h: 0.3, fontFace: FONT_BODY, fontSize: 9,
    color: dark ? "5A6C8C" : "B7C1D6", align: "right", margin: 0,
  });
}

const ASSETS_DIR = "../assets";
const LOGO_ICON = `${ASSETS_DIR}/logo_icon_transparent.png`;      // navy+teal, para fundo claro
const LOGO_ICON_WHITE = `${ASSETS_DIR}/logo_icon_white.png`;      // branco, para fundo navy
const LOGO_ICON_RATIO = 280 / 580; // altura/largura do icone recortado

function logoMark(s, dark) {
  const w = 0.62, h = w * LOGO_ICON_RATIO;
  s.addImage({ path: dark ? LOGO_ICON_WHITE : LOGO_ICON, x: 12.15, y: 0.42, w, h });
}

const deck = newDeck();

/* ============================================================
   SLIDE 1 — A GRANDE DOR
   ============================================================ */
{
  const s = darkSlide(deck);
  kicker(s, "FleetMind AI  •  O problema", { color: CYAN });
  logoMark(s, true);

  s.addText("Grandes frotas não sofrem por falta de dado.\nSofrem por decisão tardia.", {
    x: 0.6, y: 0.95, w: 8.6, h: 1.6, fontFace: FONT_HEAD, fontSize: 30, bold: true,
    color: WHITE, margin: 0, lineSpacing: 34,
  });

  // Big stat callout
  s.addShape("roundRect", {
    x: 0.6, y: 2.75, w: 4.55, h: 3.5, rectRadius: 0.12, fill: { color: NAVY2 }, line: { color: "1E3358", width: 1 },
  });
  s.addText("53%", { x: 0.6, y: 2.9, w: 4.55, h: 1.3, align: "center", fontFace: FONT_HEAD, fontSize: 64, bold: true, color: CORAL, margin: 0 });
  s.addText("das mortes em rodovias federais em 2024 envolveram caminhões e ônibus\n— que são apenas 4% da frota circulante.", {
    x: 0.9, y: 4.15, w: 3.95, h: 1.9, align: "center", fontFace: FONT_BODY, fontSize: 13.5, color: TEXT_MUTED_DARK, margin: 0, lineSpacing: 18,
  });

  s.addShape("roundRect", {
    x: 5.35, y: 2.75, w: 4.55, h: 3.5, rectRadius: 0.12, fill: { color: NAVY2 }, line: { color: "1E3358", width: 1 },
  });
  s.addText("15,5%", { x: 5.35, y: 2.9, w: 4.55, h: 1.3, align: "center", fontFace: FONT_HEAD, fontSize: 64, bold: true, color: CYAN, margin: 0 });
  s.addText("do PIB brasileiro é consumido por custo logístico em 2025\n— quase o dobro dos EUA (8,8%).", {
    x: 5.65, y: 4.15, w: 3.95, h: 1.9, align: "center", fontFace: FONT_BODY, fontSize: 13.5, color: TEXT_MUTED_DARK, margin: 0, lineSpacing: 18,
  });

  // fragmented data icons row
  const icons = ["GPS", "Telemetria", "Câmeras", "TMS", "ERP", "Manutenção"];
  const iw = 1.5, gap = 0.15, startX = 10.35;
  icons.forEach((label, i) => {
    const y = 2.75 + i * 0.63;
    s.addShape("roundRect", { x: startX, y, w: 2.35, h: 0.5, rectRadius: 0.07, fill: { color: "17294D" }, line: { color: "24406E", width: 0.75 } });
    s.addText(label, { x: startX, y: y, w: 2.35, h: 0.5, align: "center", valign: "middle", fontFace: FONT_BODY, fontSize: 11.5, color: WHITE, margin: 0 });
  });
  s.addText("Dados fragmentados", { x: 10.35, y: 2.35, w: 2.35, h: 0.35, align: "center", fontFace: FONT_BODY, fontSize: 10, bold: true, color: TEXT_MUTED_DARK, margin: 0 });

  s.addText("“O problema não é falta de dado. É transformar milhares de eventos em uma decisão certa, no momento certo.”", {
    x: 0.6, y: 6.45, w: 12.1, h: 0.55, fontFace: FONT_HEAD, italic: true, fontSize: 15, color: WHITE, margin: 0,
  });

  s.addNotes(
    "[30s] Em 2024, acidentes com caminhões e ônibus mataram 3.291 pessoas nas rodovias federais brasileiras — " +
    "53% de todas as mortes no trânsito federal, sendo que esses veículos são apenas 4% da frota (fonte: PRF/Agência Brasil, 2024). " +
    "Ao mesmo tempo, o custo logístico do Brasil consome 15,5% do PIB — quase o dobro dos Estados Unidos, que estão em 8,8% (ILOS, 2025). " +
    "Grandes frotas já têm GPS, telemetria, câmeras, TMS, ERP — milhares de eventos por dia. O problema não é falta de dado. " +
    "O problema é transformar milhares de dados em uma decisão certa, no momento certo. E hoje isso ainda depende de um humano perceber tudo sozinho."
  );
  pageNum(s, 1, true);
}

/* ============================================================
   SLIDE 2 — A SOLUÇÃO
   ============================================================ */
{
  const s = lightSlide(deck);
  kicker(s, "FleetMind AI  •  A solução", { color: "007880" });
  logoMark(s, false);
  s.addText("Fleet Intelligence Platform", {
    x: 0.6, y: 0.9, w: 11, h: 0.7, fontFace: FONT_HEAD, fontSize: 34, bold: true, color: TEXT_DARK, margin: 0,
  });
  s.addText("Uma camada de inteligência que conecta veículo, motorista, gestor, operação e ambiente externo — para antecipar riscos e recomendar decisões em tempo real.", {
    x: 0.6, y: 1.62, w: 11.4, h: 0.7, fontFace: FONT_BODY, fontSize: 14.5, color: TEXT_MUTED, margin: 0, lineSpacing: 19,
  });

  const steps = [
    { t: "DADOS", d: "Telemetria, GPS, câmeras, ERP/TMS, trânsito, clima" },
    { t: "IA", d: "Correlaciona eventos internos e externos" },
    { t: "PREVISÃO", d: "Antecipa risco antes que vire ocorrência" },
    { t: "DECISÃO", d: "Recomenda a melhor ação possível" },
    { t: "AÇÃO", d: "Executa, notifica e aprende com o resultado" },
  ];
  const n = steps.length, boxW = 2.15, gap = 0.28;
  const totalW = n * boxW + (n - 1) * gap;
  let x = (13.33 - totalW) / 2;
  const y = 3.05;
  steps.forEach((st, i) => {
    const isLast = i === n - 1;
    s.addShape("roundRect", {
      x, y, w: boxW, h: 2.35, rectRadius: 0.1,
      fill: { color: isLast ? "007880" : CARD_BG }, line: { color: isLast ? "007880" : CARD_BORDER, width: 1 },
    });
    s.addText(String(i + 1), {
      x: x + 0.15, y: y + 0.12, w: 0.6, h: 0.4, fontFace: FONT_HEAD, fontSize: 13, bold: true,
      color: isLast ? WHITE : "007880", margin: 0,
    });
    s.addText(st.t, {
      x: x + 0.12, y: y + 0.55, w: boxW - 0.24, h: 0.5, fontFace: FONT_HEAD, fontSize: 16.5, bold: true,
      color: isLast ? WHITE : TEXT_DARK, margin: 0,
    });
    s.addText(st.d, {
      x: x + 0.12, y: y + 1.08, w: boxW - 0.24, h: 1.15, fontFace: FONT_BODY, fontSize: 10.5,
      color: isLast ? "D8ECEE" : TEXT_MUTED, margin: 0, lineSpacing: 13,
    });
    if (!isLast) {
      s.addText("→", { x: x + boxW - 0.02, y: y + 0.85, w: gap + 0.28, h: 0.6, align: "center", fontSize: 20, bold: true, color: "9AA9C4", margin: 0 });
    }
    x += boxW + gap;
  });

  s.addShape("roundRect", { x: 0.6, y: 5.85, w: 12.1, h: 0.95, rectRadius: 0.1, fill: { color: "F7E9E0" }, line: { color: "EDD0BE", width: 1 } });
  s.addText([
    { text: "FleetMind não substitui telemetria, TMS ou rastreamento. ", options: { bold: true, color: CORAL } },
    { text: "Ele integra essas tecnologias que sua empresa já usa e adiciona a camada de inteligência que falta.", options: { color: TEXT_DARK } },
  ], { x: 0.9, y: 5.85, w: 11.5, h: 0.95, valign: "middle", fontFace: FONT_BODY, fontSize: 14, margin: 0, lineSpacing: 18 });

  s.addNotes(
    "[35s] Apresento o FleetMind AI: uma Fleet Intelligence Platform. Uma camada de inteligência que conecta veículo, motorista, " +
    "gestor e operação — com o ambiente externo: trânsito, clima, rodovias, acidentes. Dado vira previsão. Previsão vira decisão. " +
    "Decisão vira ação — em tempo real. Um ponto importante: o FleetMind não substitui a telemetria, o TMS ou o rastreamento que " +
    "sua empresa já usa. Ele se integra a essas tecnologias e adiciona a camada de inteligência que falta."
  );
  pageNum(s, 2, false);
}

/* ============================================================
   SLIDE 3 — FLEETMIND EM AÇÃO (caso de uso)
   ============================================================ */
{
  const s = lightSlide(deck);
  kicker(s, "FleetMind AI  •  Em ação", { color: "007880" });
  logoMark(s, false);
  s.addText("Um caso real de operação", {
    x: 0.6, y: 0.9, w: 11, h: 0.6, fontFace: FONT_HEAD, fontSize: 30, bold: true, color: TEXT_DARK, margin: 0,
  });
  s.addText("Um caminhão em viagem. Cinco sinais isolados — que, correlacionados, mudam tudo.", {
    x: 0.6, y: 1.56, w: 11.4, h: 0.5, fontFace: FONT_BODY, fontSize: 14, color: TEXT_MUTED, margin: 0,
  });

  const signals = ["🌧 Chuva forte à frente", "⚠ Trecho historicamente crítico", "🚚 Velocidade incompatível", "😴 Sinais de fadiga", "🔧 Variação na telemetria"];
  const sw = 2.22, sgap = 0.14;
  let sx = 0.6;
  const sy = 2.35;
  signals.forEach((label) => {
    s.addShape("roundRect", { x: sx, y: sy, w: sw, h: 0.85, rectRadius: 0.08, fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 } });
    s.addText(label, { x: sx + 0.1, y: sy, w: sw - 0.2, h: 0.85, valign: "middle", fontFace: FONT_BODY, fontSize: 11.5, color: TEXT_DARK, margin: 0, lineSpacing: 13 });
    sx += sw + sgap;
  });

  s.addText("↓  correlacionados pela IA  ↓", {
    x: 0.6, y: 3.35, w: 12.1, h: 0.4, align: "center", fontFace: FONT_BODY, italic: true, fontSize: 13, color: "9AA9C4", margin: 0,
  });

  s.addShape("roundRect", { x: 3.9, y: 3.75, w: 5.5, h: 0.6, rectRadius: 0.3, fill: { color: CORAL }, line: { type: "none" } });
  s.addText("RISCO CRESCENTE DETECTADO", { x: 3.9, y: 3.75, w: 5.5, h: 0.6, align: "center", valign: "middle", fontFace: FONT_HEAD, bold: true, fontSize: 15, color: WHITE, margin: 0 });

  const actions = [
    "1 · Alerta o motorista em tempo real",
    "2 · Recomenda reduzir a velocidade agora",
    "3 · Recalcula e envia rota alternativa",
    "4 · Informa a central de operação",
    "5 · Escala p/ humano se não houver resposta",
  ];
  let ax = 0.6;
  const aw = 2.34, agap = 0.1;
  const ay = 4.75;
  actions.forEach((label) => {
    s.addShape("roundRect", { x: ax, y: ay, w: aw, h: 1.1, rectRadius: 0.08, fill: { color: "007880" }, line: { type: "none" } });
    s.addText(label, { x: ax + 0.12, y: ay, w: aw - 0.24, h: 1.1, valign: "middle", fontFace: FONT_BODY, fontSize: 11, bold: true, color: WHITE, margin: 0, lineSpacing: 13 });
    ax += aw + agap;
  });

  s.addText("“O FleetMind não mostra apenas o que está acontecendo. Ajuda a entender o que pode acontecer — e o que fazer a respeito.”", {
    x: 0.6, y: 6.15, w: 12.1, h: 0.55, fontFace: FONT_HEAD, italic: true, fontSize: 14, color: TEXT_DARK, margin: 0,
  });

  s.addNotes(
    "[50s] Deixa eu mostrar um caso. Um caminhão está em viagem. Isoladamente, a IA vê: chuva forte a poucos km à frente, " +
    "um trecho historicamente perigoso, velocidade incompatível, sinais de fadiga do motorista, e uma variação na telemetria do motor. " +
    "Isoladamente, são só dados. Correlacionados, é risco crescente. O FleetMind age: alerta o motorista, recomenda reduzir a " +
    "velocidade agora, recalcula a rota se necessário, informa a central, e se o motorista não responder, escala automaticamente " +
    "para um operador humano. Tudo registrado, para a rede aprender. O FleetMind não mostra só o que está acontecendo. " +
    "Ele ajuda a entender o que pode acontecer — e o que fazer a respeito."
  );
  pageNum(s, 3, false);
}

/* ============================================================
   SLIDE 4 — VALOR ECONÔMICO
   ============================================================ */
{
  const s = lightSlide(deck);
  kicker(s, "FleetMind AI  •  Valor econômico", { color: "007880" });
  logoMark(s, false);
  s.addText("Quanto custa continuar operando sem essa inteligência?", {
    x: 0.6, y: 0.9, w: 12.1, h: 0.65, fontFace: FONT_HEAD, fontSize: 27, bold: true, color: TEXT_DARK, margin: 0,
  });

  const pillars = [
    { t: "Segurança", d: "Menos risco e acidentes" },
    { t: "Eficiência", d: "Melhor uso de frota, combustível e rotas" },
    { t: "Previsibilidade", d: "Antecipação de falhas" },
    { t: "Rentabilidade", d: "Menor custo, mais produtividade" },
  ];
  let px = 0.6;
  const pw = 2.95, pgap = 0.14;
  pillars.forEach((pl) => {
    s.addShape("roundRect", { x: px, y: 1.75, w: pw, h: 1.05, rectRadius: 0.08, fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 } });
    s.addText(pl.t, { x: px + 0.15, y: 1.83, w: pw - 0.3, h: 0.4, fontFace: FONT_HEAD, bold: true, fontSize: 14.5, color: "007880", margin: 0 });
    s.addText(pl.d, { x: px + 0.15, y: 2.22, w: pw - 0.3, h: 0.5, fontFace: FONT_BODY, fontSize: 10.5, color: TEXT_MUTED, margin: 0, lineSpacing: 12 });
    px += pw + pgap;
  });

  s.addText("Simulação ilustrativa — frota de 100 veículos pesados", {
    x: 0.6, y: 3.05, w: 8, h: 0.35, fontFace: FONT_BODY, bold: true, fontSize: 13, color: TEXT_DARK, margin: 0,
  });
  s.addText("Custo operacional estimado da frota: R$ 66,4 milhões/ano  ·  Investimento FleetMind (ano 1): R$ 558 mil", {
    x: 0.6, y: 3.4, w: 12, h: 0.35, fontFace: FONT_BODY, fontSize: 11.5, color: TEXT_MUTED, margin: 0,
  });

  const scenarios = [
    { label: "CONSERVADOR", econ: "R$ 1,99 mi", roi: "257%", pb: "3,4 meses", color: "6B7A99" },
    { label: "BASE", econ: "R$ 3,98 mi", roi: "613%", pb: "1,7 meses", color: "007880" },
    { label: "OTIMISTA", econ: "R$ 6,64 mi", roi: "1.090%", pb: "1,0 mês", color: CORAL },
  ];
  let cx = 0.6;
  const cw = 3.92, cgap = 0.17;
  scenarios.forEach((sc) => {
    s.addShape("roundRect", { x: cx, y: 3.9, w: cw, h: 2.55, rectRadius: 0.1, fill: { color: sc.label === "BASE" ? "007880" : CARD_BG }, line: { color: sc.label === "BASE" ? "007880" : CARD_BORDER, width: 1 } });
    const onDark = sc.label === "BASE";
    s.addText(sc.label, { x: cx, y: 4.05, w: cw, h: 0.35, align: "center", fontFace: FONT_BODY, bold: true, fontSize: 12, color: onDark ? "D8ECEE" : sc.color, charSpacing: 1.5, margin: 0 });
    s.addText(sc.roi, { x: cx, y: 4.35, w: cw, h: 0.95, align: "center", fontFace: FONT_HEAD, bold: true, fontSize: 40, color: onDark ? WHITE : TEXT_DARK, margin: 0 });
    s.addText("ROI no ano 1", { x: cx, y: 5.28, w: cw, h: 0.3, align: "center", fontFace: FONT_BODY, fontSize: 10.5, color: onDark ? "D8ECEE" : TEXT_MUTED, margin: 0 });
    s.addText(`Economia: ${sc.econ}/ano`, { x: cx, y: 5.68, w: cw, h: 0.3, align: "center", fontFace: FONT_BODY, fontSize: 11.5, bold: true, color: onDark ? WHITE : TEXT_DARK, margin: 0 });
    s.addText(`Payback: ${sc.pb}`, { x: cx, y: 5.98, w: cw, h: 0.3, align: "center", fontFace: FONT_BODY, fontSize: 11.5, color: onDark ? "D8ECEE" : TEXT_MUTED, margin: 0 });
    cx += cw + cgap;
  });

  s.addText("HIPÓTESE a validar em piloto: percentuais de economia (3% / 6% / 10% do custo operacional). FATO: combustível = 30–35% do custo operacional (CNT/NTC&Log.); custo logístico BR = 15,5% do PIB (ILOS 2025).", {
    x: 0.6, y: 6.58, w: 12.1, h: 0.55, fontFace: FONT_BODY, italic: true, fontSize: 9.5, color: TEXT_MUTED, margin: 0, lineSpacing: 12,
  });

  s.addNotes(
    "[50s] Isso vale dinheiro. Quatro pilares: segurança, eficiência, previsibilidade, rentabilidade. Simulamos para uma frota de " +
    "100 veículos pesados: com base em dados reais de custo logístico e combustível — que hoje representa de 30 a 35% do custo " +
    "operacional — essa frota opera com um custo estimado de R$ 66 milhões por ano. O investimento no FleetMind é de aproximadamente " +
    "R$ 560 mil no primeiro ano. Mesmo no cenário conservador — 3% de economia, uma hipótese que vamos validar em piloto — o retorno " +
    "é de mais de 250% no primeiro ano, com payback em semanas. No cenário base, o ROI passa de 600%. A pergunta que fica: " +
    "quanto custa continuar operando sem essa inteligência?"
  );
  pageNum(s, 4, false);
}

/* ============================================================
   SLIDE 5 — MERCADO + MODELO DE NEGÓCIO
   ============================================================ */
{
  const s = lightSlide(deck);
  kicker(s, "FleetMind AI  •  Mercado & modelo", { color: "007880" });
  logoMark(s, false);
  s.addText("Um mercado grande, pouco digitalizado", {
    x: 0.6, y: 0.9, w: 11.5, h: 0.65, fontFace: FONT_HEAD, fontSize: 30, bold: true, color: TEXT_DARK, margin: 0,
  });

  // Funnel TAM/SAM/SOM
  const funnel = [
    { label: "TAM", desc: "2,24 mi de caminhões no Brasil (Sindipeças 2024)", val: "≈ R$ 10,5 bi/ano", w: 6.6, color: "0B1830" },
    { label: "SAM", desc: "Mercado de tecnologia de gestão de frotas no Brasil", val: "≈ R$ 5,5 bi/ano", w: 4.9, color: "13284A" },
    { label: "SOM", desc: "Meta de captura em 3 anos (< 1% do SAM)", val: "R$ 30–50 mi/ano", w: 3.2, color: "007880" },
  ];
  let fy = 1.85;
  funnel.forEach((f) => {
    const fx = 0.6 + (6.6 - f.w) / 2;
    s.addShape("roundRect", { x: fx, y: fy, w: f.w, h: 1.05, rectRadius: 0.08, fill: { color: f.color }, line: { type: "none" } });
    s.addText(f.label, { x: fx + 0.2, y: fy + 0.1, w: 1.5, h: 0.4, fontFace: FONT_HEAD, bold: true, fontSize: 16, color: CYAN, margin: 0 });
    s.addText(f.val, { x: fx - 0.1, y: fy + 0.08, w: f.w - 0.2, h: 0.4, align: "right", fontFace: FONT_HEAD, bold: true, fontSize: 15, color: WHITE, margin: 0 });
    s.addText(f.desc, { x: fx + 0.2, y: fy + 0.52, w: f.w - 0.4, h: 0.45, fontFace: FONT_BODY, fontSize: 10, color: "C7D2E8", margin: 0, lineSpacing: 12 });
    fy += 1.25;
  });

  s.addText("Apenas 20% das frotas brasileiras usam telemetria hoje, contra 60% nos EUA — a lacuna é a oportunidade.", {
    x: 0.6, y: 5.75, w: 6.6, h: 0.6, fontFace: FONT_BODY, italic: true, fontSize: 11.5, color: TEXT_MUTED, margin: 0, lineSpacing: 14,
  });

  // Revenue model card
  s.addShape("roundRect", { x: 7.55, y: 1.85, w: 5.15, h: 4.5, rectRadius: 0.1, fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 } });
  s.addText("Modelo de negócio: B2B SaaS", { x: 7.85, y: 2.05, w: 4.55, h: 0.45, fontFace: FONT_HEAD, bold: true, fontSize: 16, color: TEXT_DARK, margin: 0 });
  s.addText("Receita recorrente principal", { x: 7.85, y: 2.55, w: 4.55, h: 0.3, fontFace: FONT_BODY, bold: true, fontSize: 11.5, color: "007880", margin: 0 });
  s.addText("Assinatura por veículo / mês", { x: 7.85, y: 2.85, w: 4.55, h: 0.3, fontFace: FONT_BODY, fontSize: 12.5, color: TEXT_DARK, margin: 0 });

  const extras = ["Licenciamento Enterprise", "Implantação e customizações", "Marketplace de parceiros & APIs premium", "Consultoria em dados / IA as a Service"];
  let ey = 3.35;
  extras.forEach((ex) => {
    s.addShape("oval", { x: 7.85, y: ey + 0.08, w: 0.09, h: 0.09, fill: { color: "007880" }, line: { type: "none" } });
    s.addText(ex, { x: 8.1, y: ey, w: 4.3, h: 0.35, fontFace: FONT_BODY, fontSize: 12, color: TEXT_DARK, margin: 0 });
    ey += 0.44;
  });

  s.addText("Complementos que aumentam o ticket médio sem depender só de novos veículos.", {
    x: 7.85, y: 5.15, w: 4.55, h: 0.9, fontFace: FONT_BODY, italic: true, fontSize: 10.5, color: TEXT_MUTED, margin: 0, lineSpacing: 13,
  });

  s.addText("Fontes: Sindipeças (2024) · Frost & Sullivan / mercado de fleet-tech Brasil (2024) · Frotacia — pesquisa de adoção de telemetria.", {
    x: 0.6, y: 6.9, w: 12.1, h: 0.35, fontFace: FONT_BODY, italic: true, fontSize: 9, color: TEXT_MUTED, margin: 0,
  });

  s.addNotes(
    "[35s] O Brasil tem 2,24 milhões de caminhões e um mercado de tecnologia para gestão de frotas de cerca de US$ 1 bilhão — " +
    "e apenas 20% das frotas usam telemetria hoje, contra 60% nos Estados Unidos. Isso é oportunidade. Nosso modelo é SaaS B2B: " +
    "receita recorrente por veículo/mês, complementada por implantação, licenciamento Enterprise, marketplace de parceiros e " +
    "consultoria em dados / IA as a Service. Nossa meta nos primeiros anos é capturar menos de 1% desse mercado endereçável — " +
    "e isso já representa dezenas de milhões de reais em receita recorrente."
  );
  pageNum(s, 5, false);
}

/* ============================================================
   SLIDE 6 — DIFERENCIAL COMPETITIVO
   ============================================================ */
{
  const s = lightSlide(deck);
  kicker(s, "FleetMind AI  •  Diferencial", { color: "007880" });
  logoMark(s, false);
  s.addText("Gestão Aumentada, não substituição", {
    x: 0.6, y: 0.9, w: 11.5, h: 0.65, fontFace: FONT_HEAD, fontSize: 30, bold: true, color: TEXT_DARK, margin: 0,
  });

  const cols = ["", "Rastreamento", "Telemetria", "TMS", "Vídeo\ntelemática", "FleetMind\nAI"];
  const rows = [
    ["Localização em tempo real", true, true, false, false, true],
    ["Dados de condução/motor", false, true, false, false, true],
    ["Gestão de fretes/operação", false, false, true, false, true],
    ["Visão computacional (fadiga/risco)", false, false, false, true, true],
    ["IA preditiva + generativa", false, false, false, false, true],
    ["Agente que age em tempo real", false, false, false, false, true],
  ];
  const tableX = 0.6, tableY = 1.75, tableW = 12.1;
  const col0w = 4.4, colw = (tableW - col0w) / 5;
  const rowH = 0.5;

  // header
  cols.forEach((c, i) => {
    const cx = tableX + (i === 0 ? 0 : col0w + (i - 1) * colw);
    const cw = i === 0 ? col0w : colw;
    s.addShape("rect", { x: cx, y: tableY, w: cw, h: 0.65, fill: { color: i === 5 ? "007880" : NAVY }, line: { color: WHITE, width: 0.5 } });
    s.addText(c, { x: cx, y: tableY, w: cw, h: 0.65, align: "center", valign: "middle", fontFace: FONT_BODY, bold: true, fontSize: 10.5, color: WHITE, margin: 0, lineSpacing: 11 });
  });

  rows.forEach((r, ri) => {
    const ry = tableY + 0.65 + ri * rowH;
    const bg = ri % 2 === 0 ? WHITE : CARD_BG;
    s.addShape("rect", { x: tableX, y: ry, w: col0w, h: rowH, fill: { color: bg }, line: { color: CARD_BORDER, width: 0.5 } });
    s.addText(r[0], { x: tableX + 0.12, y: ry, w: col0w - 0.2, h: rowH, valign: "middle", fontFace: FONT_BODY, fontSize: 11, color: TEXT_DARK, margin: 0 });
    for (let ci = 1; ci <= 5; ci++) {
      const cx = tableX + col0w + (ci - 1) * colw;
      const isLastCol = ci === 5;
      s.addShape("rect", { x: cx, y: ry, w: colw, h: rowH, fill: { color: isLastCol ? "E3F1F2" : bg }, line: { color: CARD_BORDER, width: 0.5 } });
      s.addText(r[ci] ? "✓" : "–", {
        x: cx, y: ry, w: colw, h: rowH, align: "center", valign: "middle", fontFace: FONT_BODY, bold: true,
        fontSize: 14, color: r[ci] ? "007880" : "C3CCDD", margin: 0,
      });
    }
  });

  const tableBottom = tableY + 0.65 + rows.length * rowH;

  s.addShape("roundRect", { x: 0.6, y: tableBottom + 0.25, w: 5.85, h: 1.35, rectRadius: 0.09, fill: { color: NAVY }, line: { type: "none" } });
  s.addText("Coutinho Humano", { x: 0.85, y: tableBottom + 0.38, w: 5.35, h: 0.35, fontFace: FONT_HEAD, bold: true, fontSize: 14, color: CYAN, margin: 0 });
  s.addText("Lidera, contextualiza e decide.", { x: 0.85, y: tableBottom + 0.75, w: 5.35, h: 0.7, fontFace: FONT_BODY, fontSize: 12, color: WHITE, margin: 0, lineSpacing: 15 });

  s.addShape("roundRect", { x: 6.6, y: tableBottom + 0.25, w: 5.85, h: 1.35, rectRadius: 0.09, fill: { color: "007880" }, line: { type: "none" } });
  s.addText("Coutinho AI", { x: 6.85, y: tableBottom + 0.38, w: 5.35, h: 0.35, fontFace: FONT_HEAD, bold: true, fontSize: 14, color: WHITE, margin: 0 });
  s.addText("Monitora, correlaciona, prevê e recomenda 24/7.", { x: 6.85, y: tableBottom + 0.75, w: 5.35, h: 0.7, fontFace: FONT_BODY, fontSize: 12, color: "D8ECEE", margin: 0, lineSpacing: 15 });

  s.addNotes(
    "[35s] Não dizemos que não existem concorrentes. Rastreamento, telemetria, TMS, vídeo telemática — todos resolvem parte do " +
    "problema, isoladamente. O FleetMind integra tudo isso e adiciona IA preditiva, IA generativa, visão computacional, contexto " +
    "externo e agentes de IA que agem. Chamamos isso de Gestão Aumentada. Pensa no Coutinho: o Coutinho humano lidera, " +
    "contextualiza, decide. O Coutinho AI monitora, correlaciona, prevê e recomenda 24 horas por dia. Não é substituir o gestor. " +
    "É dar a ele uma capacidade de atenção que nenhum ser humano consegue manter sozinho."
  );
  pageNum(s, 6, false);
}

/* ============================================================
   SLIDE 7 — COMO COMEÇAMOS
   ============================================================ */
{
  const s = lightSlide(deck);
  kicker(s, "FleetMind AI  •  Implantação", { color: "007880" });
  logoMark(s, false);
  s.addText("Começamos pequeno. Escalamos com prova.", {
    x: 0.6, y: 0.9, w: 11.5, h: 0.65, fontFace: FONT_HEAD, fontSize: 30, bold: true, color: TEXT_DARK, margin: 0,
  });

  const stages = [
    { n: "1", t: "MVP", d: "Integração dos dados essenciais" },
    { n: "2", t: "Piloto", d: "20–50 veículos, 90–120 dias" },
    { n: "3", t: "Medição", d: "Comparação antes × depois" },
    { n: "4", t: "Prova de ROI", d: "Resultado validado e documentado" },
    { n: "5", t: "Escala", d: "Contrato Enterprise e expansão" },
  ];
  const n = stages.length, sw = 2.15, sgap = 0.28;
  const totalW = n * sw + (n - 1) * sgap;
  let x = (13.33 - totalW) / 2;
  const y = 2.3;
  s.addShape("line", { x: x + sw / 2, y: y + 0.35, w: totalW - sw, h: 0, line: { color: CARD_BORDER, width: 2 } });
  stages.forEach((st) => {
    const isROI = st.t === "Prova de ROI";
    s.addShape("oval", { x: x + sw / 2 - 0.35, y: y, w: 0.7, h: 0.7, fill: { color: isROI ? CORAL : "007880" }, line: { type: "none" } });
    s.addText(st.n, { x: x + sw / 2 - 0.35, y: y, w: 0.7, h: 0.7, align: "center", valign: "middle", fontFace: FONT_HEAD, bold: true, fontSize: 20, color: WHITE, margin: 0 });
    s.addText(st.t, { x, y: y + 0.9, w: sw, h: 0.4, align: "center", fontFace: FONT_HEAD, bold: true, fontSize: 15, color: TEXT_DARK, margin: 0 });
    s.addText(st.d, { x, y: y + 1.32, w: sw, h: 0.9, align: "center", fontFace: FONT_BODY, fontSize: 11, color: TEXT_MUTED, margin: 0, lineSpacing: 13 });
    x += sw + sgap;
  });

  s.addText("O que medimos no piloto:", { x: 0.6, y: 4.85, w: 6, h: 0.35, fontFace: FONT_BODY, bold: true, fontSize: 13, color: TEXT_DARK, margin: 0 });
  const metrics = ["Eventos de risco", "Combustível", "Manutenção", "Custo por km", "Disponibilidade", "Atrasos", "Tempo de resposta"];
  let mx = 0.6, my = 5.3;
  metrics.forEach((m) => {
    const w = 0.28 + m.length * 0.105;
    s.addShape("roundRect", { x: mx, y: my, w, h: 0.5, rectRadius: 0.25, fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 } });
    s.addText(m, { x: mx, y: my, w, h: 0.5, align: "center", valign: "middle", fontFace: FONT_BODY, fontSize: 11, color: TEXT_DARK, margin: 0 });
    mx += w + 0.16;
    if (mx > 11.8) { mx = 0.6; my += 0.62; }
  });

  s.addShape("roundRect", { x: 0.6, y: 6.35, w: 12.1, h: 0.7, rectRadius: 0.09, fill: { color: NAVY }, line: { type: "none" } });
  s.addText("PoC  →  Piloto  →  Prova de ROI  →  Contrato Enterprise  →  Expansão", {
    x: 0.6, y: 6.35, w: 12.1, h: 0.7, align: "center", valign: "middle", fontFace: FONT_HEAD, bold: true, fontSize: 15, color: CYAN, margin: 0,
  });

  s.addNotes(
    "[35s] Não vamos construir o ecossistema inteiro de uma vez. Começamos com um MVP focado nos dados essenciais. Depois, " +
    "um piloto de 20 a 50 veículos, por 90 a 120 dias. Medimos antes e depois: eventos de risco, combustível, manutenção, " +
    "custo por km, disponibilidade, atrasos. Com o ROI comprovado, vamos para contrato Enterprise e expansão. " +
    "PoC, piloto, prova de ROI, contrato, escala — nessa ordem, sem atalhos."
  );
  pageNum(s, 7, false);
}

/* ============================================================
   SLIDE 8 — VISÃO + CALL TO ACTION
   ============================================================ */
{
  const s = darkSlide(deck);
  kicker(s, "FleetMind AI  •  Visão", { color: CYAN });
  logoMark(s, true);

  s.addText("Assim como ERPs organizaram os recursos da empresa e CRMs organizaram o relacionamento com o cliente —", {
    x: 0.9, y: 1.1, w: 11.5, h: 0.7, fontFace: FONT_BODY, fontSize: 15, color: TEXT_MUTED_DARK, margin: 0, lineSpacing: 19,
  });
  s.addText("uma nova camada de inteligência vai organizar a decisão operacional das frotas.", {
    x: 0.9, y: 1.75, w: 11.5, h: 0.8, fontFace: FONT_HEAD, bold: true, fontSize: 22, color: WHITE, margin: 0, lineSpacing: 27,
  });

  s.addShape("line", { x: 0.9, y: 2.85, w: 11.5, h: 0, line: { color: "24406E", width: 1 } });

  s.addText("“O futuro da gestão de frotas não será apenas saber onde cada veículo está.\nSerá saber o que está acontecendo, o que provavelmente acontecerá,\ne qual decisão deve ser tomada antes que o problema aconteça.”", {
    x: 0.9, y: 3.15, w: 11.5, h: 1.5, fontFace: FONT_HEAD, italic: true, fontSize: 19, color: CYAN, margin: 0, lineSpacing: 26,
  });

  s.addShape("roundRect", { x: 0.9, y: 4.95, w: 11.5, h: 1.15, rectRadius: 0.1, fill: { color: NAVY2 }, line: { color: "24406E", width: 1 } });
  s.addText([
    { text: "Call to action:  ", options: { bold: true, color: CYAN } },
    { text: "buscamos transportadoras parceiras para piloto, parceiros tecnológicos estratégicos e investidores para construir e validar, juntos, essa nova camada de inteligência para o transporte.", options: { color: WHITE } },
  ], { x: 1.2, y: 4.95, w: 10.9, h: 1.15, valign: "middle", fontFace: FONT_BODY, fontSize: 13.5, margin: 0, lineSpacing: 18 });

  s.addImage({ path: LOGO_ICON_WHITE, x: 0.9, y: 6.28, w: 0.95, h: 0.95 * LOGO_ICON_RATIO });
  s.addText("FleetMind AI", { x: 1.95, y: 6.28, w: 6, h: 0.5, fontFace: FONT_HEAD, bold: true, fontSize: 26, color: WHITE, margin: 0 });
  s.addText("A inteligência que move o transporte.", { x: 1.95, y: 6.78, w: 8, h: 0.4, fontFace: FONT_BODY, italic: true, fontSize: 13.5, color: CYAN, margin: 0 });

  s.addNotes(
    "[30s] ERPs organizaram os recursos da empresa. CRMs organizaram o relacionamento com o cliente. Acreditamos que uma nova " +
    "camada de inteligência vai organizar a decisão operacional das frotas. O FleetMind quer ser essa camada. O futuro da gestão " +
    "de frotas não vai ser só saber onde cada veículo está. Vai ser saber o que está acontecendo, o que provavelmente vai " +
    "acontecer, e qual decisão tomar antes que o problema aconteça. Estamos buscando transportadoras parceiras para piloto, " +
    "parceiros tecnológicos estratégicos e investidores para construir essa camada de inteligência com a gente. " +
    "FleetMind AI: a inteligência que move o transporte."
  );
  pageNum(s, 8, true);
}

deck.writeFile({ fileName: "FleetMind_AI_Pitch.pptx" }).then(() => {
  console.log("Deck gerado: FleetMind_AI_Pitch.pptx");
});
