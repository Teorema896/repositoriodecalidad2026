// scripts/utils.js

// Mostrar mensaje temporal (success / error)
export function showMessage(text, type = 'success', duration = 3000) {
  let container = document.getElementById('loginMessage') || document.getElementById('messageContainer');
  if (!container) return;

  container.innerHTML = `<div class="message message-${type}">${text}</div>`;
  setTimeout(() => {
    container.innerHTML = '';
  }, duration);
}

// Limpiar el contenido de un elemento
export function clearElement(id) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = '';
}

// Formatear fecha a dd/mm/yyyy
export function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}
