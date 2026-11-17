import * as THREE from '../vendor/three.module.min.js';
import { CELL, BLOCK, setColumn, updateTopMax } from './world.js';
import { createMesher, CHUNK } from './mesh.js';

const STATE_W = 256, STATE_H = 128;
const MAX_FULL = 260;

const vertexShader = `
attribute vec3 acol;
attribute float kind;
attribute float bid;
uniform sampler2D stateTex;
uniform float selId;
uniform float heat;
varying vec3 vCol;
varying vec3 vN;
varying vec3 vW;
varying float vKind;
varying vec4 vS;
varying float vSel;

vec3 heatCol(float t) {
  return t < 0.5 ? mix(vec3(0.2, 0.45, 0.85), vec3(0.95, 0.85, 0.3), t * 2.0)
                 : mix(vec3(0.95, 0.85, 0.3), vec3(0.9, 0.2, 0.15), (t - 0.5) * 2.0);
}

void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = normal;
  vKind = kind;
  vCol = acol;
  vS = vec4(0.0);
  vSel = 0.0;
  if (bid > 0.5) {
    float b = bid - 1.0;
    vec2 uv = vec2((mod(b, 256.0) + 0.5) / 256.0, (floor(b / 256.0) + 0.5) / 128.0);
    vS = texture2D(stateTex, uv);
    if (heat > 0.5 && kind != 4.0) vCol = mix(vCol, heatCol(vS.g), 0.85);
    if (abs(bid - selId) < 0.5) vSel = 1.0;
  }
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const fragmentShader = `
uniform float time;
uniform float day;
uniform vec3 sunDir;
uniform vec3 fogCol;
uniform float fogD;
varying vec3 vCol;
varying vec3 vN;
varying vec3 vW;
varying float vKind;
varying vec4 vS;
varying float vSel;

float h3(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }

void main() {
  vec3 n = normalize(vN);
  vec3 bp = vW / 2.0;
  vec3 bc = floor(bp - n * 0.5);
  vec2 uv;
  float face;
  if (abs(n.y) > 0.5) { uv = fract(bp.xz); face = n.y > 0.0 ? 1.0 : 0.55; }
  else if (abs(n.x) > 0.5) { uv = vec2(fract(bp.z), fract(bp.y)); face = 0.82; }
  else { uv = vec2(fract(bp.x), fract(bp.y)); face = 0.68; }
  float dist = length(vW - cameraPosition);
  float near = 1.0 - smoothstep(120.0, 700.0, dist);
  int k = int(vKind + 0.5);
  vec3 c = vCol;
  float pix = h3(bc * 1.31 + vec3(floor(uv * 8.0), 0.0));
  float grain = (k == 0 || k == 7 || k == 4 || k == 8) ? 0.16 : (k == 2 ? 0.12 : 0.06);
  c *= (0.95 + 0.07 * h3(bc)) * (1.0 + (pix - 0.5) * grain * near);
  float e = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
  float edge = mix(1.0, smoothstep(0.0, 0.05, e), near * 0.9);
  vec3 emis = vec3(0.0);
  if ((k == 1 || k == 5) && abs(n.y) < 0.5) {
    float wy = fract(vW.y / 3.1);
    float wx = abs(n.x) > 0.5 ? fract(vW.z / 2.0) : fract(vW.x / 2.0);
    bool win = wx > 0.22 && wx < 0.78 && wy > 0.35 && wy < 0.85;
    if (k == 5) win = wy > 0.1 && wy < 0.95 && wx > 0.04 && wx < 0.96;
    if (win) {
      float lit = step(0.5, h3(vec3(floor(vW.x / 2.0), floor(vW.y / 3.1), floor(vW.z / 2.0))));
      vec3 wc = k == 5 ? vec3(0.40, 0.56, 0.66) : vec3(0.30, 0.36, 0.44);
      c = mix(c, wc, (k == 5 ? 0.85 : 0.72) * mix(0.55, 1.0, near));
      emis = vec3(1.0, 0.8, 0.45) * lit * (1.0 - day) * 0.85;
    }
    edge = mix(edge, 1.0, 0.5);
  }
  if (k == 3) {
    float wave = sin(vW.x * 0.08 + time * 1.3) * sin(vW.z * 0.07 - time * 0.9);
    vec3 V = normalize(cameraPosition - vW);
    float fr = pow(1.0 - max(V.y, 0.0), 3.0);
    c = mix(vec3(0.15, 0.38, 0.56), fogCol * 0.9, fr * 0.6) + wave * 0.03;
    edge = 1.0;
  }
  if (k == 4) c *= 0.82 + 0.3 * step(0.55, pix);
  if (k == 9) edge = mix(edge, 1.0, 0.4);
  c *= mix(0.74, 1.0, edge);
  if (vS.r > 0.9) c = mix(c, vec3(1.0, 0.78, 0.25), 0.5 + 0.12 * sin(time * 2.5));
  else if (vS.r > 0.4) {
    float stripe = step(0.5, fract((vW.x + vW.y + vW.z) * 0.2));
    c = mix(c, mix(vec3(1.0, 0.6, 0.1), vec3(0.15), stripe), 0.55);
  }
  if (vS.r > 0.2 && vS.r < 0.35) c = mix(c, vec3(0.36, 0.33, 0.78), 0.45);
  c = mix(c, vec3(1.0, 0.95, 0.7), vS.b * 0.75);
  emis += vec3(1.0, 0.85, 0.4) * vS.b * 0.35;
  if (vSel > 0.5) {
    c = mix(c, vec3(1.0, 1.0, 0.55), 0.35 + 0.2 * sin(time * 7.0));
    emis += vec3(0.12, 0.12, 0.04);
  }
  float sun = max(dot(n, sunDir), 0.0);
  vec3 sky = mix(vec3(0.10, 0.12, 0.22), vec3(0.64, 0.71, 0.82), day);
  vec3 sunc = mix(vec3(0.07, 0.08, 0.15), vec3(1.0, 0.95, 0.85), day);
  vec3 light = sky * 0.72 * face + sunc * sun * 0.58 + vec3(0.05);
  if (k == 3) light += pow(max(dot(reflect(-sunDir, n), normalize(cameraPosition - vW)), 0.0), 60.0) * 0.6 * day;
  vec3 col = c * light + emis;
  float f = 1.0 - exp(-dist * fogD);
  gl_FragColor = vec4(mix(col, fogCol, clamp(f, 0.0, 0.95)), 1.0);
}`;

export const STATE = { none: 0, defect: 128, owned: 255 };

export async function createScene(canvas, world, onProgress = () => {}, quality = { pixelRatio: 1.75, antialias: true, radius: [420, 1100] }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: quality.antialias, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, quality.pixelRatio));
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 1, 24000);
  const stateData = new Uint8Array(STATE_W * STATE_H * 4);
  const stateTex = new THREE.DataTexture(stateData, STATE_W, STATE_H, THREE.RGBAFormat, THREE.UnsignedByteType);
  stateTex.needsUpdate = true;

  const uniforms = {
    stateTex: { value: stateTex },
    selId: { value: -1 },
    heat: { value: 0 },
    time: { value: 0 },
    day: { value: 1 },
    sunDir: { value: new THREE.Vector3(0.45, 0.8, 0.35).normalize() },
    fogCol: { value: new THREE.Color(0xc4d8e8) },
    fogD: { value: 0.00016 },
  };
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });

  const mesher = createMesher(world);
  const chunks = [];
  const tick = () => new Promise((r) => setTimeout(r, 0));
  for (let cy = 0; cy < mesher.rows; cy++) {
    for (let cx = 0; cx < mesher.columns; cx++) {
      const coarse = mesher.buildCoarse(cx, cy);
      const mesh = new THREE.Mesh(coarse, material);
      scene.add(mesh);
      chunks.push({ cx, cy, mesh, coarse, full: null, useFull: false, d: 0, mx: (cx + 0.5) * CHUNK * CELL, mz: (cy + 0.5) * CHUNK * CELL });
    }
    onProgress(cy / mesher.rows);
    if (cy % 4 === 0) await tick();
  }

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60000, 60000).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x8fa489 }));
  ground.position.set((world.W * CELL) / 2, -0.5, (world.H * CELL) / 2);
  scene.add(ground);

  let fullCount = 0;
  const [minRadius, maxRadius] = quality.radius;
  let radius = Math.min(750, maxRadius);

  function updateLOD() {
    const cp = camera.position;
    const t0 = performance.now();
    const want = [];
    for (const ch of chunks) {
      const gi = Math.min(world.N - 1, Math.floor(ch.mz / CELL) * world.W + Math.floor(ch.mx / CELL));
      const gy = world.groundLevel[gi] * BLOCK;
      const dx = ch.mx - cp.x, dz = ch.mz - cp.z, dy = gy - cp.y;
      ch.d = Math.sqrt(dx * dx + dz * dz + dy * dy * 0.6);
      const near = ch.d < radius;
      if (near && !ch.full) want.push(ch);
      if (near && ch.full && !ch.useFull) { ch.useFull = true; ch.mesh.geometry = ch.full; }
      if (!near && ch.useFull && ch.d > radius * 1.12) { ch.useFull = false; ch.mesh.geometry = ch.coarse; }
    }
    want.sort((a, b) => a.d - b.d);
    for (const ch of want) {
      if (performance.now() - t0 > 9) break;
      ch.full = mesher.buildFull(ch.cx, ch.cy);
      fullCount++;
      ch.useFull = true;
      ch.mesh.geometry = ch.full;
    }
    if (fullCount > MAX_FULL) {
      const far = chunks.filter((c) => c.full && !c.useFull).sort((a, b) => b.d - a.d);
      for (const c of far.slice(0, fullCount - (MAX_FULL - 40))) {
        c.full.dispose();
        c.full = null;
        fullCount--;
      }
    }
  }

  function rebuildBuilding(b) {
    const touched = new Set();
    for (const i of world.cells[b]) {
      setColumn(world, i);
      const x = i % world.W, y = (i / world.W) | 0;
      for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= world.W || yy >= world.H) continue;
        touched.add(Math.floor(yy / CHUNK) * mesher.columns + Math.floor(xx / CHUNK));
      }
    }
    updateTopMax(world, b);
    for (const c of touched) {
      const ch = chunks[c];
      mesher.refreshCoarse(ch.cx, ch.cy);
      ch.coarse.dispose();
      ch.coarse = mesher.buildCoarse(ch.cx, ch.cy);
      if (ch.full) { ch.full.dispose(); ch.full = mesher.buildFull(ch.cx, ch.cy); }
      ch.mesh.geometry = ch.full && ch.useFull ? ch.full : ch.coarse;
    }
  }

  function setBuildingState(b, owned, heat) {
    if (b < 0 || b >= STATE_W * STATE_H) return;
    stateData[b * 4] = owned;
    stateData[b * 4 + 1] = heat;
  }

  const skyDay = new THREE.Color(0xc4d8e8), skyNight = new THREE.Color(0x182238);
  const groundDay = new THREE.Color(0x9fb39a), groundNight = new THREE.Color(0x1c2a24);
  const zenithDay = new THREE.Color(0x5b95cf);
  function setDaylight(f) {
    uniforms.day.value = f;
    const fog = skyNight.clone().lerp(skyDay, f);
    uniforms.fogCol.value.copy(fog);
    ground.material.color.copy(groundNight.clone().lerp(groundDay, f));
    uniforms.sunDir.value.set(0.45, 0.25 + 0.55 * f, 0.35).normalize();
    return [skyNight.clone().lerp(zenithDay, f).getStyle(), fog.getStyle()];
  }

  function adaptDetail(fps) {
    if (fps < 28 && radius > minRadius) radius -= 4;
    else if (fps > 50 && radius < maxRadius) radius += 2;
  }

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  return {
    renderer, scene, camera, uniforms, mesher,
    updateLOD,
    rebuildBuilding,
    setBuildingState,
    commitState() { stateTex.needsUpdate = true; },
    setPulse(b, v) { if (b >= 0 && b < STATE_W * STATE_H) stateData[b * 4 + 2] = v; },
    select(b) { uniforms.selId.value = b >= 0 ? b + 1 : -1; },
    setHeat(on) { uniforms.heat.value = on ? 1 : 0; },
    setDaylight,
    adaptDetail,
    render(time) {
      uniforms.time.value = time;
      renderer.render(scene, camera);
    },
    dispose() {
      removeEventListener('resize', resize);
      for (const ch of chunks) { ch.coarse.dispose(); ch.full?.dispose(); }
      material.dispose();
      stateTex.dispose();
      ground.geometry.dispose();
      ground.material.dispose();
      renderer.dispose();
    },
  };
}
