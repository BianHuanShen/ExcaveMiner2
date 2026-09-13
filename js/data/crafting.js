/* ============================================================
   RECETAS DE FABRICACIÓN
   Regla de balance: el equipamiento fabricado supera en números
   a las piezas equivalentes obtenidas como loot.
   ============================================================ */

const CRAFTING_RECIPES = {
  forged_iron_ingot: {
    id: 'forged_iron_ingot', result: 'forged_iron_ingot', amount: 1,
    ingredients: { iron_ore: 3, coal_chunk: 1, stone: 2 }, xp: 8
  },
  reinforced_fabric: {
    id: 'reinforced_fabric', result: 'reinforced_fabric', amount: 1,
    ingredients: { rough_fiber: 3, crystal_fragment: 2, miner_leather: 1 }, xp: 10
  },
  tempered_plate: {
    id: 'tempered_plate', result: 'tempered_plate', amount: 1,
    ingredients: { forged_iron_ingot: 2, obsidian_shard: 1, iron_ore: 2 }, xp: 15
  },
  energy_gem: {
    id: 'energy_gem', result: 'energy_gem', amount: 1,
    ingredients: { blue_crystal: 2, ruby: 1, sapphire: 1 }, xp: 18
  },

  crafted_miner_helmet: {
    id: 'crafted_miner_helmet', result: 'crafted_miner_helmet', amount: 1,
    ingredients: { forged_iron_ingot: 2, reinforced_fabric: 1, energy_gem: 1, cave_silk: 1 }, xp: 28
  },
  crafted_miner_shirt: {
    id: 'crafted_miner_shirt', result: 'crafted_miner_shirt', amount: 1,
    ingredients: { tempered_plate: 2, reinforced_fabric: 2, miner_leather: 1, titan_scale: 1 }, xp: 35
  },
  crafted_miner_pants: {
    id: 'crafted_miner_pants', result: 'crafted_miner_pants', amount: 1,
    ingredients: { tempered_plate: 1, reinforced_fabric: 2, forged_iron_ingot: 1, runic_bone: 1 }, xp: 30
  },
  crafted_miner_boots: {
    id: 'crafted_miner_boots', result: 'crafted_miner_boots', amount: 1,
    ingredients: { tempered_plate: 1, reinforced_fabric: 1, blue_crystal: 1, void_thread: 1 }, xp: 32
  },
  crafted_miner_ring: {
    id: 'crafted_miner_ring', result: 'crafted_miner_ring', amount: 1,
    ingredients: { silver_nugget: 2, energy_gem: 1, star_essence: 1 }, xp: 40
  },
  crafted_miner_sword: {
    id: 'crafted_miner_sword', result: 'crafted_miner_sword', amount: 1,
    ingredients: { forged_iron_ingot: 3, obsidian_shard: 1, ruby: 1, royal_steel: 1 }, xp: 38
  },
  crafted_miner_gloves: {
    id: 'crafted_miner_gloves', result: 'crafted_miner_gloves', amount: 1,
    ingredients: { forged_iron_ingot: 1, reinforced_fabric: 1, blood_ore: 1, cave_silk: 1 }, xp: 28
  },
  crafted_miner_cloak: {
    id: 'crafted_miner_cloak', result: 'crafted_miner_cloak', amount: 1,
    ingredients: { reinforced_fabric: 3, moon_stone: 1, sun_crystal: 1, void_thread: 1 }, xp: 42
  },

  crafted_copper_pickaxe: {
    id: 'crafted_copper_pickaxe', result: 'crafted_copper_pickaxe', amount: 1,
    ingredients: { copper_ore: 6, iron_ore: 2, coal_chunk: 1, wood_ash: 1 }, xp: 20
  },
  crafted_reinforced_pickaxe: {
    id: 'crafted_reinforced_pickaxe', result: 'crafted_reinforced_pickaxe', amount: 1,
    ingredients: { iron_ore: 8, copper_ore: 4, coal_chunk: 3, rough_fiber: 2 }, xp: 28
  },

  amulet_heartstone: {
    id: 'amulet_heartstone', result: 'amulet_heartstone', amount: 1,
    ingredients: { iron_ore: 2, blood_ore: 1, ember_core: 1 }, xp: 25
  },
  amulet_deep_reservoir: {
    id: 'amulet_deep_reservoir', result: 'amulet_deep_reservoir', amount: 1,
    ingredients: { blue_crystal: 2, frost_shard: 1, energy_gem: 1 }, xp: 25
  },
  amulet_guardian_ward: {
    id: 'amulet_guardian_ward', result: 'amulet_guardian_ward', amount: 1,
    ingredients: { tempered_plate: 1, titan_scale: 1, silver_nugget: 1 }, xp: 30
  },
  amulet_hunter_eye: {
    id: 'amulet_hunter_eye', result: 'amulet_hunter_eye', amount: 1,
    ingredients: { copper_wire: 2, cave_silk: 2, ruby: 1 }, xp: 28
  },
  amulet_luck_eye: {
    id: 'amulet_luck_eye', result: 'amulet_luck_eye', amount: 1,
    ingredients: { moon_stone: 1, star_essence: 1, emerald_shard: 1 }, xp: 45
  },
  amulet_executioner: {
    id: 'amulet_executioner', result: 'amulet_executioner', amount: 1,
    ingredients: { obsidian_shard: 2, royal_steel: 1, abyss_steel: 1 }, xp: 50
  }
};

function getCraftingRecipe(recipeId) {
  return CRAFTING_RECIPES[recipeId] || null;
}

function canCraft(recipeId) {
  const recipe = getCraftingRecipe(recipeId);
  if (!recipe) return false;
  return Object.entries(recipe.ingredients).every(([itemId, qty]) => hasItem(itemId, Number(qty)));
}

function craftItem(recipeId) {
  const recipe = getCraftingRecipe(recipeId);
  if (!recipe) return false;

  if (!canCraft(recipeId)) {
    log('🛠️ No tienes todos los materiales necesarios.', 'bad');
    return false;
  }

  const resultItem = getItem(recipe.result);
  if (!resultItem) return false;
  if (!addItem(recipe.result, recipe.amount || 1, { silent: true })) return false;

  for (const [itemId, qty] of Object.entries(recipe.ingredients)) removeItem(itemId, Number(qty));

  if (recipe.xp) gainXp(recipe.xp);

  if (resultItem.pickaxeData) {
    state.toolDurability = state.toolDurability || {};
    state.toolDurability[resultItem.id] = resultItem.pickaxeData.maxDurability;
  }

  log(`🔨 Fabricaste ${resultItem.icon} ${resultItem.name}.`, 'good');
  render();
  save();
  return true;
}

function getCraftingRecipes() {
  return Object.values(CRAFTING_RECIPES);
}
