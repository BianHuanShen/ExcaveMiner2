/* ============================================================
   RECETAS DE FABRICACIÓN
   Sistema escalable: para añadir una receta futura solo agrega
   un registro con id, ingredientes, resultado y cantidad.
   ============================================================ */

const CRAFTING_RECIPES = {
  forged_iron_ingot: {
    id: 'forged_iron_ingot',
    result: 'forged_iron_ingot',
    amount: 1,
    ingredients: { iron_ore: 3, coal_chunk: 1, stone: 2 },
    xp: 8
  },
  reinforced_fabric: {
    id: 'reinforced_fabric',
    result: 'reinforced_fabric',
    amount: 1,
    ingredients: { rough_fiber: 3, crystal_fragment: 2, miner_leather: 1 },
    xp: 10
  },
  tempered_plate: {
    id: 'tempered_plate',
    result: 'tempered_plate',
    amount: 1,
    ingredients: { forged_iron_ingot: 2, obsidian_shard: 1, iron_ore: 2 },
    xp: 15
  },
  energy_gem: {
    id: 'energy_gem',
    result: 'energy_gem',
    amount: 1,
    ingredients: { blue_crystal: 2, ruby: 1, sapphire: 1 },
    xp: 18
  },

  crafted_miner_helmet: {
    id: 'crafted_miner_helmet',
    result: 'crafted_miner_helmet',
    amount: 1,
    ingredients: { forged_iron_ingot: 2, reinforced_fabric: 1, energy_gem: 1 },
    xp: 25
  },
  crafted_miner_shirt: {
    id: 'crafted_miner_shirt',
    result: 'crafted_miner_shirt',
    amount: 1,
    ingredients: { tempered_plate: 2, reinforced_fabric: 2, forged_iron_ingot: 1 },
    xp: 25
  },
  crafted_miner_pants: {
    id: 'crafted_miner_pants',
    result: 'crafted_miner_pants',
    amount: 1,
    ingredients: { tempered_plate: 1, reinforced_fabric: 2, forged_iron_ingot: 1 },
    xp: 25
  },
  crafted_miner_boots: {
    id: 'crafted_miner_boots',
    result: 'crafted_miner_boots',
    amount: 1,
    ingredients: { tempered_plate: 1, reinforced_fabric: 1, blue_crystal: 1 },
    xp: 25
  },
  crafted_miner_sword: {
    id: 'crafted_miner_sword',
    result: 'crafted_miner_sword',
    amount: 1,
    ingredients: { forged_iron_ingot: 3, obsidian_shard: 1, ruby: 1 },
    xp: 30
  }
};
