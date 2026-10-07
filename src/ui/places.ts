import { initGlobeScene, type GlobeScene } from "../gl/globescene";
import { SITES, SITES_NOTICE, type Site } from "../data/sites";
import { claims } from "../data/claims";
import { LEVEL_LABEL } from "../data/types";
import { hasAsset, mountSlots } from "../assets/slots";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export interface PlacesApi { openClaim(id: string, from: HTMLElement): void; reduceMotion: boolean }

/** The places page: globe on the left, list and detail on the right (same layout as the frequency page). */
export function initPlaces(root: HTMLElement, api: PlacesApi) {
  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  const panel = root.querySelector<HTMLElement>(".fx-panel")!;
  let scene: GlobeScene | null = null;
  let current: Site | null = null;

  const chip = (s: Site) => `<button class="ck-chip pl-chip" data-site="${s.id}" aria-pressed="${current?.id === s.id}"><i></i><span><strong>${esc(s.name)}</strong><small>${esc(s.place)}</small></span></button>`;

  function overview() {
    panel.innerHTML = `
      <p class="fx-eyebrow">Geschichte · Überlieferung</p>
      <h2>Heilige Orte</h2>
      <p>Orte, an denen Menschen Bauwerke von besonderer religiöser, kultureller oder astronomischer Bedeutung errichtet haben. Wähle einen Ort in der Liste oder auf der Kugel; mit der Maus drehst du sie, mit dem Mausrad zoomst du.</p>
      <div class="ck-list" role="group" aria-label="Ort wählen">${SITES.map(chip).join("")}</div>
      <p class="fx-small">${esc(SITES_NOTICE)}</p>
      <p class="fx-small">Kartengrundlage: Natural Earth (gemeinfrei). Koordinaten gerundet.</p>`;
  }

  function detail(s: Site) {
    const cl = s.claims.map((id) => claims.find((c) => c.id === id)).filter((c): c is NonNullable<typeof c> => !!c);
    panel.innerHTML = `
      <button class="ck-back" data-all>← Alle Orte</button>
      <p class="fx-eyebrow">${esc(s.kind)}</p>
      <h2>${esc(s.name)}</h2>
      <div class="pl-img" data-slot="${s.slot}" data-eager="true"></div>
      ${hasAsset(s.slot) ? `<p class="fx-small">Bild: Illustration (mit KI erzeugt), kein Foto.</p>` : ""}
      <dl class="ck-dl">
        <div><dt>Land / Region</dt><dd>${esc(s.place)}</dd></div>
        <div><dt>Koordinaten</dt><dd>ca. ${Math.abs(s.lat).toFixed(2)}° ${s.lat >= 0 ? "N" : "S"}, ${Math.abs(s.lon).toFixed(2)}° ${s.lon >= 0 ? "O" : "W"}</dd></div>
      </dl>
      <p>${esc(s.text)}</p>
      <h3>Aussagen dazu in der Bibliothek</h3>
      ${cl.length ? `<ul class="bv-rel">${cl.map((c) => `<li><button data-claim="${esc(c.id)}"><strong>${esc(c.short ?? c.statement)}</strong><small>${esc(LEVEL_LABEL[c.level])}</small></button></li>`).join("")}</ul>` : `<p class="fx-small">Dazu gibt es noch keine bewertete Aussage.</p>`}
      <p class="fx-notice">${esc(SITES_NOTICE)}</p>`;
    mountSlots(panel);
  }

  function select(id: string | null) {
    current = id ? SITES.find((s) => s.id === id) ?? null : null;
    scene?.select(current?.id ?? null);
    if (current) detail(current); else overview();
  }

  panel.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const si = t.closest<HTMLElement>("[data-site]");
    if (si) { select(si.dataset.site!); return; }
    if (t.closest("[data-all]")) { select(null); return; }
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) api.openClaim(cl.dataset.claim!, cl);
  });

  return {
    /** Opens the page (creates the WebGL scene on first use; throws without WebGL). */
    start(id?: string) {
      scene ??= initGlobeScene(canvas, api.reduceMotion, (sid) => select(sid));
      scene.start();
      select(id ?? current?.id ?? null);
    },
    stop() { scene?.stop(); },
  };
}
