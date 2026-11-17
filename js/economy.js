import { CITIES } from './cities.js';
import { CELL, BLOCK, hash2, artOf, tradeFactors, buildYear, cityCenter } from './world.js';

export const SEASON = 120;
const SAVE_KEY = 'swissblocks.game.v7';
const BOARD_KEY = 'swissblocks.board.v7';
const START = { month: 10, year: 2026 };

const rnd = Math.random;
function gauss() {
  let u = 0, v = 0;
  while (!u) u = rnd();
  while (!v) v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
const money = (n) => ({ chf: n });

export const PROFILES = {
  banker: { cash: 450000, living: 7500, salary: 18500 },
  entrepreneur: { cash: 700000, living: 8500, salary: 24000 },
  heir: { cash: 7000000, living: 12000, salary: 0 },
};

export const MAINTENANCE = {
  low: { rate: 0.006, decay: 0.0028, risk: 1.6 },
  normal: { rate: 0.010, decay: 0.0012, risk: 1 },
  high: { rate: 0.015, decay: -0.0004, risk: 0.55 },
};

export const AUTO_REPAIR_LEVELS = [0, 10000, 25000, 50000, 100000];

const DEFECTS = [
  { type: 'leak', weight: 30, insured: true, penalty: 0.03, cost: (o) => o.area * (15 + rnd() * 45) },
  { type: 'heat', weight: 16, insured: false, penalty: 0.20, urgent: true, cost: (o) => 18000 + Math.sqrt(o.area) * (400 + rnd() * 900) },
  { type: 'roof', weight: 12, insured: false, penalty: 0.05, cost: (o) => o.foot * (80 + rnd() * 170) },
  { type: 'facade', weight: 10, insured: false, penalty: 0.04, cost: (o) => o.foot * (120 + rnd() * 300) },
  { type: 'mould', weight: 12, insured: true, penalty: 0.10, cost: (o) => o.area * (5 + rnd() * 15) },
  { type: 'lift', weight: 6, insured: false, penalty: 0.06, cost: (o) => (o.floors >= 4 ? 60000 + rnd() * 90000 : 0) },
  { type: 'tenant', weight: 12, oneOff: true, cost: (o) => o.grossRent * (0.15 + rnd() * 0.35) },
  { type: 'fire', weight: 1.2, insured: 'mandatory', penalty: 0.6, cost: (o) => o.value * (0.05 + rnd() * 0.15) },
];
const DEFECT_BY_TYPE = Object.fromEntries(DEFECTS.map((d) => [d.type, d]));
const DEFECT_WEIGHT = DEFECTS.reduce((a, d) => a + d.weight, 0);

const CITY_EVENTS = {
  zurich: [['zurich4', ['41', '42', '44'], 1.05, 1.02], ['zurich5', ['51', '52'], 1.045, 0], ['zurich1', ['11', '12', '13', '14'], 1.03, 1.03]],
  geneva: [['geneva', null, 1.03, 1.01]],
  lausanne: [['lausanne', null, 1.03, 0]],
  zug: [['zug', null, 1.04, 1.02]],
  lucerne: [['lucerne', null, 1.025, 1.01]],
  basel: [['basel', null, 1.03, 0]],
  bern: [['bern', null, 1.02, 1.01]],
  stgallen: [['stgallen', null, 1.025, 0]],
  lugano: [['luganoDown', null, 0.97, 0], ['luganoUp', null, 1.03, 0]],
};

function store(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getBoard() {
  try {
    return JSON.parse(localStorage.getItem(BOARD_KEY)) || [];
  } catch {
    return [];
  }
}

export function savedGame() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    return s && s.v === 7 && !s.ended ? { city: s.city || 'zurich', t: s.t } : null;
  } catch {
    return null;
  }
}

export function createEconomy(emit) {
  let G = null;
  let world = null;
  let oldTown = () => false;

  const indexKey = (city, q) => `${city}:${q}`;
  const priceIndex = (city, q) => G.idx[indexKey(city, q)] ?? G.allIdx;
  const rentIndex = (city, q) => G.ridx[indexKey(city, q)] ?? G.allR;
  const ownKey = (b) => `${world.key}:${b}`;

  function news(k, p = {}) {
    G.news.push({ k, p, m: G.month, y: G.year });
    if (G.news.length > 80) G.news.shift();
    emit('news');
  }
  const toast = (k, p = {}, tone = '') => emit('toast', { k, p, tone });

  function newGame(profile) {
    const P = PROFILES[profile] || PROFILES.banker;
    G = {
      v: 7, profile, month: START.month, year: START.year, t: 0, cash: P.cash, rate: 1.65, speed: 0,
      owned: {}, news: [], idx: {}, ridx: {}, allIdx: 1, allR: 1, negative: 0, hist: [], extra: {},
      cpi: 1, costIdx: 1, vac: 0.015, vacT: 0, incHist: [], lastInc: 0, lastFlow: 0, defects: [], did: 0,
      set: { maint: 'normal', ins: true, auto: 25000 },
      st: { noi: [], startNW: P.cash, peak: P.cash, maxDD: 0, ltvSum: 0, ltvN: 0, negM: 0, fixed: 0, fixDelay: 0, permOk: 0, permFail: 0, defects: 0 },
      ended: false,
    };
    news('news.start', { profile, cash: money(P.cash) });
    save();
  }

  function save() {
    if (!G) return;
    if (world) G.extra[world.key] = Object.fromEntries([...world.extra.entries()].filter((e) => e[1]));
    store(SAVE_KEY, G);
  }

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (!s || s.v !== 7) return false;
      G = s;
      G.speed = 0;
      return true;
    } catch {
      return false;
    }
  }

  function attachWorld(w) {
    world = w;
    if (G) G.city = w.key;
    const [cx, cy] = cityCenter(w);
    oldTown = w.key === 'zurich'
      ? (b) => ['11', '13'].includes(String(w.quarterOf[b]))
      : (b) => Math.hypot(w.cx[b] - cx, w.cy[b] - cy) * CELL < 450;
    const extra = G?.extra[w.key] || {};
    const changed = [];
    for (const [b, v] of Object.entries(extra)) {
      w.extra[+b] = v;
      changed.push(+b);
    }
    ensureIndices();
    return changed;
  }

  function ensureIndices() {
    if (!G) return;
    const keys = world ? Object.keys(world.quarters).map((q) => indexKey(world.key, q)) : [];
    for (const k in G.owned) keys.push(indexKey(G.owned[k].city, G.owned[k].q));
    for (const k of keys) {
      if (G.idx[k] === undefined) {
        G.idx[k] = G.allIdx;
        G.ridx[k] = G.allR;
      }
    }
  }

  function bump(city, quarters, f, rf) {
    const keys = quarters ? quarters.map((q) => indexKey(city, q)) : Object.keys(G.idx).filter((k) => k.startsWith(`${city}:`));
    for (const k of keys) {
      G.idx[k] = (G.idx[k] ?? G.allIdx) * f;
      if (rf) G.ridx[k] = (G.ridx[k] ?? G.allR) * rf;
    }
  }

  function cityIndex(city) {
    const keys = Object.keys(G.idx).filter((k) => k.startsWith(`${city}:`));
    return keys.length ? keys.reduce((a, k) => a + G.idx[k], 0) / keys.length : G.allIdx;
  }

  const quarterId = (b) => String(world.quarterOf[b]);
  function quarter(b) {
    const q = world.quarters[quarterId(b)];
    const c = world.city;
    return q ? { name: q[0], district: q[1], price: q[2], rent: q[3], source: q[4] } : { name: null, district: 0, price: c.price, rent: c.rent, source: 'c' };
  }
  const footprint = (b) => world.cells[b].length * CELL * CELL;
  const floors = (b) => Math.max(1, Math.round((world.rows[b][2] / 10 + world.extra[b] * BLOCK) / 3.1));
  const area = (b) => Math.round(footprint(b) * floors(b) * 0.8);
  const priceM2 = (b) => quarter(b).price * priceIndex(world.key, quarterId(b));
  const rentM2 = (b) => quarter(b).rent * rentIndex(world.key, quarterId(b));
  const owned = (b) => G.owned[ownKey(b)];
  const factors = (b) => tradeFactors(world, b) || [0, 0];
  function age(b) {
    const y = buildYear(world, b);
    return y > 1800 ? START.year - y : 60 + ((b * 37) % 60);
  }
  function value(b) {
    const o = owned(b);
    return area(b) * priceM2(b) * factors(b)[0] * (0.85 + 0.15 * (o ? o.cond : 1));
  }
  function rent(b) {
    const o = owned(b);
    return area(b) * rentM2(b) * factors(b)[1] * (0.8 + 0.2 * (o ? o.cond : 1));
  }
  const buyable = (b) => !!tradeFactors(world, b) && !world.name[b] && !world.landmark.has(b) && area(b) >= 40;
  const askPrice = (b) => value(b) * (1.04 + hash2(b, G.year * 12 + G.month) * 0.06);

  const oValue = (o) => o.area * o.pm2 * priceIndex(o.city, o.q) * o.vf * (0.85 + 0.15 * o.cond);
  const oRentGross = (o) => o.area * o.rent * rentIndex(o.city, o.q) * o.rf * (0.8 + 0.2 * o.cond);
  function penalty(k) {
    let p = 0;
    for (const d of G.defects) if (d.k === k) p += d.pen;
    return Math.min(0.8, p);
  }
  const oRent = (o, k) => oRentGross(o) * (o.proj ? o.proj.rentF : 1) * (1 - G.vac) * (1 - penalty(k));
  const oOpex = (o) => (oValue(o) * (MAINTENANCE[G.set.maint].rate + 0.0005 + (G.set.ins ? 0.0004 : 0)) / 12) * G.costIdx;
  const oFlow = (o, k) => oRent(o, k) - (o.debt * G.rate) / 100 / 12 - oOpex(o);

  const sum = (fn) => Object.entries(G.owned).reduce((a, [k, o]) => a + fn(o, k), 0);
  const debt = () => sum((o) => o.debt);
  const portfolioValue = () => sum(oValue);
  const netWorth = () => G.cash + portfolioValue() - debt();
  const living = () => PROFILES[G.profile].living * G.cpi;
  const monthlyFlow = () => (G.t ? G.lastFlow : sum(oFlow) + G.lastInc - living());

  function income() {
    if (G.profile === 'banker') return PROFILES.banker.salary * Math.pow(1.0017, G.t);
    if (G.profile === 'entrepreneur') {
      if (rnd() < 0.12) return 0;
      if (rnd() < 0.012) {
        const x = 400000 + rnd() * 1600000;
        news('news.exit', { amount: money(x) });
        toast('toast.exit', { amount: money(x) }, 'pos');
        return x;
      }
      return Math.max(0, PROFILES.entrepreneur.salary * Math.exp(gauss() * 0.55 - 0.15));
    }
    return 0;
  }

  function bankIncome() {
    if (G.profile === 'banker') return PROFILES.banker.salary * Math.pow(1.0017, G.t) * 12 * 1.25;
    if (G.profile === 'entrepreneur') {
      const h = G.incHist.slice(-24);
      const avg = h.length ? h.reduce((a, x) => a + Math.min(x, 60000), 0) / h.length : 15000;
      return avg * 12 * 1.25 * 0.6;
    }
    return 0;
  }

  function affordableDebt(extraValue, extraRentYear) {
    const inc = bankIncome() + 0.8 * (sum(oRentGross) * 12 + extraRentYear);
    return Math.max(0, (inc / 3 - 0.01 * (portfolioValue() + extraValue)) / 0.05);
  }
  const maxLoan = (price, rentYear) => Math.max(0, Math.min(price * 0.8, affordableDebt(price, rentYear) - debt()));
  const bankHeadroom = () => Math.max(0, affordableDebt(0, 0) - debt());

  function neighbourHeight(b) {
    let s = 0, n = 0;
    const { W, H, id, top, baseLevel } = world;
    for (const i of world.cells[b]) {
      const x = i % W, y = (i / W) | 0;
      for (const [dx, dy] of [[12, 0], [-12, 0], [0, 12], [0, -12]]) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        const j = yy * W + xx;
        if (id[j] && id[j] - 1 !== b) { s += top[j] - baseLevel[j]; n++; }
      }
    }
    return n ? s / n : 2;
  }
  function permitChance(b) {
    let p = oldTown(b) ? 0.15 : 0.62;
    const current = world.topMax[b] - world.bBase[b], nh = neighbourHeight(b);
    if (current + 2 > nh * 1.5) p *= 0.5;
    if (current + 2 > nh * 2.2) p *= 0.4;
    if (world.extra[b] >= 4) p *= 0.5;
    return Math.max(0.03, Math.min(0.85, p));
  }
  const extensionCost = (b) => (footprint(b) * 5600 + 25000) * G.costIdx;
  const renovationCost = (b) => area(b) * 850 * G.costIdx;
  const label = (b) => world.name[b] || world.addresses[b] || null;

  function snapshot(b) {
    const q = quarter(b), f = factors(b);
    return {
      city: world.key, b, label: label(b), q: quarterId(b), qn: q.name, area: area(b), floors: floors(b),
      foot: footprint(b), age: age(b), pm2: q.price, rent: q.rent, vf: f[0], rf: f[1],
    };
  }

  function buy(b, ltv) {
    const price = askPrice(b), fees = price * 0.005, limit = maxLoan(price, rent(b) * 12);
    const loan = Math.min(price * ltv, limit), need = price - loan + fees;
    if (G.cash < need) return toast('toast.noEquity', { need: money(need), max: money(limit) }, 'neg');
    G.cash -= need;
    G.owned[ownKey(b)] = { ...snapshot(b), debt: loan, paid: price, since: G.t, cond: 0.9 + hash2(b, 1) * 0.15, proj: null };
    news('news.bought', { city: { city: world.key }, name: { building: [world.key, b, label(b)] }, price: money(price), loan: money(loan) });
    toast('toast.bought', { name: { building: [world.key, b, label(b)] } }, 'pos');
    emit('state', b);
    changed(b);
  }

  function sell(k) {
    const o = G.owned[k];
    if (!o) return;
    if (o.proj) return toast('toast.busy', {}, 'neg');
    const v = oValue(o) * (1 - 0.25 * penalty(k)), broker = v * 0.02, held = G.t - o.since, gain = v - o.paid - broker;
    const taxRate = held < 12 ? 0.4 : held < 24 ? 0.32 : held < 60 ? 0.24 : 0.15;
    const tax = Math.max(0, gain * taxRate);
    G.cash += v - broker - tax - o.debt;
    delete G.owned[k];
    G.defects = G.defects.filter((d) => d.k !== k);
    news(tax > 0 ? 'news.soldTax' : 'news.sold', { city: { city: o.city }, name: { building: [o.city, o.b, o.label] }, price: money(v), tax: money(tax) });
    toast('toast.sold', { net: money(v - broker - tax - o.debt) }, gain >= 0 ? 'pos' : 'neg');
    if (o.city === world.key) emit('state', o.b);
    changed(o.city === world.key ? o.b : -1);
  }

  function renovate(b) {
    const o = owned(b), c = renovationCost(b);
    if (G.cash < c) return toast('toast.noCash', {}, 'neg');
    G.cash -= c;
    o.proj = { type: 'reno', left: 3, rentF: 0.5 };
    G.defects = G.defects.filter((d) => d.k !== ownKey(b) || d.type === 'fire');
    news('news.renoStart', { name: { building: [world.key, b, label(b)] }, cost: money(c) });
    emit('state', b);
    changed(b);
  }

  function extend(b) {
    const o = owned(b), fee = 25000;
    if (G.cash < fee) return toast('toast.noCash', {}, 'neg');
    G.cash -= fee;
    o.proj = { type: 'permit', left: 2, rentF: 1, p: permitChance(b), cost: extensionCost(b) };
    news('news.permitFiled', { name: { building: [world.key, b, label(b)] } });
    emit('state', b);
    changed(b);
  }

  function refinance(k, amount) {
    const o = G.owned[k];
    let max = oValue(o) * 0.8;
    if (amount > 0) max = Math.min(max, o.debt + bankHeadroom());
    const next = Math.max(0, Math.min(max, o.debt + amount));
    const delta = next - o.debt;
    if (amount > 0 && delta <= 0) return toast('toast.bankNo', {}, 'neg');
    if (G.cash + delta < 0) return toast('toast.noCash', {}, 'neg');
    G.cash += delta;
    o.debt = next;
    changed(o.city === world.key ? o.b : -1);
  }

  function insuranceShare(type) {
    const d = DEFECT_BY_TYPE[type];
    if (d.insured === 'mandatory') return 0.9;
    return d.insured && G.set.ins ? 1 : 0;
  }
  function defectCost(d) {
    const share = insuranceShare(d.type);
    return Math.max(share ? 2000 : 0, d.cost * (1 - share)) * (d.esc || 1);
  }

  function repair(id, auto) {
    const d = G.defects.find((x) => x.id === id);
    if (!d) return false;
    const c = defectCost(d);
    if (G.cash < c) {
      if (!auto) toast('toast.noCash', {}, 'neg');
      return false;
    }
    G.cash -= c;
    G.defects = G.defects.filter((x) => x.id !== id);
    G.st.fixed++;
    G.st.fixDelay += G.t - d.since;
    const o = G.owned[d.k];
    if (o) o.cond = Math.min(1.15, o.cond + 0.01);
    news(auto ? 'news.autoFixed' : 'news.fixed', { defect: { defect: d.type }, name: o ? { building: [o.city, o.b, o.label] } : '', cost: money(c) });
    if (!auto) changed(-1);
    return true;
  }

  function repairAll() {
    for (const d of [...G.defects].sort((a, b) => a.since - b.since)) repair(d.id, true);
    changed(-1);
  }

  function rollDefects() {
    const M = MAINTENANCE[G.set.maint];
    for (const k in G.owned) {
      const o = G.owned[k];
      if (o.proj && o.proj.type === 'reno') continue;
      const ageFactor = 0.6 + Math.min(1.4, (o.age || 60) / 80);
      if (rnd() > 0.022 * ageFactor * (1.65 - Math.min(1.15, o.cond)) * M.risk) continue;
      let r = rnd() * DEFECT_WEIGHT, D = DEFECTS[0];
      for (const d of DEFECTS) {
        r -= d.weight;
        if (r <= 0) { D = d; break; }
      }
      const c = D.cost({ ...o, grossRent: oRentGross(o), value: oValue(o) }) * G.costIdx;
      if (c <= 0) continue;
      G.st.defects++;
      const name = { building: [o.city, o.b, o.label] };
      if (D.oneOff) {
        G.cash -= c;
        news('news.rentLoss', { name, cost: money(c) });
        continue;
      }
      const d = { id: ++G.did, k, type: D.type, cost: c, pen: D.penalty, since: G.t, esc: 1 };
      G.defects.push(d);
      const net = defectCost(d);
      if (D.type === 'fire') toast('toast.fire', { name }, 'neg');
      if (net <= G.set.auto && G.cash > net) repair(d.id, true);
      else news(D.urgent ? 'news.defectUrgent' : insuranceShare(D.type) ? 'news.defectInsured' : 'news.defect', { defect: { defect: D.type }, name, cost: money(net) });
    }
  }

  function ageDefects() {
    for (const d of G.defects) {
      const months = G.t - d.since;
      const o = G.owned[d.k];
      if (o) o.cond = Math.max(0.5, o.cond - 0.004);
      if (months > 0 && months % 6 === 0) {
        d.esc *= 1.25;
        d.pen = Math.min(0.5, d.pen * 1.2);
        news('news.defectAging', { defect: { defect: d.type }, name: o ? { building: [o.city, o.b, o.label] } : '', months });
      }
    }
  }

  const scaleAll = (f) => {
    for (const k in G.idx) G.idx[k] *= f;
    G.allIdx *= f;
  };
  const EVENTS = [
    { p: 0.03, run() { G.rate = Math.max(0.6, G.rate - 0.25); scaleAll(1.02); return ['event.snbCut']; } },
    { p: 0.025, run() { G.rate = Math.min(4.5, G.rate + 0.3); scaleAll(0.975); return ['event.rateShock']; } },
    { p: 0.02, run() { G.cpi *= 1.02; G.costIdx *= 1.04; G.rate = Math.min(4.5, G.rate + 0.15); return ['event.inflation']; } },
    { p: 0.015, run() { G.vac = Math.min(0.12, G.vac + 0.035); G.vacT = 12; scaleAll(0.97); return ['event.recession']; } },
    {
      p: 0.07,
      run() {
        const cities = Object.keys(CITY_EVENTS);
        const c = cities[(rnd() * cities.length) | 0];
        const list = CITY_EVENTS[c];
        const [key, quarters, f, rf] = list[(rnd() * list.length) | 0];
        bump(c, quarters, f, rf);
        return [`event.city.${key}`, { city: { city: c } }];
      },
    },
    { p: 0.025, run() { for (const k in G.ridx) G.ridx[k] *= 1.015; G.allR *= 1.015; return ['event.referenceRate']; } },
    { p: 0.02, run() { G.costIdx *= 1.05; return ['event.construction']; } },
  ];

  function finishProject(k) {
    const o = G.owned[k], p = o.proj, here = o.city === world.key;
    const name = { building: [o.city, o.b, o.label] };
    if (p.type === 'reno') {
      o.cond = 1.15;
      o.proj = null;
      news('news.renoDone', { name });
      toast('toast.renoDone', { name }, 'pos');
    } else if (p.type === 'permit') {
      if (rnd() < p.p) {
        o.proj = { type: 'build', left: 8, rentF: 0.7, cost: p.cost };
        G.cash -= p.cost;
        G.st.permOk++;
        news('news.permitOk', { name, cost: money(p.cost) });
        toast('toast.permitOk', { name }, 'pos');
      } else {
        o.proj = null;
        G.st.permFail++;
        news('news.permitNo', { name });
        toast('toast.permitNo', { name }, 'neg');
      }
    } else if (p.type === 'build') {
      o.proj = null;
      const ex = (G.extra[o.city] = G.extra[o.city] || {});
      ex[o.b] = (ex[o.b] || 0) + 2;
      const fl = o.floors || 3;
      o.area = Math.round((o.area * (fl + 1)) / fl);
      o.floors = fl + 1;
      if (here) {
        world.extra[o.b] = ex[o.b];
        emit('rebuild', o.b);
        o.area = area(o.b);
        o.floors = floors(o.b);
      }
      news('news.extended', { name });
      toast('toast.extended', { name }, 'pos');
    }
    if (here) emit('state', o.b);
  }

  function month() {
    if (G.ended) return;
    G.month++;
    G.t++;
    if (G.month > 11) { G.month = 0; G.year++; }
    ensureIndices();
    for (const k in G.idx) {
      const g = CITIES[k.split(':')[0]]?.growth ?? 0.0028;
      G.idx[k] *= 1 + g + (rnd() - 0.5) * 0.012;
      G.ridx[k] *= 1 + 0.0012 + (rnd() - 0.5) * 0.004;
    }
    G.allIdx *= 1.0028;
    G.allR *= 1.0012;
    const inflation = 0.0006 + gauss() * 0.0008;
    G.cpi *= 1 + inflation;
    G.costIdx *= 1 + inflation * 1.3;
    if (G.vacT > 0) {
      G.vacT--;
      if (!G.vacT) G.vac = 0.015;
    } else G.vac = Math.max(0.008, Math.min(0.03, G.vac + gauss() * 0.002));

    G.lastInc = income();
    G.incHist.push(G.lastInc);
    if (G.incHist.length > 36) G.incHist.shift();
    let rents = 0, opex = 0, interest = 0;
    for (const k in G.owned) {
      const o = G.owned[k];
      rents += oRent(o, k);
      opex += oOpex(o);
      interest += (o.debt * G.rate) / 100 / 12;
    }
    G.lastFlow = rents - opex - interest + G.lastInc - living();
    G.cash += G.lastFlow;
    G.st.noi.push(rents - opex);
    if (G.st.noi.length > 12) G.st.noi.shift();

    for (const k in G.owned) {
      const o = G.owned[k];
      o.cond = Math.max(0.5, Math.min(1.15, o.cond - MAINTENANCE[G.set.maint].decay));
      if (o.proj && --o.proj.left <= 0) finishProject(k);
    }
    ageDefects();
    rollDefects();
    for (const ev of EVENTS) {
      if (rnd() < ev.p) {
        const [k, p] = ev.run();
        news(k, p);
        toast(k, p);
        break;
      }
    }

    if (G.cash < 0) {
      G.negative++;
      G.st.negM++;
      if (G.negative === 1) toast('toast.overdrawn', {}, 'neg');
      if (G.negative >= 3) {
        const keys = Object.keys(G.owned).filter((k) => !G.owned[k].proj);
        if (keys.length) {
          const k = keys.sort((a, b) => oValue(G.owned[a]) - oValue(G.owned[b]))[0];
          const o = G.owned[k];
          const v = oValue(o) * 0.88;
          G.cash += v - o.debt;
          delete G.owned[k];
          G.defects = G.defects.filter((d) => d.k !== k);
          if (o.city === world.key) emit('state', o.b);
          news('news.foreclosure', { name: { building: [o.city, o.b, o.label] }, price: money(v) });
          toast('toast.foreclosure', { name: { building: [o.city, o.b, o.label] } }, 'neg');
        }
        G.negative = 0;
      }
    } else G.negative = 0;

    const nw = netWorth(), pv = portfolioValue();
    G.st.peak = Math.max(G.st.peak, nw);
    G.st.maxDD = Math.max(G.st.maxDD, (G.st.peak - nw) / Math.max(1, G.st.peak));
    if (pv > 0) { G.st.ltvSum += debt() / pv; G.st.ltvN++; }
    G.hist.push(Math.round(nw));
    if (G.hist.length > SEASON + 1) G.hist.shift();
    emit('heat');
    if (G.t >= SEASON) endSeason();
    changed(-1);
  }

  function scores() {
    const st = G.st, years = Math.max(1 / 12, G.t / 12), nw = netWorth();
    const aum = portfolioValue();
    const rev = st.noi.length ? (st.noi.reduce((a, b) => a + b, 0) * 12) / st.noi.length : 0;
    const cagr = nw > 0 && st.startNW > 0 ? Math.pow(nw / st.startNW, 1 / years) - 1 : -1;
    const ret = Math.max(0, Math.min(30, (cagr / 0.15) * 30));
    const risk = 25 * (1 - Math.min(1, st.maxDD / 0.3));
    const ltv = st.ltvN ? st.ltvSum / st.ltvN : 0;
    const lev = st.ltvN ? 15 * Math.max(0, Math.min(1, (0.85 - ltv) / 0.25)) : 7.5;
    const avgFix = st.fixed ? st.fixDelay / st.fixed : 0;
    const ops = st.defects ? Math.max(0, 15 - avgFix * 2.5 - G.defects.length * 1.5) : 15;
    const liq = Math.max(0, 15 - st.negM * 3);
    return {
      aum, rev, exec: Math.round(ret + risk + lev + ops + liq),
      parts: [
        ['score.return', { v: { fixed: [cagr * 100, 1] } }, ret, 30],
        ['score.risk', { v: { fixed: [st.maxDD * 100, 0] } }, risk, 25],
        ['score.leverage', { v: { fixed: [ltv * 100, 0] } }, lev, 15],
        ['score.ops', { v: { fixed: [avgFix, 1] } }, ops, 15],
        ['score.liquidity', { v: st.negM }, liq, 15],
      ],
    };
  }

  function endSeason() {
    const s = scores();
    G.ended = true;
    G.speed = 0;
    const entry = { d: new Date().toISOString().slice(0, 10), p: G.profile, aum: Math.round(s.aum), rev: Math.round(s.rev), exec: s.exec, nw: Math.round(netWorth()), m: G.t };
    store(BOARD_KEY, [...getBoard(), entry].slice(-100));
    emit('season', entry);
  }

  function changed(b) {
    save();
    emit('change', b);
  }

  return {
    get state() { return G; },
    get world() { return world; },
    newGame, load, save, attachWorld, month, endSeason, scores,
    buy, sell, renovate, extend, refinance, repair, repairAll,
    setSpeed(s) { G.speed = G.ended ? 0 : s; },
    setMaintenance(m) { G.set.maint = m; changed(-1); },
    setInsurance(on) { G.set.ins = on; changed(-1); },
    setAutoRepair(v) { G.set.auto = v; changed(-1); },
    quarter, quarterId, footprint, floors, area, age, priceM2, rentM2, value, rent, owned, ownKey,
    buyable, askPrice, maxLoan, bankHeadroom, permitChance, extensionCost, renovationCost, oldTown: (b) => oldTown(b),
    oValue, oFlow, defectCost, insuranceShare, debt, portfolioValue, netWorth, living, monthlyFlow, cityIndex,
    priceIndex, rentIndex,
    heatValue(b) {
      const [lo, hi] = world.city.heat;
      return Math.max(0, Math.min(255, ((priceM2(b) - lo) / (hi - lo)) * 255));
    },
    traded: (b) => !!tradeFactors(world, b),
    art: (b) => artOf(world, b),
  };
}
