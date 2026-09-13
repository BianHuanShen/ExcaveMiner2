/* ============================================================
   EQUIPMENT SYSTEM
   Equipamiento persistente + bonus de set + herramientas.
   ============================================================ */

const EQUIPMENT_SLOTS = [
  'weapon',
  'helmet',
  'armor',
  'legs',
  'boots',
  'ring',
  'amulet',
  'gloves',
  'cloak',
  'bicycle',
  'tool'
];

const EQUIPMENT_SLOT_LABELS = {
  weapon: 'Arma',
  helmet: 'Casco',
  armor: 'Camisa',
  legs: 'Piernas',
  boots: 'Zapatos',
  ring: 'Anillo',
  amulet: 'Amuleto',
  gloves: 'Guantes',
  cloak: 'Capa',
  bicycle: 'Vehículo',
  tool: 'Herramienta'
};

function getEquipment() {
  if (!state.equipment || typeof state.equipment !== 'object') state.equipment = {};
  return state.equipment;
}

function getEquippedItem(slot) {
  const id = getEquipment()[slot];
  return id ? getItem(id) : null;
}

function isToolItem(item) {
  return Boolean(item?.slot === 'tool' && item?.pickaxeData);
}

function isSetComplete(setId = SET_IDS.abyssal_miner) {
  const set = SET_BONUSES[setId];
  if (!set) return false;
  const equipment = getEquipment();
  return set.pieces.every(itemId => {
    const item = getItem(itemId);
    return item && equipment[item.slot] === itemId;
  });
}

function getSetProgress(setId = SET_IDS.abyssal_miner) {
  const set = SET_BONUSES[setId];
  if (!set) return { equipped: 0, total: 0, missing: [] };
  const equipment = getEquipment();
  const equipped = set.pieces.filter(itemId => {
    const item = getItem(itemId);
    return item && equipment[item.slot] === itemId;
  });
  return {
    equipped: equipped.length,
    total: set.pieces.length,
    missing: set.pieces.filter(id => !equipped.includes(id))
  };
}

function getActiveSetBonus(setId = SET_IDS.abyssal_miner) {
  return isSetComplete(setId) ? SET_BONUSES[setId] : null;
}

function getToolDurabilityMap() {
  if (!state.toolDurability || typeof state.toolDurability !== 'object') {
    state.toolDurability = {};
  }
  return state.toolDurability;
}

function getToolDurability(itemId, fallback = 0) {
  const value = Number(getToolDurabilityMap()[itemId]);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function setToolDurability(itemId, value) {
  if (!itemId) return;
  const item = getItem(itemId);
  if (!item?.pickaxeData) return;
  const max = Number(item.pickaxeData.maxDurability || 0);
  getToolDurabilityMap()[itemId] = Math.max(0, Math.min(max, Math.round(Number(value) || 0)));
  if (getEquipment().tool === itemId) state.pickaxeDurability = getToolDurabilityMap()[itemId];
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
    const previousItem = getItem(previous);
    if (isToolItem(previousItem)) {
      getToolDurabilityMap()[previous] = Number(state.pickaxeDurability || getToolDurability(previous, previousItem.pickaxeData.maxDurability));
    }

    /* Libera temporalmente el slot para que addItem pueda devolver
       la pieza anterior a la mochila. */
    delete equipment[item.slot];

    if (!addItem(previous, 1, { silent: true })) {
      equipment[item.slot] = previous;
      log('🎒 No hay espacio para retirar el objeto equipado.', 'bad');
      return false;
    }
  }

  removeItem(itemId, 1);
  equipment[item.slot] = itemId;

  if (isToolItem(item)) {
    const startDurability = getToolDurability(
      itemId,
      Number(item.pickaxeData.currentDurability ?? item.pickaxeData.maxDurability)
    );
    setToolDurability(itemId, startDurability);
    state.pickaxeDurability = startDurability;
  }

  rebuildPlayerStats();
  log(`🛡️ Equipaste ${item.icon} ${item.name}.`, 'good');
  playSfx('equip');
  render();
  playEquipVisual(item);
  save();
  return true;
}

function unequipSlot(slot) {
  const equipment = getEquipment();
  const itemId = equipment[slot];
  if (!itemId) return false;

  const item = getItem(itemId);
  if (!item) {
    // Evita dejar una referencia rota en el slot si una partida antigua
    // contiene un ID de objeto que ya no existe.
    delete equipment[slot];
    rebuildPlayerStats();
    render();
    save();
    log('⚠️ Se eliminó una referencia de objeto inválida del equipamiento.', 'bad');
    return false;
  }

  if (isToolItem(item)) {
    setToolDurability(itemId, state.pickaxeDurability);
  }

  /*
   * addItem() protege los objetos no apilables contra duplicados mientras
   * siguen equipados. Por eso primero liberamos temporalmente el slot.
   * Si la mochila está llena, restauramos inmediatamente el equipamiento.
   */
  delete equipment[slot];

  if (!addItem(itemId, 1, { silent: true })) {
    equipment[slot] = itemId;

    if (isToolItem(item)) {
      state.pickaxeId = itemId;
      state.pickaxeDurability = getToolDurability(
        itemId,
        Number(item.pickaxeData.currentDurability ?? item.pickaxeData.maxDurability)
      );
    }

    rebuildPlayerStats();
    log('🎒 No hay espacio en la mochila. El objeto permanece equipado.', 'bad');
    render();
    return false;
  }

  if (isToolItem(item)) {
    state.pickaxeId = null;
    state.pickaxeDurability = 0;
  }

  rebuildPlayerStats();
  log(`🛡️ Desequipaste ${item.icon} ${item.name}.`, 'info');
  playSfx('unequip');
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

  const setBonus = getActiveSetBonus();
  if (setBonus?.stats) {
    for (const [stat, value] of Object.entries(setBonus.stats)) {
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

  const setBonus = getActiveSetBonus();
  if (setBonus?.abilities) {
    for (const [key, value] of Object.entries(setBonus.abilities)) {
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

  state.baseStats = state.baseStats && typeof state.baseStats === 'object'
    ? state.baseStats
    : {};

  const base = {
    damage: Number(state.baseStats.damage ?? 1),
    defense: Number(state.baseStats.defense ?? 0),
    maxHp: Number(state.baseStats.maxHp ?? state.maxHp ?? 100),
    maxEnergy: Number(state.baseStats.maxEnergy ?? state.maxEnergy ?? 100)
  };

  state.baseStats = base;

  const equipmentBonuses = calculateEquipmentBonuses();
  const equipmentAbilities = calculateEquipmentAbilities();
  const previousRegenAmount = Number(state._energyRegenAmount || 0);
  const nextRegenAmount = Number(equipmentAbilities.energyRegenAmount || 0);
  if (previousRegenAmount !== nextRegenAmount) {
    state.lastEnergyRegenAt = Date.now();
    state._energyRegenAmount = nextRegenAmount;
  }

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

  for (const stat of Object.keys(finalStats)) {
    if (!Number.isFinite(finalStats[stat])) finalStats[stat] = 0;
  }

  state.finalStats = finalStats;

  const oldMaxHp = state.maxHp;
  const oldMaxEnergy = state.maxEnergy;
  state.maxHp = Math.max(1, Math.round(finalStats.maxHp || 1));
  state.maxEnergy = Math.max(1, Math.round(finalStats.maxEnergy || 1));

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

function normalizeToolState(targetState) {
  targetState.toolDurability = targetState.toolDurability && typeof targetState.toolDurability === 'object'
    ? targetState.toolDurability
    : {};

  const equipment = targetState.equipment && typeof targetState.equipment === 'object'
    ? targetState.equipment
    : {};

  let toolId = equipment.tool;

  /* Migración de partidas antiguas que guardaban pickaxeIndex. */
  const legacyIndex = Number(targetState.pickaxeIndex);
  if (!Number.isFinite(Number(targetState.unlockedPickaxeIndex))) {
    targetState.unlockedPickaxeIndex = Number.isFinite(legacyIndex) ? Math.max(0, legacyIndex) : 0;
  }

  if (!toolId) {
    const legacyPickaxe = PICKAXES[legacyIndex] || PICKAXES[0];
    toolId = legacyPickaxe?.id;
    if (toolId) equipment.tool = toolId;
  }

  const tool = toolId ? getItem(toolId) : null;
  if (tool && isToolItem(tool)) {
    const legacyDurability = Number(targetState.pickaxeDurability);
    const stored = Number(targetState.toolDurability[toolId]);
    const fallback = Number(tool.pickaxeData.currentDurability ?? tool.pickaxeData.maxDurability);
    const durability = Number.isFinite(stored)
      ? stored
      : (Number.isFinite(legacyDurability) ? legacyDurability : fallback);

    targetState.toolDurability[toolId] = Math.max(
      0,
      Math.min(Number(tool.pickaxeData.maxDurability), Math.round(durability))
    );
    targetState.pickaxeDurability = targetState.toolDurability[toolId];
    targetState.pickaxeId = toolId;
  } else {
    delete equipment.tool;
    targetState.pickaxeId = null;
    targetState.pickaxeDurability = 0;
  }

  delete targetState.pickaxeIndex;
  targetState.equipment = equipment;
  return targetState;
}

function findReplacementTool(excludedId = null) {
  return getInventoryEntries().find(entry =>
    isToolItem(entry.item) && entry.id !== excludedId
  )?.id || null;
}

function equipReplacementTool() {
  const replacement = findReplacementTool();
  if (!replacement) {
    log('⛏️ Necesitas conservar al menos un pico equipado o tener otro pico en la mochila.', 'bad');
    return false;
  }
  return equipItem(replacement);
}

function sellEquippedItem(slot) {
  const equipment = getEquipment();
  const itemId = equipment[slot];
  const item = itemId ? getItem(itemId) : null;
  if (!item || !item.sellable || typeof getSellPrice !== 'function') return false;

  if (isToolItem(item) && !findReplacementTool(itemId)) {
    log('⛏️ No puedes vender tu último pico. Equipa o compra otro antes.', 'bad');
    return false;
  }

  const price = Number(getSellPrice(itemId) || 0);
  if (price <= 0) return false;

  if (isToolItem(item)) setToolDurability(itemId, state.pickaxeDurability);
  delete equipment[slot];
  if (isToolItem(item)) {
    delete getToolDurabilityMap()[itemId];
    state.pickaxeId = null;
    state.pickaxeDurability = 0;
  }

  state.gold += price;
  rebuildPlayerStats();
  log(`🪙 Vendiste ${item.icon} ${item.name} por ${price} oro.`, 'good');

  if (isToolItem(item)) equipReplacementTool();
  else {
    render();
    save();
  }
  return true;
}

function dropEquippedItem(slot) {
  const equipment = getEquipment();
  const itemId = equipment[slot];
  const item = itemId ? getItem(itemId) : null;
  if (!item || item.droppable !== true) return false;

  if (isToolItem(item) && !findReplacementTool(itemId)) {
    log('⛏️ No puedes tirar tu último pico. Conserva una herramienta para seguir excavando.', 'bad');
    return false;
  }

  delete equipment[slot];
  if (isToolItem(item)) {
    delete getToolDurabilityMap()[itemId];
    state.pickaxeId = null;
    state.pickaxeDurability = 0;
  }

  rebuildPlayerStats();
  log(`🗑️ Tiraste ${item.icon} ${item.name}.`, 'info');

  if (isToolItem(item)) equipReplacementTool();
  else {
    render();
    save();
  }
  return true;
}

/* ============================================================
   REGENERACIÓN PERIÓDICA DE EQUIPAMIENTO (Energía y Vida)
   ============================================================ */

let equipmentRegenTimer = null;

function ensureEquipmentRegenLoop() {
  if (equipmentRegenTimer !== null) return;

  equipmentRegenTimer = setInterval(() => {
    if (!state) return;

    const now = Date.now();

    // --------------------------------------------------------
    // 1. REGENERACIÓN DE ENERGÍA
    // --------------------------------------------------------
    const energyAmount = Math.max(0, Math.round(getEquipmentAbility('energyRegenAmount')));

    if (energyAmount > 0 && state.energy < state.maxEnergy) {
      const lastEnergy = Number(state.lastEnergyRegenAt || 0);

      if (!lastEnergy) {
        state.lastEnergyRegenAt = now;
      } else if (now - lastEnergy >= 10000) {
        state.lastEnergyRegenAt = now;
        state.energy = Math.min(state.maxEnergy, state.energy + energyAmount);
        log(`⚡ Regeneración de equipo: +${energyAmount} energía.`, 'good');
        render();
        save();
      }
    }

    // --------------------------------------------------------
    // 2. REGENERACIÓN DE VIDA (Cicla del Minero Perdido)
    // --------------------------------------------------------
    const healthAmount = Math.max(0, Math.round(getEquipmentAbility('healthRegenAmount')));
    const healthInterval = Math.max(1000, Math.round(getEquipmentAbility('healthRegenInterval') || 20000));

    if (healthAmount > 0 && state.hp < state.maxHp) {
      const lastHealth = Number(state.lastHealthRegenAt || 0);

      if (!lastHealth) {
        state.lastHealthRegenAt = now;
      } else if (now - lastHealth >= healthInterval) {
        state.lastHealthRegenAt = now;

        const oldHp = state.hp;
        state.hp = Math.min(state.maxHp, state.hp + healthAmount);
        const recovered = state.hp - oldHp;

        if (recovered > 0) {
          log(`❤️ La Cicla del Minero Perdido recuperó +${recovered} de vida.`, 'good');
          render();
          save();
        }
      }
    }

  }, 1000);
}

ensureEquipmentRegenLoop();
