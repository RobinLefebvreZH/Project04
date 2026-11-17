import { CITIES, CITY_KEYS, grossYield } from './cities.js';
import { t, cityName, dateLabel, onLanguageChange, LANGUAGES, getLanguage, setLanguage } from './i18n.js';
import { integer, percent, chf, escapeHtml as esc } from './format.js';
import { PROFILE_FIGURES } from './figures.js';
import { PROFILES, SEASON, getBoard, listSlots, latestSlot, deleteSlot } from './economy.js';
import { settings, setSetting, OPTIONS } from './settings.js';
import { prefetchCity } from './world.js';

const STEPS = ['home.how1', 'home.how2', 'home.how3', 'home.how4'];

function segment(name, values, current, label = (v) => t(`settings.${name}.${v}`)) {
  return `<div class="segment" role="radiogroup">${values.map((v) => `
    <button class="${v === current ? 'on' : ''}" data-set="${name}" data-value="${v}" role="radio" aria-checked="${v === current}">${esc(label(v))}</button>`).join('')}</div>`;
}

function toggle(name, on) {
  return segment(name, ['on', 'off'], on ? 'on' : 'off', (v) => t(`settings.${v}`));
}

function slotSummary(s) {
  return `<b>${esc(t(`profile.${s.profile}.name`))} · ${esc(cityName(s.city))}</b>
    <span class="muted">${dateLabel(s.month, s.year)} · ${t('score.monthOf', { t: s.t, total: SEASON })}</span>
    <span class="num">${chf(s.worth)} · ${t('rival.count', { n: s.count })}</span>`;
}

function savedAt(ms) {
  if (!ms) return '';
  return new Intl.DateTimeFormat(getLanguage(), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ms));
}

export function renderHome(root, { onNew, onLoad }) {
  let view = 'menu';
  const draft = { profile: 'banker', city: 'zurich', rivals: true, slot: 0 };
  let confirmDelete = 0;
  let confirmReset = false;

  const views = {
    menu() {
      const last = latestSlot();
      const canContinue = last && !last.ended;
      if (canContinue) prefetchCity(last.city);
      const items = [
        canContinue ? `<button class="menu-item primary" data-go="continue"><span>${t('menu.continue')}</span><small>${esc(cityName(last.city))} · ${t('load.slot', { n: last.slot })} · ${t('score.monthOf', { t: last.t, total: SEASON })}</small></button>` : '',
        `<button class="menu-item ${canContinue ? '' : 'primary'}" data-view="new"><span>${t('menu.new')}</span></button>`,
        `<button class="menu-item" data-view="load"><span>${t('menu.load')}</span></button>`,
        `<button class="menu-item" data-view="settings"><span>${t('menu.settings')}</span></button>`,
        `<button class="menu-item" data-view="how"><span>${t('menu.how')}</span></button>`,
        `<button class="menu-item" data-view="credits"><span>${t('menu.credits')}</span></button>`,
      ].join('');
      return `<p class="lead">${esc(t('home.lead'))}</p><nav class="menu">${items}</nav>`;
    },

    new() {
      prefetchCity(draft.city);
      const slots = listSlots();
      if (!draft.slot) draft.slot = (slots.find((s) => s.empty) || slots.slice().sort((a, b) => a.savedAt - b.savedAt)[0]).slot;
      const chosen = slots.find((s) => s.slot === draft.slot);
      const profiles = Object.entries(PROFILES).map(([k, p]) => `
        <button class="profile ${draft.profile === k ? 'on' : ''}" data-profile="${k}">
          ${PROFILE_FIGURES[k]}
          <b>${t(`profile.${k}.name`)}</b>
          <span class="num">${t('profile.start', { cash: { chf: p.cash } })}</span>
          <span class="desc">${esc(t(`profile.${k}.desc`))}</span>
        </button>`).join('');
      const cities = CITY_KEYS.map((key) => `
        <button class="city-pick ${draft.city === key ? 'on' : ''}" data-city="${key}">
          <b>${esc(cityName(key))}</b><span class="num">${integer(CITIES[key].price)} · ${percent(grossYield(key))}</span>
        </button>`).join('');
      const slotButtons = slots.map((s) => `
        <button class="slot-pick ${draft.slot === s.slot ? 'on' : ''}" data-slot="${s.slot}">
          <b>${t('load.slot', { n: s.slot })}</b><span>${s.empty ? t('load.empty') : `${esc(cityName(s.city))} · ${t('score.monthOf', { t: s.t, total: SEASON })}`}</span>
        </button>`).join('');
      return `<div class="step"><h3><span>1</span>${t('new.profile')}</h3><div class="profiles">${profiles}</div></div>
        <div class="step"><h3><span>2</span>${t('new.city')}</h3><div class="city-picks">${cities}</div>
          <p class="note">${t('home.cityStats')}. ${t('new.cityNote')}</p></div>
        <div class="step"><h3><span>3</span>${t('new.options')}</h3>
          <label class="check option"><input type="checkbox" data-rivals ${draft.rivals ? 'checked' : ''}><span><b>${t('profile.rivals')}</b><br>${esc(t('profile.rivalsHint'))}</span></label></div>
        <div class="step"><h3><span>4</span>${t('new.slot')}</h3><div class="slot-picks">${slotButtons}</div>
          ${chosen.empty ? '' : `<p class="note neg">${t('new.overwrite', { n: chosen.slot })}</p>`}</div>
        <div class="buttons"><button class="primary large" data-start>${t('new.start')}</button></div>`;
    },

    load() {
      const rows = listSlots().map((s) => s.empty
        ? `<div class="slot empty"><span class="slot-n">${s.slot}</span><div class="slot-body"><b>${t('load.empty')}</b></div>
            <button data-view="new" data-new-slot="${s.slot}">${t('menu.new')}</button></div>`
        : `<div class="slot"><span class="slot-n">${s.slot}</span>
            <div class="slot-body">${slotSummary(s)}<small class="muted">${t('load.saved', { when: savedAt(s.savedAt) })}${s.ended ? ` · ${t('load.ended')}` : ''}</small></div>
            <div class="slot-actions">
              <button class="primary" data-load="${s.slot}">${t('load.play')}</button>
              <button class="danger" data-delete="${s.slot}">${confirmDelete === s.slot ? t('load.confirmDelete') : t('load.delete')}</button>
            </div></div>`).join('');
      return `<div class="slots">${rows}</div>`;
    },

    settings() {
      const s = settings();
      const lang = segment('lang', LANGUAGES.map(([c]) => c), getLanguage(), (c) => LANGUAGES.find(([x]) => x === c)[1]);
      return `<div class="setting"><h3>${t('lang.label')}</h3>${lang}</div>
        <div class="setting"><h3>${t('settings.quality')}</h3>${segment('quality', OPTIONS.quality, s.quality)}<p class="note">${t('settings.qualityHint')}</p></div>
        <div class="setting"><h3>${t('settings.pace')}</h3>${segment('pace', OPTIONS.pace, s.pace)}<p class="note">${t('settings.paceHint')}</p></div>
        <div class="setting"><h3>${t('settings.labels')}</h3>${toggle('labels', s.labels)}</div>
        <div class="setting"><h3>${t('settings.minimap')}</h3>${toggle('minimap', s.minimap)}</div>
        <div class="setting"><h3>${t('settings.backdrop')}</h3>${toggle('backdrop', s.backdrop)}<p class="note">${t('settings.backdropHint')}</p></div>
        <div class="setting"><h3>${t('settings.data')}</h3>
          <button class="danger" data-reset>${confirmReset ? t('settings.resetConfirm') : t('settings.reset')}</button>
          <p class="note">${t('settings.resetHint')}</p></div>`;
    },

    how() {
      return `<ol class="steps">${STEPS.map((k) => `<li>${esc(t(k))}</li>`).join('')}</ol>
        <p class="note">${esc(t('tut.howNote'))}</p>
        <h3>${t('home.controls')}</h3><p class="note">${esc(t('home.controlsText'))}</p>`;
    },

    credits() {
      const board = getBoard().sort((a, b) => b.exec - a.exec).slice(0, 5);
      const boardHtml = board.length
        ? `<ol class="board">${board.map((e) => `<li><span>${esc(t(`profile.${e.p}.name`))} · ${e.d}</span><span class="num">${e.exec}/100 · ${chf(e.aum)}</span></li>`).join('')}</ol>`
        : `<p class="note">${t('score.boardEmpty')}</p>`;
      return `<h3>${t('home.board')}</h3>${boardHtml}
        <h3>${t('home.data')}</h3>
        <p class="note">${esc(t('home.dataZurich'))}</p>
        <p class="note">${esc(t('home.dataOther'))}</p>
        <p class="note">${esc(t('home.dataWiki'))}</p>
        <p class="note">${esc(t('home.assumptions'))}</p>`;
    },
  };

  const TITLES = { new: 'menu.new', load: 'menu.load', settings: 'menu.settings', how: 'menu.how', credits: 'menu.credits' };

  root.innerHTML = '<div class="home-backdrop"></div><div class="home-shade"></div><section class="home-panel"></section>';
  const panel = root.querySelector('.home-panel');

  function render() {
    panel.classList.toggle('wide', view === 'new');
    panel.innerHTML = `
        <header class="home-head">
          <div class="mark" aria-hidden="true"></div>
          <div class="home-title"><h1>${t('app.title')}</h1><p>${t('app.subtitle')}</p></div>
        </header>
        ${view === 'menu' ? '' : `<div class="view-head"><button class="back" data-view="menu">${t('menu.back')}</button><h2>${t(TITLES[view])}</h2></div>`}
        <div class="home-view">${views[view]()}</div>`;
  }

  function show(next) {
    view = next;
    confirmDelete = 0;
    confirmReset = false;
    render();
    panel.scrollTop = 0;
  }

  function onClick(e) {
    const el = e.target.closest('button');
    if (!el || !root.contains(el)) return;
    const d = el.dataset;
    if (d.newSlot) draft.slot = +d.newSlot;
    if (d.view) return show(d.view);
    if (d.go === 'continue') return onLoad(latestSlot().slot);
    if (d.profile) { draft.profile = d.profile; return render(); }
    if (d.city) { draft.city = d.city; return render(); }
    if (d.slot) { draft.slot = +d.slot; return render(); }
    if ('start' in d) return onNew(draft.slot, draft.profile, { rivals: draft.rivals }, draft.city);
    if (d.load) return onLoad(+d.load);
    if (d.delete) {
      const n = +d.delete;
      if (confirmDelete === n) {
        deleteSlot(n);
        confirmDelete = 0;
      } else confirmDelete = n;
      return render();
    }
    if ('reset' in d) {
      if (confirmReset) {
        localStorage.clear();
        location.reload();
        return null;
      }
      confirmReset = true;
      return render();
    }
    if (d.set === 'lang') return setLanguage(d.value);
    if (d.set) {
      const v = d.value === 'on' ? true : d.value === 'off' ? false : d.value;
      setSetting(d.set, v);
      return render();
    }
    return null;
  }

  function onChange(e) {
    if (e.target.matches('[data-rivals]')) draft.rivals = e.target.checked;
  }

  root.addEventListener('click', onClick);
  root.addEventListener('change', onChange);
  const stop = onLanguageChange(render);
  render();

  return {
    backdrop: root.querySelector('.home-backdrop'),
    dispose() {
      stop();
      root.removeEventListener('click', onClick);
      root.removeEventListener('change', onChange);
      root.innerHTML = '';
    },
  };
}
