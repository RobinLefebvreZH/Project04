import { CITIES, CITY_KEYS, grossYield } from './cities.js';
import { t, cityName, onLanguageChange, languageSelect } from './i18n.js';
import { integer, decimal, percent, chf, escapeHtml as esc } from './format.js';
import { heroFigure } from './figures.js';
import { getBoard, SEASON } from './economy.js';

export function renderHome(root, { saved, onPlay, onContinue }) {
  function render() {
    const cities = CITY_KEYS.map((key, i) => {
      const c = CITIES[key];
      return `<button class="city-card" data-city="${key}">
        <span class="index">${String(i + 1).padStart(2, '0')}</span>
        <b>${esc(cityName(key))}</b>
        <span class="num">${integer(c.price)} · ${decimal(c.rent, 1)} · ${percent(grossYield(key))}</span>
        <span class="go">${t('home.play')}</span>
      </button>`;
    }).join('');
    const board = getBoard().sort((a, b) => b.exec - a.exec).slice(0, 5);
    const boardHtml = board.length
      ? `<ol class="board">${board.map((e) => `<li><span>${esc(t(`profile.${e.p}.name`))} · ${e.d}</span><span class="num">${e.exec}/100 · ${chf(e.aum)}</span></li>`).join('')}</ol>`
      : `<p class="muted">${t('score.boardEmpty')}</p>`;
    const continueHtml = saved
      ? `<button class="primary large" data-continue>${t('home.continue')} <small>${esc(cityName(saved.city))} · ${t('home.continueIn', { m: saved.t, total: SEASON })}</small></button>`
      : '';

    root.innerHTML = `
      <header class="home-head">
        <div class="mark" aria-hidden="true"></div>
        <div class="home-title">
          <h1>${t('app.title')}</h1>
          <p>${t('app.subtitle')}</p>
        </div>
        <div class="home-lang"></div>
      </header>
      <section class="home-hero">
        <div class="hero-text">
          <p class="lead">${esc(t('home.lead'))}</p>
          ${continueHtml}
        </div>
        ${heroFigure()}
      </section>
      <section>
        <div class="section-head"><h2>${t('home.cities')}</h2><span class="muted">${t('home.cityStats')}</span></div>
        <div class="city-grid">${cities}</div>
      </section>
      <section class="home-columns">
        <div>
          <h2>${t('home.how')}</h2>
          <ol class="steps">${['home.how1', 'home.how2', 'home.how3', 'home.how4'].map((k) => `<li>${esc(t(k))}</li>`).join('')}</ol>
          <h3>${t('home.controls')}</h3>
          <p class="muted">${esc(t('home.controlsText'))}</p>
        </div>
        <div>
          <h2>${t('home.board')}</h2>
          ${boardHtml}
          <h3>${t('home.data')}</h3>
          <p class="muted small">${esc(t('home.dataZurich'))}</p>
          <p class="muted small">${esc(t('home.dataOther'))}</p>
          <p class="muted small">${esc(t('home.dataWiki'))}</p>
          <p class="muted small">${esc(t('home.assumptions'))}</p>
        </div>
      </section>`;
    root.querySelector('.home-lang').appendChild(languageSelect('lang-select'));
    for (const btn of root.querySelectorAll('[data-city]')) btn.addEventListener('click', () => onPlay(btn.dataset.city));
    root.querySelector('[data-continue]')?.addEventListener('click', onContinue);
  }
  render();
  const stop = onLanguageChange(render);
  return () => stop();
}
