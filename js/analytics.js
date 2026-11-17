import { SITE } from './config.js';

const enabled = location.hostname === SITE.domain || location.hostname === `www.${SITE.domain}`;
const queue = [];

if (enabled) {
  window.plausible = window.plausible || ((...args) => queue.push(args));
  window.plausible.q = queue;
  const el = document.createElement('script');
  el.defer = true;
  el.dataset.domain = SITE.domain;
  el.src = SITE.analytics;
  document.head.appendChild(el);
}

export function pageview(view) {
  if (enabled) window.plausible('pageview', { u: `${location.origin}/${view}` });
}

export function track(event, props) {
  if (enabled) window.plausible(event, props ? { props } : undefined);
}
