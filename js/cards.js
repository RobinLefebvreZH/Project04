import { t } from './i18n.js';
import { escapeHtml as esc } from './format.js';
import { openModal, closeModal, modalOpen } from './modal.js';

const rnd = Math.random;
const pick = (list) => list[(rnd() * list.length) | 0];
const money = (n) => ({ chf: n });

function ownedEntries(G, filter = () => true) {
  return Object.entries(G.owned).filter(([, o]) => !o.proj && filter(o));
}

function building(o) {
  return { building: [o.city, o.b, o.label] };
}

const CARDS = [
  {
    id: 'airbnb',
    find: (G) => ownedEntries(G, (o) => o.vf === 1 && !(o.boost && G.t < o.boost.until)),
    options: [
      {
        k: 'accept',
        apply(G, api, key) {
          G.owned[key].boost = { f: 1.25, until: G.t + 24 };
          if (rnd() < 0.35) G.pending.push({ at: G.t + 6 + ((rnd() * 12) | 0), id: 'airbnbComplaint', key });
        },
      },
      { k: 'decline' },
    ],
  },
  {
    id: 'solar',
    find: (G) => ownedEntries(G, (o) => !o.green),
    cost: (G, o) => o.foot * 420 * G.costIdx * 0.7,
    options: [
      {
        k: 'install',
        apply(G, api, key, card) {
          const o = G.owned[key];
          G.cash -= card.cost(G, o);
          o.green = true;
        },
      },
      { k: 'skip' },
    ],
  },
  {
    id: 'dispute',
    find: (G) => ownedEntries(G),
    options: [
      { k: 'settle', apply(G, api, key) { G.cash -= api.oRentGross(G.owned[key]); } },
      { k: 'court', apply(G, api, key) { G.pending.push({ at: G.t + 4, id: 'court', key, rent: api.oRentGross(G.owned[key]) }); } },
    ],
  },
  {
    id: 'distressed',
    find(G, api) {
      const w = api.world;
      const list = [];
      for (let i = 0; i < 400 && list.length < 1; i++) {
        const b = (rnd() * w.count) | 0;
        if (!api.buyable(b) || api.owned(b)) continue;
        const v = api.value(b);
        if (v > 1.5e6 && v < 15e6) list.push([`${w.key}:${b}`, { city: w.key, b, label: api.label(b), price: v * 0.82 }]);
      }
      return list;
    },
    options: [
      { k: 'buy', apply(G, api, key, card, ctx) { api.buy(ctx.b, 0.8, { price: ctx.price, cond: 0.62 }); } },
      { k: 'pass' },
    ],
  },
  {
    id: 'fixRate',
    find: (G) => (!(G.fixed && G.t < G.fixed.until) && Object.values(G.owned).some((o) => o.debt > 0) ? [['', {}]] : []),
    options: [
      { k: 'fix', apply(G) { G.fixed = { rate: G.rate + 0.3, until: G.t + 60 }; } },
      { k: 'variable' },
    ],
  },
  {
    id: 'retrofit',
    find: (G) => ownedEntries(G, (o) => o.age > 50 && !o.green && !o.retrofit),
    cost: (G, o) => o.area * 180 * G.costIdx,
    options: [
      {
        k: 'now',
        apply(G, api, key, card) {
          const o = G.owned[key];
          G.cash -= card.cost(G, o);
          o.cond = Math.min(1.15, o.cond + 0.05);
          o.retrofit = true;
        },
      },
      {
        k: 'later',
        apply(G, api, key, card) {
          G.owned[key].retrofit = true;
          G.pending.push({ at: G.t + 24, id: 'retrofitForced', key, cost: card.cost(G, G.owned[key]) * 1.5 });
        },
      },
    ],
  },
  {
    id: 'film',
    find: (G) => ownedEntries(G),
    options: [
      {
        k: 'accept',
        apply(G, api, key) {
          G.cash += 20000;
          if (rnd() < 0.2) G.pending.push({ at: G.t + 1, id: 'filmDamage', key });
        },
      },
      { k: 'decline' },
    ],
  },
];

const OUTCOMES = {
  airbnbComplaint(G, api, p, o) {
    G.cash -= 15000;
    o.boost = null;
    return ['outcome.airbnbComplaint', { name: building(o), cost: money(15000) }, 'neg'];
  },
  court(G, api, p, o) {
    if (rnd() < 0.6) return ['outcome.courtWon', { name: building(o) }, 'pos'];
    const cost = p.rent * 3 + 8000;
    G.cash -= cost;
    return ['outcome.courtLost', { name: building(o), cost: money(cost) }, 'neg'];
  },
  retrofitForced(G, api, p, o) {
    G.cash -= p.cost;
    o.green = true;
    return ['outcome.retrofitForced', { name: building(o), cost: money(p.cost) }, 'neg'];
  },
  filmDamage(G, api, p, o) {
    G.cash -= 12000;
    return ['outcome.filmDamage', { name: building(o), cost: money(12000) }, 'neg'];
  },
};

export function createCards(api, host) {
  function settle(G) {
    const due = G.pending.filter((p) => p.at <= G.t);
    G.pending = G.pending.filter((p) => p.at > G.t);
    for (const p of due) {
      const o = G.owned[p.key];
      if (!o) continue;
      const [k, params, tone] = OUTCOMES[p.id](G, api, p, o);
      api.news(k, params);
      api.toast(k, params, tone);
    }
  }

  function describe(card, G, key, ctx) {
    const o = G.owned[key] || ctx;
    const params = { name: o?.label !== undefined ? building(o) : '' };
    if (card.cost && G.owned[key]) params.cost = money(card.cost(G, G.owned[key]));
    if (ctx?.price) params.price = money(ctx.price);
    if (card.id === 'fixRate') params.rate = { fixed: [G.rate + 0.3, 2] };
    if (card.id === 'dispute' && G.owned[key]) params.rent = money(api.oRentGross(G.owned[key]));
    return params;
  }

  function show(G, card, key, ctx) {
    const resumeSpeed = G.speed || 1;
    host.pause();
    if (ctx?.b !== undefined && ctx.city === api.world.key) host.focus(ctx.b);
    const params = describe(card, G, key, ctx);
    const options = card.options.map((opt, i) => `
      <button class="choice" data-option="${i}">
        <b>${esc(t(`card.${card.id}.${opt.k}`, params))}</b>
        <span>${esc(t(`card.${card.id}.${opt.k}Hint`, params))}</span>
      </button>`).join('');
    openModal(`<span class="kind">${t('card.label')}</span>
      <h1>${esc(t(`card.${card.id}.title`, params))}</h1>
      <p class="lead">${esc(t(`card.${card.id}.text`, params))}</p>
      <div class="choices">${options}</div>`, (box) => {
      for (const btn of box.querySelectorAll('[data-option]')) {
        btn.addEventListener('click', () => {
          const opt = card.options[+btn.dataset.option];
          closeModal();
          opt.apply?.(G, api, key, card, ctx);
          api.news(`card.${card.id}.news`, { choice: { goal: `card.${card.id}.${opt.k}` }, ...params });
          api.commit(-1);
          host.resume(resumeSpeed);
        });
      }
    }, { dismissible: false });
  }

  function maybeDraw(G) {
    if (G.t < G.cards.next || modalOpen() || G.ended) return;
    const candidates = [];
    for (const card of CARDS) {
      const found = card.find(G, api);
      if (found.length) candidates.push([card, pick(found)]);
    }
    if (!candidates.length) return;
    G.cards.next = G.t + 4 + ((rnd() * 5) | 0);
    const [card, [key, ctx]] = pick(candidates);
    show(G, card, key, ctx);
  }

  return {
    init(G) {
      G.pending ??= [];
      G.cards ??= { next: 3 };
    },
    month(G) {
      settle(G);
      maybeDraw(G);
    },
  };
}
