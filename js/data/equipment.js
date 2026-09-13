/* ============================================================
   DEFINICIONES DE EQUIPAMIENTO
   Datos de equipo + habilidades. La lógica vive en systems/equipment.js.
   ============================================================ */

const SET_IDS = Object.freeze({
  abyssal_miner: 'abyssal_miner'
});

const SET_BONUSES = Object.freeze({
  abyssal_miner: Object.freeze({
    name: 'Dominio del Abismo',
    pieces: Object.freeze([
      'crafted_miner_helmet',
      'crafted_miner_shirt',
      'crafted_miner_pants',
      'crafted_miner_boots',
      'crafted_miner_ring',
      'crafted_miner_sword',
      'crafted_miner_gloves',
      'crafted_miner_cloak'
    ]),
    stats: Object.freeze({
      damage: 10,
      defense: 10,
      maxHp: 20,
      maxEnergy: 20
    }),
    abilities: Object.freeze({
      hazardReduction: 15,
      energyRegenAmount: 5
    }),
    description: 'Cuando las 8 piezas están equipadas: +10 ataque, +10 defensa, +20 vida máxima, +20 energía máxima, 15% menos daño de peligros y +5 energía cada 10 segundos.'
  })
});

const EQUIPMENT_DEFINITIONS = {
  /* ===== EQUIPO DE EXPLORACIÓN EXISTENTE ===== */
  iron_buried_sword: {
    slot: 'weapon',
    stats: { damage: 8 }
  },

  cursed_ring: {
    slot: 'ring',
    stats: { defense: 2 },
    abilities: { energyRegenAmount: 5 }
  },

  lost_crown: {
    slot: 'helmet',
    stats: { defense: 4 },
    abilities: { mineAvoidChance: 10 }
  },

  dead_king_crown: {
    slot: 'helmet',
    stats: { defense: 5, damage: 1 },
    abilities: { mineAvoidChance: 15 }
  },
    /* ===== CICLA DEL MINERO PERDIDO ===== */
  lost_miner_bicycle: {
    slot: 'bicycle',
    stats: {},
    abilities: {
      healthRegenAmount: 3,
      healthRegenInterval: 20000
    }
  },
  /* ===== SET CRAFTEADO DEL MINERO DEL ABISMO ===== */
  crafted_miner_helmet: {
    slot: 'helmet',
    setId: SET_IDS.abyssal_miner,
    stats: { defense: 6, maxEnergy: 15 },
    abilities: { energyEfficiency: 8 }
  },

  crafted_miner_shirt: {
    slot: 'armor',
    setId: SET_IDS.abyssal_miner,
    stats: { defense: 8, maxHp: 20 },
    abilities: { damageReduction: 8 }
  },

  crafted_miner_pants: {
    slot: 'legs',
    setId: SET_IDS.abyssal_miner,
    stats: { defense: 5, maxEnergy: 10 },
    abilities: { hazardReduction: 6 }
  },

  crafted_miner_boots: {
    slot: 'boots',
    setId: SET_IDS.abyssal_miner,
    stats: { defense: 5 },
    abilities: { digEnergyFlatReduction: 1 }
  },

  crafted_miner_ring: {
    slot: 'ring',
    setId: SET_IDS.abyssal_miner,
    stats: { defense: 3, maxEnergy: 5 },
    abilities: { energyRegenAmount: 5 }
  },

  crafted_miner_sword: {
    slot: 'weapon',
    setId: SET_IDS.abyssal_miner,
    stats: { damage: 10 },
    abilities: { damageBonus: 4 }
  },

  crafted_miner_gloves: {
    slot: 'gloves',
    setId: SET_IDS.abyssal_miner,
    stats: { defense: 3 },
    abilities: { critChance: 8 }
  },

  crafted_miner_cloak: {
    slot: 'cloak',
    setId: SET_IDS.abyssal_miner,
    stats: { defense: 4, maxHp: 15 },
    abilities: { findChanceBonus: 8 }
  },

  /* ===== 6 AMULETOS: UNA HABILIDAD DISTINTA CADA UNO ===== */
  amulet_heartstone: {
    slot: 'amulet',
    stats: { maxHp: 25 },
    abilities: { healOnKill: 5 }
  },

  amulet_deep_reservoir: {
    slot: 'amulet',
    stats: { maxEnergy: 25 },
    abilities: { energyOnDig: 2 }
  },

  amulet_guardian_ward: {
    slot: 'amulet',
    stats: { defense: 8 },
    abilities: { hazardReduction: 8 }
  },

  amulet_hunter_eye: {
    slot: 'amulet',
    stats: { damage: 2 },
    abilities: { critChance: 8 }
  },

  amulet_luck_eye: {
    slot: 'amulet',
    stats: { maxEnergy: 5 },
    abilities: { rareFindChance: 2.5 }
  },

  amulet_executioner: {
    slot: 'amulet',
    stats: { damage: 5 },
    abilities: { damageBonus: 5 }
  },

  /* ===== SET BÁSICO EXCLUSIVO DE LOOT ===== */
  mine_basic_helmet: {
    slot: 'helmet',
    stats: { defense: 2, maxEnergy: 5 }
  },

  mine_basic_shirt: {
    slot: 'armor',
    stats: { defense: 2, maxHp: 5 }
  },

  mine_basic_pants: {
    slot: 'legs',
    stats: { defense: 1, maxEnergy: 5 }
  },

  mine_basic_boots: {
    slot: 'boots',
    stats: { defense: 1 }
  },

  /* ===== PICOS ===== */
  crafted_copper_pickaxe: {
    slot: 'tool',
    stats: {},
  },

  crafted_reinforced_pickaxe: {
    slot: 'tool',
    stats: {},
  },

  lost_depth_pickaxe: {
    slot: 'tool',
    stats: {},
  },

  lost_abyss_pickaxe: {
    slot: 'tool',
    stats: {},
  }
};
