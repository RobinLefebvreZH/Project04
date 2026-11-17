import { loadWorld, cityCenter, groundAt, CELL } from './world.js';
import { createScene } from './scene.js';
import { QUALITY } from './settings.js';

const CITIES = ['bern', 'lucerne', 'zug', 'lugano'];
const ORBIT_SECONDS = 240;

export function createBackdrop(container, quality) {
  let disposed = false;
  let frame = 0;
  let scene = null;
  let canvas = null;

  async function start() {
    const key = CITIES[(Math.random() * CITIES.length) | 0];
    const world = await loadWorld(key, {});
    if (disposed) return;
    canvas = document.createElement('canvas');
    canvas.className = 'view';
    container.appendChild(canvas);
    const q = QUALITY[quality];
    scene = await createScene(canvas, world, () => {}, { ...q, radius: [q.radius[0], Math.min(700, q.radius[1])] });
    if (disposed) {
      scene.dispose();
      canvas.remove();
      return;
    }
    const [cx, cy] = cityCenter(world);
    const tx = (cx + 0.5) * CELL, tz = (cy + 0.5) * CELL, ty = groundAt(world, tx, tz);
    const cam = scene.camera;
    const place = (time) => {
      const a = (time / ORBIT_SECONDS) * Math.PI * 2;
      cam.position.set(tx + Math.sin(a) * 520, ty + 260, tz + Math.cos(a) * 520);
      cam.lookAt(tx, ty + 20, tz);
    };
    place(0);
    cam.updateMatrixWorld();
    for (let i = 0; i < 30; i++) scene.updateLOD();
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t0 = performance.now();
    const loop = (now) => {
      if (disposed) return;
      const time = (now - t0) / 1000;
      place(still ? 0 : time);
      scene.updateLOD();
      scene.render(time);
      if (!still || time < 2) frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    container.classList.add('ready');
  }

  start().catch(() => container.classList.remove('ready'));

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      scene?.dispose();
      canvas?.remove();
      container.classList.remove('ready');
    },
  };
}
