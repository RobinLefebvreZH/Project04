const modal = document.getElementById('modal');
const box = document.getElementById('modalBox');
const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
let onClose = null;
let returnFocus = null;

export function openModal(html, bind, { dismissible = true, onDismiss = null } = {}) {
  if (modal.hidden) returnFocus = document.activeElement;
  box.innerHTML = html;
  modal.hidden = false;
  onClose = dismissible ? onDismiss : null;
  modal.dataset.dismissible = dismissible ? '1' : '';
  const title = box.querySelector('h1');
  if (title) {
    title.id = 'modalTitle';
    box.setAttribute('aria-labelledby', 'modalTitle');
  }
  bind?.(box);
  (box.querySelector('.primary') || box.querySelector(FOCUSABLE))?.focus();
}

export function closeModal() {
  if (modal.hidden) return;
  modal.hidden = true;
  box.innerHTML = '';
  onClose = null;
  if (returnFocus?.isConnected) returnFocus.focus();
  returnFocus = null;
}

export const modalOpen = () => !modal.hidden;

function dismiss() {
  const fn = onClose;
  closeModal();
  fn?.();
}

modal.addEventListener('pointerdown', (e) => {
  if (e.target === modal && modal.dataset.dismissible) dismiss();
});

modal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.dataset.dismissible) {
    e.stopPropagation();
    dismiss();
    return;
  }
  if (e.key !== 'Tab') return;
  const items = [...box.querySelectorAll(FOCUSABLE)];
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
