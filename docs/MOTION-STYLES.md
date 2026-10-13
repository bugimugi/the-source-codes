# MOTION-STYLES – Welcher Animationsstil wo (für Claude Code)

Diese Datei gilt zusätzlich zu `docs/DESIGN.md`. Lies sie, bevor du einen Bereich gestaltest oder animierst.

## Grundregel
Die Seite ist ein ruhiger, ehrfürchtiger Wissensort, kein Effekt-Showroom. Ein Stil wird nur eingesetzt, wenn er den Inhalt erklärt oder fühlbar macht.

- **Ein Grundstil für die ganze Seite** (dunkel, Gold/Cyan, Serif-Titel, wie in `DESIGN.md`).
- **Pro Bereich ein Hauptstil + maximal ein Akzentstil.**
- **Pro Bildschirm maximal zwei Stile gleichzeitig.**
- Niemals mehrere Stile "weil sie cool sind" mischen. Das ist der typische KI-Look.
- Jeder Bereich bekommt eine eigene Form- und Farbwelt innerhalb der Grundpalette (Akzentfarbe pro Bereich), damit nicht alles gleich aussieht.

## Zuordnung: Bereich → Stil

| Bereich | Hauptstil | Akzentstil | Einsatz |
|---|---|---|---|
| Körper, Organe, Nerven, Adern, Nervensystem | Wireframe 3D | Holographic | Röntgen-/Scan-Look, Organ dreht sich, Leitungen leuchten beim Hover |
| Zellen, Blutkörperchen, Bakterien | Liquid morph | Particles | Zellen fließen und verformen sich, Reaktionen als Partikelbewegung |
| Pflanzen, Kräuter, Bäume, Obst, Gemüse | Halftone | Gradient mesh | Botanische Tafeln im Druck-Look, weiche Farbverläufe als Hintergrund |
| Mineralien, Kristalle | Holographic | Isometric | Irisierende Flächen, Kristallgitter als isometrische Struktur |
| Frequenzen, Vibration, Chladni-Muster | Particles | Kinetic type | Partikel formen das Muster der Frequenz, Zahlenwerte bewegen sich mit |
| Atemübungen, Chakren, Aura, Energie | Gradient mesh | Neon glow (sparsam) | Weiche, atmende Farbfelder im Atemrhythmus, Glow nur an Energiepunkten |
| Alte Kulturen, Göbekli Tepe, Pyramiden, Tempel | Blueprint | Art deco | Baupläne und Geometrie, Messlinien, goldene Ornamente |
| Heilige Geometrie, Formen | Bauhaus (nur Geometrie) | Blueprint | Klare Grundformen, Konstruktionslinien |
| Rezepte, Mengen, Nährstoffe | Blueprint | Split-flap | Zutaten als Plan, Mengen mit Split-flap-Zähler beim Skalieren |
| Manifest, große Aussagen | Kinetic type | – | Text bewegt sich beim Scrollen, ruhig und lesbar |
| UI-Flächen (Overlay, Suche, Karten) | Glassmorphism | – | Nur für Panels, dezent, nicht für alles |

## Nicht verwenden (Ton passt nicht)
Comic book, Pixel art, Neo-brutalism, Retro VHS und ASCII art nur nutzen, wenn Bugra es für eine bestimmte Stelle ausdrücklich verlangt. Clay 3D höchstens für Obst und Gemüse, wenn es zur Gestaltung der Pflanzenwelt passt.

## Anti-KI-Look-Checkliste (vor jedem Abschluss prüfen)
- Echte Assets vor Platzhalter-Effekten: Illustrationen, Fotos, Texturen von Bugra (Adobe Creative Cloud) haben Vorrang vor prozeduralen Effekten.
- Nicht jede Karte im gleichen Glas-Panel. Rhythmus und Größen variieren.
- Typografie mit klarer Hierarchie, eine Serif für Titel, eine Sans für UI. Keine Standard-Violett-Verläufe.
- Weniger Effekte, dafür präziser Timing (Easing, Verzögerung, Reihenfolge). Qualität liegt im Detail.
- Übergänge erzählen den Weg: Körper → Organ → Eintrag fühlt sich wie ein Hineinzoomen an.
- Keine erfundenen Zahlen, keine Fake-Zitate, keine Fake-Studien.

## Technik-Regeln
- Bestehenden Stack nutzen: Three.js, GSAP. Neue Bibliotheken nur mit Begründung (erlaubt: Lenis, GSAP ScrollTrigger, D3/Sigma.js für das Beziehungsnetz).
- `prefers-reduced-motion` respektieren, alles Wesentliche muss auch ohne Animation lesbar sein.
- Mobile: weniger Partikel, einfachere Shader, keine Dauerlast. Zielwert 60 fps auf einem mittleren Handy.
- 3D-Bereiche lazy laden, nicht alles beim Start.
- Tastatur und Screenreader bleiben nutzbar.

## Arbeitsablauf pro Bereich
1. Stil aus der Tabelle wählen und in einem Satz begründen.
2. Bauen, im Browser prüfen, auf Handy und Desktop.
3. Checkliste oben durchgehen.
4. Wenn ein zweiter Stil nötig scheint: erst fragen, nicht einfach mischen.
