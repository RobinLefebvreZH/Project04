import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { CELL, BLOCK, hash2, artOf } from './world.js';

export const KIND = { terrain: 0, wall: 1, roof: 2, water: 3, leaf: 4, glass: 5, flat: 6, side: 7, wood: 8, deck: 9 };

const COVER_TOP = { 0: 0xbdb7ac, 1: 0x2f6f9f, 2: 0x55595f, 3: 0xb9b3a6, 4: 0xcdb98f, 5: 0x7b6a5a, 6: 0x6cab4f, 7: 0x3f7a35, 8: 0x91c05c, 9: 0x5f9b4b, 10: 0x80993c, 11: 0xaaa59b, 12: 0xa9a49c, 13: 0x8fae6a };
const COVER_SIDE = { 0: 0x8e877c, 1: 0x2f6f9f, 2: 0x6a6a6a, 3: 0x8e877c, 4: 0x8a6b45, 5: 0x6a5848, 6: 0x7a5634, 7: 0x6b4a2c, 8: 0x7a5634, 9: 0x7a5634, 10: 0x7a5634, 11: 0x8e877c, 12: 0x8e877c, 13: 0x7a5634 };
const FACADES = [0xefe6d2, 0xe8d9b5, 0xdcc9a3, 0xf2efe8, 0xd9cfc3, 0xe9c9a8, 0xcdbfa8, 0xe3dccb, 0xd4b896, 0xf0dcc0, 0xe6e1d6, 0xd8c4a6];
const OFFICES = [0xc3c7cb, 0xb0b8c0, 0xd2d0ca, 0xa9b2ba, 0xbcb6ab];
const LEAVES = [0x3f8a34, 0x2f6e2a, 0x4c9a3c, 0x3a7d38];
const LOD_FACTOR = 4;
export const CHUNK = 64;

export function createMesher(world) {
  const { W, H } = world;
  const nb = world.count;
  const wallColor = new Uint32Array(nb);
  const roofColor = new Uint32Array(nb);
  const flatColor = new Uint32Array(nb);
  for (let b = 0; b < nb; b++) {
    const art = artOf(world, b);
    const r = hash2(b, 7), rr = hash2(b, 3);
    let w;
    if (world.church[b]) w = 0xcdbd9c;
    else if (world.glass[b]) w = 0x6f8fa3;
    else if (art === 'Gebaeude_Verwaltung') w = OFFICES[(r * OFFICES.length) | 0];
    else if (art === 'Gebaeude_Industrie_Gewerbe') w = r < 0.5 ? 0x9a5a44 : 0xa8a39a;
    else if (art === 'Gebaeude_Verkehr') w = 0xc8bca4;
    else if (art === 'Gebaeude_Nebengebaeude' || art === 'Unterstand') w = 0xa08f7a;
    else w = FACADES[(r * FACADES.length) | 0];
    wallColor[b] = w;
    roofColor[b] = world.church[b] ? (rr < 0.5 ? 0x5f8a78 : 0x9a4a36) : rr < 0.55 ? 0xa4503a : rr < 0.8 ? 0x8c4632 : rr < 0.92 ? 0x6c5a52 : 0x5a6670;
    flatColor[b] = rr < 0.6 ? 0x8d8a84 : rr < 0.85 ? 0x777a7d : 0x8fa070;
  }

  const CW = Math.ceil(W / LOD_FACTOR), CH = Math.ceil(H / LOD_FACTOR);
  const rep = new Int32Array(CW * CH);
  const isBuilding = (i) => {
    const b = world.id[i] - 1;
    return b >= 0 && !world.bridge[b];
  };
  function representative(cx, cy) {
    const built = [];
    let open = -1;
    for (let dy = 0; dy < LOD_FACTOR; dy++) {
      for (let dx = 0; dx < LOD_FACTOR; dx++) {
        const x = cx * LOD_FACTOR + dx, y = cy * LOD_FACTOR + dy;
        if (x >= W || y >= H) continue;
        const i = y * W + x;
        if (isBuilding(i)) built.push(i);
        else if (open < 0 || (dx === 1 && dy === 1)) open = i;
      }
    }
    if (built.length >= 6) {
      built.sort((a, b) => world.top[a] - world.top[b]);
      return built[Math.min(built.length - 1, Math.floor(built.length * 0.7))];
    }
    return open >= 0 ? open : built[0] ?? Math.min(world.N - 1, cy * LOD_FACTOR * W + cx * LOD_FACTOR);
  }
  for (let cy = 0; cy < CH; cy++) for (let cx = 0; cx < CW; cx++) rep[cy * CW + cx] = representative(cx, cy);

  const NCX = Math.ceil(W / CHUNK), NCY = Math.ceil(H / CHUNK);
  const treeBins = new Map();
  function addTree(x, y, r) {
    if (x < 1 || y < 1 || x >= W - 1 || y >= H - 1) return;
    const i = y * W + x;
    if (isBuilding(i)) return;
    const c = world.cover[i];
    if (c === 1 || c === 2) return;
    const k = Math.floor(y / CHUNK) * NCX + Math.floor(x / CHUNK);
    if (!treeBins.has(k)) treeBins.set(k, []);
    treeBins.get(k).push([x, y, r, world.groundLevel[i], LEAVES[(hash2(x, y) * 4) | 0]]);
  }
  for (const [mx, my, d] of world.trees) addTree(Math.floor(mx / CELL), Math.floor(my / CELL), Math.max(1, Math.min(3, Math.round((d || 6) / 4))));
  for (let y = 2; y < H - 2; y += 3) {
    for (let x = 2; x < W - 2; x += 3) {
      if (world.cover[y * W + x] === 7 && hash2(x, y) < 0.35) addTree(x, y, hash2(y, x) < 0.5 ? 2 : 1);
    }
  }

  function topInfo(i) {
    const b = world.id[i] - 1;
    if (b >= 0 && !world.bridge[b]) return world.roof[i] >> 15 ? [roofColor[b], KIND.roof, b + 1] : [flatColor[b], KIND.flat, b + 1];
    const c = world.cover[i];
    return [COVER_TOP[c] ?? 0xbdb7ac, c === 1 ? KIND.water : KIND.terrain, 0];
  }

  function build(view, x0, y0, x1, y1, detailed, chunkIndex) {
    const pos = [], nrm = [], col = [], kind = [], bid = [], idx = [];
    let vc = 0;
    const { w, h, cs, map } = view;
    const at = (i) => (map ? map[i] : i);

    function quad(a, b, c, d, nx, ny, nz, color, k, id) {
      pos.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2], d[0], d[1], d[2]);
      const r = (color >> 16) & 255, g = (color >> 8) & 255, bl = color & 255;
      for (let j = 0; j < 4; j++) {
        nrm.push(nx, ny, nz);
        col.push(r, g, bl);
        kind.push(k);
        bid.push(id);
      }
      idx.push(vc, vc + 1, vc + 2, vc, vc + 2, vc + 3);
      vc += 4;
    }

    function box(X0, Z0, X1, Z1, Ya, Yb, color, k, id, bottom) {
      quad([X0, Yb, Z0], [X0, Yb, Z1], [X1, Yb, Z1], [X1, Yb, Z0], 0, 1, 0, color, k, id);
      if (bottom) quad([X0, Ya, Z0], [X1, Ya, Z0], [X1, Ya, Z1], [X0, Ya, Z1], 0, -1, 0, color, k, id);
      quad([X1, Ya, Z1], [X1, Ya, Z0], [X1, Yb, Z0], [X1, Yb, Z1], 1, 0, 0, color, k, id);
      quad([X0, Ya, Z0], [X0, Ya, Z1], [X0, Yb, Z1], [X0, Yb, Z0], -1, 0, 0, color, k, id);
      quad([X0, Ya, Z1], [X1, Ya, Z1], [X1, Yb, Z1], [X0, Yb, Z1], 0, 0, 1, color, k, id);
      quad([X1, Ya, Z0], [X0, Ya, Z0], [X0, Yb, Z0], [X1, Yb, Z0], 0, 0, -1, color, k, id);
    }

    let active = new Map();
    const rects = [];
    for (let y = y0; y < y1; y++) {
      const runs = [];
      let x = x0;
      while (x < x1) {
        const i = at(y * w + x);
        const t = world.top[i];
        const [c, k, id] = topInfo(i);
        let x2 = x + 1;
        while (x2 < x1) {
          const j = at(y * w + x2);
          if (world.top[j] !== t) break;
          const [c2, k2, id2] = topInfo(j);
          if (c2 !== c || k2 !== k || id2 !== id) break;
          x2++;
        }
        runs.push([x, x2, t, c, k, id]);
        x = x2;
      }
      const next = new Map();
      for (const r of runs) {
        const key = r.join(',');
        const a = active.get(key);
        if (a) { a.y1 = y + 1; next.set(key, a); active.delete(key); }
        else next.set(key, { x0: r[0], x1: r[1], y0: y, y1: y + 1, t: r[2], c: r[3], k: r[4], id: r[5] });
      }
      for (const a of active.values()) rects.push(a);
      active = next;
    }
    for (const a of active.values()) rects.push(a);
    for (const r of rects) {
      const Y = r.t * BLOCK, X0 = r.x0 * cs, X1 = r.x1 * cs, Z0 = r.y0 * cs, Z1 = r.y1 * cs;
      quad([X0, Y, Z0], [X0, Y, Z1], [X1, Y, Z1], [X1, Y, Z0], 0, 1, 0, r.c, r.k, r.id);
    }

    function emitSide(d, a0, a1, o, dx, dy) {
      const lo = d.nt, hi = d.t, segs = [];
      const terrainTop = d.id ? Math.min(d.base, hi) : hi;
      if (terrainTop > lo) segs.push([lo, terrainTop, d.water ? KIND.water : KIND.side, d.water ? 0x2f6f9f : d.sideColor, 0]);
      if (d.id) {
        const wb = Math.max(lo, d.base), wt = Math.min(hi, d.eave);
        if (wt > wb) segs.push([wb, wt, d.wallKind, d.wallColor, d.id]);
        const rb = Math.max(lo, d.eave, d.base);
        if (hi > rb) segs.push([rb, hi, KIND.roof, d.roofColor, d.id]);
      }
      for (const [a, b, k, color, id] of segs) {
        const Ya = a * BLOCK, Yb = b * BLOCK;
        if (dy === 0) {
          const X = (dx > 0 ? o + 1 : o) * cs, Z0 = a0 * cs, Z1 = a1 * cs;
          if (dx > 0) quad([X, Ya, Z1], [X, Ya, Z0], [X, Yb, Z0], [X, Yb, Z1], 1, 0, 0, color, k, id);
          else quad([X, Ya, Z0], [X, Ya, Z1], [X, Yb, Z1], [X, Yb, Z0], -1, 0, 0, color, k, id);
        } else {
          const Z = (dy > 0 ? o + 1 : o) * cs, X0 = a0 * cs, X1 = a1 * cs;
          if (dy > 0) quad([X0, Ya, Z], [X1, Ya, Z], [X1, Yb, Z], [X0, Yb, Z], 0, 0, 1, color, k, id);
          else quad([X1, Ya, Z], [X0, Ya, Z], [X0, Yb, Z], [X1, Yb, Z], 0, 0, -1, color, k, id);
        }
      }
    }

    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const alongX = dx === 0;
      const o0 = alongX ? y0 : x0, o1 = alongX ? y1 : x1, s0 = alongX ? x0 : y0, s1 = alongX ? x1 : y1;
      for (let o = o0; o < o1; o++) {
        let prev = null, start = 0;
        for (let s = s0; s <= s1; s++) {
          let d = null;
          if (s < s1) {
            const x = alongX ? s : o, y = alongX ? o : s;
            const i = at(y * w + x);
            const nx = x + dx, ny = y + dy;
            const j = nx < 0 || ny < 0 || nx >= w || ny >= h ? -1 : at(ny * w + nx);
            const nt = j < 0 ? 0 : world.top[j];
            const t = world.top[i];
            if (nt < t) {
              const b = world.id[i] - 1;
              const built = b >= 0 && !world.bridge[b];
              const sameBuilding = built && j >= 0 && world.id[j] === world.id[i];
              const c = world.cover[i];
              d = {
                nt, t,
                base: world.baseLevel[i],
                eave: sameBuilding ? (world.roof[i] >> 15 ? nt : t) : world.eave[i],
                id: built ? b + 1 : 0,
                wallKind: built ? (world.church[b] ? KIND.side : world.glass[b] ? KIND.glass : KIND.wall) : 0,
                wallColor: built ? wallColor[b] : 0,
                roofColor: built ? roofColor[b] : 0,
                sideColor: COVER_SIDE[c] ?? 0x8e877c,
                water: c === 1 && !built,
              };
              d.key = `${d.nt}|${d.t}|${d.base}|${d.eave}|${d.id}|${d.sideColor}|${d.water}`;
            }
          }
          if (!d || !prev || d.key !== prev.key) {
            if (prev) emitSide(prev, start, s, o, dx, dy);
            prev = d;
            start = s;
          }
        }
      }
    }

    if (detailed) {
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = y * W + x;
          if (!world.deck[i]) continue;
          const X0 = x * CELL, Z0 = y * CELL;
          box(X0, Z0, X0 + CELL, Z0 + CELL, (world.deck[i] - 1) * BLOCK, world.deck[i] * BLOCK, 0x9d9a94, KIND.deck, world.id[i], true);
        }
      }
    }
    for (const [tx, ty, r, ground, leaf] of treeBins.get(chunkIndex) || []) {
      const X = tx * CELL, Z = ty * CELL, half = r * CELL;
      if (detailed) {
        box(X + 0.6, Z + 0.6, X + 1.4, Z + 1.4, ground * BLOCK - 0.01, (ground + 2) * BLOCK, 0x6b4a2c, KIND.wood, 0, false);
        box(X + 1 - half, Z + 1 - half, X + 1 + half, Z + 1 + half, (ground + 2) * BLOCK, (ground + 4) * BLOCK, leaf, KIND.leaf, 0, true);
        const crown = Math.max(1, half - CELL);
        box(X + 1 - crown, Z + 1 - crown, X + 1 + crown, Z + 1 + crown, (ground + 4) * BLOCK, (ground + 5) * BLOCK, leaf, KIND.leaf, 0, false);
      } else if (r >= 2) {
        box(X + 1 - half, Z + 1 - half, X + 1 + half, Z + 1 + half, (ground + 1) * BLOCK, (ground + 4) * BLOCK, leaf, KIND.leaf, 0, false);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.Int8BufferAttribute(Int8Array.from(nrm), 3, false));
    geo.setAttribute('acol', new THREE.Uint8BufferAttribute(Uint8Array.from(col), 3, true));
    geo.setAttribute('kind', new THREE.Uint8BufferAttribute(Uint8Array.from(kind), 1, false));
    geo.setAttribute('bid', new THREE.Float32BufferAttribute(bid, 1));
    geo.setIndex(vc > 65000 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1));
    geo.computeBoundingSphere();
    return geo;
  }

  const fullView = { w: W, h: H, cs: CELL, map: null };
  const coarseView = { w: CW, h: CH, cs: CELL * LOD_FACTOR, map: rep };
  const step = CHUNK / LOD_FACTOR;

  return {
    columns: NCX,
    rows: NCY,
    buildFull(cx, cy) {
      return build(fullView, cx * CHUNK, cy * CHUNK, Math.min(W, (cx + 1) * CHUNK), Math.min(H, (cy + 1) * CHUNK), true, cy * NCX + cx);
    },
    buildCoarse(cx, cy) {
      return build(coarseView, cx * step, cy * step, Math.min(CW, (cx + 1) * step), Math.min(CH, (cy + 1) * step), false, cy * NCX + cx);
    },
    refreshCoarse(cx, cy) {
      for (let y = cy * step; y < Math.min(CH, (cy + 1) * step); y++) {
        for (let x = cx * step; x < Math.min(CW, (cx + 1) * step); x++) rep[y * CW + x] = representative(x, y);
      }
    },
    coverColor: (c) => COVER_TOP[c] ?? 0xbdb7ac,
  };
}
