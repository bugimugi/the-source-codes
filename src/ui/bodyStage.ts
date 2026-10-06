import { BODY_ORGANS } from "../data/body";
import { mountSlots } from "../assets/slots";

export interface BodyStageOpts {
  reduceMotion: boolean;
  /** Where the zoomed organ should land, in px inside the stage (default: centre). */
  focus?: (w: number, h: number) => [number, number];
  zoom?: number;
  /** Called for every change: the organ id, or null after "Ganzer Körper". */
  onSelect?: (id: string | null) => void;
}

/**
 * The anatomy picture with a pin per organ. Selecting an organ zooms the picture towards it (CSS transform on the
 * picture, the pins follow with the same math but keep their size), the other pins fade out, and a back button
 * returns to the whole body. The picture is screened onto the page as a whole so its black background vanishes.
 */
export function createBodyStage(stage: HTMLElement, opts: BodyStageOpts) {
  const ZOOM = opts.zoom ?? 3.1;
  stage.classList.add("bs");
  stage.innerHTML = `<div class="bs-zoom" data-slot="body-front" data-eager="true"></div>
    <div class="bs-pins">${BODY_ORGANS.map((o) => `<button class="bp" data-organ="${o.id}" aria-label="${o.name}"><span class="bp-ring"></span><span class="bp-label">${o.name}</span></button>`).join("")}</div>
    <button class="bs-back" hidden>← Ganzer Körper</button>`;
  mountSlots(stage);
  const zoomEl = stage.querySelector<HTMLElement>(".bs-zoom")!;
  const back = stage.querySelector<HTMLButtonElement>(".bs-back")!;
  const pins = [...stage.querySelectorAll<HTMLButtonElement>(".bp")];
  let current: string | null = null;

  function layout(animate: boolean) {
    const W = stage.clientWidth, H = stage.clientHeight;
    if (!W || !H) return;
    // the picture is 2:3 and as tall as the stage (or as wide, if the stage is narrow)
    const imgH = Math.min(H, W * 1.5), imgW = imgH / 1.5;
    const offX = (W - imgW) / 2, offY = (H - imgH) / 2;
    const o = BODY_ORGANS.find((x) => x.id === current);
    let s = 1, dx = 0, dy = 0;
    if (o) {
      const [fx, fy] = opts.focus?.(W, H) ?? [W / 2, H / 2];
      s = ZOOM;
      dx = fx - offX - s * (o.x / 100) * imgW;
      dy = fy - offY - s * (o.y / 100) * imgH;
    }
    stage.classList.toggle("bs-still", !animate || opts.reduceMotion);
    Object.assign(zoomEl.style, { left: `${offX}px`, top: `${offY}px`, width: `${imgW}px`, height: `${imgH}px`, transform: `translate(${dx}px, ${dy}px) scale(${s})` });
    for (const pin of pins) {
      const p = BODY_ORGANS.find((x) => x.id === pin.dataset.organ)!;
      pin.style.left = `${offX + dx + s * (p.x / 100) * imgW}px`;
      pin.style.top = `${offY + dy + s * (p.y / 100) * imgH}px`;
      const hide = !!current && p.id !== current;
      pin.classList.toggle("bp-hidden", hide);
      pin.setAttribute("aria-pressed", String(p.id === current));
      pin.tabIndex = hide ? -1 : 0;
    }
    back.hidden = !current;
    stage.classList.toggle("bs-zoomed", !!current);
  }

  function select(id: string | null) {
    current = id;
    layout(true);
    opts.onSelect?.(id);
  }

  pins.forEach((p) => p.addEventListener("click", () => select(p.dataset.organ!)));
  back.addEventListener("click", () => select(null));
  stage.addEventListener("keydown", (e) => { if (e.key === "Escape" && current) { e.stopPropagation(); select(null); } });
  new ResizeObserver(() => layout(false)).observe(stage);
  layout(false);
  return { select, get current() { return current; }, layout: () => layout(false) };
}
export type BodyStage = ReturnType<typeof createBodyStage>;
