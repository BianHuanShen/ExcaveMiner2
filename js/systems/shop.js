// ============================================================
// TIENDA
// Compra, venta, pociones y reparación de picos.
// ============================================================

function sellItem(itemId, qty = 1) {
  if (typeof sellItemCore !== 'function') {
    console.error('❌ sellItemCore no está disponible');
    return false;
  }
  return sellItemCore(itemId, qty);
}

function sellAll(itemId) {
  if (typeof sellAllCore !== 'function') {
    console.error('❌ sellAllCore no está disponible');
    return false;
  }
  return sellAllCore(itemId);
}

function getPickaxeRepairCount(index = state.pickaxeIndex) {
  state.pickaxeRepairs = state.pickaxeRepairs || {};
  return Number(state.pickaxeRepairs[index]) || 0;
}

function getPickaxeRepairPrice(index = state.pickaxeIndex) {
  const p = PICKAXES[index];
  if (!p) return 0;

  const base = Number(p.repairBasePrice || Math.max(20, Math.round(p.price * 0.25)));
  const repairs = getPickaxeRepairCount(index);

  return Math.max(1, Math.ceil(base * Math.pow(2.5, repairs)));
}

function canRepairPickaxe() {
  if (!state || !PICKAXES[state.pickaxeIndex]) return false;
  return state.pickaxeDurability < PICKAXES[state.pickaxeIndex].maxDurability;
}

function repairPickaxe() {
  if (!state) return false;

  const index = state.pickaxeIndex;
  const p = PICKAXES[index];
  if (!p) return false;

  const missing = p.maxDurability - state.pickaxeDurability;
  if (missing <= 0) {
    log('⛏️ Tu pico ya está completamente reparado.', 'info');
    return false;
  }

  const price = getPickaxeRepairPrice(index);

  if (state.gold < price) {
    log(`🪙 Necesitas ${price} de oro para reparar el ${p.name}.`, 'bad');
    return false;
  }

  state.gold -= price;
  state.pickaxeDurability = p.maxDurability;
  state.pickaxeRepairs = state.pickaxeRepairs || {};
  state.pickaxeRepairs[index] = getPickaxeRepairCount(index) + 1;

  const nextPrice = getPickaxeRepairPrice(index);
  log(`🔧 Reparaste el ${p.name} por ${price} 🪙. Próxima reparación: ${nextPrice} 🪙.`, 'good');

  render();
  save();
  return true;
}

function buyPickaxe(index) {
  const p = PICKAXES[index];
  if (!p) return;
  if (state.gold < p.price) return;
  if (index <= state.pickaxeIndex) return;

  state.gold -= p.price;
  state.pickaxeIndex = index;
  state.pickaxeDurability = p.maxDurability;
  state.pickaxeRepairs = state.pickaxeRepairs || {};
  state.pickaxeRepairs[index] = 0;

  log(`⛏️ ¡Compraste el ${p.name}!`, 'good');
  render();
  save();
}

function buyBag() {
  const price = BAG_UPGRADE_PRICE(state.bagSize);
  if (state.gold < price) return;
  state.gold -= price;
  state.bagSize += 10;
  log(`🎒 ¡Mochila ampliada a ${state.bagSize} espacios!`, 'good');
  render();
  save();
}

function buyPotion(type) {
  const itemId = type === 'heal' ? 'health_potion' : 'energy_potion';
  const price = type === 'heal' ? POTION_HEAL_PRICE : POTION_ENERGY_PRICE;
  if (state.gold < price) return;
  if (!addItem(itemId, 1, { silent: true })) return;
  state.gold -= price;
  log(`🧪 Compraste ${getItem(itemId).name}.`, 'good');
  render();
  save();
}

function usePotion(type) {
  return useItem(type === 'heal' ? 'health_potion' : 'energy_potion');
}
