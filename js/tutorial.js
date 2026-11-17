import { t } from './i18n.js';
import { escapeHtml as esc } from './format.js';
import { cityCenter } from './world.js';

const STEPS = [
  { id: 'welcome' },
  { id: 'move', touch: true },
  { id: 'select', target: '#search', until: (s) => s.hud.selected >= 0, suggest: true },
  { id: 'buy', target: '#info', until: (s) => s.owned > s.ownedAtStart, suggest: true },
  { id: 'time', target: '#topbar .speed', until: (s) => s.speed > 0, running: true },
  { id: 'money', target: '#topbar' },
  { id: 'goals', target: '#tabs [data-tab="goals"]', until: (s) => s.hud.tab === 'goals' },
  { id: 'defects', target: '#tabs [data-tab="defects"]' },
  { id: 'done' },
];

const isTouch = () => matchMedia('(pointer: coarse)').matches;

export function createTutorial({ hud, economy, onFinish }) {
  const root = document.getElementById('coach');
  const ring = root.querySelector('.coach-ring');
  const box = root.querySelector('.coach-box');
  let index = -1;
  let timer = 0;
  let ownedAtStart = 0;

  const count = () => Object.keys(economy.state.owned).length;

  function affordable() {
    const w = economy.world;
    const [cx, cy] = cityCenter(w);
    let best = -1, bestDistance = Infinity;
    for (let b = 0; b < w.count; b++) {
      if (!economy.buyable(b) || economy.owned(b)) continue;
      const d = Math.hypot(w.cx[b] - cx, w.cy[b] - cy);
      if (d >= bestDistance) continue;
      if (economy.financing(b, economy.askPrice(b)).need > economy.state.cash * 0.95) continue;
      best = b;
      bestDistance = d;
    }
    return best;
  }

  function place(step) {
    const target = step.target && document.querySelector(step.target);
    const visible = target && target.offsetParent !== null && !target.hidden;
    ring.hidden = !visible;
    root.classList.toggle('centered', !visible);
    if (!visible) {
      box.style.left = box.style.top = '';
      return;
    }
    const r = target.getBoundingClientRect();
    const pad = 6;
    Object.assign(ring.style, { left: `${r.left - pad}px`, top: `${r.top - pad}px`, width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px` });
    if (innerWidth < 700) {
      box.style.left = box.style.top = '';
      root.classList.toggle('dock-top', r.top + r.bottom > innerHeight);
      return;
    }
    root.classList.remove('dock-top');
    const bw = box.offsetWidth, bh = box.offsetHeight;
    let left = r.left + r.width / 2 - bw / 2;
    let top = r.bottom + 16;
    if (top + bh > innerHeight - 12) top = r.top - bh - 16;
    if (top < 12) {
      top = Math.max(12, Math.min(innerHeight - bh - 12, r.top));
      left = r.right + 16 + bw < innerWidth ? r.right + 16 : r.left - bw - 16;
    }
    box.style.left = `${Math.max(12, Math.min(innerWidth - bw - 12, left))}px`;
    box.style.top = `${top}px`;
  }

  function render() {
    const step = STEPS[index];
    const key = step.touch && isTouch() ? `tut.${step.id}.touch` : `tut.${step.id}.text`;
    const last = index === STEPS.length - 1;
    box.innerHTML = `<span class="kind">${t('tut.step', { n: index + 1, total: STEPS.length })}</span>
      <h3>${esc(t(`tut.${step.id}.title`))}</h3>
      <p>${esc(t(key))}</p>
      <div class="buttons">
        ${last ? '' : `<button data-skip>${t('tut.skip')}</button>`}
        ${step.suggest ? `<button class="primary" data-suggest>${t('tut.suggest')}</button>` : ''}
        ${step.until ? '' : `<button class="primary" data-next>${t(last ? 'tut.finish' : 'tut.next')}</button>`}
      </div>`;
    place(step);
  }

  function go(i) {
    index = i;
    if (index >= STEPS.length) return finish(true);
    const step = STEPS[index];
    if (step.id === 'buy') ownedAtStart = count();
    if (!step.running) hud.setSpeed(0);
    render();
    return null;
  }

  function tick() {
    const step = STEPS[index];
    if (!step) return;
    const state = { hud, owned: count(), ownedAtStart, speed: economy.state.speed };
    if (step.until && step.until(state)) go(index + 1);
    else place(step);
  }

  function finish(completed) {
    clearInterval(timer);
    root.hidden = true;
    index = -1;
    onFinish?.();
    if (completed) hud.setSpeed(1);
  }

  function onClick(e) {
    if (e.target.closest('[data-suggest]')) {
      const b = affordable();
      if (b >= 0) hud.focus(b);
    } else if (e.target.closest('[data-next]')) go(index + 1);
    else if (e.target.closest('[data-skip]')) finish(false);
  }
  box.addEventListener('click', onClick);

  return {
    start() {
      root.hidden = false;
      go(0);
      clearInterval(timer);
      timer = setInterval(tick, 250);
    },
    get active() { return index >= 0; },
    dispose() {
      clearInterval(timer);
      box.removeEventListener('click', onClick);
      root.hidden = true;
    },
  };
}
