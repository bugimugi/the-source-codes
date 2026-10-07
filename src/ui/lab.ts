import { LAB_LEAD, LAB_NAME, LAB_NOTICE, type StationId } from "../data/lab";
import { mountSlots } from "../assets/slots";
import { initRitual } from "./labRitual";
import { initBench } from "./labBench";
import { initFabrics } from "./labFabrics";

export interface LabApi { reduceMotion: boolean; openClaim(id: string, from: HTMLElement): void }

const ORDER: StationId[] = ["bench", "ritual", "fabrics"];

/**
 * "Rezepte & Rituale": three stations, one visible at a time. The workbench shows how a traditional recipe is made (vessel,
 * ingredients, amounts, steps, times); the ritual room is an illustration of stones, sound and chakras; the fabric station
 * compares textiles. Stations are built when first opened. Everything works without WebGL.
 */
export function initLab(root: HTMLElement, api: LabApi) {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>(".lb-stations [data-station]")];
  const panels: Record<StationId, HTMLElement> = {
    bench: root.querySelector<HTMLElement>("#lb-bench")!,
    ritual: root.querySelector<HTMLElement>("#lb-ritual")!,
    fabrics: root.querySelector<HTMLElement>("#lb-fabrics")!,
  };
  root.querySelector<HTMLElement>(".lb-title")!.textContent = LAB_NAME;
  root.querySelector<HTMLElement>(".lb-lead")!.textContent = LAB_LEAD;
  root.querySelector<HTMLElement>(".lb-notice")!.textContent = LAB_NOTICE;

  const bench = initBench(root.querySelector<HTMLElement>(".lb-bench")!, api);
  const fabrics = initFabrics(root.querySelector<HTMLElement>(".lb-fabrics")!, api);
  let ritual: ReturnType<typeof initRitual> | null = null;
  mountSlots(root);
  let current: StationId = "bench";
  let active = false;

  function show(id: StationId, focusTab = false) {
    current = id;
    for (const t of tabs) {
      const on = t.dataset.station === id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focusTab) t.focus();
    }
    for (const k of ORDER) panels[k].hidden = k !== id;
    if (id === "ritual") {
      // the ritual room is built when first visible: its SVG needs a real size
      ritual ??= initRitual(root.querySelector<HTMLElement>("#lb-ritual")!, { reduceMotion: api.reduceMotion, openClaim: api.openClaim });
      if (active) ritual.start();
    } else ritual?.stop();
    if (id !== "fabrics") fabrics.stop(); else if (active) fabrics.start();
  }

  tabs.forEach((t) => t.addEventListener("click", () => show(t.dataset.station as StationId)));
  root.querySelector(".lb-stations")!.addEventListener("keydown", (e) => {
    const k = (e as KeyboardEvent).key;
    if (k !== "ArrowRight" && k !== "ArrowLeft" && k !== "Home" && k !== "End") return;
    e.preventDefault();
    const i = ORDER.indexOf(current);
    const next = k === "Home" ? 0 : k === "End" ? ORDER.length - 1 : (i + (k === "ArrowRight" ? 1 : -1) + ORDER.length) % ORDER.length;
    show(ORDER[next], true);
  });

  return {
    start(station?: StationId, recipe?: string) {
      active = true;
      show(station ?? current);
      if (recipe) bench.open(recipe);
    },
    stop() { active = false; ritual?.stop(); fabrics.stop(); bench.stop(); },
  };
}
