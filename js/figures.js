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

export function heroFigure() {
  const cubes = [];
  const heights = [
    [3, 5, 2, 6, 4, 2],
    [2, 7, 4, 3, 8, 3],
    [4, 3, 9, 5, 2, 5],
    [2, 6, 3, 7, 4, 3],
  ];
  const s = 14;
  const iso = (x, y, z) => [200 + (x - y) * s, 150 + (x + y) * s * 0.5 - z * s];
  for (let y = 0; y < heights.length; y++) {
    for (let x = 0; x < heights[y].length; x++) {
      const h = heights[y][x];
      const red = x === 2 && y === 2;
      const top = red ? '#d52b1e' : '#ffffff';
      const left = red ? '#a8241a' : '#d9d9d6';
      const right = red ? '#c22a1d' : '#ecece9';
      const a = iso(x, y, h), b = iso(x + 1, y, h), c = iso(x + 1, y + 1, h), d = iso(x, y + 1, h);
      const b0 = iso(x + 1, y, 0), c0 = iso(x + 1, y + 1, 0), d0 = iso(x, y + 1, 0);
      const pts = (...p) => p.map((q) => q.join(',')).join(' ');
      cubes.push(`<polygon points="${pts(d, c, c0, d0)}" fill="${left}" stroke="#111" stroke-width=".6"/>`);
      cubes.push(`<polygon points="${pts(b, c, c0, b0)}" fill="${right}" stroke="#111" stroke-width=".6"/>`);
      cubes.push(`<polygon points="${pts(a, b, c, d)}" fill="${top}" stroke="#111" stroke-width=".6"/>`);
    }
  }
  return `<svg class="hero-figure" viewBox="60 0 280 260" aria-hidden="true">${cubes.join('')}</svg>`;
}
