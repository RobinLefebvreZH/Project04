const KEY = 'swissblocks.settings';

export const OPTIONS = {
  quality: ['low', 'medium', 'high'],
  pace: ['slow', 'normal', 'fast'],
};

export const QUALITY = {
  low: { pixelRatio: 1, antialias: false, radius: [300, 550] },
  medium: { pixelRatio: 1.25, antialias: true, radius: [420, 800] },
  high: { pixelRatio: 1.75, antialias: true, radius: [420, 1100] },
};

export const MONTH_SECONDS = { slow: 10, normal: 6, fast: 3 };

const DEFAULTS = { quality: 'high', pace: 'normal', labels: true, minimap: true, backdrop: true, tutorialDone: false };

function read() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) };
  } catch {
    return { ...DEFAULTS };
  }
}

let current = read();
const listeners = new Set();

export const settings = () => current;

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
    return true;
  } catch {
    return false;
  }
}

export function setSetting(key, value) {
  current = { ...current, [key]: value };
  persist();
  for (const fn of listeners) fn(current, key);
}

export function onSettingsChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
