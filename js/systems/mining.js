// ============================================================
// EXCAVACIÓN
// ============================================================
document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (!state) return;

  const active = document.activeElement;
  if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return;

  switch (e.key) {
    case "ArrowUp":
      e.preventDefault();
      dig("up");
      break;

    case "ArrowDown":
      e.preventDefault();
      dig("down");
      break;

    case "ArrowLeft":
      e.preventDefault();
      dig("left");
      break;

    case "ArrowRight":
      e.preventDefault();
      dig("right");
      break;
  }
});
function energyCost() {
  const base = Math.max(2, Math.round(5 / pickaxe().speed));
  const efficiency = typeof getEquipmentAbility === 'function'
    ? Math.min(0.75, getEquipmentAbility('energyEfficiency'))
    : 0;
  return Math.max(1, Math.round(base * (1 - efficiency)));
}

function dig(direction, bonusDig = false) {
  if (state.hp <= 0) return;

  const cost = energyCost();

  if (state.energy < cost) {
    log('😴 Estás demasiado cansado para seguir excavando. Vuelve al refugio a dormir.', 'bad');
    return;
  }

  const newPos = { ...state.pos };

  if (direction === 'up') newPos.y += 1;
  if (direction === 'down') newPos.y -= 1;
  if (direction === 'left') newPos.x -= 1;
  if (direction === 'right') newPos.x += 1;

  state.energy -= cost;
  state.pos = newPos;

  const key = `${newPos.x},${newPos.y}`;
  const depth = depthOf(newPos);
  const diffMult = getDifficultyConfig(state.difficulty);

  // Comprobar si este lugar ya fue excavado ANTES de marcarlo
  const alreadyDug = state.discovered[key]?.dug === true;

  if (!alreadyDug) {
    state.discovered[key] = { dug: true };
    lastDugKey = key;
  } else {
    lastDugKey = null;
  }

  log(`⛏️ Excavando hacia ${dirLabel(direction)}... (profundidad ${depth})`, 'info');

  // ---- PELIGROS ----
  let tookDamage = false;

  if (direction === 'up') {
    const rockChance = clamp(10 + depth * 0.4, 5, 45) * diffMult.hazardMult;

    if (roll(rockChance)) {
      const reduction = typeof getEquipmentAbility === 'function' ? Math.min(0.75, getEquipmentAbility('damageReduction')) : 0;
      const dmg = Math.max(1, Math.round((5 + depth * 0.3) * diffMult.damageMult * (1 - reduction)));
      state.hp -= dmg;

      log(`🪨 ¡Una roca cae desde arriba! Pierdes ${dmg} de vida.`, 'bad');
      tookDamage = true;
    }
  }

  const mineChance = clamp(4 + depth * 0.25, 2, 25) * diffMult.hazardMult;

  if (roll(mineChance)) {
    const reduction = typeof getEquipmentAbility === 'function' ? Math.min(0.75, getEquipmentAbility('damageReduction')) : 0;
    const dmg = Math.max(1, Math.round((12 + depth * 0.5) * diffMult.damageMult * (1 - reduction)));
    state.hp -= dmg;

    log(`💥 ¡MINA EXPLOSIVA! La explosión te hiere por ${dmg} de vida.`, 'bad');

    state.pickaxeDurability = Math.max(
      0,
      state.pickaxeDurability - 15
    );

    tookDamage = true;
  }

  if (state.hp <= 0) {
    handleFaint();
    render();
    save();
    return;
  }

  // ---- DURABILIDAD DEL PICO ----
  state.pickaxeDurability = Math.max(
    0,
    state.pickaxeDurability - 1
  );

  if (state.pickaxeDurability <= 0) {
    log(
      '⛏️ ¡Tu pico se ha roto! Visita la tienda para repararlo.',
      'bad'
    );
  }

  // ---- BÚSQUEDA DE TESOROS ----
  // Solo se pueden encontrar items la PRIMERA vez que se excava
  // esta casilla.
  if (!alreadyDug) {
    const findChance = clamp(
      60 + pickaxe().damage * 1.2,
      60,
      90
    );

    if (roll(findChance)) {
      resolveFind(depth);
    } else {
      log('💨 No encontraste nada esta vez.', 'info');
    }
  } else {
    log(
      '🕳️ Este lugar ya fue excavado. No hay nada más que encontrar aquí.',
      'info'
    );
  }

  render();
  if (lastDugKey === key) {
    setTimeout(() => {
      if (lastDugKey === key) lastDugKey = null;
    }, 520);
  }

  if (!bonusDig && typeof getEquipmentAbility === 'function') {
    const chance = Math.min(0.5, getEquipmentAbility('mineDoubleChance'));
    if (chance > 0 && roll(chance * 100)) {
      log('🥾 ¡Tus botas te permiten excavar un segundo cuadro!', 'good');
      dig(direction, true);
      return;
    }
  }

  save();
}

function dirLabel(d) {
  return { up: 'arriba', down: 'abajo', left: 'la izquierda', right: 'la derecha' }[d];
}

function resolveFind(depth) {
  const depthBonus = clamp(depth * 0.05, 0, 8);
  const weights = {
    common: 55 - depthBonus * 0.5,
    uncommon: 27,
    rare: 12 + depthBonus * 0.3,
    epic: 5 + depthBonus * 0.3,
    very_rare: 0.8 + depthBonus * 0.08,
    legendary: 1 + depthBonus * 0.1
  };

  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  let rarity = 'common';

  for (const [k, w] of Object.entries(weights)) {
    if (r < w) {
      rarity = k;
      break;
    }
    r -= w;
  }

  const itemId = pick(RARITY_ITEMS[rarity]);
  const added = addItem(itemId, 1, { silent: true });

  if (added) {
    const item = requireItem(itemId);
    gainXp(item.xp || 0);

    const cls = rarity === 'legendary' ? 'legend' : 'good';
    log(`${item.icon} ¡Encontraste: ${item.name}! (+${item.xp || 0} XP)`, cls);
    showTreasurePopup(itemId, rarity, item);
  }
}

function handleFaint() {
  log('💀 Has caído inconsciente... Un compañero minero te encuentra y te lleva al refugio.', 'bad');
  const lostGold = Math.round(state.gold * 0.2);
  state.gold -= lostGold;
  if (lostGold > 0) log(`🪙 Perdiste ${lostGold} de oro en el proceso.`, 'bad');
  state.hp = Math.round(state.maxHp * 0.5);
  state.energy = Math.round(state.maxEnergy * 0.5);
  state.pos = { x: 0, y: 0 };
}

function goHome() {
  state.pos = { x: 0, y: 0 };
  log('🏠 Regresaste al refugio.', 'info');
  render();
  save();
}

function sleep() {
  state.hp = state.maxHp;
  state.energy = state.maxEnergy;
  log('😴 Duermes profundamente. Vida y energía restauradas por completo.', 'good');
  render();
  save();
}
