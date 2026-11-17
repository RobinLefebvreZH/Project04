const svg = (body, size = 56) => `<svg class="figure" viewBox="0 0 56 56" width="${size}" height="${size}" aria-hidden="true">${body}</svg>`;

export const PROFILE_FIGURES = {
  banker: svg(`
    <path d="M6 20L28 8l22 12z" fill="currentColor"/>
    <rect x="8" y="22" width="40" height="3" fill="currentColor"/>
    <rect x="11" y="27" width="5" height="17" fill="currentColor"/>
    <rect x="20" y="27" width="5" height="17" fill="currentColor"/>
    <rect x="31" y="27" width="5" height="17" fill="currentColor"/>
    <rect x="40" y="27" width="5" height="17" fill="currentColor"/>
    <rect x="6" y="46" width="44" height="4" fill="currentColor"/>`),
  entrepreneur: svg(`
    <rect x="8" y="36" width="8" height="14" fill="currentColor" opacity=".45"/>
    <rect x="20" y="28" width="8" height="22" fill="currentColor" opacity=".65"/>
    <rect x="32" y="40" width="8" height="10" fill="currentColor" opacity=".45"/>
    <rect x="44" y="14" width="8" height="36" fill="currentColor"/>
    <path d="M6 30l14-10 12 10L48 8" fill="none" stroke="#d52b1e" stroke-width="3"/>
    <path d="M42 7h8v8" fill="none" stroke="#d52b1e" stroke-width="3"/>`),
  heir: svg(`
    <circle cx="18" cy="28" r="10" fill="none" stroke="currentColor" stroke-width="5"/>
    <rect x="27" y="25.5" width="24" height="5" fill="currentColor"/>
    <rect x="40" y="30" width="4" height="8" fill="currentColor"/>
    <rect x="47" y="30" width="4" height="6" fill="currentColor"/>`),
};

const RED = { top: '#d52b1e', left: '#a8241a', right: '#c22a1d' };
const WHITE = { top: '#ffffff', left: '#d9d9d6', right: '#ecece9' };

export function isoBlocks(heights, red, s, ox, oy) {
  const faces = [];
  const iso = (x, y, z) => [ox + (x - y) * s, oy + (x + y) * s * 0.5 - z * s];
  heights.forEach((row, y) => row.forEach((h, x) => {
    const c = x === red[0] && y === red[1] ? RED : WHITE;
    const a = iso(x, y, h), b = iso(x + 1, y, h), cc = iso(x + 1, y + 1, h), d = iso(x, y + 1, h);
    const b0 = iso(x + 1, y, 0), c0 = iso(x + 1, y + 1, 0), d0 = iso(x, y + 1, 0);
    faces.push({ points: [d, cc, c0, d0], fill: c.left });
    faces.push({ points: [b, cc, c0, b0], fill: c.right });
    faces.push({ points: [a, b, cc, d], fill: c.top });
  }));
  return faces;
}

function svgFaces(faces, stroke) {
  return faces.map((f) => `<polygon points="${f.points.map((p) => p.join(',')).join(' ')}" fill="${f.fill}" stroke="#111" stroke-width="${stroke}" stroke-linejoin="round"/>`).join('');
}

export const LOGO = { heights: [[2, 3], [1, 2]], red: [1, 0] };

export function logoFaces(size) {
  const s = size / 4.8;
  return isoBlocks(LOGO.heights, LOGO.red, s, size / 2, (size - 4.5 * s) / 2 + 2.5 * s);
}

export function logoSvg(size = 44) {
  return `<svg class="logo" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">${svgFaces(logoFaces(64), 1.4)}</svg>`;
}

export function heroFigure() {
  const heights = [
    [3, 5, 2, 6, 4, 2],
    [2, 7, 4, 3, 8, 3],
    [4, 3, 9, 5, 2, 5],
    [2, 6, 3, 7, 4, 3],
  ];
  return `<svg class="hero-figure" viewBox="60 0 280 260" aria-hidden="true">${svgFaces(isoBlocks(heights, [2, 2], 14, 200, 150), 0.6)}</svg>`;
}
