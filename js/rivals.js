import { t } from './i18n.js';
import { chf, escapeHtml as esc } from './format.js';
import { openModal, closeModal, modalOpen } from './modal.js';
import { play } from './sound.js';

export const RIVALS = [
  { name: 'Nordwand Capital', cash: 6e6, appetite: 0.22, ceiling: 1.18 },
  { name: 'Lacus Immobilien', cash: 4.5e6, appetite: 0.16, ceiling: 1.1 },
  { name: 'Helvetic Brick Partners', cash: 8e6, appetite: 0.12, ceiling: 1.24 },
];

const rnd = Math.random;
const money = (n) => ({ chf: n });
const ROUND_SECONDS = 12;

export function createRivals(api, host) {
  const holdingValue = (h) => h.price * (api.cityIndex(h.city) / h.idx);

  function worth(r) {
    return r.cash + r.holdings.reduce((a, h) => a + holdingValue(h), 0) - r.debt;
  }

  function acquire(G, i, b, price) {
    const w = api.world;
    const r = G.rivals[i];
    r.cash -= price * 0.3;
    r.debt += price * 0.7;
    r.holdings.push({ city: w.key, b, label: api.label(b), price, idx: api.cityIndex(w.key) });
    G.rivalOwned[`${w.key}:${b}`] = i;
    api.emit('state', b);
    api.news('rival.bought', { rival: RIVALS[i].name, name: { building: [w.key, b, api.label(b)] }, city: { city: w.key }, price: money(price) });
  }

  function candidate(min, max, tries = 300) {
    const w = api.world;
    let best = -1, bestValue = 0;
    for (let i = 0; i < tries; i++) {
      const b = (rnd() * w.count) | 0;
      if (!api.buyable(b) || api.owned(b)) continue;
      const v = api.value(b);
      if (v >= min && v <= max && v > bestValue) { best = b; bestValue = v; }
    }
    return best;
  }

  function rivalMonth(G) {
    G.rivals.forEach((r, i) => {
      const income = r.holdings.reduce((a, h) => a + (holdingValue(h) * 0.032) / 12, 0);
      r.cash += income - (r.debt * G.rate) / 100 / 12;
      if (rnd() > RIVALS[i].appetite) return;
      const b = candidate(1e6, Math.min(20e6, r.cash / 0.3), 60);
      if (b >= 0) acquire(G, i, b, api.value(b) * (1.02 + rnd() * 0.06));
    });
  }

  function rumourMonth(G) {
    const w = api.world;
    for (const r of G.rumours.filter((x) => x.at <= G.t)) {
      const rises = r.truth ? r.up : !r.up;
      const k = `${r.city}:${r.q}`;
      G.idx[k] = (G.idx[k] ?? G.allIdx) * (rises ? 1.08 : 0.93);
      api.news(rises ? 'rumour.rose' : 'rumour.fell', { quarter: r.name, city: { city: r.city } });
      api.toast(rises ? 'rumour.rose' : 'rumour.fell', { quarter: r.name, city: { city: r.city } }, rises ? 'pos' : 'neg');
    }
    G.rumours = G.rumours.filter((x) => x.at > G.t);
    if (G.t < G.nextRumour) return;
    G.nextRumour = G.t + 6 + ((rnd() * 4) | 0);
    const present = [...new Set(w.quarterOf)].filter((q) => w.quarters[q]);
    if (!present.length) return;
    const q = String(present[(rnd() * present.length) | 0]);
    const rumour = { city: w.key, q, name: w.quarters[q][0], up: rnd() < 0.55, truth: rnd() < 0.7, at: G.t + 6 };
    G.rumours.push(rumour);
    const k = rumour.up ? 'rumour.up' : 'rumour.down';
    api.news(k, { quarter: rumour.name, city: { city: w.key } });
    api.toast(k, { quarter: rumour.name, city: { city: w.key } });
  }

  function runAuction(G) {
    const rivalCap = Math.max(...G.rivals.map((r) => r.cash / 0.3)) * 0.9;
    const b = candidate(1.5e6, Math.min(40e6, G.cash + api.bankHeadroom(), rivalCap), 600);
    if (b < 0 || G.cash < api.financing(b, api.value(b) * 0.87).need) return false;
    const resumeSpeed = G.speed || 1;
    host.pause();
    host.focus(b);
    play('card');
    const v = api.value(b);
    const bidders = RIVALS.map((r, i) => ({ i, max: v * (0.95 + rnd() * (r.ceiling - 0.95)) })).filter((x) => G.rivals[x.i].cash >= x.max * 0.3);
    const state = { price: v * 0.85, leader: bidders.length ? bidders[0].i : -1, log: [], timer: null, left: ROUND_SECONDS, done: false };
    if (state.leader >= 0) state.log.push(t('auction.opens', { rival: RIVALS[state.leader].name, price: money(state.price) }));
    const name = { building: [api.world.key, b, api.label(b)] };

    function finish(playerWins) {
      if (state.done) return;
      state.done = true;
      clearInterval(state.timer);
      play('gavel');
      closeModal();
      if (playerWins) {
        if (api.buy(b, 0.8, { price: state.price })) api.news('auction.won', { name, price: money(state.price) });
      } else if (state.leader >= 0) {
        acquire(G, state.leader, b, state.price);
        api.toast('auction.lost', { rival: RIVALS[state.leader].name, price: money(state.price) }, 'neg');
      }
      api.commit(-1);
      host.resume(resumeSpeed);
    }

    function render(box) {
      const fin = api.financing(b, state.price);
      const leader = state.leader === 'you' ? t('auction.you') : state.leader >= 0 ? RIVALS[state.leader].name : '';
      box.querySelector('[data-price]').textContent = chf(state.price);
      box.querySelector('[data-leader]').textContent = leader;
      box.querySelector('[data-need]').textContent = chf(Math.max(0, fin.need));
      box.querySelector('[data-need]').className = `num ${G.cash >= fin.need ? 'pos' : 'neg'}`;
      box.querySelector('[data-log]').innerHTML = state.log.slice(-5).reverse().map((l) => `<div>${esc(l)}</div>`).join('');
      box.querySelector('[data-timer] i').style.width = `${(state.left / ROUND_SECONDS) * 100}%`;
      for (const btn of box.querySelectorAll('[data-raise]')) {
        const next = api.financing(b, state.price * (1 + +btn.dataset.raise));
        btn.disabled = state.leader === 'you' || G.cash < next.need;
      }
    }

    function respond(box) {
      const price = state.price;
      const challenger = bidders.filter((x) => x.max > price * 1.02).sort((a, c) => c.max - a.max)[0];
      if (!challenger) {
        state.log.push(t('auction.going'));
        render(box);
        setTimeout(() => finish(true), 1400);
        return;
      }
      state.price = Math.min(challenger.max, price * (1.02 + rnd() * 0.03));
      state.leader = challenger.i;
      state.left = ROUND_SECONDS;
      state.log.push(t('auction.raise', { rival: RIVALS[challenger.i].name, price: money(state.price) }));
      play('tick');
      render(box);
    }

    openModal(`<span class="kind">${t('auction.label')}</span>
      <h1>${esc(t('auction.title', { name }))}</h1>
      <p class="lead">${esc(t('auction.text', { value: money(v), city: { city: api.world.key } }))}</p>
      <div class="cards">
        <div class="card"><span>${t('auction.current')}</span><b data-price></b></div>
        <div class="card"><span>${t('auction.leader')}</span><b data-leader></b></div>
        <div class="card"><span>${t('auction.need')}</span><b data-need></b></div>
      </div>
      <div class="meter timer" data-timer><i></i></div>
      <div class="auction-log" data-log></div>
      <div class="buttons">
        <button class="primary" data-raise="0.02">${t('auction.bid', { p: '2' })}</button>
        <button class="primary" data-raise="0.05">${t('auction.bid', { p: '5' })}</button>
        <button data-withdraw>${t('auction.withdraw')}</button>
      </div>`, (box) => {
      for (const btn of box.querySelectorAll('[data-raise]')) {
        btn.addEventListener('click', () => {
          state.price *= 1 + +btn.dataset.raise;
          state.leader = 'you';
          state.left = ROUND_SECONDS;
          state.log.push(t('auction.yourBid', { price: money(state.price) }));
          play('tick');
          render(box);
          setTimeout(() => !state.done && respond(box), 900);
        });
      }
      box.querySelector('[data-withdraw]').addEventListener('click', () => finish(false));
      state.timer = setInterval(() => {
        if (state.leader === 'you') return;
        state.left -= 0.25;
        if (state.left <= 0) finish(false);
        else render(box);
      }, 250);
      render(box);
    }, { dismissible: false });
    return true;
  }

  return {
    init(G) {
      G.rivals ??= RIVALS.map((r) => ({ cash: r.cash, debt: 0, holdings: [] }));
      G.rumours ??= [];
      G.nextRumour ??= 5;
      G.nextAuction ??= 9;
    },
    month(G) {
      if (!G.mode.rivals || G.ended) return;
      rivalMonth(G);
      rumourMonth(G);
      if (G.t >= G.nextAuction && !modalOpen()) {
        G.nextAuction = runAuction(G) ? G.t + 9 + ((rnd() * 6) | 0) : G.t + 3;
      }
    },
    standings(G) {
      const rows = RIVALS.map((r, i) => ({ name: r.name, worth: worth(G.rivals[i]), count: G.rivals[i].holdings.length, you: false }));
      rows.push({ name: t('auction.you'), worth: api.netWorth(), count: Object.keys(G.owned).length, you: true });
      return rows.sort((a, b) => b.worth - a.worth);
    },
    ownerName: (i) => RIVALS[i]?.name,
  };
}
