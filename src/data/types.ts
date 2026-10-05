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
  | "interview";

export type Area =
  | "biophysik"
  | "medizingeschichte"
  | "pflanzenheilkunde"
  | "ernaehrung-umwelt"
  | "akustik-architektur";

export const AREA_LABEL: Record<Area, string> = {
  biophysik: "Biophysik",
  medizingeschichte: "Medizingeschichte",
  pflanzenheilkunde: "Pflanzenheilkunde",
  "ernaehrung-umwelt": "Ernährung & Umwelt",
  "akustik-architektur": "Akustik & Architektur",
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
  /** Free-text note, e.g. interview date/place or methodological caveats */
  note?: string;
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
  "lab-record": "Laborprotokoll",
  interview: "Interview",
};
