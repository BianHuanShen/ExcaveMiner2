// ============================================================
// EL MINERO DEL ABISMO - DATOS DEL JUEGO
// ============================================================

const SAVE_KEY = 'minero-abismo-save';

const DIFFICULTIES = Object.freeze({
  facil:   Object.freeze({ hazardMult: 0.5, damageMult: 0.6, mobChanceMult: 0.5, mobDamageMult: 0.6, label: '😌 Fácil' }),
  normal:  Object.freeze({ hazardMult: 1.0, damageMult: 1.0, mobChanceMult: 1.0, mobDamageMult: 1.0, label: '⚔️ Normal' }),
  dificil: Object.freeze({ hazardMult: 1.6, damageMult: 1.4, mobChanceMult: 1.5, mobDamageMult: 1.4, label: '💀 Difícil' })
});

function normalizeDifficulty(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (raw === 'facil' || raw === 'fácil' || raw.includes('fácil')) return 'facil';
  if (raw === 'normal' || raw.includes('normal')) return 'normal';
  if (raw === 'dificil' || raw === 'difícil' || raw.includes('difícil')) return 'dificil';
  if (raw === 'easy') return 'facil';
  if (raw === 'hard') return 'dificil';
  return 'facil';
}

function getDifficultyConfig(value) {
  return DIFFICULTIES[normalizeDifficulty(value)];
}


// Configuración central de enemigos; ajustar aquí no requiere tocar la IA.
const MOB_CONFIG = Object.freeze({
  baseSpawnChance: 20,
  maxSpawnChance: 45,
  moveInterval: 900,
  baseHp: 18,
  baseDamage: 4,
  hpPerDepth: 0.35,
  damagePerDepth: 0.12
});

const PICKAXES = [
  {
    id: 'rusted_pickaxe', name: 'Pico oxidado', damage: 1, speed: 1,
    maxDurability: 50, price: 0, repairBasePrice: 20, shop: true, repairable: true
  },
  {
    id: 'iron_pickaxe', name: 'Pico de hierro', damage: 2, speed: 2,
    maxDurability: 150, price: 150, repairBasePrice: 60, shop: true, repairable: true
  },
  {
    id: 'steel_pickaxe', name: 'Pico de acero', damage: 4, speed: 3,
    maxDurability: 300, price: 400, repairBasePrice: 140, shop: true, repairable: true
  },
  {
    id: 'gold_pickaxe', name: 'Pico de oro', damage: 7, speed: 4,
    maxDurability: 500, price: 900, repairBasePrice: 300, shop: true, repairable: true
  },
  {
    id: 'diamond_pickaxe', name: 'Pico de diamante', damage: 12, speed: 5,
    maxDurability: 1000, price: 2000, repairBasePrice: 650, shop: true, repairable: true
  },
  {
    id: 'abyss_pickaxe', name: 'Pico del Abismo', damage: 20, speed: 6,
    maxDurability: 99999, price: 5000, repairBasePrice: 2000, shop: true, repairable: true
  },

  /* Picos crafteables: más fuertes que los picos perdidos de la mina. */
  {
    id: 'crafted_copper_pickaxe', name: 'Pico de cobre reforzado', damage: 4, speed: 2,
    maxDurability: 180, price: 0, shop: false, repairable: true
  },
  {
    id: 'crafted_reinforced_pickaxe', name: 'Pico de hierro reforzado', damage: 7, speed: 3,
    maxDurability: 280, price: 0, shop: false, repairable: true
  },

  /* Loot raro: siempre aparece usado a 20/40. No se repara. */
  {
    id: 'lost_depth_pickaxe', name: 'Pico perdido de las Profundidades', damage: 3, speed: 2,
    maxDurability: 40, currentDurability: 20, price: 0, shop: false, repairable: false
  },
  {
    id: 'lost_abyss_pickaxe', name: 'Pico perdido del Abismo', damage: 5, speed: 3,
    maxDurability: 40, currentDurability: 20, price: 0, shop: false, repairable: false
  }
];

const RARITY_LABELS = {
  common: 'Común',
  uncommon: 'Poco común',
  rare: 'Raro',
  very_rare: 'Muy raro',
  epic: 'Épico',
  legendary: 'Legendario'
};

const BAG_UPGRADE_PRICE = (size) => 30 + size * 8;
const POTION_HEAL_PRICE = 40;
const POTION_ENERGY_PRICE = 30;
