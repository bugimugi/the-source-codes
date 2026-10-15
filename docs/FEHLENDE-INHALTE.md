# Fehlende Inhalte der Pflanzenseiten

Diese Liste wird mit `npm run profile:missing` aus den Daten erzeugt (nicht von Hand ändern). Sie zeigt, wo eine Eintragsseite einen **dezenten Platzhalter** statt Inhalt zeigt. Nichts davon ist erfunden oder geschätzt: Wo ein Atlas-Eintrag keinen passenden Fakt hat, bleibt der Platz leer.

**Stand:** 43 Einträge mit abgeleiteter Seite; 2 Einträge mit Handprofil (Ashwagandha, Granatapfel) sind vollständig und stehen hier nicht.

## So füllst du eine Lücke

- **Atlas-Fakt eintragen:** in `content/atlas/<id>.json` unter `facts` einen Fakt mit genau der Beschriftung aus der Spalte „Fakt“ ergänzen (Quelle dazu nennen). Die Seite übernimmt ihn automatisch.
- **Aussage:** in `content/claims/` anlegen und die Id in `claims` des Eintrags eintragen. **Kombination:** in `combinations`. **Herkunftsregion:** in `ORIGIN` (`src/data/plants.ts`). **Rezept:** nennt den Eintrag über die Zutaten-Id.
- **Bild:** `atlas-<id>` erzeugen und mit `npm run assets:optimize` einbauen.

## Bei allen abgeleiteten Seiten leer

Diese Abschnitte zeigen bei jedem Eintrag mit abgeleiteter Seite einen Platzhalter. Vier davon füllt nur ein Handprofil (wie Ashwagandha), weil sie Bilder, Datierungen oder eine Quelle mit Wert brauchen; „Geschmack, Duft, Textur“ lässt sich mit Atlas-Fakten füllen, es hat nur noch kein Eintrag sie.

- **Teile (Bildtafel)** – Nur Handprofil: Die Bildtafel mit beschrifteten Teilen braucht ein Bild und Positionen. Aus dem Atlas kommt nur der Fakt „Verwendete Teile“, er steht unter „Auf einen Blick“.
- **Geschmack, Duft, Textur** – Atlas-Fakten Geschmack, Duft und Textur (bei keinem Eintrag vorhanden, bis ein Redakteur sie einträgt).
- **Wachstumszyklus** – Nur Handprofil: Die Stufen mit Zeiträumen und Bildern gibt es nicht als Atlas-Fakt.
- **Frequenz** – Nur Handprofil: Ein Hertz-Wert wird nie abgeleitet, er braucht eine Quelle und eine Aussage mit Belegstufe.
- **Geschichte (Zeitleiste)** – Nur Handprofil: Eine Zeitleiste braucht Datierungen. Der Kurztext des Atlas-Eintrags (tradition) steht im Kopf der Seite.

## Wie oft ein Abschnitt fehlt

| Abschnitt | Fakt / Quelle, die ihn füllt | Seiten ohne Inhalt |
|---|---|---|
| Pilz-Felder | Fakten des Atlas-Eintrags: Vorkommen, Aussehen, Giftig/Verwendung/Hinweis, Besonderheit/Namen; Verwechslung, sobald ein Fakt „Verwechslung“ existiert (siehe FUNGUS_FIELDS). | 0 von 8 |
| Merkmale | Atlas-Fakten mit Merkmals-Beschriftung (Besonderheit, Aussehen, Höhe, Blütezeit, Standort … laut FACT_ROUTES). | 15 von 35 |
| Herkunft & Karte | Atlas-Fakt Heimat, Herkunft oder Vorkommen und die Herkunftsregion in ORIGIN (src/data/plants.ts, Karte). Bei Pilzen geht „Vorkommen“ in das Pilz-Feld Lebensraum; hier zählen nur Heimat/Herkunft und ORIGIN. | 3 von 43 |
| Inhaltsstoffe | Atlas-Fakten Inhaltsstoffe, Inhaltsstoff, Inhalt, Scharfstoffe, Farbstoff, Hauptbestandteil des ätherischen Öls (als eine Gruppe „Laut Atlas-Eintrag“, ohne Mengen). | 32 von 43 |
| Aussagen (Wirkung) | Die veröffentlichten Aussagen, die am Atlas-Eintrag eingetragen sind (claims); jede mit ihrer Belegstufe. Die Seite selbst behauptet keine Wirkung. | 23 von 43 |
| Anwendungsformen (Rezepte) | Rezepte der Werkbank (src/data/recipes*.ts), in deren Zutaten die ID des Eintrags steht; nur Name und Herkunft des Rezepts, keine Mengen. | 39 von 43 |
| Kombinationen | Die Kombinationen des Atlas-Eintrags (combinations) mit ihrer Herkunft (Überlieferung, modern, unklar). | 35 von 43 |
| Forschung & Quellen | Quellen mit Adresse aus den Aussagen des Eintrags (Studien) und die Quellen des Atlas-Eintrags (hinter „Alle Studien anzeigen“); alle als „Source pending verification“, solange nicht geprüft. | 0 von 43 |
| Wissensnetz | Kombinationen mit anderen Einträgen, Zuordnungen zu Organen der Körper-Seite (nur ganze Wörter, wie auf der Körper-Seite), Aussagen des Eintrags und Kulturen aus den Zuordnungen. | 23 von 43 |
| Bild `atlas-<id>` | Datei in `public/assets` | 32 von 43 |

## Pro Eintrag

Die Abschnitte aus „Bei allen abgeleiteten Seiten leer“ fehlen überall und stehen hier nicht noch einmal.

### Kräuter

- **Aloe vera** (`aloe-vera`)
  - Fehlt: Merkmale · Inhaltsstoffe · Anwendungsformen (Rezepte) · Kombinationen
  - Bild fehlt: `atlas-aloe-vera`
- **Echte Kamille** (`kamille`)
  - Fehlt: Merkmale · Anwendungsformen (Rezepte)
- **Echter Lavendel** (`lavendel`)
  - Fehlt: Merkmale · Anwendungsformen (Rezepte)
- **Echter Salbei** (`salbei`)
  - Fehlt: Merkmale · Inhaltsstoffe · Anwendungsformen (Rezepte)
  - Bild fehlt: `atlas-salbei`
- **Große Brennnessel** (`brennnessel`)
  - Fehlt: Inhaltsstoffe · Anwendungsformen (Rezepte) · Kombinationen
- **Ingwer** (`ingwer`)
  - Fehlt: Merkmale
- **Kurkuma** (`kurkuma`)
  - Fehlt: Merkmale
  - Bild fehlt: `atlas-kurkuma`
- **Pfefferminze** (`pfefferminze`)
  - Fehlt: Merkmale · Anwendungsformen (Rezepte)
- **Rosmarin** (`rosmarin`)
  - Fehlt: Merkmale · Anwendungsformen (Rezepte)
  - Bild fehlt: `atlas-rosmarin`
### Blumen

- **Purpur-Sonnenhut (Echinacea)** (`echinacea`)
  - Fehlt: Merkmale · Inhaltsstoffe · Anwendungsformen (Rezepte) · Kombinationen
  - Bild fehlt: `atlas-echinacea`
- **Ringelblume** (`ringelblume`)
  - Fehlt: Merkmale · Anwendungsformen (Rezepte) · Kombinationen
### Bäume

- **Affenbrotbaum (Baobab)** (`baobab`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-baobab`
- **Bergahorn** (`ahorn`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-ahorn`
- **Ginkgo** (`ginkgo`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-ginkgo`
- **Libanonzeder** (`zeder`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-zeder`
- **Olivenbaum** (`olivenbaum`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-olivenbaum`
- **Riesenmammutbaum** (`mammutbaum`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-mammutbaum`
- **Rotbuche** (`buche`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-buche`
- **Silberweide** (`weide`)
  - Fehlt: Merkmale · Anwendungsformen (Rezepte) · Kombinationen
- **Stieleiche** (`eiche`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-eiche`
- **Teebaum** (`teebaum`)
  - Fehlt: Merkmale · Inhaltsstoffe · Anwendungsformen (Rezepte) · Kombinationen
  - Bild fehlt: `atlas-teebaum`
- **Waldkiefer** (`kiefer`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-kiefer`
### Obst & Nüsse

- **Apfel** (`apfel`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
- **Avocado** (`avocado`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-avocado`
- **Heidelbeere** (`heidelbeere`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-heidelbeere`
- **Süßkirsche** (`kirsche`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-kirsche`
- **Walnuss** (`walnuss`)
  - Fehlt: Merkmale · Anwendungsformen (Rezepte)
- **Zitrone** (`zitrone`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-zitrone`
### Gemüse

- **Brokkoli** (`brokkoli`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-brokkoli`
- **Karotte** (`karotte`)
  - Fehlt: Merkmale · Anwendungsformen (Rezepte) · Kombinationen
- **Knoblauch** (`knoblauch`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-knoblauch`
- **Kürbis** (`kuerbis`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-kuerbis`
- **Linse** (`linsen`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-linsen`
- **Spinat** (`spinat`)
  - Fehlt: Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-spinat`
- **Tomate** (`tomate`)
  - Fehlt: Merkmale · Anwendungsformen (Rezepte) · Kombinationen
### Pilze

- **Austernseitling** (`austernpilz`)
  - Fehlt: Pilz-Felder: Verwechslungsgefahr (Sicherheit), Aussehen · Herkunft & Karte · Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-austernpilz`
- **Chaga (Schiefer Schillerporling)** (`chaga`)
  - Fehlt: Pilz-Felder: Verwechslungsgefahr (Sicherheit), Verwendung & Giftigkeit, Besonderheiten & Namen · Inhaltsstoffe · Anwendungsformen (Rezepte) · Kombinationen
  - Bild fehlt: `atlas-chaga`
- **Chinesischer Raupenpilz (Cordyceps)** (`kordyzeps`)
  - Fehlt: Pilz-Felder: Verwechslungsgefahr (Sicherheit), Aussehen, Verwendung & Giftigkeit · Inhaltsstoffe · Anwendungsformen (Rezepte) · Kombinationen
  - Bild fehlt: `atlas-kordyzeps`
- **Fliegenpilz** (`fliegenpilz`)
  - Fehlt: Pilz-Felder: Verwechslungsgefahr (Sicherheit), Besonderheiten & Namen · Herkunft & Karte · Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-fliegenpilz`
- **Gemeiner Steinpilz** (`steinpilz`)
  - Fehlt: Pilz-Felder: Verwechslungsgefahr (Sicherheit), Aussehen, Besonderheiten & Namen · Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-steinpilz`
- **Igelstachelbart** (`igelstachelbart`)
  - Fehlt: Pilz-Felder: Verwechslungsgefahr (Sicherheit), Aussehen · Inhaltsstoffe · Anwendungsformen (Rezepte) · Kombinationen
  - Bild fehlt: `atlas-igelstachelbart`
- **Reishi (Glänzender Lackporling)** (`reishi`)
  - Fehlt: Pilz-Felder: Verwechslungsgefahr (Sicherheit), Aussehen, Verwendung & Giftigkeit · Herkunft & Karte · Inhaltsstoffe · Anwendungsformen (Rezepte) · Kombinationen
  - Bild fehlt: `atlas-reishi`
- **Shiitake** (`shiitake`)
  - Fehlt: Pilz-Felder: Verwechslungsgefahr (Sicherheit), Aussehen, Besonderheiten & Namen · Inhaltsstoffe · Aussagen (Wirkung) · Anwendungsformen (Rezepte) · Kombinationen · Wissensnetz
  - Bild fehlt: `atlas-shiitake`

## Bildplätze, die nicht für jeden Eintrag vorgesehen sind

Nur `atlas-<id>` gilt für jeden Eintrag. Die Plätze `plant-<id>-…` (Titelbild, Bildtafel, Fotos, Wachstumsstufen, Herkunft) gibt es nur für Ashwagandha und Granatapfel; abgeleitete Seiten zeigen dafür den Platzhalter „Bild folgt“, keine gezeichnete Ersatzpflanze. Sollen sie für jeden Eintrag gelten, braucht `slotDef` in `src/assets/registry.ts` ein Muster dafür (offene Entscheidung).
