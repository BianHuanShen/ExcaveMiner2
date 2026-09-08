// ============================================================
// GUARDADO
// ============================================================
function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
function loadSave() {
  const raw = localStorage.getItem(SAVE_KEY);
  return raw ? JSON.parse(raw) : null;
}
function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
