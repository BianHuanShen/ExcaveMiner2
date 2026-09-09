/* ============================================================
   SISTEMA DE FABRICACIÓN
   Genérico y preparado para futuras recetas.
   ============================================================ */

function getCraftingRecipe(recipeId) {
  return CRAFTING_RECIPES[recipeId] || null;
}

function canCraft(recipeId) {
  const recipe = getCraftingRecipe(recipeId);
  if (!recipe) return false;

  return Object.entries(recipe.ingredients).every(([itemId, qty]) =>
    hasItem(itemId, Number(qty))
  );
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

  if (!addItem(recipe.result, recipe.amount || 1, { silent: true })) {
    return false;
  }

  for (const [itemId, qty] of Object.entries(recipe.ingredients)) {
    removeItem(itemId, Number(qty));
  }

  if (recipe.xp) gainXp(recipe.xp);

  log(`🔨 Fabricaste ${resultItem.icon} ${resultItem.name}.`, 'good');
  render();
  save();
  return true;
}

function getCraftingRecipes() {
  return Object.values(CRAFTING_RECIPES);
}
