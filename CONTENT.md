# Inhalte einpflegen

Jede Aussage ist eine Datei in `content/claims/<id>.json` (Vorlage: `_template.json`, Dateien mit `_` werden ignoriert).

## Ablauf

1. Neue Datei aus der Vorlage anlegen, `status: "draft"` lassen.
2. `npm run validate:data` – prüft Regeln; `npm run report` zeigt zusätzlich unverifizierte Zitate.
3. Zitate gegen das Original prüfen, dann `verified: true`.
4. Wenn alles stimmt: `status: "published"`. Entwürfe erscheinen nie auf der Seite.
5. `npm run build` bricht bei Regelverstößen ab.

## Belegstufen (`level`)

| Stufe | Bedeutung | Voraussetzung |
|---|---|---|
| `established` | Gesichert, repliziert, Konsens | verifizierte Peer-Review-Quelle |
| `supported` | Beobachtet, Deutung offen | verifizierte Peer-Review-Quelle |
| `hypothesis` | Plausibel, vorläufig | – |
| `historical` | Historisch dokumentiert | – |
| `unsupported` | Kein verlässlicher Beleg | – |
| `refuted` | Durch Evidenz widerlegt | – |

Die Stufe richtet sich nach der Beweislage, nicht nach der Quellenart. Ein Interview oder Laborprotokoll allein trägt „gesichert“/„belegt“ nicht.

## Textbefunde (Zählungen in Texten)

Aussagen darüber, was ein Text enthält (z. B. Wortzählungen in Koran, Bibel, historischen Schriften), bekommen `"type": "text-finding"`.
- Quelle vom Typ `text-count` mit **`method`** (genaue Zählregel: welche Wortformen, Präfixe, Dual/Plural, Bedeutung ja/nein) und **`editions`** (mindestens zwei unabhängige Textausgaben, mit derselben Regel gezählt).
- Erreichbar ist höchstens „Belegt, Deutung offen“ (`supported`), nie „Gesichert“. Die Aussage nennt nur die Zahl; was sie *bedeutet*, ist ein eigener Eintrag (`type: "empirical"`) und braucht echte Belege.
- Alternative Regeln, die andere Zahlen ergeben, gehören in `method` oder `body`.
- Zählskripte unter `scripts/verify/`, damit jede Zahl nachprüfbar ist.

## Interviews

- `consent: true` erst setzen, wenn die Einwilligung zur Veröffentlichung von Name und Aussagen **schriftlich** vorliegt.
- `date` (YYYY-MM-DD) ist Pflicht; `place` und eine Aufnahme-/Protokollreferenz in `citation` sind empfohlen.
- In `note` festhalten, was konkret gesagt oder gezeigt wurde – nicht, was daraus gefolgert wird.
- Persönliche Aussagen zu Heilerfolgen einzelner Patientinnen und Patienten nicht ohne deren Einwilligung und nicht als Wirksamkeitsbeleg verwenden.

## Bereiche (`area`)

`biophysik`, `medizingeschichte`, `pflanzenheilkunde`, `ernaehrung-umwelt`, `akustik-architektur`.
Neue Bereiche: `Area` und `AREA_LABEL` in `src/data/types.ts` erweitern.

## Was ich (Claude) von dir brauche, wenn du Zusammenfassungen schickst

Pro Thema möglichst:
- die Behauptung in einem Satz,
- wer sie aufstellt (Interview: Name, Rolle, Institution, Datum),
- welche Daten/Studien/Patente genannt wurden (mit Titel, Jahr, Journal oder DOI),
- ob Original-Dokumente vorliegen (PDF, Messprotokoll).

Daraus erstelle ich Entwürfe mit vorgeschlagener Belegstufe und markiere, was noch zu prüfen ist.

## Atlas-Einträge (`content/atlas/*.json`)

Ein Eintrag beschreibt eine Pflanze, ein Kraut, Obst/Gemüse oder einen Stein.
- `facts`: überprüfbare Beschreibung (Formel, Härte, botanische Familie ...), mit `sources`.
- `tradition`: kurzer kultureller/historischer Text.
- `associations`: Zuordnungen zu Organ, Chakra, Signaturenlehre usw. **Immer mit `origin`** (`traditional`, `modern`, `unknown`) – die Seite zeigt sie als „Zuordnung nach dem jeweiligen System, kein Wirkbeleg“.
- `combinations`: überlieferte Kombinationen (werden auf beiden Seiten angezeigt).
- `claims`: Ids der bewerteten Aussagen zu Wirkung oder Anwendung. **Jede Wirkungsaussage ist ein Claim** mit Belegstufe und gehört nicht in `facts`.
- `model`: Typ und Farbe für das prozedurale 3D-Modell (`quartz`, `fluorite`, `pyrite`, `garnet`, `tourmaline`, `malachite`, `lapis`, `obsidian`, `flower`, `herb`, `lavender`, `rhizome`, `willow`, `nut`, `carrot`, `fruit`).
- Neue Modellformen: `src/gl/models.ts` erweitern. Echte Fotos oder gescannte 3D-Modelle (glTF) lassen sich später ergänzen, brauchen aber freie Lizenzen.

## Pilot-Workflow (Inhalte zuerst, Fachprüfung danach)

1. Neue Inhalte vom Betreiber als Claim anlegen: `level: "claimed"`, Quelle `kind: "editorial-input"`, `review: {"state": "pending"}`.
2. `npm run review:export` erzeugt `exports/expert-review.md`: alle Aussagen mit Quellen und Platz für das Urteil der Fachleute.
3. Nach der Prüfung pro Aussage eintragen: `review: {"state": "confirmed" | "corrected" | "rejected", "reviewer": "Name", "role": "Fachgebiet", "date": "YYYY-MM-DD", "note": "…"}`
   und eine **echte Belegstufe** statt `claimed` vergeben (bei `corrected` auch den Text anpassen).
4. `npm run release:check` zeigt, was noch offen ist. `npm run build:release` bricht ab, solange etwas ungeprüft ist.
5. Der Pilot-Hinweis auf der Seite verschwindet von selbst, wenn alle veröffentlichten Aussagen geprüft sind.
