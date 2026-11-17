import { CITIES } from './cities.js';
import { chf, decimal, integer, setFormatLanguage } from './format.js';

export const LANGUAGES = [
  ['en', 'English'],
  ['de', 'Deutsch'],
  ['fr', 'Français'],
  ['it', 'Italiano'],
];
const CODES = LANGUAGES.map(([c]) => c);
const STORE_KEY = 'swissblocks.lang';

const D = {
  'app.title': ['Swiss Blocks', 'Swiss Blocks', 'Swiss Blocks', 'Swiss Blocks'],
  'app.subtitle': [
    'A voxel real estate game in nine Swiss city centres',
    'Ein Voxel-Immobilienspiel in neun Schweizer Innenstädten',
    'Un jeu immobilier en voxels dans neuf centres-villes suisses',
    'Un gioco immobiliare a voxel in nove centri città svizzeri',
  ],
  'lang.label': ['Language', 'Sprache', 'Langue', 'Lingua'],

  'home.lead': [
    'Every building is real: footprints, heights and roofs come from official 3D models, cut into 2 m blocks. Buy, finance, repair and extend, then get scored after ten game years.',
    'Jedes Gebäude ist echt: Grundrisse, Höhen und Dächer stammen aus offiziellen 3D-Modellen, zerlegt in 2-m-Blöcke. Kaufe, finanziere, repariere und stocke auf. Nach zehn Spieljahren wirst du bewertet.',
    'Chaque bâtiment est réel : emprises, hauteurs et toits proviennent des modèles 3D officiels, découpés en blocs de 2 m. Achetez, financez, réparez et surélevez, puis soyez évalué après dix années de jeu.',
    'Ogni edificio è reale: impronte, altezze e tetti provengono dai modelli 3D ufficiali, suddivisi in blocchi da 2 m. Compra, finanzia, ripara e sopraeleva, poi ricevi un punteggio dopo dieci anni di gioco.',
  ],
  'home.continue': ['Continue season', 'Saison fortsetzen', 'Continuer la saison', 'Continua la stagione'],
  'home.continueIn': ['Month {m} of {total}', 'Monat {m} von {total}', 'Mois {m} sur {total}', 'Mese {m} di {total}'],
  'home.cities': ['Choose a city', 'Stadt wählen', 'Choisir une ville', 'Scegli una città'],
  'home.cityStats': ['CHF/m² · rent/m² · gross yield', 'CHF/m² · Miete/m² · Bruttorendite', 'CHF/m² · loyer/m² · rendement brut', 'CHF/m² · affitto/m² · rendimento lordo'],
  'home.play': ['Play', 'Spielen', 'Jouer', 'Gioca'],
  'home.how': ['How to play', 'So wird gespielt', 'Comment jouer', 'Come si gioca'],
  'home.how1': [
    'Pick a profile: Banker, Entrepreneur or Heir. Each starts with different capital and income.',
    'Wähle ein Profil: Banker, Unternehmer oder Erbe. Jedes startet mit anderem Kapital und Einkommen.',
    'Choisissez un profil : banquier, entrepreneur ou héritier. Chacun commence avec un capital et un revenu différents.',
    'Scegli un profilo: banchiere, imprenditore o erede. Ognuno parte con capitale e reddito diversi.',
  ],
  'home.how2': [
    'Click a building to see its value, rent and yield. Buy it with up to 80% mortgage if the bank accepts your affordability.',
    'Klicke auf ein Gebäude für Wert, Miete und Rendite. Kaufe mit bis zu 80% Hypothek, wenn die Bank deine Tragbarkeit akzeptiert.',
    'Cliquez sur un bâtiment pour voir sa valeur, son loyer et son rendement. Achetez avec jusqu’à 80% d’hypothèque si la banque accepte votre capacité financière.',
    'Clicca su un edificio per vederne valore, affitto e rendimento. Compralo con fino all’80% di ipoteca se la banca accetta la tua sostenibilità.',
  ],
  'home.how3': [
    'Run time with play and fast forward. Rents come in, interest and upkeep go out, defects and market events happen.',
    'Lass die Zeit laufen. Mieten kommen rein, Zinsen und Unterhalt gehen raus, Mängel und Marktereignisse passieren.',
    'Faites avancer le temps. Les loyers entrent, les intérêts et l’entretien sortent, défauts et événements de marché surviennent.',
    'Fai scorrere il tempo. Entrano gli affitti, escono interessi e manutenzione, arrivano difetti ed eventi di mercato.',
  ],
  'home.how4': [
    'After 120 months you are ranked on assets, net operating income and execution quality.',
    'Nach 120 Monaten wirst du nach Vermögen, Nettoertrag und Ausführungsqualität bewertet.',
    'Après 120 mois, vous êtes classé selon les actifs, le revenu net et la qualité d’exécution.',
    'Dopo 120 mesi vieni classificato per patrimonio, reddito netto e qualità di esecuzione.',
  ],
  'home.controls': ['Controls', 'Steuerung', 'Commandes', 'Comandi'],
  'home.controlsText': [
    'Click to select. Drag to pan. Right drag or Ctrl drag to rotate and tilt. Wheel or pinch to zoom. Double click to fly there. Arrows or WASD move, Q E rotate, R F tilt, + and - zoom, C faces north, V toggles free flight, Space pauses.',
    'Klick wählt aus. Ziehen verschiebt. Rechts- oder Ctrl-Ziehen dreht und neigt. Rad oder Pinch zoomt. Doppelklick fliegt hin. Pfeile oder WASD bewegen, Q E drehen, R F neigen, + und - zoomen, C richtet nach Norden, V schaltet den Flugmodus, Leertaste pausiert.',
    'Clic pour sélectionner. Glisser pour déplacer. Clic droit ou Ctrl glisser pour tourner et incliner. Molette ou pincement pour zoomer. Double clic pour s’y rendre. Flèches ou WASD déplacent, Q E tournent, R F inclinent, + et - zooment, C oriente au nord, V active le vol libre, Espace met en pause.',
    'Clic per selezionare. Trascina per spostare. Trascina col tasto destro o con Ctrl per ruotare e inclinare. Rotella o pizzico per lo zoom. Doppio clic per volarci. Frecce o WASD muovono, Q E ruotano, R F inclinano, + e - zoomano, C orienta a nord, V attiva il volo libero, Spazio mette in pausa.',
  ],
  'home.data': ['Data and credits', 'Daten und Quellen', 'Données et sources', 'Dati e fonti'],
  'home.dataZurich': [
    'Zurich: Stadt Zürich Open Data (roof model LoD2, block model, cadastral survey, tree register, statistical quarters) and Statistik Stadt Zürich prices and rents.',
    'Zürich: Stadt Zürich Open Data (Dachmodell LoD2, Blockmodell, Amtliche Vermessung, Baumkataster, Statistische Quartiere) sowie Preise und Mieten von Statistik Stadt Zürich.',
    'Zurich : Stadt Zürich Open Data (modèle de toits LoD2, modèle en blocs, mensuration officielle, cadastre des arbres, quartiers statistiques) et prix et loyers de Statistik Stadt Zürich.',
    'Zurigo: Stadt Zürich Open Data (modello dei tetti LoD2, modello a blocchi, misurazione ufficiale, catasto degli alberi, quartieri statistici) e prezzi e affitti di Statistik Stadt Zürich.',
  ],
  'home.dataOther': [
    'Other cities: swisstopo swissBUILDINGS3D, swisstopo base map vector tiles and the federal building register (GWR). Prices per m² from public city benchmarks, rents from cantonal asking rents.',
    'Übrige Städte: swisstopo swissBUILDINGS3D, Vektortiles der swisstopo-Basiskarte und das eidgenössische Gebäuderegister (GWR). Preise pro m² aus öffentlichen Stadtwerten, Mieten aus kantonalen Angebotsmieten.',
    'Autres villes : swisstopo swissBUILDINGS3D, tuiles vectorielles de la carte de base swisstopo et registre fédéral des bâtiments (RegBL). Prix au m² selon des références publiques, loyers selon les loyers proposés cantonaux.',
    'Altre città: swisstopo swissBUILDINGS3D, tessere vettoriali della carta di base swisstopo e registro federale degli edifici (REA). Prezzi al m² da riferimenti pubblici, affitti dagli affitti offerti cantonali.',
  ],
  'home.dataWiki': [
    'Landmark texts are short summaries written for the game. Photos come from Wikimedia Commons; author and licence are shown on each card.',
    'Die Texte zu Sehenswürdigkeiten sind kurze, eigens verfasste Zusammenfassungen. Fotos stammen von Wikimedia Commons; Urheber und Lizenz stehen auf jeder Karte.',
    'Les textes des monuments sont de courts résumés rédigés pour le jeu. Les photos proviennent de Wikimedia Commons ; auteur et licence figurent sur chaque fiche.',
    'I testi dei monumenti sono brevi riassunti scritti per il gioco. Le foto provengono da Wikimedia Commons; autore e licenza sono indicati su ogni scheda.',
  ],
  'home.assumptions': [
    'Game assumptions: usable area is footprint times floors times 0.8. Interest, taxes, construction costs, growth and events are simplified.',
    'Spielannahmen: Nutzfläche ist Grundfläche mal Geschosse mal 0.8. Zinsen, Steuern, Baukosten, Wachstum und Ereignisse sind vereinfacht.',
    'Hypothèses : surface utile égale emprise fois étages fois 0.8. Intérêts, impôts, coûts de construction, croissance et événements sont simplifiés.',
    'Ipotesi di gioco: superficie utile pari a impronta per piani per 0.8. Interessi, tasse, costi di costruzione, crescita ed eventi sono semplificati.',
  ],
  'home.board': ['Local leaderboard', 'Lokale Bestenliste', 'Classement local', 'Classifica locale'],

  'load.city': ['Loading {city}', 'Lade {city}', 'Chargement de {city}', 'Caricamento di {city}'],
  'load.build': ['Building blocks', 'Baue Blöcke', 'Construction des blocs', 'Costruzione dei blocchi'],
  'load.error': ['Could not load {city}.', '{city} konnte nicht geladen werden.', 'Impossible de charger {city}.', 'Impossibile caricare {city}.'],

  'top.home': ['Home', 'Start', 'Accueil', 'Home'],
  'top.city': ['City', 'Stadt', 'Ville', 'Città'],
  'top.date': ['Date', 'Datum', 'Date', 'Data'],
  'top.cash': ['Cash', 'Cash', 'Liquidités', 'Liquidità'],
  'top.debt': ['Mortgages', 'Hypotheken', 'Hypothèques', 'Ipoteche'],
  'top.net': ['Net worth', 'Nettovermögen', 'Patrimoine net', 'Patrimonio netto'],
  'top.flow': ['Cash flow / mo', 'Cashflow / Mt.', 'Flux / mois', 'Flusso / mese'],
  'top.rate': ['Mortgage rate', 'Hypozins', 'Taux hypothécaire', 'Tasso ipotecario'],
  'top.pause': ['Pause (Space)', 'Pause (Leertaste)', 'Pause (Espace)', 'Pausa (Spazio)'],
  'top.play': ['Play', 'Abspielen', 'Lecture', 'Avvia'],
  'top.fast': ['Fast', 'Schnell', 'Rapide', 'Veloce'],
  'top.help': ['Help', 'Hilfe', 'Aide', 'Aiuto'],
  'top.month': ['{date} · month {t}/{total}', '{date} · Monat {t}/{total}', '{date} · mois {t}/{total}', '{date} · mese {t}/{total}'],

  'search.placeholder': ['Search an address in {city}', 'Adresse in {city} suchen', 'Chercher une adresse à {city}', 'Cerca un indirizzo a {city}'],
  'search.none': ['No match in this area', 'Keine Treffer im Ausschnitt', 'Aucun résultat dans cette zone', 'Nessun risultato in quest’area'],

  'tab.portfolio': ['Portfolio', 'Portfolio', 'Portefeuille', 'Portafoglio'],
  'tab.defects': ['Defects', 'Mängel', 'Défauts', 'Difetti'],
  'tab.score': ['Score', 'Score', 'Score', 'Punteggio'],
  'tab.market': ['Market', 'Markt', 'Marché', 'Mercato'],
  'tab.news': ['News', 'News', 'Actualités', 'Notizie'],

  'tool.heat': ['Heatmap', 'Heatmap', 'Carte des prix', 'Mappa prezzi'],
  'tool.heatTitle': ['Price heatmap (H)', 'Preis-Heatmap (H)', 'Carte des prix (H)', 'Mappa dei prezzi (H)'],
  'tool.labels': ['Labels', 'Beschriftung', 'Étiquettes', 'Etichette'],
  'tool.labelsTitle': ['Labels (L)', 'Beschriftung (L)', 'Étiquettes (L)', 'Etichette (L)'],
  'tool.night': ['Night', 'Nacht', 'Nuit', 'Notte'],
  'tool.nightTitle': ['Night (N)', 'Nacht (N)', 'Nuit (N)', 'Notte (N)'],
  'tool.fly': ['Fly', 'Fliegen', 'Voler', 'Vola'],
  'tool.flyTitle': ['Free flight (V)', 'Flugmodus (V)', 'Vol libre (V)', 'Volo libero (V)'],
  'tool.flyHelp': [
    'Free flight: click the view to look around, WASD to fly, Space and Shift up and down, wheel sets speed, V or Esc exits.',
    'Flugmodus: Klick ins Bild zum Umschauen, WASD fliegen, Leertaste und Shift hoch und runter, Rad setzt Tempo, V oder Esc beendet.',
    'Vol libre : cliquez pour regarder autour, WASD pour voler, Espace et Maj pour monter et descendre, la molette règle la vitesse, V ou Échap pour quitter.',
    'Volo libero: clicca per guardarti intorno, WASD per volare, Spazio e Maiusc su e giù, la rotella regola la velocità, V o Esc per uscire.',
  ],
  'nav.north': ['Face north (C)', 'Nach Norden (C)', 'Vers le nord (C)', 'Verso nord (C)'],
  'nav.up': ['Forward', 'Vorwärts', 'Avancer', 'Avanti'],
  'nav.down': ['Back', 'Zurück', 'Reculer', 'Indietro'],
  'nav.left': ['Left', 'Links', 'Gauche', 'Sinistra'],
  'nav.right': ['Right', 'Rechts', 'Droite', 'Destra'],
  'nav.zin': ['Zoom in', 'Hineinzoomen', 'Zoom avant', 'Ingrandisci'],
  'nav.zout': ['Zoom out', 'Herauszoomen', 'Zoom arrière', 'Riduci'],
  'nav.rotl': ['Rotate left (Q)', 'Links drehen (Q)', 'Tourner à gauche (Q)', 'Ruota a sinistra (Q)'],
  'nav.rotr': ['Rotate right (E)', 'Rechts drehen (E)', 'Tourner à droite (E)', 'Ruota a destra (E)'],
  'nav.tiltup': ['Steeper (R)', 'Steiler (R)', 'Plus raide (R)', 'Più ripido (R)'],
  'nav.tiltdn': ['Flatter (F)', 'Flacher (F)', 'Plus plat (F)', 'Più piatto (F)'],
  'hint.keys': [
    'Click select · Drag pan · Right drag rotate · Wheel zoom · Arrows move · Q E rotate · R F tilt · V fly',
    'Klick wählen · Ziehen verschieben · Rechts ziehen drehen · Rad zoomen · Pfeile bewegen · Q E drehen · R F neigen · V fliegen',
    'Clic choisir · Glisser déplacer · Clic droit tourner · Molette zoom · Flèches déplacer · Q E tourner · R F incliner · V voler',
    'Clic scegli · Trascina sposta · Destro ruota · Rotella zoom · Frecce muovi · Q E ruota · R F inclina · V vola',
  ],

  'art.Gebaeude_Wohngebaeude': ['Residential', 'Wohngebäude', 'Habitation', 'Residenziale'],
  'art.Gebaeude_Verwaltung': ['Office', 'Büro', 'Bureaux', 'Uffici'],
  'art.Gebaeude_Handel': ['Retail', 'Handel', 'Commerce', 'Commercio'],
  'art.Gebaeude_Gastgewerbe': ['Hospitality', 'Gastgewerbe', 'Hôtellerie', 'Ospitalità'],
  'art.Gebaeude_Industrie_Gewerbe': ['Industrial', 'Industrie und Gewerbe', 'Industrie', 'Industria'],
  'art.Gebaeude_Verkehr': ['Transport', 'Verkehr', 'Transport', 'Trasporti'],
  'art.Gebaeude_Nebengebaeude': ['Outbuilding', 'Nebengebäude', 'Annexe', 'Annesso'],
  'art.Unterstand': ['Shelter', 'Unterstand', 'Abri', 'Tettoia'],
  'art.Bruecke_Passerelle': ['Bridge', 'Brücke', 'Pont', 'Ponte'],
  'art.Hochkamin': ['Chimney', 'Hochkamin', 'Cheminée', 'Ciminiera'],
  'art.Silo_Turm_Gasometer': ['Silo or tower', 'Silo oder Turm', 'Silo ou tour', 'Silo o torre'],
  'art.uebriger_Gebaeudeteil': ['Building part', 'Gebäudeteil', 'Partie de bâtiment', 'Parte di edificio'],
  'art.Gebaeude_Land_Forstwirtschaft_Gaertnerei': ['Agriculture', 'Gärtnerei', 'Agriculture', 'Agricoltura'],
  'art.Landungssteg': ['Pier', 'Landungssteg', 'Débarcadère', 'Pontile'],
  'art.Massiver_Sockel': ['Base', 'Sockel', 'Socle', 'Basamento'],
  'art.Kirche': ['Church', 'Kirche', 'Église', 'Chiesa'],
  'art.Baustelle': ['Construction site', 'Baustelle', 'Chantier', 'Cantiere'],
  'art.other': ['Building', 'Gebäude', 'Bâtiment', 'Edificio'],

  'building.unnamed': ['Building {n}', 'Gebäude {n}', 'Bâtiment {n}', 'Edificio {n}'],
  'building.district': ['District {n}', 'Kreis {n}', 'Arrondissement {n}', 'Circoscrizione {n}'],
  'src.q': ['quarter median', 'Quartier-Median', 'médiane du quartier', 'mediana del quartiere'],
  'src.k': ['district median', 'Kreis-Median', 'médiane de l’arrondissement', 'mediana della circoscrizione'],
  'src.r': ['derived from rent', 'aus Miete abgeleitet', 'dérivé du loyer', 'derivato dall’affitto'],
  'src.c': ['city average and location', 'Stadtmittel und Lage', 'moyenne de la ville et situation', 'media cittadina e posizione'],
  'tag.owned': ['Yours', 'Dein Besitz', 'À vous', 'Tuo'],
  'tag.notForSale': ['Not for sale', 'Nicht verkäuflich', 'Pas à vendre', 'Non in vendita'],
  'tag.highRise': ['High rise', 'Hochhaus', 'Tour', 'Grattacielo'],
  'tag.oldTown': ['Old town', 'Altstadt', 'Vieille ville', 'Centro storico'],

  'info.close': ['Close', 'Schliessen', 'Fermer', 'Chiudi'],
  'info.height': ['Height (3D model)', 'Höhe (3D-Modell)', 'Hauteur (modèle 3D)', 'Altezza (modello 3D)'],
  'info.footFloors': ['Footprint · floors', 'Grundfläche · Geschosse', 'Emprise · étages', 'Impronta · piani'],
  'info.age': ['Built', 'Baujahr', 'Construction', 'Costruzione'],
  'info.ageEstimate': ['about {n} years (estimate)', 'etwa {n} Jahre (geschätzt)', 'environ {n} ans (estimation)', 'circa {n} anni (stima)'],
  'info.area': ['Usable area (estimate)', 'Nutzfläche (geschätzt)', 'Surface utile (estimation)', 'Superficie utile (stima)'],
  'info.priceM2': ['Price / m²', 'Preis / m²', 'Prix / m²', 'Prezzo / m²'],
  'info.rentM2': ['Rent / m² / month', 'Miete / m² / Mt.', 'Loyer / m² / mois', 'Affitto / m² / mese'],
  'info.value': ['Market value', 'Marktwert', 'Valeur de marché', 'Valore di mercato'],
  'info.rent': ['Rent / month', 'Mietertrag / Mt.', 'Loyer / mois', 'Affitto / mese'],
  'info.yield': ['Gross yield', 'Bruttorendite', 'Rendement brut', 'Rendimento lordo'],
  'info.paid': ['Purchase price', 'Kaufpreis', 'Prix d’achat', 'Prezzo d’acquisto'],
  'info.mortgage': ['Mortgage (LTV)', 'Hypothek (LTV)', 'Hypothèque (LTV)', 'Ipoteca (LTV)'],
  'info.condition': ['Condition', 'Zustand', 'État', 'Condizione'],
  'info.netFlow': ['Net cash flow / month', 'Netto-Cashflow / Mt.', 'Flux net / mois', 'Flusso netto / mese'],
  'info.gain': ['Unrealised gain', 'Gewinn (unrealisiert)', 'Plus-value latente', 'Plusvalenza latente'],
  'info.project': ['Project', 'Projekt', 'Projet', 'Progetto'],
  'info.openDefects': ['Open defects', 'Offene Mängel', 'Défauts ouverts', 'Difetti aperti'],
  'info.defectLine': ['{months} mo, rent {pen}', '{months} Mt., Miete {pen}', '{months} mois, loyer {pen}', '{months} mesi, affitto {pen}'],
  'info.ask': ['Asking price', 'Angebotspreis', 'Prix demandé', 'Prezzo richiesto'],
  'info.maxMortgage': ['Max. mortgage (affordability)', 'Max. Hypothek (Tragbarkeit)', 'Hypothèque max. (capacité)', 'Ipoteca max. (sostenibilità)'],
  'info.mortgageSlider': ['Mortgage', 'Hypothek', 'Hypothèque', 'Ipoteca'],
  'info.equity': ['Equity plus 0.5% fees', 'Eigenkapital plus 0.5% Gebühren', 'Fonds propres plus 0.5% de frais', 'Capitale proprio più 0.5% di spese'],
  'info.public': ['Public or historic building, not for sale.', 'Öffentliches oder historisches Gebäude, nicht verkäuflich.', 'Bâtiment public ou historique, pas à vendre.', 'Edificio pubblico o storico, non in vendita.'],
  'info.notTradable': ['This structure cannot be traded.', 'Dieses Objekt kann nicht gehandelt werden.', 'Cet objet ne peut pas être échangé.', 'Questo oggetto non può essere scambiato.'],

  'act.buy': ['Buy', 'Kaufen', 'Acheter', 'Compra'],
  'act.renovate': ['Renovate', 'Renovieren', 'Rénover', 'Ristruttura'],
  'act.renovateTitle': ['3 months at half rent, fixes open defects', '3 Monate halbe Miete, behebt offene Mängel', '3 mois à demi-loyer, corrige les défauts', '3 mesi a metà affitto, ripara i difetti'],
  'act.extend': ['Add a floor', '+1 Geschoss', 'Surélever', 'Sopraelevare'],
  'act.extendTitle': ['Permit fee CHF 25’000, then about {cost}', 'Baugesuch CHF 25’000, danach etwa {cost}', 'Permis CHF 25’000, puis environ {cost}', 'Licenza CHF 25’000, poi circa {cost}'],
  'act.chance': ['Chance {p}', 'Chance {p}', 'Chance {p}', 'Probabilità {p}'],
  'act.amortise': ['Repay', 'Amortisieren', 'Amortir', 'Ammortizza'],
  'act.borrow': ['Borrow more', 'Hypothek erhöhen', 'Emprunter plus', 'Aumenta ipoteca'],
  'act.sell': ['Sell', 'Verkaufen', 'Vendre', 'Vendi'],
  'act.repair': ['Repair', 'Reparieren', 'Réparer', 'Ripara'],
  'act.repairAll': ['Repair all ({cost})', 'Alle reparieren ({cost})', 'Tout réparer ({cost})', 'Ripara tutto ({cost})'],
  'proj.reno': ['Renovation in progress', 'Renovation läuft', 'Rénovation en cours', 'Ristrutturazione in corso'],
  'proj.permit': ['Permit pending ({p} chance)', 'Baugesuch hängig ({p} Chance)', 'Permis en attente ({p} de chance)', 'Licenza in attesa ({p} di probabilità)'],
  'proj.build': ['Extension under construction', 'Aufstockung im Bau', 'Surélévation en chantier', 'Sopraelevazione in costruzione'],
  'proj.left': ['{n} mo left', 'noch {n} Mt.', 'encore {n} mois', 'ancora {n} mesi'],

  'wiki.monument': ['Historic monument', 'Historisches Monument', 'Monument historique', 'Monumento storico'],
  'wiki.university': ['University', 'Universität', 'Université', 'Università'],
  'wiki.station': ['Main station', 'Hauptbahnhof', 'Gare principale', 'Stazione principale'],
  'wiki.read': ['Read more on Wikipedia', 'Mehr auf Wikipedia', 'En savoir plus sur Wikipédia', 'Approfondisci su Wikipedia'],
  'wiki.photo': ['Photo: {artist}, {license}', 'Foto: {artist}, {license}', 'Photo : {artist}, {license}', 'Foto: {artist}, {license}'],
  'wiki.noPhoto': ['No free photo available yet.', 'Noch kein freies Foto verfügbar.', 'Pas encore de photo libre.', 'Nessuna foto libera disponibile.'],

  'defect.leak': ['Water damage', 'Wasserschaden', 'Dégât des eaux', 'Danno d’acqua'],
  'defect.heat': ['Heating failure', 'Heizungsausfall', 'Panne de chauffage', 'Guasto al riscaldamento'],
  'defect.roof': ['Roof damage', 'Dachschaden', 'Toiture endommagée', 'Danno al tetto'],
  'defect.facade': ['Facade damage', 'Fassadenschaden', 'Façade endommagée', 'Danno alla facciata'],
  'defect.mould': ['Mould', 'Schimmel', 'Moisissure', 'Muffa'],
  'defect.lift': ['Lift out of order', 'Lift defekt', 'Ascenseur en panne', 'Ascensore guasto'],
  'defect.tenant': ['Rent default', 'Mietausfall', 'Loyer impayé', 'Affitto non pagato'],
  'defect.fire': ['Fire', 'Brand', 'Incendie', 'Incendio'],

  'maint.title': ['Maintenance strategy', 'Unterhaltsstrategie', 'Stratégie d’entretien', 'Strategia di manutenzione'],
  'maint.low': ['Thrifty', 'Sparsam', 'Économe', 'Parsimoniosa'],
  'maint.normal': ['Normal', 'Normal', 'Normale', 'Normale'],
  'maint.high': ['Exemplary', 'Vorbildlich', 'Exemplaire', 'Esemplare'],
  'maint.perYear': ['{p} / year', '{p} / Jahr', '{p} / an', '{p} / anno'],
  'maint.note': [
    'More upkeep costs money every month but lowers defect risk (x{risk}) and wear.',
    'Mehr Unterhalt kostet laufend, senkt aber Schadensrisiko (x{risk}) und Abnutzung.',
    'Plus d’entretien coûte chaque mois mais réduit le risque de défaut (x{risk}) et l’usure.',
    'Più manutenzione costa ogni mese ma riduce il rischio di difetti (x{risk}) e l’usura.',
  ],
  'maint.insurance': [
    'Water and mould add-on insurance (0.04% per year, CHF 2’000 deductible)',
    'Zusatzversicherung Wasser und Schimmel (0.04% pro Jahr, Selbstbehalt CHF 2’000)',
    'Assurance complémentaire eau et moisissure (0.04% par an, franchise CHF 2’000)',
    'Assicurazione aggiuntiva acqua e muffa (0.04% annuo, franchigia CHF 2’000)',
  ],
  'maint.mandatory': [
    'Mandatory building insurance (fire and natural hazards) always applies and covers 90% of fire damage.',
    'Die obligatorische Gebäudeversicherung (Feuer und Elementar) gilt immer und deckt 90% bei Brand.',
    'L’assurance bâtiment obligatoire (incendie et éléments naturels) s’applique toujours et couvre 90% en cas d’incendie.',
    'L’assicurazione obbligatoria degli edifici (incendio ed eventi naturali) vale sempre e copre il 90% in caso di incendio.',
  ],
  'maint.auto': ['Auto repair up to', 'Auto-Reparatur bis', 'Réparation auto jusqu’à', 'Riparazione automatica fino a'],
  'maint.off': ['off', 'aus', 'désactivée', 'disattivata'],
  'maint.open': ['Open defects', 'Offene Mängel', 'Défauts ouverts', 'Difetti aperti'],
  'maint.inflation': ['Inflation since start', 'Teuerung seit Start', 'Inflation depuis le début', 'Inflazione dall’inizio'],
  'maint.costIndex': ['Construction cost index', 'Baukostenindex', 'Indice des coûts de construction', 'Indice dei costi di costruzione'],
  'maint.vacancy': ['Vacancy', 'Leerstand', 'Vacance', 'Sfitto'],

  'port.profile': ['Profile', 'Profil', 'Profil', 'Profilo'],
  'port.income': ['Income last month', 'Einkommen letzter Mt.', 'Revenu du mois', 'Reddito ultimo mese'],
  'port.living': ['Living costs / month', 'Lebenshaltung / Mt.', 'Coût de la vie / mois', 'Costo della vita / mese'],
  'port.count': ['Properties', 'Liegenschaften', 'Biens', 'Immobili'],
  'port.value': ['Portfolio value', 'Portfoliowert', 'Valeur du portefeuille', 'Valore del portafoglio'],
  'port.headroom': ['Bank headroom (affordability)', 'Bank-Spielraum (Tragbarkeit)', 'Marge bancaire (capacité)', 'Margine bancario (sostenibilità)'],
  'port.history': ['Net worth over time', 'Nettovermögen im Verlauf', 'Évolution du patrimoine net', 'Andamento del patrimonio netto'],
  'port.empty': [
    'No properties yet. Click a building. The bank checks affordability: 5% imputed interest plus 1% upkeep may not exceed one third of your income, including 80% of rents. Cities with higher yields such as Bern, St. Gallen and Basel are easier to finance.',
    'Noch keine Liegenschaften. Klicke auf ein Haus. Die Bank prüft die Tragbarkeit: 5% kalkulatorischer Zins plus 1% Unterhalt dürfen höchstens ein Drittel deines Einkommens inklusive 80% der Mieten betragen. Städte mit höherer Rendite wie Bern, St. Gallen und Basel sind leichter zu finanzieren.',
    'Aucun bien pour l’instant. Cliquez sur un immeuble. La banque vérifie la capacité financière : 5% d’intérêt théorique plus 1% d’entretien ne doivent pas dépasser un tiers de vos revenus, 80% des loyers compris. Les villes à meilleur rendement comme Berne, Saint-Gall et Bâle sont plus faciles à financer.',
    'Ancora nessun immobile. Clicca su un edificio. La banca verifica la sostenibilità: 5% di interesse teorico più 1% di manutenzione non devono superare un terzo del reddito, incluso l’80% degli affitti. Le città con rendimenti più alti come Berna, San Gallo e Basilea sono più facili da finanziare.',
  ],
  'port.flow': ['Cash flow {v}', 'Cashflow {v}', 'Flux {v}', 'Flusso {v}'],
  'port.busy': ['project', 'Projekt', 'projet', 'progetto'],
  'port.defects': ['{n} defects', '{n} Mängel', '{n} défauts', '{n} difetti'],

  'score.season': ['Season', 'Saison', 'Saison', 'Stagione'],
  'score.monthOf': ['Month {t} / {total}', 'Monat {t} / {total}', 'Mois {t} / {total}', 'Mese {t} / {total}'],
  'score.aum': ['Assets (AUM)', 'Vermögen (AUM)', 'Actifs (AUM)', 'Patrimonio (AUM)'],
  'score.noi': ['Net operating income p.a.', 'Nettoertrag p.a.', 'Revenu net annuel', 'Reddito netto annuo'],
  'score.exec': ['Execution', 'Execution', 'Exécution', 'Esecuzione'],
  'score.return': ['Return (CAGR {v}%)', 'Rendite (CAGR {v}%)', 'Rendement (TCAC {v}%)', 'Rendimento (CAGR {v}%)'],
  'score.risk': ['Risk (max drawdown {v}%)', 'Risiko (max. Drawdown {v}%)', 'Risque (baisse max. {v}%)', 'Rischio (drawdown max {v}%)'],
  'score.leverage': ['Leverage (avg LTV {v}%)', 'Belehnung (Ø LTV {v}%)', 'Levier (LTV moyen {v}%)', 'Leva (LTV medio {v}%)'],
  'score.ops': ['Upkeep ({v} mo to repair)', 'Unterhalt ({v} Mt. bis Reparatur)', 'Entretien ({v} mois avant réparation)', 'Manutenzione ({v} mesi per riparare)'],
  'score.liquidity': ['Liquidity ({v} months overdrawn)', 'Liquidität ({v} Minus-Monate)', 'Liquidité ({v} mois à découvert)', 'Liquidità ({v} mesi in rosso)'],
  'score.endNow': ['Close the season now', 'Saison jetzt abschliessen', 'Clôturer la saison', 'Chiudi la stagione ora'],
  'score.board': ['Local leaderboard', 'Lokale Bestenliste', 'Classement local', 'Classifica locale'],
  'score.boardEmpty': ['No finished seasons yet.', 'Noch keine abgeschlossenen Saisons.', 'Aucune saison terminée.', 'Nessuna stagione conclusa.'],
  'score.rank': ['Rank {r} of {n}', 'Rang {r} von {n}', 'Rang {r} sur {n}', 'Posizione {r} di {n}'],

  'market.cities': ['Cities: CHF/m² · rent/m²/month · gross yield', 'Städte: CHF/m² · Miete/m²/Mt. · Bruttorendite', 'Villes : CHF/m² · loyer/m²/mois · rendement brut', 'Città: CHF/m² · affitto/m²/mese · rendimento lordo'],
  'market.rate': ['Mortgage rate', 'Hypozins', 'Taux hypothécaire', 'Tasso ipotecario'],
  'market.quarters': ['{city} by quarter, with game market index', '{city} nach Quartier, mit Spiel-Marktindex', '{city} par quartier, avec indice de marché', '{city} per quartiere, con indice di mercato'],

  'profile.title': ['New season', 'Neue Saison', 'Nouvelle saison', 'Nuova stagione'],
  'profile.lead': [
    'Choose your profile. A season lasts 10 years (120 months). You are then ranked on assets, income and execution.',
    'Wähle dein Profil. Eine Saison dauert 10 Jahre (120 Monate). Danach wirst du nach Vermögen, Ertrag und Execution bewertet.',
    'Choisissez votre profil. Une saison dure 10 ans (120 mois). Vous êtes ensuite classé selon les actifs, le revenu et l’exécution.',
    'Scegli il tuo profilo. Una stagione dura 10 anni (120 mesi). Poi vieni classificato per patrimonio, reddito ed esecuzione.',
  ],
  'profile.start': ['Start capital {cash}', 'Startkapital {cash}', 'Capital de départ {cash}', 'Capitale iniziale {cash}'],
  'profile.living': ['Living costs {cost} / month', 'Lebenshaltung {cost} / Mt.', 'Coût de la vie {cost} / mois', 'Costo della vita {cost} / mese'],
  'profile.banker.name': ['Banker', 'Banker', 'Banquier', 'Banchiere'],
  'profile.banker.desc': [
    'High, stable salary of CHF 18’500 net per month, little starting capital. Banks love you.',
    'Hoher, stabiler Lohn von CHF 18’500 netto pro Monat, wenig Startkapital. Banken lieben dich.',
    'Salaire élevé et stable de CHF 18’500 net par mois, peu de capital de départ. Les banques vous adorent.',
    'Stipendio alto e stabile di CHF 18’500 netti al mese, poco capitale iniziale. Le banche ti adorano.',
  ],
  'profile.entrepreneur.name': ['Entrepreneur', 'Unternehmer', 'Entrepreneur', 'Imprenditore'],
  'profile.entrepreneur.desc': [
    'High but irregular income, with empty months and the occasional big exit. Banks count only 60% of your average.',
    'Hohes, aber unregelmässiges Einkommen, mit Nullmonaten und gelegentlich einem grossen Exit. Banken rechnen nur 60% deines Schnitts an.',
    'Revenu élevé mais irrégulier, avec des mois vides et parfois une grosse sortie. Les banques ne comptent que 60% de votre moyenne.',
    'Reddito alto ma irregolare, con mesi vuoti e ogni tanto una grande exit. Le banche contano solo il 60% della tua media.',
  ],
  'profile.heir.name': ['Heir', 'Erbe', 'Héritier', 'Erede'],
  'profile.heir.desc': [
    'CHF 7 million inherited but no income. Banks count only your rents, so cash flow is everything.',
    'CHF 7 Mio. geerbt, aber kein Einkommen. Banken zählen nur deine Mieten, Cashflow ist alles.',
    'CHF 7 millions hérités mais aucun revenu. Les banques ne comptent que vos loyers, le flux de trésorerie est tout.',
    'CHF 7 milioni ereditati ma nessun reddito. Le banche contano solo gli affitti, il flusso di cassa è tutto.',
  ],

  'season.title': ['Season complete', 'Saison beendet', 'Saison terminée', 'Stagione conclusa'],
  'season.summary': ['{profile} · {months} months · net worth {nw}', '{profile} · {months} Monate · Nettovermögen {nw}', '{profile} · {months} mois · patrimoine net {nw}', '{profile} · {months} mesi · patrimonio netto {nw}'],
  'season.again': ['New season', 'Neue Saison', 'Nouvelle saison', 'Nuova stagione'],
  'season.view': ['Keep exploring', 'Weiter ansehen', 'Continuer à explorer', 'Continua a esplorare'],
  'help.title': ['How to play', 'So wird gespielt', 'Comment jouer', 'Come si gioca'],
  'help.resume': ['Resume', 'Weiter', 'Reprendre', 'Riprendi'],
  'help.restart': ['Start a new season', 'Neue Saison starten', 'Nouvelle saison', 'Nuova stagione'],

  'news.start': [
    'New season as {profile}. Starting capital {cash}. A season lasts 10 years, then you are scored in three categories.',
    'Neue Saison als {profile}. Startkapital {cash}. Eine Saison dauert 10 Jahre, danach wirst du in drei Kategorien bewertet.',
    'Nouvelle saison en tant que {profile}. Capital de départ {cash}. Une saison dure 10 ans, puis vous êtes évalué dans trois catégories.',
    'Nuova stagione come {profile}. Capitale iniziale {cash}. Una stagione dura 10 anni, poi ricevi un punteggio in tre categorie.',
  ],
  'news.exit': ['Exit: your company brings you {amount}.', 'Exit: Deine Firma bringt dir {amount} ein.', 'Sortie : votre entreprise vous rapporte {amount}.', 'Exit: la tua azienda ti frutta {amount}.'],
  'news.bought': ['Bought in {city}: {name} for {price} (mortgage {loan}).', 'Gekauft in {city}: {name} für {price} (Hypothek {loan}).', 'Acheté à {city} : {name} pour {price} (hypothèque {loan}).', 'Acquistato a {city}: {name} per {price} (ipoteca {loan}).'],
  'news.sold': ['Sold in {city}: {name} for {price}.', 'Verkauft in {city}: {name} für {price}.', 'Vendu à {city} : {name} pour {price}.', 'Venduto a {city}: {name} per {price}.'],
  'news.soldTax': ['Sold in {city}: {name} for {price}, property gains tax {tax}.', 'Verkauft in {city}: {name} für {price}, Grundstückgewinnsteuer {tax}.', 'Vendu à {city} : {name} pour {price}, impôt sur les gains immobiliers {tax}.', 'Venduto a {city}: {name} per {price}, imposta sugli utili immobiliari {tax}.'],
  'news.renoStart': ['Renovation started: {name} ({cost}, 3 months). Open defects are fixed along the way.', 'Renovation gestartet: {name} ({cost}, 3 Monate). Offene Mängel werden mitbehoben.', 'Rénovation lancée : {name} ({cost}, 3 mois). Les défauts ouverts sont corrigés.', 'Ristrutturazione avviata: {name} ({cost}, 3 mesi). I difetti aperti vengono riparati.'],
  'news.renoDone': ['Renovation finished: {name}. Rent and value go up.', 'Renovation abgeschlossen: {name}. Mieten und Wert steigen.', 'Rénovation terminée : {name}. Loyer et valeur augmentent.', 'Ristrutturazione conclusa: {name}. Affitto e valore aumentano.'],
  'news.permitFiled': ['Permit for an extra floor filed: {name}. Decision in 2 months.', 'Baugesuch für Aufstockung eingereicht: {name}. Entscheid in 2 Monaten.', 'Demande de permis de surélévation déposée : {name}. Décision dans 2 mois.', 'Domanda di licenza per sopraelevazione presentata: {name}. Decisione tra 2 mesi.'],
  'news.permitOk': ['Permit granted. Extension of {name} starts ({cost}, 8 months).', 'Baubewilligung erteilt. Aufstockung von {name} startet ({cost}, 8 Monate).', 'Permis accordé. Surélévation de {name} lancée ({cost}, 8 mois).', 'Licenza concessa. Sopraelevazione di {name} avviata ({cost}, 8 mesi).'],
  'news.permitNo': ['Permit refused: {name} (townscape or neighbour objection).', 'Baugesuch abgelehnt: {name} (Ortsbild oder Einsprache).', 'Permis refusé : {name} (site protégé ou opposition).', 'Licenza respinta: {name} (tutela del paesaggio o opposizione).'],
  'news.extended': ['Extension finished: {name} has an extra floor (+4 m).', 'Aufstockung fertig: {name} hat ein zusätzliches Geschoss (+4 m).', 'Surélévation terminée : {name} a un étage de plus (+4 m).', 'Sopraelevazione conclusa: {name} ha un piano in più (+4 m).'],
  'news.fixed': ['Repaired: {defect} in {name} ({cost}).', 'Repariert: {defect} in {name} ({cost}).', 'Réparé : {defect} à {name} ({cost}).', 'Riparato: {defect} in {name} ({cost}).'],
  'news.autoFixed': ['Repaired automatically: {defect} in {name} ({cost}).', 'Automatisch repariert: {defect} in {name} ({cost}).', 'Réparé automatiquement : {defect} à {name} ({cost}).', 'Riparato automaticamente: {defect} in {name} ({cost}).'],
  'news.rentLoss': ['Rent default in {name}: {cost} lost.', 'Mietausfall in {name}: {cost} verloren.', 'Loyer impayé à {name} : {cost} perdus.', 'Affitto non pagato in {name}: {cost} persi.'],
  'news.defect': ['{defect} in {name}: repair costs {cost}.', '{defect} in {name}: Reparatur kostet {cost}.', '{defect} à {name} : réparation {cost}.', '{defect} in {name}: riparazione {cost}.'],
  'news.defectInsured': ['{defect} in {name}: repair costs {cost} after insurance.', '{defect} in {name}: Reparatur kostet {cost} nach Versicherung.', '{defect} à {name} : réparation {cost} après assurance.', '{defect} in {name}: riparazione {cost} dopo l’assicurazione.'],
  'news.defectUrgent': ['{defect} in {name}: repair costs {cost}. Urgent, tenants cut the rent.', '{defect} in {name}: Reparatur kostet {cost}. Dringend, Mieter mindern die Miete.', '{defect} à {name} : réparation {cost}. Urgent, les locataires réduisent le loyer.', '{defect} in {name}: riparazione {cost}. Urgente, gli inquilini riducono l’affitto.'],
  'news.defectAging': ['{defect} in {name} open for {months} months. Costs rise and tenants complain.', '{defect} in {name} seit {months} Monaten offen. Kosten steigen, Mieter klagen.', '{defect} à {name} ouvert depuis {months} mois. Les coûts montent, les locataires se plaignent.', '{defect} in {name} aperto da {months} mesi. I costi salgono, gli inquilini protestano.'],
  'news.foreclosure': ['Forced sale by the bank: {name} for {price}.', 'Zwangsverwertung durch die Bank: {name} für {price}.', 'Vente forcée par la banque : {name} pour {price}.', 'Vendita forzata della banca: {name} per {price}.'],

  'toast.exit': ['Exit proceeds: {amount}', 'Exit-Erlös: {amount}', 'Produit de sortie : {amount}', 'Ricavo dell’exit: {amount}'],
  'toast.noEquity': ['Not enough equity: you need {need}. The bank lends at most {max}.', 'Zu wenig Eigenkapital: benötigt {need}. Die Bank gibt höchstens {max}.', 'Fonds propres insuffisants : il faut {need}. La banque prête au plus {max}.', 'Capitale proprio insufficiente: servono {need}. La banca presta al massimo {max}.'],
  'toast.bought': ['{name} is now yours.', '{name} gehört jetzt dir.', '{name} est à vous.', '{name} ora è tuo.'],
  'toast.busy': ['Not possible during a building project.', 'Während eines Bauprojekts nicht möglich.', 'Impossible pendant un chantier.', 'Non possibile durante un cantiere.'],
  'toast.sold': ['Sold: {net} net', 'Verkauft: {net} netto', 'Vendu : {net} net', 'Venduto: {net} netti'],
  'toast.noCash': ['Not enough cash.', 'Zu wenig Cash.', 'Liquidités insuffisantes.', 'Liquidità insufficiente.'],
  'toast.bankNo': ['The bank declines: affordability exceeded.', 'Bank lehnt ab: Tragbarkeit überschritten.', 'La banque refuse : capacité dépassée.', 'La banca rifiuta: sostenibilità superata.'],
  'toast.fire': ['Fire in {name}. Building insurance covers 90%.', 'Brand in {name}. Die Gebäudeversicherung deckt 90%.', 'Incendie à {name}. L’assurance bâtiment couvre 90%.', 'Incendio in {name}. L’assicurazione copre il 90%.'],
  'toast.renoDone': ['Renovation finished: {name}', 'Renovation fertig: {name}', 'Rénovation terminée : {name}', 'Ristrutturazione conclusa: {name}'],
  'toast.permitOk': ['Permit granted: {name}', 'Bewilligung erteilt: {name}', 'Permis accordé : {name}', 'Licenza concessa: {name}'],
  'toast.permitNo': ['Permit refused: {name}', 'Baugesuch abgelehnt: {name}', 'Permis refusé : {name}', 'Licenza respinta: {name}'],
  'toast.extended': ['One more floor on {name}', '+1 Geschoss auf {name}', 'Un étage de plus sur {name}', 'Un piano in più su {name}'],
  'toast.overdrawn': ['Account overdrawn. After 3 months the bank sells a property.', 'Konto im Minus. Nach 3 Monaten verkauft die Bank eine Liegenschaft.', 'Compte à découvert. Après 3 mois, la banque vend un bien.', 'Conto in rosso. Dopo 3 mesi la banca vende un immobile.'],
  'toast.foreclosure': ['The bank sold {name}.', 'Die Bank hat {name} verwertet.', 'La banque a vendu {name}.', 'La banca ha venduto {name}.'],

  'event.snbCut': ['The SNB cuts its policy rate. Mortgage rates fall, property prices +2%.', 'Die SNB senkt den Leitzins. Hypozinsen sinken, Immobilienpreise +2%.', 'La BNS baisse son taux directeur. Les taux hypothécaires baissent, prix immobiliers +2%.', 'La BNS taglia il tasso guida. I tassi ipotecari scendono, prezzi immobiliari +2%.'],
  'event.rateShock': ['Rate shock: mortgage rates +0.30 points, prices -2.5%.', 'Zinsschock: Hypozinsen +0.30 Prozentpunkte, Preise -2.5%.', 'Choc de taux : hypothèques +0.30 point, prix -2.5%.', 'Shock dei tassi: ipoteche +0.30 punti, prezzi -2.5%.'],
  'event.inflation': ['Inflation spike: prices +2%, construction costs +4%, rates edge up.', 'Inflationsschub: Teuerung +2%, Baukosten +4%, Zinsen ziehen an.', 'Poussée d’inflation : prix +2%, coûts de construction +4%, taux en hausse.', 'Impennata dell’inflazione: prezzi +2%, costi di costruzione +4%, tassi in aumento.'],
  'event.recession': ['Recession: vacancy rises sharply, prices -3%.', 'Rezession: Leerstand steigt deutlich, Preise -3%.', 'Récession : forte hausse de la vacance, prix -3%.', 'Recessione: lo sfitto sale molto, prezzi -3%.'],
  'event.referenceRate': ['Reference rate rises: existing rents may go up 1.5%.', 'Referenzzinssatz steigt: Bestandesmieten dürfen um 1.5% steigen.', 'Le taux de référence augmente : les loyers existants peuvent monter de 1.5%.', 'Il tasso di riferimento sale: gli affitti esistenti possono aumentare dell’1.5%.'],
  'event.construction': ['Construction boom: trades are booked out, repair and building costs +5%.', 'Bauteuerung: Handwerker ausgebucht, Reparatur- und Baukosten +5%.', 'Boom de la construction : artisans débordés, coûts de réparation et de construction +5%.', 'Boom edilizio: artigiani esauriti, costi di riparazione e costruzione +5%.'],
  'event.city.zurich4': ['Zurich: district 4 is trending, prices +5%.', 'Zürich: Kreis 4 im Trend, Preise +5%.', 'Zurich : le 4e arrondissement a la cote, prix +5%.', 'Zurigo: il distretto 4 è di moda, prezzi +5%.'],
  'event.city.zurich5': ['Zurich: high rise project in Zurich West, district 5 +4.5%.', 'Zürich: Hochhausprojekt in Zürich-West, Kreis 5 +4.5%.', 'Zurich : projet de tour à Zurich-Ouest, 5e arrondissement +4.5%.', 'Zurigo: progetto di grattacielo a Zurigo Ovest, distretto 5 +4.5%.'],
  'event.city.zurich1': ['Zurich: record year at Paradeplatz, district 1 rents +3%.', 'Zürich: Rekordjahr am Paradeplatz, Kreis 1 Mieten +3%.', 'Zurich : année record à Paradeplatz, loyers du 1er arrondissement +3%.', 'Zurigo: anno record a Paradeplatz, affitti del distretto 1 +3%.'],
  'event.city.geneva': ['Geneva: a new international organisation moves to the lake, prices +3%.', 'Genf: Eine neue internationale Organisation zieht an den See, Preise +3%.', 'Genève : une nouvelle organisation internationale s’installe au bord du lac, prix +3%.', 'Ginevra: una nuova organizzazione internazionale arriva sul lago, prezzi +3%.'],
  'event.city.lausanne': ['Lausanne: metro m3 approved, prices +3%.', 'Lausanne: Metro m3 beschlossen, Preise +3%.', 'Lausanne : métro m3 approuvé, prix +3%.', 'Losanna: metro m3 approvata, prezzi +3%.'],
  'event.city.zug': ['Zug: crypto valley boom, prices +4%.', 'Zug: Crypto-Valley-Boom, Preise +4%.', 'Zoug : boom de la crypto valley, prix +4%.', 'Zugo: boom della crypto valley, prezzi +4%.'],
  'event.city.lucerne': ['Lucerne: tourism record, rents rise.', 'Luzern: Tourismusrekord, Mieten steigen.', 'Lucerne : record touristique, les loyers montent.', 'Lucerna: record turistico, gli affitti salgono.'],
  'event.city.basel': ['Basel: pharma campus expands, prices +3%.', 'Basel: Pharma-Campus wird erweitert, Preise +3%.', 'Bâle : le campus pharmaceutique s’agrandit, prix +3%.', 'Basilea: il campus farmaceutico si amplia, prezzi +3%.'],
  'event.city.bern': ['Bern: new federal offices in town, prices +2%.', 'Bern: Neue Bundesstellen in der Stadt, Preise +2%.', 'Berne : nouveaux offices fédéraux en ville, prix +2%.', 'Berna: nuovi uffici federali in città, prezzi +2%.'],
  'event.city.stgallen': ['St. Gallen: the HSG campus grows, prices +2.5%.', 'St. Gallen: HSG-Campus wächst, Preise +2.5%.', 'Saint-Gall : le campus HSG s’agrandit, prix +2.5%.', 'San Gallo: il campus HSG cresce, prezzi +2.5%.'],
  'event.city.luganoDown': ['Lugano: weak Ticino market, prices -3%.', 'Lugano: Schwacher Tessiner Markt, Preise -3%.', 'Lugano : marché tessinois faible, prix -3%.', 'Lugano: mercato ticinese debole, prezzi -3%.'],
  'event.city.luganoUp': ['Lugano: fintech firms move in, prices +3%.', 'Lugano: Fintech-Zuzug, Preise +3%.', 'Lugano : arrivée de fintechs, prix +3%.', 'Lugano: arrivano le fintech, prezzi +3%.'],
};

const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  fr: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  it: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
};

function initialLanguage() {
  let stored = null;
  try {
    stored = localStorage.getItem(STORE_KEY);
  } catch {
    stored = null;
  }
  if (CODES.includes(stored)) return stored;
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return CODES.includes(nav) ? nav : 'en';
}

function remember(code) {
  try {
    localStorage.setItem(STORE_KEY, code);
    return true;
  } catch {
    return false;
  }
}

let lang = initialLanguage();
let column = CODES.indexOf(lang);
const listeners = new Set();
setFormatLanguage(lang);
document.documentElement.lang = lang;

export const getLanguage = () => lang;

export function setLanguage(code) {
  if (!CODES.includes(code) || code === lang) return;
  lang = code;
  column = CODES.indexOf(code);
  setFormatLanguage(code);
  document.documentElement.lang = code;
  remember(code);
  applyStatic(document);
  for (const fn of listeners) fn(code);
}

export function onLanguageChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export const cityName = (key) => CITIES[key]?.names[lang] ?? key;
export const monthName = (m) => MONTHS[lang][m];
export const dateLabel = (m, y) => `${MONTHS[lang][m]} ${y}`;
export const localized = (map) => map?.[lang] ?? map?.en ?? '';

export function buildingName(city, b, label) {
  return label || t('building.unnamed', { n: b + 1 });
}

function resolve(value) {
  if (value == null) return '';
  if (typeof value === 'number') return Number.isInteger(value) ? integer(value) : decimal(value, 1);
  if (typeof value !== 'object') return String(value);
  if ('chf' in value) return chf(value.chf);
  if ('fixed' in value) return decimal(value.fixed[0], value.fixed[1]);
  if ('city' in value) return cityName(value.city);
  if ('defect' in value) return t(`defect.${value.defect}`);
  if ('building' in value) return buildingName(...value.building);
  return '';
}

export function t(key, params) {
  const row = D[key];
  let s = row ? row[column] ?? row[0] : key;
  if (params) {
    s = s.replace(/\{(\w+)\}/g, (_, name) => {
      if (name === 'profile' && typeof params.profile === 'string') return t(`profile.${params.profile}.name`);
      return name in params ? resolve(params[name]) : `{${name}}`;
    });
  }
  return lang === 'fr' ? s.replace(/ ([:;?!])/g, '\u00a0$1') : s;
}

export const has = (key) => key in D;

export function applyStatic(root) {
  for (const el of root.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of root.querySelectorAll('[data-i18n-title]')) el.title = t(el.dataset.i18nTitle);
  for (const el of root.querySelectorAll('[data-i18n-aria]')) el.setAttribute('aria-label', t(el.dataset.i18nAria));
}

export function languageSelect(className = '') {
  const select = document.createElement('select');
  select.className = className;
  select.setAttribute('aria-label', t('lang.label'));
  select.dataset.i18nAria = 'lang.label';
  for (const [code, label] of LANGUAGES) {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = label;
    select.appendChild(opt);
  }
  select.value = lang;
  select.addEventListener('change', () => setLanguage(select.value));
  const stop = onLanguageChange((code) => {
    if (!select.isConnected) stop();
    else select.value = code;
  });
  return select;
}
