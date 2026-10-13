import { HERO_BACKGROUND } from "../data/hero";
import { hasAsset, mountSlots, slotHtml } from "../assets/slots";

/**
 * True when the changing background will be shown (switched on and at least one picture exists). Then the hero gets no pins: they sat on
 * the old figures and mean nothing on the new pictures (the hint about them is hidden by CSS). With `enabled: false` they come back.
 */
export const heroBackgroundWanted = (): boolean => HERO_BACKGROUND.enabled && HERO_BACKGROUND.slots.some((n) => hasAsset(n));

/**
 * The changing background of the hero (settings in src/data/hero.ts): two stacked layers that fade into each other. The next picture is
 * always loaded behind the visible one, so the change never waits. It stands still (first picture only) with reduced motion, and it
 * pauses while the hero is not on screen or the tab is in the background. It sits inside `.hero-layers` (as the top layer), so the
 * fly-in zoom of the hero carries it along; the old layers stay underneath, hidden by CSS.
 * Returns null (the old hero stays) when it is switched off or no picture exists yet.
 */
export function initHeroBackground(section: HTMLElement, opts: { reduceMotion: boolean }) {
  const cfg = HERO_BACKGROUND;
  const host = section.querySelector<HTMLElement>(".hero-layers");
  const names = cfg.slots.filter((n) => hasAsset(n));
  if (!cfg.enabled || !host || !names.length) return null;

  section.classList.add("hero-bg-on");
  const wrap = document.createElement("div");
  wrap.className = "hero-bg";
  wrap.setAttribute("aria-hidden", "true");
  wrap.style.setProperty("--hero-fade", `${cfg.fadeSeconds}s`);
  const mk = () => { const d = document.createElement("div"); d.className = "hero-bg-layer"; return d; };
  let front = mk(), back = mk();
  wrap.append(front, back);
  host.append(wrap);

  let idx = 0, timer = 0, active = false;

  /** puts picture `n` into a layer and resolves when it is loaded (false: it could not be loaded) */
  function prepare(n: number, layer: HTMLElement): Promise<boolean> {
    layer.dataset.idx = String(n);
    layer.dataset.ready = "";
    layer.innerHTML = slotHtml(names[n], { cover: true, eager: n === 0 && layer === front });
    mountSlots(layer);
    const img = layer.querySelector("img");
    if (!img) return Promise.resolve(false);
    img.loading = "eager";
    const done = (ok: boolean) => { if (ok) layer.dataset.ready = "1"; return ok; };
    return img.complete && img.naturalWidth ? Promise.resolve(done(true)) : new Promise((res) => { img.onload = () => res(done(true)); img.onerror = () => res(done(false)); });
  }

  const schedule = () => {
    clearTimeout(timer);
    timer = 0;
    if (active && names.length > 1) timer = window.setTimeout(next, cfg.seconds * 1000);
  };

  async function next() {
    if (!active) return;
    const n = (idx + 1) % names.length;
    const ready = back.dataset.idx === String(n) && back.dataset.ready === "1";
    if (!(ready || (await prepare(n, back)))) { idx = n; schedule(); return; } // a missing picture is skipped
    if (!active) return;
    back.classList.add("on");
    front.classList.remove("on");
    [front, back] = [back, front];
    idx = n;
    schedule();
    // once the fade is over, the picture after next is loaded into the layer that is now behind
    const behind = back, shown = idx;
    window.setTimeout(() => { if (back === behind && idx === shown) void prepare((idx + 1) % names.length, behind); }, cfg.fadeSeconds * 1000 + 200);
  }

  void prepare(0, front).then((ok) => {
    if (!ok) { section.classList.remove("hero-bg-on"); wrap.remove(); return; } // first picture missing: back to the old hero
    front.classList.add("on");
    if (!opts.reduceMotion && names.length > 1) void prepare(1, back);
  });

  const update = (on: boolean) => { active = on && !document.hidden && !opts.reduceMotion; schedule(); };
  let wanted = true;
  document.addEventListener("visibilitychange", () => update(wanted));

  return {
    /** called with true while the hero is the page on screen */
    setActive(on: boolean) { wanted = on; update(on); },
  };
}
