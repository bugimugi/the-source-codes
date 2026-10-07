import { CLAIM_BATTERY, CLAIM_METAL, CLAIM_PYRAMID_POWER, CLAIM_PYRAMID_TIP, EARTH_INTRO, EARTH_NOTICE, EARTH_SOURCES, METALS, PYRAMID_TABS, SHAPES, SHOES, SURFACES, type Metal } from "../data/earth";
import { claimHtml, esc, toggleRedaction } from "./dossierParts";
import type { LabApi } from "./lab";

type Mode = "physik" | "behauptung" | "zelle";
const W = 800, H = 440, GROUND = 338;
const DOTS = [[372, 170], [428, 172], [360, 205], [440, 205], [376, 240], [424, 242], [400, 262], [352, 150], [450, 150], [392, 128], [408, 128], [372, 290], [428, 292], [400, 205]];

/**
 * Station "Erdung & Metalle". 1) The body as a "battery": static charge and its discharge through the ground (physics), the earthing
 * claim (drawn as a claim, with its own label) and the real battery of the body, the cell membrane. 2) Metals and shapes as jewellery,
 * with textbook conductivity. 3) The pyramid and its golden tip, documented facts apart from claims. Everything is an illustration
 * with example values; claims are redacted bars with evidence level and counter-evidence.
 */
export function initEarth(root: HTMLElement, api: LabApi) {
  let mode: Mode = "physik";
  let surf = SURFACES[0];
  let shoe = SHOES[0];
  let q = 0;                       // static charge of the figure, 0..1
  let metal = METALS[0];
  let shape = SHAPES[1];
  let pyrTab = PYRAMID_TABS[0].id;
  let withCap = true;
  let raf = 0, last = 0, t = 0, active = false;

  root.innerHTML = `
    <div class="cu-journey-head"><h2>Erdung &amp; Metalle</h2><p class="ea-intro"></p></div>

    <section class="ea-sec" aria-labelledby="ea-h1">
      <h3 class="ea-h" id="ea-h1">1 · Die Körper-Batterie</h3>
      <div class="ea-views" role="group" aria-label="Ansicht"></div>
      <div class="ea">
        <div class="ea-stage"><svg class="ea-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Eine stehende Person auf einem Untergrund; Ladung und ihr Abfluss sind als Punkte dargestellt"></svg><p class="ea-state" aria-live="polite"></p></div>
        <div class="ea-controls">
          <h4>Untergrund</h4><div class="ea-surf" role="group" aria-label="Untergrund"></div>
          <h4>Schuhe</h4><div class="ea-shoe" role="group" aria-label="Schuhe"></div>
          <div class="ea-actions"><button class="cu-primary ea-charge">Über Teppich laufen</button><button class="cu-link ea-discharge">Ladung zurücksetzen</button></div>
          <p class="cu-small ea-surfnote"></p>
        </div>
      </div>
      <div class="ea-info">
        <div class="lb-box"><h3>Was die Physik beschreibt</h3><ul>
          <li><strong>Aufladung durch Reibung.</strong> Wer über Teppich geht, lädt sich auf, vor allem in Schuhen mit Gummisohle und bei trockener Luft. Das kann nach Messtabellen der Elektronikindustrie bis in den Bereich von Kilovolt reichen (laut Suchauszug bis etwa 30 kV an sehr trockenen Tagen). Beim Berühren eines Leiters springt ein Funke über.</li>
          <li><strong>Der Körper als kleiner Kondensator.</strong> Das Standardmodell der Elektronik („Human Body Model“) rechnet mit rund 100 Pikofarad. Die Ladung ist deshalb winzig und fließt über eine leitende Verbindung in Bruchteilen einer Sekunde ab (Überschlag der Redaktion, nicht aus einer Quelle). Die Bilder laufen darum in Zeitlupe. Entscheidend ist meist die Sohle: Gummi isoliert, die feuchte nackte Haut leitet.</li>
          <li><strong>Erdung in der Technik.</strong> Armbänder gegen elektrostatische Entladung und der Potentialausgleich im Haus leiten Ladung ab und schützen Geräte und Menschen.</li>
          <li><strong>Das Feld der Erde.</strong> Bei Schönwetter gibt es zwischen Boden und Luft ein elektrisches Feld von etwa 100 Volt pro Meter. Ein Körper leitet und gleicht sich dem Boden an; Kopf und Füße liegen praktisch auf gleichem Potential. Der Mensch „fließt“ dadurch nicht über.</li>
        </ul></div>
        <div class="lb-box warn"><h3>Sicherheit</h3><ul>
          <li>Bei Gewitter nie barfuß im Freien, auf nassem Boden oder im Wasser sein: Der Strom eines Blitzes breitet sich im Boden aus (Schrittspannung) und im Wasser auf große Entfernung.</li>
          <li>Erdungsmatten und Kabel an Steckdosen nur als geprüfte Produkte benutzen, nie selbst bauen. Fehler in Elektroinstallationen sind lebensgefährlich.</li>
          <li>Barfuß draußen: auf Scherben, Hundekot und Zecken achten.</li>
        </ul></div>
      </div>
      <div class="ea-claim"><h4>Die Behauptung</h4><div class="ea-c1"></div></div>
    </section>

    <section class="ea-sec" aria-labelledby="ea-h2">
      <h3 class="ea-h" id="ea-h2">2 · Metalle und Formen am Körper</h3>
      <div class="ea ea2">
        <div class="ea-stage"><svg class="ea-svg ea-svg2" viewBox="0 0 520 400" role="img" aria-label="Oberkörper mit einem Anhänger in der gewählten Form und einem Armband aus dem gewählten Metall"></svg></div>
        <div class="ea-controls">
          <h4>Metall</h4><div class="ea-metals" role="group" aria-label="Metall"></div>
          <h4>Form des Anhängers</h4><div class="ea-shapes" role="group" aria-label="Form"></div>
          <div class="ea-bars" role="img" aria-label="Elektrische Leitfähigkeit der Metalle"></div>
          <p class="cu-small">Elektrische Leitfähigkeit in Megasiemens pro Meter bei etwa 20 °C (Lehrbuchwerte). Das sagt etwas über Kabel und Kontakte, nichts über die Wirkung am Körper.</p>
        </div>
      </div>
      <div class="ea-cards"></div>
      <div class="ea-claim"><h4>Die Behauptung</h4><div class="ea-c2"></div></div>
      <button class="cu-link ea-open" data-open-energy="schmuck">Akte „Schmuck &amp; Metalle“ öffnen →</button>
    </section>

    <section class="ea-sec" aria-labelledby="ea-h3">
      <h3 class="ea-h" id="ea-h3">3 · Die Pyramide und die goldene Spitze</h3>
      <div class="ea ea3">
        <div class="ea-stage"><svg class="ea-svg ea-svg3" viewBox="0 0 640 340" role="img" aria-label="Die Cheops-Pyramide mit einer goldenen Spitze als Rekonstruktion"></svg><p class="ea-state ea-pstate" aria-live="polite"></p></div>
        <div class="ea-controls">
          <div class="rt-chips ea-cap" role="group" aria-label="Spitze"></div>
          <div class="ea-ptabs" role="tablist" aria-label="Thema"></div>
          <div class="ea-ptext" role="tabpanel" aria-live="polite"></div>
        </div>
      </div>
      <div class="ea-claims"><h4>Behauptungen</h4><div class="ea-c3"></div></div>
      <button class="cu-link ea-open" data-open-energy="erdung">Akte „Erdung“ öffnen →</button>
    </section>

    <ul class="fb-src cu-small ea-src"></ul>
    <p class="cu-small ea-note"></p>`;

  const q$ = <T extends Element>(s: string) => root.querySelector<T>(s)!;
  q$(".ea-intro").textContent = EARTH_INTRO;
  q$(".ea-note").textContent = EARTH_NOTICE;
  q$(".ea-src").innerHTML = EARTH_SOURCES.map((x) => `<li>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.label)}</a>` : esc(x.label)}</li>`).join("");
  q$(".ea-c1").innerHTML = claimHtml(CLAIM_BATTERY);
  q$(".ea-c2").innerHTML = claimHtml(CLAIM_METAL);
  q$(".ea-c3").innerHTML = claimHtml(CLAIM_PYRAMID_TIP) + claimHtml(CLAIM_PYRAMID_POWER);

  const VIEWS: { id: Mode; label: string; sub: string }[] = [
    { id: "physik", label: "Was die Physik beschreibt", sub: "Aufladen und Ableiten" },
    { id: "behauptung", label: "Was die Earthing-Lehre behauptet", sub: "Elektronen aus der Erde" },
    { id: "zelle", label: "Die eigentliche Batterie", sub: "Die Zelle" },
  ];
  const chip = (attr: string, id: string, label: string, extra = "") => `<button class="rt-chip" ${attr}="${id}" aria-pressed="false" ${extra}>${label}</button>`;
  q$(".ea-views").innerHTML = VIEWS.map((v) => `<button class="ea-view" data-view="${v.id}" aria-pressed="false"><strong>${esc(v.label)}</strong><small>${esc(v.sub)}</small></button>`).join("");
  q$(".ea-surf").innerHTML = SURFACES.map((s) => chip("data-surf", s.id, esc(s.name))).join("");
  q$(".ea-shoe").innerHTML = SHOES.map((s) => chip("data-shoe", s.id, esc(s.name))).join("");
  q$(".ea-metals").innerHTML = METALS.map((m) => `<button class="rt-chip" data-metal="${m.id}" aria-pressed="false" style="--c:${m.color}"><i></i>${esc(m.name)}</button>`).join("");
  q$(".ea-shapes").innerHTML = SHAPES.map((s) => chip("data-shape", s.id, esc(s.name))).join("");
  q$(".ea-cap").innerHTML = chip("data-cap", "1", "Mit goldener Spitze (Rekonstruktion)") + chip("data-cap", "0", "Heute (ohne Spitze)");
  q$(".ea-ptabs").innerHTML = PYRAMID_TABS.map((p) => `<button class="rt-chip" role="tab" data-ptab="${p.id}" aria-selected="false">${esc(p.title)}</button>`).join("");

  const rateOf = () => Math.max(0.004, surf.score * shoe.score);
  const rateWord = (r: number) => (r > 0.6 ? "sehr gut" : r > 0.25 ? "gut" : r > 0.08 ? "mäßig" : r > 0.02 ? "schlecht" : "kaum");

  // ---------------------------------------------------------------- part 1: the figure
  const stage = q$<SVGSVGElement>(".ea-svg");
  const stateEl = q$<HTMLElement>(".ea-state");

  function groundSvg(): string {
    const col = surf.ground;
    let deco = "";
    if (surf.id.startsWith("wiese")) {
      for (let i = 0; i < 60; i++) { const x = 20 + i * 13; const h = 8 + ((i * 7) % 9); deco += `<path d="M${x} ${GROUND + 2} l${(i % 3) - 1} -${h}" stroke="${surf.id === "wiese-nass" ? "#58a85e" : "#a3a850"}" stroke-width="2" stroke-linecap="round"/>`; }
    } else if (surf.id.startsWith("sand")) {
      for (let i = 0; i < 80; i++) deco += `<circle cx="${(i * 97) % W}" cy="${GROUND + 8 + ((i * 53) % 80)}" r="${1 + (i % 3) * 0.6}" fill="rgba(0,0,0,.18)"/>`;
    } else if (surf.id === "meer" || surf.id === "suess") {
      for (let i = 0; i < 6; i++) deco += `<path d="M0 ${GROUND + 6 + i * 16} q 30 -8 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0" stroke="rgba(255,255,255,.22)" fill="none" stroke-width="2"/>`;
    } else if (surf.id === "parkett") {
      for (let i = 0; i < 9; i++) deco += `<path d="M${i * 100} ${GROUND} V${H}" stroke="rgba(0,0,0,.35)" stroke-width="2"/>`;
    } else if (surf.id === "teppich") {
      for (let i = 0; i < 120; i++) deco += `<path d="M${(i * 41) % W} ${GROUND + ((i * 29) % 90)} l3 -3" stroke="rgba(255,255,255,.22)" stroke-width="1.5"/>`;
    }
    return `<rect x="0" y="${GROUND}" width="${W}" height="${H - GROUND}" fill="${col}"/>${deco}`;
  }

  function figureSvg(): string {
    const sh = shoe.id === "gummi" ? 12 : shoe.id === "leder" ? 9 : 0;
    const fy = GROUND - sh;
    const sole = sh ? `<rect x="338" y="${fy}" width="52" height="${sh}" rx="4" fill="${shoe.id === "gummi" ? "#222" : "#6b4a2c"}"/><rect x="410" y="${fy}" width="52" height="${sh}" rx="4" fill="${shoe.id === "gummi" ? "#222" : "#6b4a2c"}"/>` : "";
    return `
      <g class="ea-fig" fill="rgba(88,214,232,.1)" stroke="#58D6E8" stroke-opacity=".75" stroke-width="2" stroke-linejoin="round">
        <circle cx="400" cy="106" r="26"/>
        <path d="M356 150 C370 138 430 138 444 150 C452 160 454 210 448 250 L440 296 L442 ${fy} L414 ${fy} L408 300 L400 268 L392 300 L386 ${fy} L358 ${fy} L360 296 L352 250 C346 210 348 160 356 150 Z"/>
        <path d="M356 154 C340 190 336 240 342 272 M444 154 C460 190 464 240 458 272" fill="none"/>
      </g>${sole}`;
  }

  function particles(): string {
    const r = rateOf();
    const s = Math.round(q * DOTS.length);
    if (mode === "physik") {
      let out = "";
      for (let i = 0; i < s; i++) { const [x, y] = DOTS[i]; out += `<g transform="translate(${x} ${y})"><circle r="9" fill="#ff9f6b" opacity=".85"/><path d="M-4 0H4M0 -4V4" stroke="#02070B" stroke-width="2"/></g>`; }
      // a flow of charge to the ground while it discharges
      if (q > 0.04 && r > 0.03) {
        const n = Math.min(8, 2 + Math.round(r * 8));
        for (let i = 0; i < n; i++) {
          const ph = ((t * (0.8 + r * 3) + i / n) % 1);
          const x = i % 2 ? 372 : 428, y = 300 + ph * (GROUND - 300 - 10);
          out += `<circle cx="${x}" cy="${y.toFixed(1)}" r="5" fill="#ff9f6b" opacity="${(1 - ph).toFixed(2)}"/>`;
        }
        if (r > 0.3 && q > 0.2 && Math.floor(t * 6) % 2 === 0) out += `<path d="M386 ${GROUND - 8} l8 -10 l-6 0 l9 -12" stroke="#fff4b0" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
      }
      return out;
    }
    if (mode === "behauptung") {
      let out = "";
      const n = Math.round(4 + r * 14);
      for (let i = 0; i < n; i++) {
        const ph = ((t * (0.35 + r * 1.4) + i / n) % 1);
        const lane = i % 2 ? 372 : 428;
        const y = GROUND - 6 - ph * 250;
        out += `<g transform="translate(${lane + Math.sin(i * 2 + t) * 6} ${y.toFixed(1)})" opacity="${(0.25 + 0.75 * Math.min(1, ph * 3) * (1 - ph * 0.3)).toFixed(2)}"><circle r="8" fill="#F0D18B"/><text y="3" text-anchor="middle" font-size="10" fill="#02070B" font-weight="700">e⁻</text></g>`;
      }
      return out;
    }
    return "";
  }

  function fieldSvg(): string {
    if (mode === "zelle") return "";
    let out = `<defs><linearGradient id="ea-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1a33"/><stop offset="1" stop-color="#16314a"/></linearGradient></defs><rect width="${W}" height="${GROUND}" fill="url(#ea-sky)"/>`;
    if (mode === "physik") {
      for (let i = 0; i < 5; i++) { const x = 90 + i * 150; out += `<g opacity=".5"><path d="M${x} 36 V${GROUND - 40}" stroke="#58D6E8" stroke-width="1.5" stroke-dasharray="3 7"/><path d="M${x - 6} ${GROUND - 54} l6 14 l6 -14" fill="none" stroke="#58D6E8" stroke-width="1.5"/></g>`; }
      out += `<text x="20" y="28" font-size="12" fill="rgba(236,232,222,.75)">Schönwetterfeld der Erde: etwa 100 V pro Meter (vereinfacht)</text>`;
    } else {
      out += `<text x="20" y="28" font-size="12" fill="#F0D18B">Darstellung der Behauptung: Elektronen aus der Erde fließen in den Körper (nicht gemessen)</text>`;
    }
    return out;
  }

  function cellSvg(): string {
    const lipids = (y: number) => Array.from({ length: 22 }, (_, i) => `<circle cx="${60 + i * 32}" cy="${y}" r="9" fill="#e8c27a"/><path d="M${60 + i * 32} ${y + 9} v16" stroke="#e8c27a" stroke-width="3"/>`).join("");
    const lipidsB = (y: number) => Array.from({ length: 22 }, (_, i) => `<circle cx="${60 + i * 32}" cy="${y}" r="9" fill="#e8c27a"/><path d="M${60 + i * 32} ${y - 9} v-16" stroke="#e8c27a" stroke-width="3"/>`).join("");
    const ion = (x: number, y: number, c: string, s: string) => `<g transform="translate(${x} ${y})"><circle r="10" fill="${c}" opacity=".9"/><text y="4" text-anchor="middle" font-size="11" fill="#02070B" font-weight="700">${s}</text></g>`;
    const outs = [[90, 60, "Na⁺"], [190, 96, "Na⁺"], [300, 52, "Na⁺"], [470, 88, "Na⁺"], [610, 60, "Na⁺"], [700, 100, "Na⁺"], [250, 130, "Na⁺"]].map(([x, y, s]) => ion(x as number, y as number, "#58D6E8", s as string)).join("");
    const ins = [[110, 340, "K⁺"], [220, 380, "K⁺"], [330, 330, "K⁺"], [520, 370, "K⁺"], [650, 340, "K⁺"], [720, 390, "K⁺"]].map(([x, y, s]) => ion(x as number, y as number, "#F0D18B", s as string)).join("");
    return `<rect width="${W}" height="${H}" fill="#0a1a26"/><rect y="0" width="${W}" height="168" fill="#0e2a3a"/><rect y="272" width="${W}" height="168" fill="#2a2412"/>
      ${lipids(178)}${lipidsB(262)}
      <g><rect x="395" y="160" width="62" height="120" rx="14" fill="#7a5aa8" stroke="#cdb4f0" stroke-width="2"/><text x="426" y="226" text-anchor="middle" font-size="12" fill="#fff">Pumpe</text></g>
      ${outs}${ins}
      <path d="M440 300 C470 316 520 316 540 296" stroke="#ff9f6b" stroke-width="2" fill="none" stroke-dasharray="4 4"/><text x="548" y="302" font-size="12" fill="#ff9f6b">Energie (ATP)</text>
      <path d="M426 150 V104" stroke="#58D6E8" stroke-width="3" marker-end="url(#ea-ar)"/>
      <text x="20" y="150" font-size="13" fill="rgba(236,232,222,.85)">außen: viel Natrium (Na⁺), eher positiv</text>
      <text x="20" y="428" font-size="13" fill="rgba(236,232,222,.85)">innen: viel Kalium (K⁺), im Ganzen eher negativ</text>
      <text x="520" y="224" font-size="15" fill="#F0D18B" font-weight="600">innen etwa −70 mV</text>`;
  }

  /** the static picture is rebuilt only when something is chosen; the moving particles live in their own group */
  function stageDraw() {
    if (mode === "zelle") { stage.innerHTML = `<defs><marker id="ea-ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#58D6E8"/></marker></defs>${cellSvg()}`; return; }
    stage.innerHTML = `${fieldSvg()}${groundSvg()}${figureSvg()}<g class="ea-pt">${particles()}</g>`;
  }
  function particlesDraw() {
    const g = stage.querySelector(".ea-pt");
    if (g) g.innerHTML = particles();
  }

  function describe() {
    const r = rateOf();
    if (mode === "zelle") {
      stateEl.innerHTML = `<strong>Die Batterie des Körpers sitzt in jeder Zelle.</strong> Eine Pumpe in der Zellwand schafft mit Energie aus der Nahrung (ATP) Natrium nach außen und Kalium nach innen. So entsteht eine Spannung von etwa −70 Millivolt über der Membran von Nervenzellen (laut Lehrbuch; sie ist je nach Zelltyp verschieden). Diese Spannung speichert keine Elektronen aus dem Boden, sondern Unterschiede in der Zusammensetzung.`;
      return;
    }
    if (mode === "behauptung") {
      stateEl.innerHTML = `<strong>Darstellung der Behauptung.</strong> Nach der Earthing-Lehre nimmt der Körper über Fußsohlen Elektronen aus dem Boden auf. Untergrund: ${esc(surf.name)} (${esc(surf.label)}), ${esc(shoe.name.toLowerCase())}: Leitung <strong>${rateWord(r)}</strong>. ${r < 0.08 ? "Mit dieser Sohle oder diesem Boden käme laut der Lehre nichts an." : ""} Gemessen oder belegt ist das nicht.`;
      return;
    }
    const pct = Math.round(q * 100);
    stateEl.innerHTML = q < 0.03
      ? `<strong>Ungeladen.</strong> Klicke auf „Über Teppich laufen“, um Reibungsladung zu erzeugen. Ableitung hier: <strong>${rateWord(r)}</strong> (${esc(surf.name)}, ${esc(shoe.name.toLowerCase())}).`
      : `<strong>Aufladung ${pct} %</strong> · Ableitung: <strong>${rateWord(r)}</strong> (${esc(surf.name)}, ${esc(shoe.name.toLowerCase())}). ${r < 0.05 ? "Die Ladung bleibt, bis du etwas Leitendes berührst, zum Beispiel eine Türklinke." : api.reduceMotion ? "Die Ladung würde hier in Bruchteilen einer Sekunde abfließen (die Bewegung ist abgeschaltet)." : "Die Ladung fließt ab (Zeitlupe: in Wirklichkeit Bruchteile einer Sekunde)."}`;
  }

  function syncPart1() {
    q$(".ea-views").querySelectorAll<HTMLElement>("[data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === mode)));
    q$(".ea-surf").querySelectorAll<HTMLElement>("[data-surf]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.surf === surf.id)));
    q$(".ea-shoe").querySelectorAll<HTMLElement>("[data-shoe]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.shoe === shoe.id)));
    q$(".ea-controls").classList.toggle("dim", mode === "zelle");
    q$<HTMLButtonElement>(".ea-charge").hidden = mode !== "physik";
    q$<HTMLButtonElement>(".ea-discharge").hidden = mode !== "physik";
    q$(".ea-surfnote").textContent = mode === "zelle" ? "" : `${surf.name}: ${surf.note} ${shoe.note} (Beispielwerte der Redaktion für das Bild, keine Messung.)`;
    describe(); stageDraw();
  }

  // ---------------------------------------------------------------- part 2: metals and shapes
  const svg2 = q$<SVGSVGElement>(".ea-svg2");
  function shapePath(id: string): string {
    switch (id) {
      case "kreis": return `<circle r="34" fill="none" stroke="url(#ea-m)" stroke-width="9"/>`;
      case "dreieck": return `<path d="M0 -40 L38 28 L-38 28 Z" fill="url(#ea-m)" stroke="rgba(0,0,0,.35)" stroke-width="1.5" stroke-linejoin="round"/><path d="M0 -40 L38 28 L0 28 Z" fill="rgba(0,0,0,.18)"/>`;
      case "quadrat": return `<rect x="-32" y="-32" width="64" height="64" rx="4" fill="url(#ea-m)" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/><rect x="-32" y="-32" width="64" height="32" rx="4" fill="rgba(255,255,255,.12)"/>`;
      case "spirale": { let d = "M0 0"; for (let a = 0; a < 6.3 * 2.6; a += 0.18) d += ` L${(Math.cos(a) * (3 + a * 2.3)).toFixed(1)} ${(Math.sin(a) * (3 + a * 2.3)).toFixed(1)}`; return `<path d="${d}" fill="none" stroke="url(#ea-m)" stroke-width="6" stroke-linecap="round"/>`; }
      case "sechseck": return `<path d="M0 -38 L33 -19 L33 19 L0 38 L-33 19 L-33 -19 Z" fill="url(#ea-m)" stroke="rgba(0,0,0,.35)" stroke-width="1.5" stroke-linejoin="round"/><path d="M0 -38 L33 -19 L0 0 L-33 -19 Z" fill="rgba(255,255,255,.14)"/>`;
      default: {
        const c = [[0, 0], ...Array.from({ length: 6 }, (_, i) => [Math.cos((i * Math.PI) / 3) * 17, Math.sin((i * Math.PI) / 3) * 17])];
        return `<g fill="none" stroke="url(#ea-m)" stroke-width="2.4">${c.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="17"/>`).join("")}<circle r="34"/></g>`;
      }
    }
  }
  function drawMetal() {
    svg2.innerHTML = `
      <defs><linearGradient id="ea-m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${metal.hi}"/><stop offset=".45" stop-color="${metal.color}"/><stop offset="1" stop-color="${metal.color}" stop-opacity=".78"/></linearGradient></defs>
      <rect width="520" height="400" fill="none"/>
      <g fill="#262c33" stroke="#6b645a" stroke-width="1.5">
        <ellipse cx="260" cy="64" rx="38" ry="46"/>
        <path d="M244 100 C244 118 250 124 260 126 C270 124 276 118 276 100 Z"/>
        <path d="M150 150 C190 128 330 128 370 150 C392 164 396 220 388 270 L376 380 H144 L132 270 C124 220 128 164 150 150 Z"/>
        <path d="M150 156 C128 210 118 290 126 346 H156 C158 290 168 220 190 160 Z M370 156 C392 210 402 290 394 346 H364 C362 290 352 220 330 160 Z" />
      </g>
      <path d="M224 128 C230 190 290 190 296 128" fill="none" stroke="url(#ea-m)" stroke-width="3"/>
      <g transform="translate(260 214) scale(.9)">${shapePath(shape.id)}</g>
      <ellipse cx="141" cy="338" rx="21" ry="8" fill="none" stroke="url(#ea-m)" stroke-width="9"/>
      <text x="260" y="392" text-anchor="middle" font-size="12" fill="rgba(236,232,222,.7)">${esc(metal.name)} · ${esc(shape.name)}</text>`;
    q$(".ea-metals").querySelectorAll<HTMLElement>("[data-metal]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.metal === metal.id)));
    q$(".ea-shapes").querySelectorAll<HTMLElement>("[data-shape]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.shape === shape.id)));
    const max = Math.max(...METALS.map((m) => m.ms));
    q$(".ea-bars").innerHTML = [...METALS].sort((a, b) => b.ms - a.ms).map((m) => `<div class="ea-bar${m.id === metal.id ? " on" : ""}"><span>${esc(m.name)}</span><i><b style="width:${((m.ms / max) * 100).toFixed(1)}%;background:${m.color}"></b></i><em>${String(m.ms).replace(".", ",")}</em></div>`).join("");
    const m: Metal = metal;
    q$(".ea-cards").innerHTML = `
      <article class="fb-card"><h4>${esc(m.name)}</h4><p>${esc(m.role)}</p><ul class="ea-facts">${m.facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul><p class="fb-claimline"><strong>Überlieferung:</strong> ${esc(m.tradition)}</p></article>
      <article class="fb-card"><h4>${esc(shape.name)}</h4><p class="fb-claimline"><strong>Bedeutung in der Überlieferung:</strong> ${esc(shape.tradition)}</p><p>Die Bedeutungen stehen für Symbolik und Geschichte. Dass eine Form Energie bündelt oder die Wirkung eines Metalls verstärkt, ist nicht belegt.</p></article>`;
  }

  // ---------------------------------------------------------------- part 3: pyramid
  const svg3 = q$<SVGSVGElement>(".ea-svg3");
  function drawPyramid() {
    const APEX = 56, CUT = 92, BASE = 300, HALF = 293;
    const hw = (y: number) => (HALF * (y - APEX)) / (BASE - APEX);
    const top = withCap ? APEX : CUT;
    let courses = "";
    for (let y = 108; y < BASE; y += 14) courses += `<path d="M${320 - hw(y)} ${y} H${320 + hw(y)}" stroke="rgba(0,0,0,.18)" stroke-width="1"/>`;
    const body = withCap ? `${320} ${APEX}, ${320 + hw(BASE)} ${BASE}, ${320 - hw(BASE)} ${BASE}` : `${320 - hw(CUT)} ${CUT}, ${320 + hw(CUT)} ${CUT}, ${320 + hw(BASE)} ${BASE}, ${320 - hw(BASE)} ${BASE}`;
    const shade = withCap ? `320 ${APEX}, ${320 + hw(BASE)} ${BASE}, 320 ${BASE}` : `320 ${CUT}, ${320 + hw(CUT)} ${CUT}, ${320 + hw(BASE)} ${BASE}, 320 ${BASE}`;
    const cap = withCap ? `<g class="ea-cap-tip" tabindex="0" role="button" aria-label="Goldene Spitze: Informationen anzeigen"><path d="M320 ${APEX} L${320 - hw(CUT)} ${CUT} L${320 + hw(CUT)} ${CUT} Z" fill="url(#ea-gold)" stroke="#8a6a12" stroke-width="1" stroke-linejoin="round"/><path d="M320 ${APEX} L${320 + hw(CUT)} ${CUT} L320 ${CUT} Z" fill="rgba(0,0,0,.2)"/></g>` : "";
    const glint = withCap && !api.reduceMotion ? `<g class="ea-glint" transform="translate(326 72)"><path d="M0 -12 L2 -2 L12 0 L2 2 L0 12 L-2 2 L-12 0 L-2 -2 Z" fill="#fff6c8"/></g>` : "";
    svg3.innerHTML = `
      <defs><linearGradient id="ea-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a8"/><stop offset=".5" stop-color="#d9a81f"/><stop offset="1" stop-color="#9a7312"/></linearGradient>
        <linearGradient id="ea-psky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14264a"/><stop offset="1" stop-color="#e29a5a"/></linearGradient></defs>
      <rect width="640" height="340" fill="url(#ea-psky)"/>
      <circle cx="540" cy="84" r="30" fill="#ffd98a" opacity=".9"/>
      <path d="M0 300 C120 286 220 312 320 298 C420 284 520 310 640 296 V340 H0 Z" fill="#c9a064"/>
      <polygon points="${body}" fill="#d8c08a"/>
      <polygon points="${shade}" fill="rgba(60,40,10,.26)"/>
      ${courses}${cap}${glint}
      <text x="22" y="26" font-size="12" fill="rgba(236,232,222,.8)">${withCap ? "Rekonstruktion: Spitze und Verkleidung sind ungesichert" : "Heute: das Pyramidion der Cheops-Pyramide fehlt"}</text>`;
    q$(".ea-cap").querySelectorAll<HTMLElement>("[data-cap]").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.cap === "1") === withCap)));
    q$(".ea-ptabs").querySelectorAll<HTMLElement>("[data-ptab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.ptab === pyrTab)));
    const p = PYRAMID_TABS.find((x) => x.id === pyrTab)!;
    q$(".ea-ptext").innerHTML = `<h4>${esc(p.title)}</h4><p>${esc(p.text)}</p>`;
    q$(".ea-pstate").textContent = "Vereinfachte Zeichnung. Klicke auf die Spitze oder wähle ein Thema.";
  }

  // ---------------------------------------------------------------- loop (only while part 1 is animated and the station is visible)
  let lastKey = "";
  const needsFrame = () => mode === "behauptung" || (mode === "physik" && q > 0);
  function step(dt: number) {
    if (mode === "physik" && q > 0) {
      q = q * Math.exp(-rateOf() * 1.1 * dt);
      if (q < 0.01) q = 0;
    }
  }
  function frame(now: number) {
    const dt = Math.min((now - (last || now)) / 1000, 0.1);
    last = now; t += dt;
    step(dt);
    particlesDraw();
    const key = `${Math.round(q * 100)}`;
    if (key !== lastKey) { lastKey = key; describe(); }
    raf = active && !document.hidden && needsFrame() ? requestAnimationFrame(frame) : 0;
    if (!raf) last = 0;
  }
  function loop() { if (!raf && active && !api.reduceMotion && needsFrame()) { last = 0; raf = requestAnimationFrame(frame); } }

  // ---------------------------------------------------------------- events
  root.addEventListener("click", (e) => {
    const el = e.target as HTMLElement;
    if (toggleRedaction(el)) return;
    const v = el.closest<HTMLElement>("[data-view]");
    if (v) { mode = v.dataset.view as Mode; syncPart1(); loop(); return; }
    const sf = el.closest<HTMLElement>("[data-surf]");
    if (sf) { surf = SURFACES.find((s) => s.id === sf.dataset.surf)!; syncPart1(); loop(); return; }
    const sh = el.closest<HTMLElement>("[data-shoe]");
    if (sh) { shoe = SHOES.find((s) => s.id === sh.dataset.shoe)!; syncPart1(); loop(); return; }
    if (el.closest(".ea-charge")) { q = 1; lastKey = ""; syncPart1(); loop(); return; }
    if (el.closest(".ea-discharge")) { q = 0; syncPart1(); return; }
    const mt = el.closest<HTMLElement>("[data-metal]");
    if (mt) { metal = METALS.find((m) => m.id === mt.dataset.metal)!; drawMetal(); return; }
    const shp = el.closest<HTMLElement>("[data-shape]");
    if (shp) { shape = SHAPES.find((s) => s.id === shp.dataset.shape)!; drawMetal(); return; }
    const cp = el.closest<HTMLElement>("[data-cap]");
    if (cp) { withCap = cp.dataset.cap === "1"; drawPyramid(); return; }
    const pt = el.closest<HTMLElement>("[data-ptab]");
    if (pt) { pyrTab = pt.dataset.ptab!; drawPyramid(); return; }
    if (el.closest(".ea-cap-tip")) { pyrTab = "pyramidion"; drawPyramid(); return; }
    const op = el.closest<HTMLElement>("[data-open-energy]");
    if (op) api.openEnergy(op.dataset.openEnergy!);
  });
  svg3.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && (e.target as Element).closest(".ea-cap-tip")) { e.preventDefault(); pyrTab = "gold"; drawPyramid(); } });

  syncPart1(); drawMetal(); drawPyramid();
  return {
    start() { active = true; loop(); },
    stop() { active = false; cancelAnimationFrame(raf); raf = 0; last = 0; },
  };
}
