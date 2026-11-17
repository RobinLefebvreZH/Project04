# Swiss Blocks - Voxel Real Estate Tycoon

A browser game: buy, renovate and add storeys to real buildings in nine Swiss city centres
(Zürich, Genève, Lausanne, Zug, Luzern, Basel, Bern, St. Gallen, Lugano), rendered as 2 m voxels.

Open `index.html` through any static web server (e.g. `python3 -m http.server`) and pick a city
from the drop-down, or append `#geneva`, `#bern`, … to the URL.

## Data
- Zürich: Stadt Zürich Open Data (Dachmodell LoD2, Blockmodell, Amtliche Vermessung, Baumkataster,
  Statistische Quartiere); Statistik Stadt Zürich (condo prices 2023–25, rent survey 2026).
- Other cities: swisstopo swissBUILDINGS3D (3D Tiles), swisstopo base map vector tiles,
  BFS building register (GWR) addresses. Prices: neho.ch city averages 2026; rents: cantonal asking rents.
- Economic rules (mortgage rate, taxes, construction costs, events) are simplified game assumptions.
