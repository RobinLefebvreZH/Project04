import { SITE } from './config.js';
import { getLanguage } from './i18n.js';

export function feedbackLink(context = {}) {
  if (!SITE.contact) return SITE.author;
  const lines = [
    '',
    '',
    '---',
    `Version: ${SITE.version}`,
    `Language: ${getLanguage()}`,
    `Screen: ${innerWidth}x${innerHeight}`,
    `Browser: ${navigator.userAgent}`,
    ...Object.entries(context).map(([k, v]) => `${k}: ${v}`),
  ];
  return `mailto:${SITE.contact}?subject=${encodeURIComponent(`${SITE.name} feedback`)}&body=${encodeURIComponent(lines.join('\n'))}`;
}
