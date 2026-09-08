/* ============================================================
   ITEM ACTION SYSTEM
   Decide qué acciones existen y ejecuta la lógica correspondiente.
   ============================================================ */

const ITEM_ACTIONS = {
  use: {
    label: 'Usar', icon: '🧪',
    enabled: item => item.usable === true
  },
  equip: {
    label: 'Equipar', icon: '🛡️',
    enabled: item => item.equippable === true && !!item.slot
  },
  sell: {
    label: 'Vender', icon: '🪙',
    enabled: item => item.sellable === true && getSellPrice(item.id) > 0
  },
  drop: {
    label: 'Soltar', icon: '🗑️',
    enabled: item => item.droppable === true
  }
};

function getAvailableItemActions(itemId) {
  const item = getItem(itemId);
  if (!item) return [];

  return Object.entries(ITEM_ACTIONS)
    .filter(([, action]) => action.enabled(item))
    .map(([id, action]) => ({ id, ...action }));
}

function executeItemAction(actionId, itemId) {
  const item = getItem(itemId);
  if (!item || !hasItem(itemId, 1)) return false;

  const action = ITEM_ACTIONS[actionId];
  if (!action || !action.enabled(item)) return false;

  switch (actionId) {
    case 'use': return useItem(itemId);
    case 'equip': return equipItem(itemId);
    case 'sell': return sellItem(itemId, 1);
    case 'drop': return dropItem(itemId, 1);
    default: return false;
  }
}

function useItem(itemId) {
  const item = getItem(itemId);
  if (!item?.usable || !item.consumable || !item.effectId) return false;

  const effect = CONSUMABLE_EFFECTS[item.effectId];
  if (!effect) {
    console.warn(`Efecto consumible no registrado: ${item.effectId}`);
    return false;
  }

  let applied = false;

  switch (effect.type) {
    case 'restore_hp': {
      const before = state.hp;
      state.hp = clamp(state.hp + effect.amount, 0, state.maxHp);
      applied = state.hp > before;
      break;
    }

    case 'restore_energy': {
      const before = state.energy;
      state.energy = clamp(state.energy + effect.amount, 0, state.maxEnergy);
      applied = state.energy > before;
      break;
    }

    default:
      console.warn(`Tipo de efecto no implementado: ${effect.type}`);
      return false;
  }

  if (!applied) {
    log('⚠️ Ese objeto no tendría ningún efecto ahora mismo.', 'info');
    return false;
  }

  removeItem(itemId, 1);
  log(effect.message, 'good');
  render();
  save();
  return true;
}

function dropItem(itemId, qty = 1) {
  const item = getItem(itemId);
  if (!item?.droppable || !hasItem(itemId, qty)) return false;

  removeItem(itemId, qty);
  log(`🗑️ Soltaste ${qty}x ${item.name}.`, 'info');
  render();
  save();
  return true;
}
