const modal = document.getElementById('modal');
const box = document.getElementById('modalBox');
let onClose = null;

export function openModal(html, bind, { dismissible = true, onDismiss = null } = {}) {
  box.innerHTML = html;
  modal.hidden = false;
  onClose = dismissible ? onDismiss : null;
  modal.dataset.dismissible = dismissible ? '1' : '';
  bind?.(box);
}

export function closeModal() {
  modal.hidden = true;
  box.innerHTML = '';
  onClose = null;
}

export const modalOpen = () => !modal.hidden;

modal.addEventListener('pointerdown', (e) => {
  if (e.target !== modal || !modal.dataset.dismissible) return;
  const fn = onClose;
  closeModal();
  fn?.();
});
