// ============================================================
// UTILIDADES GENERALES Y REGISTRO DE MENSAJES
// ============================================================
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function roll(percent) { return Math.random() * 100 < percent; }
function pick(array) { return array?.length ? array[Math.floor(Math.random() * array.length)] : null; }
function depthOf(pos) { return Math.max(Math.abs(pos.x), Math.abs(pos.y)); }

// Añade un mensaje como contenedor independiente y siempre debajo del anterior.
function log(message, cls = 'info') {
  const logEl = document.getElementById('log');
  if (!logEl) return;

  const entry = document.createElement('div');
  entry.className = `log-message log-${cls}`;
  entry.textContent = String(message);
  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight;

  while (logEl.children.length > 60) logEl.removeChild(logEl.firstChild);
}

// Limpia únicamente la representación visual del registro.
function clearLogVisual() {
  const logEl = document.getElementById('log');
  if (logEl) logEl.replaceChildren();
}
