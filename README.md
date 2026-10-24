# Vuur & Smaak — Bastard VX Large

Tien gevarieerde kamadorecepten, persoonlijk geselecteerd: picanha, sticky spareribs, pulled pork, peri-peri kipspiezen, cederzalm, pizza margherita, bloemkool met specerijenyoghurt, gevulde portobello’s, hasselback aardappels en gegrilde ananas.

Eigen vereenvoudigde varianten, met per recept een link naar de inspiratiebron. Geen officiële merkapp of objectieve ranglijst. De app is gepubliceerd via GitHub Pages; er wordt geen ChatGPT Sites-ruimte gebruikt.

Live app: https://sandergeurtsen-dot.github.io/vuur-en-smaak-kamado/
Broncode: https://github.com/Sandergeurtsen-dot/vuur-en-smaak-kamado

## Meteen bekijken
Pak de ZIP volledig uit. Open index.html op je computer. Recepten, schalen, vinkjes en favorieten werken zonder installatie. Als automatisch kopiëren niet beschikbaar is, verschijnt een tekstvak om handmatig te kopiëren. Offline-installatie als app werkt via HTTPS of localhost, niet via een los bestand.

## Opnieuw publiceren via GitHub Pages
1. Meld je aan op GitHub en maak een nieuwe **Public** repository, bijvoorbeeld `kamado-recepten`. GitHub Free ondersteunt Pages voor publieke repositories. De bestanden en website worden openbaar.
2. Kies **Add file → Upload files**. Upload de uitgepakte bestanden uit deze map, niet de ZIP en niet de bovenliggende map. Zorg dat `index.html` direct bovenaan in de repository staat. Bewaar ook de icoontjes, scripts, CSS, het manifest en `sw.js`. Commit de bestanden naar `main`.
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
- Kies een recept en 1–24 personen. Ingrediënten worden evenredig aangepast; tijd en temperatuur blijven gelijk. Voor grote hoeveelheden zijn meerdere grillrondes nodig.
- De hoeveelheden zijn rekenwaarden. Koop hele stuks naar boven afgerond en gebruik de benodigde hoeveelheid; kruid naar smaak.
- De boodschappenlijst hoort bij één recept en portiegrootte. Vinkjes voor 4 personen blijven apart van die voor 8 personen.
- Favorieten, de gekozen porties en vinkjes blijven op dit apparaat in dezelfde browser. Er is geen account, tracking of synchronisatie.
- Offline werkt nadat alle bestanden online zijn opgeslagen. Bronwebsites blijven internet nodig hebben. Een browser kan lokale opslag wissen; dit is geen gegarandeerde permanente back-up.
- De collectie bevat ook bijgerechten en een dessert. Lees de tip bij het recept voor de portiegrootte.

## Bestanden en onderhoud
`index.html`, `style.css`, `app.js` en `recipes.js` vormen de app. Alle beelden zijn lokaal: een CSS-kamado en eigen appicoontjes. Er zijn geen externe fonts, pakketten of bouwstappen nodig.

`manifest.webmanifest`, `sw.js` en de PNG-iconen regelen installatie/offline. Alle paden zijn relatief, zodat GitHub Pages ook onder een repositorypad werkt. Bij een update: verhoog de cacheversie in `sw.js` (bijvoorbeeld van v2 naar v3), upload de gewijzigde bestanden en open de app online opnieuw. Zo worden oude offlinebestanden vervangen.

Recepten aanpassen kan in `recipes.js`: `base` is het basisaantal personen; `qty: null` betekent naar smaak. De app is bedoeld voor de meegeleverde vertrouwde receptgegevens, niet voor het importeren van onbekende HTML.

## Bereidingsinformatie
Tijden zijn schattingen. Voor luchtregeling gebruiken we algemene Bastard-principes, geen gegarandeerde VX-schuifstanden. Volg de handleiding van jouw toestel en accessoires. Kerntemperaturen zijn conservatief gekozen op basis van USDA; picanha en zalm zijn hierdoor gaarder dan in sommige culinaire bronnen.

Basisgids: https://manuals.coolblue.be/be/the-bastard-medium-compleet-2022.pdf
Veilige kerntemperaturen: https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart

Bronnen geraadpleegd op 24 oktober 2026. De app is niet op een fysieke iPhone of een echte kamado getest.
