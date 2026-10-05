import gsap from "gsap";
import { claims } from "../data/claims";
import { KIND_LABEL, type Claim, type Source, type SourceTab } from "../data/types";

/** Evidence status shown in the proof overlay (derived from level and kind of claim). */
export type Status = "VERIFIED" | "SUPPORTED" | "PRELIMINARY" | "HISTORICAL" | "TRADITIONAL" | "DISPUTED" | "UNVERIFIED";

const isTraditional = (c: Claim) => c.id.endsWith("traditional-use") || c.id === "signature-doctrine";

export function statusOf(c: Claim): Status {
  switch (c.level) {
    case "established": return "VERIFIED";
    case "supported": return "SUPPORTED";
    case "hypothesis": return "PRELIMINARY";
    case "historical": return isTraditional(c) ? "TRADITIONAL" : "HISTORICAL";
    case "unsupported": return "UNVERIFIED";
    case "refuted": return "DISPUTED";
  }
}

const STATUS_COLOR: Record<Status, string> = {
  VERIFIED: "#5fe3a8", SUPPORTED: "#9bd16b", PRELIMINARY: "#f2c76b", HISTORICAL: "#8fb7ff",
  TRADITIONAL: "#cbaa67", DISPUTED: "#ff6b7d", UNVERIFIED: "#ff9f6b",
};

const TABS: { id: SourceTab; label: string }[] = [
  { id: "study", label: "Study" },
  { id: "patent", label: "Patent" },
  { id: "historical", label: "Historical" },
  { id: "clinical", label: "Clinical" },
  { id: "traditional", label: "Traditional" },
  { id: "interview", label: "Interview" },
];

function tabOf(s: Source, c: Claim): SourceTab {
  if (s.tab) return s.tab;
  switch (s.kind) {
    case "patent": return "patent";
    case "interview": return "interview";
    case "historical-document":
    case "primary-text": return isTraditional(c) ? "traditional" : "historical";
    default: return "study";
  }
}

// small hand-drawn style glyphs (gold line art) instead of stock icons
const GLYPH: Record<SourceTab, string> = {
  study: '<path d="M10 6h20v28H10z"/><path d="M15 14h10M15 19h10M15 24h6"/><path d="M26 30l4-5 3 3 5-8"/>',
  patent: '<path d="M8 8h24v24H8z"/><circle cx="20" cy="20" r="7"/><path d="M20 13v14M13 20h14M8 8l24 24"/>',
  historical: '<path d="M10 10c0-3 20-3 20 0v20c0 3-20 3-20 0z"/><path d="M14 16h12M14 21h12M14 26h8"/>',
  clinical: '<path d="M6 21h8l3-9 5 18 4-12 2 3h6"/><circle cx="20" cy="20" r="14"/>',
  traditional: '<path d="M20 34V16"/><path d="M20 22c-8 0-11-6-11-12 8 0 11 5 11 12zM20 26c7 0 10-5 10-11-7 0-10 5-10 11z"/>',
  interview: '<path d="M8 10h24v16H20l-7 6v-6H8z"/><path d="M14 16h12M14 21h8"/>',
};

function icon(tab: SourceTab) {
  const d = document.createElement("span");
  d.className = "proof-thumb";
  d.innerHTML = `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${GLYPH[tab]}</svg>`;
  return d;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className = "", text = "") {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text) n.textContent = text;
  return n;
}

export interface ProofGroup {
  title: string;
  subtitle?: string;
  claimIds: string[];
}

export function initProofOverlay() {
  const root = document.getElementById("overlay") as HTMLElement;
  const titleEl = root.querySelector<HTMLElement>("#proof-title")!;
  const subEl = root.querySelector<HTMLElement>("#proof-sub")!;
  const claimsEl = root.querySelector<HTMLElement>(".proof-claims")!;
  const tabsEl = root.querySelector<HTMLElement>(".proof-tabs")!;
  const bodyEl = root.querySelector<HTMLElement>(".proof-body")!;
  const byId = new Map(claims.map((c) => [c.id, c]));
  let opener: HTMLElement | null = null;
  let group: Claim[] = [];
  let current: Claim | null = null;
  let tab: SourceTab = "study";

  function renderBody() {
    bodyEl.replaceChildren();
    if (!current) {
      const pending = el("div", "proof-pending");
      pending.append(el("span", "badge-pending", "SOURCE PENDING VERIFICATION"),
        el("p", "", "No graded claim is attached to this topic yet. Nothing on this site is presented as proof without a source."));
      bodyEl.append(pending);
      return;
    }
    const c = current;
    const st = statusOf(c);
    const head = el("div", "proof-claim");
    head.append(el("h3", "", c.statement));
    const row = el("div", "proof-badges");
    const b = el("span", "status", st);
    b.style.setProperty("--c", STATUS_COLOR[st]);
    row.append(b);
    if (!c.sources.some((s) => s.verified)) row.append(el("span", "badge-pending", "SOURCE PENDING VERIFICATION"));
    head.append(row, el("p", "", c.rationale));
    bodyEl.append(head);
    const list = c.sources.filter((s) => tabOf(s, c) === tab);
    if (!list.length) bodyEl.append(el("p", "proof-empty", "No sources of this type for this claim."));
    for (const s of list) {
      const card = el("article", "proof-source");
      card.append(icon(tab));
      const txt = el("div", "proof-source-text");
      txt.append(el("h4", "", s.title), el("small", "", [KIND_LABEL[s.kind], s.author, s.year, s.date, s.place].filter(Boolean).join(" · ")), el("small", "", s.citation));
      if (s.method) txt.append(el("small", "", `Counting rule: ${s.method}`));
      if (s.note) txt.append(el("small", "", s.note));
      if (!s.verified) txt.append(el("span", "badge-pending", "SOURCE PENDING VERIFICATION"));
      else txt.append(el("span", "badge-ok", "CITATION CHECKED"));
      card.append(txt);
      if (s.url) {
        const a = el("a", "proof-link", "View Full Reference →");
        a.href = s.url; a.target = "_blank"; a.rel = "noopener noreferrer";
        card.append(a);
      }
      bodyEl.append(card);
    }
  }

  function renderTabs() {
    tabsEl.replaceChildren();
    const have = new Set(current ? current.sources.map((s) => tabOf(s, current!)) : []);
    for (const t of TABS) {
      if (!have.has(t.id) && !["study", "patent", "historical", "clinical", "traditional"].includes(t.id)) continue;
      const b = el("button", "proof-tab", t.label);
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(t.id === tab));
      b.disabled = !have.has(t.id);
      b.addEventListener("click", () => { tab = t.id; renderTabs(); renderBody(); });
      tabsEl.append(b);
    }
  }

  function select(c: Claim | null) {
    current = c;
    if (c) {
      const first = TABS.find((t) => c.sources.some((s) => tabOf(s, c) === t.id));
      tab = first?.id ?? "study";
    }
    claimsEl.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String((b as HTMLElement).dataset.id === c?.id)));
    renderTabs();
    renderBody();
  }

  function show(g: ProofGroup, from: HTMLElement) {
    opener = from;
    titleEl.textContent = "PROOF OVERLAY";
    subEl.textContent = g.subtitle ?? "Verified Knowledge Reference";
    group = g.claimIds.map((id) => byId.get(id)).filter(Boolean) as Claim[];
    claimsEl.replaceChildren();
    if (group.length > 1) {
      for (const c of group) {
        const b = el("button", "proof-claim-chip", c.short ?? c.statement);
        b.dataset.id = c.id;
        b.addEventListener("click", () => select(c));
        claimsEl.append(b);
      }
    }
    if (g.title) {
      const t = el("p", "proof-topic", g.title);
      claimsEl.prepend(t);
    }
    select(group[0] ?? null);
    const wasHidden = root.hidden;
    root.hidden = false;
    if (wasHidden) gsap.fromTo(root, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" });
    root.focus();
  }

  function close() {
    gsap.to(root, {
      opacity: 0, y: -8, duration: 0.25,
      onComplete: () => { root.hidden = true; opener?.focus(); },
    });
  }

  root.querySelector("[data-close]")!.addEventListener("click", close);
  document.addEventListener("click", (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-claim]");
    if (t) show({ title: "", claimIds: [t.dataset.claim!] }, t);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !root.hidden) close();
  });

  return {
    open: (id: string, from: HTMLElement) => show({ title: "", claimIds: [id] }, from),
    openGroup: show,
    close,
  };
}
