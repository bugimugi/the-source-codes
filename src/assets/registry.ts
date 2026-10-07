/**
 * Image slots. Single source of truth for every image position on the site: name, fixed format, background type,
 * priority, page and a prompt core. `npm run assets:list` generates docs/ASSET-LIST.md from this file.
 * Files live in public/assets/ as <name>.avif|webp|jpg|png, optionally with width variants <name>-<width>.<ext>.
 * Until a file exists the slot shows its fallback. Atlas pictures use the dynamic name `atlas-<id>` (see slotDef).
 */
export interface SlotDef {
  w: number;
  h: number;
  /** "black": glowing motif on pure black, blended with `screen`; "scene": opaque image */
  bg: "black" | "scene";
  /** portrait variant used below 700 px viewport width */
  mobile?: string;
  /** 1 = needed first (hero), 6 = last */
  prio: number;
  page: string;
  /** English prompt core; the shared style anchor is added by docs/ASSET-LIST.md */
  prompt: string;
}

const d = (page: string, prio: number, bg: SlotDef["bg"], w: number, h: number, prompt: string, mobile?: string): SlotDef => ({ w, h, bg, mobile, prio, page, prompt });
const HOME = "Startseite";
const CULT = "Alte Kulturen";
const ENERGY = "Freie Energie";

export const SLOTS = {
  // ---- Startseite: hero (priority 1)
  "hero-world": d(HOME, 1, "scene", 3840, 2160, "wide cinematic night landscape, ancient temple city and dense jungle with a waterfall on the far left, pyramids and misty mountains on the far right, deep starry sky with planets, large calm dark area on the left 40 percent for text, empty space in the right center for a figure, no people", "hero-mobile"),
  "hero-figure": d(HOME, 1, "black", 2400, 3000, "profile of a serene woman with a crown of lush plants and flowers, beside a translucent glowing human body hologram with visible organs, neural pathways and a DNA helix, scientific hologram, on a pure black background"),
  "hero-planets": d(HOME, 1, "black", 2400, 1600, "four separate detailed planets and moons with atmosphere glow, different sizes, wide spacing, on a pure black background"),
  "hero-dna": d(HOME, 1, "black", 1200, 2400, "glowing double helix DNA strand, gold and cyan, vertical, elegant, on a pure black background"),
  "hero-lotus": d(HOME, 1, "black", 1600, 1600, "cluster of glowing luminous lotus and tropical flowers in pink and amber, on a pure black background"),
  "hero-bokeh": d(HOME, 1, "black", 3840, 2160, "floating golden dust particles and soft bokeh lights, sparse, dark, on a pure black background"),
  "hero-mobile": d(HOME, 1, "scene", 1080, 1920, "portrait version: same figure and world, figure in the upper half, dark calm area in the lower half for text"),

  // ---- Startseite: knowledge matrix tiles (priority 2), portrait tiles
  "tile-pflanzen": d(HOME, 2, "scene", 1000, 1200, "lush green medicinal plant with large leaves and small flowers, glowing, dark background"),
  "tile-baeume": d(HOME, 2, "scene", 1000, 1200, "ancient majestic tree with wide crown at dusk, golden light, dark background"),
  "tile-gemuese-obst": d(HOME, 2, "scene", 1000, 1200, "colourful arrangement of fresh fruit and vegetables, rich colours, dark background"),
  "tile-pilze": d(HOME, 2, "scene", 1000, 1200, "cluster of medicinal mushrooms on moss, soft glow, dark forest background"),
  "tile-mineralien": d(HOME, 2, "scene", 1000, 1200, "raw mineral crystals in blue and white with fine facets, glowing, dark background"),
  "tile-kristalle": d(HOME, 2, "scene", 1000, 1200, "large amethyst crystal cluster in violet, glowing, dark background"),
  "tile-koerper": d(HOME, 2, "scene", 1000, 1200, "translucent human torso with glowing organs, blue and orange, dark background"),
  "tile-naehrstoffe": d(HOME, 2, "scene", 1000, 1200, "glowing spheres in different colours representing vitamins and minerals, molecular look, dark background"),
  "tile-krankheiten": d(HOME, 2, "scene", 1000, 1200, "human silhouette with glowing red and blue signal lines, scientific, dark background"),
  "tile-atem": d(HOME, 2, "scene", 1000, 1200, "person meditating in lotus pose with soft light rays, dark background"),
  "tile-frequenzen": d(HOME, 2, "scene", 1000, 1200, "glowing concentric sound waves and geometric ripples in violet and blue, dark background"),
  "tile-geometrie": d(HOME, 2, "scene", 1000, 1200, "golden flower of life sacred geometry, glowing lines, dark background"),
  "tile-chakren": d(HOME, 2, "scene", 1000, 1200, "meditating figure with seven glowing colourful energy centres along the spine, dark background"),
  "tile-kulturen": d(HOME, 2, "scene", 1000, 1200, "ancient Egyptian pyramids and temple at golden hour, dramatic sky"),
  "tile-orte": d(HOME, 2, "scene", 1000, 1200, "ancient standing stones at dusk, dramatic sky, mystic atmosphere"),
  "tile-lab": d(HOME, 2, "scene", 1000, 1200, "dramatic collage of the earth's natural energy: a bright sun above a lightning storm, a waterfall and wind turbines, dark background"),

  // ---- Startseite: body atlas, plant atlas, sections (priority 3)
  "body-front": d(HOME, 3, "black", 2400, 3600, "translucent human body, front view, anatomical, glowing blue with organs visible in red and orange, on a pure black background"),
  "nutrient-ashwagandha": d(HOME, 3, "black", 800, 800, "ashwagandha root and green leaves, glowing, on a pure black background"),
  "nutrient-kurkuma": d(HOME, 3, "black", 800, 800, "fresh turmeric roots and powder, warm orange glow, on a pure black background"),
  "nutrient-ingwer": d(HOME, 3, "black", 800, 800, "fresh ginger root pieces, warm glow, on a pure black background"),
  "nutrient-knoblauch": d(HOME, 3, "black", 800, 800, "garlic bulbs and cloves, soft glow, on a pure black background"),
  "nutrient-gruener-tee": d(HOME, 3, "black", 800, 800, "green tea leaves, fresh and glowing, on a pure black background"),
  "nutrient-magnesium": d(HOME, 3, "black", 800, 800, "glowing blue molecule sphere with orbiting dots, on a pure black background"),
  "nutrient-omega3": d(HOME, 3, "black", 800, 800, "golden drops of oil with a nut, glowing, on a pure black background"),
  "nutrient-vitamin-d": d(HOME, 3, "black", 800, 800, "glowing sun symbol over a drop, warm gold, on a pure black background"),
  "condition-bg": d(HOME, 3, "scene", 1600, 900, "profile of a calm young woman with a glowing network of light around her head, dark background, space on the right"),
  "freq-orb": d(HOME, 3, "black", 1200, 1200, "glowing violet sacred geometry sphere with a meditating silhouette in front, on a pure black background"),
  "band-geometrie": d(HOME, 3, "scene", 1800, 600, "golden flower of life geometry glowing on a dark background, space on the left for text"),
  "band-kulturen": d(HOME, 3, "scene", 1800, 600, "ancient pyramids and temple ruins at golden hour, space on the left for text"),
  "band-orte": d(HOME, 3, "scene", 1800, 600, "sacred mountain site with ancient terraces in mist, space on the left for text"),
  "diy-extrakte": d(HOME, 3, "scene", 800, 1000, "glass bottles with plant extracts and herbs on a dark wooden table"),
  "diy-wasser": d(HOME, 3, "scene", 800, 1000, "glowing structured water in a glass with a swirling vortex, dark background"),
  "diy-raeuchern": d(HOME, 3, "scene", 800, 1000, "smoking incense bowl with herbs, atmospheric, dark background"),
  "diy-mikroskop": d(HOME, 3, "scene", 800, 1000, "antique microscope with warm light, dark background"),
  "library-bg": d(HOME, 3, "scene", 1800, 900, "old library with tall shelves and an open ancient book in warm light, space on the left for text"),
  "connected-earth": d(HOME, 3, "scene", 1800, 900, "Earth from space with a glowing network of connections across continents, dark space"),

  // ---- later pages (priority 4–6)
  "organ-heart": d("Körper", 4, "black", 1600, 1600, "one anatomical human heart, realistic but translucent and softly glowing, on a pure black background"),
  "organ-brain": d("Körper", 4, "black", 1600, 1600, "one anatomical human brain, realistic but translucent and softly glowing, on a pure black background"),
  "organ-lungs": d("Körper", 4, "black", 1600, 1600, "anatomical human lungs, translucent and softly glowing, on a pure black background"),
  "organ-liver": d("Körper", 4, "black", 1600, 1600, "anatomical human liver, translucent and softly glowing, on a pure black background"),
  "organ-stomach": d("Körper", 4, "black", 1600, 1600, "anatomical human stomach, translucent and softly glowing, on a pure black background"),
  "organ-intestines": d("Körper", 4, "black", 1600, 1600, "anatomical human intestines, translucent and softly glowing, on a pure black background"),
  "organ-kidneys": d("Körper", 4, "black", 1600, 1600, "anatomical human kidneys, translucent and softly glowing, on a pure black background"),
  "organ-skin": d("Körper", 4, "black", 1600, 1600, "cross-section of human skin layers, translucent and softly glowing, on a pure black background"),
  "organ-immune": d("Körper", 4, "black", 1600, 1600, "immune cells and lymph network, translucent and glowing, on a pure black background"),
  "organ-endocrine": d("Körper", 4, "black", 1600, 1600, "endocrine glands (pituitary, thyroid) as glowing anatomical illustration, on a pure black background"),
  "heart-botanical": d("Körper", 4, "black", 2000, 2400, "anatomical heart whose vessels grow into botanical plants and flowers, glowing, on a pure black background"),
  "globe-earth": d("Orte", 5, "black", 3000, 3000, "holographic Earth globe with glowing network lines connecting glowing points, on a pure black background"),
  "site-giza": d("Orte", 5, "scene", 1600, 1000, "Giza pyramids at dusk, dramatic light (better: own or freely licensed photo)"),
  "site-machu-picchu": d("Orte", 5, "scene", 1600, 1000, "Machu Picchu in morning mist (better: own or freely licensed photo)"),
  "site-angkor-wat": d("Orte", 5, "scene", 1600, 1000, "Angkor Wat at sunrise (better: own or freely licensed photo)"),
  "site-goebekli-tepe": d("Orte", 5, "scene", 1600, 1000, "Göbekli Tepe stone pillars (better: own or freely licensed photo)"),
  "site-malta-hypogeum": d("Orte", 5, "scene", 1600, 1000, "carved chamber of the Hypogeum of Malta, warm light"),
  "site-stonehenge": d("Orte", 5, "scene", 1600, 1000, "Stonehenge at dusk (better: own or freely licensed photo)"),
  "site-istanbul-mosque-dome": d("Orte", 5, "scene", 1600, 1000, "Ottoman mosque dome interior with golden light and geometric patterns, no people"),
  "diagram-dome-acoustics": d("Orte", 5, "black", 1600, 1600, "cross-section of a dome with sound waves, blueprint style, gold lines, on a pure black background"),
  "cymatics-1": d("Frequenz", 5, "black", 1600, 1600, "cymatic sand pattern, sacred geometry, glowing, on a pure black background"),
  "cymatics-2": d("Frequenz", 5, "black", 1600, 1600, "cymatic water pattern, concentric symmetry, glowing, on a pure black background"),
  "cymatics-3": d("Frequenz", 5, "black", 1600, 1600, "cymatic membrane pattern with fine nodal lines, glowing, on a pure black background"),
  "lab-waveform-bg": d("Frequenz", 5, "black", 3840, 1000, "wide glowing sine waves in cyan and gold, on a pure black background"),

  // ---- Alte Kulturen (priority 6): illustrations of places and objects; no readable text, no real living people
  "cult-hero": d(CULT, 6, "scene", 3200, 1500, "ancient world panorama at sunset, pyramids and a river valley in the distance, a carved stone wall at the right edge, a hooded wanderer seen from behind on the left, dark calm area on the left for text"),
  "cult-01": d(CULT, 6, "scene", 1800, 700, "Göbekli Tepe at golden hour, circle of large T-shaped limestone pillars with animal reliefs, wide landscape, no people"),
  "cult-02": d(CULT, 6, "scene", 1800, 700, "Stonehenge and a passage tomb at dusk with a low sun, early Neolithic landscape, no people"),
  "cult-03": d(CULT, 6, "scene", 1800, 700, "Giza pyramids and the Sphinx at sunset, warm desert light, no people"),
  "cult-04": d(CULT, 6, "scene", 1800, 700, "Mesopotamian ziggurat beside a river at dusk, mud-brick city, clay tablets in the foreground, no people"),
  "cult-05": d(CULT, 6, "scene", 1800, 700, "Indus Valley city of Mohenjo-daro, brick streets and the Great Bath at evening, no people"),
  "cult-06": d(CULT, 6, "scene", 1800, 700, "ancient Chinese landscape with a pagoda, terracotta warriors in rows and misty mountains, no real people"),
  "cult-07": d(CULT, 6, "scene", 1800, 700, "Maya step pyramid in the jungle at sunrise, stone relief of a calendar in the foreground, no people"),
  "cult-08": d(CULT, 6, "scene", 1800, 700, "Petra Treasury carved in rose-red rock with a Roman aqueduct and Inca stone walls blended into one dusk scene, no people"),
  "cult-theme-architektur": d(CULT, 6, "scene", 600, 600, "monumental ancient stone architecture, pyramids and temple columns, warm light"),
  "cult-theme-technologie": d(CULT, 6, "scene", 600, 600, "ancient bronze gear mechanism like the Antikythera device, close-up, warm light"),
  "cult-theme-spiritualitaet": d(CULT, 6, "scene", 600, 600, "ancient temple interior with candle light and carved reliefs, no people"),
  "cult-theme-astronomie": d(CULT, 6, "scene", 600, 600, "ancient stone observatory under a starry sky with a bright planet, no people"),
  "cult-theme-gesellschaft": d(CULT, 6, "scene", 600, 600, "ancient market city street from above at dusk, clay houses, no recognisable faces"),
  "cult-theme-artefakte": d(CULT, 6, "scene", 600, 600, "clay tablet with cuneiform and a carved stone seal on dark cloth, close-up"),
  "cult-theme-mythen": d(CULT, 6, "scene", 600, 600, "winged guardian relief of ancient Mesopotamia, glowing gold on dark stone"),
  "cult-theme-verborgenes": d(CULT, 6, "scene", 600, 600, "narrow ancient stone passage leading to a lit chamber, mysterious, no people"),

  // ---- Freie Energie der Erde (priority 7)
  "energy-hero": d(ENERGY, 7, "scene", 3200, 1400, "epic panorama of earth's natural energies: bright sun and aurora over mountains, a thunderstorm with lightning at the right, a waterfall and river on the left, wind turbines, a small volcano, dark calm area on the left for text, no people"),
  "energy-src-sonne": d(ENERGY, 7, "scene", 700, 540, "radiant sun over a landscape with solar panels at golden hour"),
  "energy-src-blitz": d(ENERGY, 7, "scene", 700, 540, "violet lightning storm over dark clouds"),
  "energy-src-wasser": d(ENERGY, 7, "scene", 700, 540, "powerful waterfall in a green valley"),
  "energy-src-meer": d(ENERGY, 7, "scene", 700, 540, "huge turquoise ocean wave curling, backlit"),
  "energy-src-wind": d(ENERGY, 7, "scene", 700, 540, "wind turbines on a hill in dramatic evening light"),
  "energy-src-geothermie": d(ENERGY, 7, "scene", 700, 540, "erupting volcano with glowing lava at dusk"),
  "energy-src-magnetfeld": d(ENERGY, 7, "scene", 700, 540, "earth from space with glowing blue magnetic field lines and aurora"),
  "energy-topic-atmosphaere": d(ENERGY, 7, "scene", 1200, 700, "earth atmosphere seen from the side with layered blue bands and a starry sky above, curved horizon"),
  "energy-topic-gewitter": d(ENERGY, 7, "scene", 1200, 700, "huge supercell thundercloud with branching lightning bolts over a plain"),
  "energy-topic-wasserkreislauf": d(ENERGY, 7, "scene", 1200, 700, "waterfall and river valley with clouds forming above, water cycle atmosphere"),
  "energy-topic-elektrokultur": d(ENERGY, 7, "scene", 1200, 700, "cross-section of garden soil with plant roots and a copper spiral coil, glowing fine lines"),
  "energy-topic-erdrotation": d(ENERGY, 7, "scene", 1200, 700, "planet earth with glowing blue magnetic field lines, seen from space"),
  "energy-topic-erdung": d(ENERGY, 7, "scene", 1200, 700, "bare feet standing on green grass and soil, soft morning light, close-up, subtle glowing lines in the ground"),
  "energy-topic-schmuck": d(ENERGY, 7, "scene", 1200, 700, "gold, silver and copper bracelets and gemstone rings on dark cloth, warm light, no hands"),
  "energy-topic-tesla": d(ENERGY, 7, "scene", 1200, 700, "tall early-1900s transmission tower with a large dome and blue electric discharge at dusk, no people"),
} as const satisfies Record<string, SlotDef>;

export type SlotName = keyof typeof SLOTS;

/** Pictures for atlas entries are generated per entry: `atlas-<id>`, motif on black, square. */
export const ATLAS_SLOT: SlotDef = { w: 1000, h: 1000, bg: "black", prio: 3, page: "Atlas", prompt: "one botanical or mineral subject, scientific illustration meets glowing light, on a pure black background" };

export function slotDef(name: string): SlotDef | undefined {
  return (SLOTS as Record<string, SlotDef>)[name] ?? (name.startsWith("atlas-") ? ATLAS_SLOT : undefined);
}
