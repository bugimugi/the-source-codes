/**
 * Evidence model: every claim shown on the site carries an evidence level
 * and a list of sources. The level is NOT the same as the source kind –
 * an interview is a source, not proof.
 */

export type EvidenceLevel =
  | "claimed" // stated by the editor, not yet assessed or reviewed by experts (pilot content)
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
  | "text-count"
  | "preprint"
  | "conference-abstract"
  | "editorial-input"
  | "interview";

export type Area =
  | "biophysik"
  | "medizingeschichte"
  | "pflanzenheilkunde"
  | "ernaehrung-umwelt"
  | "akustik-architektur"
  | "texte-tradition"
  | "kristalle-mineralien";

export const AREA_LABEL: Record<Area, string> = {
  biophysik: "Biophysik",
  medizingeschichte: "Medizingeschichte",
  pflanzenheilkunde: "Pflanzenheilkunde",
  "ernaehrung-umwelt": "Ernährung & Umwelt",
  "akustik-architektur": "Akustik & Architektur",
  "texte-tradition": "Texte & Tradition",
  "kristalle-mineralien": "Kristalle & Mineralien",
};

export type SourceTab = "study" | "patent" | "historical" | "clinical" | "traditional" | "interview" | "editorial";

export interface Source {
  /** Overrides the proof-overlay tab derived from the source kind */
  tab?: SourceTab;
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
  /** text-count: the exact counting rule, so that anyone can reproduce or dispute the number */
  method?: string;
  /** text-count: independent editions/texts that were counted with the same rule (at least two) */
  editions?: string[];
  /** Interviews / lab records: ISO date (YYYY-MM-DD) and place of the conversation or measurement */
  date?: string;
  place?: string;
  /** Interviews: written consent of the interviewee to publish name and statements */
  consent?: boolean;
}

/**
 * "empirical" (default): needs studies/measurements.
 * "text-finding": a statement about what a text contains (e.g. word counts). It may reach
 * "supported" through a reproducible text-count source, never "established", and it says
 * nothing about what the finding means – interpretations are separate claims.
 */
export type ClaimType = "empirical" | "text-finding";

/** Expert review of a claim. A missing review means "pending". */
export type ReviewState = "pending" | "in-review" | "confirmed" | "corrected" | "rejected";

export interface Review {
  state: ReviewState;
  /** Required once confirmed/corrected */
  reviewer?: string;
  role?: string;
  /** ISO date YYYY-MM-DD */
  date?: string;
  note?: string;
}

export const isSettled = (c: { review?: Review }) => c.review?.state === "confirmed" || c.review?.state === "corrected";

export interface Claim {
  id: string;
  type?: ClaimType;
  area: Area;
  /** Short title for graph labels (falls back to the statement) */
  short?: string;
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
  /** Expert review status; missing = pending (pilot content) */
  review?: Review;
  /** Related claim ids – edges of the knowledge network */
  related?: string[];
}

export const LEVEL_LABEL: Record<EvidenceLevel, string> = {
  claimed: "Behauptung – ungeprüft",
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
  "text-count": "Textzählung (Primärtext-Befund)",
  preprint: "Preprint (nicht begutachtet)",
  "conference-abstract": "Konferenzposter / Abstract",
  interview: "Interview",
  "editorial-input": "Redaktionelle Angabe (ungeprüft)",
};

// ---------------------------------------------------------------- Atlas (Guidebook)

export type AtlasCategory = "kraut" | "blume" | "baum" | "obst" | "gemuese" | "kristall";

export const CATEGORY_LABEL: Record<AtlasCategory, string> = {
  kraut: "Kräuter",
  blume: "Blumen",
  baum: "Bäume",
  obst: "Obst & Nüsse",
  gemuese: "Gemüse",
  kristall: "Kristalle & Heilsteine",
};

export type ModelKind =
  | "quartz" | "fluorite" | "pyrite" | "garnet" | "tourmaline" | "malachite" | "lapis" | "obsidian"
  | "flower" | "herb" | "lavender" | "rhizome" | "willow" | "nut" | "carrot" | "fruit";

export interface ModelSpec {
  kind: ModelKind;
  color: string;
  color2?: string;
  /** flower: number of petals; fruit: "apple" | "tomato" */
  petals?: number;
  shape?: "apple" | "tomato";
}

/** A cultural/traditional mapping (organ, chakra, signature ...). Never an efficacy statement. */
export interface Association {
  system: string;
  target: string;
  origin: "traditional" | "modern" | "unknown";
  note?: string;
}

export interface AtlasEntry {
  id: string;
  status: "draft" | "published";
  category: AtlasCategory;
  name: string;
  /** Botanical or mineralogical name */
  latin: string;
  model: ModelSpec;
  /** Verifiable descriptive facts (formula, hardness, botanical family ...) */
  facts: { label: string; value: string }[];
  /** Sources for the facts above */
  sources: Source[];
  /** Short cultural/historical text */
  tradition: string;
  associations: Association[];
  /** Traditional pairings; shown on both sides */
  combinations: { with: string; note: string; origin: "traditional" | "modern" | "unknown" }[];
  /** Graded statements about this entry (effects, traditional use). Ids of claims. */
  claims: string[];
}

export const ORIGIN_LABEL = {
  traditional: "Überlieferung",
  modern: "Moderne Lehre (20./21. Jh.)",
  unknown: "Herkunft unklar",
} as const;
