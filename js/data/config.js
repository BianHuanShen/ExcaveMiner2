// ============================================================
// EL MINERO DEL ABISMO - DATOS DEL JUEGO
// ============================================================

const SAVE_KEY = 'minero-abismo-save';

const DIFFICULTIES = Object.freeze({
  facil:   Object.freeze({ hazardMult: 0.5, damageMult: 0.6, label: '😌 Fácil' }),
  normal:  Object.freeze({ hazardMult: 1.0, damageMult: 1.0, label: '⚔️ Normal' }),
  dificil: Object.freeze({ hazardMult: 1.6, damageMult: 1.4, label: '💀 Difícil' })
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

const PICKAXES = [
  { name: 'Pico oxidado', damage: 1, speed: 1.0, maxDurability: 50,  price: 0, repairBasePrice: 20 },
  { name: 'Pico de hierro', damage: 2, speed: 1.3, maxDurability: 150, price: 150, repairBasePrice: 60 },
  { name: 'Pico de acero', damage: 4, speed: 1.8, maxDurability: 300, price: 400, repairBasePrice: 140 },
  { name: 'Pico de oro', damage: 7, speed: 2.5, maxDurability: 500, price: 900, repairBasePrice: 300 },
  { name: 'Pico de diamante', damage: 12, speed: 4.0, maxDurability: 1000, price: 2000, repairBasePrice: 650 },
  { name: 'Pico del Abismo', damage: 20, speed: 6.0, maxDurability: 99999, price: 5000, repairBasePrice: 2000 }
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
