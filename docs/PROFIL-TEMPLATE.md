# Profil-Vorlage für Pflanzen, Bäume, Obst & Gemüse und Pilze

Die Ashwagandha-Seite (Aufbau `kraut`) ist die Vorlage für **alle** pflanzenartigen Atlas-Einträge: Kategorien `kraut`, `blume`, `baum`, `obst`, `gemuese`, `pilz` (Kristalle nicht). Die Seite wird nicht pro Eintrag von Hand gebaut, sondern aus den Daten gefüllt. Ein neuer Eintrag bekommt automatisch denselben Look. Was fehlt, bleibt ein dezenter Platzhalter; **nichts wird erfunden**.

Feste Struktur, Beschriftungen und Platzhalter: `src/data/profileTemplate.ts` (keine Importe). Typen: `src/data/profileTypes.ts` (`PlantProfile`, `DeriveContext`). Prüfung: `src/data/validateProfileTemplate.ts` (läuft in `npm run validate:data`). Ableitung: `deriveProfile(entry, ctx)` in `src/data/profileDerive.ts` (Entwickler).

## Vorrang

1. **Handprofil** (`PROFILES` in `profiles.ts`: Ashwagandha, Granatapfel) gewinnt immer. Es bleibt bis auf eine bewusste Änderung, wie es war: die Schriftgrößen sind wie auf der Referenzseite (eine Vergrößerung auf 16 px wurde wieder zurückgenommen), die Sicherheitsstudien stehen im immer sichtbaren Abschnitt `#pp-safety` statt hinter „Alle Studien anzeigen“, sobald es Studien zu Aussagen gibt; sonst stehen sie sichtbar, mit dem ehrlichen Hinweis „Quellen des Atlas-Eintrags, keine Studien“,.
2. Abgeleitetes Profil für jeden Eintrag mit Kategorie in `PLANT_LIKE` (heute 43 Einträge, auch Kurkuma).
3. Kurzprofil (`genericHtml`) für alles andere (Kristalle haben eine eigene Seite).

## Abschnitte

`SECTIONS` (Seitenreihenfolge). Die genauen Platzhaltertexte stehen im Code. „Fehlliste“ = Kurzname, der beim Eintrag in der Liste der fehlenden Inhalte steht (und die Id in `profile.missing`).

| Abschnitt | Datenquelle | Platzhalter (Kern) | Fehlliste |
|---|---|---|---|
| `pp-plant` Die Pflanze / Der Pilz | nur Handprofil (Bildtafel braucht Bild und Positionen); der Fakt „Verwendete Teile“ steht unter „Auf einen Blick“ | „Noch nicht erfasst: die beschriftete Bildtafel folgt“ | „Teile (Bildtafel)“, immer |
| `pp-fungus` (nur Pilze, ersetzt `pp-traits`) | Fakten des Atlas-Eintrags, siehe „Pilze“ | je Feld „Noch nicht erfasst.“ | „Pilz-Felder“ wenn alle Felder leer; leere Felder einzeln, „Verwechslungsgefahr“ zuerst |
| `pp-traits` Botanische Merkmale (nur Pflanzen) | Fakten Besonderheit, Aussehen, Höhe, Blütezeit, Fruchtzeit, Erntezeit, Standort, Boden, Klima, Vermehrung, Lebensdauer | „Noch nicht erfasst.“ | „Merkmale“ |
| `pp-origin` Ursprung & Verbreitung | Fakt Heimat/Herkunft/Vorkommen (Pilze: nur Heimat/Herkunft) und Region in `ORIGIN` (`plants.ts`) für die Karte | „Noch nicht erfasst: Herkunftsangabe und Karte fehlen.“ | „Herkunft & Karte“ |
| `pp-sensory` Geschmack, Duft & Textur | Fakten Geschmack, Duft, Textur (noch bei keinem Eintrag) | „Noch nicht erfasst.“ | „Geschmack, Duft, Textur“ |
| `pp-growth` Wachstumszyklus | nur Handprofil | „Noch nicht erfasst: der Wachstumszyklus fehlt.“ | „Wachstumszyklus“, immer |
| `pp-compounds` Inhaltsstoffe | Fakten Inhaltsstoffe, Inhaltsstoff, Inhalt, Scharfstoffe, Farbstoff, Hauptbestandteil des ätherischen Öls (eine Gruppe „Laut Atlas-Eintrag“, ohne Mengen) | „Noch nicht erfasst: eine geprüfte Liste fehlt.“ | „Inhaltsstoffe“ |
| `pp-effects` Wirkung & Anwendungsbereiche | veröffentlichte Aussagen am Eintrag (`claims`), jede mit Belegstufe; die Seite selbst behauptet nichts | „Noch keine Aussage zu diesem Eintrag erfasst.“ | „Aussagen (Wirkung)“ |
| `pp-freq` Frequenzen & Geometrie | nur Handprofil; ein Hertz-Wert wird nie abgeleitet | „Noch keine Frequenz-Angabe erfasst. Die Seite nennt keinen Wert ohne Quelle.“ | „Frequenz“, immer |
| `pp-forms` Anwendungsformen | Rezepte der Werkbank, deren Zutaten die Atlas-Id nennen (Name, Herkunft, Gefäß-Icon, Link zum Rezept; keine Mengen) | „Noch kein Rezept der Werkbank nennt diesen Eintrag.“ | „Anwendungsformen (Rezepte)“ |
| `pp-combos` Kombinationen | `combinations` des Eintrags mit Herkunft (Überlieferung/modern/unklar); ein Reiter „Traditionelle Mischungen“ | „Noch keine Kombination erfasst.“ | „Kombinationen“ |
| `pp-history` Geschichte & Kultur | nur Handprofil (Zeitleiste braucht Datierungen); der Kurztext `tradition` steht im Kopf | „Noch nicht erfasst: die Zeitleiste fehlt.“ | „Geschichte (Zeitleiste)“, immer |
| `pp-research` Forschung | Quellen mit Adresse aus den Aussagen (Studien; nicht „editorial-input“, nicht „interview“), danach die Quellen des Atlas-Eintrags hinter „Alle Studien anzeigen“ | „Noch keine Quelle mit Adresse erfasst.“ | „Forschung & Quellen“ |
| `pp-network` Wissensnetz | Knoten: Kombinationen (Pflanzen), Organe (Zuordnungen, nur ganze Wörter wie auf der Körper-Seite), Aussagen, Traditionen (Zuordnungen mit Herkunft Überlieferung; Hinweis-Knoten ohne Link, weil die Seite „Alte Kulturen“ nur alte Zivilisationen enthält); höchstens 9 | „Noch keine Verknüpfung erfasst.“ | „Wissensnetz“ |

**Kopf der Seite** (nie Platzhalter): Brotkrümel-Kategorie = Name der Kategorie; Tags = Kategorie, Familie, bis zu 2 Systeme der Zuordnungen (höchstens 4); Einleitung = `tradition`; „Themen in der Überlieferung“ = Ziele der Zuordnungen mit Herkunft Überlieferung (höchstens 5, Icons aus `BUBBLE_ICONS`); „Auf einen Blick“ = wissenschaftlicher Name, dann die Fakten nach `FACT_ROUTES` (Familie, Verwendete Teile, Heimat/Herkunft als „Herkunft“, unbekannte Fakten mit dem Blatt-Icon). Kein Fakt geht verloren.

**Sicherheit** (nie leer): `composeSafety()` = Giftig-Fakt (falls vorhanden, zuerst) + Satz „keine medizinische Beratung …“ + Satz zu Wildpflanzen und Pilzen (Pilze: stärkere Fassung) + Hinweis-Fakt (falls vorhanden). Keine Dosierungen, keine Heilversprechen; `validate:data` prüft das.

## Atlas-Fakten, die die Vorlage versteht

Wer einen Abschnitt füllen will, trägt im Atlas-Eintrag einen Fakt mit genau dieser Beschriftung ein (`FACT_ROUTES`). Aktuell vorhanden: Familie, Verwendete Teile, Heimat, Herkunft, Inhaltsstoffe, Inhaltsstoff, Inhalt, Scharfstoffe, Farbstoff, Hauptbestandteil des ätherischen Öls, Besonderheit, Hinweis, Vorkommen, Verwendung, Giftig, Aussehen, Namen. Neu nutzbar, bisher bei keinem Eintrag: Höhe, Blütezeit, Fruchtzeit, Erntezeit, Standort, Boden, Klima, Vermehrung, Lebensdauer, Geschmack, Duft, Textur, Verwechslung (Pilze). Quellen und Belegstufen bleiben unverändert: Fakten haben die Quellen des Eintrags, Wirkaussagen sind Claims.

## Pilze

Pilze bekommen statt der botanischen Merkmale das Feld-Panel `pp-fungus` im selben Look (`FUNGUS_FIELDS`):

| Feld | Atlas-Fakten (in dieser Reihenfolge) | Icon |
|---|---|---|
| Lebensraum | Vorkommen | `tree` |
| Aussehen | Aussehen | `palette` |
| Verwechslungsgefahr (Sicherheitsfeld) | Verwechslung (**kein Atlas-Eintrag hat diesen Fakt bisher**) | `shield` |
| Verwendung & Giftigkeit | Giftig, Verwendung, Hinweis (mehrere: eine Zeile je Fakt, „Fakt: Text“) | `bowl` |
| Besonderheiten & Namen | Besonderheit, Namen | `sparkle` |

- Ohne den Fakt „Verwechslung“ zeigt das Feld: „Noch nicht erfasst. Bis dahin gilt: keinen Wildpilz essen, den eine Fachperson nicht sicher bestimmt hat.“ Es steht als Sicherheitsfeld oben in der Fehlliste. Bei den Speisepilzen (Steinpilz, Austernseitling, Shiitake) sollte der Redakteur den Fakt zuerst nachtragen.
- Jeder Pilz zeigt unten den Pilz-Sicherheitstext (`SAFETY_TEXT.mushroom`: vorhandener Satz „Wildpflanzen und Pilze nur sammeln und essen, wenn eine Fachperson sie sicher bestimmt hat.“ **plus ein neuer Satz** zu giftigen Doppelgängern und zur Bestimmung durch Fachpersonen). Der Fakt „Giftig“ steht zusätzlich als Warnung vorn in der Sicherheit.
- Familie und Verwendete Teile stehen wie bei Pflanzen unter „Auf einen Blick“, Inhaltsstoffe in `pp-compounds`.

## Neuen Eintrag anlegen

1. `content/atlas/<id>.json` anlegen (`status: "published"`, `category` eine aus `PLANT_LIKE`, Fakten mit den Beschriftungen oben, `tradition`, Quellen). Mehr ist für die Seite nicht nötig: keine Datei in `src/`.
2. Optional: Aussagen in `content/claims/` und ihre Ids in `claims` des Eintrags; Kombinationen in `combinations`; Herkunftsregion in `ORIGIN` (`src/data/plants.ts`, für die Karte); Rezepte nennen den Eintrag über die Zutaten-Id.
3. Optional: Bild `atlas-<id>` erzeugen (Original in `design/assets-raw`) und mit `npm run assets:optimize` einbauen (siehe „Bilder“).
4. `npm run validate:data`. Die Seite erscheint über Karten und Suche wie bei Ashwagandha; fehlende Teile stehen in der Fehlliste.

Für ein volles Profil von Hand (wie Ashwagandha): Eintrag in `PROFILES` (`profiles.ts`), Bildplätze `plant-<id>-*` in `registry.ts`. Das Handprofil ersetzt die Ableitung vollständig.

## Bilder

`IMAGE_SLOTS`: Nur `atlas-<id>` ist dynamisch (`slotDef` in `registry.ts`) und gilt für jeden Eintrag: Titelbild im Kopf, Bild bei „Auf einen Blick“, Mittelpunkt und Knoten im Wissensnetz. `nutrient-<id>` gibt es nur für acht feste Namen (Rückfall im Wissensnetz). Die `plant-<id>-…`-Plätze (Hero, Skizze, Bildtafel, Fotos, Stufen) gibt es nur für Ashwagandha und Granatapfel: Abgeleitete Seiten zeigen dafür den neutralen Platzhalter „Bild folgt“, **keine gezeichnete Ersatzpflanze** (`art: "none"`). Fehlende `atlas-<id>`-Bilder stehen in der Fehlliste.

## Was der Renderer können muss (Entwickler)

- `origin` und `frequency` sind optional, `forms[].slot` und `history[].slot` optional: `tsc` meldet die Stellen in `plantProfile.ts` (`originHtml`, `freqHtml`, `show`, `formsHtml`, `historyHtml`).
- Leere Listen ohne Absturz: `parts` (`startPart` ist „“, `setPart` überspringen), `compounds` (`renderCompound`), `combos` (`renderCombos`), `history`, `research`, `network`, `effects`, `forms`, `traits`, `sensory`, `stages`; leere Texte (`lead`, `traitsNote`, `historyNote`) nicht ausgeben.
- Jede Tafel mit leerem Inhalt (Id in `missing`) zeigt `SECTIONS[].placeholder` im gleichen Rahmen und mit derselben Überschrift; die Tab-Leiste bleibt vollständig. Bei Pilzen zeigt der Reiter „Eigenschaften“ auf `pp-fungus`.
- `art: "none"`: kein gezeichnetes Bild (weder Pflanze noch Frucht), sondern das Platzhalter-Zeichen wie im Kurzprofil; Titelbild aus `atlas-<id>`, wenn es die Datei gibt.
- `fungus`, `poisonous`, `forms[].recipe` (Link zur Werkbank) und `research[].from` (Atlas-Quelle statt Studie beschriften) sind neu.
- `validateProfiles` gilt nur für Handprofile; abgeleitete Profile prüft `validateProfileTemplate`.

## Stand heute (Vorhersage aus den Regeln, 14.10.2026)

43 abgeleitete Einträge (10 Kräuter, 2 Blumen, 11 Bäume, 7 Obst, 7 Gemüse, 8 Pilze, ohne die zwei Handprofile). Bei **allen** leer: Teile, Geschmack/Duft/Textur, Wachstumszyklus, Frequenz, Geschichte. Teilweise leer (Anzahl der leeren Seiten von 43): Inhaltsstoffe 32, Rezepte 39, Kombinationen 39, Aussagen 23, Wissensnetz 23, Merkmale 15 (von 35 Nicht-Pilzen; es fehlt der Fakt „Besonderheit“ oder „Aussehen“), Herkunft & Karte 8 (alle Pilze, `ORIGIN` kennt keine Pilze). Bei allen 8 Pilzen fehlt „Verwechslungsgefahr“. Die genaue Liste liefert das Skript der Fehlliste aus `deriveProfile`.
