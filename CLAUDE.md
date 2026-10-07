# THE SOURCE CODES – Projektanleitung für Claude Code

Sprache mit dem Nutzer: **Deutsch**, kurz und klar, keine Fachbegriffe ohne Erklärung. Der Nutzer ist kein Entwickler
(Windows, nutzt cmd/PowerShell nur nach Anleitung). Schritte immer einzeln und mit Klickwegen erklären.

## Worum es geht
Eine interaktive Wissens-Webseite („digitale Bibliothek“) über Körper, Natur, Geschichte, Frequenzen, Pflanzen und Kristalle.
Kernprinzip: **Jede Aussage hat Quellen und eine Belegstufe.** Das System dafür (content/, src/data/) ist der wertvollste Teil.
Domain `thesourcecodes.io` ist noch NICHT gekauft – nicht als existierend darstellen.

## Arbeitsmodus: PILOT (vom Nutzer so festgelegt)
Die Webseite ist ein **Pilotprojekt**. Sie wird zuerst mit allen Inhalten gebaut, die der Nutzer liefert, auch wenn sie nicht
belegt sind. Erst wenn alles steht, prüfen Fachleute (Ärzte, Wissenschaftler, Physiker, Arabisten …) die Richtigkeit und
korrigieren. Deshalb gilt:

**Gelockert**
- Inhalte des Nutzers werden so übernommen, wie er sie liefert – im Wortlaut und in der Absicht. Nicht abschwächen, nicht
  umdeuten, nicht stillschweigend „korrigieren“. Hält Claude etwas für sachlich falsch, sagt es das in einem Satz und
  pflegt es trotzdem ein (Hinweis in `rationale`), damit die Fachleute genau dort ansetzen können.
- Neue, ungeprüfte Inhalte: `level: "claimed"`, Quelle `kind: "editorial-input"` („Angabe des Betreibers, ungeprüft“),
  `review: { "state": "pending" }`, `status: "published"` (sichtbar in der Pilotseite). Die Pflicht zu Peer-Review-Quellen
  gilt erst nach der Fachprüfung (siehe `src/data/validate.ts`).
- Bereits vergebene Belegstufen bleiben, wenn Gegenbelege bekannt sind (z. B. Rife = `unsupported`). `claimed` ist nur für
  das, was noch niemand bewertet hat. Koran-Einträge dürfen in der Pilotseite sichtbar sein (Review `pending`).
- Inhaltlich breit und mutig sein ist erlaubt.

**Bleibt (Schutzlinien, auch im Pilot)**
1. Keine erfundenen Quellen, DOIs, Studien, Zahlen, Zitate oder Experten. Fehlt eine Quelle: „Source pending verification“.
2. Nichts wird `confirmed`/`corrected`/„verified“ ohne echte Prüfung durch eine genannte Person mit Datum (`review.reviewer`, `review.date`).
3. Keine Anleitungen, Medikamente abzusetzen oder zu ersetzen, keine Dosierungen oder Behandlungsanleitungen für Krankheiten
   (z. B. Krebs), keine Heilversprechen im eigenen Ton der Seite. Behauptungen erscheinen als Behauptung (`claimed`), nicht
   als Tatsache. Der Hinweis „keine medizinische Beratung“ bleibt sichtbar.
4. Der Pilot-Hinweis (Banner in `src/main.ts`) bleibt sichtbar, bis alle veröffentlichten Aussagen geprüft sind. **Nichts
   Ungeprüftes wird öffentlich ausgeliefert:** `npm run build:release` (Prüfschranke `release:check`) muss bestehen, bevor
   deployt wird. Kein Hosting auf einer öffentlichen Domain im Pilotstatus.
5. Datenschutz bleibt (Einwilligung bei Interviews, keine privaten Daten, Noreply-Mailadresse in Commits).
6. Zählungen in Texten (Koran usw.) nur als Textbefund mit Zählregel und zwei Ausgaben; Deutungen sind eigene Claims.
7. Mockups enthalten Platzhalter („10,000+ Verified References“, „VERIFIED“-Stempel): nicht übernehmen, Zahlen aus echten Daten.
8. Impressum/Datenschutz nicht erfinden (Nutzer liefert Name/Anschrift später). Domain `thesourcecodes.io` ist noch nicht gekauft.

**Ablauf bis zur Veröffentlichung**
Seite bauen → `npm run review:export` (erzeugt `exports/expert-review.md` für die Fachleute) → Fachleute prüfen →
Ergebnisse eintragen (`review`, echte Belegstufe, Korrekturen) → `npm run build:release` → erst dann veröffentlichen.

## Datenschutz & Git
- Repository ist **öffentlich** (github.com/bugimugi/the-source-codes). Keine privaten Daten, keine Interviews mit Klarnamen
  ohne schriftliche Einwilligung (`consent: true`), keine Schlüssel/Passwörter committen.
- Git-Identität in diesem Repo: `git config user.name bugimugi` und `git config user.email bugimugi@users.noreply.github.com`
  (die private E-Mail des Nutzers darf NIE in Commits stehen).
- Branches: `main` = erste prozedurale Version, `v1-procedural` = Sicherung davon, **`v2-design` = aktuelle Arbeit**.
  Nicht in `main` pushen ohne ausdrückliche Freigabe. Keine Force-Pushes.
- Tags lassen sich nicht pushen (Proxy); Sicherungen als Branch.

## Stack
Vite + TypeScript, Three.js, GSAP. Kein React. Schriften lokal über @fontsource (kein Google-CDN, wegen DSGVO).
Befehle: `npm install`, `npm run dev` (http://localhost:5173), `npm run build`, `npm run validate:data`, `npm run report`.
Der Build läuft nur durch, wenn `validate:data` besteht.

## Design (v2)
Der Nutzer hat **Landingpage-Vorschaubilder** als Layout-Vorlage. Sie liegen lokal in `design/mockups/` und/oder `public/references/`
(beides NICHT committet – `.gitignore` schließt sie aus, weil das Repository öffentlich ist; niemals mit `git add -f`
erzwingen; vor jedem Commit `git status` prüfen). `public/references` wird im Produktions-Build entfernt (`vite.config.ts`). Die Vorschauen sind **keine
Bildquellen**: Text und Oberfläche sind eingebacken, die Auflösung ist zu klein. Die einzelnen Bildwelten (Hero-Figur, Welt,
Planeten, Kartenbilder, Organe …) werden vom Nutzer **separat erzeugt**; die Liste mit Prompts steht in `docs/ASSET-LIST.md`.
Aufgabe: Seiten in echtem Code nachbauen (Text, Buttons, Navigation, Overlays als HTML/CSS) und die Bilder, sobald sie vorliegen,
als Ebenen einbauen. Originale lokal in `design/assets-raw/` (ignoriert); optimierte Fassungen (WebP/AVIF, mehrere Größen)
nach `public/assets/` mit Eintrag in `public/assets/CREDITS.md`. Leuchtende Motive liegen auf reinem Schwarz und werden mit
`mix-blend-mode: screen` bzw. additiver Überblendung eingesetzt. Bis ein Bild existiert, bleibt der prozedurale Platzhalter
(Slot mit Fallback) – nichts blockieren. Ebenen mit leichter Parallax zur Maus; WebGL-Partikel, Pins und Kamerafahrten darüber.
Details: `docs/V2-PLAN.md`. Bildgenerierung (Higgsfield, Adobe u. a.) kostet Guthaben: Claude nutzt sie nicht (siehe „Harte Regeln“).
- Farben/Typografie: siehe `docs/DESIGN.md` (Deep Space #02070B, Gold #CBAA67/#F0D18B, Cyan #58D6E8, Elfenbein #ECE8DE;
  Cinzel/Cormorant für Titel, Inter für UI, Großbuchstaben mit weitem Letterspacing).
- Hero-Texte sind Englisch (laut Vorgabe); Universum/Atlas/Bühnen aktuell Deutsch → später DE/EN-Umschalter klären.
- Nicht wie ein Dashboard oder Template aussehen. Erst entdecken → fokussieren → enthüllen. Wenig UI, große Szenen.
- Zugänglichkeit: `prefers-reduced-motion`, Tastaturbedienung, WebGL-Fallback (Seite muss ohne WebGL benutzbar bleiben).
- Performance: Szenen lazy laden, Bilder komprimieren, Gerätepixel begrenzen.

## Was schon existiert (Stand Phase 1 der prozeduralen Version)
Hero (src/gl/hero.ts), Proof-Overlay mit Tabs/Status (src/ui/proofOverlay.ts), Wissenssuche (src/ui/search.ts), Manifest,
Universum mit Galaxien und Themenbühnen (src/gl/universe.ts, stages.ts), Atlas für Pflanzen/Kristalle (src/ui/atlas.ts,
content/atlas/). 47 Aussagen, 21 Atlas-Einträge, viele Zitate noch `verified: false`.
Dazu die scrollende Startseite (src/ui/home.ts, src/data/home.ts) und die Frequenz-Seite mit berechnetem 3D: Kymatik-Platte
und Heilige Geometrie (src/ui/fx.ts, src/gl/fxscene.ts, src/data/cymatics.ts, src/data/geometry.ts; Ton: src/audio/tone.ts).
Bilder für Atlas-Einträge (`atlas-<id>`) erscheinen als 2,5D-Karte (src/ui/depthCard.ts); ohne Bild bleibt das einfache 3D-Modell.
Körper-Seite mit Organ-Pins auf dem Anatomie-Bild (src/ui/body.ts, src/data/body.ts; Zuordnungen kommen nur aus dem Atlas, Wort für Wort).
Chakren-Seite mit berechnetem 3D (src/ui/chakra.ts, src/gl/chakrascene.ts, src/data/chakras.ts): Überlieferung und moderne Zuordnungen getrennt, Quellen "pending".
Atem-Seite mit Übungs-Timer ohne WebGL (src/ui/breath.ts, src/data/breath.ts): keine Wirkaussagen, Lehrbuchwissen und Überlieferungen getrennt.
Orte-Seite mit berechneter Weltkugel (src/ui/places.ts, src/gl/globescene.ts, src/data/sites.ts; Küstenpunkte aus Natural Earth via `npm run globe:data`): keine Linien zwischen Orten, keine Energie-Behauptungen. Alle Vollbild-Ansichten stehen in `VIEW_TABS` und `SCREENS` in src/main.ts.
Alte Kulturen als Akten (src/ui/cultures.ts, src/data/cultures.ts): acht Akten, getrennt in Dokumentiert / Überlieferung / Offene Frage / Behauptungen (geschwärzt bis zum Klick, mit Belegstufe und Gegenbelegen); alle Texte im Pilot ungeprüft, Quellen "pending". Nährstoffe (src/ui/nutrients.ts, src/data/nutrients.ts): Lehrbuchniveau, keine Mengen oder Dosierungen.
Pilze sind eine Atlas-Kategorie (`pilz`, 8 Einträge in content/atlas/, Aussagen in content/claims/): Platzhalter-Modelle in src/gl/models.ts bis die Bilder `atlas-<id>` da sind; Wildpilz-Warnung bei essbaren Arten, Fliegenpilz als giftig gekennzeichnet.
Freie Energie der Erde ist die Seite hinter der Kachel "Lab & Experimente" (src/ui/energy.ts, src/data/energy.ts, src/gl/fieldscene.ts): die These des Betreibers ("Erde erzeugt kostenlos Strom, kein Cent nötig") steht als `claimed` mit Einordnung und Gegenbelegen; sieben Energiequellen und acht Themen als Akten, drei berechnete Demos (Atmosphäre, Blitz, Erde mit Magnetfeld). Gemeinsame Akten-Bausteine in src/ui/dossierParts.ts. **Die Startseite bleibt unverändert** (Nutzerwunsch): DIY-Labor-Abschnitt und Menüpunkt "Labor" bleiben; nur das Titelbild der Kachel `tile-lab` wird später durch ein Energie-Motiv ersetzt.
Freie Energie der Erde (src/ui/energy.ts, src/data/energy.ts, src/gl/fieldscene.ts): These des Betreibers (`claimed`) neben Dokumentiertem und Gegenbelegen, 7 Quellen und 8 Themen als Akten, drei berechnete Demos. Erreichbar über den Tab „Energie“ und über einen Link auf der Rezepte-Seite (die Kachel „Lab & Experimente“ der Startseite führt jetzt zu „Rezepte & Rituale“).
Rezepte & Rituale (Arbeitstitel, Name noch nicht festgelegt: `LAB_NAME` in src/data/lab.ts; src/ui/lab.ts mit vier Stationen): **Werkbank** (src/ui/labBench.ts, src/data/recipes*.ts, 24 Rezepte aus Oma/Kloster, Ayurveda, TCM, Antike, indigen; Gefäß-SVG füllt sich Schritt für Schritt, Portionsrechner, Timer, Sicherheit, „Wann zum Arzt“, Quellen; Mengen nur, wo eine Quelle sie nennt, sonst „in der Quelle nicht genannt“; keine Dosierungen, keine psychoaktiven oder giftigen Pflanzen; Regeln in src/data/validateRecipes.ts, Freigabe-Sperre in `release:check`), **Ritualraum** (src/ui/labRitual.ts: sitzende Figur, Heilsteine mit Radius-Ring, Klang, Chakren gleichen sich im Zeitraffer aus; ausdrücklich Vorstellungshilfe, Quellen und Gegenbelege daneben; für „Amethyst 1–2 m“ wurde keine Quelle gefunden) **Erdung & Metalle** (src/ui/labEarth.ts, src/data/earth.ts: Körper-Batterie in drei Ansichten – Physik von Aufladung und Ableitung über Untergrund und Schuhsohle in Zeitlupe, die Earthing-Behauptung als eigens gekennzeichnete Darstellung, die Zelle als echte Batterie mit etwa −70 mV; Metalle (Gold, Silber, Kupfer, Zink, Eisen) und Formen als Schmuck mit Lehrbuch-Leitfähigkeit, Kupferarmband-Studie als Gegenbeleg; Pyramide mit goldener Spitze als Rekonstruktion: Pyramidion, Hatschepsuts Elektrum-Obelisken, Blitzableiter, „Pyramidenkraft“ als unbelegt; Gewitter-/Schrittspannungs-Warnung; Verknüpfung zu den Akten Erdung und Schmuck auf der Energie-Seite) und **Stoffe** (src/ui/labFabrics.ts, src/data/fabrics.ts: Puppe, symbolische Anzeige der Behauptung „Kunstfaser dämpft, Naturfaser hebt die Frequenz“ ohne eigene Zahlen, kursierende Zahlen nur als Behauptung mit Herkunft, daneben belegte Fasereigenschaften). Die Recherche-Berichte (nur Suchauszüge, keine Originalseiten, weil der Zugriff gesperrt war) liegen nicht im Repository; alle Quellen sind deshalb als „Suchauszug, Source pending verification“ gekennzeichnet.
Pflanzenatlas (Landingpage hinter der Kachel „Pflanzen“ und „Alle Pflanzen →“ auf der Startseite; src/ui/plants.ts, src/data/plants.ts, src/plants.css; Tab „Pflanzen“): nach Referenzbild gebaut mit Hero, Suche, 9 Kategoriekarten, „Beliebte Pflanzen“, Weltkarte mit Regionen (Punktkarte aus Natural Earth, bis `plants-map` existiert), Themen-Suche (nur überlieferte Zuordnungen), Körper- und Kulturen-Panel, Entdeckungen. Alle Zahlen kommen aus den Daten; 7 neue Atlas-Pflanzen (Ashwagandha, Rosmarin, Kurkuma, Salbei, Echinacea, Aloe vera, Teebaum) mit Aussagen `claimed`/`hypothesis`. Neue Bildplätze `plants-*` (Priorität 8); bis dahin werden vorhandene Kachel-, Nährstoff- und Hero-Bilder verwendet. Details zur Vorlage: docs/MOCKUP-NOTES.md, Seite 17.
Pflanzenprofil (Seite hinter jeder Pflanze im Pflanzenatlas: Karten, „Beliebt“-Chips, Suche und Themenliste öffnen sie; src/ui/plantProfile.ts, src/data/profiles.ts, src/ui/plantArt.ts, src/ui/icons.ts, src/plantProfile.css; View `plant` in src/main.ts): **Ashwagandha ist die vollständige Vorlage** nach Referenzbild (docs/MOCKUP-NOTES.md, Seite 18) mit Hero, „Auf einen Blick“, Pflanzenteilen mit Beschriftungen, botanischen Merkmalen, Ursprung (Punktkarte), Geschmack/Duft, Wachstumszyklus, Inhaltsstoffen, Wirkung (Belegfeld aus den Claims), Frequenz (Ton nur auf Klick, Behauptung mit Schwärzung), Anwendungsformen **ohne Mengen**, Kombinationen, Geschichte, Forschung (echte Studien als „Suchauszug, Source pending verification“) und Wissensnetz; alle anderen Pflanzen bekommen automatisch ein Kurzprofil aus ihrem Atlas-Eintrag. Wirkaussagen stehen nicht im Profiltext, sondern als Claims `ashwagandha-*` (Studienlage `hypothesis`, Sicherheit `supported`, Rest `claimed`). Fehlende Bilder zeigen gezeichnete Platzhalter aus dem Code; Bildplätze `plant-ashwagandha-*`, `form-*`, `compound-withaferin-a` (Priorität 8). **Zwei Aufbauten:** `layout: "kraut"` (Ashwagandha) und `layout: "frucht"` (**Granatapfel**, Referenzbild 19: Nährwerte mit EU-Referenzbalken, Wachstumskreis, Reiter mit Inhaltsstoff-Bildchen, weitere Frequenzen 432–852 Hz); Typen in src/data/profileTypes.ts, Daten in profiles.ts / profileGranatapfel.ts, Prüfung (Aussagen, Atlas-Einträge, Bildplätze, Positionen) in src/data/validateProfiles.ts (läuft in `validate:data`). Ein Profil merkt sich, von welcher Landingpage es geöffnet wurde (`from`: Pflanzenatlas oder Obst & Gemüse Atlas): Brotkrumen, Tab und „Zurück“ führen dorthin. Für eine weitere Pflanze mit vollem Profil: Eintrag in `PROFILES` (profiles.ts), Claims in content/claims/, Bilder `plant-<id>-*` in registry.ts.
Obst & Gemüse Atlas (Landingpage hinter der Kachel „Gemüse & Obst“; src/ui/produce.ts, src/data/produce.ts, src/produce.css; View `produce`, Tab „Obst & Gemüse“) nach Referenzbild 20: Hero mit Suche und Kennzahlen (aus dem Atlas gezählt), 16 Kategoriekarten (Gruppen in `GROUPS`; leere Gruppen als „in Vorbereitung“), beliebte Einträge mit Stichwort (bekannter Inhaltsstoff, `TAGLINE`, keine Wirkaussage), Weltkarte mit Regionen und Saisonkalender (Mitteleuropa, aktuelle Jahreszeit markiert), Nährstoffgruppen (Lehrbuchtext), Körperbereiche (Link zum Körper-Atlas), Küchen, Rezeptkarten („folgt“) und Wissensnetz. Jeder Eintrag öffnet sein Profil (Granatapfel voll, sonst Kurzprofil). Neue Atlas-Einträge Avocado, Brokkoli, Spinat, Knoblauch, Heidelbeere, Zitrone, Süßkirsche, Linse, Kürbis (Fakten Lehrbuchwissen, Quellen „pending“, keine Wirkaussagen). Bildplätze `obst-*` (Priorität 8); bis dahin Symbole auf getönten Flächen und das Kachelbild `tile-gemuese-obst` im Hero.
Baum Atlas (Landingpage hinter der Kachel „Bäume“; src/ui/trees.ts, src/data/trees.ts, src/trees.css; View `trees`, Tab „Bäume“) nach Referenzbild 21: Hero mit Suche, Kennzahlen (58.497 bekannte Baumarten laut BGCI/Global Tree Assessment, Rest aus dem Atlas gezählt) und „Auf einen Blick“, 9 Kategorien, anklickbares Schaubild „Der Baum als lebendiges System“ (7 Teile, gezeichneter Platzhalter in src/ui/plantArt.ts), „Energiefluss & Geometrie“ (gemessene Punkte als Lehrbuchwissen, Torus/Fraktale/Goldener Schnitt als Aussagen mit Belegstufe), vier Wissensebenen mit typischer Belegstufe, Weltkarte, beliebte und älteste Bäume (Alter als Schätzspannen), Ökosystem, Leistungen für die Erde und drei Themenkarten. 9 neue Baum-Einträge (Eiche, Ahorn, Olivenbaum, Buche, Zeder, Mammutbaum, Baobab, Ginkgo, Kiefer); Profile öffnen als Kurzprofil und führen über „Zurück“ hierher (`ProfileFrom` "trees"). Gemeinsame Hilfen der drei Landingpages in src/ui/landing.ts. Bildplätze `baum-*` (Priorität 8); bis dahin das Kachelbild `tile-baeume` im Hero.
Bild-Werkzeug: `npm run assets:optimize` (Originale in design/assets-raw → WebP in public/assets).

## Harte Regeln (vom Nutzer festgelegt, gelten immer)
1. **Keine Zusatzkosten.** Keine kostenpflichtigen Dienste, APIs, Modelle, Plugins oder Bildgeneratoren, keine Einkäufe. Nur freie
   Software und Assets mit freier Lizenz (bevorzugt CC0/gemeinfrei, sonst mit Quellenangabe in `public/assets/CREDITS.md`).
   Im Zweifel erst fragen. Claude erzeugt selbst keine Bilder und keine KI-3D-Modelle.
2. **3D nur mit echtem Mehrwert:** Geometrie, Frequenzen, Schwingungen, Wellen, Kymatik, Chakren-Darstellung, menschlicher Körper
   und Organe, Weltkugel. **Pflanzen, Kräuter, Obst, Gemüse, Kristalle, Orte und Hintergründe sind BILDER** (vom Nutzer erzeugt),
   keine 3D-Modelle. Tiefe dafür durch **2,5D**: mehrere Ebenen mit Parallax, leichte Neigung zur Maus, Lichtreflex, Glow, Partikel.
3. **Berechnetes 3D** (Geometrie, Wellen, Kymatik, Partikel, Energiezentren) wird im Code erzeugt, ohne fremde Modelle. Für
   **Körper, Organe und Erde** nur frei lizenzierte Modelle/Texturen (z. B. NASA Visible Earth); Lizenz prüfen und in
   `public/assets/CREDITS.md` dokumentieren. Nichts kaufen, keine KI-3D-Erzeugung.
4. **Sparsamer Verbrauch.** Kleine Schritte, Dateien nur lesen, wenn nötig. Entwurfsbilder nicht wiederholt ansehen: sie sind in
   `docs/MOCKUP-NOTES.md` beschrieben, dort nachschlagen. Nach jedem Schritt dem Nutzer sagen, dass er `/usage` ansehen kann.
5. **Pushen:** Eine Cloud-Sitzung (Credit-Abrechnung) darf nach jeder fertigen, gebauten Phase auf `v2-design` pushen – der Nutzer holt es
   mit `git pull`. Nie nach `main`, nie Force-Push. Lokale Sitzungen (PowerShell) pushen nur auf ausdrücklichen Wunsch.

## Arbeitsweise
- Vor jeder größeren Änderung kurz den Plan nennen; nach jeder Phase: Build, im Browser prüfen (Konsole ohne Fehler),
  Desktop UND Handy ansehen, kurz dokumentieren.
- Neue Pakete nur mit Begründung und nur kostenlose, freie (Open Source).
- Bilder: nur Material, das dem Nutzer gehört, selbst erzeugt oder frei lizenziert ist. Herkunft/Generator bei Bedarf erfragen.
- Offene Inhaltsaufgaben stehen in `content/research/` und `CONTENT.md`.
