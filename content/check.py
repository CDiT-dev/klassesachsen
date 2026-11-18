#!/usr/bin/env python3
"""Check quest.de.json and write the attribution page and the audio script from it.

python3 content/check.py   (from the demonstrator folder or anywhere)
Exits 1 with a list of problems; on success writes
  content/quellen-und-bilder.md   the attribution page (sources, images, licences)
  content/audio-skript.tsv        one line per read-aloud text: id, level, text for TTS
"""
import json, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent  # repo root; image paths (static/bilder/...) are relative to it
data = json.loads((HERE / "quest.de.json").read_text(encoding="utf-8"))
problems, used_sources, used_images = [], set(), set()
src, imgs = data["quellen"], data["bilder"]

for key in ("titel", "werk", "url", "gelesen", "belegt"):
    for sid, s in src.items():
        if not s.get(key):
            problems.append(f"quelle {sid}: {key} fehlt")

for bid, b in imgs.items():
    for key in ("datei", "titel", "urheber", "lizenz", "lizenz_url", "quelle_url", "alt"):
        if not b.get(key):
            problems.append(f"bild {bid}: {key} fehlt")
    if not (ROOT / b["datei"]).is_file():
        problems.append(f"bild {bid}: Datei {b['datei']} fehlt")
    if len(b.get("alt", "")) > 300:
        problems.append(f"bild {bid}: Alt-Text über 300 Zeichen")

audio = []  # (id, level, text)


def check_text(tid, t):
    if "einfach" not in t:
        return  # option lists and the like
    if "leicht" not in t:
        problems.append(f"{tid}: Fassung leicht fehlt")
    for q in t.get("quellen", []):
        if q not in src:
            problems.append(f"{tid}: unbekannte Quelle {q}")
        used_sources.add(q)
    # a year in the text is a fact and needs a source
    if re.search(r"\b1[0-9]{3}\b", t["einfach"] + t.get("leicht", "") + t.get("titel", "")) and not t.get("quellen"):
        problems.append(f"{tid}: Jahreszahl ohne Quelle")
    if t.get("stimme") == "erfunden" and not t.get("label"):
        problems.append(f"{tid}: erfundene Stimme ohne Label")
    for level in ("einfach", "leicht"):
        if level in t and "{" not in t[level]:
            text = t[level]
            if t.get("stimme") == "erfunden":
                text = (t["label"] if level == "einfach" else t.get("label_leicht", t["label"])) + ": " + text
            audio.append((f"{tid}.{level}", level, text))


for st in data["stationen"]:
    for q in st["ort"].get("quellen", []):
        used_sources.add(q)
        if q not in src:
            problems.append(f"{st['id']}.ort: unbekannte Quelle {q}")
    for bid in st["bilder"]:
        if bid not in imgs:
            problems.append(f"{st['id']}: unbekanntes Bild {bid}")
        used_images.add(bid)
    for group in ("texte", "fundkarte"):
        for key, t in st[group].items():
            check_text(f"{st['id']}.{key}", t)
    sp = st["spiel"]
    for key in ("kartenbild", "kartenbild_hinten", "einleitungsbild", "raumbild"):
        if key in sp and sp[key] not in imgs:
            problems.append(f"{st['id']}.spiel.{key}: unbekanntes Bild {sp[key]}")
    if sp.get("auftrag_burg") not in st["texte"]:
        problems.append(f"{st['id']}.spiel.auftrag_burg: Text fehlt")
    for step in sp["ablauf"]:
        if step not in ("auftrag", "suchen", "abstimmen", "begruenden", "raetsel"):
            problems.append(f"{st['id']}.spiel.ablauf: unbekannter Schritt {step}")
    keys = list(sp.get("suchen", {}).get("fehl", [])) + list(sp.get("raetsel", {}).get("fehl", [])) + list(sp.get("raetsel", {}).get("teile", []))
    ab = sp.get("abstimmung")
    if ab:
        keys += [ab["frage"]] + ab["stimmen"] + [f"{v}-quelle" for v in ab["stimmen"]]
        if "begruenden" in sp["ablauf"]:
            keys += [f"begruenden-{v}" for v in ab["stimmen"]]
    for k in keys:
        if k and k not in st["texte"]:
            problems.append(f"{st['id']}.spiel: Text {k} fehlt")
    opts = st["texte"].get("auswahl", {}).get("optionen", [])
    if "richtig" in st["texte"].get("auswahl", {}) and st["texte"]["auswahl"]["richtig"] >= len(opts):
        problems.append(f"{st['id']}.auswahl: richtig zeigt ins Leere")

# frame and result texts of the app (COS-205)
for block in ("rahmen", "ende"):
    for key, t in data[block].items():
        check_text(f"{block}.{key}", t)

for sid in src:
    if sid not in used_sources:
        problems.append(f"quelle {sid}: wird nirgends verwendet")
ids = [a[0] for a in audio]
assert len(ids) == len(set(ids)), "doppelte Audio-IDs"

if problems:
    print("\n".join(problems))
    sys.exit(1)

# audio script: no media dots, numbers spelled the way they should be spoken
say = {a["wort"]: a["sprich"] for a in data["aussprache"] if a["wort"] != a["sprich"]}
with open(HERE / "audio-skript.tsv", "w", encoding="utf-8") as f:
    f.write("id\tfassung\ttext\n")
    for aid, level, text in audio:
        text = text.replace("·", "")
        for w, s in say.items():
            text = re.sub(rf"\b{re.escape(w)}\b", s, text)
        f.write(f"{aid}\t{level}\t{text}\n")

# attribution page
out = ["# Quellen und Bilder", "",
       "Diese Seite gehört zur Demo-Quest von CDiT für die Ausschreibung klasseSachsen. "
       "Sie wird aus `quest.de.json` erzeugt; bitte dort ändern, nicht hier.", "",
       "## Texte", "",
       f"Die Texte der Demo schreibt CDiT. Sie stehen unter {data['lizenz_texte'].split(',')[0]}. "
       "Sie sind ein Beispiel dafür, wie wir Inhalte für Kinder aufbereiten; die fachlichen Inhalte der App liefert die Auftraggeberin. "
       "Die Stimmen von Maler, Köhler, August dem Starken und Böttger sind für das Spiel erfunden und im Spiel so gekennzeichnet. "
       "Jede Sachaussage stützt sich auf eine der Quellen unten.", "",
       "## Quellen", ""]
for sid, s in src.items():
    out.append(f"- **{s['titel']}**. {s['werk']}. <{s['url']}> (gelesen am {s['gelesen']}). Belegt: {s['belegt']}")
out += ["", "## Bilder", "",
        "Alle Bilder sind gemeinfrei oder frei lizenziert. Die Wandbilder der Albrechtsburg sind gemeinfrei; "
        "wir zeigen sie über Postkarten von 1899 aus Wikimedia Commons. Fotos der Staatlichen Schlösser, Burgen und Gärten Sachsen nutzen wir nicht.", ""]
for bid, b in imgs.items():
    werk = f" {b['werk']}." if b.get("werk") else ""
    out.append(f"- **{b['titel']}**.{werk} {b['urheber']}. Lizenz: [{b['lizenz']}]({b['lizenz_url']}). "
               f"Quelle: <{b['quelle_url']}>. Datei: `{b['datei']}`. Verwendet: {', '.join(b['verwendung'])}.  \n  Alt-Text: {b['alt']}")
out += ["", f"Stand: {data['stand']}.", ""]
(HERE / "quellen-und-bilder.md").write_text("\n".join(out), encoding="utf-8")
print(f"ok: {len(src)} Quellen, {len(imgs)} Bilder, {len(audio)} Vorlese-Texte")
