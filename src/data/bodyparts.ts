/**
 * Names of the parts in the 3D body (public/assets/models/skeleton.glb and muscles.glb, made from BodyParts3D 4.0, CC BY 4.0,
 * (c) The Database Center for Life Science). A mesh is called "<region>:<structure>:isa:<id>"; the structure is an English
 * name from the model. The German names are textbook nomenclature written for this page and not yet reviewed by experts.
 */
export type PartKind = "bone" | "muscle" | "soft";
export interface PartInfo { de: string; en: string; kind: PartKind; side: "" | "rechts" | "links"; known: boolean }

const ORD: Record<string, number> = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, eleventh: 11, twelfth: 12 };
const FINGER: Record<string, string> = { thumb: "Daumen", "index-finger": "Zeigefinger", "middle-finger": "Mittelfinger", "ring-finger": "Ringfinger", "little-finger": "Kleinfinger" };
const TOE: Record<string, string> = { "big-toe": "Großzehe", "second-toe": "2. Zehe", "third-toe": "3. Zehe", "fourth-toe": "4. Zehe", "little-toe": "Kleinzehe" };
const PHALANX: Record<string, string> = { proximal: "Grundglied", middle: "Mittelglied", distal: "Endglied" };

const NAMES: Record<string, string> = {
  // bones
  "intermediate-cuneiform": "Mittleres Keilbein (Fuß)", "lateral-cuneiform-bone": "Äußeres Keilbein (Fuß)", "medial-cuneiform-bone": "Inneres Keilbein (Fuß)", calcaneus: "Fersenbein (Calcaneus)", "cuboid-bone": "Würfelbein",
  "navicular-bone-of-foot": "Kahnbein (Fuß)", "sesamoid-bone-of-foot": "Sesambein (Fuß)", talus: "Sprungbein (Talus)", ulna: "Elle (Ulna)", radius: "Speiche (Radius)", scaphoid: "Kahnbein (Hand)", capitate: "Kopfbein", hamate: "Hakenbein",
  lunate: "Mondbein", pisiform: "Erbsenbein", trapezium: "Großes Vieleckbein", trapezoid: "Kleines Vieleckbein", triquetral: "Dreieckbein", occiput: "Hinterhauptbein", atlas: "Atlas (1. Halswirbel)", axis: "Axis (2. Halswirbel)",
  ethmoid: "Siebbein", "frontal-bone": "Stirnbein", "hyoid-bone": "Zungenbein", "inferior-nasal-concha": "Untere Nasenmuschel", "lacrimal-bone": "Tränenbein", mandible: "Unterkiefer", maxilla: "Oberkiefer", "nasal-bone": "Nasenbein",
  "palatine-bone": "Gaumenbein", "parietal-bone": "Scheitelbein", "sphenoid-bone": "Keilbein (Schädel)", "temporal-bone": "Schläfenbein", vomer: "Pflugscharbein", "zygomatic-bone": "Jochbein", femur: "Oberschenkelknochen (Femur)",
  "hip-bone": "Hüftbein", tibia: "Schienbein (Tibia)", fibula: "Wadenbein (Fibula)", patella: "Kniescheibe (Patella)", scapula: "Schulterblatt (Scapula)", humerus: "Oberarmknochen (Humerus)", clavicle: "Schlüsselbein (Clavicula)",
  sacrum: "Kreuzbein (Os sacrum)",
  // muscles
  "tibialis-posterior": "Hinterer Schienbeinmuskel", sternocleidomastoid: "Kopfwender (M. sternocleidomastoideus)", "gluteus-medius": "Mittlerer Gesäßmuskel", gastrocnemius: "Zwillingswadenmuskel (M. gastrocnemius)", soleus: "Schollenmuskel (M. soleus)",
  plantaris: "Plantarismuskel", "tibialis-anterior": "Vorderer Schienbeinmuskel", "fibularis-longus": "Langer Wadenbeinmuskel", "fibularis-brevis": "Kurzer Wadenbeinmuskel", "flexor-digitorum-longus": "Langer Zehenbeuger",
  "flexor-digitorum-brevis": "Kurzer Zehenbeuger", "extensor-digitorum-longus": "Langer Zehenstrecker", "biceps-brachii": "Armbeuger (M. biceps brachii)", "triceps-brachii": "Armstrecker (M. triceps brachii)", brachioradialis: "Oberarmspeichenmuskel",
  "extensor-carpi-radialis-longus": "Langer speichenseitiger Handstrecker", "extensor-carpi-radialis-brevis": "Kurzer speichenseitiger Handstrecker", "extensor-digitorum": "Fingerstrecker", "flexor-carpi-radialis": "Speichenseitiger Handbeuger",
  "pronator-quadratus": "Quadratischer Einwärtsdreher", "gluteus-maximus": "Großer Gesäßmuskel", "gluteus-minimus": "Kleiner Gesäßmuskel", "psoas-major": "Großer Lendenmuskel", iliacus: "Darmbeinmuskel", piriformis: "Birnenförmiger Muskel (M. piriformis)",
  "obturator-internus": "Innerer Hüftlochmuskel", quadriceps: "Oberschenkelstrecker (M. quadriceps femoris)", "biceps-femoris": "Zweiköpfiger Oberschenkelmuskel", semitendinosus: "Halbsehnenmuskel", semimembranosus: "Plattsehnenmuskel",
  "adductor-longus": "Langer Oberschenkelanzieher", "adductor-brevis": "Kurzer Oberschenkelanzieher", "adductor-magnus": "Großer Oberschenkelanzieher", sartorius: "Schneidermuskel", gracilis: "Schlanker Schenkelmuskel", popliteus: "Kniekehlenmuskel",
  deltoid: "Deltamuskel (M. deltoideus)", supraspinatus: "Obergrätenmuskel", infraspinatus: "Untergrätenmuskel", subscapularis: "Unterschulterblattmuskel", "teres-minor": "Kleiner Rundmuskel", "teres-major": "Großer Rundmuskel",
  trapezius: "Kapuzenmuskel (M. trapezius)", "serratus-anterior": "Vorderer Sägemuskel", "levator-scapulae": "Schulterblattheber", "rhomboid-major": "Großer Rautenmuskel", "external-oblique": "Äußerer schräger Bauchmuskel",
  "erector-spinae": "Rückenstrecker (M. erector spinae)", "pectoralis-major": "Großer Brustmuskel", "pectoralis-minor": "Kleiner Brustmuskel", "finger-flexors": "Fingerbeuger", "extensor-carpi-ulnaris": "Ellenseitiger Handstrecker",
  "palmaris-longus": "Langer Hohlhandmuskel", supinator: "Auswärtsdreher (M. supinator)",
  // connective tissue
  "calcaneal-tendon": "Achillessehne", "intermediate-tendon": "Zwischensehne (Zungenbeinmuskel)", "intervertebral-symphysis": "Bandscheibe (Symphyse)", "long-plantar-ligament": "Langes Fußsohlenband",
  "interosseous-membrane-of-forearm": "Zwischenknochenmembran (Unterarm)", "stylohyoid-ligament": "Griffel-Zungenbein-Band", "interosseous-membrane-of-leg": "Zwischenknochenmembran (Unterschenkel)",
  "flexor-retinaculum-of-wrist": "Haltband der Handbeuger (Retinaculum flexorum)",
};

const MUSCLES = new Set(["tibialis-posterior", "sternocleidomastoid", "gluteus-medius", "gastrocnemius", "soleus", "plantaris", "tibialis-anterior", "fibularis-longus", "fibularis-brevis", "flexor-digitorum-longus", "flexor-digitorum-brevis", "extensor-digitorum-longus", "biceps-brachii", "triceps-brachii", "brachioradialis", "extensor-carpi-radialis-longus", "extensor-carpi-radialis-brevis", "extensor-digitorum", "flexor-carpi-radialis", "pronator-quadratus", "gluteus-maximus", "gluteus-minimus", "psoas-major", "iliacus", "piriformis", "obturator-internus", "quadriceps", "biceps-femoris", "semitendinosus", "semimembranosus", "adductor-longus", "adductor-brevis", "adductor-magnus", "sartorius", "gracilis", "popliteus", "deltoid", "supraspinatus", "infraspinatus", "subscapularis", "teres-minor", "teres-major", "trapezius", "serratus-anterior", "levator-scapulae", "rhomboid-major", "external-oblique", "erector-spinae", "pectoralis-major", "pectoralis-minor", "finger-flexors", "extensor-carpi-ulnaris", "palmaris-longus", "supinator"]);

const readable = (s: string) => s.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());

/** the structure token of a mesh name ("knee:tibia:isa:FJ3282" gives "tibia") */
export const structureOf = (meshName: string) => meshName.split(":")[1] ?? meshName;

/** German and English name, kind and side of one mesh; `x` is the mesh centre in the model (negative = the person's right side) */
export function partInfo(meshName: string, x: number): PartInfo {
  const s = structureOf(meshName);
  const m = (re: RegExp) => re.exec(s);
  const side: PartInfo["side"] = Math.abs(x) < 0.012 ? "" : x < 0 ? "rechts" : "links";
  const en = readable(s);
  const done = (de: string, known = true): PartInfo => ({ de, en, kind: MUSCLES.has(s) ? "muscle" : /disk|symphysis|ligament|membrane|retinaculum|tendon/.test(s) ? "soft" : "bone", side, known });
  if (NAMES[s]) return done(NAMES[s]);
  let r: RegExpExecArray | null;
  if ((r = m(/^(\w+)-(cervical|thoracic|lumbar)-vertebra$/))) return done(`${ORD[r[1]]}. ${{ cervical: "Halswirbel", thoracic: "Brustwirbel", lumbar: "Lendenwirbel" }[r[2]]}`);
  if ((r = m(/^(\w+)-rib$/))) return done(`${ORD[r[1]]}. Rippe`);
  if ((r = m(/^(\w+)-(cervical|thoracic|lumbar)-intervertebral-disk$/))) return done(`Bandscheibe (${ORD[r[1]]}. ${{ cervical: "Hals", thoracic: "Brust", lumbar: "Lenden" }[r[2]]}wirbel)`);
  if ((r = m(/^intervertebral-disk-of-(\w+)$/))) return done(`Bandscheibe (${r[1] === "axis" ? "Axis" : r[1]})`);
  if ((r = m(/^(\w+)-metatarsal(-bone)?$/))) return done(`Mittelfußknochen ${["", "I", "II", "III", "IV", "V"][ORD[r[1]]]}`);
  if ((r = m(/^(\w+)-metacarpal-bone$/))) return done(`Mittelhandknochen ${["", "I", "II", "III", "IV", "V"][ORD[r[1]]]}`);
  if ((r = m(/^(proximal|middle|distal)-phalanx-of-(.+)$/))) {
    const who = TOE[r[2]] ?? FINGER[r[2]];
    return done(`${PHALANX[r[1]]} (${who ?? r[2]})`, !!who);
  }
  return done(`${en} (engl.)`, false);
}

export const BODY_MODEL_CREDIT = "3D-Modell: BodyParts3D, © The Database Center for Life Science, Lizenz CC BY 4.0 (Auswahl von Knochen, Bändern und Muskeln, vereinfacht).";
