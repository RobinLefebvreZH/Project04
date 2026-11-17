import * as THREE from '../vendor/three.module.min.js';
import { CELL, BLOCK } from './world.js';

const FLOAT_SECONDS = 1.8;
const PULSE_SECONDS = 1.4;
const MAX_FLOATERS = 40;

export function createFx({ world, scene, layer }) {
  const floaters = [];
  const pulses = new Map();
  const v = new THREE.Vector3();

  function anchor(b) {
    return [(world.cx[b] + 0.5) * CELL, world.topMax[b] * BLOCK + 4, (world.cy[b] + 0.5) * CELL];
  }

  function float(b, text, cls = '') {
    if (b < 0 || floaters.length >= MAX_FLOATERS) return;
    const el = document.createElement('div');
    el.className = `floater ${cls}`;
    el.textContent = text;
    layer.appendChild(el);
    floaters.push({ el, pos: anchor(b), age: 0 });
  }

  function pulse(b) {
    if (b >= 0) pulses.set(b, PULSE_SECONDS);
  }

  function update(dt) {
    const cam = scene.camera;
    const w = innerWidth, h = innerHeight;
    for (let i = floaters.length - 1; i >= 0; i--) {
      const f = floaters[i];
      f.age += dt;
      if (f.age >= FLOAT_SECONDS) {
        f.el.remove();
        floaters.splice(i, 1);
        continue;
      }
      const k = f.age / FLOAT_SECONDS;
      v.set(f.pos[0], f.pos[1] + k * 14, f.pos[2]).project(cam);
      if (v.z > 1 || Math.abs(v.x) > 1.1 || Math.abs(v.y) > 1.1) {
        f.el.style.opacity = 0;
        continue;
      }
      f.el.style.opacity = k < 0.15 ? k / 0.15 : 1 - Math.max(0, (k - 0.6) / 0.4);
      f.el.style.transform = `translate(${((v.x + 1) / 2) * w}px,${((1 - v.y) / 2) * h}px) translate(-50%,-100%)`;
    }
    if (!pulses.size) return;
    for (const [b, left] of pulses) {
      const next = left - dt;
      const phase = Math.max(0, next) / PULSE_SECONDS;
      scene.setPulse(b, Math.round(255 * phase * (0.6 + 0.4 * Math.sin(phase * Math.PI * 6))));
      if (next <= 0) pulses.delete(b);
      else pulses.set(b, next);
    }
    scene.commitState();
  }

  return {
    float,
    pulse,
    update,
    dispose() {
      for (const f of floaters) f.el.remove();
      floaters.length = 0;
    },
  };
}
