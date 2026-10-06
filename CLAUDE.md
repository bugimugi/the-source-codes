# THE SOURCE CODES – Projektanleitung für Claude Code

Sprache mit dem Nutzer: **Deutsch**, kurz und klar, keine Fachbegriffe ohne Erklärung. Der Nutzer ist kein Entwickler
(Windows, nutzt cmd/PowerShell nur nach Anleitung). Schritte immer einzeln und mit Klickwegen erklären.

## Worum es geht
Eine interaktive Wissens-Webseite („digitale Bibliothek“) über Körper, Natur, Geschichte, Frequenzen, Pflanzen und Kristalle.
Kernprinzip: **Jede Aussage hat Quellen und eine Belegstufe.** Das System dafür (content/, src/data/) ist der wertvollste Teil.
Domain `thesourcecodes.io` ist noch NICHT gekauft – nicht als existierend darstellen.

## Redaktionelle Regeln (nicht verhandelbar)
- Keine erfundenen Quellen, Studien, DOIs, Zahlen, Statistiken. Fehlendes als „Source pending verification“ kennzeichnen.
- Keine Heilversprechen, keine medizinischen Ratschläge. Tradition (Chakren, Signaturenlehre, Kristallwirkung) wird als
  Überlieferung mit Herkunft gezeigt, nie als Wirkbeleg. Wirkungsaussagen sind bewertete Claims (content/claims/).
- Belegstufen: established, supported, hypothesis, historical, unsupported, refuted. „established/supported“ braucht für
  veröffentlichte Claims eine verifizierte Peer-Review-Quelle (Ausnahme: `type: "text-finding"` mit offengelegter Zählregel).
- Koran-/Textzahlen: nur als Textbefund mit Zählregel und zwei Textausgaben (`scripts/verify/quran-counts.py`). Deutungen
  („Wunder“) sind ein eigener Claim, aktuell „unsupported“. Koran-Einträge bleiben `status: "draft"`, bis eine Arabistin/ein
  Hodja sie geprüft hat (Prüfbogen: content/research/pruefbogen-arabistik.md).
- Mockups enthalten Platzhalter wie „10,000+ Verified References“ oder „VERIFIED“-Stempel: NICHT übernehmen. Zahlen kommen
  aus den echten Daten (siehe src/main.ts, Stats).
- Erst bei Gesundheitsthemen: Hinweis „Informationsangebot – keine medizinische Beratung“ bleibt sichtbar.
- Impressum/Datenschutz fehlen noch (Nutzer liefert Name/Anschrift später). Nicht erfinden.

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
Der Nutzer hat die komplette Webseite als **fertige Entwurfsbilder** (Vorschauen). Sie liegen in `design/mockups/` und sind
**nur Referenz** (werden nie ausgeliefert und NICHT committet – `.gitignore` schließt sie aus, weil das Repository öffentlich ist; niemals mit `git add -f` erzwingen). Aufgabe: Seiten in echtem Code nachbauen (Text, Buttons, Navigation, Overlays als
HTML/CSS), die Bildwelten aus den Entwürfen ausschneiden, nach WebP/AVIF optimieren und als Ebenen in `public/assets/` legen.
Ebenen mit leichter Parallax zur Maus; WebGL-Partikel, Pins und Kamerafahrten bleiben darüber. Details: `docs/V2-PLAN.md`.
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
