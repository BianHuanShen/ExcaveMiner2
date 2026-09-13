// ============================================================
// TIENDA
// Compra, venta, pociones y reparación de herramientas.
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

function getCurrentToolId() {
  return state?.equipment?.tool || null;
}

function getPickaxeRepairCount(index = state.unlockedPickaxeIndex || 0) {
  state.pickaxeRepairs = state.pickaxeRepairs || {};
  return Number(state.pickaxeRepairs[index]) || 0;
}

function getPickaxeRepairPrice(index = state.unlockedPickaxeIndex || 0) {
  const p = PICKAXES[index];
  if (!p) return 0;

  const base = Number(p.repairBasePrice || Math.max(20, Math.round(p.price * 0.25)));
  const repairs = getPickaxeRepairCount(index);
  return Math.max(1, Math.ceil(base * Math.pow(2.5, repairs)));
}

function getCurrentPickaxeDefinition() {
  return pickaxe();
}

function canRepairPickaxe() {
  const p = getCurrentPickaxeDefinition();
  if (!p || p.repairable === false) return false;
  return Number(state.pickaxeDurability || 0) < Number(p.maxDurability || 0);
}

function repairPickaxe() {
  if (!state) return false;

  const p = getCurrentPickaxeDefinition();
  if (!p || p.repairable === false) {
    log('⛏️ Esta herramienta no puede repararse.', 'info');
    return false;
  }

  const index = PICKAXES.findIndex(entry => entry.id === p.id);
  const missing = Number(p.maxDurability) - Number(state.pickaxeDurability);
  if (missing <= 0) {
    log(`⛏️ Tu ${p.name} ya está completamente reparado.`, 'info');
    return false;
  }

  const price = getPickaxeRepairPrice(Math.max(0, index));
  if (state.gold < price) {
    log(`🪙 Necesitas ${price} de oro para reparar el ${p.name}.`, 'bad');
    return false;
  }

  state.gold -= price;
  state.pickaxeDurability = p.maxDurability;
  if (state.equipment?.tool) setToolDurability(state.equipment.tool, p.maxDurability);

  state.pickaxeRepairs = state.pickaxeRepairs || {};
  const repairKey = Math.max(0, index);
  state.pickaxeRepairs[repairKey] = getPickaxeRepairCount(repairKey) + 1;

  log(`🔧 Reparaste el ${p.name} por ${price} 🪙.`, 'good');
  render();
  save();
  return true;
}

function isToolOwned(itemId) {
  return Boolean(
    state?.equipment?.tool === itemId ||
    Number(state?.inventory?.[itemId] || 0) > 0
  );
}

function buyPickaxe(index) {
  const p = PICKAXES[index];
  if (!p || p.shop === false) return false;
  if (isToolOwned(p.id)) return false;

  const unlocked = Math.max(0, Number(state.unlockedPickaxeIndex ?? 0));

  /*
   * unlockedPickaxeIndex representa el nivel máximo de pico desbloqueado,
   * no el último pico que debe permanecer en la mochila.
   *
   * Por eso:
   *   - 0 = el pico oxidado/inicial está disponible.
   *   - 1 = el pico de hierro ya está desbloqueado.
   *   - Se permite recomprar un pico ya desbloqueado si fue vendido.
   *   - Solo el siguiente nivel (unlocked + 1) puede desbloquearse.
   */
  if (index > unlocked + 1) {
    log(`🔒 Primero debes desbloquear los picos anteriores.`, 'info');
    return false;
  }

  if (!Number.isFinite(Number(p.price)) || Number(p.price) < 0) {
    console.error(`Precio inválido para el pico ${p.id}:`, p.price);
    return false;
  }

  if (state.gold < p.price) {
    log(`🪙 Necesitas ${p.price} de oro para comprar el ${p.name}.`, 'bad');
    return false;
  }

  /*
   * Primero añadimos el objeto al inventario. Solo descontamos el oro
   * después de confirmar que realmente entró en la mochila.
   */
  if (!addItem(p.id, 1, { silent: true })) {
    log(`🎒 No hay espacio para guardar ${p.name}.`, 'bad');
    return false;
  }

  state.gold -= p.price;
  state.unlockedPickaxeIndex = Math.max(unlocked, index);
  state.toolDurability = state.toolDurability || {};
  state.toolDurability[p.id] = p.maxDurability;

  playSfx('buy');
  log(`⛏️ Compraste ${p.name}. Está en tu mochila; puedes equiparlo desde Inventario.`, 'good');
  render();
  save();
  return true;
}

/* Alias de compatibilidad para código/UI antiguos que usen purchasePickaxe. */
function purchasePickaxe(index) {
  return buyPickaxe(index);
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
  playSfx('buy');
  log(`🧪 Compraste ${getItem(itemId).name}.`, 'good');
  render();
  save();
}

function usePotion(type) {
  return useItem(type === 'heal' ? 'health_potion' : 'energy_potion');
}
