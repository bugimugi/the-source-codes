/**
 * The 118 chemical elements for the Mineral Atlas (src/ui/minerals.ts). Textbook data: names, atomic number, standard atomic mass
 * (rounded; a number in brackets is the mass number of the most stable isotope), category and place in the periodic table.
 * Source pending verification; the page says so. Nothing here is a health statement.
 */
export type ElementCat = "ak" | "ea" | "ub" | "pm" | "hm" | "nm" | "ha" | "eg" | "la" | "ac";

export const CAT_LABEL: Record<ElementCat, string> = {
  ak: "Alkalimetall", ea: "Erdalkalimetall", ub: "Übergangsmetall", pm: "Metall (p-Block)", hm: "Halbmetall", nm: "Nichtmetall",
  ha: "Halogen", eg: "Edelgas", la: "Lanthanoid (Seltene Erde)", ac: "Actinoid",
};
export const CAT_COLOR: Record<ElementCat, string> = {
  ak: "#e8704a", ea: "#e8a23a", ub: "#c9a02a", pm: "#8fb0a8", hm: "#6fb8a0", nm: "#58d6e8", ha: "#8f9bff", eg: "#c07bff", la: "#e87aa8", ac: "#b05a7a",
};

export interface Element { z: number; sym: string; name: string; mass: string; cat: ElementCat; col: number; row: number }

const RAW = `1|H|Wasserstoff|1,008|nm
2|He|Helium|4,0026|eg
3|Li|Lithium|6,94|ak
4|Be|Beryllium|9,0122|ea
5|B|Bor|10,81|hm
6|C|Kohlenstoff|12,011|nm
7|N|Stickstoff|14,007|nm
8|O|Sauerstoff|15,999|nm
9|F|Fluor|18,998|ha
10|Ne|Neon|20,180|eg
11|Na|Natrium|22,990|ak
12|Mg|Magnesium|24,305|ea
13|Al|Aluminium|26,982|pm
14|Si|Silizium|28,085|hm
15|P|Phosphor|30,974|nm
16|S|Schwefel|32,06|nm
17|Cl|Chlor|35,45|ha
18|Ar|Argon|39,95|eg
19|K|Kalium|39,098|ak
20|Ca|Calcium|40,078|ea
21|Sc|Scandium|44,956|ub
22|Ti|Titan|47,867|ub
23|V|Vanadium|50,942|ub
24|Cr|Chrom|51,996|ub
25|Mn|Mangan|54,938|ub
26|Fe|Eisen|55,845|ub
27|Co|Cobalt|58,933|ub
28|Ni|Nickel|58,693|ub
29|Cu|Kupfer|63,546|ub
30|Zn|Zink|65,38|ub
31|Ga|Gallium|69,723|pm
32|Ge|Germanium|72,630|hm
33|As|Arsen|74,922|hm
34|Se|Selen|78,971|nm
35|Br|Brom|79,904|ha
36|Kr|Krypton|83,798|eg
37|Rb|Rubidium|85,468|ak
38|Sr|Strontium|87,62|ea
39|Y|Yttrium|88,906|ub
40|Zr|Zirconium|91,224|ub
41|Nb|Niob|92,906|ub
42|Mo|Molybdän|95,95|ub
43|Tc|Technetium|[98]|ub
44|Ru|Ruthenium|101,07|ub
45|Rh|Rhodium|102,91|ub
46|Pd|Palladium|106,42|ub
47|Ag|Silber|107,87|ub
48|Cd|Cadmium|112,41|ub
49|In|Indium|114,82|pm
50|Sn|Zinn|118,71|pm
51|Sb|Antimon|121,76|hm
52|Te|Tellur|127,60|hm
53|I|Iod|126,90|ha
54|Xe|Xenon|131,29|eg
55|Cs|Caesium|132,91|ak
56|Ba|Barium|137,33|ea
57|La|Lanthan|138,91|la
58|Ce|Cer|140,12|la
59|Pr|Praseodym|140,91|la
60|Nd|Neodym|144,24|la
61|Pm|Promethium|[145]|la
62|Sm|Samarium|150,36|la
63|Eu|Europium|151,96|la
64|Gd|Gadolinium|157,25|la
65|Tb|Terbium|158,93|la
66|Dy|Dysprosium|162,50|la
67|Ho|Holmium|164,93|la
68|Er|Erbium|167,26|la
69|Tm|Thulium|168,93|la
70|Yb|Ytterbium|173,05|la
71|Lu|Lutetium|174,97|la
72|Hf|Hafnium|178,49|ub
73|Ta|Tantal|180,95|ub
74|W|Wolfram|183,84|ub
75|Re|Rhenium|186,21|ub
76|Os|Osmium|190,23|ub
77|Ir|Iridium|192,22|ub
78|Pt|Platin|195,08|ub
79|Au|Gold|196,97|ub
80|Hg|Quecksilber|200,59|ub
81|Tl|Thallium|204,38|pm
82|Pb|Blei|207,2|pm
83|Bi|Bismut|208,98|pm
84|Po|Polonium|[209]|pm
85|At|Astat|[210]|ha
86|Rn|Radon|[222]|eg
87|Fr|Francium|[223]|ak
88|Ra|Radium|[226]|ea
89|Ac|Actinium|[227]|ac
90|Th|Thorium|232,04|ac
91|Pa|Protactinium|231,04|ac
92|U|Uran|238,03|ac
93|Np|Neptunium|[237]|ac
94|Pu|Plutonium|[244]|ac
95|Am|Americium|[243]|ac
96|Cm|Curium|[247]|ac
97|Bk|Berkelium|[247]|ac
98|Cf|Californium|[251]|ac
99|Es|Einsteinium|[252]|ac
100|Fm|Fermium|[257]|ac
101|Md|Mendelevium|[258]|ac
102|No|Nobelium|[259]|ac
103|Lr|Lawrencium|[266]|ac
104|Rf|Rutherfordium|[267]|ub
105|Db|Dubnium|[268]|ub
106|Sg|Seaborgium|[269]|ub
107|Bh|Bohrium|[270]|ub
108|Hs|Hassium|[277]|ub
109|Mt|Meitnerium|[278]|ub
110|Ds|Darmstadtium|[281]|ub
111|Rg|Roentgenium|[282]|ub
112|Cn|Copernicium|[285]|ub
113|Nh|Nihonium|[286]|pm
114|Fl|Flerovium|[289]|pm
115|Mc|Moscovium|[290]|pm
116|Lv|Livermorium|[293]|pm
117|Ts|Tenness|[294]|ha
118|Og|Oganesson|[294]|eg`;

/** column (1-18) and row (1-7; 9 and 10 hold the lanthanoids and actinoids) in the periodic table */
function place(z: number): [number, number] {
  if (z === 1) return [1, 1];
  if (z === 2) return [18, 1];
  if (z <= 4) return [z - 2, 2];
  if (z <= 10) return [z + 8, 2];
  if (z <= 12) return [z - 10, 3];
  if (z <= 18) return [z, 3];
  if (z <= 36) return [z - 18, 4];
  if (z <= 54) return [z - 36, 5];
  if (z <= 56) return [z - 54, 6];
  if (z <= 71) return [z - 54, 9];
  if (z <= 86) return [z - 68, 6];
  if (z <= 88) return [z - 86, 7];
  if (z <= 103) return [z - 86, 10];
  return [z - 100, 7];
}

export const ELEMENTS: Element[] = RAW.split("\n").map((l) => {
  const [z, sym, name, mass, cat] = l.split("|");
  const [col, row] = place(Number(z));
  return { z: Number(z), sym, name, mass, cat: cat as ElementCat, col, row };
});

export type Filter = "alle" | "metalle" | "nichtmetalle" | "halogene" | "edelgase" | "erden" | "spuren";
export const FILTERS: { id: Filter; label: string }[] = [
  { id: "alle", label: "Alle" }, { id: "metalle", label: "Metalle" }, { id: "nichtmetalle", label: "Nichtmetalle" }, { id: "halogene", label: "Halogene" },
  { id: "edelgase", label: "Edelgase" }, { id: "erden", label: "Seltene Erden" }, { id: "spuren", label: "Spurenelemente" },
];

/** nutritional trace elements (textbook list; chromium and fluorine are classified differently by different sources) */
export const TRACE = ["Fe", "Zn", "Cu", "Mn", "I", "Se", "Mo", "Co", "Cr", "F"];

export function matches(e: Element, f: Filter): boolean {
  switch (f) {
    case "alle": return true;
    case "metalle": return ["ak", "ea", "ub", "pm", "la", "ac"].includes(e.cat);
    case "nichtmetalle": return e.cat === "nm";
    case "halogene": return e.cat === "ha";
    case "edelgase": return e.cat === "eg";
    case "erden": return e.cat === "la" || e.sym === "Sc" || e.sym === "Y";
    case "spuren": return TRACE.includes(e.sym);
  }
}

/** 94 elements occur in nature (the last two, neptunium and plutonium, only in traces); the rest was made artificially */
export const NATURAL_COUNT = 94;

/** the elements shown as cards in the first row, with a textbook sentence about their role in minerals */
export const FEATURED: { sym: string; text: string }[] = [
  { sym: "H", text: "Häufigstes Element des Universums. In Mineralen steckt es als Wasser (H₂O) und Hydroxid (OH⁻), z. B. in Gips (CaSO₄·2 H₂O)." },
  { sym: "C", text: "Bildet Graphit und Diamant (beide reiner Kohlenstoff mit verschiedener Kristallstruktur) und die Carbonate wie Calcit (CaCO₃)." },
  { sym: "O", text: "Häufigstes Element der Erdkruste (rund 46 Gewichtsprozent), meist in Oxiden und Silikaten gebunden, z. B. in Quarz (SiO₂)." },
  { sym: "Na", text: "Kommt im Steinsalz (Halit, NaCl) und in Feldspäten vor." },
  { sym: "Mg", text: "Bestandteil von Olivin, Dolomit und Talk; zentrales Atom des grünen Blattfarbstoffs Chlorophyll." },
  { sym: "Si", text: "Zweithäufigstes Element der Erdkruste (rund 28 Gewichtsprozent) und Grundbaustein der Silikate, zu denen Quarz und die Feldspäte gehören." },
  { sym: "Ca", text: "Bildet Calcit, Gips und Fluorit (CaF₂) und ist ein Hauptbestandteil von Knochen und Zähnen." },
  { sym: "Fe", text: "Steckt in Hämatit, Magnetit und Pyrit und bildet zusammen mit Nickel den Hauptteil des Erdkerns." },
  { sym: "Cu", text: "Kommt gediegen als Metall sowie in Malachit und Chalkopyrit vor; für den Körper ein Spurenelement." },
  { sym: "Zn", text: "Wird überwiegend aus Zinkblende (Sphalerit, ZnS) gewonnen; für den Körper ein Spurenelement." },
  { sym: "Ag", text: "Kommt gediegen und in Silbererzen wie Argentit vor; leitet Strom besser als jedes andere Metall." },
  { sym: "Au", text: "Kommt meist gediegen vor, oft in Quarzgängen, und ist chemisch sehr beständig." },
  { sym: "I", text: "Kommt in Spuren im Meerwasser und in Iodaten vor; für den Körper ein Spurenelement (Schilddrüsenhormone)." },
];
