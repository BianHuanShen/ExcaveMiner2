// ============================================================
// EXCAVACIÓN, ENERGÍA, PELIGROS, MOBS Y COMBATE
// ============================================================

let mobMoveTimer = null;

// Teclado principal: flechas excavan; F/espacio ataca.
document.addEventListener('keydown', event => {
  if (event.repeat || !state) return;
  const active = document.activeElement;
  if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return;

  if (event.key === 'f' || event.key === 'F' || event.code === 'Space') {
    event.preventDefault();
    attackMob();
    return;
  }

  const directions = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right'
  };
  const direction = directions[event.key];
  if (!direction) return;

  event.preventDefault();
  dig(direction);
});

// Calcula el coste de energía del pico con las bonificaciones de equipo.
function energyCost() {
  const base = Math.max(2, Math.round(5 / pickaxe().speed));
  const efficiency = typeof getEquipmentAbility === 'function'
    ? Math.min(0.75, getEquipmentAbility('energyEfficiency'))
    : 0;
  return Math.max(1, Math.round(base * (1 - efficiency)));
}

// Ejecuta un movimiento de excavación y resuelve sus consecuencias.
function dig(direction, bonusDig = false) {
  if (!state || state.hp <= 0 || state.energy <= 0) return;

  // Bloquea la excavación si el pico está roto o sin durabilidad.
  if (Number(state.pickaxeDurability || 0) <= 0) {
    log('⛏️ Tu pico está roto. Debes repararlo antes de seguir excavando.', 'bad');
    render();
    return false;
  }

  const cost = energyCost();
  if (state.energy < cost) {
    log('😴 Estás demasiado cansado para seguir excavando. Vuelve al refugio a dormir.', 'bad');
    render();
    return;
  }

  const newPos = { ...state.pos };
  if (direction === 'up') newPos.y += 1;
  if (direction === 'down') newPos.y -= 1;
  if (direction === 'left') newPos.x -= 1;
  if (direction === 'right') newPos.x += 1;

  const mobAtDestination = Array.isArray(state.mobs)
    ? state.mobs.find(mob => mob.x === newPos.x && mob.y === newPos.y)
    : null;

  if (mobAtDestination) {
    log('👾 Un enemigo bloquea el paso. Atácalo antes de avanzar.', 'bad');
    render();
    return false;
  }

  state.energy = Math.max(0, state.energy - cost);
  state.pos = newPos;

  const key = `${newPos.x},${newPos.y}`;
  const depth = depthOf(newPos);
  const diffMult = getDifficultyConfig(state.difficulty);
  const alreadyDug = state.discovered[key]?.dug === true;

  if (!alreadyDug) {
    state.discovered[key] = { dug: true };
    lastDugKey = key;

    // El pico solo pierde durabilidad al romper un bloque nuevo.
    state.pickaxeDurability = Math.max(0, state.pickaxeDurability - 1);

    if (state.pickaxeDurability <= 0) {
      log('⛏️ ¡Tu pico se ha roto! Visita la tienda para repararlo.', 'bad');
    }
  } else {
    lastDugKey = null;
  }

  log(`⛏️ Excavando hacia ${dirLabel(direction)}... (profundidad ${depth})`, 'info');
  resolveHazards(depth, direction, diffMult);

  if (state.hp <= 0) {
    handleFaint();
    render();
    save();
    return;
  }

  if (!alreadyDug) {
    const findChance = clamp(60 + pickaxe().damage * 1.2, 60, 90);
    if (roll(findChance)) resolveFind(depth);
    else log('💨 No encontraste nada esta vez.', 'info');

    // Un bloque recién roto puede despertar un enemigo.
    trySpawnMob(depth, diffMult);
  } else {
    log('🕳️ Este lugar ya fue excavado. No hay nada más que encontrar aquí.', 'info');
  }

  render();

  if (lastDugKey === key) {
    setTimeout(() => {
      if (lastDugKey === key) lastDugKey = null;
      if (state) renderMap();
    }, 520);
  }

  if (!bonusDig && typeof getEquipmentAbility === 'function') {
    const chance = Math.min(0.5, getEquipmentAbility('mineDoubleChance'));

    if (chance > 0 && roll(chance * 100) && state.energy > 0) {
      log('🥾 ¡Tus botas permiten excavar un segundo cuadro!', 'good');
      dig(direction, true);
      return;
    }
  }

  save();
}


// Resuelve roca y mina sin mezclar sus reglas con el movimiento.
function resolveHazards(depth, direction, diffMult) {
  const reduction = typeof getEquipmentAbility === 'function'
    ? Math.min(0.75, getEquipmentAbility('damageReduction'))
    : 0;

  if (direction === 'up') {
    const rockChance = clamp(10 + depth * 0.4, 5, 45) * diffMult.hazardMult;
    if (roll(rockChance)) {
      const dmg = Math.max(1, Math.round((5 + depth * 0.3) * diffMult.damageMult * (1 - reduction)));
      state.hp = Math.max(0, state.hp - dmg);
      log(`🪨 ¡Una roca cae desde arriba! Pierdes ${dmg} de vida.`, 'bad');
    }
  }

  const mineChance = clamp(4 + depth * 0.25, 2, 25) * diffMult.hazardMult;
  if (roll(mineChance)) {
    const dmg = Math.max(1, Math.round((12 + depth * 0.5) * diffMult.damageMult * (1 - reduction)));
    state.hp = Math.max(0, state.hp - dmg);
    state.pickaxeDurability = Math.max(0, state.pickaxeDurability - 15);
    log(`💥 ¡MINA EXPLOSIVA! La explosión te hiere por ${dmg} de vida.`, 'bad');
  }
}

// Etiqueta legible de una dirección.
function dirLabel(direction) {
  return { up: 'arriba', down: 'abajo', left: 'la izquierda', right: 'la derecha' }[direction] || direction;
}

// Determina la rareza y entrega el objeto encontrado.
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

  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  let random = Math.random() * total;
  let rarity = 'common';
  for (const [key, weight] of Object.entries(weights)) {
    if (random < weight) { rarity = key; break; }
    random -= weight;
  }

  const itemId = pick(RARITY_ITEMS[rarity]);
  const added = addItem(itemId, 1, { silent: true });
  if (!added) return;

  const item = requireItem(itemId);
  gainXp(item.xp || 0);
  log(`${item.icon} ¡Encontraste: ${item.name}! (+${item.xp || 0} XP)`, rarity === 'legendary' ? 'legend' : 'good');
  showTreasurePopup(itemId, rarity, item);
}

// Crea un enemigo en una casilla ya excavada y con suelo debajo.
function trySpawnMob(depth, diffMult) {
  const chance = clamp(MOB_CONFIG.baseSpawnChance * diffMult.mobChanceMult, 0, MOB_CONFIG.maxSpawnChance);
  if (!roll(chance)) return false;

  state.mobs = Array.isArray(state.mobs) ? state.mobs : [];
  const candidates = [
    { x: state.pos.x - 1, y: state.pos.y },
    { x: state.pos.x + 1, y: state.pos.y }
  ].filter(pos => {
    return isMobWalkableCell(pos.x, pos.y) &&
      !(pos.x === state.pos.x && pos.y === state.pos.y) &&
      !state.mobs.some(mob => mob.x === pos.x && mob.y === pos.y);
  });

  if (!candidates.length) return false;

  const pos = pick(candidates);
  const hp = Math.max(1, Math.round(MOB_CONFIG.baseHp + depth * MOB_CONFIG.hpPerDepth));
  const damage = Math.max(1, Math.round(
    (MOB_CONFIG.baseDamage + depth * MOB_CONFIG.damagePerDepth) * diffMult.mobDamageMult
  ));

  const mob = {
    id: Number(state.nextMobId || 1),
    type: 'cave_mob',
    x: pos.x,
    y: pos.y,
    hp,
    maxHp: hp,
    damage,
    direction: Math.random() < 0.5 ? -1 : 1,
    moveCooldown: 0
  };

  state.nextMobId = mob.id + 1;
  state.mobs.push(mob);
  log(`👾 ¡Un monstruo del Abismo apareció! Vida ${hp} · Daño ${damage}.`, 'bad');
  ensureMobLoop();
  return true;
}

// Comprueba que una casilla pertenece a una plataforma excavada.
function isMobWalkableCell(x, y) {
  const key = `${x},${y}`;
  const floorKey = `${x},${y - 1}`;
  return state?.discovered?.[key]?.dug === true && state?.discovered?.[floorKey]?.dug === true;
}

// Evita que un enemigo atraviese otro enemigo o la posición del jugador.
function isMobPositionBlocked(x, y, currentMob) {
  if (state.pos.x === x && state.pos.y === y) return true;
  return state.mobs.some(other => other !== currentMob && other.x === x && other.y === y);
}

// Devuelve el paso horizontal válido; si encuentra un borde, intenta rebotar.
function getMobStep(mob) {
  const preferred = mob.direction >= 0 ? 1 : -1;
  const options = [preferred, -preferred];

  for (const step of options) {
    const targetX = mob.x + step;
    if (!isMobWalkableCell(targetX, mob.y)) continue;
    if (isMobPositionBlocked(targetX, mob.y, mob)) continue;
    return step;
  }

  return 0;
}

// Mueve enemigos exclusivamente en horizontal sobre plataformas excavadas.
function updateMobs() {
  if (!state || !Array.isArray(state.mobs) || !state.mobs.length) return;
  const diffMult = getDifficultyConfig(state.difficulty);

  state.mobs = state.mobs.filter(mob => isMobWalkableCell(mob.x, mob.y));

  for (const mob of state.mobs) {
    mob.y = Number(mob.y);
    mob.direction = mob.direction === -1 ? -1 : 1;
    mob.moveCooldown = Math.max(0, Number(mob.moveCooldown) || 0);

    if (mob.y === state.pos.y && Math.abs(state.pos.x - mob.x) === 1) {
      mob.moveCooldown = Math.max(0, mob.moveCooldown - MOB_CONFIG.moveInterval);
      if (mob.moveCooldown === 0) {
        dealMobDamage(mob);
        mob.moveCooldown = MOB_CONFIG.moveInterval * 2;
      }
      continue;
    }

    if (mob.moveCooldown > 0) {
      mob.moveCooldown = Math.max(0, mob.moveCooldown - MOB_CONFIG.moveInterval);
      continue;
    }

    // Si el jugador está en la misma plataforma, el mob intenta acercarse horizontalmente.
    if (mob.y === state.pos.y && state.pos.x !== mob.x) {
      mob.direction = state.pos.x > mob.x ? 1 : -1;
    }

    const step = getMobStep(mob);
    if (step === 0) {
      mob.direction *= -1;
      continue;
    }

    mob.direction = step;
    mob.x += step;
    mob.moveCooldown = MOB_CONFIG.moveInterval;
  }

  if (state.hp <= 0) handleFaint();
  render();
  save();
}

// Aplica daño del enemigo usando el daño ya escalado por dificultad.
function dealMobDamage(mob) {
  const defense = Number(state.finalStats?.defense || 0);
  const reduction = clamp(defense * 0.03, 0, 0.75);
  const damage = Math.max(1, Math.round(mob.damage * (1 - reduction)));
  state.hp = Math.max(0, state.hp - damage);
  log(`👾 ${mob.type === 'cave_mob' ? 'El monstruo' : 'El enemigo'} te golpeó por ${damage} de vida.`, 'bad');
}

// Mantiene un único temporizador para el movimiento de todos los enemigos.
function ensureMobLoop() {
  if (mobMoveTimer !== null) return;
  mobMoveTimer = setInterval(() => {
    if (!state || !Array.isArray(state.mobs) || state.mobs.length === 0) {
      clearInterval(mobMoveTimer);
      mobMoveTimer = null;
      return;
    }
    updateMobs();
  }, MOB_CONFIG.moveInterval);
}

// Ataca al enemigo indicado o al primero que esté adyacente al jugador.
function attackMob(targetId = null) {
  if (!state || state.hp <= 0) return false;

  const mobs = Array.isArray(state.mobs) ? state.mobs : [];
  const target = targetId == null
    ? mobs.find(mob => mob.y === state.pos.y && Math.abs(mob.x - state.pos.x) === 1)
    : mobs.find(mob => mob.id === Number(targetId));

  if (!target) {
    log('⚔️ No hay ningún enemigo a tu alcance.', 'info');
    return false;
  }

  if (target.y !== state.pos.y || Math.abs(target.x - state.pos.x) !== 1) {
    log('⚔️ Acércate horizontalmente al enemigo para atacarlo.', 'info');
    return false;
  }

  const weapon = getEquippedItem('weapon');
  const weaponDamage = Number(weapon?.stats?.damage || 0);
  const abilityBonus = Number(weapon?.abilities?.damageBonus || 0);
  const baseDamage = Math.max(1, Number(state.baseStats?.damage || 1));
  const damage = Math.max(1, baseDamage + weaponDamage + abilityBonus);

  target.hp = Math.max(0, target.hp - damage);
  log(`⚔️ Golpeas al monstruo por ${damage} de daño.`, 'good');

  if (target.hp <= 0) {
    state.mobs = mobs.filter(mob => mob.id !== target.id);
    const xp = Math.max(5, Math.round(target.maxHp * 0.8));
    gainXp(xp);
    log(`💀 Monstruo derrotado. +${xp} XP.`, 'legend');
  }

  render();
  save();
  if (state.mobs.length) ensureMobLoop();
  return true;
}

// Soporta clic y toque directo sobre un mob del mapa sin duplicar ataques.
let lastMobTouchAt = 0;

document.addEventListener('touchstart', event => {
  const tile = event.target.closest?.('#map-grid .tile.mob');
  if (!tile) return;
  event.preventDefault();
  lastMobTouchAt = Date.now();
  attackMob(tile.dataset.mobId);
}, { passive: false });

document.addEventListener('click', event => {
  const tile = event.target.closest?.('#map-grid .tile.mob');
  if (!tile || Date.now() - lastMobTouchAt < 500) return;
  attackMob(tile.dataset.mobId);
});

// Elimina mobs inválidos de partidas antiguas y reactiva su temporizador.
function normalizeMobsState() {
  if (!state) return;
  state.mobs = Array.isArray(state.mobs) ? state.mobs : [];
  state.mobs = state.mobs.filter(mob => {
    mob.x = Number(mob.x);
    mob.y = Number(mob.y);
    mob.hp = Math.max(0, Number(mob.hp) || 0);
    mob.maxHp = Math.max(1, Number(mob.maxHp) || mob.hp || 1);
    mob.damage = Math.max(1, Number(mob.damage) || MOB_CONFIG.baseDamage);
    mob.direction = mob.direction === -1 ? -1 : 1;
    return mob.hp > 0 && isMobWalkableCell(mob.x, mob.y);
  });
  state.nextMobId = Math.max(1, Number(state.nextMobId) || 1);
  if (state.mobs.length) ensureMobLoop();
}

// Recupera al jugador en el refugio después de quedar inconsciente.
function handleFaint() {
  log('💀 Has caído inconsciente... Un compañero minero te encuentra y te lleva al refugio.', 'bad');
  const lostGold = Math.round(state.gold * 0.2);
  state.gold -= lostGold;
  if (lostGold > 0) log(`🪙 Perdiste ${lostGold} de oro en el proceso.`, 'bad');
  state.hp = Math.round(state.maxHp * 0.5);
  state.energy = Math.round(state.maxEnergy * 0.5);
  state.pos = { x: 0, y: 0 };
  state.mobs = [];
}

// Devuelve al jugador al origen sin restaurar sus estadísticas.
function goHome() {
  if (!state) return;
  state.pos = { x: 0, y: 0 };
  log('🏠 Regresaste al refugio.', 'info');
  render();
  save();
}

// Permite dormir una vez cada diez minutos reales.
function sleep() {
  if (!state) return;
  const now = Date.now();
  const cooldown = 10 * 60 * 1000;
  const last = Number(state.lastSleepAt || 0);
  const remaining = cooldown - (now - last);

  if (last && remaining > 0) {
    const minutes = Math.ceil(remaining / 60000);
    log(`😴 Ya descansaste. Podrás dormir de nuevo en ${minutes} min.`, 'info');
    return false;
  }

  state.lastSleepAt = now;
  state.hp = state.maxHp;
  state.energy = state.maxEnergy;
  log('😴 Duermes profundamente. Vida y energía restauradas por completo.', 'good');
  render();
  save();
  return true;
}
