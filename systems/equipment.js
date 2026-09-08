/* ============================================================
   EQUIPMENT SYSTEM
   El equipamiento vive fuera del inventario.
   ============================================================ */

const EQUIPMENT_SLOTS = [
  'weapon', 'helmet', 'armor', 'legs', 'boots', 'ring', 'amulet', 'tool'
];

const EQUIPMENT_SLOT_LABELS = {
  weapon: 'Arma', helmet: 'Casco', armor: 'Armadura', legs: 'Piernas',
  boots: 'Botas', ring: 'Anillo', amulet: 'Amuleto', tool: 'Herramienta'
};

function getEquipment() {
  if (!state.equipment || typeof state.equipment !== 'object') state.equipment = {};
  return state.equipment;
}

function getEquippedItem(slot) {
  const id = getEquipment()[slot];
  return id ? getItem(id) : null;
}

function canEquip(itemId) {
  const item = getItem(itemId);
  if (!item || !item.equippable || !item.slot) return false;
  return EQUIPMENT_SLOTS.includes(item.slot);
}

function equipItem(itemId) {
  if (!canEquip(itemId) || !hasItem(itemId, 1)) return false;

  const item = getItem(itemId);
  const equipment = getEquipment();
  const previous = equipment[item.slot];

  if (previous) {
    if (!addItem(previous, 1, { silent: true })) {
      log('🎒 No hay espacio para retirar el objeto equipado.', 'bad');
      return false;
    }
  }

  removeItem(itemId, 1);
  equipment[item.slot] = itemId;

  rebuildPlayerStats();
  log(`🛡️ Equipaste ${item.icon} ${item.name}.`, 'good');
  render();
  playEquipVisual(item);
  save();
  return true;
}

function unequipSlot(slot) {
  const equipment = getEquipment();
  const itemId = equipment[slot];
  if (!itemId) return false;

  if (!addItem(itemId, 1, { silent: true })) {
    log('🎒 No hay espacio en la mochila.', 'bad');
    return false;
  }

  delete equipment[slot];
  rebuildPlayerStats();
  log(`🛡️ Desequipaste ${getItem(itemId)?.name || itemId}.`, 'info');
  render();
  save();
  return true;
}

function calculateEquipmentBonuses() {
  const bonuses = {};

  for (const itemId of Object.values(getEquipment())) {
    const item = getItem(itemId);
    if (!item?.stats) continue;

    for (const [stat, value] of Object.entries(item.stats)) {
      bonuses[stat] = (bonuses[stat] || 0) + Number(value || 0);
    }
  }

  return bonuses;
}


function calculateEquipmentAbilities() {
  const abilities = {};
  for (const itemId of Object.values(getEquipment())) {
    const item = getItem(itemId);
    const source = item?.abilities || {};
    for (const [key, value] of Object.entries(source)) {
      abilities[key] = (abilities[key] || 0) + Number(value || 0);
    }
  }
  return abilities;
}

function getEquipmentAbility(name) {
  return Number(calculateEquipmentAbilities()[name] || 0);
}

function rebuildPlayerStats() {
  if (!state) return;

  const base = state.baseStats || {
    damage: 1,
    defense: 0,
    maxHp: state.maxHp || 100,
    maxEnergy: state.maxEnergy || 100
  };

  const equipmentBonuses = calculateEquipmentBonuses();
  const temporary = state.temporaryStats || {};

  const finalStats = {};
  const keys = new Set([
    ...Object.keys(base),
    ...Object.keys(equipmentBonuses),
    ...Object.keys(temporary)
  ]);

  for (const stat of keys) {
    finalStats[stat] =
      Number(base[stat] || 0) +
      Number(equipmentBonuses[stat] || 0) +
      Number(temporary[stat] || 0);
  }

  state.finalStats = finalStats;

  /* maxHp/maxEnergy son valores derivados, no bonificaciones acumulativas. */
  const oldMaxHp = state.maxHp;
  const oldMaxEnergy = state.maxEnergy;
  state.maxHp = Math.max(1, finalStats.maxHp || 1);
  state.maxEnergy = Math.max(1, finalStats.maxEnergy || 1);

  if (oldMaxHp && state.maxHp !== oldMaxHp) state.hp = Math.min(state.hp, state.maxHp);
  if (oldMaxEnergy && state.maxEnergy !== oldMaxEnergy) state.energy = Math.min(state.energy, state.maxEnergy);
}

function normalizeEquipmentState(targetState) {
  const normalized = {};
  const source = targetState.equipment;

  if (source && typeof source === 'object') {
    for (const slot of EQUIPMENT_SLOTS) {
      const id = source[slot];
      const item = id ? getItem(id) : null;
      if (item && item.equippable && item.slot === slot) normalized[slot] = id;
    }
  }

  targetState.equipment = normalized;
  return targetState;
}
