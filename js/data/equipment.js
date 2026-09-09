/* ============================================================
   DEFINICIONES DE EQUIPAMIENTO
   Solo contiene datos. La lógica vive en systems/equipment.js.
   ============================================================ */

const EQUIPMENT_DEFINITIONS = {
  iron_buried_sword: {
    slot: 'weapon',
    stats: { damage: 10 }
  },

  cursed_ring: {
    slot: 'ring',
    stats: { damage: 3, defense: -2 }
  },

  lost_crown: {
    slot: 'helmet',
    stats: { defense: 4 }
  },

  dead_king_crown: {
    slot: 'helmet',
    stats: { defense: 10, damage: 2 }
  },

  crafted_miner_helmet: {
    slot: 'helmet',
    stats: { defense: 3, maxEnergy: 10 },
    abilities: { energyEfficiency: 0.05 }
  },
  crafted_miner_shirt: {
    slot: 'armor',
    stats: { defense: 4, maxHp: 10 },
    abilities: { damageReduction: 0.05 }
  },
  crafted_miner_pants: {
    slot: 'legs',
    stats: { defense: 2, maxEnergy: 5 },
    abilities: { energyEfficiency: 0.05 }
  },
  crafted_miner_boots: {
    slot: 'boots',
    stats: { defense: 2 },
    abilities: { mineDoubleChance: 0.05 }
  },
  crafted_miner_sword: {
    slot: 'weapon',
    stats: { damage: 8 },
    abilities: { damageBonus: 2 }
  }
};
