// ============================================================
// XP / NIVEL
// ============================================================
function gainXp(amount) {
  state.xp += amount;
  while (state.xp >= state.xpNeeded) {
    state.xp -= state.xpNeeded;
    state.level++;
    state.xpNeeded = Math.round(state.xpNeeded * 1.4);
    state.baseStats.maxHp += 15;
    state.baseStats.maxEnergy += 10;
    rebuildPlayerStats();
    state.hp = state.maxHp;
    state.energy = state.maxEnergy;
    log(`✨ ¡Subiste al NIVEL ${state.level}! Vida y energía máximas aumentaron.`, 'good');
  }
}
