# Vuur & Smaak — Bastard VX Large

70 kamadorecepten in negen categorieën: rund, varken, kip & gevogelte, lam, vis & zeevruchten, vegetarisch, pizza & brood, bijgerechten en desserts. Elke kaart en elk recept heeft een echte foodfoto als sfeerbeeld. Gebruik de categorieknoppen en filters voor bereidingstijd en directe of indirecte hitte om een recept te vinden. Klik op een kaart om een apart receptscherm te openen met voorbereiding, duidelijke stappen, kerntemperatuur en schaalbare ingrediënten. Je kunt meerdere recepten aan één kookplan toevoegen en de samengevoegde boodschappenlijst afvinken of kopiëren.

Eigen vereenvoudigde varianten, met per recept een link naar de inspiratiebron. De uitbreiding is mede geïnspireerd op recepten en technieken van Steven Raichlen en Meathead, naast The Bastard en Big Green Egg. Geen officiële merkapp of objectieve ranglijst. De app is gepubliceerd via GitHub Pages; er wordt geen ChatGPT Sites-ruimte gebruikt.

Live app: https://sandergeurtsen-dot.github.io/vuur-en-smaak-kamado/
Broncode: https://github.com/Sandergeurtsen-dot/vuur-en-smaak-kamado

## Meteen bekijken
Pak de ZIP volledig uit. Open index.html op je computer. Recepten, schalen, vinkjes en favorieten werken zonder installatie. Als automatisch kopiëren niet beschikbaar is, verschijnt een tekstvak om handmatig te kopiëren. Offline-installatie als app werkt via HTTPS of localhost, niet via een los bestand.

## Opnieuw publiceren via GitHub Pages
1. Meld je aan op GitHub en maak een nieuwe **Public** repository, bijvoorbeeld `kamado-recepten`. GitHub Free ondersteunt Pages voor publieke repositories. De bestanden en website worden openbaar.
2. Kies **Add file → Upload files**. Upload de uitgepakte bestanden uit deze map, niet de ZIP en niet de bovenliggende map. Zorg dat `index.html` direct bovenaan in de repository staat. Upload ook de volledige map `images`, `photos.js`, `FOTOBRONNEN.md`, de icoontjes, CSS, het manifest en `sw.js`. Commit de bestanden naar `main`.
3. Ga naar **Settings → Pages**. Kies bij **Source**: **Deploy from a branch**. Kies **main** en **/ (root)** en klik **Save**.
4. Wacht tot de publicatie klaar is. De link staat in Pages en ziet er meestal uit als `https://jouwnaam.github.io/kamado-recepten/`.
5. Open de link en wacht tot bovenaan **Offline beschikbaar** staat. Test daarna desgewenst met je telefoon in vliegtuigstand.

GitHub-handleiding: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
Instellen van de publicatiebron: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Op het iPhone-beginscherm
1. Open de gepubliceerde HTTPS-link in **Safari**.
2. Tik op **Deel** (eventueel via het paginamenu).
3. Kies **Zet op beginscherm**. Zet **Open als webapp** aan als die optie verschijnt.
4. Tik op **Voeg toe**. Open het nieuwe icoon eerst één keer met internet en wacht op **Offline beschikbaar**.

Apple-handleiding: https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios

## Gebruik
- Zoek op naam of ingrediënt, kies een categorie of toon alleen favorieten.
- Filter op bereidingstijd of directe/indirecte hitte. De tijdsfilter gebruikt de vermelde bereidingstijd vóór eventuele marinade-, rijs- of rusttijd.
- Open een recept en kies 1–24 personen. Ingrediënten worden evenredig aangepast; tijd en temperatuur blijven gelijk. Voor grote hoeveelheden zijn meerdere grillrondes nodig.
- Voeg meerdere recepten toe aan het kookplan via de knop in het recept. Open **Lijst** bovenaan voor de samengevoegde boodschappenlijst. Gelijke ingrediënten met dezelfde eenheid worden opgeteld; andere eenheden blijven apart. Je kunt het aantal personen per gerecht daar nog wijzigen.
- De hoeveelheden zijn rekenwaarden. Koop hele stuks naar boven afgerond en gebruik de benodigde hoeveelheid; kruid naar smaak.
- De boodschappenlijst binnen een afzonderlijk recept hoort bij die portiegrootte. Vinkjes voor 4 personen blijven apart van die voor 8 personen.
- De gecombineerde lijst heeft eigen vinkjes. De afvinkbare lijst in een afzonderlijk recept blijft daarvan gescheiden.
- Favorieten, de gekozen porties en vinkjes blijven op dit apparaat in dezelfde browser. Er is geen account, tracking of synchronisatie.
- De app en recepten werken offline na de eerste volledige online opening. Gerechtfoto’s worden opgeslagen zodra ze online in beeld zijn geweest; foto’s van nog niet bekeken recepten kunnen offline ontbreken. Bronwebsites blijven internet nodig hebben. Een browser kan lokale opslag wissen; dit is geen gegarandeerde permanente back-up.
- De collectie bevat hoofdgerechten, bijgerechten, brood en desserts. Lees de tip bij het recept voor de portiegrootte: de burnt ends zijn bijvoorbeeld als borrelhap berekend.

## Bestanden en onderhoud
`index.html`, `style.css`, `app.js`, `recipes.js` en `photos.js` vormen de app. De 70 gerechtfoto’s staan lokaal in `images/`; de volledige naamsvermelding en licenties staan in `FOTOBRONNEN.md` en bij de foto’s op de receptschermen. Het zijn sfeerbeelden, geen foto’s van de exacte bereidingswijze. Het omslagbeeld is digitaal gemaakt op basis van de aangeleverde kamado-referentie en is geen officiële productfoto. Er zijn geen externe fonts, pakketten of bouwstappen nodig.

`manifest.webmanifest`, `sw.js` en de PNG-iconen regelen installatie/offline. Alle paden zijn relatief, zodat GitHub Pages ook onder een repositorypad werkt. Bij een update: verhoog de cacheversie in `sw.js` (bijvoorbeeld van v14 naar v15), upload de gewijzigde bestanden en open de app online opnieuw. Zo worden oude offlinebestanden vervangen.

Recepten aanpassen kan in `recipes.js`: `base` is het basisaantal personen; `qty: null` betekent naar smaak. De app is bedoeld voor de meegeleverde vertrouwde receptgegevens, niet voor het importeren van onbekende HTML.

## Bereidingsinformatie
Tijden zijn schattingen. Voor luchtregeling gebruiken we algemene Bastard-principes, geen gegarandeerde VX-schuifstanden. Volg de handleiding van jouw toestel en accessoires. Kerntemperaturen zijn conservatief gekozen op basis van USDA; picanha en zalm zijn hierdoor gaarder dan in sommige culinaire bronnen.

Basisgids: https://manuals.coolblue.be/be/the-bastard-medium-compleet-2022.pdf
Veilige kerntemperaturen: https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart

Bronnen geraadpleegd op 24 oktober 2026. De app is niet op een fysieke iPhone of een echte kamado getest.
