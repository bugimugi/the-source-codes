#!/usr/bin/env python3
"""
Reproduces the Quran word counts used in content/claims/quran-*.json.

Two independent digital editions are counted with identical rules:
  A = npm "quran-json" 3.1.2           (Uthmani text from the Noble Qur'an Encyclopedia)
  B = npm "@muslims-community/quran" 1.1.0 (Tanzil project text)

Setup:   mkdir -p /tmp/q && cd /tmp/q && npm pack quran-json@3.1.2 @muslims-community/quran@1.1.0
         for f in *.tgz; do mkdir -p "x_$f" && tar xzf "$f" -C "x_$f"; done   # folder names must contain the package names
Run:     python3 quran-counts.py /tmp/q
Note: these are digital editions of the Hafs text, not manuscripts; token totals differ slightly
(A 77,429 / B 77,433) because of orthographic conventions.
"""
import json, re, sys, collections, glob

root = sys.argv[1] if len(sys.argv) > 1 else "."
A = json.load(open(glob.glob(f"{root}/*quran-json-*/package/dist/quran.json")[0]))
B = json.load(open(glob.glob(f"{root}/*muslims-community-quran-*/package/dist/quran.json")[0]))["surahs"]
VA = [(s["id"], v["id"], v["text"]) for s in A for v in s["verses"]]
VB = [(s["id"], v["id"], v["text"]) for s in B for v in s["ayat"]]

DIAC = re.compile(r"[ً-ٰٟۖ-ۭـ࣓-ࣿ]")
def norm(t):  # strip vowels, unify alef/yaa/hamza
    t = DIAC.sub("", t)
    return re.sub("[أإآٱ]", "ا", t).replace("ى", "ي").replace("ء", "ا")
def toks(t): return re.sub(r"[^؀-ۿ\s]", "", t).split()

def count(V, pred):
    hits = []
    for s, v, t in V:
        ws = toks(t)
        for i, w in enumerate(ws):
            if pred(norm(w), w, ws, i): hits.append((s, v, w))
    return hits

def with_prefixes(stems):
    pre = {p1 + p2 + p3 for p1 in ("", "و", "ف") for p2 in ("", "ب", "ل", "ك") for p3 in ("", "ال")} | {"لل", "ولل", "وبال", "فبال"}
    allowed = {p + s for p in pre for s in stems}
    return lambda n, w, ws, i: n in allowed

for name, V in (("A (quranenc)", VA), ("B (tanzil)", VB)):
    print(f"\n===== {name}: {len(V)} verses, {sum(len(toks(t)) for _,_,t in V)} tokens")
    sea_def = count(V, with_prefixes(["البحر"]))
    sea_bare = count(V, lambda n, w, ws, i: n == "بحر")
    sea_dual = count(V, with_prefixes(["البحرين", "البحران"]))
    sea_pl = count(V, lambda n, w, ws, i: n in ("البحار", "ابحر"))
    print(f"SEA  definite singular (al-/wa-l-/...): {len(sea_def)} | bare 'bahr' (24:40): {len(sea_bare)} "
          f"| dual: {len(sea_dual)} | plural (bihar/abhur): {len(sea_pl)}  -> singular total {len(sea_def)+len(sea_bare)}, all forms {len(sea_def)+len(sea_bare)+len(sea_dual)+len(sea_pl)}")
    land = count(V, lambda n, w, ws, i: n == "البر" and re.search(r"[ٱا]ل[ْۡ]?بَ", w) is not None)
    land52 = [h for h in land if (h[0], h[1]) == (52, 28)]
    birr = count(V, lambda n, w, ws, i: n in ("البر", "بالبر") and re.search(r"[ٱا]ل[ْۡ]?بِ", w) is not None)
    print(f"LAND al-barr (fatha): {len(land)} total, of which 52:28 (divine name 'the Kind'): {len(land52)}  -> land meaning only: {len(land)-len(land52)}"
          f" | al-birr (righteousness, kasra, NOT land): {len(birr)}")
    print(f"     string-only count of 'البر' without vowels would give {len(land)+len(birr)}")
    dun = count(V, with_prefixes(["الدنيا"]))
    near = [h for h in dun if (h[0], h[1]) in ((8, 42), (37, 6), (41, 12), (67, 5))]
    akh = count(V, lambda n, w, ws, i: re.fullmatch(r"(?:و|ف)?(?:ب|ل|لل|)(?:ال)?اخرة", n) is not None)
    akh_all = count(V, lambda n, w, ws, i: re.search(r"اخر[ةه]", n) is not None)
    print(f"DUNYA al-dunya: {len(dun)} (of which 'nearest/lowest' 8:42, 37:6, 41:12, 67:5: {len(near)} -> 'this world' reading: {len(dun)-len(near)})")
    print(f"AKHIRA al-akhira (fem., all prefixes): {len(akh)} | substring 'akhira/akhirah': {len(akh_all)} (extra hit: 3:72 'akhirahu' = 'its end')")
    shahr = count(V, with_prefixes(["شهر", "شهرا"]))
    print(f"SHAHR singular (incl. accusative): {len(shahr)} | dual 4:92, 58:4 excluded")
    yawm = count(V, with_prefixes(["يوم", "يوما"]))
    yawm2 = count(V, with_prefixes(["يومين"]))
    print(f"YAWM singular incl. prefixed + accusative: {len(yawm)} | dual 'yawmayn' excluded: {len(yawm2)} | (suffixed forms such as yawmuhum and 'yawma-idhin' are separate words and excluded)")
