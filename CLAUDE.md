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
Der Nutzer hat **Landingpage-Vorschaubilder** als Layout-Vorlage (`design/mockups/`, nur lokal, NICHT committet – `.gitignore`
schließt sie aus, weil das Repository öffentlich ist; niemals mit `git add -f` erzwingen). Die Vorschauen sind **keine
Bildquellen**: Text und Oberfläche sind eingebacken, die Auflösung ist zu klein. Die einzelnen Bildwelten (Hero-Figur, Welt,
Planeten, Kartenbilder, Organe …) werden vom Nutzer **separat erzeugt**; die Liste mit Prompts steht in `docs/ASSET-LIST.md`.
Aufgabe: Seiten in echtem Code nachbauen (Text, Buttons, Navigation, Overlays als HTML/CSS) und die Bilder, sobald sie vorliegen,
als Ebenen einbauen. Originale lokal in `design/assets-raw/` (ignoriert); optimierte Fassungen (WebP/AVIF, mehrere Größen)
nach `public/assets/` mit Eintrag in `public/assets/CREDITS.md`. Leuchtende Motive liegen auf reinem Schwarz und werden mit
`mix-blend-mode: screen` bzw. additiver Überblendung eingesetzt. Bis ein Bild existiert, bleibt der prozedurale Platzhalter
(Slot mit Fallback) – nichts blockieren. Ebenen mit leichter Parallax zur Maus; WebGL-Partikel, Pins und Kamerafahrten darüber.
Details: `docs/V2-PLAN.md`. Bildgenerierung (Higgsfield, Adobe u. a.) kostet Guthaben: nie ohne ausdrückliche Rückfrage.
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

## Arbeitsweise
- Vor jeder größeren Änderung kurz den Plan nennen; nach jeder Phase: Build, im Browser prüfen (Konsole ohne Fehler),
  Desktop UND Handy ansehen, kurz dokumentieren.
- Neue Pakete nur mit Begründung. Keine kostenpflichtigen Dienste/APIs (z. B. Bildgenerierung) ohne Rückfrage.
- Bilder: nur Material, das dem Nutzer gehört, selbst erzeugt oder frei lizenziert ist. Herkunft/Generator bei Bedarf erfragen.
- Offene Inhaltsaufgaben stehen in `content/research/` und `CONTENT.md`.
