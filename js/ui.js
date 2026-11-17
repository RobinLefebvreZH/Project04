import { CITIES, CITY_KEYS } from './cities.js';
import { BLOCK } from './world.js';
import { PROFILES, MAINTENANCE, AUTO_REPAIR_LEVELS, SEASON, getBoard } from './economy.js';
import { t, cityName, dateLabel, localized, buildingName, getLanguage, onLanguageChange, applyStatic, languageSelect } from './i18n.js';
import { chf, signedChf, integer, decimal, percent, escapeHtml as esc } from './format.js';
import { openModal, closeModal } from './modal.js';
import { PROFILE_FIGURES } from './figures.js';
import { play } from './sound.js';
import { settings, setSetting } from './settings.js';
import { drawSeasonCard, recordCode, shareText } from './season.js';
import { feedbackLink } from './feedback.js';
import { track } from './analytics.js';

const $ = (id) => document.getElementById(id);
const row = (label, value, cls = '') => `<div class="row"><span>${label}</span><span class="num ${cls}">${value}</span></div>`;
const tone = (v) => (v >= 0 ? 'pos' : 'neg');

export function createHud({ world, economy, scene, controls, overlay, goals, rivals, onHome, onCity, onTutorial }) {
  const G = () => economy.state;
  let tab = 'portfolio';
  let boardSort = 'exec';
  let selected = -1;
  let ltv = 80;
  let imageIndex = 0;
  const cleanups = [];

  const listen = (el, type, fn, opts) => {
    el.addEventListener(type, fn, opts);
    cleanups.push(() => el.removeEventListener(type, fn, opts));
  };

  const label = (b) => buildingName(world.key, b, world.landmark.has(b) ? localized(world.landmark.get(b).name) : world.name[b] || world.addresses[b]);
  const artLabel = (b) => {
    const k = `art.${economy.art(b)}`;
    const s = t(k);
    return s === k ? t('art.other') : s;
  };

  function buildCitySelect() {
    const sel = $('citySelect');
    sel.innerHTML = CITY_KEYS.map((c) => `<option value="${c}">${esc(cityName(c))}</option>`).join('');
    sel.value = world.key;
  }
  buildCitySelect();
  listen($('citySelect'), 'change', (e) => onCity(e.target.value));
  const langBox = $('gameLang');
  langBox.innerHTML = '';
  langBox.appendChild(languageSelect('lang-select'));

  function refreshTop() {
    const g = G();
    $('sDate').textContent = t('top.month', { date: dateLabel(g.month, g.year), t: g.t, total: SEASON });
    $('sCash').textContent = chf(g.cash);
    $('sCash').className = g.cash < 0 ? 'neg' : '';
    $('sDebt').textContent = chf(economy.debt());
    $('sNet').textContent = chf(economy.netWorth());
    const f = economy.monthlyFlow();
    $('sFlow').textContent = signedChf(f);
    $('sFlow').className = tone(f);
    $('sRate').textContent = percent(economy.effectiveRate() / 100, 2);
    $('sTitle').textContent = t(`title.${g.goals.title}`);
    const defects = g.defects.length;
    document.querySelector('#tabs [data-tab="defects"]').innerHTML = defects ? `${t('tab.defects')} <span class="count">${defects}</span>` : t('tab.defects');
    for (const btn of document.querySelectorAll('#tabs button')) {
      btn.classList.toggle('on', btn.dataset.tab === tab);
      btn.setAttribute('aria-selected', btn.dataset.tab === tab);
    }
  }

  function setSpeed(s) {
    economy.setSpeed(s);
    const speed = G().speed;
    $('bPause').classList.toggle('on', speed === 0);
    $('bPlay').classList.toggle('on', speed === 1);
    $('bFast').classList.toggle('on', speed === 4);
  }

  function sparkline(values) {
    const w = 256, h = 50, min = Math.min(...values), max = Math.max(...values), range = max - min || 1;
    const pts = values.map((v, i) => `${((i / (values.length - 1)) * w).toFixed(1)},${(h - ((v - min) / range) * (h - 6) - 3).toFixed(1)}`).join(' ');
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline points="${pts}"/></svg><div class="caption">${t('port.history')}</div>`;
  }

  function scoreParts(s) {
    return s.parts.map(([k, p, v, max]) => `${row(esc(t(k, p)), `${integer(v)} / ${max}`)}<div class="meter"><i style="width:${(v / max) * 100}%"></i></div>`).join('');
  }

  function renderPortfolio() {
    const g = G();
    const keys = Object.keys(g.owned).sort((a, b) => economy.oValue(g.owned[b]) - economy.oValue(g.owned[a]));
    let h = row(t('port.profile'), esc(t(`profile.${g.profile}.name`)))
      + row(t('port.income'), chf(g.lastInc))
      + row(t('port.living'), chf(economy.living()))
      + row(t('port.count'), integer(keys.length))
      + row(t('port.value'), chf(economy.portfolioValue()))
      + row(t('port.headroom'), chf(economy.bankHeadroom()));
    if (g.hist.length > 1) h += sparkline(g.hist);
    if (!keys.length) h += `<p class="note">${esc(t('port.empty'))}</p>`;
    for (const k of keys) {
      const o = g.owned[k];
      const v = economy.oValue(o), gain = v - o.paid, nd = g.defects.filter((d) => d.k === k).length;
      const flags = [o.proj ? t('port.busy') : '', nd ? t('port.defects', { n: nd }) : ''].filter(Boolean).join(' · ');
      h += `<button class="item" data-action="goto" data-key="${k}">
        <b>${esc(buildingName(o.city, o.b, o.label))}</b>${flags ? `<span class="flag">${esc(flags)}</span>` : ''}
        ${row(`${esc(cityName(o.city))}${o.qn ? ` · ${esc(o.qn)}` : ''}`, chf(v))}
        ${row(esc(t('port.flow', { v: { chf: economy.oFlow(o, k) } })), signedChf(gain), tone(gain))}
      </button>`;
    }
    return h;
  }

  const rewardText = (r) => [r.cash ? `+${chf(r.cash)}` : '', r.rate ? t('goal.rateReward', { p: decimal(r.rate, 2) }) : ''].filter(Boolean).join(' · ');
  const progressValue = (m, v) => (m.money ? chf(v) : integer(v));

  function renderGoals() {
    const s = goals.status(G());
    let h = `<h4>${t('goal.titleHead')}</h4>
      <div class="title-card"><span class="title-rank">${s.title + 1}</span><div><b>${t(`title.${s.title}`)}</b>
      <small>${s.next ? t('goal.nextTitle', { title: { goal: `title.${s.title + 1}` }, worth: { chf: s.next.worth } }) : t('goal.maxTitle')}</small></div></div>`;
    if (s.next) h += `<div class="meter"><i style="width:${s.next.progress * 100}%"></i></div>`;
    h += `<h4>${t('goal.missions')}</h4>`;
    for (const m of s.missions) {
      h += `<div class="goal">${row(`<b>${t(`mission.${m.id}`)}</b>`, `${progressValue(m, m.current)} / ${progressValue(m, m.target)}`)}
        <div class="meter"><i style="width:${(m.current / m.target) * 100}%"></i></div><small class="reward">${rewardText(m.reward)}</small></div>`;
    }
    h += `<p class="note">${t('goal.completed', { n: s.done })}</p><h4>${t('goal.collections')}</h4>`;
    for (const c of s.collections) {
      h += `<div class="goal ${c.complete ? 'complete' : ''}">${row(`<b>${t(`collection.${c.id}`)}</b>`, `${c.current} / ${c.target}`)}
        <div class="meter"><i style="width:${(c.current / c.target) * 100}%"></i></div>
        <small>${esc(t(`collection.${c.id}.desc`))}</small><small class="reward">${c.complete ? t('goal.done') : rewardText(c.reward)}</small></div>`;
    }
    return h;
  }

  function renderDefects() {
    const g = G();
    const M = MAINTENANCE[g.set.maint];
    let h = `<h4>${t('maint.title')}</h4><div class="segment">${Object.entries(MAINTENANCE).map(([k, m]) => `
      <button class="${g.set.maint === k ? 'on' : ''}" data-action="maint" data-value="${k}">${t(`maint.${k}`)}<small>${t('maint.perYear', { p: percent(m.rate) })}</small></button>`).join('')}</div>
      <p class="note">${esc(t('maint.note', { risk: decimal(M.risk, 2) }))}</p>
      <label class="check"><input type="checkbox" data-action="insurance" ${g.set.ins ? 'checked' : ''}> <span>${esc(t('maint.insurance'))}</span></label>
      <p class="note">${esc(t('maint.mandatory'))}</p>
      <div class="row"><span>${t('maint.auto')}</span><select data-action="auto">${AUTO_REPAIR_LEVELS.map((v) => `<option value="${v}" ${g.set.auto === v ? 'selected' : ''}>${v ? chf(v) : t('maint.off')}</option>`).join('')}</select></div>
      <hr>${row(t('maint.open'), integer(g.defects.length))}`;
    if (g.defects.length) {
      const total = g.defects.reduce((a, d) => a + economy.defectCost(d), 0);
      h += `<button class="primary wide" data-action="repairAll">${t('act.repairAll', { cost: { chf: total } })}</button>`;
    }
    for (const d of [...g.defects].sort((a, b) => a.since - b.since)) {
      const o = g.owned[d.k];
      h += `<div class="item static">
        ${row(`<b>${t(`defect.${d.type}`)}</b>`, chf(economy.defectCost(d)))}
        <div class="row"><a href="#" data-action="goto" data-key="${d.k}">${esc(o ? buildingName(o.city, o.b, o.label) : '')}</a><span>${t('info.defectLine', { months: g.t - d.since, pen: `-${percent(d.pen, 0)}` })}</span></div>
        <button class="wide" data-action="repair" data-id="${d.id}">${t('act.repair')}</button>
      </div>`;
    }
    h += `<hr>${row(t('maint.inflation'), percent(g.cpi - 1))}${row(t('maint.costIndex'), percent(g.costIdx - 1))}${row(t('maint.vacancy'), percent(g.vac))}`;
    return h;
  }

  function renderScore() {
    const g = G();
    const s = economy.scores();
    let h = row(t('score.season'), t('score.monthOf', { t: g.t, total: SEASON }))
      + `<div class="meter"><i style="width:${(g.t / SEASON) * 100}%"></i></div>
      <div class="cards small">
        <div class="card"><span>${t('score.aum')}</span><b>${chf(s.aum)}</b></div>
        <div class="card"><span>${t('score.noi')}</span><b>${chf(s.rev)}</b></div>
        <div class="card"><span>${t('score.exec')}</span><b>${s.exec}/100</b></div>
      </div>${scoreParts(s)}
      <button class="wide" data-action="endSeason" ${g.ended ? 'disabled' : ''}>${t('score.endNow')}</button><hr>
      ${g.mode.rivals ? `<h4>${t('rival.standings')}</h4>${rivals.standings(g).map((r, i) => `<div class="row ${r.you ? 'you' : ''}"><span>${i + 1}. ${esc(r.name)} <small>${t('rival.count', { n: r.count })}</small></span><span class="num">${chf(r.worth)}</span></div>`).join('')}<hr>` : ''}
      <h4>${t('score.board')}</h4>
      <div class="segment">${[['exec', 'score.exec'], ['aum', 'score.aum'], ['rev', 'score.noi']].map(([k, n]) => `<button class="${boardSort === k ? 'on' : ''}" data-action="board" data-value="${k}">${t(n)}</button>`).join('')}</div>`;
    const board = getBoard().sort((a, b) => b[boardSort] - a[boardSort]).slice(0, 10);
    h += board.length
      ? board.map((e, i) => row(`${i + 1}. ${esc(t(`profile.${e.p}.name`))} · ${e.d}`, boardSort === 'exec' ? `${e.exec}/100` : chf(e[boardSort]))).join('')
      : `<p class="note">${t('score.boardEmpty')}</p>`;
    return h;
  }

  function renderMarket() {
    const g = G();
    let h = `<p class="note">${t('market.cities')}</p>`;
    for (const c of CITY_KEYS) {
      const d = CITIES[c], price = d.price * economy.cityIndex(c);
      h += `<button class="item line ${c === world.key ? 'current' : ''}" data-action="city" data-value="${c}">${row(esc(cityName(c)), `${integer(price)} · ${decimal(d.rent, 1)} · ${percent((d.rent * 12) / price)}`)}</button>`;
    }
    if (g.mode.rivals && g.rumours.length) {
      h += `<hr><h4>${t('rumour.head')}</h4>` + g.rumours.map((r) => row(`${esc(r.name)} <small>${esc(cityName(r.city))}</small>`, `${t(r.up ? 'rumour.tipUp' : 'rumour.tipDown')} · ${t('proj.left', { n: r.at - g.t })}`, r.up ? 'pos' : 'neg')).join('');
    }
    h += `<hr>${row(t('market.rate'), percent(g.rate / 100, 2))}${row(t('market.yourRate'), percent(economy.effectiveRate() / 100, 2))}<p class="note">${esc(t('market.quarters', { city: cityName(world.key) }))}</p>`;
    const present = new Set(world.quarterOf);
    const ids = Object.keys(world.quarters).filter((q) => present.has(+q));
    const pi = (q) => economy.priceIndex(world.key, q), ri = (q) => economy.rentIndex(world.key, q);
    ids.sort((a, b) => world.quarters[b][2] * pi(b) - world.quarters[a][2] * pi(a));
    for (const q of ids) {
      const [name, district, price, rent] = world.quarters[q];
      const change = (pi(q) - 1) * 100;
      const left = world.key === 'zurich' ? `${esc(name)} <small>${t('building.district', { n: district })}</small>` : esc(name);
      h += row(left, `${integer(price * pi(q))} · ${decimal(rent * ri(q), 1)} <small class="${tone(change)}">${change >= 0 ? '+' : ''}${decimal(change, 1)}%</small>`);
    }
    return h;
  }

  function renderNews() {
    return G().news.slice().reverse().map((n) => `<div class="news"><div class="date">${dateLabel(n.m, n.y)}</div>${esc(t(n.k, n.p))}</div>`).join('');
  }

  const TABS = { portfolio: renderPortfolio, goals: renderGoals, defects: renderDefects, score: renderScore, market: renderMarket, news: renderNews };
  function renderTab() {
    $('tabBody').innerHTML = TABS[tab]();
    refreshTop();
  }

  function wikiCard(entry) {
    const lang = getLanguage();
    const title = entry.wiki[lang] ? [lang, entry.wiki[lang]] : ['en', entry.wiki.en || Object.values(entry.wiki)[0]];
    const url = `https://${title[0]}.wikipedia.org/wiki/${encodeURIComponent(title[1].replace(/ /g, '_'))}`;
    const imgs = entry.imgs || [];
    const img = imgs[Math.min(imageIndex, imgs.length - 1)];
    const gallery = img
      ? `<figure class="wiki-photo"><img src="${esc(img.src)}" alt="${esc(localized(entry.name))}">
          <figcaption><a href="${esc(img.page)}" target="_blank" rel="noopener">${esc(t('wiki.photo', { artist: img.artist, license: img.license }))}</a></figcaption></figure>
         ${imgs.length > 1 ? `<div class="thumbs">${imgs.map((m, i) => `<button class="thumb ${i === imageIndex ? 'on' : ''}" data-action="photo" data-value="${i}"><img src="${esc(m.src)}" alt=""></button>`).join('')}</div>` : ''}`
      : `<p class="note">${t('wiki.noPhoto')}</p>`;
    return `<div class="wiki">
      <span class="kind kind-${entry.kind}">${t(`wiki.${entry.kind}`)}</span>
      ${gallery}
      <p>${esc(localized(entry.text))}</p>
      <a class="wiki-link" href="${url}" target="_blank" rel="noopener">${t('wiki.read')}</a>
    </div>`;
  }

  function renderInfo() {
    const el = $('info');
    const b = selected;
    if (b < 0) {
      el.hidden = true;
      el.innerHTML = '';
      return;
    }
    el.hidden = false;
    const g = G();
    const q = economy.quarter(b), o = economy.owned(b), k = economy.ownKey(b);
    const landmark = world.landmark.get(b);
    const traded = economy.traded(b), buyable = economy.buyable(b);
    const qName = q.name || cityName(world.key);
    const sub = [qName, world.key === 'zurich' && q.district ? t('building.district', { n: q.district }) : cityName(world.key)];
    if ((world.name[b] || landmark) && world.addresses[b]) sub.push(world.addresses[b]);
    const rival = economy.rivalOf(b);
    const tags = [
      o ? `<span class="tag accent">${t('tag.owned')}</span>` : '',
      rival !== undefined ? `<span class="tag rival">${esc(t('tag.rival', { rival: rivals.ownerName(rival) }))}</span>` : '',
      o?.green ? `<span class="tag">${t('tag.green')}</span>` : '',
      o?.boost && g.t < o.boost.until ? `<span class="tag">${t('tag.shortStay')}</span>` : '',
      !buyable && !o && rival === undefined ? `<span class="tag">${t('tag.notForSale')}</span>` : '',
      landmark ? '' : `<span class="tag">${esc(artLabel(b))}</span>`,
      world.glass[b] && !landmark ? `<span class="tag">${t('tag.highRise')}</span>` : '',
      economy.oldTown(b) ? `<span class="tag">${t('tag.oldTown')}</span>` : '',
    ].join('');
    const year = world.rows[b][5];
    const peek = el.classList.contains('peek');
    const head = `<button class="grab" data-action="peek" aria-expanded="${!peek}" aria-label="${t(peek ? 'info.expand' : 'info.collapse')}"></button>
      <button class="icon close" data-action="close" title="${t('info.close')}"><svg><use href="#i-close"/></svg></button>
      <div class="info-head"><h2>${esc(label(b))}</h2><div class="sub">${sub.map(esc).join(' · ')}</div><div class="tags">${tags}</div></div>`;
    let h = landmark ? wikiCard(landmark) : '';
    h += `<hr>${row(t('info.height'), `${decimal(world.rows[b][3] / 10, 1)} m${world.extra[b] ? ` +${world.extra[b] * BLOCK} m` : ''}`)}
      ${row(t('info.footFloors'), `${integer(economy.footprint(b))} m² · ${economy.floors(b)}`)}
      ${row(t('info.age'), year > 1800 ? String(year) : t('info.ageEstimate', { n: economy.age(b) }))}`;
    if (traded && !landmark) {
      const value = economy.value(b), rent = economy.rent(b);
      h += row(t('info.area'), `${integer(economy.area(b))} m²`)
        + row(`${t('info.priceM2')} <small>${t(`src.${q.source}`)}</small>`, `CHF ${integer(economy.priceM2(b))}`)
        + row(t('info.rentM2'), `CHF ${decimal(economy.rentM2(b), 2)}`)
        + row(t('info.value'), chf(value))
        + row(t('info.rent'), chf(rent))
        + row(t('info.yield'), percent((rent * 12) / value, 2));
    }
    const facts = h;
    h = '';
    if (o) {
      const flow = economy.oFlow(o, k), v = economy.oValue(o), ds = g.defects.filter((d) => d.k === k);
      h += `<hr>${row(t('info.paid'), chf(o.paid))}
        ${row(t('info.mortgage'), `${chf(o.debt)} (${percent(o.debt / v, 0)})`)}
        ${row(t('info.condition'), percent(o.cond, 0))}
        ${row(t('info.netFlow'), chf(flow), tone(flow))}
        ${row(t('info.gain'), chf(v - o.paid), tone(v - o.paid))}`;
      if (o.proj) {
        const name = o.proj.type === 'permit' ? t('proj.permit', { p: percent(o.proj.p, 0) }) : t(`proj.${o.proj.type}`);
        h += row(t('info.project'), `${name} · ${t('proj.left', { n: o.proj.left })}`);
      }
      if (ds.length) {
        h += `<hr><h4>${t('info.openDefects')}</h4>` + ds.map((d) => `<div class="row"><span>${t(`defect.${d.type}`)} <small>${t('info.defectLine', { months: g.t - d.since, pen: `-${percent(d.pen, 0)}` })}</small></span><button class="small" data-action="repair" data-id="${d.id}">${chf(economy.defectCost(d))}</button></div>`).join('');
      }
      const maxed = o.proj || world.extra[b] >= 6;
      h += `<div class="actions">
        <button data-action="renovate" ${o.proj ? 'disabled' : ''} title="${esc(t('act.renovateTitle'))}">${t('act.renovate')}<small>${chf(economy.renovationCost(b))}</small></button>
        <button data-action="extend" ${maxed ? 'disabled' : ''} title="${esc(t('act.extendTitle', { cost: { chf: economy.extensionCost(b) } }))}">${t('act.extend')}<small>${t('act.chance', { p: percent(economy.permitChance(b), 0) })}</small></button>
        <button data-action="refinance" data-key="${k}" data-value="-500000">${t('act.amortise')}<small>${chf(-500000)}</small></button>
        <button data-action="refinance" data-key="${k}" data-value="500000">${t('act.borrow')}<small>+${chf(500000)}</small></button>
        <button class="danger" data-action="sell" data-key="${k}" ${o.proj ? 'disabled' : ''}>${t('act.sell')}<small>${chf(v)}</small></button>
      </div>`;
    } else if (buyable) {
      const ask = economy.askPrice(b), limit = economy.maxLoan(ask, economy.rent(b) * 12);
      const maxLtv = Math.max(0, Math.min(80, Math.floor(((limit / ask) * 100) / 5) * 5));
      if (ltv > maxLtv) ltv = maxLtv;
      h += `<hr>${row(t('info.ask'), chf(ask))}
        ${row(t('info.maxMortgage'), `${chf(limit)} · ${maxLtv}%`, maxLtv < 80 ? 'neg' : '')}
        <div class="slider"><span>${t('info.mortgageSlider')}</span><input type="range" data-action="ltv" min="0" max="${maxLtv}" step="5" value="${ltv}"><span class="num" id="ltvValue">${ltv}%</span></div>
        ${row(t('info.equity'), `<span id="equityNeed" class="${g.cash < ask * (1 - ltv / 100) + ask * 0.005 ? 'neg' : ''}">${chf(ask * (1 - ltv / 100) + ask * 0.005)}</span>`)}
        <div class="actions"><button class="primary" data-action="buy" ${g.ended ? 'disabled' : ''}>${t('act.buy')}</button></div>`;
    } else if (rival !== undefined) {
      h += `<hr><p class="note">${esc(t('info.rivalOwned', { rival: rivals.ownerName(rival) }))}</p>`;
    } else if (!landmark) {
      h += `<hr><p class="note">${t(world.name[b] ? 'info.public' : 'info.notTradable')}</p>`;
    }
    el.innerHTML = `${head}<div class="info-facts">${facts}</div><div class="info-deal">${h}</div>`;
  }

  const sheet = (open) => document.getElementById('sidebar').classList.toggle('open', open);

  function select(b) {
    sheet(false);
    if (b !== selected) {
      imageIndex = 0;
      $('info').classList.remove('peek');
    }
    selected = b;
    const card = world.landmark.get(b);
    scene.select(b, card ? card.bids.map((x) => x - 1) : []);
    overlay.setMarker(b);
    renderInfo();
  }

  function focus(b, keepDistance = false) {
    const d = keepDistance ? controls.orbit.dist : Math.max(250, Math.min(700, controls.orbit.dist));
    controls.flyTo((world.cx[b] + 0.5) * 2, (world.cy[b] + 0.5) * 2, d);
    select(b);
  }

  function gotoOwned(k) {
    const o = G().owned[k];
    if (!o) return;
    if (o.city === world.key) focus(o.b);
    else onCity(o.city, o.b);
  }

  function handleAction(el, e) {
    const a = el.dataset.action, v = el.dataset.value, key = el.dataset.key;
    switch (a) {
      case 'close': return select(-1);
      case 'peek': $('info').classList.toggle('peek'); return renderInfo();
      case 'goto': e.preventDefault(); return gotoOwned(key);
      case 'buy': return economy.buy(selected, ltv / 100);
      case 'sell': play('coin'); return economy.sell(key);
      case 'renovate': return economy.renovate(selected);
      case 'extend': return economy.extend(selected);
      case 'refinance': return economy.refinance(key, +v);
      case 'repair': play('click'); return economy.repair(+el.dataset.id, false);
      case 'repairAll': play('click'); return economy.repairAll();
      case 'maint': return economy.setMaintenance(v);
      case 'board': boardSort = v; return renderTab();
      case 'city': return v !== world.key && onCity(v);
      case 'endSeason': return economy.endSeason();
      case 'photo': imageIndex = +v; return renderInfo();
      default: return null;
    }
  }

  const onClick = (e) => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled || el.tagName === 'INPUT' || el.tagName === 'SELECT') return;
    handleAction(el, e);
  };
  const onChange = (e) => {
    const el = e.target;
    if (el.dataset.action === 'insurance') economy.setInsurance(el.checked);
    if (el.dataset.action === 'auto') economy.setAutoRepair(+el.value);
  };
  const onInput = (e) => {
    if (e.target.dataset.action !== 'ltv') return;
    ltv = +e.target.value;
    $('ltvValue').textContent = `${ltv}%`;
    const ask = economy.askPrice(selected);
    const need = ask * (1 - ltv / 100) + ask * 0.005;
    $('equityNeed').textContent = chf(need);
    $('equityNeed').className = G().cash < need ? 'neg' : '';
  };
  for (const id of ['info', 'tabBody']) {
    listen($(id), 'click', onClick);
    listen($(id), 'change', onChange);
    listen($(id), 'input', onInput);
  }
  for (const btn of document.querySelectorAll('#tabs button')) {
    listen(btn, 'click', () => { tab = btn.dataset.tab; play('click'); renderTab(); });
  }
  listen($('bPanel'), 'click', () => {
    const open = !$('sidebar').classList.contains('open');
    if (open) select(-1);
    sheet(open);
  });

  const searchIndex = [];
  {
    const best = {};
    for (let b = 0; b < world.count; b++) {
      if (!(world.addresses[b] || world.name[b] || world.landmark.has(b))) continue;
      const k = label(b).toLowerCase();
      const current = best[k];
      if (current === undefined || (world.landmark.has(b) && !world.landmark.has(current))) best[k] = b;
      else if (world.landmark.has(b) === world.landmark.has(current) && world.cells[b].length > world.cells[current].length) best[k] = b;
    }
    for (const k in best) searchIndex.push([k, best[k]]);
    searchIndex.sort((a, b) => a[0].length - b[0].length);
  }
  const input = $('searchInput'), results = $('searchResults');
  const setPlaceholder = () => { input.placeholder = t('search.placeholder', { city: cityName(world.key) }); };
  setPlaceholder();
  input.value = '';
  results.innerHTML = '';
  listen(input, 'input', () => {
    const v = input.value.trim().toLowerCase();
    if (v.length < 2) { results.innerHTML = ''; return; }
    const out = [];
    for (const [s, b] of searchIndex) {
      if (s.includes(v)) out.push(b);
      if (out.length >= 8) break;
    }
    results.innerHTML = out.length
      ? out.map((b) => `<button data-b="${b}">${esc(label(b))} <small>${esc(economy.quarter(b).name || cityName(world.key))}</small></button>`).join('')
      : `<div class="none">${t('search.none')}</div>`;
  });
  listen(results, 'click', (e) => {
    const el = e.target.closest('[data-b]');
    if (!el) return;
    focus(+el.dataset.b);
    results.innerHTML = '';
    input.value = '';
  });

  function toast({ k, p, tone: cls }) {
    const box = $('toasts');
    const el = document.createElement('div');
    el.className = `toast panel ${cls || ''}`;
    if (cls === 'neg') play('alert');
    el.textContent = t(k, p);
    box.appendChild(el);
    setTimeout(() => el.remove(), 4600);
    trimToasts();
  }

  function trimToasts() {
    const box = $('toasts');
    const max = matchMedia('(max-width: 900px)').matches ? 2 : 3;
    while (box.children.length > max) box.firstChild.remove();
  }

  function showProfiles(required = false) {
    setSpeed(0);
    const cards = Object.entries(PROFILES).map(([k, p]) => `
      <button class="profile" data-profile="${k}">
        ${PROFILE_FIGURES[k]}
        <b>${t(`profile.${k}.name`)}</b>
        <span class="num">${t('profile.start', { cash: { chf: p.cash } })}</span>
        <span>${esc(t(`profile.${k}.desc`))}</span>
        <span class="num muted">${t('profile.living', { cost: { chf: p.living } })}</span>
      </button>`).join('');
    openModal(`<h1>${t('profile.title')}</h1><p class="lead">${esc(t('profile.lead'))}</p><div class="profiles">${cards}</div>
      <label class="check option"><input type="checkbox" data-rivals checked><span><b>${t('profile.rivals')}</b><br>${esc(t('profile.rivalsHint'))}</span></label>`, (box) => {
      for (const btn of box.querySelectorAll('[data-profile]')) {
        btn.addEventListener('click', () => {
          resetGame(btn.dataset.profile, { rivals: box.querySelector('[data-rivals]').checked });
          closeModal();
          setSpeed(1);
        });
      }
    }, { dismissible: !required && !G().ended });
  }

  function resetGame(profile, options) {
    for (let b = 0; b < world.count; b++) {
      if (world.extra[b]) {
        world.extra[b] = 0;
        scene.rebuildBuilding(b);
      }
    }
    economy.newGame(profile, options);
    economy.attachWorld(world);
    syncState();
    select(-1);
    renderTab();
  }

  function showHelp() {
    setSpeed(0);
    const items = ['home.how1', 'home.how2', 'home.how3', 'home.how4'].map((k) => `<li>${esc(t(k))}</li>`).join('');
    openModal(`<h1>${t('help.title')}</h1><ul>${items}</ul><h3>${t('home.controls')}</h3><p class="note">${esc(t('home.controlsText'))}</p>
      <div class="buttons"><button class="primary" data-close>${t('help.resume')}</button><button data-tutorial>${t('tut.replay')}</button><a class="button" href="${esc(feedbackLink({ City: world.key, Month: G().t }))}" target="_blank" rel="noopener">${t('menu.feedback')}</a><button class="danger" data-restart>${t('help.restart')}</button></div>`, (box) => {
      box.querySelector('[data-close]').addEventListener('click', closeModal);
      box.querySelector('[data-tutorial]').addEventListener('click', () => {
        closeModal();
        onTutorial();
      });
      box.querySelector('[data-restart]').addEventListener('click', () => showProfiles());
    });
  }

  function seasonRecord() {
    const g = G();
    const s = economy.scores();
    const cities = [...new Set(Object.values(g.owned).map((o) => o.city))];
    const record = {
      name: settings().playerName.trim(),
      profile: g.profile,
      title: g.goals.title,
      aum: Math.round(s.aum),
      rev: Math.round(s.rev),
      exec: s.exec,
      parts: s.parts.map(([k, p, v, max]) => [t(k, p), v, max]),
      months: g.t,
      month: g.month,
      year: g.year,
      cities: cities.length ? cities : [world.key],
      date: new Date().toISOString().slice(0, 10),
    };
    record.code = recordCode(record);
    return record;
  }

  function showSeason(entry) {
    setSpeed(0);
    play('goal');
    const board = getBoard();
    const rank = (key) => 1 + board.filter((x) => x[key] > entry[key]).length;
    const s = economy.scores();
    const g = G();
    track('Season Completed', { profile: g.profile, title: t(`title.${g.goals.title}`), exec: Math.floor(s.exec / 10) * 10 });
    openModal(`<h1>${t('season.title')}</h1>
      <p class="lead">${esc(t('season.summary', { profile: g.profile, months: g.t, nw: { chf: economy.netWorth() } }))}</p>
      <div class="cards">
        <div class="card"><span>${t('score.aum')}</span><b>${chf(s.aum)}</b><small>${t('score.rank', { r: rank('aum'), n: board.length })}</small></div>
        <div class="card"><span>${t('score.noi')}</span><b>${chf(s.rev)}</b><small>${t('score.rank', { r: rank('rev'), n: board.length })}</small></div>
        <div class="card"><span>${t('score.exec')}</span><b>${s.exec} / 100</b><small>${t('score.rank', { r: rank('exec'), n: board.length })}</small></div>
      </div>${scoreParts(s)}
      <h3>${t('record.title')}</h3>
      <p class="note">${esc(t('record.lead'))}</p>
      <label class="field"><span>${t('record.name')}</span><input data-name maxlength="40" autocomplete="name" value="${esc(settings().playerName)}"></label>
      <img class="record" data-record alt="${esc(t('record.alt'))}">
      <div class="buttons">
        <a class="button primary" data-download download="swiss-blocks-season.png">${t('record.download')}</a>
        <button data-share hidden>${t('record.shareButton')}</button>
        <button data-copy>${t('record.copy')}</button>
        <a class="button" data-linkedin target="_blank" rel="noopener">${t('record.linkedin')}</a>
      </div>
      <p class="note">${esc(t('record.note'))}</p>
      <div class="buttons"><button class="primary" data-again>${t('season.again')}</button><button data-close>${t('season.view')}</button></div>`, (box) => {
      let canvas = null;
      const refresh = () => {
        const record = seasonRecord();
        canvas = drawSeasonCard(record);
        const url = canvas.toDataURL('image/png');
        box.querySelector('[data-record]').src = url;
        box.querySelector('[data-download]').href = url;
        box.querySelector('[data-linkedin]').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://swissblocks.app/')}`;
        box.dataset.text = shareText(record);
      };
      refresh();
      box.querySelector('[data-name]').addEventListener('input', (e) => {
        setSetting('playerName', e.target.value);
        refresh();
      });
      const shareBtn = box.querySelector('[data-share]');
      if (navigator.canShare) shareBtn.hidden = false;
      shareBtn.addEventListener('click', () => {
        canvas.toBlob((blob) => {
          const file = new File([blob], 'swiss-blocks-season.png', { type: 'image/png' });
          const data = { text: box.dataset.text, files: [file] };
          (navigator.canShare(data) ? navigator.share(data) : navigator.share({ text: box.dataset.text })).catch(() => null);
        });
      });
      box.querySelector('[data-copy]').addEventListener('click', (e) => {
        navigator.clipboard?.writeText(box.dataset.text).then(() => { e.target.textContent = t('record.copied'); }).catch(() => null);
      });
      box.querySelector('[data-again]').addEventListener('click', () => showProfiles(true));
      box.querySelector('[data-close]').addEventListener('click', closeModal);
    });
  }

  function stateOf(b) {
    const o = economy.owned(b);
    if (o) return o.proj ? 128 : 255;
    return economy.rivalOf(b) !== undefined ? 72 : 0;
  }

  function updateState(b, commit = true) {
    scene.setBuildingState(b, stateOf(b), economy.heatValue(b));
    if (commit) scene.commitState();
  }

  function syncState() {
    for (let b = 0; b < world.count; b++) updateState(b, false);
    scene.commitState();
  }

  const tools = { heat: false, night: false };
  function toggleHeat() {
    tools.heat = !tools.heat;
    scene.setHeat(tools.heat);
    $('tHeat').classList.toggle('on', tools.heat);
  }
  function toggleLabels() {
    overlay.setVisible(!overlay.visible);
    $('tLabels').classList.toggle('on', overlay.visible);
  }
  function toggleNight() {
    tools.night = !tools.night;
    $('tNight').classList.toggle('on', tools.night);
  }
  function toggleFly() {
    controls.toggleFlying();
  }
  function toggleSound() {
    setSetting('sound', !settings().sound);
    $('tSound').classList.toggle('on', settings().sound);
    play('click');
  }
  listen($('tHeat'), 'click', toggleHeat);
  listen($('tLabels'), 'click', toggleLabels);
  listen($('tNight'), 'click', toggleNight);
  listen($('tFly'), 'click', toggleFly);
  listen($('tSound'), 'click', toggleSound);
  listen($('bPause'), 'click', () => setSpeed(0));
  listen($('bPlay'), 'click', () => setSpeed(1));
  listen($('bFast'), 'click', () => setSpeed(4));
  listen($('bHelp'), 'click', showHelp);
  listen($('bHome'), 'click', onHome);
  listen($('compass'), 'click', () => controls.faceNorth());
  for (const btn of document.querySelectorAll('#nav [data-nav]')) {
    const k = btn.dataset.nav;
    const on = (e) => {
      e.preventDefault();
      controls.pad[k] = true;
      controls.cancelTarget();
      btn.setPointerCapture?.(e.pointerId);
    };
    const off = () => { controls.pad[k] = false; };
    listen(btn, 'pointerdown', on);
    listen(btn, 'pointerup', off);
    listen(btn, 'pointercancel', off);
    listen(btn, 'pointerleave', off);
  }

  listen(window, 'keydown', (e) => {
    if (e.target.closest?.('input, select, textarea') || e.repeat) return;
    if (!document.getElementById('modal').hidden) {
      if (e.code === 'Escape' && document.getElementById('modal').dataset.dismissible) closeModal();
      return;
    }
    if (e.code === 'KeyV') toggleFly();
    else if (e.code === 'KeyH') toggleHeat();
    else if (e.code === 'KeyL') toggleLabels();
    else if (e.code === 'KeyN') toggleNight();
    else if (e.code === 'KeyM') toggleSound();
    else if (e.code === 'KeyC') controls.faceNorth();
    else if (e.code === 'Space' && !controls.flying) setSpeed(G().speed ? 0 : 1);
    else if (e.code === 'Escape') {
      if (controls.flying) controls.setFlying(false);
      else select(-1);
    }
  });

  function onFlyChange(on) {
    $('tFly').classList.toggle('on', on);
    $('crosshair').hidden = !on;
    if (on) toast({ k: 'tool.flyHelp', p: {} });
  }

  function celebrate({ k, reward, title }) {
    const box = $('toasts');
    const el = document.createElement('div');
    el.className = `toast panel goal ${title ? 'big' : ''}`;
    el.innerHTML = `<span class="kind">${t(title ? 'goal.newTitle' : 'goal.achieved')}</span><b>${esc(t(k))}</b><small>${rewardText(reward)}</small>`;
    box.appendChild(el);
    trimToasts();
    setTimeout(() => el.remove(), 5200);
  }

  function refreshAll() {
    applyStatic($('game'));
    buildCitySelect();
    setPlaceholder();
    renderTab();
    renderInfo();
  }
  cleanups.push(onLanguageChange(refreshAll));

  return {
    get night() { return tools.night; },
    get selected() { return selected; },
    get tab() { return tab; },
    select,
    focus,
    toast,
    setSpeed,
    showProfiles,
    showHelp,
    showSeason,
    syncState,
    updateState,
    updateHeat: syncState,
    onFlyChange,
    celebrate,
    resume(speed) { setSpeed(speed); },
    applySettings(s) {
      $('tSound').classList.toggle('on', s.sound);
      overlay.setVisible(s.labels);
      $('tLabels').classList.toggle('on', s.labels);
      $('mini').hidden = !s.minimap;
    },
    refresh(b) {
      renderTab();
      if (selected >= 0 && (b === undefined || b < 0 || b === selected)) renderInfo();
    },
    renderNews() {
      if (tab === 'news') renderTab();
    },
    start() {
      refreshAll();
      setSpeed(0);
    },
    dispose() {
      for (const fn of cleanups) fn();
      $('info').hidden = true;
      $('tabBody').innerHTML = '';
      $('toasts').innerHTML = '';
      for (const k in controls.pad) controls.pad[k] = false;
      sheet(false);
    },
  };
}
