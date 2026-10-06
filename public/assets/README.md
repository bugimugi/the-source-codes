# public/assets

Optimised images used by the website (WebP/AVIF, several sizes). Do not put full-size originals here – they go to
`design/assets-raw/` (ignored by Git). Every file needs an entry in `CREDITS.md` (tool, prompt, date, licence).
List of planned images: `docs/ASSET-LIST.md`.

## Naming (slots pick files up automatically)
Name = slot name from `src/assets/registry.ts` (same as `docs/ASSET-LIST.md`), e.g. `hero-figure.webp`, `hero-figure.avif`.
Width variants: `hero-figure-1200.webp`, `hero-figure-2400.webp` (become a srcset). Formats: avif, webp, jpg, png.
Restart is not needed in dev: the page reloads when a file appears. Markup: `<div data-slot="hero-figure"></div>`.

## From original to optimised file
Put the originals in `design/assets-raw/` (file name = slot name, e.g. `hero-world.png`), then run `npm run assets:optimize`.
It writes `<name>-<width>.webp` variants here, adds the credit row and warns about wrong aspect ratio or a non-black
background on "black" motifs. Options: `-- --only hero-world,hero-figure`, `-- --force`, `-- --avif`.
