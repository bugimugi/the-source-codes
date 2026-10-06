import { mountSlots } from "../assets/slots";

/**
 * 2.5D picture card for plants, stones and other motifs that are images (not 3D models).
 * One picture becomes a small stack: a soft colour glow, a blurred copy that sits deep, the picture itself,
 * a specular highlight that follows the pointer, and a few floating motes. Pointer movement tilts the card and
 * shifts the layers by different amounts (parallax); without a pointer the card drifts slowly.
 * Everything is CSS + one small loop, no WebGL. Reduced motion: still image, no loop.
 */
export function createDepthCard(host: HTMLElement, reduceMotion: boolean) {
  const el = document.createElement("div");
  el.className = "dc-stage";
  el.hidden = true;
  const motes = Array.from({ length: 16 }, (_, i) => {
    // fixed pseudo-random spread so the layout is the same on every visit
    const r = (n: number) => ((Math.sin(i * 91.7 + n * 17.3) + 1) / 2);
    return `<i style="left:${(10 + r(1) * 80).toFixed(1)}%;top:${(18 + r(2) * 70).toFixed(1)}%;--d:${(5 + r(3) * 6).toFixed(1)}s;--w:${(r(4) * -9).toFixed(1)}s;--s:${(2 + r(5) * 3).toFixed(1)}px"></i>`;
  }).join("");
  el.innerHTML = `
    <div class="dc">
      <div class="dc-glow"></div>
      <div class="dc-far"></div>
      <div class="dc-img"></div>
      <div class="dc-spec"></div>
      <div class="dc-motes">${motes}</div>
    </div>
    <p class="dc-cap"></p>`;
  host.append(el);
  const card = el.querySelector<HTMLElement>(".dc")!;
  const glow = el.querySelector<HTMLElement>(".dc-glow")!;
  const far = el.querySelector<HTMLElement>(".dc-far")!;
  const img = el.querySelector<HTMLElement>(".dc-img")!;
  const motesEl = el.querySelector<HTMLElement>(".dc-motes")!;
  const cap = el.querySelector<HTMLElement>(".dc-cap")!;

  const cur = { x: 0, y: 0 }, tgt = { x: 0, y: 0 };
  let pointer = false, raf = 0, active = false;

  function apply() {
    card.style.transform = `perspective(1000px) rotateX(${(-cur.y * 7).toFixed(2)}deg) rotateY(${(cur.x * 9).toFixed(2)}deg)`;
    glow.style.translate = `${(-cur.x * 8).toFixed(1)}px ${(-cur.y * 6).toFixed(1)}px`;
    // the pictures are moved through CSS variables on their <img> (a transform on the layer <div> would end the "screen" blending)
    card.style.setProperty("--fx", `${(-cur.x * 20).toFixed(1)}px`);
    card.style.setProperty("--fy", `${(-cur.y * 15).toFixed(1)}px`);
    card.style.setProperty("--ix", `${(cur.x * 10).toFixed(1)}px`);
    card.style.setProperty("--iy", `${(cur.y * 8).toFixed(1)}px`);
    motesEl.style.translate = `${(cur.x * 26).toFixed(1)}px ${(cur.y * 20).toFixed(1)}px`;
    card.style.setProperty("--sx", `${(50 + cur.x * 34).toFixed(1)}%`);
    card.style.setProperty("--sy", `${(42 + cur.y * 34).toFixed(1)}%`);
  }
  function loop(t: number) {
    if (!pointer) { tgt.x = Math.sin(t / 2600) * 0.32; tgt.y = Math.cos(t / 3300) * 0.22; }
    cur.x += (tgt.x - cur.x) * 0.07;
    cur.y += (tgt.y - cur.y) * 0.07;
    apply();
    raf = active ? requestAnimationFrame(loop) : 0;
  }
  host.addEventListener("pointermove", (e) => {
    const r = host.getBoundingClientRect();
    tgt.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    tgt.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    pointer = true;
  });
  host.addEventListener("pointerleave", () => { pointer = false; });

  return {
    el,
    /** Show the card for `atlas-<id>`; `color` tints the glow, `caption` is the small text under the picture. */
    show(id: string, color: string, caption: string) {
      el.hidden = false;
      card.style.setProperty("--dc", color);
      for (const t of [far, img]) { t.dataset.slot = `atlas-${id}`; t.dataset.fit = "cover"; t.dataset.sizes = "(max-width: 700px) 90vw, 640px"; t.dataset.eager = "true"; }
      mountSlots(el);
      cap.textContent = caption;
      active = true;
      if (!reduceMotion && !raf) raf = requestAnimationFrame(loop);
      else if (reduceMotion) { cur.x = cur.y = 0; apply(); }
    },
    hide() { el.hidden = true; active = false; cancelAnimationFrame(raf); raf = 0; },
  };
}
export type DepthCard = ReturnType<typeof createDepthCard>;
