// ============================================================
// GUARDADO POR USUARIO / 3 RANURAS
// ============================================================
function save() {
  if (!currentUser || currentSlot === null || !state) return false;

  const data = JSON.parse(JSON.stringify(state));
  data.savedAt = Date.now();
  return setSlot(currentSlot, data);
}

function loadSave(slotIndex = currentSlot) {
  if (!currentUser || slotIndex === null || slotIndex === undefined) return null;
  const data = getSlot(Number(slotIndex));
  return data ? JSON.parse(JSON.stringify(data)) : null;
}

function clearSave(slotIndex = currentSlot) {
  if (!currentUser || slotIndex === null || slotIndex === undefined) return false;
  return deleteSlot(Number(slotIndex));
}
