# Bildliste (Asset-Liste) für THE SOURCE CODES

Die Landingpage-Vorschauen (`design/mockups/`) sind **nur Layout-Vorlagen**. Die einzelnen Bilder werden separat erzeugt.
Diese Liste sagt, was gebraucht wird, in welcher Reihenfolge, in welcher Größe und mit welchem Prompt.

## Gemeinsame Regeln für alle Bilder
- **Kein Text, keine Logos, keine Wasserzeichen, keine Oberflächen-Elemente (Buttons, Panels, „Verified“-Stempel) im Bild.** Alles
  Geschriebene baut der Code.
- **Bildstil (Style Anchor), an jeden Prompt anhängen:**
  `cinematic, ultra detailed, deep space navy background (#02070B), antique gold (#CBAA67) and electric cyan (#58D6E8) light,
  soft volumetric glow, scientific documentary look, elegant, calm, no text, no watermark, no logo`
- **Einheitlicher Look:** Wenn dein Werkzeug Style-/Referenzbilder erlaubt (Midjourney `--sref`, Higgsfield/Firefly Style-Reference),
  gib immer dieselbe Vorschau aus `design/mockups` mit.
- **Leuchtende Motive auf reinem Schwarz erzeugen** (`on a pure black background`). Der Code legt sie mit „Screen“-Überblendung
  über die Szene, dann ist keine Transparenz nötig und der Rand sieht weich aus.
- **Format:** PNG oder JPG in höchster Qualität des Werkzeugs; die Optimierung (WebP/AVIF, mehrere Größen) macht das Projekt.
  Original-Dateien bleiben lokal in `design/assets-raw/` (Git ignoriert sie); optimierte Fassungen landen in `public/assets/`.
- **Herkunft festhalten:** Pro Bild Werkzeug, Prompt und Datum in `public/assets/CREDITS.md` eintragen. Künstlich erzeugte Bilder von
  realen Orten (Giza, Machu Picchu …) als „Illustration“ kennzeichnen; für reale Orte sind eigene Fotos oder frei lizenzierte
  Fotos (z. B. Wikimedia Commons, Unsplash-Lizenz) ehrlicher und oft besser.
- **Keine erkennbaren realen lebenden Personen** abbilden.

## Priorität 1 – Hero (zuerst, damit man die Wirkung sieht)
| Datei | Größe | Hintergrund | Prompt-Kern |
|---|---|---|---|
| `hero-world` | 3840×2160 | – | wide cinematic night landscape, layered misty mountains, ancient temple with columns on the far left, pyramid and desert dunes on the far right, waterfall valley, deep starry sky with planets and soft nebula, large calm dark area on the left 40 percent for text, empty space in the right center for a figure, no people |
| `hero-figure` | 2400×3000 | reines Schwarz | translucent glass-like human bust, head in profile facing left, visible inner neural network and brain, golden nerve lines flowing through neck and chest, lotus flowers growing from the head, small luminous tree inside the chest, scientific hologram, glowing, on a pure black background |
| `hero-planets` | 2400×1600 | reines Schwarz | four separate detailed planets and moons with atmosphere glow, different sizes, wide spacing, on a pure black background |
| `hero-dna` | 1200×2400 | reines Schwarz | glowing double helix DNA strand, gold and cyan, vertical, elegant, on a pure black background |
| `hero-lotus` | 1600×1600 | reines Schwarz | cluster of glowing luminous lotus flowers in pink and amber, on a pure black background |
| `hero-bokeh` | 3840×2160 | reines Schwarz | floating golden dust particles and soft bokeh lights, sparse, dark, on a pure black background |
| `hero-mobile` | 1080×1920 | – | portrait version: same figure and world, figure in upper half, dark calm area in lower half for text |

## Priorität 2 – Wissens-Matrix (6 Bilder, Querformat 1200×800)
| Datei | Motiv |
|---|---|
| `matrix-quantum-battery` | glowing cell membrane with energy field and molecular antenna, blue-violet light |
| `matrix-grounding` | meditating silhouette connected to the earth by glowing roots of light, calm blue |
| `matrix-resonance-sites` | ancient pyramid and temple with glowing geometric lines of light over the landscape |
| `matrix-frequency-apothecary` | glowing lotus flowers, sound waves and light beams, apothecary mood |
| `matrix-organ-nature` | translucent human torso with a green leaf in the heart area, plants growing through it |
| `matrix-center-emblem` | luminous golden infinity sign inside concentric geometric rings, on a pure black background (ohne Schrift) |

## Priorität 3 – Menschlicher Körper & Pflanzen
| Datei | Größe | Motiv |
|---|---|---|
| `body-front` | 2400×3600 | translucent human body, front view, anatomical, glowing blue, organs faintly visible, black background |
| `organ-heart` `organ-brain` `organ-lungs` `organ-liver` `organ-stomach` `organ-intestines` `organ-kidneys` `organ-skin` `organ-immune` `organ-endocrine` | je 1600×1600 | one anatomical organ, realistic but translucent and softly glowing, black background (für „Immune“ und „Endocrine“: Zellen bzw. Drüsen im Überblick) |
| `heart-botanical` | 2000×2400 | anatomical heart whose vessels grow into botanical plants and flowers, glowing, black background |
| `plant-hawthorn` `plant-garlic` `plant-cacao` | je 1000×1000 | one botanical subject, scientific botanical illustration meets glowing light, black background |

## Priorität 4 – Orte der Resonanz
| Datei | Größe | Motiv |
|---|---|---|
| `globe-earth` | 3000×3000 | holographic Earth globe with glowing network lines connecting glowing points, black background |
| `site-giza` `site-machu-picchu` `site-angkor-wat` `site-goebekli-tepe` `site-malta-hypogeum` `site-stonehenge` | je 1600×1000 | ancient site at dusk, dramatic light (besser: freie Fotos; sonst als Illustration kennzeichnen) |
| `site-istanbul-mosque-dome` | 1600×1000 | Ottoman mosque dome interior, golden light, geometric patterns (Süleymaniye/Selimiye als Anregung, ohne Personen) |
| `diagram-dome-acoustics` | 1600×1600 | cross-section of a dome with sound waves, blueprint style, gold lines, black background |
| `cymatics-1` `cymatics-2` `cymatics-3` | je 1600×1600 | cymatic sand/water pattern, sacred geometry, glowing, black background |

## Priorität 5 – Frequenz-Labor & Nahrung
| Datei | Größe | Motiv |
|---|---|---|
| `lab-waveform-bg` | 3840×1000 | wide glowing sine waves in cyan and gold, black background |
| `food-organ-signatures` | 1400×900 | pomegranate and a heart shape side by side, glowing, dark background |
| `food-nutrients-compounds` | 1400×900 | molecular structure with a mushroom and herbs, glowing network |
| `food-diy-lab` | 1400×900 | glass flasks, herbs and light in a dark laboratory |
| `food-recipes-protocols` | 1400×900 | bowls of vegetables, herbs and spices, warm dark styling |
| `food-plants-herbs` | 1400×900 | bundles of medicinal herbs and flowers, dark atmospheric |

## Priorität 6 – „Geheimes Wissen“ (Hintergrundebene, nur 3–12 % sichtbar)
Hier besser **echte gemeinfreie Scans** statt erzeugter Bilder: alte Karten, Sternkarten, botanische Tafeln, anatomische Skizzen,
historische Patentzeichnungen, Architekturpläne. Quellen: Wikimedia Commons, Biodiversity Heritage Library, Rijksmuseum,
David Rumsey Map Collection, Google Patents. Pro Bild Quelle und Lizenz in `CREDITS.md`. (Claude kann beim Suchen helfen.)

## Reihenfolge und Kosten
Insgesamt rund 45 Bilder. Starte mit Priorität 1 (7 Bilder) und sieh dir an, wie die Seite damit wirkt, bevor du den Rest erzeugst.
Bildgenerierung kostet je nach Werkzeug Guthaben; Claude erzeugt keine Bilder ohne ausdrückliche Rückfrage.
