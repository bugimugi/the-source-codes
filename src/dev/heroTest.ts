/**
 * Entwicklungs-Hilfe (nur `npm run dev`, nur mit `?herotest` in der Adresse, also http://localhost:5173/?herotest):
 * legt die Bilder aus `public-hero-tests/` nacheinander als Hintergrund hinter den Hero der Startseite.
 * Pfeil rechts/links wechselt (im Kreis), Esc zeigt den bisherigen Hero, Pfeiltaste bringt die Testbilder zurück.
 * Der Aufruf in src/main.ts steht hinter `import.meta.env.DEV`, die fertige Seite enthält davon nichts.
 */
const files = import.meta.glob<string>("/public-hero-tests/*.{png,jpg,jpeg,webp,avif}", { eager: true, query: "?url", import: "default" });
const list = Object.entries(files)
  .map(([path, url]) => ({ name: decodeURIComponent(path.split("/").pop() ?? path), url }))
  .sort((a, b) => a.name.localeCompare(b.name, "de", { numeric: true }));

const section = document.getElementById("top");
const layers = section?.querySelector<HTMLElement>(".hero-layers");

if (section && layers) {
  const cap = document.createElement("div");
  cap.style.cssText = "position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:9999;padding:.42rem .9rem;border:1px solid rgba(203,170,103,.5);border-radius:99px;background:rgba(2,7,11,.86);color:#ECE8DE;font:12px/1.3 Inter,system-ui,sans-serif;letter-spacing:.04em;pointer-events:none;white-space:nowrap;max-width:94vw;overflow:hidden;text-overflow:ellipsis";
  document.body.append(cap);

  if (!list.length) {
    cap.textContent = "Keine Bilder in public-hero-tests/ gefunden";
  } else {
    // two stacked layers, so the pictures fade into each other; same place and level as the real hero layers (the veil, text and buttons stay above)
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:absolute;inset:0;z-index:0;overflow:hidden;background:#02070B";
    const mk = () => {
      const d = document.createElement("div");
      d.style.cssText = "position:absolute;inset:0;background-size:cover;background-position:center 40%;opacity:0;transition:opacity .45s ease";
      return d;
    };
    const a = mk(), b = mk();
    wrap.append(a, b);
    layers.after(wrap);

    let i = 0, front = a, original = false, token = 0;
    const text = () => (original ? "Original-Hero · ← → zeigt wieder die Testbilder" : `Bild ${i + 1} von ${list.length} · ${list[i].name} · ← → wechseln · Esc = Original-Hero`);
    const show = (n: number) => {
      i = (n + list.length) % list.length;
      original = false;
      layers.style.visibility = "hidden";
      wrap.style.display = "";
      const my = ++token, back = front === a ? b : a, img = new Image();
      img.onload = () => {
        if (my !== token) return;
        back.style.backgroundImage = `url("${img.src}")`;
        back.style.opacity = "1";
        front.style.opacity = "0";
        front = back;
      };
      img.src = list[i].url;
      cap.textContent = text();
      for (const k of [i + 1, i - 1]) new Image().src = list[(k + list.length) % list.length].url; // preload the neighbours
    };
    addEventListener("keydown", (e) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (document.documentElement.classList.contains("lock")) return; // another page is open
      if (e.key === "ArrowRight") { e.preventDefault(); show(original ? i : i + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); show(original ? i : i - 1); }
      else if (e.key === "Escape" && !original) { original = true; layers.style.visibility = ""; wrap.style.display = "none"; cap.textContent = text(); }
    });
    show(0);
  }
}
