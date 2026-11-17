import { t, cityName, dateLabel } from './i18n.js';
import { chf } from './format.js';
import { logoFaces } from './figures.js';
import { SITE } from './config.js';

const W = 1200, H = 630;
const FONT = 'Helvetica, "Helvetica Neue", Arial, sans-serif';
const INK = '#161616', PAPER = '#f5f4f0', RED = '#d52b1e', MUTED = '#5d6166';

export function recordCode(record) {
  const text = [record.name, record.profile, record.aum, record.rev, record.exec, record.months, record.date].join('|');
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  const hex = (h >>> 0).toString(16).toUpperCase().padStart(8, '0');
  return `${hex.slice(0, 4)}-${hex.slice(4)}`;
}

function drawLogo(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineJoin = 'round';
  ctx.lineWidth = size / 40;
  ctx.strokeStyle = '#111111';
  for (const face of logoFaces(size)) {
    ctx.beginPath();
    face.points.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
    ctx.closePath();
    ctx.fillStyle = face.fill;
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function fit(ctx, text, maxWidth, size, weight = 'bold') {
  let s = size;
  ctx.font = `${weight} ${s}px ${FONT}`;
  while (ctx.measureText(text).width > maxWidth && s > 16) {
    s -= 2;
    ctx.font = `${weight} ${s}px ${FONT}`;
  }
}

export function drawSeasonCard(record) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = RED;
  ctx.fillRect(0, 0, W, 12);

  drawLogo(ctx, 64, 52, 72);
  ctx.fillStyle = INK;
  ctx.font = `bold 30px ${FONT}`;
  ctx.fillText(SITE.name, 152, 86);
  ctx.fillStyle = RED;
  ctx.font = `bold 18px ${FONT}`;
  ctx.fillText(t('record.kicker').toUpperCase(), 152, 112);

  ctx.fillStyle = INK;
  fit(ctx, record.name || t('record.anonymous'), W - 128, 64);
  ctx.fillText(record.name || t('record.anonymous'), 64, 214);
  ctx.fillStyle = MUTED;
  ctx.font = `28px ${FONT}`;
  ctx.fillText(t('record.summary', { title: { goal: `title.${record.title}` }, profile: record.profile, months: record.months }), 64, 258);

  const stats = [
    [t('score.aum'), chf(record.aum)],
    [t('score.noi'), chf(record.rev)],
    [t('score.exec'), `${record.exec} / 100`],
  ];
  const colW = (W - 128 - 64) / 3;
  stats.forEach(([label, value], i) => {
    const x = 64 + i * (colW + 32);
    ctx.fillStyle = INK;
    ctx.fillRect(x, 300, colW, 5);
    ctx.fillStyle = MUTED;
    ctx.font = `bold 18px ${FONT}`;
    ctx.fillText(label.toUpperCase(), x, 340);
    ctx.fillStyle = RED;
    fit(ctx, value, colW, 52);
    ctx.fillText(value, x, 398);
  });

  record.parts.forEach(([label, value, max], i) => {
    const x = 64 + (i % 3) * (colW + 32), y = 448 + Math.floor(i / 3) * 52;
    ctx.fillStyle = MUTED;
    ctx.font = `18px ${FONT}`;
    ctx.fillText(label, x, y);
    ctx.fillStyle = '#d9d8d3';
    ctx.fillRect(x, y + 10, colW, 6);
    ctx.fillStyle = RED;
    ctx.fillRect(x, y + 10, colW * (value / max), 6);
  });

  ctx.fillStyle = INK;
  ctx.fillRect(0, H - 64, W, 64);
  ctx.fillStyle = PAPER;
  ctx.font = `bold 22px ${FONT}`;
  ctx.fillText(SITE.domain, 64, H - 24);
  ctx.font = `20px ${FONT}`;
  const right = `${record.cities.map(cityName).join(', ')} · ${dateLabel(record.month, record.year)} · ${t('record.code', { code: record.code })}`;
  fit(ctx, right, W - 360, 20, 'normal');
  ctx.textAlign = 'right';
  ctx.fillText(right, W - 64, H - 24);
  ctx.textAlign = 'left';
  return canvas;
}

export function shareText(record) {
  return t('record.share', { title: { goal: `title.${record.title}` }, aum: { chf: record.aum }, exec: record.exec, url: SITE.url });
}
