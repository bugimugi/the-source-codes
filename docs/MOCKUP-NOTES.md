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
22. **Mineral Atlas** (Referenzbild lokal in `design/mockups/22-mineral-atlas.png`, nicht committet) – Landingpage hinter der Kachel „Mineralien“ (die Kachel „Kristalle & Heilsteine“ führt zum Kristall-Atlas, Seite 24).
    Hero „MINERAL ATLAS – Die Bausteine der Erde“ (Einleitung, Buttons „Atlas erkunden“ / „Periodensystem öffnen“, 4 Kennzahlen, Erde mit Kristallen und sechs Element-Blasen Si, Cu, Fe, Mg, Au, O,
    senkrechte Sprungleiste mit 8 Punkten); „Das Periodensystem“ (Filterchips Alle, Metalle, Nichtmetalle, Halogene, Edelgase, Seltene Erden, Spurenelemente, Suchfeld, „3D-Ansicht“, 13 Elementkarten H, C, O, Na, Mg, Si, Ca,
    Fe, Cu, Zn, Ag, Au, I); „Von Atom bis Kristall“ (8 Stationen); Spotlight „Quarz SiO₂“ (Schlagwörter, 2 Buttons, 4 Vorschaubilder mit Pfeilen, „Wichtige Eigenschaften“ mit 10 Zeilen, „Kristallgeometrie“ mit 3 Formen);
    „Entstehung & Vorkommen“ (4 Karten: Magmatisch, Metamorph, Sedimentär, Hydrothermal); „Vorkommen weltweit“ (Weltkarte mit Legende und 4 Fundort-Karten Brasilien, Madagaskar, Schweiz, USA); „Quarz im menschlichen Körper?“
    (Figur mit 5 Stellen); „Frequenzen & Schwingung“ (Wellenform, 432 Hz, „Frequenz demonstrieren“, 3 Symbole); „Anwendungen“ (8 Karten); „Geschichte & Kultur“ (5 Epochen auf einer Zeitleiste); „Verwandte Mineralien“ (Karussell
    Amethyst, Rosenquarz, Citrin, Bergkristall, Rauchquarz, Achat). Ein Klick auf ein Element öffnet dessen Seite (Seite 23). **Anders umgesetzt (Schutzlinien):** „2.400+ Mineralien“ ist ein Platzhalter und wird zu „6.000+ Mineralarten“ (anerkannte Arten der IMA-Liste, Link; genaue Zahl
    ändert sich jährlich und steht deshalb nicht da); „92 natürlich vorkommend“ wird zu 94 (inklusive Spuren von Neptunium und Plutonium; manche Quellen nennen 92); 118 Elemente werden aus den Daten gezählt. Die Legende der Karte
    „Hauptvorkommen / Weitere Vorkommen / Besondere Qualität“ ist eine Wertung ohne Beleg und entfällt: es steht „Fundort (Auswahl, nicht vollständig)“. Die Körper-Seite sagt ausdrücklich: Gelöstes Silizium kommt im Körper vor,
    Quarzkristalle werden nicht aufgenommen (Aussage `mineral-silizium`, Hypothese, EFSA hat Haut/Haare/Nägel-Aussagen als nicht ausreichend belegt eingestuft); „432 Hz – Harmonische Resonanz, entspricht natürlicher Ordnung“
    steht als Behauptung `mineral-quarz-frequenz` (ungeprüft), der Ton ist ein reiner Sinuston ohne Messung am Quarz, daneben der belegte Piezoeffekt (Curie 1880, `mineral-piezo`) und Schwingquarze (32.768 Hz in Uhren);
    „Heilsteine“ verweist auf `crystal-healing-general` (nicht belegt). Der Spotlight wechselt über „Verwandte Mineralien“ zu den anderen Quarz-Varietäten (Eigenschaften, Entstehung, Fundorte ändern sich mit); 3 neue
    Atlas-Einträge (Rosenquarz, Rauchquarz, Achat). Das Periodensystem ist vollständig (118 Elemente, Lehrbuchwerte, „Source pending verification“); die 13 Karten haben einen Kurztext zur Rolle in Mineralen.
    Umsetzung: `src/ui/minerals.ts`, `src/data/minerals.ts`, `src/data/elements.ts`, `src/minerals.css`, `src/ui/plantArt.ts` (gezeichneter Kristall, Reise-Symbole, Geometrie-Linien). Bildplätze `mineral-*` und `element-*`
    (Priorität 8); bis dahin zeigt der Hero das Kachelbild `tile-mineralien` mit Element-Blasen als Text, die Körper-Figur nutzt das vorhandene `body-front`.
23. **Elementprofil Wasserstoff** (Referenzbild lokal in `design/mockups/23-element-wasserstoff.png`, nicht committet) – die Seite, die sich öffnet, wenn man im Mineral Atlas ein Element anklickt (Karte, Tabellenfeld,
    Element-Blase oder Enter in der Suche). Hero (Brotkrumen Mineralien › Elemente › Wasserstoff, Kasten mit Ordnungszahl, großes „H“, „Hydrogen“, 3 Schlagwörter, Einleitung, Buttons „Element im Überblick“ und „3D-Ansicht“,
    Datenkarte mit 11 Zeilen), Reiterleiste mit 11 Abschnitten (folgt beim Scrollen), „Das Element im Detail“ (Buttons „Wissenschaftliche Daten“, „Kurzfakten“), „Atomarer Aufbau“ (Bohr-Bild mit Proton, Neutron, Elektron und drei
    Isotop-Knöpfen), „3D-Ansicht“ (Atommodell, Elektronendichte, Orbital-Ansicht, Isotope vergleichen, Rotieren, Zoom, Animation), „Periodensystem“, „Elektronenkonfiguration“ (1s¹, Kästchen, Energieniveaus), „Physikalische
    Eigenschaften“ (8 Zeilen), „Vorkommen im Universum“ (≈ 75 %), „Vorkommen auf der Erde“, „Verbindungen“ (Wasser, Methan, Ammoniak, Salzsäure), „Isotope“, „Rolle im menschlichen Körper“ (5 Punkte), „Frequenzen &
    Schwingungen“ (Lyman-Alpha, Spektrum, Schwingungsmuster, Resonanz & Anwendungen), „Anwendungen“ (6 Karten), „Geschichte & Kultur“ (5 Epochen), „Forschung & Aktuelle Studien“ (Pergamentkarte mit 3 Einträgen).
    **Anders umgesetzt (Schutzlinien):** Die 3 Studientitel der Vorlage („Hydrogen as a clean energy carrier (2024)“ usw.) sind Platzhalter und entfallen; es stehen 3 auffindbare Quellen (IEA-Bericht „The Future of
    Hydrogen“ 2019, Übersichtsarbeit „Molecular Hydrogen Therapy – A Review on Clinical Studies and Outcomes“ in Molecules 2023, AGU-Pressemitteilung zum Wasserstoff im Erdwasser), alle als Suchauszug, Source pending
    verification. Schmelzpunkt −259,16 °C und Siedepunkt −252,88 °C (Vorlage: −259,14 und −252,87) nach Referenzwerten; Isotopen-Häufigkeiten 99,9885 % und 0,0115 %, Tritium T½ 12,3 Jahre (12,32). „Die energetische
    Signatur des Wasserstoffs“ heißt „Die spektrale Signatur“ (es ist Physik: Spektrallinien); die Wellenlängen kommen aus der Rydberg-Formel (Lyman, Balmer, Paschen), der Ton entfällt (UV ist nicht hörbar); das
    Schwingungsmuster ist als Veranschaulichung gekennzeichnet. „Entgiftung“ im Körper-Abschnitt ist kein Wasserstoff-Fachbegriff und wurde durch „Redox-Reaktionen (Wasserstoff-Überträger)“ ersetzt; zu molekularem
    Wasserstoff als Gas gibt es die Aussage `wasserstoff-h2-medizin` (Hypothese, Tierversuch Ohsawa 2007 und vorläufige Studien am Menschen, keine Selbstbehandlung); „Grüner Wasserstoff“ ist die Aussage
    `wasserstoff-gruen` (Erwartung, Behauptung). „Wasserstoff ist hochentzündlich“ bekommt einen Sicherheitshinweis (Knallgas). Die 3D-Ansicht ist berechnet (`src/gl/atomscene.ts`: Bohr-Modell mit dem echten
    Verhältnis 1 : 4 der ersten Bahnen, Elektronenwolke 1s, Orbitale 2s und 2p aus den Wellenfunktionen, die drei Isotope) und als Veranschaulichung gekennzeichnet; ohne WebGL bleibt eine Zeichnung. Die Moleküle sind
    berechnet bzw. schematisch gezeichnet (Wasser mit 104,5°). Alle anderen 117 Elemente bekommen ein Kurzprofil aus der Elementtabelle (Ordnungszahl, Symbol, Masse, Gruppe, Periode, Kategorie, Satz zur Rolle in
    Mineralen); weitere vollständige Profile folgen nach dem Muster in `src/data/elementProfile.ts`. Umsetzung: `src/ui/elementProfile.ts`, `src/data/elementProfile.ts`, `src/ui/elementArt.ts`, `src/gl/atomscene.ts`,
    `src/elementProfile.css`, Prüfung in `src/data/validateElements.ts`. Bildplätze `element-h-*` (Priorität 8); bis dahin zeigt die Seite gezeichnete Platzhalter und das vorhandene `body-front`.
24. **Kristall-Atlas „Kristalle & Heilsteine“** (Referenzbild lokal in `design/mockups/24-kristall-atlas.png`, nicht committet) – Landingpage hinter der Kachel „Kristalle & Heilsteine“ (der 3D-Atlas bleibt über „3D-Ansicht“ und
    „Details“ erreichbar). Hero „KRISTALLE & HEILSTEINE – Die verborgene Geometrie der Erde“ (Einleitung, Buttons „Kristalle entdecken“ und „Die Wissenschaft“, Kennzahlen-Karte mit 4 Zeilen, Spruch „Kristalle sind gefrorenes Licht der Erde“);
    10 Kategorienkarten (Alle Kristalle, Quarz-Gruppe, Edelsteine, Heilsteine, Rohkristalle, Trommelsteine, Seltene Kristalle, Meteoriten-Kristalle, Farbkristalle, Sammlerstücke); „Beliebte Kristalle“ (Karussell); „Kristallsysteme“ (7 Zeichnungen);
    Spotlight „Amethyst“ mit Vorschaubildern, Pfeilen und den Reitern Eigenschaften (11 Zeilen, Formel, Kristallstruktur), Wirkung, Anwendung, Vorkommen; „Energetische Eigenschaften“ (528, 432, 963 Hz); „Chakra-Zuordnung“ (sitzende Figur,
    7 Chakren); „Anwendungsbereiche“ (8 Karten); „Vorkommen weltweit“ (Karte, 5 Länder); „Entstehung“ (4 Karten); „Geschichte & Kultur“ (4 Epochen); „Verwandte Themen“ (6 Karten); „Wissenschaft & Studien“ (Pergamentkarte).
    **Anders umgesetzt (Schutzlinien):** „2.000+ Kristallarten“ ist ein Platzhalter und wird zu „6.000+ Mineralarten“ (IMA-Liste, Link); die drei Studientitel der Vorlage sind Platzhalter und entfallen, es stehen drei auffindbare Quellen:
    Curie 1880 (Aussage `mineral-piezo`), von Laue 1912 / Nobelpreis 1914 (Link zu nobelprize.org) und die Placebo-Untersuchung von French 2001 (Aussage `crystal-healing-general`, „aus dem Gedächtnis“). Die Symmetrie der Kristallsysteme ist in
    der Vorlage teils falsch („Kubisch 4-zählig“, „Orthorhombisch 3-zählig“): richtig sind vier dreizählige und drei zweizählige Achsen. Die Schlagwörter unter dem Namen („Schutz · Klarheit · Spiritualität“) sind Überlieferung der modernen
    Steinkunde und tragen die Belegstufe der Aussage `crystal-<id>-effects` (nicht belegt); Chakra-Zuordnungen kommen nur aus dem Atlas und sind als modern gekennzeichnet; die Frequenzen 528, 432 und 963 Hz stehen als Aussage `kristall-solfeggio`
    (nicht belegt, Solfeggio-Zahlen sind modern) neben dem belegten Schwingquarz (32.768 Hz). „Wasser: Energetisierung“ hat einen Giftwarnhinweis (Malachit, Pyrit u. a. nicht ins Trinkwasser) und bei jeder Anwendungskarte steht, ob sie
    dokumentiert oder Überlieferung ist. Die Weltkarte zeigt Fundorte ohne Wertung („Russland: Seltene Kristalle“ der Vorlage entfällt, die Länder und Kristalle werden aus den Daten gezählt). Die Kategorien „Seltene Kristalle“, „Meteoriten-Kristalle“
    und „Sammlerstücke“ sind „in Vorbereitung“; die übrigen filtern die Einträge nach nachvollziehbaren Regeln (Heilsteine = mit Chakra-Zuordnung im Atlas). Neuer Atlas-Eintrag Labradorit (Beliebte Kristalle der Vorlage), insgesamt 14
    Kristalle; die Systeme, Kristallstrukturen, der SiO₄-Baustein und die Figur sind im Code gezeichnet (`src/ui/crystalArt.ts`). Umsetzung: `src/ui/crystals.ts`, `src/data/crystals.ts`, `src/crystals.css`, Prüfung in
    `src/data/validateCrystals.ts`. Bildplätze `kristall-*` (Priorität 8); bis dahin zeigt der Hero das Kachelbild `tile-kristalle`, die Karten gezeichnete Kristalle in der Farbe des Atlas-Eintrags.

25. **Der menschliche Körper** (Referenzbild lokal in `design/mockups/25-menschlicher-koerper.png`, nicht committet) – Landingpage hinter der Kachel „Menschlicher Körper“ (View `anatomy`, Tab „Körper“; der bisherige Körper-Atlas mit
    Organ-Pins heißt jetzt Tab „Organe“ und bleibt über „Organ im Detail ansehen“, „Im Körper-Atlas ansehen“ und die Startseite erreichbar). Hero „DER MENSCHLICHE KÖRPER – Ein faszinierendes System.“ (Einleitung, Buttons „Körper erkunden“ und
    „Video ansehen“, 4 Kennzahlen, Liste mit 10 Bereichen rechts, Spruch „Ein Meisterwerk der Natur.“); „Die Organsysteme“ (12 Karten in 6 × 2, Tippen zeigt Text, Organe und Sprünge); „Interaktiver 3D-Körper“ (links Text, Knopf
    „3D-Modell starten“ und 6 Ebenen-Chips, Mitte der Körper mit Werkzeugknöpfen Zoom +, −, Zurücksetzen, Transparenz, rechts das Organ-Fenster „Herz – das Kraftzentrum“ mit Bild, Text, Knopf „Organ im Detail ansehen“, 4 Zahlen und 7 Themen);
    „Von der Zelle zum Organismus“ (7 Stufen) mit „Zellen – die Grundbausteine“ (4 Themen); „Der Körper im Laufe des Lebens“ (5 Abschnitte); „Körperfunktionen & Prozesse“ (8); „Gesundheit & Wohlbefinden“ (8);
    „Wissenschaft & Forschung“ (5 Karten, „Alle Studien anzeigen“); „Verbindungen im Atlas“ (4) und ein Zitat auf dem Gehirnbild.
    **Interaktiver Körper (echtes 3D mit freiem Modell):** Standardansicht ist das Anatomie-Bild mit Organ-Pins (Tippen zoomt, das Organ-Fenster wechselt). „3D-Modell starten“ lädt beim ersten Mal zwei Dateien (je etwa 1,5 MB) und zeigt
    **echte Geometrie** von Knochen, Bändern, Sehnen und Muskeln aus **BodyParts3D 4.0** (© The Database Center for Life Science, **CC BY 4.0**; Auswahl, Vereinfachung und Kompression von uns, Rezept `scripts/build-body-models.mjs`,
    Quelle: npm-Paket `@somakine/bodyparts3d-musculoskeletal` 0.2.0). Ziehen dreht, die Knöpfe zoomen (das Mausrad scrollt weiter die Seite), Tippen auf ein Teil zeigt Namen (deutsch, englisch, Art; Wörterbuch `src/data/bodyparts.ts`).
    Ebenen-Chips: Knochen und Muskeln schalten die zwei Modelle, Transparenz macht die Muskeln durchsichtig, Organe kehrt zum Bild zurück. **Nerven und Gefäße** zeigt die Vorlage als Ebenen; dafür liegt kein frei lizenziertes Modell vor,
    die Chips sind gestrichelt und erklären das. Auch das Herz gibt es nur als Bild (kein freies 3D-Organmodell gefunden); „3D-Ansicht“ in der Herz-Liste sagt das offen. Ohne WebGL bleibt die Bildansicht.
    **Anders umgesetzt (Schutzlinien):** Die Überschrift der Vorlage „Die 11 Organsysteme“ zeigt zwölf Karten; je nach Lehrbuch zählt man 11 oder 12 (Immun- und Lymphsystem oft zusammen), die Seite sagt „Die Organsysteme“ und erklärt es.
    Platzhalterzahlen („78+ Organe“, „100.000+ biochemische Prozesse“) entfallen; die Kennzahlen sind 12 Organsysteme (aus den Daten), 206 Knochen, über 600 Skelettmuskeln, 30–37 Billionen Zellen (Aussage `koerper-zellzahl`, Schätzung nach
    Bianconi 2013 und Sender 2016, „Suchauszug, Source pending verification“). „Video ansehen“ ist ein deaktivierter Knopf mit „folgt“ (es gibt kein Video). Entgiftung hat die Aussage `koerper-detox` (nicht belegt, Klein & Kiat 2015);
    Gesundheitsthemen geben nur Orientierung ohne Mengen, bei Beschwerden und Notfällen (112) steht der Hinweis auf ärztliche Hilfe. Die fünf Forschungskarten tragen je eine Quelle (Azevedo 2009, Nurk 2022 mit DOI, HMP 2012, Takahashi 2006,
    López-Otín 2013); die Platzhalter-Studientitel der Vorlage entfallen. Lebensabschnitte, Zelle und Herz sind bis zu den Bildern im Code gezeichnet (`src/ui/anatomyArt.ts`). Umsetzung: `src/ui/anatomy.ts`, `src/data/anatomy.ts`,
    `src/gl/bodyscene.ts`, `src/data/bodyparts.ts`, `src/anatomy.css`, Prüfung in `src/data/validateAnatomy.ts`. Bildplätze `koerper-*` (52, Priorität 8); bis dahin zeigt der Hero das vorhandene `body-front`.

26. **Frequenz – Hauptseite „Alles schwingt.“** (Referenzbild lokal in `design/mockups/26-frequenz.png`, nicht committet) – Landingpage hinter der Kachel „Frequenzen & Vibrationen“ (View `freq`, Tab „Frequenz“; die berechnete
    Kymatik- und Geometrie-Seite heißt jetzt Tab „Kymatik“ und bleibt über „Kymatik visualisieren“, „Die Frequenz-Welt betreten“, den Chip „Kymatik“ und die Kachel „Geometrie“ erreichbar). Aufbau: Hero „FREQUENZ – Alles schwingt.“
    (Einleitung, Knopf „Frequenz erkunden“, 7 Chips Klang / Licht / Kymatik / Resonanz / Materie / Medizin / Bewusstsein, Figur mit sechs Kreisen: Worte, Licht, Nahrung, Klänge, Materialien, Umgebung); „Signal Analyzer“ (Suche,
    7 Kategorien, Halbkreis-Anzeige, Karte mit Balken); „Die Kraft der Frequenz“ (Radio, Resonanz, Levitation, Medizin & Heilung); „Frequenz Explorer“ (Suche, neun beliebte Frequenzen, Karte „432 Hz“ mit Ton, Regler, vier Feldern und
    Kymatik-Platte); „Frequenz in der realen Welt“ (6 Karten); Schlussband „Dein Körper empfängt ständig Informationen.“ mit „Die Frequenz-Welt betreten“.
    **Anders umgesetzt (Schutzlinien):** Der **„Signal Index“ +68** und die Wirkwerte der Rosmarin-Karte (Stimmung +75, Konzentration +68 …) sind Platzhalter ohne Messung; eine solche Zahl wäre erfunden und ein Heilversprechen im Ton der Seite.
    Die Halbkreis-Anzeige zeigt stattdessen die **Belegstufe** der Aussagen (Widerlegt – Nicht belegt – Behauptung – Belegt – Gesichert), die Balken der Karte sind Belegstufen der echten Aussagen, keine Wirkstärken; die Seite sagt das offen
    (Fußnote). Für Rosmarin gibt es die Aussagen `rosmarin-traditional-use` (Behauptung) und neu `rosmarin-duft-kognition` (Hypothese, Moss 2003 und Moss & Oliver 2012, Suchauszug). Kategorien ohne veröffentlichte Aussage („Wort“,
    „Getränk“) sagen das, statt etwas zu erfinden. Der Explorer rechnet alles Rechenbare selbst: Zyklen pro Sekunde, **nächster Ton und Abweichung in Cent** (statt „Angenehmer, weicher Ton“; 432 Hz liegt 32 Cent unter a′ = 440 Hz), das
    **Chladni-Muster** des Plattenmodells aus `src/data/cymatics.ts` (Modell, keine Messung), der Ton nur auf Klick (leise, `src/audio/tone.ts`). „Wirkung (überliefert)“ ist die Überlieferung der Klangheilkunde und trägt die Aussage
    `freq-solfeggio` (nicht belegt); 432 Hz zusätzlich `freq-432-440-pilot` (kleine Pilotstudie, Hypothese). Die vier Karten der „Kraft“ haben kleine echte Rechnungen (Schwingkreis f = 1/(2π√(LC)) mit Regler, Resonanzkurve eines
    gedämpften Oszillators, Wellenlänge und Knotenabstand bei Ultraschall, Tabelle der Schallbereiche). „Medizin“ nennt nur ärztlich eingesetzten fokussierten Ultraschall (Aussage `freq-hifu`, Elias 2016 mit DOI) und grenzt ihn von
    „Heilfrequenzen“ und Rife ab; „Tumorgewebe gezielt beeinflussen“ der Vorlage ist allgemeiner formuliert („Gewebe“), keine Behandlungsanleitung. Bei Levitation stehen die Aussagen `acoustic-levitation-small` (neu veröffentlicht, belegt
    für kleine Teilchen) und `acoustic-levitation` (Stein-Levitation, nicht belegt) nebeneinander. Weitere neue Aussagen: `freq-pflanze-vibration` (Hypothese), `freq-schumann` (belegt, Schumann-Resonanz ≈ 7,8 Hz). Die Kopfzeile der
    Vorlage („THE LIVING ATLAS“) wird nicht übernommen (die Seite hat ihre eigene Leiste). „Ein Meisterwerk“-artige Schlusssätze stehen als Leitgedanke und nicht als Tatsache („Dass der Körper beliebige Frequenzen empfängt …, ist nicht belegt“).
    Umsetzung: `src/ui/frequency.ts`, `src/data/freqpage.ts`, `src/ui/freqArt.ts`, `src/frequency.css`, Prüfung in `src/data/validateFreq.ts`. Bildplätze `freq-*` (18, Priorität 8: `freq-hero`, `freq-kugel-*`, `freq-kraft-*`,
    `freq-welt-*`, `freq-schluss`); bis dahin zeigt der Hero eine gezeichnete Nachtlandschaft mit dem vorhandenen `body-front` und Schallringen, die Karten gezeichnete Bilder (Radio, Kugelpendel, Stein im Schallfeld, Fokus).

27. **Atem – Landingpage „Dein Atem verbindet alles.“** (Referenzbild lokal in `design/mockups/27-atem.png`, nicht committet) – Landingpage hinter der Kachel „Atem & Meditation“ (View `atem`, Tab „Atem“; die bisherige Übungsseite mit
    Takt-Ring, Lehrbuchwissen und Überlieferungen heißt jetzt Tab „Atemübung“ und bleibt über „Die Welt des Atems betreten“, „Atembeobachtung ansehen“ und den Tab erreichbar; Verweise aus Pflanzenprofilen und der Körper-Seite führen zur neuen Seite).
    Aufbau: Hero „ATMEN & MEDITATION – Dein Atem verbindet alles.“ (Einleitung, Knöpfe „Atemtechniken entdecken“ und „Video ansehen“, Liste mit fünf Bereichen: Gehirn, Nervensystem, Atmung, Körper, Geist); vier Einstiegskarten (Atemtechniken, Nervensystem,
    Wirkung & Wissenschaft, Traditionelles Wissen); „Finde die passende Atemtechnik“ (8 Ziele, Technik mit „Schritt für Schritt“, Ring „Jetzt mitatmen“ mit Takt, Runden-Auswahl, rechts Reiter Wirkung / Details / Studien / Varianten);
    „Was beim Atmen im Körper passiert“ (Lungenbild mit sechs Beschriftungen); „Weitere Bereiche entdecken“ (4 Karten); Schlussband „Dein Atem ist ein Werkzeug.“.
    **Anders umgesetzt (Schutzlinien):** „**Positive Effekte**“ der Vorlage (beruhigt das Nervensystem, senkt den Blutdruck, fördert besseren Schlaf …) wären Wirkversprechen im Ton der Seite. Der Reiter heißt „Was dazu gesagt und untersucht wird“ und zeigt jede
    Wirkung als Aussage mit Belegstufe und Balken (Belegstufe, keine Stärke): `atem-langsam-hrv` (belegt), `atem-angst`, `atem-stimmung`, `atem-blutdruck` (Hypothesen), `atem-478-schlaf` (Behauptung, keine Studie zu 4-7-8 bekannt), `atem-achtsamkeit` (belegt, Meditation),
    `atem-immun-wimhof` (Hypothese, kleine Studie), `atem-zirbeldruese` (nicht belegt, die „Zirbeldrüse“ der Vorlage bleibt als Stichwort stehen und wird eingeordnet). Quellen (Zaccaro 2018, Russo 2017, Lehrer & Gevirtz 2014, Balban 2023, Mahtani 2012,
    Goyal 2014, Kox 2014) sind Suchauszüge ohne DOI, Source pending verification. **Gefährliches ohne Anleitung:** „Immunsystem stärken“ und „Kälte & Belastung“ (Wim Hof, Tummo) haben keinen Takt und keine Schritte, sondern eine Warnung (Ohnmacht nach
    kräftigem Atmen und Atemanhalten, nie im oder am Wasser, nie beim Fahren, nie im Stehen); die Prüfung `validateAtem.ts` verbietet dort Takt und Anleitung. Alle Takte haben nur Phasen bis 8 Sekunden Halten; vor langen Atempausen steht der Hinweis auf ärztliche
    Abklärung (Herz, Lunge, Schwangerschaft). „Meditation“ hat keinen Takt (der Atem bleibt, wie er ist). „Video ansehen“ ist ein deaktivierter Knopf mit „folgt“. Der Schlusssatz „… beruhigen, stärken, heilen und dein Bewusstsein erweitern“ steht als Leitgedanke
    mit dem Hinweis, dass „heilen“ und „Bewusstsein erweitern“ nicht belegt sind. Der Takt-Ring ist berechnet (Segmente nach den Phasenlängen, Figur wächst beim Einatmen) und läuft nur auf Klick, stoppt beim Wechsel der Technik oder des Tabs.
    Umsetzung: `src/ui/atem.ts`, `src/data/atempage.ts`, `src/ui/atemArt.ts`, `src/atem.css`, Prüfung in `src/data/validateAtem.ts`. Bildplätze `atem-*` (11, Priorität 8: `atem-hero`, `atem-karte-*`, `atem-koerper`, `atem-mehr-*`, `atem-schluss`); bis dahin gezeichnete
    Nachtlandschaft mit einer meditierenden Figur, das vorhandene Lungenbild `organ-lungs` und getönte Karten.

28. **Krankheiten & Beschwerden – Landingpage „Beschwerden verstehen. Natürlich Lösungen finden.“** (Referenzbild lokal in `design/mockups/28-beschwerden.png`, nicht committet) – Landingpage hinter der Kachel „Krankheiten & Beschwerden“ (View `beschwerden`,
    Tab „Beschwerden“). Aufbau: Hero „WISSEN · NATUR · GANZHEITLICHKEIT“ mit Figur und acht Kreisen (Geist, Atmung, Ernährung, Pflanzen, Chakren, Frequenzen, Mineralien & Kristalle, Lebensstil), Suchfeld mit drei Reitern (Beschwerde suchen / Persönliche Analyse /
    Alle Krankheiten A–Z), Knopf „Detaillierte Analyse mit Kontextfragen“ und Beispiel-Chips; „Häufige Beschwerden“ (8 Karten); die Dreier-Zeile „1. Deine Angaben“ / „2. Beispiel-Analyse“ / „Chakren-Analyse“ / „Lifestyle & Umgebung“; „3. Deine persönlichen Empfehlungen“
    (8 Karten); drei Hinweis-Kästen (Wichtige Hinweise, Mögliche Wechselwirkungen, Wann zum Arzt?).
    **Anders umgesetzt (Schutzlinien; die wichtigste Seite des Projekts in dieser Hinsicht):** Die Vorlage zeigt eine **Analyse**: „Wahrscheinliche Zusammenhänge“ mit „Hoher/Mittlerer/Geringer Einfluss“, Chakren-Prozentwerte (Kronenchakra 72 % …) und eine „individuelle“
    Empfehlungsauswahl. Das wären erfundene Messwerte und eine Selbstdiagnose-Funktion. Ersetzt durch: (1) **Suche in der Bibliothek** statt Diagnose; sie zeigt passende Beschwerdegruppen und Atlas-/Aussage-Einträge und stellt **vorher Warnzeichen** dar, wenn Notfall-Wörter
    vorkommen (Brustschmerz, Atemnot, Lähmung, Blut im Stuhl …: Notruf 112, Bereitschaftsdienst 116 117) oder Krisen-Wörter (Telefonseelsorge 0800 111 0 111 / 0800 111 0 222); (2) das **Beispiel** „Kopfschmerzen, Magenbeschwerden & Erschöpfung“ ohne Einfluss-Stufen und ohne
    Reihenfolge, nur häufig genannte Auslöser als Lehrbuchwissen (Aussage `beschwerde-kopfschmerz-ausloeser`); (3) **Chakren** mit ihren Themen der Überlieferung, ohne Prozentwerte (Hinweis, dass diese Platzhalter waren); (4) die **Selbsteinschätzung** (Regler 1–5, „Belastung“),
    die nur die eigenen Angaben spiegelt und bei 4 oder 5 allgemeine Hinweise zeigt; (5) die **Empfehlungen** heißen „Mögliche Ansätze“, zeigen je Karte, was belegt oder Überlieferung ist (Aussagen mit Belegstufe), und „Individuellen Plan erstellen“ ist ein **Merkzettel** für das Gespräch
    in der Praxis oder Apotheke (kopierbar, nirgends gespeichert). „2,5–3 Liter täglich“ der Vorlage entfällt (eine feste Trinkmenge ist für Herz- und Nierenkranke gefährlich). Jede Beschwerdegruppe hat **Warnzeichen** („wann zur Ärztin oder zum Arzt“, mindestens vier) und
    Hinweise zu Schwangerschaft, Kindern und Medikamenten; die Prüfung `validateBeschwerden.ts` verlangt Warnzeichen, verbietet Dosierungsangaben („mg“, „x täglich“) und Einfluss-Stufen im Beispiel. „Wechselwirkungen prüfen“ ist kein Prüfwerkzeug (das wäre gefährlich vorzutäuschen),
    sondern eine Liste bekannter Beispiele (Johanniskraut, Grapefruitsaft, Vitamin K und Marcumar, Lakritze, Mineralstoffe und Antibiotika, Ginkgo/Knoblauch/Fischöl; Aussage `beschwerde-wechselwirkungen`) mit dem Hinweis, dass die Apotheke prüft. Der Reiter „Alle Krankheiten A–Z“ führt
    nur die vorhandenen Beschwerden und sagt, dass viele Krankheiten fehlen. Neue Aussagen (Quellen als Suchauszug, ohne DOI, Source pending verification): `beschwerde-kopfschmerz-ausloeser`, `-wechselwirkungen`, `-honig-husten`, `-pfefferminzoel-reizdarm`, `-schlaf-kvt`, `-baldrian-schlaf`,
    `-rueckenschmerz-aktiv`, `-akupunktur-schmerz`, `-cranberry-vorbeugung`. Eine neunte Gruppe „Blasenentzündung“ ist nur über Suche und A–Z erreichbar (Beispiel-Chip der Vorlage). Umsetzung: `src/ui/beschwerden.ts`, `src/data/beschwerden.ts`, `src/beschwerden.css`,
    Prüfung in `src/data/validateBeschwerden.ts`. Bildplätze `beschwerden-*` (26, Priorität 8); bis dahin getönte Karten, gezeichnete Landschaft und das vorhandene `body-front` mit leuchtenden Chakra-Punkten.

29. **Chakren – Landingpage „Kronenchakra“ (alle sieben umschaltbar)** (Referenzbild lokal in `design/mockups/29-chakren.png`, nicht committet) – Landingpage hinter der Kachel „Chakren“ (View `chakren`, Tab „Chakren“; die berechnete 3D-Seite heißt jetzt Tab „Chakren 3D“ und ist über „In 3D ansehen“ erreichbar).
    Aufbau: Hero „CHAKREN · ENERGIEZENTREN“ mit Chakra-Name, Dreiklang (z. B. „Spiritualität · Bewusstsein · Einheit“), Einführungstext, Knopf „Geführte Meditation starten →“, vier Kurzangaben (Frequenz, Sanskrit-Name, Position, Farbe), sitzender Figur mit sieben leuchtenden Punkten an einem See und rechts einer Steckbrief-Karte
    (Element, Farbe, Position, Symbol, Frequenz, Thema); darunter die Auswahlzeile Wurzel/Sakral/Solarplexus/Herz/Hals/Stirn/Krone mit Pfeilen, neun Reiter (Übersicht, Bedeutung, Symptome & Balance, Heilsteine & Kristalle, Ernährung, Frequenzen & Klang, Meditation & Yoga, Natur & Kräuter, Affirmationen) und die Karten der Übersicht:
    Heilsteine | Farben & Licht, Ernährung | Ätherische Öle & Düfte, Frequenzen & Klang (Player mit Wellenform) | Meditation & Atemübungen | Yoga & Bewegung | Natur & Umgebung | Positive Affirmationen.
    **Anders umgesetzt (Schutzlinien):** (1) „Empfohlene Heilsteine/Ernährung“ heißt „Zuordnung der Überlieferung“ bzw. „Zuordnung nach Farbe“; die Seite empfiehlt nichts im eigenen Ton. (2) „Frequenz (traditionell)“ der Vorlage heißt „Frequenz (modern zugeschrieben)“, weil die Solfeggio-Zuordnung eine moderne Behauptung ist
    (Aussage `freq-solfeggio`); Kurzangabe „Frequenz (modern)“. Der Tag „TRADITIONELLES WISSEN“ heißt „ÜBERLIEFERTES WISSEN“. (3) Die Reiter „Symptome & Balance“ zeigen **keine Krankheiten**, sondern überlieferte Themen (wenig/stark ausgeprägt/ausgeglichen), die zugeordnete Körperregion und einen Hinweis „keine Diagnose“ mit Link zu den Warnzeichen der Beschwerden-Seite.
    (4) **Kopfstand, Schulterstand, Pflug, Kamel, Fisch** tragen einen Sicherheitshinweis (Validator erzwingt das). (5) Ätherische Öle mit Sicherheitszeile (nicht einnehmen, nicht unverdünnt, Schwangerschaft/Kinder/Katzen), keine Mengen. (6) Die Meditationen sind **Lesetexte mit Zeitgeber** (Schritt für Schritt, Hinweis bei Schwindel/Unruhe), kein Audio;
    „Chanting Om“, „Tibetische Klangschalen“ und die Naturklänge stehen als „Aufnahme folgt“. (7) Der Ton im Player ist ein leiser Sinuston, nur auf Klick. (8) „Element: Gedanke / Äther“ der Vorlage bleibt mit dem Zusatz „in manchen Darstellungen: jenseits der Elemente“. Neue Aussagen (alle `unsupported`, Quellen: Woodroffe 1919 aus dem Gedächtnis, Source pending verification):
    `chakra-modell`, `chakra-zuordnungen-modern`, `chakra-arbeit-heilung`. Umsetzung: `src/ui/chakren.ts`, `src/data/chakrapage.ts`, `src/ui/chakrenArt.ts`, `src/chakren.css`, Prüfung in `src/data/validateChakren.ts` (alle sieben Chakren vollständig, Katalog- und Atlas-Verweise, Bildplätze, keine Dosierungen oder Heilversprechen).
    Bildplätze `chakren-*` (105, Priorität 8: Hero, sieben Symbole, sechs Meditationsarten, Steine/Speisen/Düfte/Yoga/Natur); bis dahin getönte Karten, gezeichnete Figur und Lotus-Symbole aus dem Code.

30. **Nährstoffe – Landingpage „Bausteine deines Lebens.“** (Referenzbild lokal in `design/mockups/30-naehrstoffe.png`, nicht committet) – Landingpage hinter der Kachel „Nährstoffe“ (View `nutrients`, Tab „Nährstoffe“; ersetzt die frühere Kartenliste, alle Links dorthin bleiben gültig).
    Aufbau: Hero „NÄHRSTOFFE · VITAMINE · MINERALIEN · AMINOSÄUREN“ mit Titel, Einführung, Suchfeld mit Pfeil-Knopf, „Beliebte Themen“ (Vitamin D, Magnesium, Omega-3, Protein, Eisen, Zink, B12, …), leuchtender Körperfigur in der Mitte (Vorlage: sitzend im Lotussitz vor Bergsee) und rechts sechs Kreisen (Vitamine, Mineralien, Aminosäuren, Fettsäuren, Spurenelemente, Enzyme & Co-Faktoren);
    darunter sieben Bildkarten (+ Sekundäre Pflanzenstoffe); „Interaktiver Körper“ mit zehn Systemen links, Figur mit vier Hinweis-Kästen (Gehirn, Herz, Immunsystem, Verdauung) und rechts Feld „Gehirn & Nervensystem“ mit fünf wichtigen Nährstoffen, gewähltem Nährstoff und Reitern Funktion/Quellen/Wirkung/Mangel/Einnahme;
    „Nährstoffe entdecken“ mit Filter (Alle + sieben Gruppen) und Kartenleiste mit Pfeil; vier Karten „Wie Nährstoffe wirken“, „Natürliche Quellen“, „Einnahme & Bioverfügbarkeit“, „Mangelerscheinungen“.
    **Anders umgesetzt (Schutzlinien):** (1) Der Hero-Text sagt „ihre Aufgaben im Körper … Grundwissen für Energie, Gesundheit und Wohlbefinden“ statt „Wirkungen … für mehr Energie, Gesundheit und Wohlbefinden“ (kein Versprechen im eigenen Ton). (2) Die Zuordnung Nährstoff → System steht als Lehrbuch-Satz „beteiligt an …“; wo die Lage offen ist, sagt der Satz das (Coenzym Q10 und Herz, Vitamin D und Gehirn, Probiotika).
    (3) Reiter „Wirkung“ zeigt nur veröffentlichte Aussagen mit Belegstufe, sonst den Hinweis, dass es keine bewertete Aussage gibt. (4) „Einnahme“ nennt keine Mengen, nur Aufnahme-Wissen (Fett, Vitamin C und Eisen, Phytinsäure …). (5) „Mangelerscheinungen … wie du gezielt vorbeugst“ heißt „klassische Mangelbilder … nur eine Untersuchung zeigt, ob ein Mangel vorliegt“, mit Link zu den Warnzeichen der Beschwerden-Seite.
    (6) Kartenzeilen ohne „Stimmung“ und „Entzündungsregulation“ als Wirkung; „Schutz & Zellgesundheit“ der Pflanzenstoffe heißt „Farbe, Duft & Schutz der Pflanze“. (7) Cholin und Coenzym Q10 stehen in der Vorlage ohne Gruppe: Q10 bei „Enzyme & Co-Faktoren“, Cholin, Ballaststoffe und Probiotika unter „Weitere Nährstoffe“ (nur bei „Alle“).
    Umsetzung: `src/ui/nutrients.ts`, `src/data/nutrients.ts` (27 Nährstoffe), `src/data/naehrpage.ts`, `src/naehrstoffe.css`, Prüfung in `src/data/validateNaehrstoffe.ts` (zehn Systeme mit je fünf Nährstoffen, Verweise, Bildplätze, keine Dosierungen oder Heilversprechen).
    Bildplätze `naehrstoffe-*` und `naehrstoff-<id>` (40, Priorität 8: Hero, Körper, 7 Gruppen, 4 Infokarten, 27 Nährstoffe); bis dahin `body-front` vor gezeichneter Nachtlandschaft, vorhandene `nutrient-*`-Motive und getönte Karten.

## Was 3D bekommt und was Bild bleibt (CLAUDE.md, Harte Regeln)
- **3D (Code):** Frequenz-/Wellen-/Kymatik-/Geometrie-Szenen, Chakren-Darstellung, Atem-Ring, Weltkugel (Seiten 1, 13, 11, 12, 16).
- **3D (freie Modelle):** menschlicher Körper und Organe (Seiten 2, 3, 4, 5), Erde (Seiten 1, 8, 16).
- **Bild + 2,5D:** Pflanzen, Pilze, Früchte, Bäume, Kristalle, Orte, Hintergründe, alle Hero-Welten (Seiten 6–10, 14, 15).
