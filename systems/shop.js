// ============================================================
// TIENDA
// ============================================================
function sellItem(itemId, qty = 1) {
  return window.economySellItem ? window.economySellItem(itemId, qty) : (typeof sellItemCore === 'function' ? sellItemCore(itemId, qty) : false);
}

function sellAll(itemId) {
  return window.economySellAll ? window.economySellAll(itemId) : (typeof sellAllCore === 'function' ? sellAllCore(itemId) : false);
}

function buyPickaxe(index) {
  const p = PICKAXES[index];
  if (state.gold < p.price) return;
  if (index <= state.pickaxeIndex) return;
  state.gold -= p.price;
  state.pickaxeIndex = index;
  state.pickaxeDurability = p.maxDurability;
  log(`⛏️ ¡Compraste el ${p.name}!`, 'good');
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
