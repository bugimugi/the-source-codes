/**
 * Evidence model: every claim shown on the site carries an evidence level
 * and a list of sources. The level is NOT the same as the source kind –
 * an interview is a source, not proof.
 */

export type EvidenceLevel =
  | "established" // robust, replicated, scientific consensus
  | "supported" // observed in peer-reviewed work; causal role / scope debated
  | "hypothesis" // plausible, preliminary, not yet replicated
  | "historical" // documented historical fact (events, texts, patents)
  | "unsupported" // no reliable evidence found
  | "refuted"; // contradicted by evidence

export type SourceKind =
  | "peer-reviewed"
  | "systematic-review"
  | "patent"
  | "historical-document"
  | "primary-text"
  | "lab-record"
  | "preprint"
  | "conference-abstract"
  | "interview";

export type Area =
  | "biophysik"
  | "medizingeschichte"
  | "pflanzenheilkunde"
  | "ernaehrung-umwelt"
  | "akustik-architektur"
  | "texte-tradition";

export const AREA_LABEL: Record<Area, string> = {
  biophysik: "Biophysik",
  medizingeschichte: "Medizingeschichte",
  pflanzenheilkunde: "Pflanzenheilkunde",
  "ernaehrung-umwelt": "Ernährung & Umwelt",
  "akustik-architektur": "Akustik & Architektur",
  "texte-tradition": "Texte & Tradition",
};

export interface Source {
  id: string;
  kind: SourceKind;
  title: string;
  /** Authors / interviewee with role, institution */
  author: string;
  year?: number;
  /** Full citation, DOI or archive reference */
  citation: string;
  url?: string;
  /** Has the citation been checked against the original document? */
  verified: boolean;
  /** Free-text note, e.g. methodological caveats */
  note?: string;
  /** Interviews / lab records: ISO date (YYYY-MM-DD) and place of the conversation or measurement */
  date?: string;
  place?: string;
  /** Interviews: written consent of the interviewee to publish name and statements */
  consent?: boolean;
}

export interface Claim {
  id: string;
  area: Area;
  /** The statement exactly as it is shown to the reader */
  statement: string;
  level: EvidenceLevel;
  /** Why this level was assigned – required, shown in the overlay */
  rationale: string;
  sources: Source[];
  /** Optional longer text shown below the rationale (Markdown-free plain text, paragraphs split by blank line) */
  body?: string;
  /** Drafts are validated but never shown on the site */
  status: "draft" | "published";
  /** Related claim ids – edges of the knowledge network */
  related?: string[];
}

export const LEVEL_LABEL: Record<EvidenceLevel, string> = {
  established: "Gesichert",
  supported: "Belegt, Deutung offen",
  hypothesis: "Hypothese",
  historical: "Historisch dokumentiert",
  unsupported: "Nicht belegt",
  refuted: "Widerlegt",
};

export const KIND_LABEL: Record<SourceKind, string> = {
  "peer-reviewed": "Peer-Review-Studie",
  "systematic-review": "Systematische Übersichtsarbeit",
  patent: "Patentschrift",
  "historical-document": "Historisches Dokument",
  "primary-text": "Primärtext",
  "lab-record": "Laborprotokoll / Messung",
  preprint: "Preprint (nicht begutachtet)",
  "conference-abstract": "Konferenzposter / Abstract",
  interview: "Interview",
};
