# v2-design plan

Goal: rebuild the site in real code from the finished design images, keeping the evidence system.

## Keep (the content core)
`content/`, `src/data/` (types, validation), `scripts/`, `docs/`, `CONTENT.md`, review sheets.

## Replace
`src/gl/*` (procedural scenes), `src/style.css`, `index.html`, `src/ui/*` – rebuilt page by page after the mockups.

## Method
1. Landing-page previews go to `design/mockups/` (layout reference only, local only, never deployed). They are NOT image sources.
   The individual artwork is generated separately; see `docs/ASSET-LIST.md` (priority 1 = hero).
2. For each page: read layout, spacing, colours, type from the mockup; build text, buttons, navigation, overlays as real HTML/CSS.
3. As generated images arrive: originals in `design/assets-raw/` (ignored), optimised WebP/AVIF in `public/assets/`, credits in `public/assets/CREDITS.md`. Until an image exists the procedural scene stays as fallback.
4. Layer for depth: background / figure / foreground move at different speeds; WebGL particles, pins and camera moves stay on top.
5. Replace invented numbers, stamps and fake references with real data from `content/`.
6. Check each page in the browser (desktop + phone), then merge `v2-design` into `main`.

## Fallback
`git checkout v1-procedural` (branch) restores the procedural version.
