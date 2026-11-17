import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { CELL, BLOCK, groundAt } from './world.js';
import { localized, buildingName } from './i18n.js';

const SKIP = /^(Limmat|Sihl|Schanzengraben|Zürichsee|Rhein|Aare|Reuss|Rhône|Arve|Lac Léman|Lac de Genève|Vierwaldstättersee|Zugersee|Lago di Lugano|Ceresio)$/;
const PRIORITY = /Kirche|münster|Münster|Cathédrale|Cattedrale|Kathedrale|ETH|Universit|Bahnhof|Gare|Stazione|Museum|Rathaus|Hôtel de Ville|Bundeshaus|Stadthaus/;

function quarterLabels(world) {
  const acc = {};
  for (let i = 0; i < world.N; i += 13) {
    const q = world.quarterGrid[i];
    if (!q) continue;
    const a = (acc[q] = acc[q] || [0, 0, 0]);
    a[0] += i % world.W;
    a[1] += (i / world.W) | 0;
    a[2]++;
  }
  return Object.entries(acc)
    .filter(([, a]) => a[2] >= 300)
    .map(([q, a]) => ({ name: world.quarters[q] ? world.quarters[q][0] : q, x: a[0] / a[2], y: a[1] / a[2] }));
}

export function createOverlay({ world, camera, controls, canvas, labelLayer, minimap, economy }) {
  const quarters = quarterLabels(world);
  const landmarks = world.labels
    .filter((l) => l.name && l.name.length < 48 && !SKIP.test(l.name))
    .map((l) => ({ ...l, rank: (l.bid ? world.cells[l.bid - 1].length : 0) + (PRIORITY.test(l.name) || (l.bid && world.landmark.has(l.bid - 1)) ? 5000 : 0) }))
    .sort((a, b) => b.rank - a.rank);
  const pool = [];
  const v = new THREE.Vector3();
  let visible = true;

  const mctx = minimap.getContext('2d');
  const MW = minimap.width, MH = minimap.height;
  let base = null;

  function landmarkName(l) {
    const entry = l.bid ? world.landmark.get(l.bid - 1) : null;
    return entry ? localized(entry.name) : l.name;
  }

  function drawLabels() {
    let n = 0;
    if (!visible) {
      for (const el of pool) el.style.display = 'none';
      return;
    }
    const r = canvas.getBoundingClientRect();
    const taken = [];
    const camD = controls.viewDistance;
    const put = (text, x, y, z, cls, maxD, occlude) => {
      v.set(x, y, z);
      const dist = v.distanceTo(camera.position);
      if (dist > maxD) return;
      if (occlude && controls.occluded(v, dist)) return;
      v.project(camera);
      if (v.z > 1 || Math.abs(v.x) > 1.02 || Math.abs(v.y) > 1.02) return;
      const sx = ((v.x + 1) / 2) * r.width, sy = ((1 - v.y) / 2) * r.height;
      const w = text.length * (cls === 'q' ? 9 : 7.2) + 8, h = 16;
      const rect = [sx - w / 2, sy - h, sx + w / 2, sy];
      for (const t of taken) if (rect[0] < t[2] && rect[2] > t[0] && rect[1] < t[3] && rect[3] > t[1]) return;
      taken.push(rect);
      let el = pool[n];
      if (!el) {
        el = document.createElement('div');
        labelLayer.appendChild(el);
        pool.push(el);
      }
      el.className = `label ${cls}`;
      if (el.textContent !== text) el.textContent = text;
      el.style.display = 'block';
      el.style.transform = `translate(${sx}px,${sy}px) translate(-50%,-100%)`;
      el.style.opacity = Math.max(0.45, Math.min(1, 1.5 - dist / maxD));
      n++;
    };
    const G = economy.state;
    for (const k in G.owned) {
      const o = G.owned[k];
      if (o.city !== world.key) continue;
      put(buildingName(o.city, o.b, o.label), (world.cx[o.b] + 0.5) * CELL, world.topMax[o.b] * BLOCK + 6, (world.cy[o.b] + 0.5) * CELL, 'own', 6000);
    }
    const putQuarters = () => {
      for (const q of quarters) {
        const x = (q.x + 0.5) * CELL, z = (q.y + 0.5) * CELL;
        put(q.name, x, groundAt(world, x, z) + 40, z, 'q', 9000);
      }
    };
    if (camD > 1500) putQuarters();
    else {
      for (const l of landmarks) {
        const top = l.bid ? world.topMax[l.bid - 1] : world.top[l.y * world.W + l.x];
        put(landmarkName(l), (l.x + 0.5) * CELL, top * BLOCK + 5, (l.y + 0.5) * CELL, '', Math.min(2200, 700 + camD * 1.3), true);
      }
      if (camD > 700) putQuarters();
    }
    for (let i = n; i < pool.length; i++) pool[i].style.display = 'none';
  }

  function drawMinimapBase(coverColor) {
    const img = mctx.createImageData(world.W, world.H);
    for (let i = 0; i < world.N; i++) {
      const b = world.id[i] - 1;
      let r, g, bl;
      if (b >= 0 && !world.bridge[b]) {
        const t = Math.min(1, (world.top[i] - world.baseLevel[i]) / 30);
        r = 150 + 80 * t; g = 140 + 70 * t; bl = 130 + 60 * t;
      } else {
        const c = coverColor(world.cover[i]);
        r = (c >> 16) & 255; g = (c >> 8) & 255; bl = c & 255;
      }
      img.data[i * 4] = r;
      img.data[i * 4 + 1] = g;
      img.data[i * 4 + 2] = bl;
      img.data[i * 4 + 3] = 255;
    }
    base = document.createElement('canvas');
    base.width = world.W;
    base.height = world.H;
    base.getContext('2d').putImageData(img, 0, 0);
  }

  function drawMinimap() {
    if (!base) return;
    mctx.imageSmoothingEnabled = false;
    mctx.drawImage(base, 0, 0, MW, MH);
    const sx = MW / world.W, sy = MH / world.H;
    mctx.fillStyle = '#d6a520';
    const G = economy.state;
    for (const k in G.owned) {
      const o = G.owned[k];
      if (o.city === world.key) mctx.fillRect(world.cx[o.b] * sx - 2, world.cy[o.b] * sy - 2, 5, 5);
    }
    const p = controls.flying ? controls.position : { x: controls.orbit.tx, z: controls.orbit.tz };
    const tx = (p.x / CELL) * sx, tz = (p.z / CELL) * sy;
    const yaw = controls.flying ? controls.heading - Math.PI : controls.orbit.yaw + Math.PI;
    mctx.strokeStyle = '#ffffff';
    mctx.lineWidth = 2;
    mctx.beginPath();
    mctx.arc(tx, tz, 5, 0, Math.PI * 2);
    mctx.stroke();
    mctx.beginPath();
    mctx.moveTo(tx, tz);
    mctx.lineTo(tx + Math.sin(yaw) * 14, tz + Math.cos(yaw) * 14);
    mctx.stroke();
  }

  const onMiniClick = (e) => {
    const r = minimap.getBoundingClientRect();
    controls.flyTo(((e.clientX - r.left) / r.width) * world.W * CELL, ((e.clientY - r.top) / r.height) * world.H * CELL);
  };
  minimap.addEventListener('click', onMiniClick);

  return {
    drawLabels,
    drawMinimap,
    drawMinimapBase,
    get visible() { return visible; },
    setVisible(on) { visible = on; },
    dispose() {
      minimap.removeEventListener('click', onMiniClick);
      for (const el of pool) el.remove();
    },
  };
}
