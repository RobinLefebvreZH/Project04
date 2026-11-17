# Swiss Blocks

A voxel real estate game set in nine Swiss city centres: Zurich, Geneva, Lausanne, Zug, Lucerne, Basel, Bern, St. Gallen and Lugano. Every building comes from official 3D data and is rendered in 2 m blocks.

## Run

The game uses ES modules, so it needs to be served over HTTP:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

The game is a folder of static files with no build step and no outside dependencies.

- OVH or any Apache host: upload `index.html`, `.htaccess` and the folders `css`, `data`, `js`, `vendor` and `wiki` into a folder such as `www/swissblocks`.
- Vercel: import the repository as a project with no framework preset; `vercel.json` sets the cache headers.

## Play

The home menu has New game, Load game (three save slots), Settings (language, graphics quality, game pace, labels, minimap, animated backdrop), How to play and the leaderboard.

1. Start a new game: choose a profile (Banker, Entrepreneur or Heir), a starting city, whether rivals are on, and a save slot.
2. Click buildings to see value, rent and yield. Buy with up to 80% mortgage, subject to the Swiss affordability rule.
3. Run time, handle defects and market events, renovate or add floors.
4. After 120 months you are ranked on assets, net operating income and execution.

Along the way:

- Floating rent numbers, pulses and rising floors show what your buildings are doing.
- Decision cards (short stay offers, rent disputes, solar subsidies, fixed rate offers and more) ask you to choose, and some outcomes arrive months later.
- Missions, collections and titles give short and medium term goals with cash or mortgage rate rewards.
- Optional at the start of a season: three rival investors, live auctions with a bidding timer, and market rumours that may or may not come true.

Landmarks, universities and main stations open a short card with photos and a link to Wikipedia. The language can be switched at any time between English, German, French and Italian.

## Structure

```
index.html          markup only
css/style.css       all styles
js/main.js          routing between home and game, main loop
js/home.js          home menu: new game, load game, settings, help, credits
js/backdrop.js      animated city behind the home menu
js/settings.js      persisted player settings
vendor/             three.js r160 (MIT licence)
js/ui.js            in-game interface
js/modal.js         modal dialog
js/i18n.js          translations and language switching
js/format.js        number and currency formatting
js/cities.js        city parameters
js/world.js         data loading and voxel heights
js/mesh.js          chunk meshing
js/scene.js         renderer, shader, level of detail
js/camera.js        orbit and flight controls, picking
js/overlay.js       labels and minimap
js/economy.js       game rules, defects, events, scoring, save slots
js/tutorial.js      guided first game
js/goals.js         missions, collections, titles
js/cards.js         decision cards and delayed outcomes
js/rivals.js        rival investors, auctions, rumours
js/fx.js            floating numbers and building pulses
js/figures.js       SVG figures
data/*.grid.bin     city grids: building ids, roof heights, ground heights (stored as row deltas), land cover and quarters, gzip
data/*.meta.bin     building attributes, addresses, quarters, names and trees as gzip JSON
wiki/landmarks.js   landmark texts, links and photo credits
wiki/img/           landmark photos from Wikimedia Commons
```

## Data

- Zurich: Stadt Zürich Open Data (roof model LoD2, block model, cadastral survey, tree register, statistical quarters) and Statistik Stadt Zürich.
- Other cities: swisstopo swissBUILDINGS3D, swisstopo base map vector tiles, federal building register (GWR).
- Photos: Wikimedia Commons, with author and licence shown on each card.
