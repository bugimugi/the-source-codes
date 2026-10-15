import {
  APPLICATIONS, COMPOUNDS, COMPOUND_TABS, COMPOUND_THUMBS, CULTURES, ECOLOGY, GEO, GLANCE, GROUPS, HEALTH_AREAS, LIFECYCLE, MUSHROOMS_NOTICE, NETWORK, POPULAR,
  RESEARCH, STUDY_CLAIMS, TAGLINE,
} from "./mushrooms.ts";
import { ICON } from "../ui/icons.ts";

/** texts of the page must stay free of dosages and promises of healing (CLAUDE.md, Schutzlinie 3) */
const DOSAGE = /\d+\s?(mg|g|kg|ml|l|µg|mcg|tropfen|kapseln?|tabletten?|tl|el|tassen?|esslöffel|teelöffel)\b/i;
const PROMISE = /\b(heilt|heilen|garantiert|wundermittel|stärkt|stärken das|unterstützt|beugt vor|hilft)\b/i;
/** headings and short labels must not name an effect ("Wirkung", "Wirkstoffe", "heilend"); effects only appear as claims with a level */
const TITLE_EFFECT = /(wirkung|wirkstoff|heilend|heilkraft|gesundheitsfördernd)/i;

/**
 * Checks the Pilz Atlas page (src/data/mushrooms.ts): every member, claim, atlas id, picture slot and icon exists; mushroom categories hold
 * only entries of the category "pilz"; the categories without atlas entries (psychoaktiv, Schimmel, Leuchtpilze) stay "soon" and empty;
 * positions lie on the picture; texts carry no dosage and no promise of healing; the safety sentence about wild mushrooms is present.
 * `pilzIds`: ids of the atlas entries of the category "pilz"; `atlasIds`: all atlas ids; `claimIds`: published claims; `slotExists`: registry lookup.
 */
export function validateMushroomPage(pilzIds: ReadonlySet<string>, atlasIds: ReadonlySet<string>, claimIds: ReadonlySet<string>, slotExists: (name: string) => boolean): string[] {
  const errors: string[] = [];
  const at = (m: string) => errors.push(`Pilz Atlas: ${m}`);
  const icon = (n: string, w: string) => { if (!Object.hasOwn(ICON, n)) at(`${w}: Icon "${n}" gibt es nicht in src/ui/icons.ts`); };
  const slot = (n: string, w: string) => { if (!slotExists(n)) at(`${w}: Bildplatz "${n}" fehlt in src/assets/registry.ts`); };
  const claim = (id: string | undefined, w: string) => { if (id && !claimIds.has(id)) at(`${w}: Aussage "${id}" ist nicht veröffentlicht`); };
  const pos = (p: readonly number[], w: string) => { if (p.length !== 2 || p.some((v) => v < 0 || v > 100)) at(`${w}: Position außerhalb des Bildes (0 bis 100)`); };
  const texts: { where: string; value: string }[] = [{ where: "MUSHROOMS_NOTICE", value: MUSHROOMS_NOTICE }];

  const ids = new Set<string>();
  for (const g of GROUPS) {
    if (ids.has(g.id)) at(`Kategorie "${g.id}" doppelt`);
    ids.add(g.id);
    icon(g.icon, `Kategorie ${g.id}`); slot(g.slot, `Kategorie ${g.id}`);
    if (g.soon && g.members.length) at(`Kategorie ${g.id}: "in Vorbereitung", hat aber Einträge`);
    if (!g.soon && !g.members.length) at(`Kategorie ${g.id}: keine Einträge (oder in Vorbereitung setzen)`);
    for (const m of g.members) { if (!pilzIds.has(m)) at(`Kategorie ${g.id}: "${m}" ist kein Pilz-Eintrag im Atlas`); }
  }
  const psycho = GROUPS.find((g) => g.id === "psycho");
  if (!psycho || !psycho.soon || psycho.members.length) at('Kategorie "psycho" muss „in Vorbereitung“ und leer bleiben (keine Inhalte zu berauschenden Pilzen)');

  for (const id of POPULAR) if (!pilzIds.has(id)) at(`POPULAR: "${id}" ist kein Pilz-Eintrag im Atlas`);
  for (const id of Object.keys(TAGLINE)) if (!atlasIds.has(id)) at(`TAGLINE: "${id}" gibt es im Atlas nicht`);
  for (const id of POPULAR) if (!TAGLINE[id]) at(`TAGLINE: für "${id}" fehlt das Stichwort`);
  for (const g of GLANCE) { icon(g.icon, `GLANCE ${g.title}`); texts.push({ where: `GLANCE ${g.title}`, value: `${g.title} ${g.sub}` }); }
  const labels: { where: string; value: string }[] = [
    ...GROUPS.map((g) => ({ where: `Kategorie ${g.id}`, value: `${g.title} ${g.sub}` })), ...GLANCE.map((g) => ({ where: `GLANCE ${g.title}`, value: `${g.title} ${g.sub}` })),
    ...NETWORK.map((p) => ({ where: `NETWORK ${p.id}`, value: `${p.title} ${p.sub}` })), ...GEO.map((g) => ({ where: `GEO ${g.id}`, value: `${g.title} ${g.sub}` })),
    ...COMPOUNDS.map((c) => ({ where: `COMPOUNDS ${c.id}`, value: `${c.title} ${c.sub}` })), ...CULTURES.map((c) => ({ where: `CULTURES ${c.id}`, value: `${c.title} ${c.sub}` })),
    ...ECOLOGY.map((c) => ({ where: `ECOLOGY ${c.id}`, value: `${c.title} ${c.sub}` })), ...APPLICATIONS.map((c) => ({ where: `APPLICATIONS ${c.id}`, value: `${c.title} ${c.sub}` })),
    ...RESEARCH.map((c) => ({ where: `RESEARCH ${c.id}`, value: `${c.title} ${c.sub}` })), ...HEALTH_AREAS.map((a) => ({ where: `HEALTH_AREAS ${a.id}`, value: a.title })),
  ];
  for (const l of labels) if (TITLE_EFFECT.test(l.value)) at(`${l.where}: Überschrift oder Stichwort nennt eine Wirkung („${l.value}“)`);

  const parts = new Set<string>();
  for (const p of NETWORK) {
    if (parts.has(p.id)) at(`NETWORK "${p.id}" doppelt`);
    parts.add(p.id);
    icon(p.icon, `NETWORK ${p.id}`); claim(p.claim, `NETWORK ${p.id}`); pos(p.at, `NETWORK ${p.id} (at)`); pos(p.to, `NETWORK ${p.id} (to)`);
    for (const a of p.atlas ?? []) if (!pilzIds.has(a)) at(`NETWORK ${p.id}: "${a}" ist kein Pilz-Eintrag`);
    texts.push({ where: `NETWORK ${p.id}`, value: p.text });
  }
  if (NETWORK.length !== 6) at("NETWORK braucht sechs Punkte (wie im Entwurf)");
  if (!NETWORK.some((p) => p.claim === "baum-mykorrhiza")) at('NETWORK: die Aussage "baum-mykorrhiza" (Pilznetzwerk, Hypothese) muss bei Signalübertragung oder Netzwerk stehen');
  for (const s of LIFECYCLE) { icon(s.icon, `LIFECYCLE ${s.id}`); pos(s.at, `LIFECYCLE ${s.id}`); texts.push({ where: `LIFECYCLE ${s.id}`, value: s.text }); }
  if (LIFECYCLE.length !== 5) at("LIFECYCLE braucht fünf Stationen");
  for (const g of GEO) {
    icon(g.icon, `GEO ${g.id}`); slot(g.slot, `GEO ${g.id}`); claim(g.claim, `GEO ${g.id}`);
    if (!g.claim) at(`GEO ${g.id}: Deutungen brauchen eine Aussage mit Belegstufe`);
    texts.push({ where: `GEO ${g.id}`, value: g.text });
  }
  for (const a of HEALTH_AREAS) { icon(a.icon, `HEALTH_AREAS ${a.id}`); if (!a.words.length) at(`HEALTH_AREAS ${a.id}: keine Wörter`); }

  const tabs = new Set(COMPOUND_TABS.map((t) => t.id));
  for (const c of COMPOUNDS) {
    icon(c.icon, `COMPOUNDS ${c.id}`); slot(c.slot, `COMPOUNDS ${c.id}`); claim(c.claim, `COMPOUNDS ${c.id}`);
    if (!tabs.has(c.tab)) at(`COMPOUNDS ${c.id}: Reiter "${c.tab}" gibt es nicht`);
    texts.push({ where: `COMPOUNDS ${c.id}`, value: `${c.text} ${c.bullets.join(" ")}` });
  }
  for (const t of tabs) if (!COMPOUNDS.some((c) => c.tab === t)) at(`COMPOUND_TABS "${t}" hat keinen Stoff`);
  for (const t of COMPOUND_THUMBS) if (!COMPOUNDS.some((c) => c.id === t)) at(`COMPOUND_THUMBS: "${t}" gibt es nicht`);

  for (const c of CULTURES) {
    icon(c.icon, `CULTURES ${c.id}`); slot(c.slot, `CULTURES ${c.id}`);
    for (const e of c.entries) if (!pilzIds.has(e)) at(`CULTURES ${c.id}: "${e}" ist kein Pilz-Eintrag`);
    texts.push({ where: `CULTURES ${c.id}`, value: c.intro });
  }
  for (const e of ECOLOGY) { icon(e.icon, `ECOLOGY ${e.id}`); slot(e.slot, `ECOLOGY ${e.id}`); texts.push({ where: `ECOLOGY ${e.id}`, value: e.text }); }
  for (const a of APPLICATIONS) { icon(a.icon, `APPLICATIONS ${a.id}`); slot(a.slot, `APPLICATIONS ${a.id}`); texts.push({ where: `APPLICATIONS ${a.id}`, value: a.text }); }
  for (const r of RESEARCH) { icon(r.icon, `RESEARCH ${r.id}`); slot(r.slot, `RESEARCH ${r.id}`); claim(r.claim, `RESEARCH ${r.id}`); texts.push({ where: `RESEARCH ${r.id}`, value: r.text }); }
  for (const c of STUDY_CLAIMS) claim(c, "STUDY_CLAIMS");

  if (!/Pilzsachverständige/.test(MUSHROOMS_NOTICE) || !/Doppelgänger/.test(MUSHROOMS_NOTICE)) at("MUSHROOMS_NOTICE muss die Warnung zu Wildpilzen (Pilzsachverständige, giftige Doppelgänger) enthalten");
  if (!/keine medizinische Beratung/.test(MUSHROOMS_NOTICE)) at('MUSHROOMS_NOTICE muss „keine medizinische Beratung“ enthalten');
  const cook = APPLICATIONS.find((a) => a.id === "kueche");
  if (!cook || !/Pilzsachverständige/.test(cook.text)) at("APPLICATIONS kueche: Warnung zur Bestimmung von Wildpilzen fehlt");
  texts.push(...labels);
  for (const t of texts) {
    if (DOSAGE.test(t.value)) at(`${t.where}: enthält eine Mengenangabe (keine Dosierungen)`);
    if (PROMISE.test(t.value)) at(`${t.where}: enthält ein Heilversprechen`);
  }
  return errors;
}
