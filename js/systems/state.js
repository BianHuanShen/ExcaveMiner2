// ============================================================
// ESTADO INICIAL Y CONSTANTES DE PARTIDA
// ============================================================
function newGameState(difficulty) {
  difficulty = normalizeDifficulty(difficulty);

  const starterTool = PICKAXES[0];

  return {
    difficulty,
    hp: 100, maxHp: 100,
    energy: 100, maxEnergy: 100,
    gold: 0,
    xp: 0, level: 1, xpNeeded: 100,

    /* Compatibilidad: pickaxeIndex ya no controla el equipo actual. */
    pickaxeId: starterTool.id,
    pickaxeDurability: starterTool.maxDurability,
    unlockedPickaxeIndex: 0,
    toolDurability: { [starterTool.id]: starterTool.maxDurability },

    pickaxeRepairs: {},
    inventory: {},
    equipment: { tool: starterTool.id },
    bagSize: 10,

    baseStats: { damage: 1, defense: 0, maxHp: 100, maxEnergy: 100 },
    temporaryStats: {},
    finalStats: {},

    pos: { x: 0, y: 0 },
    discovered: { '0,0': { dug: true } },
    moneyCheatLastUsed: 0,
    lastSleepAt: 0,
    lastEnergyRegenAt: 0,
    lastHealthRegenAt: 0,
    mobs: [],
    nextMobId: 1,
    shelters: []
  };
}

// Devuelve el pico actualmente equipado como definición de herramienta.
// Los datos viven en el propio objeto del inventario/equipamiento.
function pickaxe() {
  const equippedId = state?.equipment?.tool;
  const equipped = equippedId ? getItem(equippedId) : null;

  /* Ruta principal: el objeto ya contiene su definición de herramienta. */
  if (equipped?.pickaxeData) return equipped.pickaxeData;

  /*
   * Fallback defensivo: si una partida antigua conserva equipment.tool pero
   * el objeto todavía no fue enriquecido con pickaxeData, recuperamos la
   * definición desde PICKAXES. Esto evita "Sin pico" y errores undefined.
   */
  if (equippedId) {
    const definition = PICKAXES.find(p => p.id === equippedId);
    if (definition) {
      if (equipped) equipped.pickaxeData = { ...definition };
      return definition;
    }
  }

  const legacyIndex = Number(state?.pickaxeIndex);
  if (Number.isFinite(legacyIndex)) {
    return PICKAXES[legacyIndex] || PICKAXES[0];
  }

  return {
    id: null,
    name: 'Sin pico',
    damage: 0,
    speed: 1,
    maxDurability: 0,
    repairable: false
  };
}
