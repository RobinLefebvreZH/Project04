import { CITIES } from './cities.js';
import { loadWorld, cityCenter, CELL } from './world.js';
import { createScene } from './scene.js';
import { createControls } from './camera.js';
import { createOverlay } from './overlay.js';
import { createEconomy, activeSlot } from './economy.js';
import { createHud } from './ui.js';
import { createGoals } from './goals.js';
import { createCards } from './cards.js';
import { createRivals } from './rivals.js';
import { createFx } from './fx.js';
import { createTutorial } from './tutorial.js';
import { chf } from './format.js';
import { renderHome } from './home.js';
import { createBackdrop } from './backdrop.js';
import { heroFigure } from './figures.js';
import { settings, setSetting, onSettingsChange, QUALITY, MONTH_SECONDS } from './settings.js';
import { t, cityName, applyStatic } from './i18n.js';
import { closeModal } from './modal.js';
import { play } from './sound.js';
import { track, pageview } from './analytics.js';
import { LANDMARKS } from '../wiki/landmarks.js';

const homeEl = document.getElementById('home');
const gameEl = document.getElementById('game');
const loadingEl = document.getElementById('loading');
const loadBar = document.getElementById('loadBar');
const loadText = document.getElementById('loadText');

let session = null;
let home = null;
let backdrop = null;
let pendingFocus = null;
let routeToken = 0;

const INCOME_FLOATERS = 24;

function animateExtension(s, b) {
  const target = s.world.extra[b];
  s.world.extra[b] = target - 1;
  s.scene.rebuildBuilding(b);
  s.fx.pulse(b);
  setTimeout(() => {
    if (session !== s) return;
    s.world.extra[b] = target;
    s.scene.rebuildBuilding(b);
    s.fx.float(b, t('fx.extended'), 'event');
  }, 500);
}

function showIncome(s, list) {
  if (list.length) play('coin');
  list.sort((a, b) => b[1] - a[1]).slice(0, INCOME_FLOATERS).forEach(([b, amount], i) => {
    setTimeout(() => session === s && s.fx.float(b, `+${chf(amount)}`, 'income'), i * 40);
  });
}

const economy = createEconomy((type, payload) => {
  const s = session;
  if (!s) return;
  const { hud } = s;
  if (type === 'toast') hud.toast(payload);
  else if (type === 'news') hud.renderNews();
  else if (type === 'state') hud.updateState(payload);
  else if (type === 'heat') hud.updateHeat();
  else if (type === 'rebuild') animateExtension(s, payload);
  else if (type === 'season') hud.showSeason(payload);
  else if (type === 'change') hud.refresh(payload);
  else if (type === 'income') showIncome(s, payload);
  else if (type === 'goal') {
    play('goal');
    hud.celebrate(payload);
    if (payload.k === 'mission.first') track('First Purchase', { city: s.key });
  } else if (type === 'pulse') {
    play(payload.k === 'fx.acquired' ? 'buy' : 'goal');
    s.fx.pulse(payload.b);
    s.fx.float(payload.b, t(payload.k), 'event');
  }
});

const host = {
  pause: () => session?.hud.setSpeed(0),
  resume: (speed) => session?.hud.resume(speed),
  focus: (b) => session?.hud.focus(b),
};
const goals = createGoals(economy);
const rivals = createRivals(economy, host);
economy.use(goals);
economy.use(createCards(economy, host));
economy.use(rivals);

const fatalEl = document.getElementById('fatal');

function showFatal(titleKey, textKey, buttons) {
  document.getElementById('fatalTitle').textContent = t(titleKey);
  document.getElementById('fatalText').textContent = t(textKey);
  const box = document.getElementById('fatalButtons');
  box.innerHTML = '';
  for (const [key, action, primary] of buttons) {
    const btn = document.createElement('button');
    btn.textContent = t(key);
    if (primary) btn.className = 'primary';
    btn.addEventListener('click', () => {
      fatalEl.hidden = true;
      action();
    });
    box.appendChild(btn);
  }
  fatalEl.hidden = false;
  play('error');
  box.querySelector('button')?.focus();
}

function browserSupport() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return 'error.webgl';
  if (typeof DecompressionStream === 'undefined') return 'error.browser';
  return null;
}

function storageWorks() {
  try {
    localStorage.setItem('swissblocks.probe', '1');
    localStorage.removeItem('swissblocks.probe');
    return true;
  } catch {
    return false;
  }
}

let errorShown = 0;
function reportError() {
  if (!session || Date.now() - errorShown < 30000) return;
  errorShown = Date.now();
  session.hud.toast({ k: 'error.runtime', p: {}, tone: 'neg' });
}
addEventListener('error', reportError);
addEventListener('unhandledrejection', reportError);

function progress(fraction, text) {
  loadBar.style.width = `${Math.round(fraction * 100)}%`;
  if (text) loadText.textContent = text;
}

function teardown() {
  if (!session) return;
  cancelAnimationFrame(session.frame);
  economy.setSpeed(0);
  economy.save();
  session.tutorial.dispose();
  session.hud.dispose();
  session.fx.dispose();
  session.overlay.dispose();
  session.controls.dispose();
  session.scene.dispose();
  session.canvas.remove();
  session = null;
}

function closeHome() {
  backdrop?.dispose();
  backdrop = null;
  home?.dispose();
  home = null;
}

function enter(city) {
  if (location.hash.slice(1) === city) route();
  else location.hash = city;
}

function showHome() {
  teardown();
  closeModal();
  gameEl.hidden = true;
  loadingEl.hidden = true;
  homeEl.hidden = false;
  document.title = t('app.title');
  if (home) return;
  pageview('');
  home = renderHome(homeEl, {
    storageOk: storageWorks(),
    onNew(slot, profile, options, city) {
      economy.start(slot, profile, options, city);
      track('Game Started', { profile, city, rivals: options.rivals ? 'on' : 'off' });
      enter(city);
    },
    onLoad(slot) {
      if (economy.load(slot)) enter(economy.state.city || 'zurich');
    },
  });
  startBackdrop();
}

function startBackdrop() {
  backdrop?.dispose();
  backdrop = null;
  const el = home.backdrop;
  el.classList.remove('static');
  el.innerHTML = '';
  if (settings().backdrop) backdrop = createBackdrop(el, settings().quality);
  else {
    el.classList.add('static');
    el.innerHTML = heroFigure();
  }
}

onSettingsChange((s, key) => {
  if (home && (key === 'backdrop' || key === 'quality')) startBackdrop();
});

async function startGame(key) {
  const token = ++routeToken;
  teardown();
  closeHome();
  closeModal();
  homeEl.hidden = true;
  applyStatic(loadingEl);
  loadingEl.hidden = false;
  progress(0.02, t('load.city', { city: cityName(key) }));

  let world;
  try {
    world = await loadWorld(key, LANDMARKS, (f) => progress(f));
  } catch {
    if (token !== routeToken) return;
    loadingEl.hidden = true;
    showFatal('error.loadTitle', 'error.loadText', [
      ['error.retry', () => startGame(key), true],
      ['error.menu', () => { location.hash = ''; }],
    ]);
    return;
  }
  if (token !== routeToken) return;
  progress(0.45, t('load.build'));

  const extended = economy.attachWorld(world);
  const canvas = document.createElement('canvas');
  canvas.className = 'view';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', t('a11y.map', { city: cityName(key) }));
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    economy.save();
    showFatal('error.gpuTitle', 'error.gpuText', [['error.reload', () => location.reload(), true]]);
  });
  document.getElementById('stage').appendChild(canvas);
  const scene = await createScene(canvas, world, (f) => progress(0.45 + f * 0.45), QUALITY[settings().quality]);
  if (token !== routeToken) {
    scene.dispose();
    canvas.remove();
    return;
  }
  for (const b of extended) scene.rebuildBuilding(b);

  const hooks = {};
  const controls = createControls(world, scene.camera, canvas, {
    onPick: (b) => hooks.pick(b),
    onFlyChange: (on) => hooks.fly(on),
  });
  const overlay = createOverlay({
    world, camera: scene.camera, controls, canvas,
    labelLayer: document.getElementById('labels'),
    minimap: document.getElementById('minimap'),
    economy,
  });
  const fx = createFx({ world, scene, layer: document.getElementById('fx') });
  const hud = createHud({
    world, economy, scene, controls, overlay, goals, rivals,
    onHome: () => { location.hash = ''; },
    onCity: (c, b) => {
      pendingFocus = b ?? null;
      location.hash = c;
    },
    onTutorial: () => session?.tutorial.start(),
  });
  const tutorial = createTutorial({
    hud,
    economy,
    onFinish: (completed) => {
      setSetting('tutorialDone', true);
      track(completed ? 'Tutorial Completed' : 'Tutorial Skipped');
    },
  });
  hooks.pick = (b) => hud.select(b);
  hooks.fly = (on) => hud.onFlyChange(on);

  const [cx, cy] = cityCenter(world);
  controls.lookFrom((cx + 0.5) * CELL - 40, (cy + 0.5) * CELL, 360, -Math.PI / 2 - 0.35, 0.42);
  controls.update(0);
  scene.camera.updateMatrixWorld();
  for (let i = 0; i < 40; i++) scene.updateLOD();
  hud.syncState();
  overlay.drawMinimapBase(scene.mesher.coverColor);
  hud.start();
  hud.applySettings(settings());

  session = { key, world, scene, controls, overlay, hud, fx, tutorial, canvas, frame: 0 };
  pageview(`play/${key}`);
  track('City Opened', { city: key });
  document.title = `${cityName(key)} · ${t('app.title')}`;
  progress(1);
  loadingEl.hidden = true;
  gameEl.hidden = false;

  if (!settings().tutorialDone && economy.state.t === 0 && !Object.keys(economy.state.owned).length) {
    tutorial.start();
  } else if (economy.state.ended) {
    hud.showProfiles();
  } else if (pendingFocus != null) {
    const b = pendingFocus;
    setTimeout(() => hud.focus(b), 300);
  }
  pendingFocus = null;
  run(session);
}

function run(s) {
  let last = performance.now(), monthClock = 0, daylight = 1, fps = 60, labelClock = 0, miniClock = 0;
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    fps = fps * 0.95 + (1 / Math.max(dt, 1e-3)) * 0.05;
    s.controls.update(dt);
    s.scene.adaptDetail(fps);
    s.scene.updateLOD();
    const g = economy.state;
    if (g.speed) {
      monthClock += dt * g.speed;
      if (monthClock >= MONTH_SECONDS[settings().pace]) {
        monthClock = 0;
        economy.month();
      }
    }
    daylight += ((s.hud.night ? 0 : 1) - daylight) * Math.min(1, dt * 2);
    const [zenith, horizon] = s.scene.setDaylight(daylight);
    gameEl.style.background = `linear-gradient(${zenith} 0%, ${horizon} 55%)`;
    document.getElementById('needle').style.transform = `rotate(${s.controls.heading}rad)`;
    s.fx.update(dt);
    s.scene.render(now / 1000);
    labelClock += dt;
    if (labelClock > 0.05) { labelClock = 0; s.overlay.drawLabels(); }
    miniClock += dt;
    if (miniClock > 0.15) { miniClock = 0; s.overlay.drawMinimap(); }
    if (session === s) s.frame = requestAnimationFrame(loop);
  };
  s.frame = requestAnimationFrame(loop);
}

function route() {
  const unsupported = browserSupport();
  if (unsupported) {
    homeEl.hidden = true;
    showFatal('error.browserTitle', unsupported, []);
    return;
  }
  const key = decodeURIComponent(location.hash.slice(1));
  if (CITIES[key] && !economy.state && !economy.load(activeSlot())) {
    location.hash = '';
    return;
  }
  if (CITIES[key]) {
    if (session?.key !== key) startGame(key);
  } else showHome();
}

addEventListener('hashchange', route);
addEventListener('beforeunload', () => economy.save());
route();

export { economy };
