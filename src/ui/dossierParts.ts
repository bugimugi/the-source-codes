import { LEVEL_LABEL, type EvidenceLevel } from "../data/types";

/** Pieces shared by the "Akten" pages (Alte Kulturen, Freie Energie): escaping, the redacted claim and the redaction toggle. */
export const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export interface ClaimLike { text: string; level: EvidenceLevel; counter: string }

/** A claim starts as a black bar; a click (see `toggleRedaction`) shows the statement, its evidence level and the counter-evidence. */
export const claimHtml = (c: ClaimLike, from?: string) => `
    <div class="cu-claim">
      <button class="cu-redact" aria-expanded="false"><span class="cu-bar" aria-hidden="true"></span><span class="cu-redact-label">Behauptung · Schwärzung aufheben</span></button>
      <div class="cu-claim-body" hidden>
        <p class="cu-claim-text">${from ? `<small>${esc(from)}</small>` : ""}„${esc(c.text)}“</p>
        <span class="cu-level" style="--c:var(--lvl-${c.level})">${esc(LEVEL_LABEL[c.level])}</span>
        <p class="cu-counter"><strong>Einordnung und Gegenbelege:</strong> ${esc(c.counter)}</p>
      </div>
    </div>`;

/** Handles a click on a redaction bar; returns true if the click was one. */
export function toggleRedaction(target: HTMLElement): boolean {
  const red = target.closest<HTMLButtonElement>(".cu-redact");
  if (!red) return false;
  const body = red.nextElementSibling as HTMLElement;
  const open = red.getAttribute("aria-expanded") !== "true";
  red.setAttribute("aria-expanded", String(open));
  body.hidden = !open;
  red.classList.toggle("open", open);
  if (open) { body.tabIndex = -1; body.focus({ preventScroll: true }); }
  return true;
}
