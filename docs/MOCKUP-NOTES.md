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
19. **Pflanzenprofil Granatapfel (Obst & Gemüse)** (Referenzbild lokal in `design/mockups/19-pflanzenprofil-granatapfel.png`, nicht committet) – gleiche
    Bauweise wie Seite 18, aber mit Frucht-Aufbau („Ernährungsatlas › Früchte › Granatapfel“; bei uns „Pflanzenatlas › Früchte“). Hero mit Name, 4 Etiketten, 5 Themensymbolen und
    Pergamentkarte „Auf einen Blick“; Zeile 1: „Die Pflanze & Frucht“ (7 Teile-Knöpfe: Frucht, Blüte, Samen, Schale, Blätter, Zweig, Baum; Bild mit 4 Beschriftungen und
    Vorschaubildern), „Botanische Informationen“ (10 Zeilen), „Wachstumszyklus“ (Pergamentkarte mit 4 Stufen im Kreis); Zeile 2: „Ursprung & Verbreitung“ (Karte mit 3
    Gebieten: Ursprung, traditionelle Verbreitung, heute weltweit), „Geschmack, Duft & Textur“ (mit Farbe), „Nährstoffe (pro 100 g)“ mit Balken und „Reich an:“; Zeile 3:
    „Wirkung & gesundheitliche Vorteile“ (Körper links, 6 Zeilen), „Inhaltsstoffe & bioaktive Verbindungen“ (Reiter Polyphenole/Vitamine/Mineralstoffe/Weitere, Karte Punicalagin
    mit Strukturformel, 4 Bildchen), „Frequenzen & Geometrie“ (528 Hz, Granatapfel-Muster, weitere Frequenzen 432–852 Hz); Zeile 4: „Anwendungsformen“ (5 Karten),
    „Kombinationen & Rezepte“ (3 Reiter); Zeile 5: „Geschichte & Kultur“ (5 Karten), „Forschung“ (3 Studien), „Wissensnetz“. **Anders umgesetzt (Schutzlinien):** Nährwerte sind
    echte USDA-Werte (roher Granatapfel, Suchauszug) statt Platzhalter, die Balken zeigen den Anteil am EU-Referenzwert nur für Vitamin C, Vitamin K, Folat und Kalium; „Wirkung & gesundheitliche
    Vorteile“ heißt „Wirkung & Gesundheitsthemen“, die Untertitel der Wirkungszeilen („Blutdruck, Durchblutung“ usw.) entfallen, die Belegfelder kommen aus den Claims `granatapfel-*`
    (Blutdruck als Hypothese mit zwei Meta-Analysen, Rest Behauptung); das Etikett „Herzgesundheit“ ist „Polyphenole“; „Bei Erkältung“ ist „Überlieferte Zuordnung: Immunsystem“;
    Tab „Für die Gesundheit“ heißt „Gesundheitsthemen“, „Traditionelle Mischungen“ zeigt bis zur Fachprüfung nur einen Hinweis; die Studien-Platzhalter sind echte Quellen (Suchauszug);
    Wechselwirkungen mit Medikamenten (MSKCC) stehen als Aussage und im Hinweis; Frequenzkarte als Behauptung mit Schwärzungsfeld; Mengen fehlen. Umsetzung: `src/data/profileGranatapfel.ts`,
    `src/ui/plantProfile.ts` (Layout „frucht“), `src/ui/plantArt.ts` (gezeichneter Granatapfel), `src/data/validateProfiles.ts`. Die Kachel „Gemüse & Obst“ der Startseite öffnet den Pflanzenatlas mit der Gruppe „Früchte“.
20. **Obst & Gemüse Atlas** (Referenzbild lokal in `design/mockups/20-obst-gemuese-atlas.png`, nicht committet) – Landingpage hinter der Kachel „Gemüse & Obst“, gleiche Bauweise
    wie der Pflanzenatlas (Seite 17). Hero „OBST & GEMÜSE ATLAS“ (Brotkrumen, Einleitung, Suchfeld, 5 Kennzahlen, Pergamentkarte „Natürliche Nahrung“ mit 6 Häkchen, Korb-Bild);
    „Obst & Gemüse Kategorien“ (16 Karten in zwei Reihen: Obst, Beeren, Zitrusfrüchte, Kernobst, Steinobst, Tropenfrüchte, Gemüse, Blattgemüse, Wurzelgemüse, Hülsenfrüchte, Kohlgemüse,
    Nachtschattengewächse, Kürbisgewächse, Zwiebelgewächse, Nüsse & Samen, Sprossen & Keimlinge); „Beliebte Obst & Gemüse“ (10 Karten mit Pfeil); „Globaler Anbau & Regionen“ (Weltkarte mit
    5 Regionen-Pins, Pergamentkarte „Saisonkalender“ mit 4 Jahreszeiten); „Nährstoffe & Gesundheit“ (6 Kreise + Button); „Wirkung auf den menschlichen Körper“ (8 Zeilen, leuchtender Körper);
    „Traditionelle Küche & Kulturen“ (5 Küchen), „Rezepte & Anwendungen“ (Smoothies, Salate, Warme Gerichte), „Wissensnetz“. **Anders umgesetzt (Schutzlinien):** Kennzahlen (800+, 600+, 200+, 100+)
    werden aus dem Atlas gezählt; die Stichworte unter den Karten („Herz & Kreislauf“, „Immunsystem“, „Gesunde Fette“ …) sind bekannte Inhaltsstoffe (Pektin, Lycopin, Beta-Carotin …), keine
    Wirkungsaussagen; „Wirkung auf den menschlichen Körper“ heißt „Ernährung & Körper“ und verweist auf die Zuordnungen im Körper-Atlas (kein Wirkversprechen); „Unterstützt Körper & Geist“ ist
    „Nahrung für Körper & Geist“, „Nachhaltig & Natürlich“ ist „Saisonal & regional“; die Nährstoffkreise zeigen Lehrbuch-Erklärungen statt „Schutz & Regeneration“; Smoothies/Salate/Warme
    Gerichte stehen als „folgt“ (es gibt noch keine Küchenrezepte, die Werkbank zeigt Hausmittel); der Saisonkalender gilt für Mitteleuropa und markiert die aktuelle Jahreszeit, ein Klick zeigt die
    Atlas-Einträge; 9 neue Atlas-Einträge (Avocado, Brokkoli, Spinat, Knoblauch, Heidelbeere, Zitrone, Süßkirsche, Linse, Kürbis) damit die Kategorien nicht leer sind, Sprossen bleiben „in Vorbereitung“.
    Umsetzung: `src/ui/produce.ts`, `src/data/produce.ts`, `src/produce.css` (nutzt die `.pl-*`-Teile von `src/plants.css`). Jeder Eintrag öffnet sein Profil (Granatapfel voll, die anderen als
    Kurzprofil); „Zurück“ führt hierher. Bildplätze `obst-*` (Priorität 8); bis dahin zeigt der Hero das Kachelbild `tile-gemuese-obst`, die Karten zeigen Symbole auf getönten Flächen.
21. **Baum Atlas** (Referenzbild lokal in `design/mockups/21-baum-atlas.png`, nicht committet) – Hauptlandingpage hinter der Kachel „Bäume“. Hero „BAUM ATLAS“ (Brotkrumen Natur › Bäume,
    Untertitel „Die lebende Architektur zwischen Erde und Himmel.“, Einleitung, Suchfeld, 5 Kennzahlen, Weltenbaum-Bild, Karte „Auf einen Blick“ mit 10 Zeilen); „Baum Kategorien“ (9 Karten: Laubbäume,
    Nadelbäume, Obstbäume, Blütenbäume, Tropische Bäume, Heilbäume, Bergbäume, Trockengebiete, Nutzholzbäume); „Der Baum als lebendiges System“ (Schaubild mit Sonnenlicht, CO₂, O₂, Blätter, Stamm, Wurzeln,
    Boden & Mykorrhiza); „Energiefluss & Geometrie“ (Torus-Bild + 7 Punkte); „Wissensebenen“ (Wissenschaftlich, Traditionell, Geometrisch, Spirituell); „Bäume der Welt“ (Weltkarte); „Beliebte Bäume“ (10 Karten);
    „Die ältesten Bäume der Welt“ (5 Karten mit Alter); „Ein Baum ist ein ganzes Ökosystem“; „Was der Baum für die Erde leistet“ (8 Symbole); „Holz & Nutzung“, „Baum in Kulturen & Mythologie“, „Forschung & Zukunft“.
    **Anders umgesetzt (Schutzlinien):** „3.000+ Baumarten“ und „120+ Familien“ sind Platzhalter: es stehen 58.497 bekannte Baumarten (Global Tree Assessment, BGCI, Suchauszug) und die gezählten Bäume im Atlas;
    die Untertitel der beliebten Bäume („Schutz & Reinigung“, „Heilende Kraft“, „Frieden & Langlebigkeit“ …) sind sachliche Stichworte (z. B. „Hartes, langlebiges Holz“), die Symbolik steht in der Ebene „Spirituell“;
    „heilenden Inhaltsstoffe“ in der Einleitung entfällt; Torus-Modell, Fraktale und Goldener Schnitt sind Aussagen `baum-torus`, `baum-fraktale`, `baum-goldener-schnitt` (Behauptung) und das Pilznetzwerk im Boden ist
    `baum-mykorrhiza` (Hypothese, Simard 1997, Deutung umstritten); die Alter der ältesten Bäume sind Schätzungen mit Spanne (Methusalem ca. 4.790–4.840, Jōmon-Sugi 2.170 bis 7.000 ungesichert, Olivenbaum von Vouves
    mindestens 2.000); „Reinigt die Luft“ bekommt einen Hinweis; die Wissensebenen zeigen die typische Belegstufe jeder Ebene. Umsetzung: `src/ui/trees.ts`, `src/data/trees.ts`, `src/trees.css`,
    `src/ui/plantArt.ts` (gezeichnetes Schaubild und Torus). 9 neue Baum-Einträge im Atlas (Eiche, Ahorn, Olivenbaum, Buche, Zeder, Mammutbaum, Baobab, Ginkgo, Kiefer); jeder Baum öffnet sein Kurzprofil, „Zurück“ führt hierher.
    Bildplätze `baum-*` (Priorität 8); bis dahin zeigt der Hero das Kachelbild `tile-baeume`.
22. **Mineral Atlas** (Referenzbild lokal in `design/mockups/22-mineral-atlas.png`, nicht committet) – Landingpage hinter der Kachel „Mineralien“ (die Kachel „Kristalle & Heilsteine“ führt weiter zum 3D-Atlas).
    Hero „MINERAL ATLAS – Die Bausteine der Erde“ (Einleitung, Buttons „Atlas erkunden“ / „Periodensystem öffnen“, 4 Kennzahlen, Erde mit Kristallen und sechs Element-Blasen Si, Cu, Fe, Mg, Au, O,
    senkrechte Sprungleiste mit 8 Punkten); „Das Periodensystem“ (Filterchips Alle, Metalle, Nichtmetalle, Halogene, Edelgase, Seltene Erden, Spurenelemente, Suchfeld, „3D-Ansicht“, 13 Elementkarten H, C, O, Na, Mg, Si, Ca,
    Fe, Cu, Zn, Ag, Au, I); „Von Atom bis Kristall“ (8 Stationen); Spotlight „Quarz SiO₂“ (Schlagwörter, 2 Buttons, 4 Vorschaubilder mit Pfeilen, „Wichtige Eigenschaften“ mit 10 Zeilen, „Kristallgeometrie“ mit 3 Formen);
    „Entstehung & Vorkommen“ (4 Karten: Magmatisch, Metamorph, Sedimentär, Hydrothermal); „Vorkommen weltweit“ (Weltkarte mit Legende und 4 Fundort-Karten Brasilien, Madagaskar, Schweiz, USA); „Quarz im menschlichen Körper?“
    (Figur mit 5 Stellen); „Frequenzen & Schwingung“ (Wellenform, 432 Hz, „Frequenz demonstrieren“, 3 Symbole); „Anwendungen“ (8 Karten); „Geschichte & Kultur“ (5 Epochen auf einer Zeitleiste); „Verwandte Mineralien“ (Karussell
    Amethyst, Rosenquarz, Citrin, Bergkristall, Rauchquarz, Achat). **Anders umgesetzt (Schutzlinien):** „2.400+ Mineralien“ ist ein Platzhalter und wird zu „6.000+ Mineralarten“ (anerkannte Arten der IMA-Liste, Link; genaue Zahl
    ändert sich jährlich und steht deshalb nicht da); „92 natürlich vorkommend“ wird zu 94 (inklusive Spuren von Neptunium und Plutonium; manche Quellen nennen 92); 118 Elemente werden aus den Daten gezählt. Die Legende der Karte
    „Hauptvorkommen / Weitere Vorkommen / Besondere Qualität“ ist eine Wertung ohne Beleg und entfällt: es steht „Fundort (Auswahl, nicht vollständig)“. Die Körper-Seite sagt ausdrücklich: Gelöstes Silizium kommt im Körper vor,
    Quarzkristalle werden nicht aufgenommen (Aussage `mineral-silizium`, Hypothese, EFSA hat Haut/Haare/Nägel-Aussagen als nicht ausreichend belegt eingestuft); „432 Hz – Harmonische Resonanz, entspricht natürlicher Ordnung“
    steht als Behauptung `mineral-quarz-frequenz` (ungeprüft), der Ton ist ein reiner Sinuston ohne Messung am Quarz, daneben der belegte Piezoeffekt (Curie 1880, `mineral-piezo`) und Schwingquarze (32.768 Hz in Uhren);
    „Heilsteine“ verweist auf `crystal-healing-general` (nicht belegt). Der Spotlight wechselt über „Verwandte Mineralien“ zu den anderen Quarz-Varietäten (Eigenschaften, Entstehung, Fundorte ändern sich mit); 3 neue
    Atlas-Einträge (Rosenquarz, Rauchquarz, Achat). Das Periodensystem ist vollständig (118 Elemente, Lehrbuchwerte, „Source pending verification“); die 13 Karten haben einen Kurztext zur Rolle in Mineralen.
    Umsetzung: `src/ui/minerals.ts`, `src/data/minerals.ts`, `src/data/elements.ts`, `src/minerals.css`, `src/ui/plantArt.ts` (gezeichneter Kristall, Reise-Symbole, Geometrie-Linien). Bildplätze `mineral-*` und `element-*`
    (Priorität 8); bis dahin zeigt der Hero das Kachelbild `tile-mineralien` mit Element-Blasen als Text, die Körper-Figur nutzt das vorhandene `body-front`.

## Was 3D bekommt und was Bild bleibt (CLAUDE.md, Harte Regeln)
- **3D (Code):** Frequenz-/Wellen-/Kymatik-/Geometrie-Szenen, Chakren-Darstellung, Atem-Ring, Weltkugel (Seiten 1, 13, 11, 12, 16).
- **3D (freie Modelle):** menschlicher Körper und Organe (Seiten 2, 3, 4, 5), Erde (Seiten 1, 8, 16).
- **Bild + 2,5D:** Pflanzen, Pilze, Früchte, Bäume, Kristalle, Orte, Hintergründe, alle Hero-Welten (Seiten 6–10, 14, 15).
