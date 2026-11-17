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
  'home.cityStats': ['CHF/m² · rent/m² · gross yield', 'CHF/m² · Miete/m² · Bruttorendite', 'CHF/m² · loyer/m² · rendement brut', 'CHF/m² · affitto/m² · rendimento lordo'],
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
  'home.assumptions': [
    'Game assumptions: usable area is footprint times floors times 0.8. Interest, taxes, construction costs, growth and events are simplified.',
    'Spielannahmen: Nutzfläche ist Grundfläche mal Geschosse mal 0.8. Zinsen, Steuern, Baukosten, Wachstum und Ereignisse sind vereinfacht.',
    'Hypothèses : surface utile égale emprise fois étages fois 0.8. Intérêts, impôts, coûts de construction, croissance et événements sont simplifiés.',
    'Ipotesi di gioco: superficie utile pari a impronta per piani per 0.8. Interessi, tasse, costi di costruzione, crescita ed eventi sono semplificati.',
  ],

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
  'tab.goals': ['Goals', 'Ziele', 'Objectifs', 'Obiettivi'],
  'top.title': ['Title', 'Titel', 'Titre', 'Titolo'],
  'title.0': ['Newcomer', 'Neuling', 'Débutant', 'Esordiente'],
  'title.1': ['Landlord', 'Vermieter', 'Propriétaire', 'Locatore'],
  'title.2': ['Investor', 'Investor', 'Investisseur', 'Investitore'],
  'title.3': ['Developer', 'Projektentwickler', 'Promoteur', 'Promotore'],
  'title.4': ['Baron', 'Baron', 'Baron', 'Barone'],
  'title.5': ['Tycoon', 'Tycoon', 'Magnat', 'Magnate'],
  'goal.titleHead': ['Your title', 'Dein Titel', 'Votre titre', 'Il tuo titolo'],
  'goal.nextTitle': ['Next: {title} at {worth} in property', 'Nächster: {title} ab {worth} Immobilienwert', 'Suivant : {title} dès {worth} d’immobilier', 'Prossimo: {title} da {worth} di immobili'],
  'goal.maxTitle': ['Highest title reached', 'Höchster Titel erreicht', 'Titre le plus élevé atteint', 'Titolo più alto raggiunto'],
  'goal.missions': ['Missions', 'Missionen', 'Missions', 'Missioni'],
  'goal.completed': ['{n} missions completed', '{n} Missionen erfüllt', '{n} missions accomplies', '{n} missioni completate'],
  'goal.collections': ['Collections', 'Sammlungen', 'Collections', 'Collezioni'],
  'goal.done': ['Complete', 'Abgeschlossen', 'Terminée', 'Completata'],
  'goal.rateReward': ['mortgage rate -{p} pts', 'Hypozins -{p} Pkt.', 'taux hypothécaire -{p} pt', 'tasso ipotecario -{p} pt'],
  'goal.newTitle': ['New title', 'Neuer Titel', 'Nouveau titre', 'Nuovo titolo'],
  'goal.achieved': ['Goal reached', 'Ziel erreicht', 'Objectif atteint', 'Obiettivo raggiunto'],
  'mission.first': ['Buy your first building', 'Kaufe dein erstes Gebäude', 'Achetez votre premier immeuble', 'Compra il tuo primo edificio'],
  'mission.three': ['Own 3 buildings', 'Besitze 3 Gebäude', 'Possédez 3 immeubles', 'Possiedi 3 edifici'],
  'mission.renovate': ['Finish a renovation', 'Schliesse eine Renovation ab', 'Terminez une rénovation', 'Completa una ristrutturazione'],
  'mission.cities': ['Own buildings in 3 cities', 'Besitze Gebäude in 3 Städten', 'Possédez des immeubles dans 3 villes', 'Possiedi edifici in 3 città'],
  'mission.rent500': ['Reach CHF 500’000 annual rent', 'Erreiche CHF 500’000 Jahresmiete', 'Atteignez CHF 500’000 de loyers annuels', 'Raggiungi CHF 500’000 di affitti annui'],
  'mission.fix5': ['Repair 5 defects', 'Repariere 5 Mängel', 'Réparez 5 défauts', 'Ripara 5 difetti'],
  'mission.extend': ['Add a floor to a building', 'Stocke ein Gebäude auf', 'Surélevez un immeuble', 'Sopraeleva un edificio'],
  'mission.oldtown3': ['Own 3 old town buildings', 'Besitze 3 Altstadthäuser', 'Possédez 3 immeubles en vieille ville', 'Possiedi 3 edifici nel centro storico'],
  'mission.clean24': ['24 months in a row without overdraft', '24 Monate in Folge ohne Minus', '24 mois de suite sans découvert', '24 mesi di fila senza scoperto'],
  'mission.ten': ['Own 10 buildings', 'Besitze 10 Gebäude', 'Possédez 10 immeubles', 'Possiedi 10 edifici'],
  'mission.rent2m': ['Reach CHF 2 million annual rent', 'Erreiche CHF 2 Mio. Jahresmiete', 'Atteignez CHF 2 millions de loyers annuels', 'Raggiungi CHF 2 milioni di affitti annui'],
  'mission.worth20': ['Reach CHF 20 million net worth', 'Erreiche CHF 20 Mio. Nettovermögen', 'Atteignez CHF 20 millions de patrimoine net', 'Raggiungi CHF 20 milioni di patrimonio netto'],
  'collection.streets': ['High streets', 'Prachtstrassen', 'Rues prestigieuses', 'Vie dello shopping'],
  'collection.streets.desc': [
    'One building on each city’s main street: Bahnhofstrasse, Rue du Rhône, Rue de Bourg, Bahnhofstrasse Zug, Weggisgasse, Freie Strasse, Kramgasse, Multergasse, Via Nassa.',
    'Ein Gebäude an der Hauptstrasse jeder Stadt: Bahnhofstrasse, Rue du Rhône, Rue de Bourg, Bahnhofstrasse Zug, Weggisgasse, Freie Strasse, Kramgasse, Multergasse, Via Nassa.',
    'Un immeuble dans la rue principale de chaque ville : Bahnhofstrasse, Rue du Rhône, Rue de Bourg, Bahnhofstrasse Zoug, Weggisgasse, Freie Strasse, Kramgasse, Multergasse, Via Nassa.',
    'Un edificio sulla via principale di ogni città: Bahnhofstrasse, Rue du Rhône, Rue de Bourg, Bahnhofstrasse Zugo, Weggisgasse, Freie Strasse, Kramgasse, Multergasse, Via Nassa.',
  ],
  'collection.oldtowns': ['Old towns', 'Altstädte', 'Vieilles villes', 'Centri storici'],
  'collection.oldtowns.desc': ['An old town building in 5 different cities.', 'Ein Altstadthaus in 5 verschiedenen Städten.', 'Un immeuble de vieille ville dans 5 villes différentes.', 'Un edificio del centro storico in 5 città diverse.'],
  'collection.tour': ['Grand tour', 'Grand Tour', 'Grand tour', 'Grand tour'],
  'collection.tour.desc': ['At least one building in all nine cities.', 'Mindestens ein Gebäude in allen neun Städten.', 'Au moins un immeuble dans les neuf villes.', 'Almeno un edificio in tutte e nove le città.'],
  'news.mission': ['Mission complete: {goal}.', 'Mission erfüllt: {goal}.', 'Mission accomplie : {goal}.', 'Missione completata: {goal}.'],
  'news.collection': ['Collection complete: {goal}.', 'Sammlung komplett: {goal}.', 'Collection complète : {goal}.', 'Collezione completata: {goal}.'],
  'news.title': ['New title: {title}.', 'Neuer Titel: {title}.', 'Nouveau titre : {title}.', 'Nuovo titolo: {title}.'],
  'fx.acquired': ['Acquired', 'Gekauft', 'Acquis', 'Acquistato'],
  'fx.renovated': ['Renovated', 'Renoviert', 'Rénové', 'Ristrutturato'],
  'fx.extended': ['+1 floor', '+1 Geschoss', '+1 étage', '+1 piano'],

  'profile.rivals': ['Rivals, auctions and rumours', 'Rivalen, Auktionen und Gerüchte', 'Rivaux, enchères et rumeurs', 'Rivali, aste e voci'],
  'profile.rivalsHint': [
    'Three investors compete with you for buildings, prime properties go to auction, and market rumours may or may not come true.',
    'Drei Investoren konkurrieren mit dir um Gebäude, Toplagen kommen unter den Hammer, und Marktgerüchte bewahrheiten sich oder auch nicht.',
    'Trois investisseurs vous disputent les immeubles, les biens d’exception partent aux enchères et les rumeurs de marché se vérifient ou non.',
    'Tre investitori competono con te per gli edifici, gli immobili di pregio vanno all’asta e le voci di mercato possono avverarsi oppure no.',
  ],
  'rival.standings': ['Race against rivals', 'Rennen gegen Rivalen', 'Course contre les rivaux', 'Gara contro i rivali'],
  'rival.count': ['{n} buildings', '{n} Gebäude', '{n} immeubles', '{n} edifici'],
  'rival.bought': ['{rival} bought {name} in {city} for {price}.', '{rival} hat {name} in {city} für {price} gekauft.', '{rival} a acheté {name} à {city} pour {price}.', '{rival} ha comprato {name} a {city} per {price}.'],
  'tag.rival': ['Owned by {rival}', 'Gehört {rival}', 'Propriété de {rival}', 'Di proprietà di {rival}'],
  'tag.green': ['Solar', 'Solar', 'Solaire', 'Solare'],
  'tag.shortStay': ['Short stay', 'Kurzzeitmiete', 'Location courte', 'Affitto breve'],
  'info.rivalOwned': ['{rival} owns this building. It may come back on the market at auction.', '{rival} besitzt dieses Gebäude. Es kann an einer Auktion wieder auf den Markt kommen.', '{rival} possède cet immeuble. Il pourrait revenir sur le marché aux enchères.', '{rival} possiede questo edificio. Potrebbe tornare sul mercato all’asta.'],
  'market.yourRate': ['Your rate after bonuses', 'Dein Zins nach Boni', 'Votre taux après bonus', 'Il tuo tasso dopo i bonus'],
  'rumour.head': ['Rumours', 'Gerüchte', 'Rumeurs', 'Voci'],
  'rumour.tipUp': ['tipped to rise', 'soll steigen', 'devrait monter', 'dovrebbe salire'],
  'rumour.tipDown': ['tipped to fall', 'soll fallen', 'devrait baisser', 'dovrebbe scendere'],
  'rumour.up': ['Rumour: {quarter} in {city} is tipped to rise. Will it?', 'Gerücht: {quarter} in {city} soll zulegen. Stimmt das?', 'Rumeur : {quarter} à {city} devrait prendre de la valeur. Vraiment ?', 'Voce: {quarter} a {city} dovrebbe salire. Sarà vero?'],
  'rumour.down': ['Rumour: {quarter} in {city} is tipped to fall. Will it?', 'Gerücht: {quarter} in {city} soll an Wert verlieren. Stimmt das?', 'Rumeur : {quarter} à {city} devrait perdre de la valeur. Vraiment ?', 'Voce: {quarter} a {city} dovrebbe scendere. Sarà vero?'],
  'rumour.rose': ['{quarter} in {city}: prices +8%.', '{quarter} in {city}: Preise +8%.', '{quarter} à {city} : prix +8%.', '{quarter} a {city}: prezzi +8%.'],
  'rumour.fell': ['{quarter} in {city}: prices -7%.', '{quarter} in {city}: Preise -7%.', '{quarter} à {city} : prix -7%.', '{quarter} a {city}: prezzi -7%.'],

  'auction.label': ['Auction', 'Auktion', 'Enchères', 'Asta'],
  'auction.title': ['{name} goes to auction', '{name} kommt unter den Hammer', '{name} part aux enchères', '{name} va all’asta'],
  'auction.text': ['Estimated value {value}. Rivals bid against you. Each round you have a few seconds to respond.', 'Schätzwert {value}. Rivalen bieten mit. In jeder Runde hast du wenige Sekunden.', 'Valeur estimée {value}. Les rivaux surenchérissent. À chaque tour, vous avez quelques secondes.', 'Valore stimato {value}. I rivali rilanciano. A ogni turno hai pochi secondi.'],
  'auction.current': ['Current bid', 'Aktuelles Gebot', 'Offre actuelle', 'Offerta attuale'],
  'auction.leader': ['Leading', 'Führt', 'En tête', 'In testa'],
  'auction.need': ['Equity needed', 'Nötiges Eigenkapital', 'Fonds propres requis', 'Capitale proprio richiesto'],
  'auction.bid': ['Bid +{p}%', 'Bieten +{p}%', 'Enchérir +{p}%', 'Offri +{p}%'],
  'auction.withdraw': ['Withdraw', 'Aussteigen', 'Abandonner', 'Ritirati'],
  'auction.you': ['You', 'Du', 'Vous', 'Tu'],
  'auction.opens': ['{rival} opens at {price}.', '{rival} eröffnet mit {price}.', '{rival} ouvre à {price}.', '{rival} apre a {price}.'],
  'auction.raise': ['{rival} raises to {price}.', '{rival} erhöht auf {price}.', '{rival} monte à {price}.', '{rival} rilancia a {price}.'],
  'auction.yourBid': ['You bid {price}.', 'Du bietest {price}.', 'Vous offrez {price}.', 'Offri {price}.'],
  'auction.going': ['Going once, going twice, sold.', 'Zum Ersten, zum Zweiten, zum Dritten.', 'Une fois, deux fois, adjugé.', 'Uno, due, tre, aggiudicato.'],
  'auction.won': ['Auction won: {name} for {price}.', 'Auktion gewonnen: {name} für {price}.', 'Enchère gagnée : {name} pour {price}.', 'Asta vinta: {name} per {price}.'],
  'auction.lost': ['{rival} won the auction at {price}.', '{rival} gewinnt die Auktion mit {price}.', '{rival} remporte l’enchère à {price}.', '{rival} vince l’asta a {price}.'],

  'card.label': ['Decision', 'Entscheid', 'Décision', 'Decisione'],
  'card.airbnb.title': ['Short stay offer', 'Angebot für Kurzzeitmiete', 'Offre de location courte', 'Offerta di affitto breve'],
  'card.airbnb.text': ['A platform wants to rent flats in {name} to tourists.', 'Eine Plattform will Wohnungen in {name} an Touristen vermieten.', 'Une plateforme veut louer des appartements de {name} aux touristes.', 'Una piattaforma vuole affittare gli appartamenti di {name} ai turisti.'],
  'card.airbnb.accept': ['Accept', 'Annehmen', 'Accepter', 'Accetta'],
  'card.airbnb.acceptHint': ['Rent +25% for 2 years. Neighbours may complain.', 'Miete +25% für 2 Jahre. Nachbarn könnten klagen.', 'Loyer +25% pendant 2 ans. Les voisins pourraient se plaindre.', 'Affitto +25% per 2 anni. I vicini potrebbero lamentarsi.'],
  'card.airbnb.decline': ['Decline', 'Ablehnen', 'Refuser', 'Rifiuta'],
  'card.airbnb.declineHint': ['Keep long term tenants and a quiet house.', 'Langfristige Mieter, ruhiges Haus.', 'Garder des locataires stables et un immeuble calme.', 'Inquilini stabili e una casa tranquilla.'],
  'card.airbnb.news': ['Short stay offer for {name}: {choice}.', 'Kurzzeitmiete für {name}: {choice}.', 'Location courte pour {name} : {choice}.', 'Affitto breve per {name}: {choice}.'],
  'card.solar.title': ['Solar subsidy', 'Solarförderung', 'Subvention solaire', 'Sussidio solare'],
  'card.solar.text': ['The canton subsidises 30% of a solar roof on {name}.', 'Der Kanton übernimmt 30% eines Solardachs auf {name}.', 'Le canton subventionne 30% d’un toit solaire sur {name}.', 'Il cantone sussidia il 30% di un tetto solare su {name}.'],
  'card.solar.install': ['Install', 'Installieren', 'Installer', 'Installa'],
  'card.solar.installHint': ['Pay {cost}. Rent +3%, upkeep -10% for good.', 'Zahle {cost}. Miete +3%, Unterhalt -10% dauerhaft.', 'Payer {cost}. Loyer +3%, entretien -10% durablement.', 'Paga {cost}. Affitto +3%, manutenzione -10% per sempre.'],
  'card.solar.skip': ['Skip', 'Verzichten', 'Passer', 'Rinuncia'],
  'card.solar.skipHint': ['Keep the cash.', 'Behalte das Geld.', 'Garder la trésorerie.', 'Tieni la liquidità.'],
  'card.solar.news': ['Solar roof on {name}: {choice}.', 'Solardach auf {name}: {choice}.', 'Toit solaire sur {name} : {choice}.', 'Tetto solare su {name}: {choice}.'],
  'card.dispute.title': ['Rent dispute', 'Mietstreit', 'Litige de loyer', 'Controversia sull’affitto'],
  'card.dispute.text': ['A tenant in {name} contests the last rent increase.', 'Ein Mieter in {name} ficht die letzte Mieterhöhung an.', 'Un locataire de {name} conteste la dernière hausse de loyer.', 'Un inquilino di {name} contesta l’ultimo aumento.'],
  'card.dispute.settle': ['Settle', 'Einigen', 'Transiger', 'Accordo'],
  'card.dispute.settleHint': ['Pay one month of rent ({rent}) now.', 'Zahle jetzt eine Monatsmiete ({rent}).', 'Payer un mois de loyer ({rent}) maintenant.', 'Paga ora un mese di affitto ({rent}).'],
  'card.dispute.court': ['Go to court', 'Vor Gericht', 'Aller au tribunal', 'Andare in tribunale'],
  'card.dispute.courtHint': ['Verdict in 4 months. Win and pay nothing, lose and pay three months plus fees.', 'Urteil in 4 Monaten. Gewinnen kostet nichts, verlieren drei Monatsmieten plus Kosten.', 'Verdict dans 4 mois. Gagner ne coûte rien, perdre coûte trois mois plus les frais.', 'Sentenza tra 4 mesi. Vincere non costa nulla, perdere tre mesi più le spese.'],
  'card.dispute.news': ['Rent dispute in {name}: {choice}.', 'Mietstreit in {name}: {choice}.', 'Litige à {name} : {choice}.', 'Controversia in {name}: {choice}.'],
  'card.distressed.title': ['Distressed sale', 'Notverkauf', 'Vente forcée', 'Vendita in difficoltà'],
  'card.distressed.text': ['The owner of {name} must sell fast. The building needs serious work.', 'Der Besitzer von {name} muss schnell verkaufen. Das Haus braucht viel Arbeit.', 'Le propriétaire de {name} doit vendre vite. L’immeuble demande de gros travaux.', 'Il proprietario di {name} deve vendere in fretta. L’edificio richiede molti lavori.'],
  'card.distressed.buy': ['Buy', 'Kaufen', 'Acheter', 'Compra'],
  'card.distressed.buyHint': ['Price {price}, about 18% below value, condition 62%.', 'Preis {price}, etwa 18% unter Wert, Zustand 62%.', 'Prix {price}, environ 18% sous la valeur, état 62%.', 'Prezzo {price}, circa 18% sotto il valore, condizione 62%.'],
  'card.distressed.pass': ['Pass', 'Verzichten', 'Passer', 'Rinuncia'],
  'card.distressed.passHint': ['Someone else will take it.', 'Jemand anderes wird zugreifen.', 'Quelqu’un d’autre le prendra.', 'Lo prenderà qualcun altro.'],
  'card.distressed.news': ['Distressed sale of {name}: {choice}.', 'Notverkauf von {name}: {choice}.', 'Vente forcée de {name} : {choice}.', 'Vendita di {name}: {choice}.'],
  'card.fixRate.title': ['Fixed rate offer', 'Festhypothek-Angebot', 'Offre de taux fixe', 'Offerta a tasso fisso'],
  'card.fixRate.text': ['Your bank offers to fix all your mortgages for 5 years at {rate}%.', 'Deine Bank bietet an, alle Hypotheken für 5 Jahre zu {rate}% zu fixieren.', 'Votre banque propose de fixer toutes vos hypothèques pendant 5 ans à {rate}%.', 'La tua banca propone di fissare tutte le ipoteche per 5 anni al {rate}%.'],
  'card.fixRate.fix': ['Fix the rate', 'Zins fixieren', 'Fixer le taux', 'Fissa il tasso'],
  'card.fixRate.fixHint': ['Pay a little more now, safe from rate shocks.', 'Jetzt etwas mehr zahlen, dafür sicher vor Zinsschocks.', 'Payer un peu plus maintenant, à l’abri des chocs de taux.', 'Paghi un po’ di più ora, al riparo dagli shock.'],
  'card.fixRate.variable': ['Stay variable', 'Variabel bleiben', 'Rester variable', 'Resta variabile'],
  'card.fixRate.variableHint': ['Follow the market, up or down.', 'Dem Markt folgen, nach oben oder unten.', 'Suivre le marché, à la hausse comme à la baisse.', 'Segui il mercato, al rialzo o al ribasso.'],
  'card.fixRate.news': ['Mortgage offer: {choice}.', 'Hypothekarangebot: {choice}.', 'Offre hypothécaire : {choice}.', 'Offerta ipotecaria: {choice}.'],
  'card.retrofit.title': ['Energy law', 'Energiegesetz', 'Loi sur l’énergie', 'Legge sull’energia'],
  'card.retrofit.text': ['New rules require older buildings like {name} to improve insulation.', 'Neue Vorschriften verlangen bei älteren Gebäuden wie {name} eine bessere Dämmung.', 'De nouvelles règles imposent d’isoler les bâtiments anciens comme {name}.', 'Nuove regole impongono di isolare edifici datati come {name}.'],
  'card.retrofit.now': ['Retrofit now', 'Jetzt sanieren', 'Rénover maintenant', 'Risana ora'],
  'card.retrofit.nowHint': ['Pay {cost}, condition improves.', 'Zahle {cost}, Zustand verbessert sich.', 'Payer {cost}, l’état s’améliore.', 'Paga {cost}, la condizione migliora.'],
  'card.retrofit.later': ['Wait', 'Abwarten', 'Attendre', 'Aspetta'],
  'card.retrofit.laterHint': ['In 2 years it becomes mandatory and costs 50% more.', 'In 2 Jahren wird es Pflicht und kostet 50% mehr.', 'Dans 2 ans ce sera obligatoire et 50% plus cher.', 'Tra 2 anni sarà obbligatorio e costerà il 50% in più.'],
  'card.retrofit.news': ['Energy retrofit for {name}: {choice}.', 'Energetische Sanierung {name}: {choice}.', 'Rénovation énergétique de {name} : {choice}.', 'Risanamento energetico di {name}: {choice}.'],
  'card.film.title': ['Film shoot', 'Filmdreh', 'Tournage', 'Riprese cinematografiche'],
  'card.film.text': ['A production company wants to film in {name} for a week.', 'Eine Filmproduktion möchte eine Woche in {name} drehen.', 'Une société de production veut tourner une semaine à {name}.', 'Una casa di produzione vuole girare una settimana in {name}.'],
  'card.film.accept': ['Accept', 'Zusagen', 'Accepter', 'Accetta'],
  'card.film.acceptHint': ['Earn CHF 20’000. The crew may cause some damage.', 'Verdiene CHF 20’000. Die Crew könnte etwas beschädigen.', 'Gagner CHF 20’000. L’équipe pourrait causer des dégâts.', 'Guadagni CHF 20’000. La troupe potrebbe causare danni.'],
  'card.film.decline': ['Decline', 'Absagen', 'Refuser', 'Rifiuta'],
  'card.film.declineHint': ['No risk, no fee.', 'Kein Risiko, kein Honorar.', 'Pas de risque, pas de cachet.', 'Nessun rischio, nessun compenso.'],
  'card.film.news': ['Film shoot in {name}: {choice}.', 'Filmdreh in {name}: {choice}.', 'Tournage à {name} : {choice}.', 'Riprese in {name}: {choice}.'],
  'outcome.airbnbComplaint': ['Neighbours of {name} complained about short stays. Fine {cost}, the arrangement ends.', 'Nachbarn von {name} beschweren sich über Kurzzeitmieten. Busse {cost}, das Modell endet.', 'Les voisins de {name} se plaignent des locations courtes. Amende {cost}, fin de l’arrangement.', 'I vicini di {name} si lamentano degli affitti brevi. Multa {cost}, l’accordo finisce.'],
  'outcome.courtWon': ['Court ruled in your favour on {name}.', 'Gericht entscheidet zu deinen Gunsten bei {name}.', 'Le tribunal vous donne raison pour {name}.', 'Il tribunale ti dà ragione su {name}.'],
  'outcome.courtLost': ['Court case lost on {name}. You pay {cost}.', 'Prozess um {name} verloren. Du zahlst {cost}.', 'Procès perdu pour {name}. Vous payez {cost}.', 'Causa persa su {name}. Paghi {cost}.'],
  'outcome.retrofitForced': ['Mandatory retrofit of {name}: {cost}.', 'Pflichtsanierung von {name}: {cost}.', 'Rénovation obligatoire de {name} : {cost}.', 'Risanamento obbligatorio di {name}: {cost}.'],
  'outcome.filmDamage': ['The film crew damaged the staircase of {name}. Repair {cost}.', 'Die Filmcrew hat das Treppenhaus von {name} beschädigt. Reparatur {cost}.', 'L’équipe de tournage a abîmé la cage d’escalier de {name}. Réparation {cost}.', 'La troupe ha danneggiato le scale di {name}. Riparazione {cost}.'],
  'menu.continue': ['Continue', 'Weiterspielen', 'Continuer', 'Continua'],
  'menu.new': ['New game', 'Neues Spiel', 'Nouvelle partie', 'Nuova partita'],
  'menu.load': ['Load game', 'Spiel laden', 'Charger une partie', 'Carica partita'],
  'menu.settings': ['Settings', 'Einstellungen', 'Paramètres', 'Impostazioni'],
  'menu.how': ['How to play', 'Spielanleitung', 'Comment jouer', 'Come si gioca'],
  'menu.credits': ['Leaderboard', 'Bestenliste', 'Classement', 'Classifica'],
  'menu.back': ['Back', 'Zurück', 'Retour', 'Indietro'],
  'new.profile': ['Choose a profile', 'Profil wählen', 'Choisir un profil', 'Scegli un profilo'],
  'new.city': ['Starting city', 'Startstadt', 'Ville de départ', 'Città di partenza'],
  'new.cityNote': ['You can switch cities at any time during the game.', 'Du kannst die Stadt jederzeit im Spiel wechseln.', 'Vous pouvez changer de ville à tout moment.', 'Puoi cambiare città in qualsiasi momento.'],
  'new.options': ['Options', 'Optionen', 'Options', 'Opzioni'],
  'new.slot': ['Save slot', 'Speicherplatz', 'Emplacement de sauvegarde', 'Slot di salvataggio'],
  'new.overwrite': ['Slot {n} already holds a game. Starting here replaces it.', 'Platz {n} enthält bereits ein Spiel. Ein Start hier ersetzt es.', 'L’emplacement {n} contient déjà une partie. Commencer ici la remplace.', 'Lo slot {n} contiene già una partita. Iniziare qui la sostituisce.'],
  'new.start': ['Start game', 'Spiel starten', 'Lancer la partie', 'Inizia la partita'],
  'load.slot': ['Slot {n}', 'Platz {n}', 'Emplacement {n}', 'Slot {n}'],
  'load.empty': ['Empty', 'Leer', 'Vide', 'Vuoto'],
  'load.saved': ['Last saved {when}', 'Zuletzt gespeichert {when}', 'Dernière sauvegarde {when}', 'Ultimo salvataggio {when}'],
  'load.ended': ['season over', 'Saison beendet', 'saison terminée', 'stagione conclusa'],
  'load.play': ['Play', 'Spielen', 'Jouer', 'Gioca'],
  'load.delete': ['Delete', 'Löschen', 'Supprimer', 'Elimina'],
  'load.confirmDelete': ['Confirm delete', 'Wirklich löschen', 'Confirmer', 'Conferma'],
  'settings.on': ['On', 'Ein', 'Activé', 'Attivo'],
  'settings.off': ['Off', 'Aus', 'Désactivé', 'Disattivo'],
  'settings.quality': ['Graphics quality', 'Grafikqualität', 'Qualité graphique', 'Qualità grafica'],
  'settings.quality.low': ['Low', 'Niedrig', 'Basse', 'Bassa'],
  'settings.quality.medium': ['Medium', 'Mittel', 'Moyenne', 'Media'],
  'settings.quality.high': ['High', 'Hoch', 'Haute', 'Alta'],
  'settings.qualityHint': ['Lower quality draws fewer detailed blocks and runs better on older laptops. Applies when a city loads.', 'Niedrige Qualität zeichnet weniger Details und läuft besser auf älteren Laptops. Gilt beim Laden einer Stadt.', 'Une qualité basse dessine moins de détails et tourne mieux sur les anciens portables. S’applique au chargement d’une ville.', 'Una qualità bassa disegna meno dettagli e funziona meglio sui portatili datati. Vale al caricamento di una città.'],
  'settings.pace': ['Game pace', 'Spieltempo', 'Rythme du jeu', 'Ritmo di gioco'],
  'settings.pace.slow': ['Relaxed', 'Gemütlich', 'Détendu', 'Rilassato'],
  'settings.pace.normal': ['Normal', 'Normal', 'Normal', 'Normale'],
  'settings.pace.fast': ['Fast', 'Schnell', 'Rapide', 'Veloce'],
  'settings.paceHint': ['One game month takes 10, 6 or 3 seconds at normal speed.', 'Ein Spielmonat dauert bei normaler Geschwindigkeit 10, 6 oder 3 Sekunden.', 'Un mois de jeu dure 10, 6 ou 3 secondes en vitesse normale.', 'Un mese di gioco dura 10, 6 o 3 secondi a velocità normale.'],
  'settings.labels': ['Place names on the map', 'Ortsnamen auf der Karte', 'Noms de lieux sur la carte', 'Nomi dei luoghi sulla mappa'],
  'settings.minimap': ['Minimap', 'Minikarte', 'Mini-carte', 'Minimappa'],
  'settings.backdrop': ['Animated city on this page', 'Animierte Stadt auf dieser Seite', 'Ville animée sur cette page', 'Città animata in questa pagina'],
  'settings.backdropHint': ['Turn off to save battery.', 'Ausschalten spart Akku.', 'Désactivez pour économiser la batterie.', 'Disattiva per risparmiare batteria.'],
  'settings.data': ['Data', 'Daten', 'Données', 'Dati'],
  'settings.reset': ['Delete all saves and settings', 'Alle Spielstände und Einstellungen löschen', 'Supprimer sauvegardes et paramètres', 'Elimina salvataggi e impostazioni'],
  'settings.resetConfirm': ['Click again to delete everything', 'Nochmals klicken, um alles zu löschen', 'Cliquez encore pour tout supprimer', 'Clicca di nuovo per eliminare tutto'],
  'settings.resetHint': ['Removes all three save slots, the leaderboard and your settings from this browser.', 'Entfernt alle drei Speicherplätze, die Bestenliste und deine Einstellungen aus diesem Browser.', 'Supprime les trois emplacements, le classement et vos paramètres de ce navigateur.', 'Rimuove i tre slot, la classifica e le impostazioni da questo browser.'],
  'mobile.panel': ['Dashboard', 'Übersicht', 'Tableau de bord', 'Pannello'],
  'tut.step': ['Tutorial {n} / {total}', 'Tutorial {n} / {total}', 'Tutoriel {n} / {total}', 'Tutorial {n} / {total}'],
  'tut.next': ['Next', 'Weiter', 'Suivant', 'Avanti'],
  'tut.skip': ['Skip tutorial', 'Tutorial überspringen', 'Passer le tutoriel', 'Salta il tutorial'],
  'tut.finish': ['Start playing', 'Los gehts', 'Commencer', 'Inizia a giocare'],
  'tut.suggest': ['Show me one I can afford', 'Zeig mir eines, das ich mir leisten kann', 'Montrez-m’en un abordable', 'Mostrami uno che posso permettermi'],
  'tut.replay': ['Replay tutorial', 'Tutorial wiederholen', 'Revoir le tutoriel', 'Rivedi il tutorial'],
  'tut.howNote': ['A short tutorial starts in your first game. You can replay it any time with the help button in the game.', 'Im ersten Spiel startet ein kurzes Tutorial. Über den Hilfe-Knopf im Spiel kannst du es jederzeit wiederholen.', 'Un court tutoriel démarre lors de votre première partie. Vous pouvez le revoir à tout moment via le bouton d’aide en jeu.', 'Un breve tutorial parte nella prima partita. Puoi rivederlo in qualsiasi momento con il pulsante di aiuto nel gioco.'],
  'tut.welcome.title': ['Welcome to Swiss Blocks', 'Willkommen bei Swiss Blocks', 'Bienvenue dans Swiss Blocks', 'Benvenuto in Swiss Blocks'],
  'tut.welcome.text': ['Every block you see is a real building. In a few steps you will buy your first property and watch it earn rent.', 'Jeder Block ist ein echtes Gebäude. In wenigen Schritten kaufst du deine erste Liegenschaft und siehst, wie sie Miete einbringt.', 'Chaque bloc est un vrai bâtiment. En quelques étapes, vous achèterez votre premier bien et le verrez rapporter des loyers.', 'Ogni blocco è un edificio reale. In pochi passi comprerai il tuo primo immobile e lo vedrai rendere affitti.'],
  'tut.move.title': ['Look around', 'Schau dich um', 'Explorez', 'Guardati intorno'],
  'tut.move.text': ['Drag to move, scroll to zoom, and right drag to rotate and tilt. Arrow keys work too.', 'Ziehen verschiebt, Scrollen zoomt, Rechts-Ziehen dreht und neigt. Pfeiltasten gehen auch.', 'Glissez pour vous déplacer, molette pour zoomer, clic droit glissé pour tourner et incliner. Les flèches marchent aussi.', 'Trascina per spostarti, rotella per lo zoom, trascina col destro per ruotare e inclinare. Funzionano anche le frecce.'],
  'tut.move.touch': ['Drag with one finger to move. Pinch to zoom, and twist or slide two fingers to rotate and tilt.', 'Mit einem Finger ziehen verschiebt. Zwei Finger zoomen, drehen und neigen.', 'Glissez avec un doigt pour vous déplacer. Pincez pour zoomer, tournez ou glissez deux doigts pour pivoter et incliner.', 'Trascina con un dito per spostarti. Pizzica per lo zoom, ruota o scorri con due dita per girare e inclinare.'],
  'tut.select.title': ['Pick a building', 'Wähle ein Gebäude', 'Choisissez un immeuble', 'Scegli un edificio'],
  'tut.select.text': ['Tap or click any house, or search for an address here.', 'Tippe oder klicke auf ein Haus, oder suche hier nach einer Adresse.', 'Touchez ou cliquez sur une maison, ou cherchez une adresse ici.', 'Tocca o clicca su una casa, oppure cerca un indirizzo qui.'],
  'tut.buy.title': ['Read the numbers, then buy', 'Zahlen lesen, dann kaufen', 'Lisez les chiffres, puis achetez', 'Leggi i numeri, poi compra'],
  'tut.buy.text': ['You see the value, the rent and the gross yield. Set your mortgage with the slider and press Buy. If the equity line is red, the building is too expensive for now: let the game suggest one.', 'Du siehst Wert, Miete und Bruttorendite. Stelle die Hypothek mit dem Regler ein und drücke Kaufen. Ist das Eigenkapital rot, ist das Haus noch zu teuer: lass dir eines vorschlagen.', 'Vous voyez la valeur, le loyer et le rendement brut. Réglez l’hypothèque avec le curseur et appuyez sur Acheter. Si les fonds propres sont en rouge, l’immeuble est trop cher pour l’instant : laissez le jeu vous en proposer un.', 'Vedi valore, affitto e rendimento lordo. Regola l’ipoteca con il cursore e premi Compra. Se il capitale proprio è rosso, l’edificio è troppo caro per ora: fatti suggerire un’alternativa.'],
  'tut.time.title': ['Let time run', 'Lass die Zeit laufen', 'Faites avancer le temps', 'Fai scorrere il tempo'],
  'tut.time.text': ['Press play. Each month rent comes in, and interest, upkeep and living costs go out.', 'Drücke Play. Jeden Monat kommt Miete rein, Zinsen, Unterhalt und Lebenskosten gehen raus.', 'Appuyez sur lecture. Chaque mois, les loyers entrent, les intérêts, l’entretien et le coût de la vie sortent.', 'Premi play. Ogni mese entrano gli affitti, escono interessi, manutenzione e costo della vita.'],
  'tut.money.title': ['Watch your numbers', 'Behalte die Zahlen im Blick', 'Surveillez vos chiffres', 'Tieni d’occhio i numeri'],
  'tut.money.text': ['Cash, mortgages, net worth and monthly cash flow are always up here. If cash stays negative for 3 months, the bank sells a building.', 'Cash, Hypotheken, Nettovermögen und Cashflow stehen immer hier oben. Bleibt das Cash 3 Monate negativ, verkauft die Bank ein Gebäude.', 'Liquidités, hypothèques, patrimoine net et flux mensuel sont toujours ici. Si vos liquidités restent négatives 3 mois, la banque vend un immeuble.', 'Liquidità, ipoteche, patrimonio netto e flusso mensile sono sempre qui. Se la liquidità resta negativa per 3 mesi, la banca vende un edificio.'],
  'tut.goals.title': ['Follow your goals', 'Verfolge deine Ziele', 'Suivez vos objectifs', 'Segui i tuoi obiettivi'],
  'tut.goals.text': ['Open Goals to see your missions, collections and next title. Each one pays a reward.', 'Öffne Ziele für Missionen, Sammlungen und deinen nächsten Titel. Jedes Ziel bringt eine Belohnung.', 'Ouvrez Objectifs pour voir missions, collections et prochain titre. Chacun rapporte une récompense.', 'Apri Obiettivi per vedere missioni, collezioni e il prossimo titolo. Ognuno dà una ricompensa.'],
  'tut.defects.title': ['Keep buildings in shape', 'Halte die Häuser in Schuss', 'Entretenez vos immeubles', 'Mantieni gli edifici in forma'],
  'tut.defects.text': ['Leaks, broken heating and other defects appear over time. Repair them here before tenants cut the rent.', 'Mit der Zeit gibt es Lecks, Heizungsausfälle und andere Mängel. Repariere sie hier, bevor Mieter die Miete kürzen.', 'Fuites, pannes de chauffage et autres défauts apparaissent. Réparez-les ici avant que les locataires ne réduisent le loyer.', 'Col tempo arrivano perdite, guasti al riscaldamento e altri difetti. Riparali qui prima che gli inquilini riducano l’affitto.'],
  'tut.done.title': ['You are ready', 'Du bist bereit', 'Vous êtes prêt', 'Sei pronto'],
  'tut.done.text': ['Decisions and auctions will pop up along the way. Grow your portfolio across nine cities and see how you rank after ten years.', 'Unterwegs erwarten dich Entscheide und Auktionen. Baue dein Portfolio in neun Städten auf und schau, wo du nach zehn Jahren stehst.', 'Décisions et enchères vous attendent en chemin. Développez votre portefeuille dans neuf villes et voyez votre classement après dix ans.', 'Lungo la strada arriveranno decisioni e aste. Fai crescere il portafoglio in nove città e scopri la tua posizione dopo dieci anni.'],
  'menu.about': ['About and legal', 'Über das Spiel und Rechtliches', 'À propos et mentions légales', 'Informazioni e note legali'],
  'about.imprint': ['Imprint', 'Impressum', 'Mentions légales', 'Colophon'],
  'about.imprintText': ['Swiss Blocks is an independent project by Robin Lefebvre, Switzerland.', 'Swiss Blocks ist ein unabhängiges Projekt von Robin Lefebvre, Schweiz.', 'Swiss Blocks est un projet indépendant de Robin Lefebvre, Suisse.', 'Swiss Blocks è un progetto indipendente di Robin Lefebvre, Svizzera.'],
  'about.contact': ['Contact', 'Kontakt', 'Contact', 'Contatto'],
  'about.privacy': ['Privacy', 'Datenschutz', 'Confidentialité', 'Privacy'],
  'about.privacyText': [
    'The game has no accounts, no cookies and no ads. Saves, settings and the leaderboard stay in your own browser. To count players, the website uses Plausible, a privacy-friendly analytics tool that stores no personal data and sets no cookies.',
    'Das Spiel hat keine Konten, keine Cookies und keine Werbung. Spielstände, Einstellungen und Bestenliste bleiben in deinem Browser. Um Spieler zu zählen, nutzt die Website Plausible, ein datenschutzfreundliches Analysetool ohne Personendaten und ohne Cookies.',
    'Le jeu n’a ni compte, ni cookies, ni publicité. Sauvegardes, paramètres et classement restent dans votre navigateur. Pour compter les joueurs, le site utilise Plausible, un outil d’analyse respectueux de la vie privée, sans données personnelles ni cookies.',
    'Il gioco non ha account, cookie né pubblicità. Salvataggi, impostazioni e classifica restano nel tuo browser. Per contare i giocatori il sito usa Plausible, uno strumento di analisi rispettoso della privacy, senza dati personali né cookie.',
  ],
  'about.licences': ['Data and licences', 'Daten und Lizenzen', 'Données et licences', 'Dati e licenze'],
  'about.licenceSwisstopo': ['Source: Federal Office of Topography swisstopo (swissBUILDINGS3D, base map vector tiles) and Federal Statistical Office (building register), open government data.', 'Quelle: Bundesamt für Landestopografie swisstopo (swissBUILDINGS3D, Vektortiles der Basiskarte) und Bundesamt für Statistik (Gebäuderegister), Open Government Data.', 'Source : Office fédéral de topographie swisstopo (swissBUILDINGS3D, tuiles vectorielles de la carte de base) et Office fédéral de la statistique (registre des bâtiments), données ouvertes.', 'Fonte: Ufficio federale di topografia swisstopo (swissBUILDINGS3D, tessere vettoriali della carta di base) e Ufficio federale di statistica (registro degli edifici), dati aperti.'],
  'about.licenceZurich': ['Zurich: Stadt Zürich Open Data and Statistik Stadt Zürich.', 'Zürich: Stadt Zürich Open Data und Statistik Stadt Zürich.', 'Zurich : Stadt Zürich Open Data et Statistik Stadt Zürich.', 'Zurigo: Stadt Zürich Open Data e Statistik Stadt Zürich.'],
  'about.licencePhotos': ['Landmark photos: Wikimedia Commons, under the licence named on each card (CC BY, CC BY-SA or public domain). Texts are short summaries written for the game.', 'Fotos der Sehenswürdigkeiten: Wikimedia Commons, unter der auf jeder Karte genannten Lizenz (CC BY, CC BY-SA oder gemeinfrei). Die Texte sind eigens verfasste Kurzfassungen.', 'Photos des monuments : Wikimedia Commons, sous la licence indiquée sur chaque fiche (CC BY, CC BY-SA ou domaine public). Les textes sont de courts résumés rédigés pour le jeu.', 'Foto dei monumenti: Wikimedia Commons, con la licenza indicata su ogni scheda (CC BY, CC BY-SA o pubblico dominio). I testi sono brevi riassunti scritti per il gioco.'],
  'about.licenceCode': ['3D engine: three.js, MIT licence.', '3D-Engine: three.js, MIT-Lizenz.', 'Moteur 3D : three.js, licence MIT.', 'Motore 3D: three.js, licenza MIT.'],
  'about.disclaimer': ['Disclaimer', 'Haftungsausschluss', 'Avertissement', 'Avvertenza'],
  'about.disclaimerText': [
    'This is a game. Prices, rents, rules and events are simplified estimates and not financial, legal or tax advice. Buildings and addresses come from public data; the game has no link to their owners. Rival investors are fictional.',
    'Dies ist ein Spiel. Preise, Mieten, Regeln und Ereignisse sind vereinfachte Schätzungen und keine Finanz-, Rechts- oder Steuerberatung. Gebäude und Adressen stammen aus öffentlichen Daten; das Spiel steht in keiner Verbindung zu deren Eigentümern. Die Rivalen sind erfunden.',
    'Ceci est un jeu. Prix, loyers, règles et événements sont des estimations simplifiées et ne constituent pas un conseil financier, juridique ou fiscal. Les bâtiments et adresses proviennent de données publiques ; le jeu n’a aucun lien avec leurs propriétaires. Les investisseurs rivaux sont fictifs.',
    'Questo è un gioco. Prezzi, affitti, regole ed eventi sono stime semplificate e non costituiscono consulenza finanziaria, legale o fiscale. Edifici e indirizzi provengono da dati pubblici; il gioco non ha legami con i loro proprietari. Gli investitori rivali sono inventati.',
  ],
  'menu.feedback': ['Send feedback', 'Feedback senden', 'Envoyer un avis', 'Invia un feedback'],
  'menu.label': ['Main menu', 'Hauptmenü', 'Menu principal', 'Menu principale'],
  'a11y.map': ['3D map of {city}', '3D-Karte von {city}', 'Carte 3D de {city}', 'Mappa 3D di {city}'],
  'tool.sound': ['Sound', 'Ton', 'Son', 'Audio'],
  'tool.soundTitle': ['Sound on or off (M)', 'Ton ein oder aus (M)', 'Son activé ou non (M)', 'Audio sì o no (M)'],
  'settings.sound': ['Sound effects', 'Soundeffekte', 'Effets sonores', 'Effetti sonori'],
  'settings.volume': ['Volume', 'Lautstärke', 'Volume', 'Volume'],
  'settings.volume.0': ['Quiet', 'Leise', 'Faible', 'Basso'],
  'settings.volume.1': ['Medium', 'Mittel', 'Moyen', 'Medio'],
  'settings.volume.2': ['Loud', 'Laut', 'Fort', 'Alto'],
  'error.browserTitle': ['This browser is not supported', 'Dieser Browser wird nicht unterstützt', 'Ce navigateur n’est pas pris en charge', 'Questo browser non è supportato'],
  'error.webgl': ['Swiss Blocks needs 3D graphics (WebGL), which this browser or device has turned off. Try a recent Chrome, Edge, Firefox or Safari, or turn on hardware acceleration in your browser settings.', 'Swiss Blocks braucht 3D-Grafik (WebGL), die in diesem Browser oder Gerät ausgeschaltet ist. Versuche ein aktuelles Chrome, Edge, Firefox oder Safari oder aktiviere die Hardwarebeschleunigung in den Browsereinstellungen.', 'Swiss Blocks a besoin des graphismes 3D (WebGL), désactivés dans ce navigateur ou cet appareil. Essayez un Chrome, Edge, Firefox ou Safari récent, ou activez l’accélération matérielle dans les réglages du navigateur.', 'Swiss Blocks richiede la grafica 3D (WebGL), disattivata in questo browser o dispositivo. Prova un Chrome, Edge, Firefox o Safari recente, oppure attiva l’accelerazione hardware nelle impostazioni del browser.'],
  'error.browser': ['This browser is too old for Swiss Blocks. Please update it, or use a recent Chrome, Edge, Firefox or Safari.', 'Dieser Browser ist zu alt für Swiss Blocks. Bitte aktualisiere ihn oder nutze ein aktuelles Chrome, Edge, Firefox oder Safari.', 'Ce navigateur est trop ancien pour Swiss Blocks. Mettez-le à jour ou utilisez un Chrome, Edge, Firefox ou Safari récent.', 'Questo browser è troppo vecchio per Swiss Blocks. Aggiornalo oppure usa un Chrome, Edge, Firefox o Safari recente.'],
  'error.loadTitle': ['The city could not be loaded', 'Die Stadt konnte nicht geladen werden', 'La ville n’a pas pu être chargée', 'Impossibile caricare la città'],
  'error.loadText': ['Check your internet connection and try again. Your saved games are safe.', 'Prüfe deine Internetverbindung und versuche es erneut. Deine Spielstände sind sicher.', 'Vérifiez votre connexion internet et réessayez. Vos sauvegardes sont intactes.', 'Controlla la connessione a internet e riprova. I tuoi salvataggi sono al sicuro.'],
  'error.retry': ['Try again', 'Erneut versuchen', 'Réessayer', 'Riprova'],
  'error.menu': ['Back to menu', 'Zurück zum Menü', 'Retour au menu', 'Torna al menu'],
  'error.gpuTitle': ['The graphics stopped', 'Die Grafik wurde angehalten', 'Les graphismes se sont arrêtés', 'La grafica si è fermata'],
  'error.gpuText': ['Your device reset the 3D graphics, often because memory ran low. Your game has been saved. Reload to continue, and try a lower graphics quality in Settings if it happens again.', 'Dein Gerät hat die 3D-Grafik zurückgesetzt, meist wegen knappem Speicher. Dein Spiel ist gespeichert. Lade neu, um weiterzuspielen, und wähle bei Bedarf eine niedrigere Grafikqualität.', 'Votre appareil a réinitialisé les graphismes 3D, souvent par manque de mémoire. Votre partie est sauvegardée. Rechargez pour continuer et choisissez une qualité graphique plus basse si cela se reproduit.', 'Il dispositivo ha reimpostato la grafica 3D, spesso per poca memoria. La partita è salvata. Ricarica per continuare e scegli una qualità grafica più bassa se succede ancora.'],
  'error.reload': ['Reload', 'Neu laden', 'Recharger', 'Ricarica'],
  'error.runtime': ['Something went wrong. Your game is saved; reload the page if anything looks off.', 'Etwas ist schiefgelaufen. Dein Spiel ist gespeichert; lade die Seite neu, falls etwas komisch aussieht.', 'Un problème est survenu. Votre partie est sauvegardée ; rechargez la page si quelque chose semble anormal.', 'Qualcosa è andato storto. La partita è salvata; ricarica la pagina se qualcosa non va.'],
  'error.storage': ['This browser does not allow saving, for example in private mode. You can play, but your progress will be lost when you close the page.', 'Dieser Browser erlaubt kein Speichern, etwa im privaten Modus. Du kannst spielen, aber dein Fortschritt geht beim Schliessen verloren.', 'Ce navigateur n’autorise pas la sauvegarde, par exemple en navigation privée. Vous pouvez jouer, mais votre progression sera perdue à la fermeture.', 'Questo browser non consente di salvare, per esempio in modalità privata. Puoi giocare, ma i progressi andranno persi alla chiusura.'],
  'record.kicker': ['Season record', 'Saisonbilanz', 'Bilan de saison', 'Bilancio di stagione'],
  'record.anonymous': ['Swiss Blocks player', 'Swiss-Blocks-Spieler', 'Joueur de Swiss Blocks', 'Giocatore di Swiss Blocks'],
  'record.summary': ['{title} · {profile} · {months} months', '{title} · {profile} · {months} Monate', '{title} · {profile} · {months} mois', '{title} · {profile} · {months} mesi'],
  'record.code': ['Record {code}', 'Bilanz {code}', 'Bilan {code}', 'Bilancio {code}'],
  'record.share': ['I finished a season of Swiss Blocks as {title} with {aum} in property and an execution score of {exec}/100. Can you beat it? {url}', 'Ich habe eine Saison Swiss Blocks als {title} abgeschlossen, mit {aum} Immobilienwert und {exec}/100 Execution. Schaffst du mehr? {url}', 'J’ai terminé une saison de Swiss Blocks comme {title}, avec {aum} d’immobilier et un score d’exécution de {exec}/100. Ferez-vous mieux ? {url}', 'Ho chiuso una stagione di Swiss Blocks come {title}, con {aum} di immobili e un punteggio di esecuzione di {exec}/100. Riesci a fare meglio? {url}'],
  'record.title': ['Your season record', 'Deine Saisonbilanz', 'Votre bilan de saison', 'Il tuo bilancio di stagione'],
  'record.lead': ['Add your name and share the result as an image, for example on LinkedIn.', 'Füge deinen Namen hinzu und teile das Ergebnis als Bild, zum Beispiel auf LinkedIn.', 'Ajoutez votre nom et partagez le résultat en image, par exemple sur LinkedIn.', 'Aggiungi il tuo nome e condividi il risultato come immagine, per esempio su LinkedIn.'],
  'record.name': ['Name on the record', 'Name auf der Bilanz', 'Nom sur le bilan', 'Nome sul bilancio'],
  'record.alt': ['Image of your season record', 'Bild deiner Saisonbilanz', 'Image de votre bilan de saison', 'Immagine del tuo bilancio di stagione'],
  'record.download': ['Download image', 'Bild herunterladen', 'Télécharger l’image', 'Scarica l’immagine'],
  'record.shareButton': ['Share', 'Teilen', 'Partager', 'Condividi'],
  'record.copy': ['Copy text', 'Text kopieren', 'Copier le texte', 'Copia il testo'],
  'record.copied': ['Copied', 'Kopiert', 'Copié', 'Copiato'],
  'record.linkedin': ['Post on LinkedIn', 'Auf LinkedIn posten', 'Publier sur LinkedIn', 'Pubblica su LinkedIn'],
  'record.note': ['Records are created on your device. Verified certificates will come with online seasons.', 'Bilanzen werden auf deinem Gerät erstellt. Verifizierte Zertifikate kommen mit den Online-Saisons.', 'Les bilans sont créés sur votre appareil. Les certificats vérifiés arriveront avec les saisons en ligne.', 'I bilanci sono creati sul tuo dispositivo. I certificati verificati arriveranno con le stagioni online.'],
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
  if ('goal' in value) return t(value.goal);
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
  for (const el of root.querySelectorAll('[data-i18n-title]')) {
    el.title = t(el.dataset.i18nTitle);
    if (!el.textContent.trim()) el.setAttribute('aria-label', el.title);
  }
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
