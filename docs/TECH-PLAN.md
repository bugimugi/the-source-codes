# TECH-PLAN – 3D-Fundament (Entwurf zur Abnahme)

Status: **Entwurf, nichts davon ist gebaut.** Zahlen in diesem Plan sind **Zielwerte/Annahmen**, keine Messungen; sie werden in
Phase 0 an der echten Grafikkarte des Betreibers überprüft und angepasst.

## Ziel
Awwwards-Niveau: ruckelfreie Echtzeit-3D-Szenen mit echten Modellen (GLB), physikalisch basierten Materialien (PBR), HDRI-Licht,
Post-Processing (Bloom, Tiefenunschärfe, Farbkorrektur), scrollgesteuerter Kamerachoreografie und echter Interaktion
(Drehen, Zoomen, Organe anklicken, Hover). **60 FPS auf aktuellen Desktop-Rechnern, flüssig auf Mittelklasse-Handys** durch
automatische Qualitätsstufen. Die Seite bleibt ohne WebGL benutzbar (Bild-Slots, siehe Punkt 7).

Nicht verhandelbar bleibt das Kernprinzip: Jede Aussage hat Quelle und Belegstufe. Ein anklickbares Organ öffnet das Proof-Overlay
mit den zugehörigen Aussagen (`claimIds`), nie freie Texte im 3D-Code.

## Verbindliche Vorgaben des Betreibers (siehe CLAUDE.md „Harte Regeln“)
1. **Keine Zusatzkosten:** nur freie Software und freie Assets (bevorzugt CC0/gemeinfrei, sonst Quellenangabe in `CREDITS.md`).
   Alle in diesem Plan genannten Werkzeuge sind kostenlos und Open Source. Kein Kauf, keine bezahlte KI.
2. **3D nur mit echtem Mehrwert:** Geometrie, Frequenzen, Schwingungen, Wellen, Kymatik, Chakren-Darstellung, Körper/Organe, Weltkugel.
   **Pflanzen, Kräuter, Obst, Gemüse, Kristalle, Orte und Hintergründe sind Bilder** (vom Betreiber erzeugt) und bekommen Tiefe
   durch **2,5D** (Punkt 3b).
3. **Berechnetes 3D wird im Code erzeugt**, ohne fremde Modelle. **Fremde Modelle nur für Körper, Organe und Erde**, frei lizenziert.
4. **Sparsam arbeiten:** kleine Schritte, Entwurfsbilder nur über `docs/MOCKUP-NOTES.md`.

Folge: Der Modellbedarf schrumpft auf **drei Gruppen** (Körper, Organe, Erde). Alles andere ist Code (3D) oder Bild (2,5D).

## Ausgangslage im Repository
- Vite 8 + TypeScript, Three.js 0.170, GSAP. Kein React.
- `src/gl/*` sind **prozedurale** Szenen (Hero, Universum, Bühnen), jede mit **eigenem Canvas und eigenem WebGL-Kontext**
  (`#gl`, `#matrix-gl`, `#stage-gl`, `#atlas-gl`). Das ist der erste Umbaupunkt (siehe 1).
- Bild-Slots stehen (`src/assets/`, Commit `43be94d`): feste Formate, Fallback, automatische Übernahme aus `public/assets/`.
- Three.js steckt als ein ~650-kB-Block im Hauptbundle (Build-Warnung). Wird per dynamischem Import aufgeteilt.

---

## 1) Renderer-Entscheidung
**Entscheidung: WebGL2 als Standard, WebGPU nicht in der ersten Ausbaustufe.**

| | WebGL2 | WebGPU |
|---|---|---|
| Verbreitung | praktisch überall (Desktop, Android, iOS) | wächst, aber Geräte-/Browserlücken, v. a. ältere Handys und Linux |
| Three.js | ausgereift, alle Loader und Effekt-Bibliotheken | `WebGPURenderer` mit WebGL2-Rückfall vorhanden, Ökosystem (Post-Processing, Shader) kleiner |
| Risiko für Pilot | niedrig | höher (zwei Codepfade testen) |

Begründung: Der Qualitätsgewinn für diese Szenen (Körper, Organe, Erde, berechnete Wellen und Geometrie) kommt aus Modellen, Licht und
Post-Processing, nicht aus Compute-Shadern. WebGPU wäre ein Mehraufwand ohne sichtbaren Gewinn. Der Renderer wird hinter einer
dünnen Schicht (`src/gl/core/renderer.ts`) gekapselt, damit ein späterer Wechsel möglich bleibt.

**Fallback-Kette:** WebGL2 → (kein WebGL2/Kontext verloren/„Sparmodus“) **Stufe „statisch“**: Bild-Slots + CSS-Parallax, Seite
voll benutzbar. Kontextverlust (`webglcontextlost`) wird abgefangen und löst den Rückfall aus, kein weißer Bildschirm.

**Ein Kontext für alles:** ein gemeinsamer Vollbild-Canvas, mehrere Szenen darin (Szenenwechsel statt vier Canvases). Spart
Speicher, vermeidet Kontextlimits auf Handys. Hero, Universum, Körper, Atlas werden **Szenen-Module**, die erst bei Bedarf
per `import()` geladen werden.

## 2) Asset-Pipeline (GLB, Kompression, Texturen, LOD)
**Format:** glTF 2.0 / **GLB** (binär). Eine Datei pro Modell, Quelle und Lizenz im Eintrag in `public/assets/CREDITS.md`.

Die Pipeline gilt **nur für Körper, Organe und Erde** (alles andere entsteht im Code oder ist ein Bild).

**Ablauf je Modell** (Skript `npm run models:optimize`, später):
1. Original (beliebiges Format) bleibt lokal in `design/assets-raw/models/` (Git-ignoriert).
2. Aufräumen in Blender (kostenlos): Maßstab, Ursprung, Normalen, Materialien zusammenlegen.
3. **glTF-Transform** (CLI, Open Source): `dedup`, `prune`, `weld`, `simplify`, Texturen verkleinern.
4. **Geometrie: Meshopt-Kompression** (Standard). Draco nur, wenn eine Datei damit deutlich kleiner ist; Meshopt dekodiert
   schneller und passt zu animierten Modellen.
5. **Texturen: KTX2 / Basis Universal** (GPU-komprimiert, spart Grafikspeicher, nicht nur Download). Zwei Profile:
   ETC1S (klein, für Farbtexturen) und UASTC (Qualität, für Normalen). Transcoder-Dateien werden **selbst gehostet** (kein CDN,
   wegen DSGVO).
6. Ausgabe nach `public/assets/models/<name>.glb`; optional `<name>.lod1.glb`.

**LOD:** 3 Stufen pro großem Modell (nah/mittel/fern) bzw. nur 2 für Organe. Auswahl nach Qualitätsstufe **und** Kameraabstand;
Stufe 0 (niedrigste) ist immer ein Teil des ersten Downloads, höhere Stufen laden nach (progressiv, siehe 7).
**Instancing** für Wiederholtes (Partikel, Sterne, Pflanzenblätter), **Atlas-Texturen** für kleine Objekte.

**Neue Pakete (Begründung, vorher abzunehmen):**
- `@gltf-transform/cli` (nur Entwicklung): Optimierung. Open Source, kostenlos.
- `meshoptimizer` (Dekoder kommt aus Three.js `examples`, kein zusätzliches Paket nötig).
- KTX2-Werkzeug `toktx` (KTX-Software, Open Source) für die Umwandlung, nur lokal.

## 3) Beleuchtung und Materialien
- **PBR-Materialien** (`MeshStandardMaterial`/`MeshPhysicalMaterial`): Körper/Organe als durchscheinende „Hologramm“-Materialien
  (Fresnel-Rand, additive Glut) über Standard-PBR, nicht als reiner Shader-Trick; Erde mit Tag-/Nacht-Textur, Wolken, Atmosphäre.
  Berechnete Objekte (Geometrie, Wellen, Kymatik, Energiezentren) bekommen eigene Shader-/Standardmaterialien im Code.
  Kristalle sind **Bilder** (2,5D, Punkt 3b), kein Transmission-Material.
- **HDRI-Umgebungslicht** (`PMREMGenerator`): kleine, dunkle Studio-/Nachthimmel-HDRIs (1–2k, als `.hdr`/KTX2 vorgefiltert).
  Quelle: Poly Haven (CC0, keine Quellenpflicht, wir nennen sie trotzdem in `CREDITS.md`).
- **Lichtrig pro Szene:** 1 Schlüssellicht (Gold), 1 Gegenlicht (Cyan), HDRI als Grundlicht. Wenige echte Lichter (Budget siehe 6);
  Rest als „gebackene“ Lichtkarten oder Emissive.
- **Schatten:** nur dort, wo sie sichtbar nützen (z. B. Körper auf Boden); sonst Kontaktschatten per Textur. Standard: aus.
- Farbraum: sRGB-Ausgabe, ACES-/AgX-Tonemapping (wird beim Look-Abgleich gewählt), Farbwerte aus `docs/DESIGN.md`.

## 3b) 2,5D für Bilder (Pflanzen, Kräuter, Obst, Gemüse, Kristalle, Orte, Hintergründe)
Diese Motive bleiben Bilder des Betreibers (Bild-Slots) und werden **mit Ebenen statt Modellen** lebendig gemacht:
- **Ebenen mit Parallax:** Hintergrund / Motiv / Vordergrund bewegen sich mit unterschiedlicher Stärke zur Maus (am Handy langsame
  Eigenbewegung; Neigungssensor nur, wenn der Browser es erlaubt).
- **Leichte Neigung der Karte** zur Maus (CSS-3D `perspective`/`rotateX/Y`, kleine Winkel).
- **Lichtreflex:** wandernder Glanz über dem Motiv (CSS-Verlauf mit `mix-blend-mode: screen`), folgt dem Zeiger.
- **Glow:** weiche Leuchtkanten (`filter: drop-shadow`, Screen-Überblendung bei Motiven auf Schwarz), Pulsieren sehr sparsam.
- **Partikel:** wenige Staub-/Funkenpartikel als **ein** gemeinsames Partikelsystem über der Szene, nicht ein Canvas pro Karte.
- Technik: **reines CSS/JS** (Transform/Opacity, GPU-beschleunigt), kein WebGL pro Karte. Fehlt das Bild, bleibt der Slot-Verlauf.
  Bei `prefers-reduced-motion` stehen die Ebenen still.
- Für echte Ebenen liefert der Betreiber Motiv und Hintergrund getrennt (PNG/WebP mit Transparenz oder Motiv auf Schwarz); das
  wird pro Bild in `docs/ASSET-LIST.md` ergänzt. Ohne Ebenen genügt ein Einzelbild (dann nur Neigung, Reflex, Glow).
- Komponente: `src/ui/depthCard.ts` (später), nutzt die vorhandenen Slots.

## 4) Post-Processing
Bibliothek: **`postprocessing`** (pmndrs, Open Source, Three.js-kompatibel). Begründung: fasst Effekte zu **wenigen
Durchläufen** zusammen und ist deutlich schneller als eine Kette einzelner Three.js-Passes. Alternative: Three.js
`EffectComposer` (kein neues Paket, aber mehr Durchläufe). Entscheidung wird in Phase 0 per Messung bestätigt.

| Effekt | Zweck | Stufe |
|---|---|---|
| Bloom (selektiv, Schwellwert) | Glühen von Linien, Organen, Sternen | ab „mittel“ |
| Tiefenunschärfe (DoF, Bokeh) | Fokus auf das angeklickte Objekt | ab „hoch“ |
| Farbkorrektur/LUT, Vignette | einheitlicher Look (Deep Space, Gold, Cyan) | ab „niedrig“ |
| Filmkorn, leichte chromatische Abweichung | Tiefe, Kino-Anmutung, sparsam | ab „hoch“ |
| SSAO | nur wenn gemessen und nötig | „ultra“ |
| Antialiasing: SMAA/MSAA | Kanten | ab „niedrig“ |

Auflösung der Effekte darf **niedriger als das Bild** sein (Bloom bei halber Auflösung). Alle Effekte schalten per Stufe ab, und
`prefers-reduced-motion` entfernt Korn, Kamerawackeln und schnelle Bewegung.

## 5) Scroll- und Kamerasystem
- **Smooth Scroll:** `lenis` (klein, Open Source) für weiches Scrollen; GSAP **ScrollTrigger** (liegt dem vorhandenen
  `gsap`-Paket bei, kein neues Paket) verknüpft Scroll-Fortschritt mit Zeitleisten.
- **Kamerabahn:** Pro Szene eine Spline (CatmullRom) für Position und Blickziel, Fortschritt 0–1 = Scrollstand. Kapitel mit
  „Haltepunkten“, an denen die Bahn weich einrastet (kein Verirren, Tastatur: Pfeiltasten/Bild-Tasten springen zum nächsten Kapitel).
- **Interaktionsmodi:** *Scroll-geführt* (Standard) ↔ *Frei erkunden* (Drehen/Zoomen per `OrbitControls`-ähnlicher Steuerung mit
  Grenzen). Wechsel per sichtbarer Schaltfläche; Escape kehrt zur Bahn zurück.
- **Picking:** GPU-freundlich über unsichtbare vereinfachte „Pick-Meshes“ pro Organ (nicht über das Hochpoly-Modell), Raycast
  nur bei Mausbewegung, gedrosselt. Hover: Glühen + Beschriftung (HTML-Overlay), Klick: Kamera fliegt hin, Proof-Overlay öffnet.
- **Tastatur und Screenreader:** jedes Organ ist zusätzlich als **Liste im HTML** vorhanden (Fokus, Enter), Beschriftungen als
  `aria-label`. 3D ist Zusatz, nicht der einzige Zugang.
- **Handy:** Zwei-Finger-Zoom/Drehen; vertikales Scrollen der Seite hat Vorrang, 3D-Fläche fängt Gesten nur im Modus „Frei erkunden“.
- **Reduced Motion:** keine Kamerafahrten, Szenen springen zwischen Haltepunkten.

## 6) Performance-Budget und adaptive Qualität
**Budgets (Ausgangswerte, werden in Phase 0 an echter Hardware kalibriert):**

| Größe | Desktop „hoch“ | Handy „niedrig/mittel“ |
|---|---|---|
| Bildrate (Ziel) | 60 FPS, 95. Perzentil der Frames ≤ 16,7 ms | 30–60 FPS, ≤ 33 ms |
| Draw Calls pro Frame | ≤ 150 | ≤ 60 |
| Dreiecke sichtbar | ≤ 1,5 Mio. | ≤ 300 k |
| Grafikspeicher (Texturen+Geometrie) | ≤ 400 MB | ≤ 120 MB |
| Gerätepixel-Verhältnis (DPR) | ≤ 2 | ≤ 1,5 (dynamisch bis 1) |
| Download bis erste Szene sichtbar | ≤ 3 MB | ≤ 2 MB |
| Je weiteres Modell (komprimiert) | ≤ 4 MB | LOD 1 ≤ 1,5 MB |

**Qualitätsstufen:** `ultra` · `hoch` · `mittel` · `niedrig` · `statisch` (kein WebGL, nur Bild-Slots). Jede Stufe legt fest: DPR,
Effekte, Schattenqualität, LOD-Stufe, Partikelanzahl, Texturgröße.

**Automatische Wahl (kein Fremddienst):**
1. Start: Schätzung aus `renderer.capabilities`, `devicePixelRatio`, `navigator.hardwareConcurrency`, `deviceMemory`, Bildschirmgröße.
   *Keine* Bibliothek, die Benchmark-Daten von einem CDN lädt (Datenschutz).
2. Laufzeit: **Frame-Zeit-Regler**. Gleitender Mittelwert + 95. Perzentil über 2 s. Bei Überschreitung zuerst DPR senken (dynamische
   Auflösung), dann Effekte abschalten, dann LOD/Partikel reduzieren. **Hysterese:** Hochschalten nur nach 10 s stabil, nie öfter als
   alle 30 s, damit es nicht flackert.
3. Rückschalten: Tab im Hintergrund/Szene nicht sichtbar → Rendern pausiert (`IntersectionObserver`, `visibilitychange`).
4. Akku/Datensparer (`saveData`, „Energiesparmodus“-Hinweise, soweit erkennbar) → höchstens „mittel“.
5. Der Betreiber kann die Stufe manuell wählen (kleines Menü, wird in `localStorage` gemerkt, mit `try/catch`).

**Weitere Regeln:** keine Allokationen in der Render-Schleife, Geometrien/Materialien/Texturen beim Szenenwechsel
`dispose()`n, Resize entprellt, Render-on-demand für ruhige Szenen (Bild nur neu zeichnen, wenn sich etwas bewegt).

## 7) Lade-Erlebnis
- **Sofort sichtbar:** HTML/CSS-Hülle mit Navigation und Hero-Text; **Bild-Slots** (Hero-Welt, Figur) erscheinen als Poster, noch
  bevor Three.js geladen ist. Mit Slot-System und `hasAsset()` ist das schon vorbereitet.
- **Progressiv:** Poster (Slot) → Szene mit LOD 0 + kleiner HDRI → Texturen/LOD 1 → LOD 2. Der Wechsel passiert unbemerkt per
  Überblendung.
- **Echter Fortschritt:** `THREE.LoadingManager` liefert echte Prozente. Der Ladebildschirm ist **kurz und gestaltet** (Logo, feine
  Linie, Prozent), nie eine reine Wartezeit. Ziel: erste Interaktion in ≤ 3 s auf gutem Netz.
- **Kein Warten auf Unwichtiges:** Szenen außerhalb des Bildschirms werden erst beim Näherkommen vorgeladen (Prefetch bei
  Leerlauf, `requestIdleCallback`). Dekoder (Meshopt/KTX2) laufen in **Web Workern**.
- **Fehlerpfad:** schlägt ein Modell fehl, bleibt der Bild-Slot stehen und die Seite funktioniert weiter (mit Konsolenhinweis).
- **Zwischenspeicher:** langlebige Dateinamen mit Inhalts-Hash (Vite macht das), damit Wiederbesuche nichts neu laden.

## 8) Benötigte 3D-Modelle, Herkunft, Lizenz (nur kostenlos)
**Grundsatz:** Nur frei lizenziertes Material, bevorzugt **CC0/gemeinfrei**. Pro Datei ein Eintrag in `public/assets/CREDITS.md`
(Quelle-URL, Autor, Lizenz, Datum, Änderungen). **Nichts kaufen, keine KI-3D-Erzeugung** (CLAUDE.md).
- **CC0 / Public Domain:** bevorzugt, ohne Auflage.
- **CC BY:** erlaubt, Namensnennung Pflicht (Credits-Seite auf der Website).
- **CC BY-SA:** nur nach Rückfrage (abgeleitete Modelle müssten unter gleicher Lizenz stehen). **CC BY-NC:** nicht verwenden.
- NASA-Material ist meist gemeinfrei; **Nutzungsbedingungen je Datei prüfen** (einzelne Bilder haben Drittrechte).

| Bereich | Umsetzung | Herkunft (alle kostenlos) | Hinweis |
|---|---|---|---|
| **Körper** (Ganzkörper) | frei lizenziertes GLB, transparent nutzbar | Sketchfab (nur CC0/CC BY filtern), NIH 3D, Smithsonian 3D; BodyParts3D ist CC BY-SA → nur nach Rückfrage; sonst freies Basis-Mesh in Blender selbst bearbeiten | Lizenz klären, bevor etwas verbaut wird. Medizinische Prüfung durch Fachleute im Pilot-Review |
| **Organe** (Herz, Gehirn, Lunge, Leber, Magen, Darm, Nieren, Haut, Immun, Endokrin) | je ein Einzelmodell, Pick-Mesh je Organ | wie Körper; „Immun“ und „Endokrin“ ggf. als berechnete Darstellung (Zellen/Drüsen) im Code | Taugt kein freies Modell: berechnete Stilisierung im Code statt Kauf |
| **Erde/Weltkugel** | Kugel im Code + Texturen | **NASA Visible Earth** (Blue Marble, Nachtlichter, Höhe/Wolken), Lizenz je Datei prüfen und dokumentieren | Texturen als KTX2; 8k nur auf „ultra“ |
| **Geometrie, Wellen, Kymatik, Chakren, Energiezentren, Partikel** | **im Code erzeugt** (Three.js, Shader), keine Modelle | – | Kymatik als Shader/Partikelfeld (Chladni-Formeln), Chakren als berechnete Geometrie |
| **Pflanzen, Kräuter, Obst, Gemüse, Kristalle, Orte, Hintergründe** | **Bilder** des Betreibers in Slots, Tiefe durch 2,5D (3b) | vom Betreiber erzeugt; für reale Orte eigene oder frei lizenzierte Fotos (Wikimedia Commons, Unsplash-Lizenz) | **Keine 3D-Modelle** |

Wegfall gegenüber dem ersten Entwurf: Pflanzen-, Kristall- und Orts-GLBs sowie alle Kauf- und KI-Wege.

## 9) Ruckelfreiheit messen und auf der echten Grafikkarte testen
**Eingebauter Messmodus** (`?debug=perf`, nie im Produktions-Build sichtbar):
- Overlay mit FPS, Frame-Zeit (Mittel, 95./99. Perzentil), Draw Calls, Dreiecke, Texturen, Geometrien (`renderer.info`), aktuelle
  Qualitätsstufe, DPR, Ladezeiten je Modell, Anzahl „langer Frames“ (> 33 ms).
- **Aufzeichnung:** Messlauf per Knopfdruck fährt die Kamerabahn automatisch ab und schreibt einen Bericht (JSON +
  Markdown-Tabelle) nach `exports/perf/` (Git-ignoriert). Gleiche Fahrt, gleiche Auswertung → vergleichbar zwischen Rechnern.
- GPU-Zeit, wo der Browser es erlaubt (`EXT_disjoint_timer_query_webgl2`), sonst nur CPU-Frame-Zeit.

**Test auf der echten Grafikkarte des Betreibers (Windows):**
1. Betreiber öffnet `chrome://gpu` und schickt die Zeilen „Graphics Feature Status“, GPU-Name und Treiber (ohne private Daten).
   Hardwarebeschleunigung muss an sein (Einstellungen → System), sonst misst man die Software-Darstellung.
2. Messlauf `?debug=perf` auf Desktop in Chrome und Edge, bei 100 % Skalierung und bei der echten Bildschirmauflösung.
3. Chrome DevTools → Performance: 10 s Aufnahme beim Scrollen; Zeitleiste prüfen auf „Long Tasks“ und Frames > 16,7 ms.
4. Zusätzlich **Drosselung** testen (DevTools: CPU 4×/6× langsamer), um Mittelklasse-Handys zu simulieren.
5. **Echtes Handy:** Seite im selben WLAN über die lokale Adresse öffnen (`npm run dev -- --host`), Messlauf, Bericht per
   Foto/Export. Mindestens ein Android-Mittelklassegerät und ein iPhone (Safari), falls vorhanden.
6. Nach Phase 0 gilt: **kein Merge ohne Messbericht** je Szene, mit Tabelle (Gerät, Stufe, FPS Mittel/p95, Speicher).

**Weitere Prüfungen:** Lighthouse (Leistung, Zugänglichkeit), Speicherlecks (Szenenwechsel 20× hintereinander, Speicher darf nicht
wachsen), Kontextverlust simulieren (`WEBGL_lose_context`), `prefers-reduced-motion` an/aus, Tastaturbedienung.

## 10) Reihenfolge der Umsetzung
Jede Phase endet mit Build ohne Fehler, Konsole sauber, Messbericht (ab Phase 1) und lokalem Commit. Dazwischen frage ich nach.

| Phase | Inhalt | Ergebnis / Abnahme |
|---|---|---|
| **0 – Messbasis** | Debug-Overlay, Messlauf, Qualitätsstufen-Gerüst, `chrome://gpu`-Auswertung des Betreibers | Bericht der echten Grafikkarte, Budgets bestätigt oder angepasst |
| **1 – Kern** | Gemeinsamer Renderer/Canvas, Szenen-Modul-Schnittstelle, Kontextverlust-Behandlung, Resize, Pausieren, dynamische Auflösung; bestehende Szenen als erste Module (noch prozedural) | Alte Szenen laufen im neuen Kern, Speichertest bestanden |
| **2 – Laden** | LoadingManager, Ladebildschirm, `import()`-Aufteilung, Meshopt/KTX2-Dekoder (selbst gehostet), Poster-Übergabe vom Slot zur Szene | Hero zeigt Slot-Bild sofort, Szene folgt ohne Sprung |
| **3 – Look** | HDRI, Lichtrig, Tonemapping, Post-Processing-Stufen, PBR-Materialtest mit Erde und einem Organ | Look-Referenz im Browser abgenommen |
| **4 – Scroll/Kamera** | Lenis + ScrollTrigger, Kamerabahn, Haltepunkte, Frei-Modus, Tastatur, Reduced Motion | Hero-Kamerafahrt steuerbar, Handy-Gesten getestet |
| **5 – Pipeline** | `models:optimize`, Credits-Prozess, erstes freies GLB (Körper) | Datei < Budget, dekodiert im Worker |
| **6 – Körper** | Körpermodell + Organe, Pick-Meshes, Hover/Klick → Proof-Overlay, HTML-Liste als Zugang | Organ anklicken öffnet echte Aussagen |
| **7 – Erde und berechnetes 3D** | Weltkugel (NASA-Texturen), Frequenz-/Kymatik-/Wellen-/Geometrie-/Chakren-Szenen im Code | je Szene Messbericht |
| **7b – 2,5D-Karten** | `depthCard`: Ebenen, Parallax, Neigung, Reflex, Glow, gemeinsames Partikelsystem für Pflanzen, Kristalle, Orte, Hintergründe | wirkt schon mit Platzhaltern, wird mit echten Ebenen besser |
| **8 – Polieren** | Bewegung final, Handy-Feinschliff, Lighthouse, Release-Check (`build:release`) | bereit zur Fachprüfung (Pilot-Regeln bleiben) |

Die **Startseite** (Layout, Navigation, Typografie, Panels, Suche) ist unabhängig von den Phasen 1–8 mit Bild-Slots baubar und
kann **vor** Phase 0 beginnen.

## Offene Fragen an den Betreiber
1. Grafikkarte/Rechner/Handy für Tests (Schritt 9.1).
2. Entschieden: nur frei lizenziert, kein Kauf. Offen bleibt nur, welches freie Körpermodell taugt (Lizenzprüfung vor dem Einbau).
3. Neue Pakete, alle kostenlos/Open Source: `lenis`, `postprocessing`, `@gltf-transform/cli` (nur Entwicklung) – einverstanden?
4. WebGPU später prüfen oder ganz weglassen?
5. Wie viel Gewicht hat der Handy-Auftritt im Pilot (volles 3D oder nur Poster plus ein einfaches 3D)?
