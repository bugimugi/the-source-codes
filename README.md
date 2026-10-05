# THE SOURCE CODES

Investigative Felddokumentation: Jede Aussage trägt ihre Quellen und eine Belegstufe.

## Entwicklung

- `npm run dev` – Dev-Server (Vite)
- `npm run build` – Typecheck + Produktions-Build
- `npm run validate:data` – prüft die Wissensbasis auf Integritätsregeln (läuft auch vor jedem Build)
- `npm run report` – zusätzlich Hinweise zu unverifizierten Zitaten

## Struktur

- `src/data/types.ts` – Datenmodell: `Claim`, `Source`, `EvidenceLevel`, `SourceKind`
- `content/claims/*.json` – die Aussagen, eine Datei pro Aussage (Anleitung: `CONTENT.md`, Vorlage: `_template.json`)
- `src/data/claims.ts` – lädt die JSON-Dateien; Entwürfe (`status: "draft"`) erscheinen nicht auf der Seite
- `src/data/validate.ts` – Regeln, z. B. „Gesichert“ / „Belegt“ brauchen eine verifizierte Peer-Review-Quelle; Interviews, Patente und Laborprotokolle allein tragen diese Stufen nicht
- `src/gl/particles.ts` – Three.js-Partikelfeld (Chaos → Ordnung, Cursor-Interaktion)
- `src/ui/proofOverlay.ts` – Proof-Overlay (Glas-Datenblatt, Tastatur- und Fokus-Unterstützung)

## Interviews und Primärdaten eintragen

Siehe `CONTENT.md`.
