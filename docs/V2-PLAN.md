# v2-design plan

Goal: rebuild the site in real code from the finished design images, keeping the evidence system.

## Keep (the content core)
`content/`, `src/data/` (types, validation), `scripts/`, `docs/`, `CONTENT.md`, review sheets.

## Replace
`src/gl/*` (procedural scenes), `src/style.css`, `index.html`, `src/ui/*` – rebuilt page by page after the mockups.

## Method
1. Mockups go to `design/mockups/` (reference only, never deployed).
2. For each page: read layout, spacing, colours, type from the mockup; build text, buttons, navigation, overlays as real HTML/CSS.
3. Cut art (hero scene, planets, card images, backgrounds) out of the mockup, optimise to WebP/AVIF, place in `public/assets/`.
4. Layer for depth: background / figure / foreground move at different speeds; WebGL particles, pins and camera moves stay on top.
5. Replace invented numbers, stamps and fake references with real data from `content/`.
6. Check each page in the browser (desktop + phone), then merge `v2-design` into `main`.

## Fallback
`git checkout v1-procedural` (branch) restores the procedural version.
