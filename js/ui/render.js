// ============================================================
// RENDER
// ============================================================

let lastDugKey = null;

function render() {

  // ----------------------------------------------------------
  // VIDA
  // ----------------------------------------------------------

  const hpFill = document.getElementById('hp-fill');
  const hpText = document.getElementById('hp-text');

  if (hpFill) {
    const hpPercent = state.maxHp > 0
      ? Math.max(0, Math.min(100, (state.hp / state.maxHp) * 100))
      : 0;

    hpFill.style.width = `${hpPercent}%`;
  }

  if (hpText) {
    hpText.textContent =
      `${Math.max(0, state.hp)}/${state.maxHp}`;
  }

  // ----------------------------------------------------------
  // ENERGÍA
  // ----------------------------------------------------------

  const energyFill = document.getElementById('energy-fill');
  const energyText = document.getElementById('energy-text');

  if (energyFill) {
    const energyPercent = state.maxEnergy > 0
      ? Math.max(
          0,
          Math.min(
            100,
            (state.energy / state.maxEnergy) * 100
          )
        )
      : 0;

    energyFill.style.width = `${energyPercent}%`;
  }

  if (energyText) {
    energyText.textContent =
      `${Math.max(0, state.energy)}/${state.maxEnergy}`;
  }

  // ----------------------------------------------------------
  // EXPERIENCIA
  // ----------------------------------------------------------

  const xpFill = document.getElementById('xp-fill');
  const xpText = document.getElementById('xp-text');

  if (xpFill) {
    const xpPercent = state.xpNeeded > 0
      ? Math.max(
          0,
          Math.min(
            100,
            (state.xp / state.xpNeeded) * 100
          )
        )
      : 0;

    xpFill.style.width = `${xpPercent}%`;
  }

  if (xpText) {
    xpText.textContent =
      `${Math.max(0, state.xp)}/${state.xpNeeded}`;
  }

  // ----------------------------------------------------------
  // NIVEL
  // ----------------------------------------------------------

  const levelText = document.getElementById('level-text');

  if (levelText) {
    levelText.textContent = state.level;
  }

  // ----------------------------------------------------------
  // ORO
  // ----------------------------------------------------------

  const goldText = document.getElementById('gold-text');

  if (goldText) {
    goldText.textContent = state.gold;
  }

  // ----------------------------------------------------------
  // PICO
  // ----------------------------------------------------------

  const p = pickaxe();

  const pickaxeText =
    document.getElementById('pickaxe-text');

  if (pickaxeText) {
    pickaxeText.textContent =
      `${p.name} (${state.pickaxeDurability}/${p.maxDurability})`;
  }

  // ----------------------------------------------------------
  // POSICIÓN
  // ----------------------------------------------------------

  const posText =
    document.getElementById('pos-text');

  if (posText) {
    posText.textContent =
      `📍 (${state.pos.x}, ${state.pos.y})`;
  }

  // ----------------------------------------------------------
  // DIFICULTAD
  // ----------------------------------------------------------

  state.difficulty =
    normalizeDifficulty(state.difficulty);

  const diffText =
    document.getElementById('diff-text');

  if (diffText) {
    diffText.textContent =
      getDifficultyConfig(state.difficulty).label;
  }

  renderDerivedStatsHud();

  // ----------------------------------------------------------
  // RENDER DEL JUEGO
  // ----------------------------------------------------------

  renderMap();
  renderInventory();
  renderShop();
  renderCrafting();

  // ----------------------------------------------------------
  // BOTONES DE EXCAVAR
  // ----------------------------------------------------------

  const broken = state.pickaxeDurability <= 0;
  const noEnergy = state.energy <= 0;

  [
    'dig-up',
    'dig-down',
    'dig-left',
    'dig-right'
  ].forEach(id => {

    const button =
      document.getElementById(id);

    if (button) {
      button.disabled = broken || noEnergy;
    }

  });
}
function renderMap() {
  const grid = document.getElementById('map-grid');
  grid.innerHTML = '';
  const RADIUS = 3;
  for (let dy = RADIUS; dy >= -RADIUS; dy--) {
    for (let dx = -RADIUS; dx <= RADIUS; dx++) {
      const x = state.pos.x + dx;
      const y = state.pos.y + dy;
      const key = `${x},${y}`;
      const tile = document.createElement('div');
      tile.className = 'tile';
      if (key === lastDugKey) tile.classList.add('dig-impact');
      const mob = Array.isArray(state.mobs)
        ? state.mobs.find(entry => entry.x === x && entry.y === y)
        : null;
      const shelter = Array.isArray(state.shelters)
        ? state.shelters.find(entry => Number(entry.pos?.x) === x && Number(entry.pos?.y) === y)
        : null;

      if (shelter) tile.classList.add('shelter-marker');

      if (x === state.pos.x && y === state.pos.y) {
        tile.classList.add('player');
        tile.innerHTML = renderPlayerCharacter();
        if (shelter) {
          tile.insertAdjacentHTML('beforeend', `<span class="map-shelter-marker" title="${shelter.name}">🏠</span>`);
        }
      } else if (mob) {
        tile.classList.add('mob');
        tile.dataset.mobId = String(mob.id);
        tile.setAttribute('role', 'button');
        tile.setAttribute('tabindex', '0');
        tile.setAttribute('aria-label', `Atacar monstruo: ${mob.hp}/${mob.maxHp} HP`);
        tile.innerHTML = `<div class="mob-character" title="Monstruo: ${mob.hp}/${mob.maxHp} HP">👾<span class="mob-hp">${mob.hp}</span></div>`;
      } else if (state.discovered[key] && state.discovered[key].dug) {
        tile.classList.add('dug');
        if (depthOf({ x, y }) > 15) tile.classList.add('deep');
        tile.textContent = shelter
          ? '🏠'
          : (depthOf({ x, y }) > 30 ? '🕳️' : '');
        if (shelter) {
          tile.title = `${shelter.name} · (${x}, ${y})`;
          tile.setAttribute('aria-label', `${shelter.name} en (${x}, ${y})`);
        }
      } else {
        tile.classList.add('undug');
        tile.textContent = '';
      }
      grid.appendChild(tile);
    }
  }
}

function renderPlayerCharacter() {
  const equipment = getEquipment();
  const helmet = equipment.helmet ? getItem(equipment.helmet) : null;
  const armor = equipment.armor ? getItem(equipment.armor) : null;
  const legs = equipment.legs ? getItem(equipment.legs) : null;
  const boots = equipment.boots ? getItem(equipment.boots) : null;
  const weapon = equipment.weapon ? getItem(equipment.weapon) : null;

  return `
    <div class="player-character" aria-label="Minero equipado">
      <svg class="player-svg" viewBox="0 0 100 120" role="img" aria-label="Minero">
        <defs>
          <linearGradient id="minerSkin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#efb07a"/><stop offset=".7" stop-color="#b86d48"/><stop offset="1" stop-color="#713c2c"/></linearGradient>
          <linearGradient id="minerSuit" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d8fd4"/><stop offset=".55" stop-color="#145184"/><stop offset="1" stop-color="#07182b"/></linearGradient>
          <linearGradient id="minerMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8eef2"/><stop offset=".5" stop-color="#8896a1"/><stop offset="1" stop-color="#3b454e"/></linearGradient>
          <radialGradient id="minerLight"><stop offset="0" stop-color="#fff6bf" stop-opacity=".95"/><stop offset=".25" stop-color="#ffd45e" stop-opacity=".4"/><stop offset="1" stop-color="#ffd45e" stop-opacity="0"/></radialGradient>
        </defs>
        <ellipse cx="51" cy="112" rx="28" ry="5" fill="#000" opacity=".48"/>
        <g class="player-body-group">
          <ellipse class="lamp-glow" cx="58" cy="34" rx="28" ry="27" fill="url(#minerLight)"/>
          <!-- mochila -->
          <path d="M19 55Q12 59 15 83l7 5 8-7-3-25Z" fill="#352318" stroke="#a36a37" stroke-width="1.3"/>
          <path d="M18 61h10M17 69h11M18 77h9" stroke="#d29a58" stroke-opacity=".35" stroke-width="1.2"/>
          <!-- piernas -->
          <path class="suit" d="M31 82h15l-2 22-9 4-7-5Z"/>
          <path class="suit" d="M47 82h15l4 21-8 5-10-4Z"/>
          <!-- botas -->
          <path class="boot" d="M27 99h17l2 7-6 8H22l-2-5Z"/>
          <path class="boot" d="M53 101h14l12 7-2 6H56l-6-7Z"/>
          <path d="M23 108h20M56 110h23" stroke="#d0d7dc" stroke-opacity=".25" stroke-width="2"/>
          <!-- torso -->
          <path class="suit ${armor ? 'equipped-glow' : ''}" d="M27 50Q36 45 51 47Q64 45 72 53l-4 33-15 5-26-5Z"/>
          ${armor ? '<path class="metal" d="M30 55l8-5 9 4 8-4 11 6-4 27-11 2-3-17-4 17-12-3Z"/><path d="M51 50v34M33 65h34" stroke="#f5fbff" stroke-opacity=".16" stroke-width="2"/>' : '<path class="suit-light" d="M35 53h10v29H34Z" opacity=".45"/><path d="M51 52v30M31 66h39" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>'}
          <!-- brazos -->
          <path class="suit" d="M28 55q-9 8-7 23l7 4 7-5-2-18Z"/>
          <path class="suit" d="M68 55q10 7 9 22l-7 5-7-5 2-18Z"/>
          <circle class="skin" cx="26" cy="82" r="5"/><circle class="skin" cx="75" cy="82" r="5"/>
          <!-- cinturón -->
          <path class="leather" d="M28 78h42v8H29Z"/>
          <rect x="47" y="78" width="9" height="8" rx="1.5" fill="#d6aa56" stroke="#ffe4a2" stroke-opacity=".45"/>
          <!-- cuello/cabeza -->
          <path class="skin" d="M43 47v7q7 5 14 0v-8Z"/>
          <path class="skin" d="M33 22q4-12 18-12t18 13v20q-5 12-18 12T33 43Z"/>
          <path class="hair" d="M31 30q0-22 20-23 19 1 22 18l-5 9-7-10q-13 8-30 2Z"/>
          <circle class="eye" cx="44" cy="35" r="1.8"/><circle class="eye" cx="57" cy="35" r="1.8"/>
          <path d="M47 44q4 3 8 0" fill="none" stroke="#7c3d31" stroke-width="1.5" stroke-linecap="round"/>
          <!-- casco -->
          <path class="metal ${helmet ? 'equipped-glow' : ''}" d="M29 27q2-19 22-20 19 2 21 20H29Z" opacity="0"/>
          <path d="M25 28h51v7H25Z" fill="#2b6fa5" stroke="#8edcff" stroke-opacity=".55" stroke-width="1.2" opacity=".35"/>
          <path d="M33 19q17-9 34 1" fill="none" stroke="#fff5c8" stroke-opacity=".28" stroke-width="2"/>
          <!-- lámpara -->
          <circle class="lamp" cx="51" cy="27" r="3.5"/><circle cx="51" cy="27" r="13" fill="url(#minerLight)" opacity=".35"/>
          <!-- pico en la espalda -->
          <path class="pickaxe-handle" d="M72 66l17 30"/><path class="pickaxe" d="M80 66q8-8 15 0"/>
          <!-- guantes -->
          <circle cx="26" cy="82" r="3.5" fill="#6c4b31"/><circle cx="75" cy="82" r="3.5" fill="#6c4b31"/>
        </g>
      </svg>
      <div class="player-weapon ${weapon ? 'has-weapon' : ''}" title="${weapon?.name || 'Sin arma'}">${weapon ? `<span class="weapon-icon">${weapon.icon}</span>` : ''}</div>
    </div>
  `;
}

function playEquipVisual(item) {
  renderMap();
  const tile = document.querySelector('.tile.player');
  if (!tile) return;
  tile.classList.remove('equip-pulse');
  void tile.offsetWidth;
  tile.classList.add('equip-pulse');

  const flash = document.createElement('div');
  flash.className = 'equip-notice';
  flash.innerHTML = `<span>${item.icon}</span><strong>¡Equipado!</strong><small>${item.name}</small>`;
  document.body.appendChild(flash);
  setTimeout(() => flash.classList.add('show'), 20);
  setTimeout(() => flash.remove(), 1900);
}

function renderDerivedStatsHud() {
  const hud = document.getElementById('hud');
  if (!hud || !state) return;

  const row = hud.querySelector('.hud-row.small');
  if (!row) return;

  let box = document.getElementById('derived-stats-hud');
  if (!box) {
    box = document.createElement('span');
    box.id = 'derived-stats-hud';
    box.className = 'derived-stats-hud';
    row.insertBefore(box, row.querySelector('.hud-user-actions') || null);
  }

  const stats = state.finalStats || {};
  const progress = getSetProgress();
  const active = isSetComplete();
  box.innerHTML = `
    <span>⚔️ Ataque ${Math.round(stats.damage || 0)}</span>
    <span>🛡️ Defensa ${Math.round(stats.defense || 0)}</span>
    <span>❤️ Máx. ${Math.round(stats.maxHp || state.maxHp)}</span>
    <span>⚡ Máx. ${Math.round(stats.maxEnergy || state.maxEnergy)}</span>
    <span class="${active ? 'set-active' : 'set-locked'}">${active ? '🔓' : '🔒'} Set ${progress.equipped}/${progress.total}</span>
  `;
}

function renderInventory() {
  document.getElementById('bag-capacity').textContent = `(${bagCount()}/${state.bagSize})`;
  const list = document.getElementById('inventory-list');
  list.innerHTML = '';

  const entries = getInventoryEntries();

  if (entries.length === 0) {
    list.innerHTML = '<p style="color:#888;grid-column:1/-1;text-align:center;">Tu mochila está vacía. ¡Empieza a excavar!</p>';
  } else {
    entries.forEach(({ id, qty, item }) => {
      const row = document.createElement('div');
      row.className = `inv-item rarity-${item.rarity}`;
      row.dataset.itemId = id;
      row.dataset.itemId = id;
      row.title = item.description;

      const actions = getAvailableItemActions(id);
      const actionHtml = actions.map(action =>
        `<button type="button" class="item-action-btn item-action-${action.id}" data-action="${action.id}" data-item-id="${id}">${action.icon} ${action.label}</button>`
      ).join('');

      row.innerHTML = `
        <div class="item-icon">${item.icon}</div>
        <div class="item-name">${item.name}</div>
        <div class="item-qty">x${qty}</div>
        <div class="item-rarity">${RARITY_LABELS[item.rarity] || item.rarity}</div>
        <div class="inv-actions">${actionHtml}</div>
      `;

      list.appendChild(row);
    });
  }

  renderEquipmentPanel(list);
}

function renderEquipmentPanel(list) {
  const section = document.createElement('div');
  section.className = 'equipment-panel';

  const progress = getSetProgress();
  const set = SET_BONUSES.abyssal_miner;
  const active = progress.equipped === progress.total;

  section.innerHTML = `
    <div class="set-bonus-header">
      <div>
        <h4>⚔️ Set del Minero del Abismo</h4>
        <small>${active ? '🔓 BONUS ACTIVO' : '🔒 BONUS BLOQUEADO'} · ${progress.equipped}/${progress.total} piezas equipadas</small>
      </div>
      <strong>${active ? '8/8' : `${progress.equipped}/8`}</strong>
    </div>
    <div class="set-bonus-card ${active ? 'set-bonus-active' : 'set-bonus-locked'}">
      <div class="set-bonus-title">${active ? '🔓' : '🔒'} ${set.name}</div>
      <div class="set-bonus-description">${set.description}</div>
      ${active
        ? '<div class="set-bonus-effect">✨ El poder del conjunto está aplicado a tus atributos.</div>'
        : `<div class="set-bonus-missing">Faltan: ${progress.missing.map(id => getItem(id)?.name || id).join(' · ')}</div>`}
    </div>
    <h4>🛡️ Equipamiento</h4>
  `;

  const grid = document.createElement('div');
  grid.className = 'equipment-grid';

  for (const slot of EQUIPMENT_SLOTS) {
    const itemId = state.equipment?.[slot];
    const item = itemId ? getItem(itemId) : null;
    const row = document.createElement('div');
    row.className = `equipment-slot${item?.setId ? ' set-piece-equipped' : ''}`;

    const abilityText = item?.abilities
      ? Object.entries(item.abilities).map(([key, value]) => {
          const labels = {
            energyEfficiency: `⚡ -${value}% coste de energía`,
            damageReduction: `🛡️ -${value}% daño`,
            hazardReduction: `⛏️ -${value}% daño de peligros`,
            digEnergyFlatReduction: `⛏️ -${value} energía por excavación`,
            energyRegenAmount: `⚡ +${value} energía / 10 s`,
            healthRegenAmount: `❤️ +${value} vida / 20 s`,
            damageBonus: `⚔️ +${value} daño`,
            critChance: `💥 ${value}% crítico`,
            findChanceBonus: `🔎 +${value}% probabilidad de hallazgo`,
            mineAvoidChance: `👑 ${value}% de evitar minas`,
            rareFindChance: `🍀 +${value}% hallazgo de calidad`,
            healOnKill: `❤️ +${value} HP al derrotar`,
            energyOnDig: `⚡ +${value} energía al excavar`
          };
          return labels[key] || `${key}: ${value}`;
        }).join(' · ')
      : '';

    const durabilityText = isToolItem(item)
      ? ` · Dur ${getToolDurability(item.id, item.pickaxeData.currentDurability ?? item.pickaxeData.maxDurability)}/${item.pickaxeData.maxDurability}`
      : '';

    row.innerHTML = `
      <span class="equipment-slot-name">${EQUIPMENT_SLOT_LABELS[slot]}</span>
      <span class="equipment-slot-item">
        ${item
          ? `${item.icon} ${item.name}${durabilityText}${abilityText ? `<small>${abilityText}</small>` : ''}`
          : '— Vacío —'}
      </span>
    `;

    if (item) {
      const actions = document.createElement('div');
      actions.className = 'equipment-slot-actions';

      const unequip = document.createElement('button');
      unequip.type = 'button';
      unequip.className = 'item-action-btn';
      unequip.textContent = 'Desequipar';
      unequip.onclick = () => unequipSlot(slot);
      actions.appendChild(unequip);

      if (item.droppable) {
        const drop = document.createElement('button');
        drop.type = 'button';
        drop.className = 'item-action-btn item-action-drop';
        drop.textContent = 'Tirar';
        drop.onclick = () => dropEquippedItem(slot);
        actions.appendChild(drop);
      }

      if (item.sellable && getSellPrice(item.id) > 0) {
        const sell = document.createElement('button');
        sell.type = 'button';
        sell.className = 'item-action-btn item-action-sell';
        sell.textContent = `Vender ${getSellPrice(item.id)} 🪙`;
        sell.onclick = () => sellEquippedItem(slot);
        actions.appendChild(sell);
      }

      row.appendChild(actions);
    }

    grid.appendChild(row);
  }

  section.appendChild(grid);
  list.appendChild(section);
}

function renderCrafting() {
  const list = document.getElementById('craft-list');
  if (!list) return;
  list.innerHTML = '';

  getCraftingRecipes().forEach(recipe => {
    const result = getItem(recipe.result);
    if (!result) return;

    const row = document.createElement('div');
    row.className = `craft-item rarity-${result.rarity}`;
    row.dataset.itemId = result.id;

    const ingredients = Object.entries(recipe.ingredients).map(([id, qty]) => {
      const item = getItem(id);
      const have = getItemQuantity(id);
      return `${item?.icon || '❓'} ${item?.name || id} ${have}/${qty}`;
    }).join(' · ');

    row.innerHTML = `
      <div class="craft-visual">
        <div class="craft-icon">${result.icon}</div>
        <div class="craft-info">
          <div class="craft-name">${result.name}</div>
          <div class="craft-rarity">${RARITY_LABELS[result.rarity] || result.rarity}</div>
          <small>${ingredients}</small>
        </div>
      </div>
    `;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '🔨 Fabricar';
    btn.disabled = !canCraft(recipe.id);
    btn.onclick = () => craftItem(recipe.id);
    row.appendChild(btn);
    list.appendChild(row);
  });
}

function renderShop() {
  const sellList = document.getElementById('sell-list');
  sellList.innerHTML = '';

  const entries = getInventoryEntries().filter(({ item }) => item.sellable && getSellPrice(item.id) > 0);

  if (entries.length === 0) {
    sellList.innerHTML = '<p style="color:#888;">No tienes objetos vendibles.</p>';
  } else {
    entries.forEach(({ id, qty, item }) => {
      const row = document.createElement('div');
      row.className = `shop-item rarity-${item.rarity}`;
      row.dataset.itemId = id;
      row.innerHTML = `
        <div class="shop-visual">
          <div class="shop-icon">${item.icon}</div>
          <div class="shop-info">
            <div class="shop-name">${item.name} x${qty}</div>
            <div class="shop-rarity">${RARITY_LABELS[item.rarity]}</div>
            <small>${getSellPrice(id)} 🪙 c/u</small>
          </div>
        </div>
      `;
      const btn = document.createElement('button');
      btn.textContent = 'Vender todo';
      btn.onclick = () => sellAll(id);
      row.appendChild(btn);
      sellList.appendChild(row);
    });
  }

  const pShop = document.getElementById('pickaxe-shop');
  pShop.innerHTML = '';

  PICKAXES.filter(p => p.shop !== false).forEach((p, i) => {
    const row = document.createElement('div');
    row.className = `shop-item rarity-${getItem(p.id)?.rarity || 'common'}`;

    const owned = isToolOwned(p.id);
    const equipped = state.equipment?.tool === p.id;
    const unlocked = i <= (Number(state.unlockedPickaxeIndex ?? 0) + 1);
    const durability = owned
      ? getToolDurability(p.id, equipped ? state.pickaxeDurability : p.maxDurability)
      : p.maxDurability;
    const damaged = equipped && durability < p.maxDurability;
    const repairPrice = damaged && p.repairable !== false ? getPickaxeRepairPrice(i) : 0;

    row.innerHTML = `
      <div class="shop-visual">
        <div class="shop-icon">⛏️</div>
        <div class="shop-info">
          <div class="shop-name">${p.name}${equipped ? ' (equipado)' : ''}</div>
          <small>Daño ${p.damage} · Vel ${p.speed}x · Dur ${durability}/${p.maxDurability}</small>
        </div>
      </div>
    `;

    const btn = document.createElement('button');

    if (equipped && damaged && p.repairable !== false) {
      btn.textContent = `🔧 Reparar ${repairPrice} 🪙`;
      btn.disabled = state.gold < repairPrice;
      btn.onclick = () => repairPickaxe();
    } else if (equipped) {
      btn.textContent = p.repairable === false ? 'Uso limitado' : '✓ Equipado';
      btn.disabled = true;
    } else if (owned) {
      btn.textContent = '⚔️ Equipar';
      btn.disabled = false;
      btn.onclick = () => equipItem(p.id);
    } else if (!unlocked) {
      btn.textContent = 'Bloqueado';
      btn.disabled = true;
    } else {
      btn.textContent = `${p.price} 🪙`;
      btn.disabled = state.gold < p.price;
      btn.onclick = () => buyPickaxe(i);
    }

    row.appendChild(btn);
    pShop.appendChild(row);
  });

  const other = document.getElementById('other-shop');
  other.innerHTML = '';
  const bagPrice = BAG_UPGRADE_PRICE(state.bagSize);
  other.appendChild(shopRow(`🎒 Ampliar mochila (+10, actual ${state.bagSize})`, bagPrice, () => buyBag()));
  other.appendChild(shopRow('🧪 Poción de vida (+40 HP)', POTION_HEAL_PRICE, () => buyPotion('heal')));
  other.appendChild(shopRow('⚡ Poción de energía (+40)', POTION_ENERGY_PRICE, () => buyPotion('energy')));
}

function shopRow(label, price, onBuy) {
  const row = document.createElement('div');
  row.className = 'shop-item';
  row.innerHTML = `<span>${label}</span>`;
  const btn = document.createElement('button');
  btn.textContent = `${price} 🪙`;
  btn.disabled = state.gold < price;
  btn.onclick = onBuy;
  row.appendChild(btn);
  return row;
}
