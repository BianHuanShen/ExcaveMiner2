// ============================================================
// RENDER
// ============================================================
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
      if (x === state.pos.x && y === state.pos.y) {
        tile.classList.add('player');
        tile.textContent = '🧍';
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
    row.innerHTML = `
      <span class="equipment-slot-name">${EQUIPMENT_SLOT_LABELS[slot]}</span>
      <span class="equipment-slot-item">${item ? `${item.icon} ${item.name}` : '— Vacío —'}</span>
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
    row.innerHTML = `
      <div class="shop-visual">
        <div class="shop-icon">⛏️</div>
        <div class="shop-info">
          <div class="shop-name">${p.name}${owned ? ' (equipado)' : ''}</div>
          <small>Daño ${p.damage} · Vel ${p.speed}x · Dur ${p.maxDurability}</small>
        </div>
      </div>
    `;
    const btn = document.createElement('button');
    if (owned || locked) {
      btn.textContent = owned ? 'Equipado' : 'Obtenido';
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
