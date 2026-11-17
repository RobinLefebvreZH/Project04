import { settings } from './settings.js';

let ctx = null;
let master = null;
const lastPlayed = new Map();

function context() {
  if (ctx) return ctx;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  master = ctx.createGain();
  master.connect(ctx.destination);
  return ctx;
}

function unlock() {
  const c = context();
  if (c && c.state === 'suspended') c.resume();
}
addEventListener('pointerdown', unlock, { passive: true });
addEventListener('keydown', unlock);

function tone(freq, start, duration, { type = 'sine', gain = 0.2, glide = 0 } = {}) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (glide) osc.frequency.exponentialRampToValueAtTime(freq * glide, start + duration);
  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(gain, start + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(env).connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function noise(start, duration, { gain = 0.2, from = 2000, to = 400 } = {}) {
  const length = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(from, start);
  filter.frequency.exponentialRampToValueAtTime(to, start + duration);
  const env = ctx.createGain();
  env.gain.setValueAtTime(gain, start);
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  src.connect(filter).connect(env).connect(master);
  src.start(start);
}

const SOUNDS = {
  click(t) { tone(1100, t, 0.03, { gain: 0.05 }); },
  tick(t) { tone(1800, t, 0.025, { type: 'square', gain: 0.03 }); },
  coin(t) {
    tone(1320, t, 0.08, { gain: 0.08 });
    tone(1760, t + 0.06, 0.12, { gain: 0.08 });
  },
  buy(t) {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.07, 0.22, { type: 'triangle', gain: 0.14 }));
  },
  gavel(t) {
    noise(t, 0.09, { gain: 0.5, from: 3000, to: 300 });
    tone(150, t, 0.16, { gain: 0.35, glide: 0.6 });
  },
  goal(t) {
    tone(880, t, 0.9, { gain: 0.12 });
    tone(1320, t, 0.6, { gain: 0.05 });
    tone(1175, t + 0.12, 0.9, { gain: 0.1 });
    tone(1760, t + 0.12, 0.5, { gain: 0.04 });
  },
  card(t) { noise(t, 0.25, { gain: 0.12, from: 600, to: 3000 }); },
  alert(t) {
    tone(330, t, 0.14, { type: 'square', gain: 0.05 });
    tone(247, t + 0.16, 0.2, { type: 'square', gain: 0.05 });
  },
  error(t) { tone(140, t, 0.14, { type: 'square', gain: 0.06 }); },
};

export function play(name) {
  if (!settings().sound) return;
  const c = context();
  if (!c || c.state !== 'running' || !SOUNDS[name]) return;
  const now = c.currentTime;
  if (now - (lastPlayed.get(name) ?? -1) < 0.12) return;
  lastPlayed.set(name, now);
  master.gain.value = settings().volume;
  SOUNDS[name](now + 0.01);
}
