import * as THREE from '../vendor/three.module.min.js';
import { CELL, BLOCK, groundAt, surfaceAt, maxSurfaceAround } from './world.js';

const MIN_PITCH = 0.06, MAX_PITCH = 1.53, MIN_DIST = 25, MAX_DIST = 7000;
const NAV_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'PageUp', 'PageDown'];

export function raycastGrid(world, origin, dir) {
  const { W, H, top, deck } = world;
  const ox = origin.x / CELL, oz = origin.z / CELL, oy = origin.y / BLOCK;
  const dx = dir.x / CELL, dz = dir.z / CELL, dy = dir.y / BLOCK;
  let t0 = 0, t1 = 1e7;
  for (const [p, v, max] of [[ox, dx, W], [oz, dz, H]]) {
    if (Math.abs(v) < 1e-9) {
      if (p < 0 || p > max) return null;
      continue;
    }
    let a = -p / v, b = (max - p) / v;
    if (a > b) [a, b] = [b, a];
    t0 = Math.max(t0, a);
    t1 = Math.min(t1, b);
  }
  if (t0 > t1) return null;
  let t = t0 + 1e-6;
  let x = Math.floor(ox + dx * t), z = Math.floor(oz + dz * t);
  const sx = Math.sign(dx), sz = Math.sign(dz), tdx = Math.abs(1 / dx), tdz = Math.abs(1 / dz);
  let tmx = dx > 0 ? (x + 1 - ox) / dx : dx < 0 ? (x - ox) / dx : 1e9;
  let tmz = dz > 0 ? (z + 1 - oz) / dz : dz < 0 ? (z - oz) / dz : 1e9;
  for (let k = 0; k < 12000; k++) {
    if (x < 0 || z < 0 || x >= W || z >= H) return null;
    const tn = Math.min(tmx, tmz, t1);
    const i = z * W + x;
    const ya = oy + dy * t, yb = oy + dy * tn;
    if (deck[i] && Math.min(ya, yb) <= deck[i] && Math.max(ya, yb) >= deck[i] - 1) return { i, t };
    if (Math.min(ya, yb) <= top[i]) {
      const hit = dy < 0 && ya > top[i] ? (top[i] - oy) / dy : t;
      return { i, t: hit };
    }
    if (tn >= t1) return null;
    t = tn;
    if (tmx < tmz) { x += sx; tmx += tdx; } else { z += sz; tmz += tdz; }
  }
  return null;
}

export function createControls(world, camera, canvas, { onPick, onFlyChange }) {
  const orbit = { tx: 0, tz: 0, ty: 0, dist: 420, yaw: -Math.PI / 2, pitch: 0.55 };
  const flyPos = new THREE.Vector3();
  const flyAngle = { yaw: 0, pitch: 0 };
  const keys = {};
  const pad = {};
  const pointers = new Map();
  const ray = new THREE.Raycaster();
  const tmp = new THREE.Vector3();
  const W = world.W * CELL, H = world.H * CELL;
  let flying = false, flySpeed = 60, target = null, compass = null, drag = null, gesture = null;

  const clampTarget = () => {
    orbit.tx = Math.max(0, Math.min(W, orbit.tx));
    orbit.tz = Math.max(0, Math.min(H, orbit.tz));
  };
  const clampPitch = (p) => Math.max(MIN_PITCH, Math.min(MAX_PITCH, p));

  function orbitPosition(out) {
    const c = Math.cos(orbit.pitch);
    return out.set(orbit.tx + Math.sin(orbit.yaw) * c * orbit.dist, orbit.ty + Math.sin(orbit.pitch) * orbit.dist, orbit.tz + Math.cos(orbit.yaw) * c * orbit.dist);
  }

  function rayFrom(px, py) {
    const r = canvas.getBoundingClientRect();
    ray.setFromCamera({ x: ((px - r.left) / r.width) * 2 - 1, y: -((py - r.top) / r.height) * 2 + 1 }, camera);
    return ray.ray;
  }

  function planeHit(r, y) {
    if (Math.abs(r.direction.y) < 1e-4) return null;
    const t = (y - r.origin.y) / r.direction.y;
    return t < 0 ? null : r.origin.clone().addScaledVector(r.direction, t);
  }

  function pointUnder(px, py) {
    const r = rayFrom(px, py);
    const hit = raycastGrid(world, r.origin, r.direction);
    return hit ? r.origin.clone().addScaledVector(r.direction, hit.t) : planeHit(r, orbit.ty);
  }

  function zoomAt(px, py, factor) {
    const next = Math.max(MIN_DIST, Math.min(MAX_DIST, orbit.dist * factor));
    const f = next / orbit.dist;
    if (Math.abs(f - 1) < 1e-4) return;
    if (px != null) {
      const p = pointUnder(px, py);
      if (p) {
        orbit.tx = p.x + (orbit.tx - p.x) * f;
        orbit.tz = p.z + (orbit.tz - p.z) * f;
        clampTarget();
      }
    }
    orbit.dist = next;
    target = null;
  }

  function panScreen(dx, dy) {
    const s = orbit.dist * 0.0016;
    const fx = Math.sin(orbit.yaw), fz = Math.cos(orbit.yaw);
    orbit.tx -= (dx * fz - dy * fx) * s;
    orbit.tz -= (-dx * fx - dy * fz) * s;
    clampTarget();
  }

  function apply(dt) {
    if (flying) {
      camera.position.copy(flyPos);
      const d = new THREE.Vector3(Math.cos(flyAngle.pitch) * Math.sin(flyAngle.yaw), Math.sin(flyAngle.pitch), Math.cos(flyAngle.pitch) * Math.cos(flyAngle.yaw));
      camera.lookAt(flyPos.clone().add(d));
      camera.near = 0.3;
      camera.updateProjectionMatrix();
      return;
    }
    orbit.ty += (groundAt(world, orbit.tx, orbit.tz) - orbit.ty) * Math.min(1, dt * 6);
    orbitPosition(tmp);
    let floor = maxSurfaceAround(world, tmp.x, tmp.z, 3) + 4;
    for (let s = 1; s <= 6; s++) {
      const f = 1 - s * 0.07;
      const x = orbit.tx + (tmp.x - orbit.tx) * f, z = orbit.tz + (tmp.z - orbit.tz) * f, y = orbit.ty + (tmp.y - orbit.ty) * f;
      const need = surfaceAt(world, x, z) + 2.5 - (y - tmp.y);
      if (need > floor) floor = need;
    }
    if (tmp.y < floor) {
      const sin = Math.min(0.999, (floor - orbit.ty) / orbit.dist);
      if (sin > -1) {
        orbit.pitch = Math.min(MAX_PITCH, Math.max(orbit.pitch, Math.asin(sin)));
        orbitPosition(tmp);
      }
      if (tmp.y < floor) tmp.y = floor;
    }
    camera.position.copy(tmp);
    camera.lookAt(orbit.tx, orbit.ty, orbit.tz);
    const near = Math.max(0.5, Math.min(6, orbit.dist * 0.006));
    if (Math.abs(camera.near - near) > 0.05) {
      camera.near = near;
      camera.updateProjectionMatrix();
    }
  }

  function setFlying(on) {
    if (on === flying) return;
    flying = on;
    if (flying) {
      flyPos.copy(camera.position);
      const d = new THREE.Vector3(orbit.tx, orbit.ty, orbit.tz).sub(camera.position).normalize();
      flyAngle.yaw = Math.atan2(d.x, d.z);
      flyAngle.pitch = Math.asin(d.y);
    } else {
      document.exitPointerLock?.();
      const d = new THREE.Vector3(Math.sin(flyAngle.yaw), 0, Math.cos(flyAngle.yaw));
      const h = Math.max(30, flyPos.y - groundAt(world, flyPos.x, flyPos.z));
      orbit.dist = Math.max(80, h * 1.6);
      orbit.pitch = clampPitch(Math.asin(Math.min(0.99, h / orbit.dist)));
      orbit.tx = flyPos.x + d.x * Math.cos(orbit.pitch) * orbit.dist;
      orbit.tz = flyPos.z + d.z * Math.cos(orbit.pitch) * orbit.dist;
      orbit.yaw = flyAngle.yaw + Math.PI;
      clampTarget();
    }
    onFlyChange?.(flying);
  }

  function move(dt) {
    if (flying) {
      const f = new THREE.Vector3(Math.sin(flyAngle.yaw) * Math.cos(flyAngle.pitch), Math.sin(flyAngle.pitch), Math.cos(flyAngle.yaw) * Math.cos(flyAngle.pitch));
      const r = new THREE.Vector3(Math.cos(flyAngle.yaw), 0, -Math.sin(flyAngle.yaw));
      const v = new THREE.Vector3();
      if (keys.KeyW || keys.ArrowUp) v.add(f);
      if (keys.KeyS || keys.ArrowDown) v.sub(f);
      if (keys.KeyD || keys.ArrowRight) v.sub(r);
      if (keys.KeyA || keys.ArrowLeft) v.add(r);
      if (keys.Space) v.y += 1;
      if (keys.ShiftLeft || keys.ShiftRight) v.y -= 1;
      flyPos.addScaledVector(v, flySpeed * dt * (keys.ControlLeft ? 3 : 1));
      flyPos.x = Math.max(-500, Math.min(W + 500, flyPos.x));
      flyPos.z = Math.max(-500, Math.min(H + 500, flyPos.z));
      flyPos.y = Math.min(4000, Math.max(maxSurfaceAround(world, flyPos.x, flyPos.z, 1) + 2, flyPos.y));
      return;
    }
    const s = Math.max(60, orbit.dist) * 1.1 * dt;
    const fx = Math.sin(orbit.yaw), fz = Math.cos(orbit.yaw);
    const up = keys.KeyW || keys.ArrowUp || pad.up;
    const down = keys.KeyS || keys.ArrowDown || pad.down;
    const left = keys.KeyA || keys.ArrowLeft || pad.left;
    const right = keys.KeyD || keys.ArrowRight || pad.right;
    if (up) { orbit.tx -= fx * s; orbit.tz -= fz * s; }
    if (down) { orbit.tx += fx * s; orbit.tz += fz * s; }
    if (left) { orbit.tx -= fz * s; orbit.tz += fx * s; }
    if (right) { orbit.tx += fz * s; orbit.tz -= fx * s; }
    if (up || down || left || right) target = null;
    if (keys.KeyQ || pad.rotl) orbit.yaw += 1.5 * dt;
    if (keys.KeyE || pad.rotr) orbit.yaw -= 1.5 * dt;
    if (keys.KeyR || keys.PageUp || pad.tiltup) orbit.pitch = Math.min(MAX_PITCH, orbit.pitch + 0.9 * dt);
    if (keys.KeyF || keys.PageDown || pad.tiltdn) orbit.pitch = Math.max(MIN_PITCH, orbit.pitch - 0.9 * dt);
    if (keys.Equal || keys.NumpadAdd || pad.zin) zoomAt(null, null, Math.exp(-1.6 * dt));
    if (keys.Minus || keys.NumpadSubtract || pad.zout) zoomAt(null, null, Math.exp(1.6 * dt));
    clampTarget();
  }

  function pick(px, py) {
    const r = rayFrom(px, py);
    const hit = raycastGrid(world, r.origin, r.direction);
    onPick(hit ? world.id[hit.i] - 1 : -1);
  }

  const isField = (el) => el && (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA');
  const onKeyDown = (e) => {
    if (isField(e.target)) return;
    if (NAV_KEYS.includes(e.code)) e.preventDefault();
    keys[e.code] = true;
  };
  const onKeyUp = (e) => { keys[e.code] = false; };
  const onBlur = () => { for (const k in keys) keys[k] = false; };
  const onContext = (e) => e.preventDefault();

  const onPointerDown = (e) => {
    if (flying) {
      if (document.pointerLockElement !== canvas) canvas.requestPointerLock?.();
      return;
    }
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      const rotate = e.button === 2 || e.button === 1 || e.ctrlKey || e.altKey || e.shiftKey || e.metaKey;
      drag = {
        sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY, rotate, moved: false, button: e.button,
        anchor: rotate ? null : planeHit(rayFrom(e.clientX, e.clientY), orbit.ty), ay: orbit.ty,
      };
      target = null;
    } else if (pointers.size === 2) {
      if (drag) drag.moved = true;
      gesture = null;
    }
  };

  const onPointerMove = (e) => {
    if (flying) {
      if (document.pointerLockElement === canvas) {
        flyAngle.yaw -= e.movementX * 0.0025;
        flyAngle.pitch = Math.max(-1.5, Math.min(1.5, flyAngle.pitch - e.movementY * 0.0025));
      }
      return;
    }
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const angle = Math.atan2(b.y - a.y, b.x - a.x);
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      if (gesture) {
        zoomAt(mx, my, gesture.d / d);
        let da = angle - gesture.a;
        if (da > Math.PI) da -= 2 * Math.PI;
        if (da < -Math.PI) da += 2 * Math.PI;
        orbit.yaw -= da;
        orbit.pitch = clampPitch(orbit.pitch + (my - gesture.my) * 0.005);
      }
      gesture = { d, a: angle, my };
      return;
    }
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.x = e.clientX;
    drag.y = e.clientY;
    if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 4) drag.moved = true;
    if (drag.rotate) {
      orbit.yaw -= dx * 0.006;
      orbit.pitch = clampPitch(orbit.pitch + dy * 0.005);
    } else if (drag.anchor) {
      const p = planeHit(rayFrom(e.clientX, e.clientY), drag.ay);
      if (p && p.distanceTo(camera.position) < orbit.dist * 6) {
        orbit.tx += drag.anchor.x - p.x;
        orbit.tz += drag.anchor.z - p.z;
        clampTarget();
        apply(0);
      } else panScreen(dx, dy);
    } else panScreen(dx, dy);
  };

  const onPointerUp = (e) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) gesture = null;
    if (drag && !drag.moved && drag.button === 0 && pointers.size === 0) pick(e.clientX, e.clientY);
    if (pointers.size === 0) drag = null;
  };

  const onWheel = (e) => {
    e.preventDefault();
    if (flying) {
      flySpeed = Math.max(8, Math.min(600, flySpeed * Math.exp(-e.deltaY * 0.002)));
      return;
    }
    const dy = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1);
    const k = e.ctrlKey ? 0.01 : 0.0015;
    zoomAt(e.clientX, e.clientY, Math.exp(Math.max(-0.5, Math.min(0.5, dy * k))));
  };

  const onDoubleClick = (e) => {
    if (flying) return;
    const p = pointUnder(e.clientX, e.clientY);
    if (p) flyTo(p.x, p.z, Math.max(MIN_DIST, orbit.dist * 0.5));
  };

  function flyTo(x, z, dist) {
    target = { x, z, d: dist || Math.min(orbit.dist, 500) };
    if (flying) setFlying(false);
  }

  addEventListener('keydown', onKeyDown);
  addEventListener('keyup', onKeyUp);
  addEventListener('blur', onBlur);
  canvas.addEventListener('contextmenu', onContext);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('dblclick', onDoubleClick);

  return {
    orbit,
    pad,
    get flying() { return flying; },
    get position() { return flying ? flyPos : orbit; },
    get heading() { return flying ? flyAngle.yaw + Math.PI : orbit.yaw; },
    get viewDistance() { return flying ? 400 : orbit.dist; },
    setFlying,
    toggleFlying() { setFlying(!flying); },
    flyTo,
    lookFrom(x, z, dist, yaw, pitch) {
      orbit.tx = x;
      orbit.tz = z;
      orbit.ty = groundAt(world, x, z);
      orbit.dist = dist;
      orbit.yaw = yaw;
      orbit.pitch = pitch;
      clampTarget();
    },
    cancelTarget() { target = null; },
    faceNorth() {
      target = null;
      compass = { from: orbit.yaw, to: Math.round(orbit.yaw / (2 * Math.PI)) * 2 * Math.PI, t: 0 };
    },
    update(dt) {
      move(dt);
      if (compass) {
        compass.t = Math.min(1, compass.t + dt * 2.5);
        const e = 1 - Math.pow(1 - compass.t, 3);
        orbit.yaw = compass.from + (compass.to - compass.from) * e;
        if (compass.t >= 1) compass = null;
      }
      if (target) {
        const k = 1 - Math.pow(0.015, dt);
        orbit.tx += (target.x - orbit.tx) * k;
        orbit.tz += (target.z - orbit.tz) * k;
        orbit.dist += (target.d - orbit.dist) * k;
        if (Math.hypot(target.x - orbit.tx, target.z - orbit.tz) < 1 && Math.abs(target.d - orbit.dist) < 2) target = null;
      }
      apply(dt);
    },
    occluded(point, dist) {
      const d = point.clone().sub(camera.position).normalize();
      const hit = raycastGrid(world, camera.position, d);
      return !!hit && hit.t < dist - 12;
    },
    dispose() {
      removeEventListener('keydown', onKeyDown);
      removeEventListener('keyup', onKeyUp);
      removeEventListener('blur', onBlur);
      document.exitPointerLock?.();
    },
  };
}
