# THE SOURCE CODES

Investigative Felddokumentation: Jede Aussage trägt ihre Quellen und eine Belegstufe.

## Entwicklung

- `npm run dev` – Dev-Server (Vite)
- `npm run build` – Typecheck + Produktions-Build
- `npm run validate:data` – prüft die Wissensbasis auf Integritätsregeln

## Struktur

- `src/data/types.ts` – Datenmodell: `Claim`, `Source`, `EvidenceLevel`, `SourceKind`
- `src/data/claims.ts` – die Aussagen (hier werden Recherche- und Interviewergebnisse eingetragen)
- `src/data/validate.ts` – Regeln, z. B. „Gesichert“ / „Belegt“ brauchen eine verifizierte Peer-Review-Quelle; Interviews, Patente und Laborprotokolle allein tragen diese Stufen nicht
- `src/gl/particles.ts` – Three.js-Partikelfeld (Chaos → Ordnung, Cursor-Interaktion)
- `src/ui/proofOverlay.ts` – Proof-Overlay (Glas-Datenblatt, Tastatur- und Fokus-Unterstützung)

## Interviews und Primärdaten eintragen

Eine neue Quelle mit `kind: "interview"` oder `"lab-record"` zu einer `Claim` hinzufügen
(Name/Rolle/Institution in `author`, Datum und Ort in `note`). Die Belegstufe richtet sich
nach Replizierbarkeit und Veröffentlichung der Daten, nicht nach der Quelle: ein Interview
allein ergibt höchstens „Hypothese“. Zitate erst auf `verified: true` setzen, wenn sie
gegen das Original geprüft sind.
