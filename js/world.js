import { CITIES } from './cities.js';

export const CELL = 2;
export const BLOCK = 2;

const TRADABLE = {
  Gebaeude_Wohngebaeude: [1, 1],
  Gebaeude_Verwaltung: [0.85, 0.9],
  Gebaeude_Handel: [0.95, 1.05],
  Gebaeude_Gastgewerbe: [0.9, 0.95],
  Gebaeude_Industrie_Gewerbe: [0.55, 0.6],
  Gebaeude_Verkehr: [0.5, 0.6],
  Gebaeude_Nebengebaeude: [0.35, 0.35],
  uebriger_Gebaeudeteil: [0.7, 0.7],
  Gebaeude_Land_Forstwirtschaft_Gaertnerei: [0.4, 0.4],
};

const CHURCH_NAME = /Kirche|münster|Münster|Kapelle|Predigern|Cathédrale|Cattedrale|Kathedrale|Temple|Église|Chiesa/;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.onload = resolve;
    el.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.appendChild(el);
  });
}

async function gunzip(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export function hash2(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

export async function loadWorld(key, landmarks, onProgress = () => {}) {
  await loadScript(`data/${key}.js`);
  const raw = window.SB_CITY;
  delete window.SB_CITY;
  onProgress(0.15);
  const grid = await gunzip(raw.grid);
  const meta = JSON.parse(new TextDecoder().decode(await gunzip(raw.meta)));
  onProgress(0.3);

  const W = meta.W, H = meta.H, N = W * H;
  const base = meta.base ?? 380;
  const y0 = meta.Y0 ?? 395;
  const world = {
    key, W, H, N, base, y0,
    city: CITIES[key],
    id: new Uint16Array(grid.buffer.slice(0, N * 2)),
    roof: new Uint16Array(grid.buffer.slice(N * 2, N * 4)),
    ground: new Uint16Array(grid.buffer.slice(N * 4, N * 6)),
    cover: grid.slice(N * 6, N * 7),
    quarterGrid: grid.slice(N * 7, N * 8),
    arts: meta.art,
    rows: meta.M,
    addresses: meta.addr,
    quarters: meta.Q,
    poi: meta.names,
    trees: raw.trees || [],
    count: meta.M.length,
  };
  const nb = world.count;

  world.cells = Array.from({ length: nb }, () => []);
  for (let i = 0; i < N; i++) {
    const b = world.id[i];
    if (b) world.cells[b - 1].push(i);
  }
  world.quarterOf = new Uint8Array(nb);
  world.cx = new Float32Array(nb);
  world.cy = new Float32Array(nb);
  for (let b = 0; b < nb; b++) {
    const list = world.cells[b];
    if (!list.length) continue;
    let sx = 0, sy = 0;
    const votes = {};
    for (const i of list) {
      sx += i % W;
      sy += (i / W) | 0;
      const q = world.quarterGrid[i];
      votes[q] = (votes[q] || 0) + 1;
    }
    world.cx[b] = sx / list.length;
    world.cy[b] = sy / list.length;
    let best = 0, bestN = 0;
    for (const q in votes) if (votes[q] > bestN) { bestN = votes[q]; best = +q; }
    world.quarterOf[b] = best;
  }

  world.name = new Array(nb).fill(null);
  world.labels = [];
  const seen = new Set();
  for (const [name, x, y, bid] of world.poi) {
    if (bid > 0 && !world.name[bid - 1]) world.name[bid - 1] = name;
    if (!seen.has(name)) { seen.add(name); world.labels.push({ name, x, y, bid }); }
  }

  world.landmark = new Map();
  for (const [lkey, entry] of Object.entries(landmarks[key] || {})) {
    if (entry.bid > 0) world.landmark.set(entry.bid - 1, { key: lkey, ...entry });
  }
  onProgress(0.38);

  buildHeights(world);
  onProgress(0.45);
  return world;
}

function buildHeights(world) {
  const { W, N, count: nb, base, y0, rows, arts } = world;
  const lvl = (dm) => Math.round((dm / 10 + base - y0) / BLOCK);
  world.level = lvl;
  world.groundLevel = new Int16Array(N);
  world.top = new Int16Array(N);
  world.baseLevel = new Int16Array(N);
  world.eave = new Int16Array(N);
  world.deck = new Int16Array(N);
  world.bBase = new Int16Array(nb);
  world.bEave = new Int16Array(nb);
  world.extra = new Int16Array(nb);
  world.glass = new Uint8Array(nb);
  world.bridge = new Uint8Array(nb);
  world.church = new Uint8Array(nb);
  world.topMax = new Int16Array(nb);

  for (let i = 0; i < N; i++) world.groundLevel[i] = Math.max(1, lvl(world.ground[i]));
  for (let b = 0; b < nb; b++) {
    const [a, gdm, eaveDm, firstDm, cellCount] = rows[b];
    const art = arts[a];
    world.bBase[b] = Math.max(1, Math.round((gdm / 10 - y0) / BLOCK));
    world.bEave[b] = Math.max(1, Math.round(eaveDm / 10 / BLOCK));
    if (art === 'Bruecke_Passerelle' || art === 'Landungssteg') world.bridge[b] = 1;
    const tall = firstDm / 10 > 45 || (art === 'Gebaeude_Verwaltung' && firstDm / 10 > 32);
    world.glass[b] = tall && cellCount * CELL * CELL >= 400 && art !== 'Kirche' ? 1 : 0;
    const label = world.name[b] || '';
    if (art === 'Kirche' || CHURCH_NAME.test(label)) world.church[b] = 1;
  }
  for (let i = 0; i < N; i++) setColumn(world, i);
  for (let b = 0; b < nb; b++) updateTopMax(world, b);
}

export function setColumn(world, i) {
  const b = world.id[i] - 1;
  const g = world.groundLevel[i];
  world.deck[i] = 0;
  if (b >= 0 && world.bridge[b]) {
    const d = world.level(world.roof[i] & 0x7fff);
    world.top[i] = d > g + 1 ? g : Math.max(g, d);
    world.baseLevel[i] = g;
    world.eave[i] = g;
    if (d > g + 1) world.deck[i] = d;
    return;
  }
  if (b >= 0) {
    const base = world.bBase[b];
    const t = Math.max(base + 1, world.level(world.roof[i] & 0x7fff) + world.extra[b]);
    world.top[i] = t;
    world.baseLevel[i] = base;
    world.eave[i] = world.roof[i] >> 15 ? Math.min(t, base + world.bEave[b] + world.extra[b]) : t;
    return;
  }
  world.top[i] = g;
  world.baseLevel[i] = g;
  world.eave[i] = g;
}

export function updateTopMax(world, b) {
  let m = 0;
  for (const i of world.cells[b]) if (world.top[i] > m) m = world.top[i];
  world.topMax[b] = m;
}

export function artOf(world, b) {
  return world.arts[world.rows[b][0]];
}

export function tradeFactors(world, b) {
  return TRADABLE[artOf(world, b)] || null;
}

export function buildYear(world, b) {
  return world.rows[b][5] || 0;
}

export function cellAt(world, wx, wz) {
  const x = Math.floor(wx / CELL), y = Math.floor(wz / CELL);
  if (x < 0 || y < 0 || x >= world.W || y >= world.H) return -1;
  return y * world.W + x;
}

export function groundAt(world, wx, wz) {
  const i = cellAt(world, wx, wz);
  return i < 0 ? 10 : world.groundLevel[i] * BLOCK;
}

export function surfaceAt(world, wx, wz) {
  const i = cellAt(world, wx, wz);
  return i < 0 ? 10 : Math.max(world.top[i], world.deck[i]) * BLOCK;
}

export function maxSurfaceAround(world, wx, wz, r) {
  let m = 10;
  const x0 = Math.floor(wx / CELL), y0 = Math.floor(wz / CELL);
  for (let y = y0 - r; y <= y0 + r; y++) {
    for (let x = x0 - r; x <= x0 + r; x++) {
      if (x < 0 || y < 0 || x >= world.W || y >= world.H) continue;
      const i = y * world.W + x;
      const v = Math.max(world.top[i], world.deck[i]) * BLOCK;
      if (v > m) m = v;
    }
  }
  return m;
}

export function cityCenter(world) {
  const hit = world.labels.find((l) => world.city.start.test(l.name));
  return hit ? [hit.x, hit.y] : [world.W / 2, world.H / 2];
}
