/* ============================================================
   INVENTORY SYSTEM
   Guarda IDs y cantidades. Nunca guarda la definición completa.
   ============================================================ */

function inventorySlotCount() {
  if (!state?.inventory) return 0;

  let slots = 0;
  for (const [itemId, qtyRaw] of Object.entries(state.inventory)) {
    const qty = Number(qtyRaw) || 0;
    if (qty <= 0) continue;
    const item = getItem(itemId);
    if (!item) continue;
    slots += item.stackable ? 1 : qty;
  }
  return slots;
}

function bagCount() {
  return inventorySlotCount();
}

function hasItem(itemId, qty = 1) {
  return (state?.inventory?.[itemId] || 0) >= qty;
}

function addItem(itemId, qty = 1, options = {}) {
  const item = getItem(itemId);
  qty = Math.floor(Number(qty));

  if (!item || qty <= 0) return false;

  const current = state.inventory[itemId] || 0;
  const addedSlots = item.stackable ? (current > 0 ? 0 : 1) : qty;

  if (inventorySlotCount() + addedSlots > state.bagSize) {
    log(`🎒 ¡Tu mochila está llena! No pudiste recoger ${item.name} x${qty}.`, 'bad');
    return false;
  }

  state.inventory[itemId] = current + qty;

  if (!options.silent) {
    save();
  }

  return true;
}

function removeItem(itemId, qty = 1) {
  if (!hasItem(itemId, qty)) return false;

  state.inventory[itemId] -= qty;
  if (state.inventory[itemId] <= 0) delete state.inventory[itemId];
  return true;
}

function getItemQuantity(itemId) {
  return state?.inventory?.[itemId] || 0;
}

function getInventoryEntries() {
  if (!state?.inventory) return [];
  return Object.entries(state.inventory)
    .filter(([, qty]) => Number(qty) > 0)
    .map(([id, qty]) => ({ id, qty: Number(qty), item: getItem(id) }))
    .filter(entry => entry.item);
}

function normalizeInventory(rawInventory) {
  const normalized = {};
  if (!rawInventory || typeof rawInventory !== 'object') return normalized;

  for (const [rawId, rawQty] of Object.entries(rawInventory)) {
    let id = rawId;
    let item = getItem(id);

    /* Compatibilidad con partidas antiguas que guardaban nombres. */
    if (!item) {
      item = Object.values(ITEM_DEFINITIONS).find(candidate => candidate.name === rawId);
      if (item) id = item.id;
    }

    const qty = Math.floor(Number(rawQty));
    if (item && qty > 0) normalized[id] = qty;
  }

  return normalized;
}

function normalizeLegacyPotions(oldState) {
  const inventory = oldState.inventory || {};
  const heal = Number(oldState.potionsHeal) || 0;
  const energy = Number(oldState.potionsEnergy) || 0;

  if (heal > 0) inventory.health_potion = (inventory.health_potion || 0) + heal;
  if (energy > 0) inventory.energy_potion = (inventory.energy_potion || 0) + energy;

  return inventory;
}

function migrateInventoryState(targetState) {
  const legacyInventory = normalizeLegacyPotions(targetState);
  targetState.inventory = normalizeInventory(legacyInventory);
  delete targetState.potionsHeal;
  delete targetState.potionsEnergy;
  return targetState;
}
