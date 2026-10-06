# Bildliste (Asset-Liste) für THE SOURCE CODES

**Automatisch erzeugt** aus `src/assets/registry.ts` (`npm run assets:list`). Dort stehen Name, Format und Prompt-Kern jedes Bildes.
Die Landingpage-Vorschauen (`public/references`, lokal) sind nur Layout-Vorlagen; die einzelnen Bilder werden separat erzeugt.

## Gemeinsame Regeln
- **Kein Text, keine Logos, keine Wasserzeichen, keine Oberflächen-Elemente (Buttons, Panels, „Verified“-Stempel) im Bild.** Alles Geschriebene baut der Code.
- **Stil-Zusatz an jeden Prompt anhängen:** `cinematic, ultra detailed, deep space navy background (#02070B), antique gold (#CBAA67) and electric cyan (#58D6E8) light, soft volumetric glow, scientific documentary look, elegant, calm, no text, no watermark, no logo`
- **Einheitlicher Look:** Wenn dein Werkzeug Style-Referenzen erlaubt, gib immer dieselbe Vorschau mit (Midjourney `--sref`, Firefly/Higgsfield Style-Reference).
- **Typ „Schwarz“:** Leuchtendes Motiv auf **reinem Schwarz** erzeugen. Der Code legt es mit „Screen“-Überblendung über die Szene (keine Transparenz nötig).
- **Typ „Szene“:** Vollständiges, deckendes Bild.
- **Format:** Seitenverhältnis wie in der Tabelle (Pixelgröße = Zielgröße, größer ist in Ordnung). PNG/JPG in bester Qualität.
- **Ablage:** Originale in `design/assets-raw/` (bleibt lokal), Dateiname = Name aus der Tabelle (z. B. `hero-world.png`). Dann `npm run assets:optimize` ausführen: es erzeugt verkleinerte WebP-Dateien in `public/assets/` (mehrere Breiten), trägt die Herkunft in `CREDITS.md` ein und warnt bei falschem Format oder nicht schwarzem Hintergrund. Sobald eine Datei dort liegt, wird sie automatisch verwendet.
- **Herkunft:** Pro Bild Werkzeug, Prompt und Datum in `public/assets/CREDITS.md`. Erzeugte Bilder realer Orte als „Illustration“ kennzeichnen; für reale Orte sind eigene oder frei lizenzierte Fotos besser.
- Keine erkennbaren realen lebenden Personen.

## Priorität 1 – Hero (zuerst)

| Datei | Größe | Typ | Prompt-Kern |
|---|---|---|---|
| `hero-world` | 3840×2160 | Szene | wide cinematic night landscape, ancient temple city and dense jungle with a waterfall on the far left, pyramids and misty mountains on the far right, deep starry sky with planets, large calm dark area on the left 40 percent for text, empty space in the right center for a figure, no people |
| `hero-figure` | 2400×3000 | Schwarz | profile of a serene woman with a crown of lush plants and flowers, beside a translucent glowing human body hologram with visible organs, neural pathways and a DNA helix, scientific hologram, on a pure black background |
| `hero-planets` | 2400×1600 | Schwarz | four separate detailed planets and moons with atmosphere glow, different sizes, wide spacing, on a pure black background |
| `hero-dna` | 1200×2400 | Schwarz | glowing double helix DNA strand, gold and cyan, vertical, elegant, on a pure black background |
| `hero-lotus` | 1600×1600 | Schwarz | cluster of glowing luminous lotus and tropical flowers in pink and amber, on a pure black background |
| `hero-bokeh` | 3840×2160 | Schwarz | floating golden dust particles and soft bokeh lights, sparse, dark, on a pure black background |
| `hero-mobile` | 1080×1920 | Szene | portrait version: same figure and world, figure in the upper half, dark calm area in the lower half for text |

## Priorität 2 – Wissensmatrix-Kacheln

| Datei | Größe | Typ | Prompt-Kern |
|---|---|---|---|
| `tile-pflanzen` | 1000×1200 | Szene | lush green medicinal plant with large leaves and small flowers, glowing, dark background |
| `tile-baeume` | 1000×1200 | Szene | ancient majestic tree with wide crown at dusk, golden light, dark background |
| `tile-gemuese-obst` | 1000×1200 | Szene | colourful arrangement of fresh fruit and vegetables, rich colours, dark background |
| `tile-pilze` | 1000×1200 | Szene | cluster of medicinal mushrooms on moss, soft glow, dark forest background |
| `tile-mineralien` | 1000×1200 | Szene | raw mineral crystals in blue and white with fine facets, glowing, dark background |
| `tile-kristalle` | 1000×1200 | Szene | large amethyst crystal cluster in violet, glowing, dark background |
| `tile-koerper` | 1000×1200 | Szene | translucent human torso with glowing organs, blue and orange, dark background |
| `tile-naehrstoffe` | 1000×1200 | Szene | glowing spheres in different colours representing vitamins and minerals, molecular look, dark background |
| `tile-krankheiten` | 1000×1200 | Szene | human silhouette with glowing red and blue signal lines, scientific, dark background |
| `tile-atem` | 1000×1200 | Szene | person meditating in lotus pose with soft light rays, dark background |
| `tile-frequenzen` | 1000×1200 | Szene | glowing concentric sound waves and geometric ripples in violet and blue, dark background |
| `tile-geometrie` | 1000×1200 | Szene | golden flower of life sacred geometry, glowing lines, dark background |
| `tile-chakren` | 1000×1200 | Szene | meditating figure with seven glowing colourful energy centres along the spine, dark background |
| `tile-kulturen` | 1000×1200 | Szene | ancient Egyptian pyramids and temple at golden hour, dramatic sky |
| `tile-orte` | 1000×1200 | Szene | ancient standing stones at dusk, dramatic sky, mystic atmosphere |
| `tile-lab` | 1000×1200 | Szene | glass laboratory flasks with a seedling and glowing liquid, dark background |

## Priorität 3 – Startseiten-Abschnitte

| Datei | Größe | Typ | Prompt-Kern |
|---|---|---|---|
| `body-front` | 2400×3600 | Schwarz | translucent human body, front view, anatomical, glowing blue with organs visible in red and orange, on a pure black background |
| `nutrient-ashwagandha` | 800×800 | Schwarz | ashwagandha root and green leaves, glowing, on a pure black background |
| `nutrient-kurkuma` | 800×800 | Schwarz | fresh turmeric roots and powder, warm orange glow, on a pure black background |
| `nutrient-ingwer` | 800×800 | Schwarz | fresh ginger root pieces, warm glow, on a pure black background |
| `nutrient-knoblauch` | 800×800 | Schwarz | garlic bulbs and cloves, soft glow, on a pure black background |
| `nutrient-gruener-tee` | 800×800 | Schwarz | green tea leaves, fresh and glowing, on a pure black background |
| `nutrient-magnesium` | 800×800 | Schwarz | glowing blue molecule sphere with orbiting dots, on a pure black background |
| `nutrient-omega3` | 800×800 | Schwarz | golden drops of oil with a nut, glowing, on a pure black background |
| `nutrient-vitamin-d` | 800×800 | Schwarz | glowing sun symbol over a drop, warm gold, on a pure black background |
| `condition-bg` | 1600×900 | Szene | profile of a calm young woman with a glowing network of light around her head, dark background, space on the right |
| `freq-orb` | 1200×1200 | Schwarz | glowing violet sacred geometry sphere with a meditating silhouette in front, on a pure black background |
| `band-geometrie` | 1800×600 | Szene | golden flower of life geometry glowing on a dark background, space on the left for text |
| `band-kulturen` | 1800×600 | Szene | ancient pyramids and temple ruins at golden hour, space on the left for text |
| `band-orte` | 1800×600 | Szene | sacred mountain site with ancient terraces in mist, space on the left for text |
| `diy-extrakte` | 800×1000 | Szene | glass bottles with plant extracts and herbs on a dark wooden table |
| `diy-wasser` | 800×1000 | Szene | glowing structured water in a glass with a swirling vortex, dark background |
| `diy-raeuchern` | 800×1000 | Szene | smoking incense bowl with herbs, atmospheric, dark background |
| `diy-mikroskop` | 800×1000 | Szene | antique microscope with warm light, dark background |
| `library-bg` | 1800×900 | Szene | old library with tall shelves and an open ancient book in warm light, space on the left for text |
| `connected-earth` | 1800×900 | Szene | Earth from space with a glowing network of connections across continents, dark space |

## Priorität 4 – Körper-Seite

| Datei | Größe | Typ | Prompt-Kern |
|---|---|---|---|
| `organ-heart` | 1600×1600 | Schwarz | one anatomical human heart, realistic but translucent and softly glowing, on a pure black background |
| `organ-brain` | 1600×1600 | Schwarz | one anatomical human brain, realistic but translucent and softly glowing, on a pure black background |
| `organ-lungs` | 1600×1600 | Schwarz | anatomical human lungs, translucent and softly glowing, on a pure black background |
| `organ-liver` | 1600×1600 | Schwarz | anatomical human liver, translucent and softly glowing, on a pure black background |
| `organ-stomach` | 1600×1600 | Schwarz | anatomical human stomach, translucent and softly glowing, on a pure black background |
| `organ-intestines` | 1600×1600 | Schwarz | anatomical human intestines, translucent and softly glowing, on a pure black background |
| `organ-kidneys` | 1600×1600 | Schwarz | anatomical human kidneys, translucent and softly glowing, on a pure black background |
| `organ-skin` | 1600×1600 | Schwarz | cross-section of human skin layers, translucent and softly glowing, on a pure black background |
| `organ-immune` | 1600×1600 | Schwarz | immune cells and lymph network, translucent and glowing, on a pure black background |
| `organ-endocrine` | 1600×1600 | Schwarz | endocrine glands (pituitary, thyroid) as glowing anatomical illustration, on a pure black background |
| `heart-botanical` | 2000×2400 | Schwarz | anatomical heart whose vessels grow into botanical plants and flowers, glowing, on a pure black background |

## Priorität 5 – Orte und Frequenzen

| Datei | Größe | Typ | Prompt-Kern |
|---|---|---|---|
| `globe-earth` | 3000×3000 | Schwarz | holographic Earth globe with glowing network lines connecting glowing points, on a pure black background |
| `site-giza` | 1600×1000 | Szene | Giza pyramids at dusk, dramatic light (better: own or freely licensed photo) |
| `site-machu-picchu` | 1600×1000 | Szene | Machu Picchu in morning mist (better: own or freely licensed photo) |
| `site-angkor-wat` | 1600×1000 | Szene | Angkor Wat at sunrise (better: own or freely licensed photo) |
| `site-goebekli-tepe` | 1600×1000 | Szene | Göbekli Tepe stone pillars (better: own or freely licensed photo) |
| `site-malta-hypogeum` | 1600×1000 | Szene | carved chamber of the Hypogeum of Malta, warm light |
| `site-stonehenge` | 1600×1000 | Szene | Stonehenge at dusk (better: own or freely licensed photo) |
| `site-istanbul-mosque-dome` | 1600×1000 | Szene | Ottoman mosque dome interior with golden light and geometric patterns, no people |
| `diagram-dome-acoustics` | 1600×1600 | Schwarz | cross-section of a dome with sound waves, blueprint style, gold lines, on a pure black background |
| `cymatics-1` | 1600×1600 | Schwarz | cymatic sand pattern, sacred geometry, glowing, on a pure black background |
| `cymatics-2` | 1600×1600 | Schwarz | cymatic water pattern, concentric symmetry, glowing, on a pure black background |
| `cymatics-3` | 1600×1600 | Schwarz | cymatic membrane pattern with fine nodal lines, glowing, on a pure black background |
| `lab-waveform-bg` | 3840×1000 | Schwarz | wide glowing sine waves in cyan and gold, on a pure black background |

## Atlas-Einträge (ein Bild pro Eintrag)

Name `atlas-<id>`, 1000×1000, Typ Schwarz. Prompt-Kern: one botanical or mineral subject, scientific illustration meets glowing light, on a pure black background. Das Motiv steht im Prompt-Kern jeweils zuerst.

| Datei | Motiv |
|---|---|
| `atlas-amethyst` | Amethyst (Quarz (violette Varietät)) |
| `atlas-apfel` | Apfel (Malus domestica) |
| `atlas-brennnessel` | Große Brennnessel (Urtica dioica) |
| `atlas-citrin` | Citrin (Quarz (gelbe Varietät)) |
| `atlas-fluorit` | Fluorit (Fluorit) |
| `atlas-granat` | Granat (Granat (Mineralgruppe)) |
| `atlas-ingwer` | Ingwer (Zingiber officinale) |
| `atlas-kamille` | Echte Kamille (Matricaria chamomilla) |
| `atlas-karotte` | Karotte (Daucus carota subsp. sativus) |
| `atlas-lapislazuli` | Lapislazuli (Gestein aus Lazurit u. a.) |
| `atlas-lavendel` | Echter Lavendel (Lavandula angustifolia) |
| `atlas-malachit` | Malachit (Malachit) |
| `atlas-obsidian` | Obsidian (Vulkanisches Glas) |
| `atlas-pfefferminze` | Pfefferminze (Mentha × piperita) |
| `atlas-pyrit` | Pyrit (Pyrit) |
| `atlas-quarz` | Bergkristall (Quarz) (Quarz) |
| `atlas-ringelblume` | Ringelblume (Calendula officinalis) |
| `atlas-tomate` | Tomate (Solanum lycopersicum) |
| `atlas-turmalin` | Schwarzer Turmalin (Schörl) (Turmalin-Gruppe (Schörl)) |
| `atlas-walnuss` | Walnuss (Juglans regia) |
| `atlas-weide` | Silberweide (Salix alba) |

Insgesamt 88 Bilder. Starte mit Priorität 1 und prüfe zuerst **ein** Bild auf den Stil, bevor du den Rest erzeugst. Claude erzeugt keine Bilder.
