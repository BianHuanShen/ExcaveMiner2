// ============================================================
// RENDER
// ============================================================
let lastDugKey = null;
function render() {
  document.getElementById('hp-fill').style.width = (state.hp / state.maxHp * 100) + '%';
  document.getElementById('hp-text').textContent = `${Math.max(0, state.hp)}/${state.maxHp}`;

  document.getElementById('energy-fill').style.width = (state.energy / state.maxEnergy * 100) + '%';
  document.getElementById('energy-text').textContent = `${state.energy}/${state.maxEnergy}`;

  document.getElementById('xp-fill').style.width = (state.xp / state.xpNeeded * 100) + '%';
  document.getElementById('xp-text').textContent = `${state.xp}/${state.xpNeeded}`;
  document.getElementById('level-text').textContent = state.level;

  document.getElementById('gold-text').textContent = state.gold;

  const p = pickaxe();
  document.getElementById('pickaxe-text').textContent = `${p.name} (${state.pickaxeDurability}/${p.maxDurability})`;
  document.getElementById('pos-text').textContent = `📍 (${state.pos.x}, ${state.pos.y})`;
  document.getElementById('diff-text').textContent = DIFFICULTIES[state.difficulty].label;

  renderMap();
  renderInventory();
  renderShop();
  renderCrafting();

  // disable dig buttons if pickaxe broken or dead
  const broken = state.pickaxeDurability <= 0;
  ['dig-up', 'dig-down', 'dig-left', 'dig-right'].forEach(id => {
    document.getElementById(id).disabled = broken;
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
      if (x === state.pos.x && y === state.pos.y) {
        tile.classList.add('player');
        tile.innerHTML = renderPlayerCharacter();
      } else if (state.discovered[key] && state.discovered[key].dug) {
        tile.classList.add('dug');
        if (depthOf({ x, y }) > 15) tile.classList.add('deep');
        tile.textContent = depthOf({ x, y }) > 30 ? '🕳️' : '';
      } else {
        tile.classList.add('undug');
        tile.textContent = '░';
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
      <div class="player-shadow"></div>
      <div class="player-weapon ${weapon ? 'has-weapon' : ''}" title="${weapon?.name || 'Sin arma'}">${weapon?.icon || ''}</div>
      <div class="player-helmet ${helmet ? 'equipped' : ''}">${helmet ? '⛑️' : ''}</div>
      <div class="player-head"></div>
      <div class="player-torso ${armor ? 'equipped' : ''}"></div>
      <div class="player-belt"></div>
      <div class="player-legs ${legs ? 'equipped' : ''}"></div>
      <div class="player-boots ${boots ? 'equipped' : ''}"></div>
      <div class="player-lamp"></div>
      <div class="player-glow"></div>
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
  section.innerHTML = '<h4>🛡️ Equipamiento</h4>';

  const grid = document.createElement('div');
  grid.className = 'equipment-grid';

  for (const slot of EQUIPMENT_SLOTS) {
    const itemId = state.equipment?.[slot];
    const item = itemId ? getItem(itemId) : null;
    const row = document.createElement('div');
    row.className = 'equipment-slot';

    const abilityText = item?.abilities
      ? Object.entries(item.abilities).map(([key, value]) => {
          const labels = {
            energyEfficiency: `⚡ -${Math.round(value * 100)}% coste de energía`,
            damageReduction: `🛡️ -${Math.round(value * 100)}% daño`,
            mineDoubleChance: `⛏️ ${Math.round(value * 100)}% segundo cuadro`,
            damageBonus: `⚔️ +${value} daño`
          };
          return labels[key] || `${key}: ${value}`;
        }).join(' · ')
      : '';

    row.innerHTML = `
      <span class="equipment-slot-name">${EQUIPMENT_SLOT_LABELS[slot]}</span>
      <span class="equipment-slot-item">${item ? `${item.icon} ${item.name}${abilityText ? `<small>${abilityText}</small>` : ''}` : '— Vacío —'}</span>
    `;

    if (item) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item-action-btn';
      btn.textContent = 'Desequipar';
      btn.onclick = () => unequipSlot(slot);
      row.appendChild(btn);
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
      row.className = 'shop-item';
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

  PICKAXES.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'shop-item';

    const owned = i === state.pickaxeIndex;
    const locked = i < state.pickaxeIndex;
    const durability = owned ? state.pickaxeDurability : p.maxDurability;
    const repairCount = typeof getPickaxeRepairCount === 'function' ? getPickaxeRepairCount(i) : 0;
    const repairPrice = typeof getPickaxeRepairPrice === 'function' ? getPickaxeRepairPrice(i) : 0;
    const damaged = owned && durability < p.maxDurability;

    row.innerHTML = `
      <div class="shop-visual">
        <div class="shop-icon">⛏️</div>
        <div class="shop-info">
          <div class="shop-name">${p.name}${owned ? ' (equipado)' : ''}</div>
          <small>Daño ${p.damage} · Vel ${p.speed}x · Dur ${durability}/${p.maxDurability}</small>
          ${owned ? `<small>🔧 Reparaciones: ${repairCount}</small>` : ''}
        </div>
      </div>
    `;

    const btn = document.createElement('button');

    if (owned) {
      if (damaged) {
        btn.textContent = `🔧 Reparar ${repairPrice} 🪙`;
        btn.disabled = state.gold < repairPrice;
        btn.onclick = () => repairPickaxe();
      } else {
        btn.textContent = '✓ En buen estado';
        btn.disabled = true;
      }
    } else if (locked) {
      btn.textContent = 'Obtenido';
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
