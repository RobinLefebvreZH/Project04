import { CITY_KEYS } from './cities.js';

export const TITLES = [
  { worth: 0 },
  { worth: 1e6, rate: 0.05 },
  { worth: 5e6, rate: 0.05 },
  { worth: 15e6, rate: 0.05 },
  { worth: 40e6, rate: 0.1 },
  { worth: 100e6, rate: 0.1 },
];

export const HIGH_STREETS = {
  zurich: 'Bahnhofstrasse',
  geneva: 'Rue du Rhône',
  lausanne: 'Rue de Bourg',
  zug: 'Bahnhofstrasse',
  lucerne: 'Weggisgasse',
  basel: 'Freie Strasse',
  bern: 'Kramgasse',
  stgallen: 'Multergasse',
  lugano: 'Via Nassa',
};

const owned = (G) => Object.values(G.owned);
const cities = (G) => new Set(owned(G).map((o) => o.city));
const onStreet = (o) => o.addr && o.addr.startsWith(`${HIGH_STREETS[o.city]} `);

export const MISSIONS = [
  { id: 'first', target: 1, reward: { cash: 25000 }, value: (G) => owned(G).length },
  { id: 'three', target: 3, reward: { cash: 50000 }, value: (G) => owned(G).length },
  { id: 'renovate', target: 1, reward: { cash: 30000 }, value: (G) => G.st.renos },
  { id: 'cities', target: 3, reward: { rate: 0.05 }, value: (G) => cities(G).size },
  { id: 'rent500', target: 500000, money: true, reward: { cash: 100000 }, value: (G, api) => annualRent(G, api) },
  { id: 'fix5', target: 5, reward: { cash: 40000 }, value: (G) => G.st.fixed },
  { id: 'extend', target: 1, reward: { rate: 0.05 }, value: (G) => G.st.extensions },
  { id: 'oldtown3', target: 3, reward: { cash: 60000 }, value: (G) => owned(G).filter((o) => o.old).length },
  { id: 'clean24', target: 24, reward: { cash: 50000 }, value: (G) => G.st.clean },
  { id: 'ten', target: 10, reward: { cash: 200000 }, value: (G) => owned(G).length },
  { id: 'rent2m', target: 2000000, money: true, reward: { cash: 250000 }, value: (G, api) => annualRent(G, api) },
  { id: 'worth20', target: 20e6, money: true, reward: { rate: 0.1 }, value: (G, api) => api.netWorth() },
];

export const COLLECTIONS = [
  {
    id: 'streets', target: CITY_KEYS.length, reward: { cash: 500000 },
    value: (G) => new Set(owned(G).filter(onStreet).map((o) => o.city)).size,
  },
  {
    id: 'oldtowns', target: 5, reward: { rate: 0.1 },
    value: (G) => new Set(owned(G).filter((o) => o.old).map((o) => o.city)).size,
  },
  { id: 'tour', target: CITY_KEYS.length, reward: { cash: 1000000 }, value: (G) => cities(G).size },
];

const ACTIVE = 3;

function annualRent(G, api) {
  return owned(G).reduce((a, o) => a + api.oRentGross(o) * 12, 0);
}

export function createGoals(api) {
  function grant(G, reward) {
    if (reward.cash) G.cash += reward.cash;
    if (reward.rate) G.rateBonus += reward.rate;
  }

  function evaluate(G) {
    const g = G.goals;
    for (const id of [...g.active]) {
      const m = MISSIONS.find((x) => x.id === id);
      if (m.value(G, api) < m.target) continue;
      g.active = g.active.filter((x) => x !== id);
      g.done.push(id);
      grant(G, m.reward);
      api.news('news.mission', { goal: { goal: `mission.${id}` } });
      api.emit('goal', { k: `mission.${id}`, reward: m.reward });
    }
    for (const m of MISSIONS) {
      if (g.active.length >= ACTIVE) break;
      if (!g.done.includes(m.id) && !g.active.includes(m.id)) g.active.push(m.id);
    }
    for (const c of COLLECTIONS) {
      if (g.collections.includes(c.id) || c.value(G, api) < c.target) continue;
      g.collections.push(c.id);
      grant(G, c.reward);
      api.news('news.collection', { goal: { goal: `collection.${c.id}` } });
      api.emit('goal', { k: `collection.${c.id}`, reward: c.reward });
    }
    const worth = api.portfolioValue();
    while (g.title < TITLES.length - 1 && worth >= TITLES[g.title + 1].worth) {
      g.title++;
      grant(G, TITLES[g.title]);
      api.news('news.title', { title: { goal: `title.${g.title}` } });
      api.emit('goal', { k: `title.${g.title}`, reward: TITLES[g.title], title: true });
    }
  }

  return {
    init(G) {
      G.goals ??= { active: [], done: [], collections: [], title: 0 };
      evaluate(G);
    },
    month: evaluate,
    changed: evaluate,
    status(G) {
      const g = G.goals;
      const next = TITLES[g.title + 1];
      return {
        title: g.title,
        next: next ? { worth: next.worth, progress: Math.min(1, api.portfolioValue() / next.worth) } : null,
        missions: g.active.map((id) => {
          const m = MISSIONS.find((x) => x.id === id);
          return { ...m, current: Math.min(m.target, m.value(G, api)) };
        }),
        done: g.done.length,
        collections: COLLECTIONS.map((c) => ({ ...c, current: Math.min(c.target, c.value(G, api)), complete: g.collections.includes(c.id) })),
      };
    },
  };
}
