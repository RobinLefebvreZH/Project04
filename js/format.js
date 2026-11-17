const MINUS = '−';
const LARGE = {
  en: ['m', 'bn'],
  de: ['Mio.', 'Mia.'],
  fr: ['mio', 'mrd'],
  it: ['mio', 'mrd'],
};

let lang = 'en';
export function setFormatLanguage(code) {
  lang = code;
}

export function integer(v) {
  const s = Math.round(Math.abs(v)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '’');
  return (v < 0 ? MINUS : '') + s;
}

export function decimal(v, digits = 1) {
  const s = Math.abs(v).toFixed(digits);
  const [i, d] = s.split('.');
  return (v < 0 && +s !== 0 ? MINUS : '') + integer(+i) + (d ? '.' + d : '');
}

export function chf(v) {
  const a = Math.abs(v), sign = v < 0 ? MINUS : '';
  const [million, billion] = LARGE[lang] || LARGE.en;
  if (a >= 1e9) return `${sign}CHF ${(a / 1e9).toFixed(2)} ${billion}`;
  if (a >= 1e6) return `${sign}CHF ${(a / 1e6).toFixed(2)} ${million}`;
  return `${sign}CHF ${integer(a)}`;
}

export function signedChf(v) {
  return (v >= 0 ? '+' : '') + chf(v);
}

export function percent(v, digits = 1) {
  return `${decimal(v * 100, digits)} %`;
}

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
