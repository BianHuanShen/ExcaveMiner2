// ============================================================
// ESTADO INICIAL Y CONSTANTES DE PARTIDA
// ============================================================
function newGameState(difficulty) {
  difficulty = normalizeDifficulty(difficulty);
  return {
    difficulty,
    hp: 100, maxHp: 100,
    energy: 100, maxEnergy: 100,
    gold: 0,
    xp: 0, level: 1, xpNeeded: 100,
    pickaxeIndex: 0,
    pickaxeDurability: PICKAXES[0].maxDurability,
    pickaxeRepairs: {},
    inventory: {},
    equipment: {},
    bagSize: 10,
    baseStats: { damage: 1, defense: 0, maxHp: 100, maxEnergy: 100 },
    temporaryStats: {},
    finalStats: {},
    pos: { x: 0, y: 0 },
    discovered: { '0,0': { dug: true } },
    moneyCheatLastUsed: 0,
    lastSleepAt: 0,
    mobs: [],
    nextMobId: 1,
    shelters: []
  };
}

// Devuelve el pico actualmente equipado.
function pickaxe() {
  return PICKAXES[state.pickaxeIndex] || PICKAXES[0];
}
