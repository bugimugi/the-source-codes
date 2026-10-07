import { initChakraScene, type ChakraScene } from "../gl/chakrascene";
import { CHAKRAS, CHAKRA_HISTORY, type Chakra } from "../data/chakras";
import { atlas } from "../data/atlas";
import { claims } from "../data/claims";
import { CATEGORY_LABEL, LEVEL_LABEL, ORIGIN_LABEL } from "../data/types";
import { createTone } from "../audio/tone";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const NOTICE = "Informationsangebot – keine medizinische Beratung. Chakren sind ein Konzept der Überlieferung; eine gesundheitliche Wirkung der Zentren, Farben, Töne oder Steine ist hier nicht belegt.";

export interface ChakraApi {
  openClaim(id: string, from: HTMLElement): void;
  openAtlas(id: string): void;
  reduceMotion: boolean;
}

/**
 * The chakra page: computed 3D column on the left, a panel on the right. The panel keeps three things apart:
 * tradition (location, element, syllable, petals, themes), modern additions (colour, frequency, gemstones), and the
 * graded claims of the library. Stones come from the atlas data; nothing is invented here.
 */
export function initChakra(root: HTMLElement, api: ChakraApi) {
  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  const panel = root.querySelector<HTMLElement>(".fx-panel")!;
  const tone = createTone();
  let scene: ChakraScene | null = null;
  let current: Chakra | null = null;

  function overview() {
    panel.innerHTML = `
      <p class="fx-eyebrow">Überlieferung · Energiezentren</p>
      <h2>Die sieben Chakren</h2>
      <p>Nach der Überlieferung liegen sieben Zentren entlang der Wirbelsäule, vom Beckenboden bis zum Scheitel. Wähle eines in der Liste oder in der Szene.</p>
      <div class="ck-list" role="group" aria-label="Chakra wählen">${[...CHAKRAS].reverse().map(chip).join("")}</div>
      <p class="fx-small">${esc(CHAKRA_HISTORY)}</p>
      <p class="fx-notice">${NOTICE}</p>`;
  }
  const chip = (c: Chakra) => `<button class="ck-chip" data-ck="${c.id}" style="--c:${c.color}" aria-pressed="${current?.id === c.id}"><i></i><span><strong>${esc(c.name)}</strong><small>${esc(c.sanskrit)}</small></span></button>`;

  function detail(c: Chakra) {
    const stones = atlas.flatMap((e) => e.associations.filter((a) => a.target === c.target).map((a) => ({ e, a })));
    const claimIds = [...new Set(stones.flatMap(({ e }) => e.claims))];
    const cl = claimIds.map((id) => claims.find((x) => x.id === id)).filter((x): x is NonNullable<typeof x> => !!x);
    panel.innerHTML = `
      <button class="ck-back" data-ck-all>← Alle Chakren</button>
      <p class="fx-eyebrow" style="color:${c.color}">${esc(c.sanskrit)}</p>
      <h2>${esc(c.name)}</h2>
      <div class="ck-tabs-hint"><span class="ck-badge">Überlieferung</span></div>
      <dl class="ck-dl">
        <div><dt>Lage</dt><dd>${esc(c.position)}</dd></div>
        <div><dt>Element</dt><dd>${esc(c.element)}</dd></div>
        <div><dt>Keimsilbe</dt><dd>${esc(c.syllable)}</dd></div>
        <div><dt>Blütenblätter</dt><dd>${esc(c.petalsLabel)}</dd></div>
        <div><dt>Themen</dt><dd>${esc(c.themes)}</dd></div>
      </dl>
      <div class="ck-modern"><span class="ck-badge modern">Moderne Zuordnung (20. Jh.)</span>
        <div class="ck-hz"><button class="fx-play" aria-pressed="${tone.playing}" aria-label="${tone.playing ? "Ton stoppen" : "Ton anhören"}"><span></span></button>
          <div><strong>${c.hz} Hz</strong><small>Frequenz nach der Solfeggio-Lehre · Sinuston, leise</small></div></div>
        <p class="fx-small">Die Farbe (${esc(c.color)}) folgt dem Regenbogen-Schema, das erst im 20. Jahrhundert üblich wurde.</p></div>
      <h3>Steine nach moderner Lehre</h3>
      ${stones.length ? `<ul class="bv-rel">${stones.map(({ e, a }) => `<li><button data-atlas="${e.id}"><strong>${esc(e.name)}</strong><small>${esc(CATEGORY_LABEL[e.category])} · ${esc(ORIGIN_LABEL[a.origin])}</small></button></li>`).join("")}</ul>` : `<p class="fx-small">Dazu gibt es noch keinen Eintrag im Atlas.</p>`}
      ${cl.length ? `<h3>Aussagen dazu in der Bibliothek</h3><ul class="bv-rel">${cl.map((x) => `<li><button data-claim="${esc(x.id)}"><strong>${esc(x.short ?? x.statement)}</strong><small>${esc(LEVEL_LABEL[x.level])}</small></button></li>`).join("")}</ul>` : ""}
      <p class="fx-notice">${NOTICE}</p>`;
  }

  function select(id: string | null) {
    current = id ? CHAKRAS.find((c) => c.id === id) ?? null : null;
    if (!current) tone.stop();
    else tone.setHz(current.hz);
    scene?.select(current?.id ?? null);
    if (current) detail(current); else overview();
  }

  panel.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const ck = t.closest<HTMLElement>("[data-ck]");
    if (ck) { select(ck.dataset.ck!); return; }
    if (t.closest("[data-ck-all]")) { select(null); return; }
    if (t.closest(".fx-play") && current) {
      if (tone.playing) tone.stop(); else tone.start(current.hz);
      const b = panel.querySelector<HTMLButtonElement>(".fx-play")!;
      b.setAttribute("aria-pressed", String(tone.playing));
      b.setAttribute("aria-label", tone.playing ? "Ton stoppen" : "Ton anhören");
      b.classList.toggle("is-playing", tone.playing);
      return;
    }
    const at = t.closest<HTMLElement>("[data-atlas]");
    if (at) { api.openAtlas(at.dataset.atlas!); return; }
    const cl = t.closest<HTMLElement>("[data-claim]");
    if (cl) api.openClaim(cl.dataset.claim!, cl);
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden && tone.playing) { tone.stop(); if (current) detail(current); } });

  return {
    /** Opens the page (creates the WebGL scene on first use; throws without WebGL). */
    start(id?: string) {
      scene ??= initChakraScene(canvas, api.reduceMotion, (cid) => select(cid));
      scene.start();
      select(id ?? current?.id ?? null);
    },
    stop() { tone.stop(); scene?.stop(); },
  };
}
