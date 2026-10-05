# Design system & implementation notes

Reference: `public/references/source-codes-master.png` (development only; removed from production builds by `vite.config.ts`).

## Repository audit (start of phase 1)
Vanilla TypeScript + Vite, Three.js, GSAP. No React. The brief allows R3F/Drei "if compatible"; it would mean a rewrite of working
scenes, so the existing stack was kept. Data lives in `content/` (JSON), validated by `npm run validate:data`.

## Reference analysis
- Palette: deep space navy, antique gold for lines/CTAs, electric cyan for light and data, ivory type.
- Hero: left-aligned title block (gold eyebrow, serif title, letter-spaced subline, pillars, two CTAs, stats). Right: a translucent
  human (head in profile, torso frontal) with brain network, lotus, DNA, a tree in the chest; behind it planets, mountains, ancient architecture.
- Top-right glass "Proof overlay" with tabs, thumbnail card, status badge and "View full reference".
- Typography: classical serif for titles (Cinzel / Cormorant Garamond), small Inter UI text, uppercase labels with wide tracking.

## Tokens (`src/style.css`)
| token | value |
|---|---|
| `--bg` | `#02070B` |
| `--navy` | `#06131A` |
| `--panel` | `rgba(5,18,25,.78)` |
| `--gold` / `--gold-hi` | `#CBAA67` / `#F0D18B` |
| `--cyan` / `--cyan-deep` | `#58D6E8` / `#147A91` |
| `--ivory` / `--muted` | `#ECE8DE` / `#93A7AE` |

Fonts are self-hosted via `@fontsource` (no requests to Google; GDPR-friendly).

## Deliberate deviations from the reference
- No fabricated numbers: the reference shows "10,000+ Verified References", "+35 % coherence", a "VERIFIED" fake study. The hero
  stats are computed from the real data (claims, sources, checked sources, atlas entries).
- No `thesourcecodes.io` line until the domain exists.
- "Watch manifesto" became "Manifesto" (a text panel) – there is no video.
- No Sign in / Join the Archive – there is no backend. Maps / Tools / Research are marked "soon".
- The hero is procedural (no photographs). Photographic worlds need licensed or own assets; see "Next".

## Phase status
1. Design system, navigation, hero universe + intro (~3 s), knowledge search, proof overlay, hero→universe transition: **done**.
2. Knowledge matrix: the universe view exists (galaxies, camera flights, themed stages); hover-highlighting of related links is still open.
3. Human organs section, 4. sacred geography globe, 5. frequency lab (Web Audio), 6. food/plant preview, 7. mobile/performance/a11y polish: **open**.

## Hero options
`/?hero=classic` loads the original particle hero.

## Next
- Language: the new homepage is English (as in the brief); universe, atlas and stages are still German. Decide on an EN/DE switch.
- Assets: real imagery (public-domain maps, manuscripts, botanical plates) or generated artwork for the 3–12 % "secret knowledge" background layer.
- Performance: measured on a real GPU, lazy-load the universe/atlas bundles (three.js is ~650 kB minified).
