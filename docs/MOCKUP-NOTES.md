# Notizen zu den Entwurfsbildern (`public/references/`, lokal)

Zweck: Die Bilder nicht wiederholt ansehen müssen (spart Verbrauch). Hier steht, was jede Seite zeigt. **Nur Layout-Vorlage:**
Zahlen („25.000+“, „Signal Index +68“), Evidenz-Balken, Studientitel, „Gut untersucht“-Etiketten und Mengenangaben in den Bildern
sind Platzhalter und werden NICHT übernommen (CLAUDE.md, Schutzlinie 7). Alle Bilder sind ca. 1024×1536 (Seite als langes Poster).

## Gemeinsame Bauweise (alle Seiten)
- Obere Leiste (ca. 50 px): Logo „THE LIVING ATLAS“ links; Menü Entdecken · Matrix · Körper · Natur · Ernährung · Frequenzen ·
  (Chakra) · Alte Kulturen · (Heilige Orte) · Labor · Bibliothek; rechts Suchfeld, Profil-, Lesezeichen-, Einstellungs-Symbol.
  Das Menü wechselt je Seite leicht: **einmal festlegen**. Aktiver Punkt: Goldlinie darunter.
- Hero (ca. 300–420 px hoch): Kleinzeile in Großbuchstaben (Gold, weit gesperrt), Serif-Titel groß, kursiver Untertitel (Gold),
  Fließtext, 1–2 Buttons (Gold gefüllt + Umriss), 3–5 Kennzahlen; rechts Hauptbild und 5–10 Kreis-Symbole mit Kurztext.
- Darunter **Bänder** aus Kartenreihen mit dünnem Goldrand, abgerundeten Ecken, dunklen Glasflächen; Titel in Serif, Untertitel klein.
- Buttons: Umriss in Gold mit Pfeil „→“, primär gold gefüllt. Pergament-Karten („Auf einen Blick“) bei Detailseiten.
- Farben/Typografie: `docs/DESIGN.md`. Sehr dunkel, viel Glow, Leuchtkanten.

## Seiten
1. **Startseite** – Hero „THE LIVING ATLAS“ (Frau mit Pflanzenkrone + Körper-Hologramm + DNA, Welt dahinter), rechts Legende
   „Wissensebenen“ (4 Farbpunkte: wissenschaftlich belegt grün · traditionell gelb · spirituell violett · Hypothese grau – passt zu
   unseren Belegstufen). Dann „Explore the Knowledge Matrix“: 16 Kacheln in 2 Reihen (Pflanzen, Bäume, Gemüse & Obst, Pilze,
   Mineralien, Kristalle, Menschlicher Körper, Nährstoffe / Krankheiten, Atem, Frequenzen, Geometrie, Chakren, Alte Kulturen,
   Heilige Orte, Lab). Dann: Körper-Atlas (Körper mit Pins + Nährstoffe) | Pflanzen-Atlas (Ashwagandha + Liste); Condition Matrix
   (Suche + Chips) | Frequenz-Labor (432-Hz-Player, Geometrie, Frequenzliste); Heilige Geometrie | Alte Kulturen | Heilige Orte;
   DIY Labor | Research Bibliothek | „Alles ist verbunden“ (Erde mit Netz, Leitspruch EXPLORE·LEARN·CONNECT·HEAL·EVOLVE).
2. **Menschlicher Körper** – Hero Körper-Hologramm + rechte Icon-Liste (10 Bereiche); „Die 11 Organsysteme“ (2×6 Kacheln);
   Interaktiver 3D-Körper (Zoom/Ebenen-Schalter: Organe, Muskeln, Nerven, Gefäße, Knochen, Transparenz) | Herz-Detail;
   „Von der Zelle zum Organismus“ (Kette Atom→Körper); Lebensphasen; Funktionen; Gesundheit & Wohlbefinden; Forschung; Verbindungen.
3. **Körper – Signale („The Signal Lab“)** – „Alles ist ein Signal.“; Figur mit 6 Signalquellen (Wörter, Licht, Nahrung, Klänge,
   Materialien, Umgebung); Signal-Analyzer (Suche, Typ-Chips, Halbkreis-Anzeige „Signal Index“, Detailkarte Rosmarin);
   „Was ist ein Signal?“ (Kette); „Vier Welten“ (4 große Karten); Schlussbanner. **Heikel:** Bewertungszahlen = Heilversprechen-Nähe.
4. **Krankheiten & Beschwerden** – „Beschwerden verstehen. Natürlich Lösungen finden.“; Reiter (suchen / Persönliche Analyse / A–Z),
   große Suchleiste, Beispiel-Chips; Häufige Beschwerden (8 Fotokarten); 3 Spalten: Angaben → Beispiel-Analyse → Chakren/Lifestyle;
   Empfehlungen (8 Karten); unten **3 Hinweisboxen** (Wichtige Hinweise, Wechselwirkungen, Wann zum Arzt). **Heikel** (CLAUDE.md
   Schutzlinie 3): keine Behandlungsanleitungen/Dosierungen; Arzt-Hinweis bleibt.
5. **Nährstoffe** – „Bausteine deines Lebens.“; 6 Kategorien rechts; 7 Kategoriekarten; Interaktiver Körper (Organliste links,
   Pins am Körper) | Detailpanel (Gehirn → Omega-3, Tabs Funktion/Quellen/Wirkung/Mangel/Einnahme); Nährstoffe-Raster (Filterleiste);
   4 Infokarten (Wie wirken / Quellen / Einnahme / Mangel).
6. **Pflanzen-Atlas (Übersicht)** – Hero mit altem Buch + Pergament-Zitat, Suche, Kennzahlen; Kategorie-Leiste (Alle, Kräuter,
   Blüten, Bäume, Pilze, Gewürze, Früchte, Gemüse, Algen); Beliebte Pflanzen (Karussell); Weltkarte nach Region; Wirkungssuche
   (12 Chips) + Körper | „Wissen aus aller Welt“; Aktuelle Entdeckungen (4 Karten).
7. **Pflanzen-Detail** (Beispiele: Ashwagandha, Eiche, Reishi, Granatapfel – **eine Vorlage**) – Brotkrumen; Name + lateinischer
   Name; Tags; Kreis-Symbole; Pergament „Auf einen Blick“; Tab-Leiste (Übersicht, Eigenschaften, Inhaltsstoffe, Wirkung, Anwendung,
   Kombinationen, Rezepte, Frequenz & Geometrie, Geschichte, Anbau, Forschung); Detailabbildung mit Beschriftungen; Botanische
   Tabelle; Ursprung (Karte); Geschmack/Duft; Wachstumszyklus; Inhaltsstoffe (Strukturformel auf Pergament); Wirkung mit Körper
   und Evidenz-Etiketten; Frequenz & Geometrie; Anwendungsformen; Kombinationen; Geschichte; Forschung (Studienliste); Wissensnetz.
8. **Mineralien (Mineral Atlas)** – Hero Erde mit Elementen (Si, Fe, Cu, Mg, Au, O) + Kennzahlen; Periodensystem-Reihe
   (Filter-Chips, Suche, 3D-Ansicht); „Von Atom bis Kristall“ (Kette); Quarz-Detail (Bild + Eigenschaftstabelle + Kristallgeometrie);
   Entstehung (4); Weltkarte Vorkommen (+ Länder-Liste); Körper-Bezug; Frequenzen; Anwendungen; Geschichte; Verwandte Mineralien.
9. **Element-Detail (Wasserstoff)** – Brotkrumen; Ordnungszahl-Kasten + großes „H“; Datentabelle rechts; Tab-Leiste; Atommodell +
   3D-Ansicht; Periodensystem (hervorgehoben); Elektronenkonfiguration; physikalische Eigenschaften; Vorkommen; Verbindungen;
   Isotope; Rolle im Körper; Frequenzen; Anwendungen; Geschichte; Forschung.
10. **Kristalle & Heilsteine** – Hero Amethyst-Höhle mit Geometrie-Ring + Zitat; Kategorie-Reihe (10); Beliebte Kristalle (Karussell)
    | Kristallsysteme (7 Symbole); Amethyst-Detail (Bild, Eigenschaftstabelle, Formel); energetische Eigenschaften (Hz-Werte),
    Chakra-Zuordnung, Anwendungsbereiche; Vorkommen; Entstehung; Geschichte; Verwandte Themen; Studien (Pergament).
11. **Chakren** (Beispiel Kronenchakra) – Hero meditierende Figur mit 7 Zentren + Info-Panel (Element, Farbe, Position, Symbol,
    Frequenz, Thema; Etikett „TRADITIONELLES WISSEN“); Leiste der 7 Chakren; Tabs; Heilsteine, Farben, Ernährung, Düfte,
    Frequenz & Klang (Player), Meditationen, Yoga, Natur & Umgebung, Affirmationen.
12. **Atem & Meditation** – „Dein Atem verbindet alles.“; 5 Wirkbereiche; 4 Themenkarten; **Atem-Timer 4-7-8** (Ring, Schritte,
    Start-Button, Runden) + positive Effekte; „Was beim Atmen im Körper passiert“; Weitere Bereiche; Schlussbanner.
13. **Frequenz, Vibration & Geometrie** – „Alles ist Schwingung.“; Suche + Chips; „Welche Wirkung…“ (9 Karten); Frequenzbibliothek
    (528 Hz Detail, Cymatik-Muster, Eigenschaften, verwandte Frequenzen); Frequenzen von Objekten (10 Karten mit Wellenform);
    Geometrie & Schwingungsmuster (10 Linien-Formen); Architektur & heilige Orte; Körper in Frequenzen (Tabelle); Interaktive
    Frequenz-Erfahrung (Player); Wissenschaft & Tradition. **Heikel:** Hz-Angaben zu Organen/Lebensmitteln sind unbelegt → `claimed`.
14. **Freie Energie (Lab & Experimente)** – „Freie Energie der Erde.“; Hero Landschaft mit 6 Beschriftungen; 7 Energiequellen;
    Doppel-Kacheln (Atmosphäre, Gewitter, Wasserkreislauf, Elektrokultur, Erdrotation, Erdung, Schmuck & Metalle, Tesla), je mit
    Unterliste und Button (3D/Modell). **Heikel:** „Freie Energie“-Behauptungen, Erdung, Schmuck-Wirkung → `claimed`/Gegenbelege nennen.
15. **Alte Kulturen** – „Spuren einer vergessenen Welt.“; 8 Themenkacheln; „Eine Reise durch die Zeit“: S-förmiger Leuchtpfad mit
    8 Stationen (Göbekli Tepe, Ältere Kulturen, Ägypten, Sumer & Babylon, Indus, China, Mesoamerika, Weitere); Verbindungen &
    Muster (Bildleiste); 4 Karten unten.
16. **Heilige Orte** – „Orte mit besonderer Energie.“; Hero Erdkugel mit leuchtenden Orten und Linien; 8 Kategorien; „Bedeutende
    heilige Orte“ (10 Karten mit Koordinaten); Interaktive Weltkarte (Filter links, Legende, Detailkarte Angkor Wat);
    Verbindungen (Ley-Linien, Sternenausrichtungen …). **Heikel:** Ley-Linien/Energiebehauptungen → `claimed`.
17. **Pflanzenatlas** (Referenzbild lokal in `design/mockups/pflanzenatlas.png`, nicht committet) – Hero „Pflanzen Atlas“ mit Suchfeld,
    „Beliebt:“-Chips, vier Kennzahlen und einer Pergamentkarte mit dem Satz „Die Natur ist die größte Bibliothek der Heilkunst.“; Reihe mit
    9 Kategoriekarten (Alle, Kräuter, Blüten, Bäume, Pilze, Gewürze, Früchte, Gemüse, Algen); „Beliebte Pflanzen“ als Kartenreihe;
    „Pflanzen der Welt“ mit Pergamentkarte, Regionen-Pins und Liste „Pflanzen nach Region“; Panel „Nach Wirkung suchen“ mit 12 Themen;
    Panel „Der menschliche Körper“ mit Organliste und Körperbild; Panel „Wissen aus aller Welt“; „Aktuelle Entdeckungen“ (4 Karten).
    **Anders umgesetzt (Schutzlinien):** Kennzahlen (25.000+, 1.200+, 500+) und Regionenzahlen aus echten Daten statt Platzhaltern;
    „Nach Wirkung suchen / Was möchtest du unterstützen?“ heißt „Nach Thema suchen / Was interessiert dich?“ und zeigt nur Pflanzen mit
    überlieferter Zuordnung (kein Wirkungsversprechen); die Entdeckungen verweisen auf Vorhandenes (Gewürze, Pilze, Rezepte, Kulturen);
    „Zum Magazin“ → „Zur Bibliothek“. Umsetzung: `src/ui/plants.ts`, `src/data/plants.ts`, `src/plants.css`.
18. **Pflanzenprofil (Ashwagandha)** (Referenzbild lokal in `design/mockups/18-pflanzenprofil-ashwagandha.png`, nicht committet) – Landingpage,
    die sich beim Klick auf eine Pflanze im Pflanzenatlas öffnet. Aufbau von oben nach unten: Hero (Brotkrumen „Pflanzenatlas › Heilpflanzen ›
    Ashwagandha“, Name, lateinischer Name, 4 Etiketten, Einleitung, 5 runde Themensymbole, Pflanzenbild, Pergamentkarte „Auf einen Blick“ mit
    7 Zeilen und Zeichnung); Abschnittsleiste (Übersicht, Eigenschaften, Inhaltsstoffe, Wirkung, Anwendung, Kombinationen, Rezepte, Frequenzen &
    Geometrie, Geschichte, Anbau & Ernte, Forschung); Zeile 1: „Die Pflanze“ (7 Teile-Knöpfe, Pflanzenbild mit Beschriftungen) + „Botanische
    Merkmale“ (9 Zeilen, Foto mit 4 Vorschaubildern); Zeile 2: „Ursprung & Verbreitung“ (Weltkarte, Karte Indien), „Geschmack, Duft & Textur“
    (Pulverschale), „Wachstumszyklus“ (5 Stufen); Zeile 3: „Inhaltsstoffe“ (5 Reiter, Pergamentkarte Withaferin A), „Wirkung & Anwendungsbereiche“
    (6 Zeilen mit Belegfeld, leuchtender Körper), „Frequenzen & Geometrie“ (432 Hz, Blume des Lebens, Themen); Zeile 4: „Anwendungsformen“
    (6 Karten), „Kombinationen & Synergien“ (3 Reiter, Kartenreihe); Zeile 5: „Geschichte & Kultur“ (4 Zeitkarten), „Forschung“ (3 Studien),
    „Wissensnetz“ (Kreis um Ashwagandha). **Anders umgesetzt (Schutzlinien):** die Dosierungen der Vorlage („5–10 g / 250 ml“, „1–5 g“) fehlen,
    Anwendungsformen nennen keine Mengen; die fünf Themenkreise heißen „Themen der Überlieferung“; die Belegfelder der Wirkungszeilen kommen aus
    den echten Belegstufen der Aussagen (Hypothese/Behauptung statt „Gut untersucht“); die Studien sind echte Quellen als „Suchauszug, Source pending
    verification“ statt der Platzhalter-Titel; Tippfehler der Vorlage („Flüten“, „Blüteeit“) berichtigt; „Über 3.000 Jahre“ und die Pflanzenmerkmale
    stehen als Angabe der Vorlage (ungeprüft) mit Datierungshinweis; Frequenzkarte als Behauptung mit Schwärzungsfeld; „Mehr über Withanolide“ klappt
    den Text auf; „Gut untersucht/Moderate Evidenz“ entfallen. Andere Pflanzen bekommen ein Kurzprofil aus ihrem Atlas-Eintrag.
    Umsetzung: `src/ui/plantProfile.ts`, `src/data/profiles.ts`, `src/ui/plantArt.ts` (gezeichnete Platzhalter), `src/ui/icons.ts`, `src/plantProfile.css`.
    Bildplätze `plant-ashwagandha-*`, `form-*`, `compound-withaferin-a` (Priorität 8). Die Positionen der Beschriftungen im Pflanzenbild stehen in
    `profiles.ts` (`callout`, in Prozent) und werden angepasst, sobald `plant-ashwagandha-parts` da ist.

## Was 3D bekommt und was Bild bleibt (CLAUDE.md, Harte Regeln)
- **3D (Code):** Frequenz-/Wellen-/Kymatik-/Geometrie-Szenen, Chakren-Darstellung, Atem-Ring, Weltkugel (Seiten 1, 13, 11, 12, 16).
- **3D (freie Modelle):** menschlicher Körper und Organe (Seiten 2, 3, 4, 5), Erde (Seiten 1, 8, 16).
- **Bild + 2,5D:** Pflanzen, Pilze, Früchte, Bäume, Kristalle, Orte, Hintergründe, alle Hero-Welten (Seiten 6–10, 14, 15).
