"""
Gera o video "Um dia com o FleetMind AI": cenas em HTML (Chrome headless),
narracao com a voz pt-BR do Windows e montagem com ffmpeg.
Uso: python build_video.py
"""
import subprocess
import wave
from pathlib import Path

import imageio_ffmpeg

HERE = Path(__file__).parent
ROOT = HERE.parent
WORK = HERE / "work"
WORK.mkdir(exist_ok=True)
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
W, H = 1920, 1080
FPS = 25

NAVY, TEAL, TEAL_L, WARM = "#001028", "#007880", "#4FD1D9", "#C9622A"
LOGO_W = (ROOT / "assets" / "logo_icon_white.png").as_uri()
KANBAN = (ROOT / "assets" / "screens" / "kanban.png").as_uri()

CSS = f"""
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:{W}px;height:{H}px;background:radial-gradient(circle at 20% 10%,#0C2440 0%,{NAVY} 60%);
 font-family:'Segoe UI',Arial,sans-serif;color:#fff;position:relative;overflow:hidden}}
.brand{{position:absolute;left:80px;top:50px;font-size:34px;font-weight:700;letter-spacing:.5px}}
.brand span{{color:{TEAL_L}}}
.logo{{position:absolute;right:80px;top:40px;width:150px}}
.clock{{position:absolute;left:80px;top:140px;font-size:96px;font-weight:700;color:{TEAL_L};letter-spacing:2px}}
.persona{{position:absolute;left:80px;top:290px;width:560px}}
.avatar{{width:150px;height:150px;border-radius:50%;background:{TEAL};display:flex;align-items:center;justify-content:center;font-size:64px;font-weight:700}}
.pname{{font-size:50px;font-weight:700;margin-top:26px}}
.prole{{font-size:30px;color:#AFC3CC;margin-top:6px}}
.pnote{{font-size:24px;color:#7E91B0;margin-top:18px;line-height:1.35}}
.stage{{position:absolute;left:720px;top:130px;width:1120px;height:780px}}
.card{{background:#fff;color:{NAVY};border-radius:26px;padding:36px 42px;box-shadow:0 20px 60px rgba(0,0,0,.45)}}
.sub{{position:absolute;left:120px;right:120px;bottom:48px;background:rgba(0,16,40,.82);border:1px solid #24406E;border-radius:18px;
 padding:22px 34px;font-size:34px;line-height:1.35;text-align:center}}
.tag{{display:inline-block;font-size:22px;font-weight:700;letter-spacing:1.5px;padding:6px 16px;border-radius:999px;background:#E3F1F2;color:{TEAL}}}
.red{{background:#FBE5DC;color:{WARM}}}
.big{{font-size:46px;font-weight:700}}
.mut{{color:#4A5560;font-size:30px;line-height:1.4}}
.row{{display:flex;gap:26px}}
.bubble{{border-radius:24px;padding:24px 30px;font-size:34px;line-height:1.35}}
.ia{{background:#E3F1F2;color:{NAVY};border-bottom-left-radius:6px}}
.me{{background:{TEAL};color:#fff;border-bottom-right-radius:6px;margin-left:auto}}
.kpi{{flex:1;background:#F0F4F7;border-radius:20px;padding:26px 30px}}
.kpi b{{display:block;font-size:54px;color:{NAVY}}}
.kpi i{{font-style:normal;font-size:24px;color:#4A5560}}
.tl div{{display:flex;gap:22px;align-items:flex-start;margin-bottom:22px;font-size:30px;line-height:1.3}}
.tl em{{font-style:normal;font-weight:700;color:{TEAL};min-width:110px}}
.foot{{position:absolute;left:80px;bottom:150px;font-size:22px;color:#7E91B0}}
"""


def page(clock, initials, name, role, note, stage_html, subtitle, foot="Personas e dados fictícios. Demonstração do protótipo."):
    persona = ""
    if name:
        persona = f"""<div class="clock">{clock}</div>
        <div class="persona"><div class="avatar">{initials}</div><div class="pname">{name}</div>
        <div class="prole">{role}</div><div class="pnote">{note}</div></div>"""
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
    <div class="brand">FleetMind <span>AI</span></div><img class="logo" src="{LOGO_W}">
    {persona}<div class="stage">{stage_html}</div>
    <div class="foot">{foot}</div>
    <div class="sub">{subtitle}</div></body></html>"""


def phone(inner):
    return f"""<div class="card" style="width:640px;height:760px;margin:0 auto;border-radius:56px;border:10px solid #0C2440;padding:34px 30px;display:flex;flex-direction:column;gap:20px">
    <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-weight:700;font-size:30px">Copiloto FleetMind</span><span class="tag">AO VIVO</span></div>{inner}</div>"""


# ---------- cenas: (id, narracao, [(html_frame, peso), ...]) ----------
SCENES = []

SCENES.append(("titulo",
    "Um dia de operação com o FleetMind AI, pelos olhos de três pessoas.",
    [(f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
      <img src="{LOGO_W}" style="position:absolute;left:760px;top:190px;width:400px">
      <div style="position:absolute;top:430px;width:100%;text-align:center;font-size:110px;font-weight:700">Um dia com o FleetMind <span style="color:{TEAL_L}">AI</span></div>
      <div style="position:absolute;top:600px;width:100%;text-align:center;font-size:42px;color:#AFC3CC">Motorista · Gestor de operações · Gestor de frota</div>
      <div style="position:absolute;top:720px;width:100%;text-align:center;font-size:28px;color:#7E91B0">Personas e dados fictícios. Demonstração do protótipo.</div></body></html>""", 1)]))

SCENES.append(("motorista_manha",
    "Às cinco e quarenta, Ricardo, motorista, sai de Goiânia. O copiloto do FleetMind já cruzou a rota, o clima e o histórico do trecho, e avisa: chuva forte no quilômetro duzentos e dez. Sugere reduzir a velocidade ali.",
    [(page("05:40", "R", "Ricardo", "Motorista", "Goiânia → Campinas, 743 km", phone(
        f"""<div class="bubble ia">Bom dia, Ricardo! Rota Goiânia → Campinas, 743 km. Tudo certo com o caminhão.</div>"""),
        "Às 5h40, Ricardo sai de Goiânia. O copiloto já cruzou rota, clima e histórico do trecho."), 1),
     (page("05:40", "R", "Ricardo", "Motorista", "Goiânia → Campinas, 743 km", phone(
        f"""<div class="bubble ia">Bom dia, Ricardo! Rota Goiânia → Campinas, 743 km. Tudo certo com o caminhão.</div>
        <div class="bubble ia" style="background:#FBE5DC">⚠ Chuva forte prevista no km 210. Reduza para 80 km/h a partir dali.</div>
        <div class="bubble me">Entendido!</div>"""),
        "Aviso: chuva forte no km 210. O copiloto sugere reduzir a velocidade ali."), 1.3)]))

SCENES.append(("motorista_relato",
    "Às nove e quarenta e dois, Ricardo vê um acidente na pista. Ele só fala. A IA entende o relato, classifica como crítico e avisa os outros veículos que vão passar pelo mesmo trecho.",
    [(page("09:42", "R", "Ricardo", "Motorista", "Relato por voz, sem tirar a mão do volante", phone(
        f"""<div style="text-align:center;font-size:90px">🎙</div>
        <div class="bubble me" style="font-size:36px">“Acidente à frente, a pista está parcialmente interditada.”</div>
        <div class="bubble ia">Relato recebido. Analisando…</div>"""),
        "Ricardo relata por voz: acidente à frente, pista parcialmente interditada."), 1),
     (page("09:42", "R", "Ricardo", "Motorista", "Relato por voz, sem tirar a mão do volante", f"""
        <div class="card" style="height:760px">
        <div class="row" style="align-items:center;margin-bottom:26px"><span class="tag red">ACIDENTE · CRÍTICO</span><span class="mut">Goiânia → Campinas</span></div>
        <svg viewBox="0 0 1040 330" width="1040" height="330">
          <path d="M30 250 L420 250 L560 160 L1010 160" stroke="#4A5560" stroke-width="12" fill="none" stroke-linecap="round"/>
          <path d="M300 250 C 420 330, 640 330, 760 200 L1010 160" stroke="{TEAL}" stroke-width="12" fill="none" stroke-dasharray="26 16" stroke-linecap="round"/>
          <circle cx="490" cy="205" r="30" fill="{WARM}"/><text x="490" y="217" font-size="34" text-anchor="middle" fill="#fff" font-weight="700">!</text>
          <circle cx="60" cy="250" r="14" fill="{NAVY}"/><circle cx="1000" cy="160" r="14" fill="{NAVY}"/>
        </svg>
        <div class="row" style="margin-top:20px">
          <div class="kpi"><b>2</b><i>veículos avisados na mesma rota</i></div>
          <div class="kpi"><b>Desvio</b><i>recalculado e enviado pela IA</i></div></div></div>""",
        "A IA classifica como crítico, avisa a rede e calcula o desvio."), 1.3)]))

SCENES.append(("operacoes_painel",
    "Na central, Marina, gestora de operações, abre o Painel Operacional. A IA já recalculou e enviou o desvio para dois caminhões, sem ninguém pedir. Marina não precisa fazer nada neste caso.",
    [(page("09:43", "M", "Marina", "Gestora de operações", "Central de monitoramento", f"""
        <div class="card" style="padding:18px"><img src="{KANBAN}" style="width:100%;border-radius:14px"></div>""",
        "Na central, Marina abre o Painel Operacional: a IA já está agindo."), 1),
     (page("09:43", "M", "Marina", "Gestora de operações", "Central de monitoramento", f"""
        <div class="card" style="padding:18px;position:relative"><img src="{KANBAN}" style="width:100%;border-radius:14px;opacity:.55">
        <div class="card" style="position:absolute;left:140px;right:140px;top:240px;border:4px solid {TEAL};text-align:center">
        <div class="tag">AÇÃO AUTOMÁTICA DA IA</div><div class="big" style="margin-top:18px">✓ Desvio enviado a 2 veículos</div>
        <div class="mut" style="margin-top:10px">Motoristas confirmaram a nova rota.</div></div></div>""",
        "O desvio chegou a dois caminhões, sem ninguém pedir."), 1.3)]))

SCENES.append(("operacoes_escalada",
    "Mais tarde, um motorista com sinais de fadiga não responde à orientação da IA. O caso sobe para Marina, que liga e reforça a pausa. A IA decide o que pode decidir, e passa para uma pessoa o que precisa de uma pessoa.",
    [(page("11:15", "M", "Marina", "Gestora de operações", "Caso escalado pela IA", f"""
        <div class="card" style="height:760px"><span class="tag red">FADIGA · ALTA</span>
        <div class="big" style="margin-top:22px">Motorista Ian Peixoto precisa de apoio</div>
        <div class="mut" style="margin-top:14px">Fadiga média 64/100 · excesso de velocidade 1,3 evento por viagem</div>
        <div class="bubble ia" style="margin-top:34px">IA: “Reduza a velocidade agora e faça uma pausa de 15 min no próximo ponto de apoio.”</div>
        <div class="mut" style="margin-top:26px">Aguardando confirmação do motorista…</div></div>""",
        "Um motorista com fadiga recebe a orientação da IA, mas não confirma."), 1),
     (page("11:20", "M", "Marina", "Gestora de operações", "Caso escalado pela IA", f"""
        <div class="card tl" style="height:760px"><span class="tag">LINHA DO TEMPO DA IA</span><div style="height:24px"></div>
        <div><em>11:15</em><span>IA instruiu o motorista a reduzir a velocidade e parar.</span></div>
        <div><em>11:20</em><span>Sem confirmação em 5 minutos. A IA escalou para um operador.</span></div>
        <div><em>11:21</em><span><b>Marina</b> ligou para o motorista e reforçou a orientação de segurança.</span></div>
        <div><em>11:30</em><span>Motorista confirmou a pausa. Caso resolvido.</span></div></div>""",
        "Sem resposta, o caso sobe para Marina, que liga e resolve."), 1.4)]))

SCENES.append(("frota_manutencao",
    "À tarde, Coutinho, gestor de frota, recebe poucos alertas, priorizados por impacto. Um caminhão com pressão de óleo baixa vai para inspeção antes de quebrar, e a parada não programada não acontece.",
    [(page("14:00", "C", "Coutinho", "Gestor de frota", "Decide com poucos alertas", f"""
        <div class="card" style="height:760px"><span class="tag red">MANUTENÇÃO URGENTE · CRÍTICO</span>
        <div class="big" style="margin-top:22px">Veículo VIF-0484 com risco de falha</div>
        <div class="mut">Scania R450</div>
        <div class="row" style="margin-top:34px">
          <div class="kpi"><b>100%</b><i>risco de falha previsto</i></div>
          <div class="kpi"><b>17,5 psi</b><i>pressão mínima do óleo</i></div>
          <div class="kpi"><b>110 °C</b><i>temperatura média do motor</i></div></div>
        <div class="mut" style="margin-top:34px">Freios com 80% de desgaste. Veículo com histórico de falhas.</div></div>""",
        "Poucos alertas, priorizados por impacto. Um caminhão está prestes a falhar."), 1),
     (page("14:05", "C", "Coutinho", "Gestor de frota", "Decide com poucos alertas", f"""
        <div class="card" style="height:760px"><span class="tag">AÇÃO SUGERIDA PELA IA</span>
        <div class="big" style="margin-top:22px">Inspeção preventiva hoje, às 16h</div>
        <div class="mut" style="margin-top:14px">Retirar o veículo da rota longa até a inspeção.</div>
        <div class="row" style="margin-top:40px">
          <div class="kpi" style="background:#E3F1F2"><b>✓ Aprovado</b><i>por Coutinho, em um clique</i></div>
          <div class="kpi" style="background:#E3F1F2"><b>Parada evitada</b><i>conserto antes da quebra</i></div></div></div>""",
        "Coutinho aprova a inspeção. A parada não programada não acontece."), 1.2)]))

SCENES.append(("frota_resultado",
    "No fim do dia, Coutinho abre a aba de economia e a de ESG. No cenário base, com dados simulados, a frota economiza perto de três mil reais por dia e evita quase meia tonelada de CO₂. O piloto vai medir esses números de verdade.",
    [(page("18:00", "C", "Coutinho", "Gestor de frota", "Fim do dia", f"""
        <div class="card" style="height:760px"><div class="row" style="align-items:center"><span class="tag">ECONOMIA &amp; ROI</span><span class="tag">ESG</span></div>
        <div class="row" style="margin-top:40px">
          <div class="kpi"><b>≈ R$ 3 mil</b><i>economia por dia, cenário base</i></div>
          <div class="kpi"><b>≈ 0,46 t</b><i>de CO₂e evitadas por dia</i></div></div>
        <div class="row" style="margin-top:26px">
          <div class="kpi"><b>2</b><i>desvios automáticos hoje</i></div>
          <div class="kpi"><b>1</b><i>quebra evitada</i></div>
          <div class="kpi"><b>1</b><i>caso escalado e resolvido</i></div></div>
        <div class="mut" style="margin-top:34px;font-size:26px">Ilustração com dados simulados: R$ 1,09 mi por ano e 168,5 t por ano, divididos por 365. O piloto mede os valores reais.</div></div>""",
        "Cenário base com dados simulados: o piloto vai medir os valores reais."), 1)]))

SCENES.append(("fim",
    "FleetMind AI. A inteligência que move o transporte.",
    [(f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
      <img src="{LOGO_W}" style="position:absolute;left:760px;top:250px;width:400px">
      <div style="position:absolute;top:520px;width:100%;text-align:center;font-size:96px;font-weight:700">FleetMind <span style="color:{TEAL_L}">AI</span></div>
      <div style="position:absolute;top:670px;width:100%;text-align:center;font-size:44px;color:{TEAL_L};font-style:italic">A inteligência que move o transporte.</div></body></html>""", 1)]))


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        raise RuntimeError(f"{cmd[0]} falhou:\n{r.stderr[-1500:]}")
    return r


def tts(text, out_wav):
    txt = out_wav.with_suffix(".txt")
    txt.write_text(text, encoding="utf-8")
    ps = (
        "Add-Type -AssemblyName System.Speech;"
        "$s=New-Object System.Speech.Synthesis.SpeechSynthesizer;"
        "$s.SelectVoice('Microsoft Maria Desktop');$s.Rate=0;"
        f"$s.SetOutputToWaveFile('{out_wav}');"
        f"$s.Speak([IO.File]::ReadAllText('{txt}',[Text.Encoding]::UTF8));$s.Dispose()"
    )
    run(["powershell", "-NoProfile", "-Command", ps])


def wav_len(p):
    with wave.open(str(p)) as w:
        return w.getnframes() / w.getframerate()


def shot(html, png):
    f = png.with_suffix(".html")
    f.write_text(html, encoding="utf-8")
    run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
         f"--window-size={W},{H + 90}", f"--screenshot={png}", f.as_uri()])


def main():
    clips, audio_parts = [], []
    for si, (sid, narr, frames) in enumerate(SCENES):
        wav = WORK / f"{si:02d}_{sid}.wav"
        tts(narr, wav)
        dur = wav_len(wav) + 0.8
        total_w = sum(w for _, w in frames)
        for fi, (html, wgt) in enumerate(frames):
            png = WORK / f"{si:02d}_{sid}_{fi}.png"
            shot(html, png)
            fd = dur * wgt / total_w
            clip = WORK / f"{si:02d}_{sid}_{fi}.mp4"
            frames_n = int(fd * FPS)
            zoom = (f"zoompan=z='1+0.04*on/{frames_n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
                    f":d={frames_n}:s={W}x{H}:fps={FPS},fade=t=in:st=0:d=0.35,fade=t=out:st={max(fd - 0.35, 0):.2f}:d=0.35")
            run([FFMPEG, "-y", "-loop", "1", "-i", str(png), "-vf", f"crop={W}:{H}:0:0,{zoom}",
                 "-t", f"{fd:.2f}", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(FPS), str(clip)])
            clips.append(clip)
        # narracao + pausa para fechar a duracao da cena
        padded = WORK / f"{si:02d}_{sid}_pad.wav"
        run([FFMPEG, "-y", "-i", str(wav), "-af", f"apad=pad_dur=1,atrim=0:{dur:.2f}", "-ar", "44100", "-ac", "1", str(padded)])
        audio_parts.append(padded)
        print(f"cena {sid}: {dur:.1f}s")
    lst = WORK / "clips.txt"
    lst.write_text("".join(f"file '{c.as_posix()}'\n" for c in clips), encoding="utf-8")
    alst = WORK / "audio.txt"
    alst.write_text("".join(f"file '{a.as_posix()}'\n" for a in audio_parts), encoding="utf-8")
    vid = WORK / "video_only.mp4"
    aud = WORK / "audio_all.wav"
    run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(vid)])
    run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(alst), "-c", "copy", str(aud)])
    out = HERE / "FleetMind_AI_Um_Dia_de_Operacao.mp4"
    run([FFMPEG, "-y", "-i", str(vid), "-i", str(aud), "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", str(out)])
    print("video:", out)


if __name__ == "__main__":
    main()
