# THE SOURCE CODES – Projektanleitung für Claude Code

Sprache mit dem Nutzer: **Deutsch**, kurz und klar, keine Fachbegriffe ohne Erklärung. Der Nutzer ist kein Entwickler
(Windows, nutzt cmd/PowerShell nur nach Anleitung). Schritte immer einzeln und mit Klickwegen erklären.

**Vor jeder Arbeit:** diese Datei lesen, außerdem `docs/MOTION-STYLES.md` (Design und Motion) und für den Koran-Bereich
`docs/KORAN-PRUEFAUFTRAG.md`. Immer auf dem lokalen Stand des Projekts arbeiten, nicht auf einem älteren GitHub-Stand.

## Worum es geht
Eine interaktive Wissens-Webseite („digitale Bibliothek“) über Körper, Natur, Geschichte, Frequenzen, Pflanzen und Kristalle.
Kernprinzip: **Jede Aussage hat Quellen und eine Belegstufe.** Das System dafür (content/, src/data/) ist der wertvollste Teil.
Domain `thesourcecodes.io` ist noch NICHT gekauft – nicht als existierend darstellen.
Inhaltlich reicht die Seite über Schöpfung, Körper, Natur, Schwingung, altes Wissen und den Sinn des Lebens. Besucher sollen
verstehen, dass alles zusammenhängt, und sich Schritt für Schritt hindurcharbeiten können. Das Gefühl beim Ankommen:
„Ich darf das hier gerade erleben.“

## Oberste Regeln
1. **Verständlichkeit vor Effekt.** Jeder soll sofort wissen, wo er ist und wo er anfängt.
2. **Alles ist verknüpft**, aber die Verknüpfungen sind immer gleich dargestellt und leicht zu lesen.
3. **Ehrlich bleiben** (Schutzlinien 1 und 2 unten): Unsicheres wird als unsicher gekennzeichnet.
4. **Kleine Schritte:** erst Plan zeigen, dann bauen; der Build läuft immer durch (siehe „Arbeitsweise“).

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

## Zielbild: Menü und Lernweg (7 Punkte)
Das Menü ist gleichzeitig der Lernweg. (Umgesetzt als „Das eine Menü“, siehe „Was schon existiert“; die zweite Leiste mit den vielen Tabs ist weg.)
1. **Der Körper**: Organe, Nerven, Adern, Zellen, Nervensystem
2. **Gaben der Erde**: Pflanzen, Bäume, Obst & Gemüse, Pilze, Mineralien, Kristalle, Nährstoffe
3. **Schwingung**: Frequenzen, Klang, Geometrie, Muster
4. **Das Unsichtbare**: Chakren, Aura, Atem, Gedanken, Seele, drittes Auge
5. **Verlorenes Wissen**: alte Kulturen, heilige Orte, vergessene Techniken
6. **Rezepte & Rituale**: Zubereitungen, Atemübungen, Anwendungen (früher „Labor“)
7. **Warum wir hier sind**: Schöpfung, Koran und Wissenschaft, Sinn des Lebens, Leben nach dem Tod, wie wir leben sollen

Dazu: Suche und „Methode“. Das zweite Menü (Matrix-Leiste) entfällt. Die Matrix wird zur Verbindungsansicht innerhalb der Einträge.
Die Startseite hat zwei Einstiege: „Ich will verstehen“ (der Lernweg 1 bis 7) und „Ich habe Beschwerden“ (Körperteil oder Beschwerde wählen).

## Startseite (Zielbild)
- Die Section „Entdecke die Wissensmatrix“ (Kachelübersicht) bleibt. Sie wird in die sieben Menüpunkte gruppiert, jede Gruppe mit
  Nummer und Überschrift, ganz oben eine große Kachel „Beginne hier“.
- Der Hero wird stark vereinfacht: dunkler Hintergrund, Trailer-Video im Dokumentarstil (wird von Bugra erstellt, bis dahin
  Platzhalter-Standbild), ein Satz, ein Button „Betreten“. Keine Planeten, Partikel, DNA und Landschaften mehr gleichzeitig.
  Handy: Standbild mit leichter Bewegung.

## Aufbau jeder Eintragsseite
- Oben: Brotkrümel (z. B. Der Körper › Magen) und klarer Startpunkt.
- Mitte: Kernaussagen, kurz und gut lesbar.
- Unten: Verbindungen in **festen Gruppen mit fester Farbe und festem Icon**: Pflanzen, Mineralien und Kristalle, Frequenz, Atem,
  Nährstoffe, Rezepte.
- Am Ende: Button „Nächster Schritt“.
- Jede Kategorie-Landingpage hat einen eindeutigen Anfangspunkt („Beginne hier“) und eine Sortierung (A–Z oder nach Wirkung).

## Inhaltsregeln (Ergänzung zu den Schutzlinien oben)
- **Überlieferung statt Heilversprechen:** „wird traditionell angewendet bei …“, nie „heilt …“ (Schutzlinie 3).
- **Überlieferung ist gleichberechtigt.** Familien- und schamanisches Wissen darf auf die Seite, mit freiem Feld „Herkunft“
  (z. B. Familienüberlieferung, Studie, Buch). Es muss nicht bewiesen sein.
- **Sicherheitsangaben bei jedem Rezept und jeder Anwendung:** Menge, Wechselwirkungen, für wen nicht geeignet (Schwangere, Kinder,
  Menschen mit Medikamenten). Mengen nur, wo eine Quelle sie nennt (Schutzlinie 3; Klärung unter „Offene Entscheidungen“).
- **Hinweis** bei ernsten oder akuten Beschwerden: Medikamente nie ohne Rücksprache mit Ärztin oder Arzt absetzen. Ruhig und
  respektvoll formuliert.
- **Koran-Bereich:** drei Ebenen (Was im Koran steht, Was die Wissenschaft weiß, Der Zusammenhang). Jeder Eintrag zeigt seine Stufe
  A bis D. Zahlenvergleiche nur als „Numerische Auffälligkeit, Deutung offen“ und nur mit Skript-Zählung auf einem festen arabischen
  Text (siehe auch Schutzlinie 6). Keine Sternzeichen.

## Rollen (siehe `.claude/agents/`)
- **architekt**: Struktur, Menü, Datenmodell. Nur er ändert die Struktur.
- **art-director**: Design und Motion nach `docs/MOTION-STYLES.md`.
- **entwickler**: Umsetzung, Performance, Barrierefreiheit.
- **redakteur**: Inhalte nach Schema und den Inhaltsregeln.
- **pruefer**: testet im Browser (Handy und Desktop), meldet Fehler und fehlende Bilder, gibt frei. Er baut nicht selbst.

Arbeitsablauf der Rollen: Architekt → Art Director → Entwickler → Redakteur (Inhalt) → Prüfer. Nichts gilt als fertig ohne Freigabe
des Prüfers.

## Offene Entscheidungen (nicht eigenmächtig ändern)
- **Belegstufen-System:** Das bestehende System (Belegstufen, „Pilotversion“, Fachprüfung) bleibt unverändert, bis Bugra entscheidet,
  ob und wie es durch ein freieres „Herkunft“-Feld ersetzt wird.
- **Trailer-Video:** Skript und Shotliste erstellt Claude, das Video erzeugt Bugra (z. B. Kling, Adobe).
- **Fehlende Bilder:** Der Prüfer führt eine Liste. Es gibt keine erfundenen Ersatzbilder.
- **Zu klären (beim Zusammenführen aufgefallen):** (1) „Menge“ in den Sicherheitsangaben gegen Schutzlinie 3 (keine Dosierungen) und
  die Rezepte-Regel „Mengen nur, wo eine Quelle sie nennt“. (2) Das Zielbild der Startseite (stark vereinfachter Hero,
  „Labor“ heißt „Rezepte & Rituale“) gegen den Bestand: „Die Startseite bleibt unverändert“ (Eintrag „Freie Energie der
  Erde“) und die neu gebaute Wissensmatrix-Seite hinter „Universum“ (Referenzbild 31).

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
  **Neue Vorgabe:** Die Sprache der Seite ist Deutsch; der englische Hero-Text wird übersetzt.
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
Orte-Seite mit berechneter Weltkugel (src/ui/places.ts, src/gl/globescene.ts, src/data/sites.ts; Küstenpunkte aus Natural Earth via `npm run globe:data`): keine Linien zwischen Orten, keine Energie-Behauptungen. Alle Vollbild-Ansichten stehen in `SCREENS` in src/main.ts; im Menü stehen sie in src/data/menu.ts (siehe „Das eine Menü“).
Alte Kulturen als Akten (src/ui/cultures.ts, src/data/cultures.ts): acht Akten, getrennt in Dokumentiert / Überlieferung / Offene Frage / Behauptungen (geschwärzt bis zum Klick, mit Belegstufe und Gegenbelegen); alle Texte im Pilot ungeprüft, Quellen "pending". Nährstoffe: siehe Nährstoffe-Landingpage unten.
Pilze sind eine Atlas-Kategorie (`pilz`, 8 Einträge in content/atlas/, Aussagen in content/claims/): Platzhalter-Modelle in src/gl/models.ts bis die Bilder `atlas-<id>` da sind; Wildpilz-Warnung bei essbaren Arten, Fliegenpilz als giftig gekennzeichnet.
Freie Energie der Erde ist die Seite hinter der Kachel "Lab & Experimente" (src/ui/energy.ts, src/data/energy.ts, src/gl/fieldscene.ts): die These des Betreibers ("Erde erzeugt kostenlos Strom, kein Cent nötig") steht als `claimed` mit Einordnung und Gegenbelegen; sieben Energiequellen und acht Themen als Akten, drei berechnete Demos (Atmosphäre, Blitz, Erde mit Magnetfeld). Gemeinsame Akten-Bausteine in src/ui/dossierParts.ts. **Die Startseite bleibt unverändert** (Nutzerwunsch): DIY-Labor-Abschnitt und Menüpunkt "Labor" bleiben; nur das Titelbild der Kachel `tile-lab` wird später durch ein Energie-Motiv ersetzt.
Freie Energie der Erde (src/ui/energy.ts, src/data/energy.ts, src/gl/fieldscene.ts): These des Betreibers (`claimed`) neben Dokumentiertem und Gegenbelegen, 7 Quellen und 8 Themen als Akten, drei berechnete Demos. Erreichbar über den Tab „Energie“ und über einen Link auf der Rezepte-Seite (die Kachel „Lab & Experimente“ der Startseite führt jetzt zu „Rezepte & Rituale“).
Rezepte & Rituale (Arbeitstitel, Name noch nicht festgelegt: `LAB_NAME` in src/data/lab.ts; src/ui/lab.ts mit vier Stationen): **Werkbank** (src/ui/labBench.ts, src/data/recipes*.ts, 24 Rezepte aus Oma/Kloster, Ayurveda, TCM, Antike, indigen; Gefäß-SVG füllt sich Schritt für Schritt, Portionsrechner, Timer, Sicherheit, „Wann zum Arzt“, Quellen; Mengen nur, wo eine Quelle sie nennt, sonst „in der Quelle nicht genannt“; keine Dosierungen, keine psychoaktiven oder giftigen Pflanzen; Regeln in src/data/validateRecipes.ts, Freigabe-Sperre in `release:check`), **Ritualraum** (src/ui/labRitual.ts: sitzende Figur, Heilsteine mit Radius-Ring, Klang, Chakren gleichen sich im Zeitraffer aus; ausdrücklich Vorstellungshilfe, Quellen und Gegenbelege daneben; für „Amethyst 1–2 m“ wurde keine Quelle gefunden) **Erdung & Metalle** (src/ui/labEarth.ts, src/data/earth.ts: Körper-Batterie in drei Ansichten – Physik von Aufladung und Ableitung über Untergrund und Schuhsohle in Zeitlupe, die Earthing-Behauptung als eigens gekennzeichnete Darstellung, die Zelle als echte Batterie mit etwa −70 mV; Metalle (Gold, Silber, Kupfer, Zink, Eisen) und Formen als Schmuck mit Lehrbuch-Leitfähigkeit, Kupferarmband-Studie als Gegenbeleg; Pyramide mit goldener Spitze als Rekonstruktion: Pyramidion, Hatschepsuts Elektrum-Obelisken, Blitzableiter, „Pyramidenkraft“ als unbelegt; Gewitter-/Schrittspannungs-Warnung; Verknüpfung zu den Akten Erdung und Schmuck auf der Energie-Seite) und **Stoffe** (src/ui/labFabrics.ts, src/data/fabrics.ts: Puppe, symbolische Anzeige der Behauptung „Kunstfaser dämpft, Naturfaser hebt die Frequenz“ ohne eigene Zahlen, kursierende Zahlen nur als Behauptung mit Herkunft, daneben belegte Fasereigenschaften). Die Recherche-Berichte (nur Suchauszüge, keine Originalseiten, weil der Zugriff gesperrt war) liegen nicht im Repository; alle Quellen sind deshalb als „Suchauszug, Source pending verification“ gekennzeichnet.
Pflanzenatlas (Landingpage hinter der Kachel „Pflanzen“ und „Alle Pflanzen →“ auf der Startseite; src/ui/plants.ts, src/data/plants.ts, src/plants.css; Tab „Pflanzen“): nach Referenzbild gebaut mit Hero, Suche, 9 Kategoriekarten, „Beliebte Pflanzen“, Weltkarte mit Regionen (Punktkarte aus Natural Earth, bis `plants-map` existiert), Themen-Suche (nur überlieferte Zuordnungen), Körper- und Kulturen-Panel, Entdeckungen. Alle Zahlen kommen aus den Daten; 7 neue Atlas-Pflanzen (Ashwagandha, Rosmarin, Kurkuma, Salbei, Echinacea, Aloe vera, Teebaum) mit Aussagen `claimed`/`hypothesis`. Neue Bildplätze `plants-*` (Priorität 8); bis dahin werden vorhandene Kachel-, Nährstoff- und Hero-Bilder verwendet. Details zur Vorlage: docs/MOCKUP-NOTES.md, Seite 17.
Pflanzenprofil (Seite hinter jeder Pflanze im Pflanzenatlas: Karten, „Beliebt“-Chips, Suche und Themenliste öffnen sie; src/ui/plantProfile.ts, src/data/profiles.ts, src/ui/plantArt.ts, src/ui/icons.ts, src/plantProfile.css; View `plant` in src/main.ts): **Ashwagandha ist die vollständige Vorlage** nach Referenzbild (docs/MOCKUP-NOTES.md, Seite 18) mit Hero, „Auf einen Blick“, Pflanzenteilen mit Beschriftungen, botanischen Merkmalen, Ursprung (Punktkarte), Geschmack/Duft, Wachstumszyklus, Inhaltsstoffen, Wirkung (Belegfeld aus den Claims), Frequenz (Ton nur auf Klick, Behauptung mit Schwärzung), Anwendungsformen **ohne Mengen**, Kombinationen, Geschichte, Forschung (echte Studien als „Suchauszug, Source pending verification“) und Wissensnetz; alle anderen Pflanzen bekommen automatisch ein Kurzprofil aus ihrem Atlas-Eintrag. Wirkaussagen stehen nicht im Profiltext, sondern als Claims `ashwagandha-*` (Studienlage `hypothesis`, Sicherheit `supported`, Rest `claimed`). Fehlende Bilder zeigen gezeichnete Platzhalter aus dem Code; Bildplätze `plant-ashwagandha-*`, `form-*`, `compound-withaferin-a` (Priorität 8). **Zwei Aufbauten:** `layout: "kraut"` (Ashwagandha) und `layout: "frucht"` (**Granatapfel**, Referenzbild 19: Nährwerte mit EU-Referenzbalken, Wachstumskreis, Reiter mit Inhaltsstoff-Bildchen, weitere Frequenzen 432–852 Hz); Typen in src/data/profileTypes.ts, Daten in profiles.ts / profileGranatapfel.ts, Prüfung (Aussagen, Atlas-Einträge, Bildplätze, Positionen) in src/data/validateProfiles.ts (läuft in `validate:data`). Ein Profil merkt sich, von welcher Landingpage es geöffnet wurde (`from`: Pflanzenatlas oder Obst & Gemüse Atlas): Brotkrumen, Tab und „Zurück“ führen dorthin. Für eine weitere Pflanze mit vollem Profil: Eintrag in `PROFILES` (profiles.ts), Claims in content/claims/, Bilder `plant-<id>-*` in registry.ts.
Obst & Gemüse Atlas (Landingpage hinter der Kachel „Gemüse & Obst“; src/ui/produce.ts, src/data/produce.ts, src/produce.css; View `produce`, Tab „Obst & Gemüse“) nach Referenzbild 20: Hero mit Suche und Kennzahlen (aus dem Atlas gezählt), 16 Kategoriekarten (Gruppen in `GROUPS`; leere Gruppen als „in Vorbereitung“), beliebte Einträge mit Stichwort (bekannter Inhaltsstoff, `TAGLINE`, keine Wirkaussage), Weltkarte mit Regionen und Saisonkalender (Mitteleuropa, aktuelle Jahreszeit markiert), Nährstoffgruppen (Lehrbuchtext), Körperbereiche (Link zum Körper-Atlas), Küchen, Rezeptkarten („folgt“) und Wissensnetz. Jeder Eintrag öffnet sein Profil (Granatapfel voll, sonst Kurzprofil). Neue Atlas-Einträge Avocado, Brokkoli, Spinat, Knoblauch, Heidelbeere, Zitrone, Süßkirsche, Linse, Kürbis (Fakten Lehrbuchwissen, Quellen „pending“, keine Wirkaussagen). Bildplätze `obst-*` (Priorität 8); bis dahin Symbole auf getönten Flächen und das Kachelbild `tile-gemuese-obst` im Hero.
Baum Atlas (Landingpage hinter der Kachel „Bäume“; src/ui/trees.ts, src/data/trees.ts, src/trees.css; View `trees`, Tab „Bäume“) nach Referenzbild 21: Hero mit Suche, Kennzahlen (58.497 bekannte Baumarten laut BGCI/Global Tree Assessment, Rest aus dem Atlas gezählt) und „Auf einen Blick“, 9 Kategorien, anklickbares Schaubild „Der Baum als lebendiges System“ (7 Teile, gezeichneter Platzhalter in src/ui/plantArt.ts), „Energiefluss & Geometrie“ (gemessene Punkte als Lehrbuchwissen, Torus/Fraktale/Goldener Schnitt als Aussagen mit Belegstufe), vier Wissensebenen mit typischer Belegstufe, Weltkarte, beliebte und älteste Bäume (Alter als Schätzspannen), Ökosystem, Leistungen für die Erde und drei Themenkarten. 9 neue Baum-Einträge (Eiche, Ahorn, Olivenbaum, Buche, Zeder, Mammutbaum, Baobab, Ginkgo, Kiefer); Profile öffnen als Kurzprofil und führen über „Zurück“ hierher (`ProfileFrom` "trees"). Gemeinsame Hilfen der drei Landingpages in src/ui/landing.ts. Bildplätze `baum-*` (Priorität 8); bis dahin das Kachelbild `tile-baeume` im Hero.
Mineral Atlas (Landingpage hinter der Kachel „Mineralien“; src/ui/minerals.ts, src/data/minerals.ts, src/data/elements.ts, src/minerals.css; View `minerals`, Tab „Mineralien“) nach Referenzbild 22: Hero mit Element-Blasen (Si, Cu, Fe, Mg, Au, O als Text über dem Bild) und Sprungleiste, Kennzahlen (6.000+ Mineralarten laut IMA-Liste, 118 Elemente und 94 natürlich vorkommende aus den Daten), Periodensystem mit 13 Elementkarten, Filter, Suche und allen 118 Elementen (Lehrbuchwerte), „Von Atom bis Kristall“ (8 gezeichnete Stationen), Spotlight auf Quarz, der über „Verwandte Mineralien“ zu Amethyst, Rosenquarz, Citrin, Rauchquarz und Achat wechselt (Eigenschaften, Entstehung, Fundorte folgen), Entstehung, Weltkarte mit Fundorten (Auswahl, ohne Wertung), Körper (gelöstes Silizium ja, Quarzkristalle werden nicht aufgenommen; Aussage `mineral-silizium` Hypothese), Frequenzen (432 Hz als Behauptung `mineral-quarz-frequenz`, Piezoeffekt `mineral-piezo`, Ton nur auf Klick), Anwendungen (Heilsteine verweisen auf `crystal-healing-general`), Geschichte. 3 neue Atlas-Einträge (Rosenquarz, Rauchquarz, Achat). Bildplätze `mineral-*`, `element-*` (Priorität 8); bis dahin `tile-mineralien` im Hero und gezeichnete Kristalle.
Elementprofil (Seite hinter jedem Element im Mineral Atlas: Karten, Tabellenfelder, Blasen und Enter in der Suche öffnen sie; src/ui/elementProfile.ts, src/data/elementProfile.ts, src/ui/elementArt.ts, src/gl/atomscene.ts, src/elementProfile.css; View `element` in src/main.ts, Tab „Mineralien“ bleibt aktiv, Brotkrumen und „Im Periodensystem anzeigen“ führen zurück und markieren das Element): **Wasserstoff ist die vollständige Vorlage** nach Referenzbild 23 (docs/MOCKUP-NOTES.md, Seite 23) mit Datenkarte, Reiterleiste, Atomaufbau mit Isotopen, **berechneter 3D-Ansicht** (Bohr-Modell, Elektronenwolke, Orbitale 1s/2s/2p, Isotope; Veranschaulichung, ohne WebGL eine Zeichnung), Elektronenkonfiguration, Eigenschaften mit Sicherheitshinweis (Knallgas), Vorkommen, Verbindungen (gezeichnete Moleküle), Körper, Spektrum (aus der Rydberg-Formel berechnet), Anwendungen, Geschichte und Forschung (3 auffindbare Quellen als „Suchauszug, Source pending verification“, die Platzhalter-Studien der Vorlage entfallen). Aussagen: `wasserstoff-h2-medizin` (Hypothese) und `wasserstoff-gruen` (Behauptung). Alle anderen 117 Elemente bekommen ein Kurzprofil aus src/data/elements.ts; für ein weiteres vollständiges Profil: Eintrag in `FULL` (elementProfile.ts), Bildplätze `element-<symbol>-*` in registry.ts, Prüfung in `validate:data` (validateElements.ts). Bildplätze `element-h-*` (Priorität 8).
Kristall-Atlas (Landingpage hinter der Kachel „Kristalle & Heilsteine“; src/ui/crystals.ts, src/data/crystals.ts, src/ui/crystalArt.ts, src/crystals.css; View `crystals`, Tab „Kristalle“) nach Referenzbild 24: Hero mit Kennzahlen (6.000+ Mineralarten laut IMA, 7 Kristallsysteme), 10 Kategorien (drei „in Vorbereitung“), beliebte Kristalle, 7 Kristallsysteme (gezeichnet, richtige Symmetrie-Achsen), Spotlight auf einen von 14 Kristallen mit Reitern Eigenschaften / Wirkung / Anwendung / Vorkommen und Details (Fakten, Aussagen, Quellen), Chakra-Zuordnung (nur aus dem Atlas, als modern gekennzeichnet), Frequenzen 528/432/963 Hz (Aussage `kristall-solfeggio`, nicht belegt, neben dem belegten Schwingquarz), 8 Anwendungsbereiche mit „Dokumentiert“/„Überlieferung“ und Giftwarnung beim Kristallwasser, Weltkarte, Entstehung, Geschichte, verwandte Themen und 3 auffindbare Quellen (die Platzhalter-Studien der Vorlage entfallen). Neuer Atlas-Eintrag Labradorit. Der 3D-Atlas bleibt über „3D-Ansicht“ erreichbar. Prüfung in `validate:data` (validateCrystals.ts). Bildplätze `kristall-*` (Priorität 8); bis dahin `tile-kristalle` im Hero.
Menschlicher Körper (Landingpage hinter der Kachel „Menschlicher Körper“; src/ui/anatomy.ts, src/data/anatomy.ts, src/ui/anatomyArt.ts, src/anatomy.css; View `anatomy`, Tab „Körper“; der Körper-Atlas mit Organ-Pins heißt jetzt Tab „Organe“) nach Referenzbild 25: Hero mit Kennzahlen und 10 Bereichen, 12 Organsysteme (Vorlage sagte „11“), **interaktiver 3D-Körper** (Standard: Anatomie-Bild mit Organ-Pins; „3D-Modell starten“ lädt echtes 3D von Knochen, Bändern und Muskeln aus **BodyParts3D 4.0, CC BY 4.0** – `public/assets/models/skeleton.glb` und `muscles.glb`, gebaut mit `scripts/build-body-models.mjs`, Quelle npm `@somakine/bodyparts3d-musculoskeletal`; Szene src/gl/bodyscene.ts mit Drehen, Zoom-Knöpfen, Transparenz und Antippen von Teilen, deutsche Namen in src/data/bodyparts.ts als ungeprüfte Lehrbuch-Nomenklatur; Namensnennung auf der Seite und in CREDITS.md; Nerven und Gefäße fehlen, weil kein freies Modell vorliegt, das Herz gibt es nur als Bild), Organ-Fenster (Herz mit 7 Themen), Kette Atom → Körper, Zellen, Lebensabschnitte, Körperfunktionen, Gesundheit (nur Orientierung), Forschung (5 Quellen) und Links in den Atlas. Aussagen `koerper-zellzahl` (belegt als Schätzung) und `koerper-detox` (nicht belegt). Prüfung in `validate:data` (validateAnatomy.ts). Bildplätze `koerper-*` (Priorität 8); bis dahin `body-front` im Hero und gezeichnete Platzhalter.
Frequenz-Hauptseite „Alles schwingt.“ (Landingpage hinter der Kachel „Frequenzen & Vibrationen“; src/ui/frequency.ts, src/data/freqpage.ts, src/ui/freqArt.ts, src/frequency.css; View `freq`, Tab „Frequenz“; die berechnete Kymatik-/Geometrie-Seite hat keinen eigenen Tab mehr: sie öffnet über das Stichwort „Kymatik“ und die Karten auf der Frequenz-Seite, in ihrer Leiste bleibt „Frequenz“ markiert) nach Referenzbild 26: Hero mit sechs Kreisen (Worte, Licht, Nahrung, Klänge, Materialien, Umgebung), **Signal Analyzer ohne erfundenen Index** (die Halbkreis-Anzeige zeigt die Belegstufe der Aussagen aus Atlas und Claims, Balken sind Belegstufen, keine Wirkstärken), „Die Kraft der Frequenz“ mit vier kleinen echten Rechnungen (Schwingkreis, Resonanzkurve, Ultraschall-Wellenlänge, Schallbereiche), Frequenz Explorer (Ton nur auf Klick, nächster Ton in Cent, Chladni-Muster aus src/data/cymatics.ts, überlieferte Wirkung mit Aussage `freq-solfeggio` = nicht belegt), „Frequenz in der realen Welt“ (6 Karten mit Links in andere Seiten) und Schlussband. Neue Aussagen: `freq-solfeggio`, `freq-432-440-pilot`, `freq-hifu`, `freq-pflanze-vibration`, `freq-schumann`, `rosmarin-duft-kognition`; `acoustic-levitation-small` ist jetzt veröffentlicht. Prüfung in `validate:data` (validateFreq.ts). Bildplätze `freq-*` (Priorität 8); bis dahin gezeichnete Nachtlandschaft mit `body-front`.
Atem-Landingpage „Dein Atem verbindet alles.“ (hinter der Kachel „Atem & Meditation“; src/ui/atem.ts, src/data/atempage.ts, src/ui/atemArt.ts, src/atem.css; View `atem`, Tab „Atem“; die Übungsseite src/ui/breath.ts heißt jetzt Tab „Atemübung“) nach Referenzbild 27: Hero mit fünf Bereichen, vier Einstiegskarten, **Technik-Finder** mit 8 Zielen (Takt-Ring „Jetzt mitatmen“, Schritte, Reiter Wirkung/Details/Studien/Varianten), „Was beim Atmen im Körper passiert“ (Lungenbild, sechs Beschriftungen), weitere Bereiche und Schlussband. **Wirkungen von Atemübungen stehen nur als Aussagen mit Belegstufe** (`atem-*`, Quellen als Suchauszug ohne DOI, Source pending verification), nie im eigenen Ton. **Gefährliche Techniken** (Wim Hof, Tummo, „Immunsystem stärken“ durch Atmung) haben keine Anleitung und keinen Takt, nur eine Warnung (`validateAtem.ts` erzwingt das). Prüfung in `validate:data`. Bildplätze `atem-*` (Priorität 8); bis dahin gezeichnete Landschaft mit meditierender Figur und `organ-lungs`.
Krankheiten & Beschwerden (Landingpage hinter der Kachel „Krankheiten & Beschwerden“; src/ui/beschwerden.ts, src/data/beschwerden.ts, src/beschwerden.css; View `beschwerden`, Tab „Beschwerden“) nach Referenzbild 28: Hero mit acht Kreisen und Suche (drei Reiter), 8 häufige Beschwerden (+ Blasenentzündung über Suche/A–Z), Angaben-Formulare, Beispiel ohne Rangfolge, Chakren ohne Prozentwerte, Selbsteinschätzung, 8 „Mögliche Ansätze“, Merkzettel, Hinweise. **Die Seite diagnostiziert nicht:** keine „wahrscheinlichen Ursachen“ mit Einfluss-Stufen, keine erfundenen Messwerte, keine Dosierungen, kein „Wechselwirkungs-Prüfer“ (nur Beispielliste). **Jede Beschwerdegruppe hat Warnzeichen**, die Suche zeigt bei Notfall- oder Krisen-Wörtern zuerst Notruf 112, Bereitschaftsdienst 116 117 und Telefonseelsorge 0800 111 0 111 / 0800 111 0 222. Eingaben bleiben im Browser und werden nicht gespeichert. Aussagen `beschwerde-*` (Quellen als Suchauszug ohne DOI, Source pending verification). Prüfung in `validate:data` (validateBeschwerden.ts erzwingt Warnzeichen, verbietet Dosierungen). Bildplätze `beschwerden-*` (Priorität 8).
Chakren-Landingpage (hinter der Kachel „Chakren“; src/ui/chakren.ts, src/data/chakrapage.ts, src/ui/chakrenArt.ts, src/chakren.css; View `chakren`, Tab „Chakren“; die berechnete 3D-Seite hat keinen eigenen Tab mehr, Link „In 3D ansehen“, in ihrer Leiste bleibt „Chakren“ markiert) nach Referenzbild 29: Hero „Kronenchakra“ mit Figur und sieben Punkten, Steckbrief-Karte, Auswahlzeile für alle **sieben Chakren**, neun Reiter und die Übersichtskarten (Heilsteine, Farben & Licht, Ernährung, Düfte, Frequenzen & Klang mit Ton-Player, Meditation, Yoga, Natur, Affirmationen). **Alles ist Überlieferung oder Lehrbuchwissen, nichts im eigenen Ton als Wirkung:** Aussagen `chakra-modell`, `chakra-zuordnungen-modern`, `chakra-arbeit-heilung` (alle nicht belegt), `freq-solfeggio`, `crystal-healing-general`; „Symptome & Balance“ zeigt nur überlieferte Themen, keine Krankheiten; Yoga-Umkehrhaltungen und Öle haben Sicherheitshinweise; Meditationen sind Lesetexte mit Zeitgeber; die Frequenz heißt „modern zugeschrieben“. Prüfung in `validate:data` (validateChakren.ts: Katalog-/Atlas-/Bildplatz-Verweise, keine Dosierungen oder Heilversprechen). Bildplätze `chakren-*` (Priorität 8); bis dahin getönte Karten und gezeichnete Figur/Lotus.
Nährstoffe-Landingpage „Bausteine deines Lebens.“ (hinter der Kachel „Nährstoffe“; src/ui/nutrients.ts, src/data/nutrients.ts, src/data/naehrpage.ts, src/naehrstoffe.css; View `nutrients`, Tab „Nährstoffe“, ersetzt die alte Kartenliste) nach Referenzbild 30: Hero mit Suche, beliebten Themen und sechs Gruppen-Kreisen, sieben Gruppenkarten, **interaktiver Körper** (zehn Systeme mit je fünf Nährstoffen, Reiter Funktion/Quellen/Wirkung/Mangel/Einnahme), Kartenleiste „Nährstoffe entdecken“ mit Filter und Detailfenster, vier Infokarten. 27 Nährstoffe auf Lehrbuchniveau, **keine Mengen oder Dosierungen**, Zuordnungen als „beteiligt an“, offene Fragen als solche benannt; „Wirkung“ zeigt nur Aussagen mit Belegstufe. Prüfung in `validate:data` (validateNaehrstoffe.ts). Bildplätze `naehrstoffe-*`, `naehrstoff-<id>` (Priorität 8); bis dahin `body-front` und die `nutrient-*`-Motive.
Hero-Hintergrund wechselt (Versuch, die Entscheidung für das endgültige Hero-Bild steht aus; src/ui/heroBackground.ts, Einstellungen in src/data/hero.ts, Prüfung in `validate:data` über validateHero.ts): 12 Bilder (`hero-bg-1` … `hero-bg-12`, vom Nutzer mit ChatGPT erzeugt, in public/assets) überblenden sich alle 9 Sekunden (1,8 s Überblendung) als oberste Schicht im Hero-Container `.hero-layers`; die alten Schichten (Welt, Figuren, DNA) bleiben darunter unsichtbar erhalten, damit Pins, Parallax und der Einflug-Zoom unberührt weiterlaufen. Das nächste Bild wird immer schon hinter dem sichtbaren geladen; bei reduzierter Bewegung steht nur das erste Bild; der Wechsel pausiert, wenn der Hero nicht im Bild ist oder der Tab im Hintergrund liegt. `HERO_BACKGROUND.enabled = false` bringt den alten Hero zurück. Pins: Mit dem wechselnden Hintergrund bekommt der Hero keine Pins (sie saßen auf den alten Figuren) und der Hinweis „die goldenen Punkte öffnen die Belege“ ist ausgeblendet; mit `enabled: false` kommen beide mit dem alten Hero zurück. Die Originale liegen in `public-hero-tests/` (30 MB, in .gitignore) und in design/assets-raw/; die Adresse `http://localhost:5173/?herotest` (nur `npm run dev`, src/dev/heroTest.ts) blättert sie mit den Pfeiltasten durch.
Das eine Menü (src/data/menu.ts, src/ui/siteMenu.ts, src/menu.css; Prüfung in `validate:data` über src/data/validateMenu.ts): sieben Hauptpunkte nach dem Lernweg (Der Körper, Gaben der Erde, Schwingung, Das Unsichtbare, Verlorenes Wissen, Rezepte & Rituale, Warum wir hier sind – der letzte ist ausgegraut „in Vorbereitung“), auf der Startseite und in der Kopfzeile jeder Seite gleich. Hover oder Klick klappt die Liste der Seiten des Punktes auf, ein Klick auf eine Seite öffnet sie (die Startseiten-Leiste scrollt nicht mehr); Pfeiltasten und Escape gehen. Auf Seiten steht rechts der Knopf „Universum“. Unter 1360 px (Startseite) bzw. 1180 px (Seiten) ersetzt der Knopf „Menü“ die Leiste und öffnet die volle Liste als Panel; erst ab 1700 px stehen auf der Startseite Logo-Text und „Methode“ in der Leiste. Welche Seite unter welchem Punkt steht, entscheidet allein menu.ts; Unterseiten (Kymatik, Chakren 3D, Elementprofile, Pflanzenprofile, Galaxien) stehen nicht im Menü, sondern markieren über `also` ihren Hauptpunkt. Wo diese Datei noch von „Tab“ spricht, ist der Eintrag im Menü gemeint.
Universum = Wissensmatrix (hinter dem Tab „Universum“ und „Bibliothek betreten“; src/ui/wissen.ts, src/ui/codeRain.ts, src/data/wissen.ts, src/wissen.css; View `universe`) nach Referenzbild 31 (docs/MOCKUP-NOTES.md, Seite 31): senkrecht fallender Code (2D-Canvas in zwei Tiefenebenen, steht bei reduzierter Bewegung still), links Titel „Hinter jedem Code liegt Wissen.“ mit Suche, rechts fünf schwebende Glas-Ebenen (Körper, Pflanzen, Mineralien, Frequenzen, Kulturen). Hover oder Fokus öffnet eine Ebene (Bild, zwei Einträge aus den echten Daten, Knopf), Klick öffnet die Seite dahinter; auf dem Handy erst Antippen, dann Öffnen; Pfeiltasten wechseln die Ebene. **Die alten Galaxien** (src/gl/universe.ts, View `galaxy`, in der Leiste bleibt „Universum“ markiert) sind über den Link „Alle Aussagen als Galaxien ansehen →“ erreichbar: dort hängen die Aussagen-Sterne und die Themenbühnen. Prüfung in `validate:data` (validateWissen.ts). Keine neuen Bildplätze (Kachelbilder `tile-*`, Atlas-, Organ- und Kulturbilder).
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
  Desktop UND Handy ansehen, kurz dokumentieren. Der Build (`npm run build`) muss immer durchlaufen.
- Neue Pakete nur mit Begründung und nur kostenlose, freie (Open Source).
- Bilder: nur Material, das dem Nutzer gehört, selbst erzeugt oder frei lizenziert ist. Herkunft/Generator bei Bedarf erfragen.
- Offene Inhaltsaufgaben stehen in `content/research/` und `CONTENT.md`.
