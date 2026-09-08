// ============================================================
// UTILIDADES
// ============================================================
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function roll(pct) { return Math.random() * 100 < pct; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function depthOf(pos) { return Math.max(Math.abs(pos.x), Math.abs(pos.y)); }

function bagCount() {
  return inventorySlotCount();
}

function log(msg, cls = 'info') {
  const logEl = document.getElementById('log');
  const p = document.createElement('p');
  p.className = 'log-' + cls;
  p.textContent = msg;
  logEl.appendChild(p);
  logEl.scrollTop = logEl.scrollHeight;
  while (logEl.children.length > 60) logEl.removeChild(logEl.firstChild);
}

function clearLogVisual() {
  document.getElementById('log').innerHTML = '';
}
