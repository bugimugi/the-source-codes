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
| `tile-lab` | 1000×1200 | Szene | dramatic collage of the earth's natural energy: a bright sun above a lightning storm, a waterfall and wind turbines, dark background |

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

## Priorität 6 – Alte Kulturen

| Datei | Größe | Typ | Prompt-Kern |
|---|---|---|---|
| `cult-hero` | 3200×1500 | Szene | ancient world panorama at sunset, pyramids and a river valley in the distance, a carved stone wall at the right edge, a hooded wanderer seen from behind on the left, dark calm area on the left for text |
| `cult-01` | 1800×700 | Szene | Göbekli Tepe at golden hour, circle of large T-shaped limestone pillars with animal reliefs, wide landscape, no people |
| `cult-02` | 1800×700 | Szene | Stonehenge and a passage tomb at dusk with a low sun, early Neolithic landscape, no people |
| `cult-03` | 1800×700 | Szene | Giza pyramids and the Sphinx at sunset, warm desert light, no people |
| `cult-04` | 1800×700 | Szene | Mesopotamian ziggurat beside a river at dusk, mud-brick city, clay tablets in the foreground, no people |
| `cult-05` | 1800×700 | Szene | Indus Valley city of Mohenjo-daro, brick streets and the Great Bath at evening, no people |
| `cult-06` | 1800×700 | Szene | ancient Chinese landscape with a pagoda, terracotta warriors in rows and misty mountains, no real people |
| `cult-07` | 1800×700 | Szene | Maya step pyramid in the jungle at sunrise, stone relief of a calendar in the foreground, no people |
| `cult-08` | 1800×700 | Szene | Petra Treasury carved in rose-red rock with a Roman aqueduct and Inca stone walls blended into one dusk scene, no people |
| `cult-theme-architektur` | 600×600 | Szene | monumental ancient stone architecture, pyramids and temple columns, warm light |
| `cult-theme-technologie` | 600×600 | Szene | ancient bronze gear mechanism like the Antikythera device, close-up, warm light |
| `cult-theme-spiritualitaet` | 600×600 | Szene | ancient temple interior with candle light and carved reliefs, no people |
| `cult-theme-astronomie` | 600×600 | Szene | ancient stone observatory under a starry sky with a bright planet, no people |
| `cult-theme-gesellschaft` | 600×600 | Szene | ancient market city street from above at dusk, clay houses, no recognisable faces |
| `cult-theme-artefakte` | 600×600 | Szene | clay tablet with cuneiform and a carved stone seal on dark cloth, close-up |
| `cult-theme-mythen` | 600×600 | Szene | winged guardian relief of ancient Mesopotamia, glowing gold on dark stone |
| `cult-theme-verborgenes` | 600×600 | Szene | narrow ancient stone passage leading to a lit chamber, mysterious, no people |

## Priorität 7 – Freie Energie der Erde

| Datei | Größe | Typ | Prompt-Kern |
|---|---|---|---|
| `energy-hero` | 3200×1400 | Szene | epic panorama of earth's natural energies: bright sun and aurora over mountains, a thunderstorm with lightning at the right, a waterfall and river on the left, wind turbines, a small volcano, dark calm area on the left for text, no people |
| `energy-src-sonne` | 700×540 | Szene | radiant sun over a landscape with solar panels at golden hour |
| `energy-src-blitz` | 700×540 | Szene | violet lightning storm over dark clouds |
| `energy-src-wasser` | 700×540 | Szene | powerful waterfall in a green valley |
| `energy-src-meer` | 700×540 | Szene | huge turquoise ocean wave curling, backlit |
| `energy-src-wind` | 700×540 | Szene | wind turbines on a hill in dramatic evening light |
| `energy-src-geothermie` | 700×540 | Szene | erupting volcano with glowing lava at dusk |
| `energy-src-magnetfeld` | 700×540 | Szene | earth from space with glowing blue magnetic field lines and aurora |
| `energy-topic-atmosphaere` | 1200×700 | Szene | earth atmosphere seen from the side with layered blue bands and a starry sky above, curved horizon |
| `energy-topic-gewitter` | 1200×700 | Szene | huge supercell thundercloud with branching lightning bolts over a plain |
| `energy-topic-wasserkreislauf` | 1200×700 | Szene | waterfall and river valley with clouds forming above, water cycle atmosphere |
| `energy-topic-elektrokultur` | 1200×700 | Szene | cross-section of garden soil with plant roots and a copper spiral coil, glowing fine lines |
| `energy-topic-erdrotation` | 1200×700 | Szene | planet earth with glowing blue magnetic field lines, seen from space |
| `energy-topic-erdung` | 1200×700 | Szene | bare feet standing on green grass and soil, soft morning light, close-up, subtle glowing lines in the ground |
| `energy-topic-schmuck` | 1200×700 | Szene | gold, silver and copper bracelets and gemstone rings on dark cloth, warm light, no hands |
| `energy-topic-tesla` | 1200×700 | Szene | tall early-1900s transmission tower with a large dome and blue electric discharge at dusk, no people |

## Priorität 8 – Pflanzenatlas und Pflanzenprofil (Ashwagandha ist die vollständige Vorlage)

| Datei | Größe | Typ | Prompt-Kern |
|---|---|---|---|
| `plants-hero` | 2800×1300 | Szene | dark moody botanical still life: an open antique herbal book with pressed plant illustrations, a glass dropper bottle, a mortar, dried herbs, a stack of old leather books with gold lettering, lush green leaves and violet flowers framing the right side, warm candle light, calm dark area on the left for text, no people |
| `plants-cat-kraeuter` | 1000×1200 | Szene | fresh green medicinal herbs, rosemary sage and mint, painterly botanical, dark background |
| `plants-cat-blueten` | 1000×1200 | Szene | pink and violet fragrant flowers in bloom, soft glow, dark background |
| `plants-cat-gewuerze` | 1000×1200 | Szene | ginger root, turmeric and cinnamon sticks with whole spices, warm light, dark background |
| `plants-cat-fruechte` | 1000×1200 | Szene | a halved pomegranate with glowing seeds and other fruits, rich red, dark background |
| `plants-cat-gemuese` | 1000×1200 | Szene | fresh leafy green vegetables and bok choy, dew drops, dark background |
| `plants-cat-algen` | 1000×1200 | Szene | underwater seaweed and kelp with teal light rays, dark background |
| `plants-map` | 2400×1100 | Szene | old parchment world map in dark teal and sepia with illustrated plants on each continent, mountains and ocean, vintage cartography, calm and dark |
| `plant-ashwagandha-hero` | 2800×1100 | Szene | ashwagandha plant with green leaves, small white-yellow flowers, red berries inside papery husks and a thick pale-brown root system rising from dark soil, dark lush jungle background with soft golden light, subject on the right half, calm dark area on the left for text |
| `plant-ashwagandha-sketch` | 700×1000 | Szene | antique botanical pen-and-ink illustration of the whole ashwagandha plant with leaves, flower, berries and root on aged cream parchment, fine hatching, portrait, no text |
| `plant-ashwagandha-parts` | 1600×1000 | Szene | whole ashwagandha plant showing leaves, small flowers, red berries in husks and the complete root system in the soil, dark moody forest floor, plenty of empty dark space left and right for labels |
| `plant-ashwagandha-photo` | 1200×900 | Szene | macro close-up of an ashwagandha flower with pale yellow-white petals, green berries and leaves, soft natural light, shallow depth of field |
| `plant-ashwagandha-thumb-wurzel` | 400×500 | Szene | fresh ashwagandha taproot with fine side roots, soil-dusted, dark background |
| `plant-ashwagandha-thumb-blatt` | 400×500 | Szene | green ashwagandha leaves, slightly hairy, close-up, dark background |
| `plant-ashwagandha-thumb-bluete` | 400×500 | Szene | small pale yellow ashwagandha flower, close-up, dark background |
| `plant-ashwagandha-thumb-frucht` | 400×500 | Szene | ripe red ashwagandha berries in papery husks, close-up, dark background |
| `plant-ashwagandha-stage-1` | 400×500 | Szene | tiny ashwagandha seedling with two leaves in dark soil, dark background |
| `plant-ashwagandha-stage-2` | 400×500 | Szene | young leafy ashwagandha plant in growth, dark background |
| `plant-ashwagandha-stage-3` | 400×500 | Szene | ashwagandha plant in bloom with small pale flowers, dark background |
| `plant-ashwagandha-stage-4` | 400×500 | Szene | ashwagandha branch with ripe red berries in papery husks, dark background |
| `plant-ashwagandha-stage-5` | 400×500 | Szene | freshly harvested ashwagandha roots with soil, dark background |
| `plant-ashwagandha-origin` | 800×520 | Szene | ancient Indian temple ruins in a dry landscape, warm hazy light, illustration |
| `plant-ashwagandha-powder` | 900×700 | Szene | rustic wooden bowl of fine beige ashwagandha root powder with dried root pieces beside it, dark wood, warm light |
| `compound-withaferin-a` | 900×520 | Szene | hand-drawn chemical structural formula on aged parchment, steroid ring skeleton with a lactone ring, ink drawing; check the real structure of withaferin A before use (C28H38O6) |
| `plant-ashwagandha-history-1` | 600×450 | Szene | ancient Indian scholars and healers with palm-leaf manuscripts and herbs, sepia illustration |
| `plant-ashwagandha-history-2` | 600×450 | Szene | medieval herbalist at work with plants and manuscripts in Asia and Arabia, sepia illustration |
| `plant-ashwagandha-history-3` | 600×450 | Szene | 18th and 19th century European naturalists studying plants, sepia engraving look |
| `plant-ashwagandha-history-4` | 600×450 | Szene | modern laboratory with plant extracts and glassware, warm light |
| `plant-ashwagandha-combo-1` | 700×420 | Szene | ashwagandha root next to fresh ginger root and a small jar of honey on dark wood |
| `plant-ashwagandha-combo-2` | 700×420 | Szene | ashwagandha root next to turmeric root and black peppercorns on dark wood |
| `plant-ashwagandha-combo-3` | 700×420 | Szene | ashwagandha root next to fresh rosemary sprigs and red berries on dark wood |
| `form-tee` | 500×600 | Szene | a steaming cup of herbal tea on a saucer with loose dried herbs, dark background |
| `form-pulver` | 500×600 | Szene | a mound of fine herbal root powder with dried root pieces, dark background |
| `form-extrakt` | 500×600 | Szene | amber glass jar of herbal extract with a label-free lid, dark background |
| `form-kapseln` | 500×600 | Szene | small amber glass bottle with a dropper next to a few plain capsules, dark background |
| `form-tinktur` | 500×600 | Szene | tall amber dropper bottle of herbal tincture with a few leaves, dark background |
| `form-kochen` | 500×600 | Szene | a small glass jar of ground herbal powder with a wooden spoon, kitchen look, dark background |
| `plant-granatapfel-hero` | 2800×1100 | Szene | ripe red pomegranates, one cut open showing glistening ruby arils, with glossy green leaves and a red blossom, dark moody orchard background with warm golden light, subject on the right half, calm dark area on the left for text |
| `plant-granatapfel-sketch` | 700×1000 | Szene | antique botanical pen-and-ink illustration of a pomegranate branch with leaves, flower, whole fruit and a cut fruit on aged cream parchment, fine hatching, portrait, no text |
| `plant-granatapfel-parts` | 1600×1000 | Szene | a pomegranate branch with glossy leaves and a red flower above, one whole fruit on the left and one fruit cut open on the right showing the arils, dark moody background, empty dark space left and right for labels |
| `plant-granatapfel-origin` | 800×520 | Szene | ancient Persian ruins with columns in a dry warm landscape, hazy golden light, illustration |
| `plant-granatapfel-bowl` | 900×700 | Szene | rustic wooden bowl full of glistening ruby pomegranate arils with a few leaves, dark wood, warm light |
| `plant-granatapfel-stage-1` | 400×500 | Szene | tiny pomegranate seedling with two leaves in dark soil, dark background |
| `plant-granatapfel-stage-2` | 400×500 | Szene | pomegranate branch with bright red flowers, dark background |
| `plant-granatapfel-stage-3` | 400×500 | Szene | small green unripe pomegranate fruit on a branch, dark background |
| `plant-granatapfel-stage-4` | 400×500 | Szene | ripe deep red pomegranate on a branch, dark background |
| `compound-punicalagin` | 900×520 | Szene | hand-drawn chemical structural formula on aged parchment, many connected aromatic phenol rings with hydroxyl groups, ink drawing; check the real structure of punicalagin (C48H28O30) before use |
| `compound-ellagsaeure` | 400×300 | Szene | close-up of ruby pomegranate arils with a soft glow, dark background |
| `compound-anthocyane` | 400×300 | Szene | deep red and violet berries with juice drops, dark background |
| `compound-flavonoide` | 400×300 | Szene | colourful fruit slices and leaves in soft light, dark background |
| `compound-gerbstoffe` | 400×300 | Szene | dried pomegranate peel pieces, brown and red, dark background |
| `form-frisch` | 500×600 | Szene | a small bowl of fresh ruby pomegranate arils, dark background |
| `form-saft` | 500×600 | Szene | a glass of freshly pressed red pomegranate juice with a halved fruit beside it, dark background |
| `form-schale` | 500×600 | Szene | dried pomegranate peel pieces and a cup of tea, dark background |
| `form-samenoel` | 500×600 | Szene | amber dropper bottle of pomegranate seed oil with a few seeds, dark background |
| `plant-granatapfel-history-1` | 600×450 | Szene | ancient Persian and Mesopotamian relief with a pomegranate motif, sepia illustration |
| `plant-granatapfel-history-2` | 600×450 | Szene | ancient Egyptian wall painting with pomegranates, sepia illustration |
| `plant-granatapfel-history-3` | 600×450 | Szene | ancient Greek vase scene with pomegranates and a goddess, sepia illustration |
| `plant-granatapfel-history-4` | 600×450 | Szene | medieval monastery garden with a monk tending fruit trees, sepia illustration |
| `plant-granatapfel-history-5` | 600×450 | Szene | modern laboratory with fruit extracts and glassware, warm light |
| `plant-granatapfel-combo-1` | 700×420 | Szene | pomegranate arils in a glass with honey and fresh ginger on dark wood |
| `plant-granatapfel-combo-2` | 700×420 | Szene | a halved pomegranate next to turmeric roots and powder on dark wood |
| `plant-granatapfel-combo-3` | 700×420 | Szene | pomegranate arils with fresh rosemary sprigs on dark wood |
| `plant-granatapfel-combo-4` | 700×420 | Szene | a rich dark stew with walnuts and pomegranate arils in a ceramic dish, persian style |
| `plant-granatapfel-combo-5` | 700×420 | Szene | a fresh green salad topped with ruby pomegranate arils, dark background |
| `obst-hero` | 2800×1300 | Szene | a woven basket overflowing with colourful fruit and vegetables, pomegranate, pineapple, avocado, carrots and berries, in front of a misty green mountain valley with a lake, warm golden light, calm dark area on the left for text, no people |
| `obst-sketch` | 700×1000 | Szene | antique botanical pen-and-ink illustration of a pomegranate branch with fruit and leaves on aged cream parchment, fine hatching, portrait, no text |
| `obst-cat-obst` | 1000×800 | Szene | a colourful heap of sweet fruit, apples, pears and grapes, rich colours, dark background |
| `obst-cat-beeren` | 1000×800 | Szene | blueberries, raspberries and blackberries with dew, rich colours, dark background |
| `obst-cat-zitrus` | 1000×800 | Szene | halved oranges, lemons and limes, bright and juicy, dark background |
| `obst-cat-kernobst` | 1000×800 | Szene | red and green apples and pears, fresh with leaves, dark background |
| `obst-cat-steinobst` | 1000×800 | Szene | peaches, cherries and plums, ripe and glossy, dark background |
| `obst-cat-tropen` | 1000×800 | Szene | pineapple, papaya, dragon fruit and mango, tropical colours, dark background |
| `obst-cat-gemuese` | 1000×800 | Szene | a rustic crate of classic fresh vegetables, dark background |
| `obst-cat-blatt` | 1000×800 | Szene | fresh leafy greens, spinach and lettuce with water drops, dark background |
| `obst-cat-wurzel` | 1000×800 | Szene | carrots, beetroot and root vegetables with soil, dark background |
| `obst-cat-huelsen` | 1000×800 | Szene | bowls of lentils, beans and peas in many colours, dark background |
| `obst-cat-kohl` | 1000×800 | Szene | a green cabbage, broccoli and cauliflower, fresh, dark background |
| `obst-cat-nachtschatten` | 1000×800 | Szene | red tomatoes, peppers and a purple aubergine, dark background |
| `obst-cat-kuerbis` | 1000×800 | Szene | orange pumpkins, cucumbers and courgettes, dark background |
| `obst-cat-zwiebel` | 1000×800 | Szene | garlic bulbs, onions and leeks, dark background |
| `obst-cat-nuesse` | 1000×800 | Szene | a mixture of nuts and seeds in a rustic bowl, dark background |
| `obst-cat-sprossen` | 1000×800 | Szene | fresh bean and alfalfa sprouts in a small glass dish, dark background |
| `obst-map` | 2400×1100 | Szene | old parchment world map in dark teal and sepia with illustrated fruit and vegetables on each continent, a pineapple, oranges, corn and rice, vintage cartography, calm and dark |
| `obst-kueche-mittelmeer` | 800×600 | Szene | a sunny Mediterranean market with olives, tomatoes and aubergines, illustration |
| `obst-kueche-asien` | 800×600 | Szene | an Asian market with ginger, pak choi and rice paddies in the background, illustration |
| `obst-kueche-suedamerika` | 800×600 | Szene | a South American market with corn, chilli and quinoa in colourful baskets, illustration |
| `obst-kueche-afrika` | 800×600 | Szene | an African market with millet, okra and cassava, warm light, illustration |
| `obst-kueche-orient` | 800×600 | Szene | an oriental bazaar with pomegranates, dates and chickpeas, warm lamp light, illustration |
| `obst-rezept-smoothies` | 600×600 | Szene | two colourful fruit smoothies in glasses with fresh fruit around them, dark background |
| `obst-rezept-salate` | 600×600 | Szene | a fresh colourful salad bowl with leaves, tomatoes and pomegranate seeds, dark background |
| `obst-rezept-warm` | 600×600 | Szene | a warm vegetable stew in a ceramic pot with herbs, steam rising, dark background |
| `baum-hero` | 2800×1300 | Szene | a gigantic ancient world tree with glowing golden roots spreading through the earth and a luminous crown, a mountain valley with a waterfall and a lake behind, magical warm light and floating light particles, calm darker area on the left for text, no people |
| `baum-system` | 1600×1040 | Szene | a large tree seen in cross-section: sunlight and glowing green energy flowing through crown, trunk and roots, mycorrhizal fungal threads in the soil connecting to a second tree, mushrooms at the ground, night sky with stars, empty space at the left and right edges for labels |
| `baum-torus` | 1200×760 | Szene | a luminous tree inside a glowing torus-shaped field of fine blue and golden lines, symbolic energy diagram on a dark background, elegant, no text |
| `baum-map` | 2400×1100 | Szene | a dark stylised world map in teal and gold with glowing green forest areas on every continent and fine connecting lines, calm and dark |
| `baum-cat-laub` | 800×960 | Szene | a mighty broadleaf oak tree in summer under a blue sky, dark background |
| `baum-cat-nadel` | 800×960 | Szene | tall dark conifer trees in a misty forest, dark background |
| `baum-cat-obst` | 800×960 | Szene | an apple tree full of ripe red apples, dark background |
| `baum-cat-blueten` | 800×960 | Szene | a blossoming cherry tree with pink flowers, dark background |
| `baum-cat-tropen` | 800×960 | Szene | a lush tropical rainforest tree with hanging lianas, dark background |
| `baum-cat-heil` | 800×960 | Szene | an ancient healing tree with a spiral trunk in warm light, dark background |
| `baum-cat-berg` | 800×960 | Szene | a lone pine tree on a mountain ridge with snowy peaks, dark background |
| `baum-cat-trocken` | 800×960 | Szene | an acacia tree in a golden dry savanna at sunset, dark background |
| `baum-cat-holz` | 800×960 | Szene | giant redwood trunks in a forest with light rays, dark background |
| `baum-ebene-wissenschaft` | 600×800 | Szene | a green leaf with glowing veins and tiny scientific symbols, microscope look, dark background |
| `baum-ebene-traditionell` | 600×800 | Szene | an old oak with a medicine woman gathering bark and herbs, painterly, warm light |
| `baum-ebene-geometrisch` | 600×800 | Szene | a golden spiral and fractal branching pattern, glowing lines on a dark background |
| `baum-ebene-spirituell` | 600×800 | Szene | a meditating figure under a glowing world tree, mystical light, dark background |
| `baum-old-methusalem` | 600×800 | Szene | an ancient gnarled bristlecone pine on a rocky mountain slope, dramatic light |
| `baum-old-olive` | 600×800 | Szene | a huge ancient olive tree with a hollow twisted trunk in a Mediterranean grove |
| `baum-old-jomon` | 600×800 | Szene | a massive ancient Japanese cedar in a misty moss-covered forest |
| `baum-old-baobab` | 600×800 | Szene | a baobab tree with a thick trunk in a savanna at sunset |
| `baum-old-eiche` | 600×800 | Szene | a very old mighty oak with a wide crown and thick branches in an English meadow |
| `baum-oeko` | 1600×800 | Szene | the base of a huge old tree with a deer, birds, mushrooms, insects and moss around it, forest ecosystem, soft magical light, empty space on the right for text |
| `baum-holz` | 800×450 | Szene | a stack of cut logs and timber boards in warm light, dark background |
| `baum-kultur` | 800×450 | Szene | stone temples and statues among ancient trees, a figure meditating, mystical light |
| `baum-forschung` | 800×450 | Szene | a green seedling growing in front of a research laboratory with glassware, warm light |
| `mineral-hero` | 2800×1300 | Szene | the Earth as a glowing planet in the centre right surrounded by floating raw crystals and mineral rocks in purple, gold, blue and white, a mountain waterfall landscape at the lower right, a dark calm area on the left for text, soft golden light and sparkles, no text, no letters, no symbols |
| `element-h` | 600×720 | Szene | a clear crystal with a tiny bubble of hydrogen gas, icy blue glow, centred on a dark background, glowing, no text |
| `element-c` | 600×720 | Szene | a diamond and a lump of graphite side by side, white and black, centred on a dark background, glowing, no text |
| `element-o` | 600×720 | Szene | a deep blue faceted crystal with an oxygen bubble glow, centred on a dark background, glowing, no text |
| `element-na` | 600×720 | Szene | white cubic rock salt crystals, centred on a dark background, glowing, no text |
| `element-mg` | 600×720 | Szene | green faceted magnesium-rich crystals such as olivine, centred on a dark background, glowing, no text |
| `element-si` | 600×720 | Szene | clear and smoky quartz crystals, centred on a dark background, glowing, no text |
| `element-ca` | 600×720 | Szene | white and pale blue calcite crystals, centred on a dark background, glowing, no text |
| `element-fe` | 600×720 | Szene | rusty red iron ore with metallic hematite shine, centred on a dark background, glowing, no text |
| `element-cu` | 600×720 | Szene | a lump of native copper with green and orange tones, centred on a dark background, glowing, no text |
| `element-zn` | 600×720 | Szene | grey-blue zinc ore crystals, sphalerite, centred on a dark background, glowing, no text |
| `element-ag` | 600×720 | Szene | a branching lump of native silver, bright white metallic, centred on a dark background, glowing, no text |
| `element-au` | 600×720 | Szene | a raw gold nugget, warm golden glow, centred on a dark background, glowing, no text |
| `element-i` | 600×720 | Szene | dark violet iodine crystals with a purple vapour glow, centred on a dark background, glowing, no text |
| `mineral-reise-atom` | 600×600 | Schwarz | a glowing atom with orbiting electrons, glowing, on a pure black background, no text |
| `mineral-reise-molekuel` | 600×600 | Schwarz | a ball-and-stick molecule of silicon and oxygen, glowing, on a pure black background, no text |
| `mineral-reise-gitter` | 600×600 | Schwarz | a regular crystal lattice of connected spheres, glowing, on a pure black background, no text |
| `mineral-reise-kristall` | 600×600 | Schwarz | a single violet crystal point, glowing, on a pure black background, no text |
| `mineral-reise-mineral` | 600×600 | Schwarz | a polished raw mineral specimen, glowing, on a pure black background, no text |
| `mineral-reise-gestein` | 600×600 | Schwarz | a rough dark rock with mineral veins, glowing, on a pure black background, no text |
| `mineral-reise-gebirge` | 600×600 | Schwarz | a snowy mountain range, glowing, on a pure black background, no text |
| `mineral-reise-planet` | 600×600 | Schwarz | the Earth seen from space, glowing, on a pure black background, no text |
| `mineral-quarz-1` | 1600×1300 | Schwarz | a large cluster of clear quartz crystals on dark rock, glowing, on a pure black background |
| `mineral-quarz-2` | 1600×1300 | Schwarz | a single tall clear quartz point crystal with sharp facets, on a pure black background |
| `mineral-quarz-3` | 1600×1300 | Schwarz | a quartz crystal with a fine rainbow inside, side view, on a pure black background |
| `mineral-quarz-4` | 1600×1300 | Schwarz | small quartz crystals growing in a geode, on a pure black background |
| `mineral-bild-magma` | 800×600 | Szene | a glowing lava flow and a volcano at dusk, cinematic, no people |
| `mineral-bild-meta` | 800×600 | Szene | folded banded gneiss rock in a mountain cliff, cinematic, no people |
| `mineral-bild-sedi` | 800×600 | Szene | layered sandstone cliffs in warm desert light, cinematic, no people |
| `mineral-bild-hydro` | 800×600 | Szene | a cave wall with blue glowing crystal veins and clusters, cinematic, no people |
| `mineral-map` | 2400×1100 | Szene | a dark stylised world map in deep blue and gold with fine glowing contour lines, calm and dark, no text |
| `mineral-ort-brasilien` | 600×400 | Szene | amethyst and quartz geodes in a Brazilian mine landscape, dramatic light, no people |
| `mineral-ort-madagaskar` | 600×400 | Szene | large crystal formations in red earth, Madagascar, dramatic light, no people |
| `mineral-ort-schweiz` | 600×400 | Szene | alpine rock face with a crystal cleft in the Swiss Alps, dramatic light, no people |
| `mineral-ort-usa` | 600×400 | Szene | small double-terminated clear quartz crystals in dark rock, New York, dramatic light, no people |
| `mineral-ort-uruguay` | 600×400 | Szene | a large amethyst geode cut open, warm light, dramatic light, no people |
| `mineral-ort-sambia` | 600×400 | Szene | deep violet amethyst crystals in a rocky landscape, dramatic light, no people |
| `mineral-ort-indien` | 600×400 | Szene | pink rose quartz masses in a rocky hillside, dramatic light, no people |
| `mineral-ort-schottland` | 600×400 | Szene | smoky quartz crystals in granite in the Scottish highlands, dramatic light, no people |
| `mineral-ort-deutschland` | 600×400 | Szene | polished banded agate slices in a workshop, warm light, dramatic light, no people |
| `mineral-ort-spanien` | 600×400 | Szene | golden citrine crystals in a rocky terrain, dramatic light, no people |
| `mineral-anw-schmuck` | 600×600 | Szene | a faceted gemstone ring on dark velvet, dark background, no text |
| `mineral-anw-technik` | 600×600 | Szene | a mechanical wristwatch movement with a small quartz oscillator, dark background, no text |
| `mineral-anw-optik` | 600×600 | Szene | glass lenses and a laser beam in a laboratory, dark background, no text |
| `mineral-anw-bau` | 600×600 | Szene | an ancient stone temple wall of granite blocks, dark background, no text |
| `mineral-anw-heil` | 600×600 | Szene | a gathering of violet and pink crystals on a cloth, soft candle light, dark background, no text |
| `mineral-anw-forschung` | 600×600 | Szene | a crystal under a polarising microscope with colourful patterns, dark background, no text |
| `mineral-anw-elektronik` | 600×600 | Szene | a circuit board with a small metal crystal oscillator, dark background, no text |
| `mineral-anw-alltag` | 600×600 | Szene | glass bottles and a flint stone tool on a wooden table, dark background, no text |
| `mineral-hist-stein` | 600×500 | Szene | stone age flint blades and tools on rock, painterly, warm light, no text |
| `mineral-hist-aegypten` | 600×500 | Szene | an ancient Egyptian amulet and jewellery with amethyst beads, painterly, warm light, no text |
| `mineral-hist-antike` | 600×500 | Szene | a Greek marble statue holding a crystal sphere, painterly, warm light, no text |
| `mineral-hist-mittelalter` | 600×500 | Szene | a medieval scholar studying gemstones in a candle-lit study, painterly, warm light, no text |
| `mineral-hist-moderne` | 600×500 | Szene | a modern laboratory with crystals and measuring instruments, painterly, warm light, no text |
| `element-h-hero` | 2800×1300 | Szene | a large transparent glass sphere containing a glowing blue atom nucleus with thin orbit rings, floating over dark rocks and a waterfall in a night landscape, small soap-bubble spheres around it, a dark calm area on the left for text, no text, no letters |
| `element-h-universum` | 800×600 | Szene | a spiral galaxy and nebula with glowing hydrogen clouds in blue and violet, deep space, no text |
| `element-h-erde-1` | 600×400 | Szene | a glacier and blue ocean seen from above, clear cold light, no people |
| `element-h-erde-2` | 600×400 | Szene | a steaming geyser and volcanic hot spring in a rocky landscape, no people |
| `element-h-verb-wasser` | 600×600 | Szene | a water molecule as a ball-and-stick model with one red oxygen and two white hydrogen atoms, glowing, dark background, no text |
| `element-h-verb-methan` | 600×600 | Szene | a methane molecule as a ball-and-stick model, one grey carbon and four white hydrogen atoms, dark background, no text |
| `element-h-verb-ammoniak` | 600×600 | Szene | an ammonia molecule as a ball-and-stick model, one blue nitrogen and three white hydrogen atoms, dark background, no text |
| `element-h-verb-salzsaeure` | 600×600 | Szene | a hydrogen chloride molecule as a ball-and-stick model, one green chlorine and one white hydrogen atom, dark background, no text |
| `element-h-anw-energie` | 600×450 | Szene | a futuristic city powered by a hydrogen fuel cell, blue glowing energy, cinematic, no text |
| `element-h-anw-raumfahrt` | 600×450 | Szene | a rocket launching at dawn with a bright exhaust flame, cinematic, no text |
| `element-h-anw-industrie` | 600×450 | Szene | a chemical plant with tall columns and pipes at dusk, cinematic, no text |
| `element-h-anw-metall` | 600×450 | Szene | glowing molten metal being poured in a steel mill, cinematic, no text |
| `element-h-anw-mobil` | 600×450 | Szene | a modern hydrogen fuel cell car on a road at dusk, cinematic, no text |
| `element-h-anw-zukunft` | 600×450 | Szene | a green hydrogen plant with wind turbines and solar panels at sunrise, cinematic, no text |
| `element-h-hist-urzeit` | 600×450 | Szene | an early human around a campfire in a cave, firelight, painterly, no text |
| `element-h-hist-alchemie` | 600×450 | Szene | an alchemist's workshop with flasks and a burning flame, painterly, painterly, no text |
| `element-h-hist-wissenschaft` | 600×450 | Szene | an 18th century laboratory with glass apparatus and a scientist, warm light, painterly, no text |
| `element-h-hist-raumfahrt` | 600×450 | Szene | a rocket on a launch pad with steam, vintage space age, painterly, no text |
| `element-h-hist-zukunft` | 600×450 | Szene | a clean future landscape with wind turbines and a glowing hydrogen tank, painterly, no text |
| `kristall-hero` | 2800×1300 | Szene | a huge glowing violet amethyst crystal cluster in the centre right inside a dark cave, a golden sacred geometry circle behind it, a view out to a mountain lake at sunset on the right, small floating crystals, a dark calm area on the left for text, no text, no letters |
| `kristall-cat-alle` | 600×672 | Szene | a mixed cluster of amethyst, quartz and rose quartz crystals, glowing, dark background, no text |
| `kristall-cat-quarz` | 600×672 | Szene | a cluster of clear and smoky quartz crystals, dark background, no text |
| `kristall-cat-edel` | 600×672 | Szene | faceted gemstones in purple, blue and red, sparkling, dark background, no text |
| `kristall-cat-heil` | 600×672 | Szene | green and violet healing stones in a bowl, soft light, dark background, no text |
| `kristall-cat-roh` | 600×672 | Szene | raw rough pink and white crystal points on dark rock, dark background, no text |
| `kristall-cat-trommel` | 600×672 | Szene | polished tumbled stones in warm colours, dark background, no text |
| `kristall-cat-selten` | 600×672 | Szene | a rare rainbow crystal with fine inclusions, glowing, dark background, no text |
| `kristall-cat-meteor` | 600×672 | Szene | a dark meteorite fragment with crystal patterns, dark background, no text |
| `kristall-cat-farbe` | 600×672 | Szene | bright blue and violet colour crystals, glowing, dark background, no text |
| `kristall-cat-sammler` | 600×672 | Szene | a museum quality mineral specimen on a stand, red crystals, dark background, no text |
| `kristall-system` | 900×1200 | Schwarz | a large glowing violet crystal prism with a fine network of glowing lines inside, on a pure black background |
| `kristall-amethyst-1` | 1600×1300 | Schwarz | a large cluster of violet amethyst crystals on dark rock, glowing, on a pure black background |
| `kristall-amethyst-2` | 1600×1300 | Schwarz | a single tall amethyst crystal point with sharp facets, on a pure black background |
| `kristall-amethyst-3` | 1600×1300 | Schwarz | an amethyst geode cut open showing crystals, on a pure black background |
| `kristall-amethyst-4` | 1600×1300 | Schwarz | small amethyst crystals growing in a cluster, on a pure black background |
| `kristall-anw-meditation` | 600×630 | Szene | a person meditating with a crystal in the hand, candle light, dark background, no text |
| `kristall-anw-wohnraum` | 600×630 | Szene | a calm living room with crystal decoration on a shelf, dark background, no text |
| `kristall-anw-schmuck` | 600×630 | Szene | a gemstone ring and necklace on dark velvet, dark background, no text |
| `kristall-anw-heil` | 600×630 | Szene | crystals laid out on a cloth for a relaxation session, soft light, dark background, no text |
| `kristall-anw-wasser` | 600×630 | Szene | a glass of water with a crystal beside it, dark background, no text |
| `kristall-anw-garten` | 600×630 | Szene | crystals among plants and stones in a garden, dark background, no text |
| `kristall-anw-sammlung` | 600×630 | Szene | a display case with mineral specimens in a museum, dark background, no text |
| `kristall-anw-deko` | 600×630 | Szene | a decorative geode and crystal sculpture in a room, dark background, no text |
| `kristall-map` | 2400×1200 | Szene | a dark stylised world map in violet and gold with fine glowing contour lines, calm and dark, no text |
| `kristall-hist-aegypten` | 600×500 | Szene | an ancient Egyptian amulet and jewellery with lapis lazuli and amethyst, painterly, warm light, no text |
| `kristall-hist-antike` | 600×500 | Szene | a Greek marble statue holding a crystal sphere, painterly, warm light, no text |
| `kristall-hist-mittelalter` | 600×500 | Szene | a medieval scholar studying gemstones in a candle-lit study, painterly, warm light, no text |
| `kristall-hist-moderne` | 600×500 | Szene | a modern laboratory with crystals and measuring instruments, painterly, warm light, no text |
| `kristall-thema-mineralien` | 600×520 | Szene | raw mineral rocks in blue and white, glowing, dark background, no text |
| `kristall-thema-elemente` | 600×520 | Szene | a periodic table cell glowing with a crystal, dark background, no text |
| `kristall-thema-geologie` | 600×520 | Szene | layered rock strata and a volcano, dark background, no text |
| `kristall-thema-frequenzen` | 600×520 | Szene | a glowing sound wave pattern in sand, cymatics, dark background, no text |
| `kristall-thema-kulturen` | 600×520 | Szene | ancient stone temples and statues, dark background, no text |
| `kristall-thema-forschung` | 600×520 | Szene | a microscope and crystal lattice diagram, dark background, no text |
| `koerper-hero` | 2800×1300 | Szene | a glowing translucent human body in the centre right, front view, with a faintly visible skeleton, muscles, nerves and organs in blue, gold and red, a soft golden halo behind it, small floating particles, a dark calm area on the left for text, no text, no letters |
| `koerper-sys-nerven` | 500×560 | Szene | a glowing network of nerves and a brain in violet, dark background, no text |
| `koerper-sys-hormon` | 500×560 | Szene | glowing endocrine glands, thyroid and pituitary, in orange, dark background, no text |
| `koerper-sys-kreislauf` | 500×560 | Szene | a glowing heart with arteries and veins in red and blue, dark background, no text |
| `koerper-sys-atmung` | 500×560 | Szene | glowing lungs and bronchial tree in pink and violet, dark background, no text |
| `koerper-sys-verdauung` | 500×560 | Szene | glowing stomach and intestines in warm orange, dark background, no text |
| `koerper-sys-muskel` | 500×560 | Szene | glowing muscle fibres of an arm in deep red, dark background, no text |
| `koerper-sys-skelett` | 500×560 | Szene | a glowing skeleton in ivory and blue, dark background, no text |
| `koerper-sys-immun` | 500×560 | Szene | glowing white blood cells and a shield motif in violet, dark background, no text |
| `koerper-sys-harn` | 500×560 | Szene | glowing kidneys and bladder in coral, dark background, no text |
| `koerper-sys-fortpflanzung` | 500×560 | Szene | an abstract glowing cell division and a tiny embryo motif in rose, dark background, no text |
| `koerper-sys-lymph` | 500×560 | Szene | glowing lymph vessels and lymph nodes in green, dark background, no text |
| `koerper-sys-haut` | 500×560 | Szene | a glowing skin cross-section with layers in warm amber, dark background, no text |
| `koerper-kette-atome` | 500×500 | Szene | a glowing atom with orbiting electrons, dark background, no text |
| `koerper-kette-molekuele` | 500×500 | Szene | a glowing molecule model of connected spheres, dark background, no text |
| `koerper-kette-zellen` | 500×500 | Szene | a glowing human cell with a nucleus in cross-section, dark background, no text |
| `koerper-kette-gewebe` | 500×500 | Szene | glowing tissue cells packed in a pattern, dark background, no text |
| `koerper-kette-organe` | 500×500 | Szene | a glowing human heart, dark background, no text |
| `koerper-kette-organsysteme` | 500×500 | Szene | a glowing network of connected organs, dark background, no text |
| `koerper-kette-koerper` | 500×500 | Szene | a glowing human body silhouette, dark background, no text |
| `koerper-zelle` | 1000×700 | Szene | a large glowing human cell in cross-section with nucleus, mitochondria and membrane, in blue, gold and violet, dark background, no text |
| `koerper-leben-embryo` | 500×600 | Szene | a human embryo in the womb, soft glow, painterly, dark background, no text |
| `koerper-leben-kindheit` | 500×600 | Szene | a happy child in a meadow, soft light, painterly, dark background, no text |
| `koerper-leben-jugend` | 500×600 | Szene | a teenager with a backpack at dusk, soft light, painterly, dark background, no text |
| `koerper-leben-erwachsen` | 500×600 | Szene | an adult standing in a calm landscape, soft light, painterly, dark background, no text |
| `koerper-leben-alter` | 500×600 | Szene | an elderly person looking at the sunset, soft light, painterly, dark background, no text |
| `koerper-gesund-ernaehrung` | 500×500 | Szene | a bowl of colourful fresh vegetables and fruit, dark background, no text |
| `koerper-gesund-bewegung` | 500×500 | Szene | a person jogging at sunrise, dark background, no text |
| `koerper-gesund-schlaf` | 500×500 | Szene | a person sleeping under a night sky, dark background, no text |
| `koerper-gesund-stress` | 500×500 | Szene | a calm hand on a chest with a soft glow, dark background, no text |
| `koerper-gesund-immun` | 500×500 | Szene | an abstract shield of light over a body outline, dark background, no text |
| `koerper-gesund-darm` | 500×500 | Szene | an abstract gut with glowing bacteria, dark background, no text |
| `koerper-gesund-mental` | 500×500 | Szene | a person meditating in a calm room, dark background, no text |
| `koerper-gesund-langlebigkeit` | 500×500 | Szene | a tree with deep roots and an hourglass, dark background, no text |
| `koerper-forschung-neuro` | 500×420 | Szene | a glowing brain scan with neural connections, dark background, no text |
| `koerper-forschung-genetik` | 500×420 | Szene | a glowing DNA double helix, dark background, no text |
| `koerper-forschung-mikrobiom` | 500×420 | Szene | glowing gut bacteria under a microscope, dark background, no text |
| `koerper-forschung-regeneration` | 500×420 | Szene | stem cells in a petri dish, soft glow, dark background, no text |
| `koerper-forschung-langlebigkeit` | 500×420 | Szene | an hourglass with golden light and a cell, dark background, no text |
| `koerper-link-naehrstoffe` | 600×480 | Szene | colourful fruit and vegetables with glowing vitamin molecules, dark background, no text |
| `koerper-link-pflanzen` | 600×480 | Szene | a medicinal plant with glowing leaves, dark background, no text |
| `koerper-link-mineralien` | 600×480 | Szene | raw mineral crystals in blue and white, dark background, no text |
| `koerper-link-frequenzen` | 600×480 | Szene | a glowing sound wave pattern in sand, dark background, no text |
| `koerper-hirn` | 1200×700 | Szene | a glowing human brain in profile with golden neural pathways and tiny sparks, dark background, no text |
| `koerper-funktion-stoffwechsel` | 500×500 | Szene | a glowing flame inside a cell with energy particles, dark background, no text |
| `koerper-funktion-hormone` | 500×500 | Szene | glowing hormone molecules flowing in a blood vessel, dark background, no text |
| `koerper-funktion-regeneration` | 500×500 | Szene | new green skin cells growing over a small wound, soft glow, dark background, no text |
| `koerper-funktion-wachstum` | 500×500 | Szene | a seedling and a growing silhouette of a child, soft glow, dark background, no text |
| `koerper-funktion-temperatur` | 500×500 | Szene | a glowing thermometer over a body outline, dark background, no text |
| `koerper-funktion-entgiftung` | 500×500 | Szene | a glowing liver and kidneys with clean water drops, dark background, no text |
| `koerper-funktion-sinne` | 500×500 | Szene | an eye, an ear and a nose glowing as signals, dark background, no text |
| `koerper-funktion-homoeostase` | 500×500 | Szene | balanced glowing scales over a body outline, dark background, no text |

## Atlas-Einträge (ein Bild pro Eintrag)

Name `atlas-<id>`, 1000×1000, Typ Schwarz. Prompt-Kern: one botanical or mineral subject, scientific illustration meets glowing light, on a pure black background. Das Motiv steht im Prompt-Kern jeweils zuerst.

| Datei | Motiv |
|---|---|
| `atlas-achat` | Achat (Chalcedon (gebänderte Quarz-Varietät)) |
| `atlas-ahorn` | Bergahorn (Acer pseudoplatanus) |
| `atlas-aloe-vera` | Aloe vera (Aloe vera (Aloe barbadensis)) |
| `atlas-amethyst` | Amethyst (Quarz (violette Varietät)) |
| `atlas-apfel` | Apfel (Malus domestica) |
| `atlas-ashwagandha` | Ashwagandha (Withania somnifera) |
| `atlas-austernpilz` | Austernseitling (Pleurotus ostreatus) |
| `atlas-avocado` | Avocado (Persea americana) |
| `atlas-baobab` | Affenbrotbaum (Baobab) (Adansonia digitata) |
| `atlas-brennnessel` | Große Brennnessel (Urtica dioica) |
| `atlas-brokkoli` | Brokkoli (Brassica oleracea var. italica) |
| `atlas-buche` | Rotbuche (Fagus sylvatica) |
| `atlas-chaga` | Chaga (Schiefer Schillerporling) (Inonotus obliquus) |
| `atlas-citrin` | Citrin (Quarz (gelbe Varietät)) |
| `atlas-echinacea` | Purpur-Sonnenhut (Echinacea) (Echinacea purpurea) |
| `atlas-eiche` | Stieleiche (Quercus robur) |
| `atlas-fliegenpilz` | Fliegenpilz (Amanita muscaria) |
| `atlas-fluorit` | Fluorit (Fluorit) |
| `atlas-ginkgo` | Ginkgo (Ginkgo biloba) |
| `atlas-granat` | Granat (Granat (Mineralgruppe)) |
| `atlas-granatapfel` | Granatapfel (Punica granatum) |
| `atlas-heidelbeere` | Heidelbeere (Vaccinium myrtillus) |
| `atlas-igelstachelbart` | Igelstachelbart (Hericium erinaceus) |
| `atlas-ingwer` | Ingwer (Zingiber officinale) |
| `atlas-kamille` | Echte Kamille (Matricaria chamomilla) |
| `atlas-karotte` | Karotte (Daucus carota subsp. sativus) |
| `atlas-kiefer` | Waldkiefer (Pinus sylvestris) |
| `atlas-kirsche` | Süßkirsche (Prunus avium) |
| `atlas-knoblauch` | Knoblauch (Allium sativum) |
| `atlas-kordyzeps` | Chinesischer Raupenpilz (Cordyceps) (Ophiocordyceps sinensis) |
| `atlas-kuerbis` | Kürbis (Cucurbita pepo / Cucurbita maxima) |
| `atlas-kurkuma` | Kurkuma (Curcuma longa) |
| `atlas-labradorit` | Labradorit (Plagioklas-Feldspat) |
| `atlas-lapislazuli` | Lapislazuli (Gestein aus Lazurit u. a.) |
| `atlas-lavendel` | Echter Lavendel (Lavandula angustifolia) |
| `atlas-linsen` | Linse (Lens culinaris) |
| `atlas-malachit` | Malachit (Malachit) |
| `atlas-mammutbaum` | Riesenmammutbaum (Sequoiadendron giganteum) |
| `atlas-obsidian` | Obsidian (Vulkanisches Glas) |
| `atlas-olivenbaum` | Olivenbaum (Olea europaea) |
| `atlas-pfefferminze` | Pfefferminze (Mentha × piperita) |
| `atlas-pyrit` | Pyrit (Pyrit) |
| `atlas-quarz` | Bergkristall (Quarz) (Quarz) |
| `atlas-rauchquarz` | Rauchquarz (Quarz (graubraune Varietät)) |
| `atlas-reishi` | Reishi (Glänzender Lackporling) (Ganoderma lucidum) |
| `atlas-ringelblume` | Ringelblume (Calendula officinalis) |
| `atlas-rosenquarz` | Rosenquarz (Quarz (rosa Varietät)) |
| `atlas-rosmarin` | Rosmarin (Salvia rosmarinus (Rosmarinus officinalis)) |
| `atlas-salbei` | Echter Salbei (Salvia officinalis) |
| `atlas-shiitake` | Shiitake (Lentinula edodes) |
| `atlas-spinat` | Spinat (Spinacia oleracea) |
| `atlas-steinpilz` | Gemeiner Steinpilz (Boletus edulis) |
| `atlas-teebaum` | Teebaum (Melaleuca alternifolia) |
| `atlas-tomate` | Tomate (Solanum lycopersicum) |
| `atlas-turmalin` | Schwarzer Turmalin (Schörl) (Turmalin-Gruppe (Schörl)) |
| `atlas-walnuss` | Walnuss (Juglans regia) |
| `atlas-weide` | Silberweide (Salix alba) |
| `atlas-zeder` | Libanonzeder (Cedrus libani) |
| `atlas-zitrone` | Zitrone (Citrus × limon) |

Insgesamt 437 Bilder. Starte mit Priorität 1 und prüfe zuerst **ein** Bild auf den Stil, bevor du den Rest erzeugst. Claude erzeugt keine Bilder.
