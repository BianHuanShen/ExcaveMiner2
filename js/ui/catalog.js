// ============================================================
// CATÁLOGO DE OBJETOS / RECETAS
// ============================================================
// La tecla L abre una lista completa de los objetos existentes
// y de las recetas disponibles en el sistema de fabricación.

(() => {
  'use strict';

  const RARITY_ORDER = ['common', 'uncommon', 'rare', 'very_rare', 'epic', 'legendary'];

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function itemSource(item) {
    const craftable = Object.values(CRAFTING_RECIPES || {}).some(recipe => recipe.result === item.id);
    if (craftable) return '🔨 Se fabrica';
    if (item.droppable) return '⛏️ Se encuentra al minar';
    return '📦 Disponible en el juego';
  }

  function renderItemCard(item) {
    const craftable = Object.values(CRAFTING_RECIPES || {}).some(recipe => recipe.result === item.id);
    const stats = item.stats
      ? Object.entries(item.stats).map(([key, value]) => `${escapeHtml(key)}: ${escapeHtml(value)}`).join(' · ')
      : '';

    const abilities = item.abilities
      ? Object.entries(item.abilities).map(([key, value]) => `${escapeHtml(key)}: ${escapeHtml(value)}`).join(' · ')
      : '';

    return `
      <article class="codex-item rarity-${escapeHtml(item.rarity)}" data-item-id="${escapeHtml(item.id)}">
        <div class="codex-item-icon">${escapeHtml(item.icon)}</div>
        <div class="codex-item-body">
          <div class="codex-item-title">
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(RARITY_LABELS[item.rarity] || item.rarity)}</span>
          </div>
          <p>${escapeHtml(item.description)}</p>
          <div class="codex-meta">
            <span>${itemSource(item)}</span>
            ${item.xp ? `<span>⭐ ${item.xp} XP</span>` : ''}
            ${item.sellable && item.sellPrice ? `<span>🪙 ${item.sellPrice}</span>` : ''}
            ${item.equippable ? `<span>🛡️ Equipable</span>` : ''}
            ${craftable ? '<span>🔨 Crafteable</span>' : ''}
          </div>
          ${stats ? `<small>📊 ${stats}</small>` : ''}
          ${abilities ? `<small>✨ ${abilities}</small>` : ''}
        </div>
      </article>
    `;
  }

  function renderRecipe(recipe) {
    const result = getItem(recipe.result);
    if (!result) return '';

    const ingredients = Object.entries(recipe.ingredients).map(([id, qty]) => {
      const item = getItem(id);
      return `<span>${escapeHtml(item?.icon || '❓')} ${escapeHtml(item?.name || id)} ×${Number(qty)}</span>`;
    }).join(' <b>+</b> ');

    return `
      <article class="codex-recipe" data-item-id="${escapeHtml(result.id)}">
        <div class="codex-recipe-result">
          ${escapeHtml(result.icon)} <strong>${escapeHtml(result.name)}</strong>
          <span>${escapeHtml(RARITY_LABELS[result.rarity] || result.rarity)}</span>
        </div>
        <div class="codex-recipe-arrow">⬇️</div>
        <div class="codex-recipe-ingredients">${ingredients}</div>
        ${recipe.xp ? `<small>⭐ +${recipe.xp} XP</small>` : ''}
      </article>
    `;
  }

  function renderCatalog() {
    const itemsContainer = document.getElementById('codex-items');
    const recipesContainer = document.getElementById('codex-recipes');
    if (!itemsContainer || !recipesContainer) return;

    const items = Object.values(ITEM_DEFINITIONS || {});
    itemsContainer.innerHTML = RARITY_ORDER.map(rarity => {
      const group = items.filter(item => item.rarity === rarity);
      if (!group.length) return '';
      return `
        <section class="codex-rarity-group">
          <h3>${escapeHtml(RARITY_LABELS[rarity] || rarity)} <small>(${group.length})</small></h3>
          <div class="codex-item-grid">${group.map(renderItemCard).join('')}</div>
        </section>
      `;
    }).join('');

    recipesContainer.innerHTML = Object.values(CRAFTING_RECIPES || {}).map(renderRecipe).join('');
  }

  function openCatalog() {
    renderCatalog();
    const modal = document.getElementById('item-codex');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCatalog() {
    const modal = document.getElementById('item-codex');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    // Solo devolvemos el scroll si el menú principal tampoco está abierto.
    if (!window.mineroUI || !window.mineroUI.isOpen || !window.mineroUI.isOpen()) {
      document.body.style.overflow = '';
    }
  }

  document.addEventListener('keydown', event => {
    const active = document.activeElement;
    if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return;

    if (event.key.toLowerCase() === 'l' && !event.repeat) {
      event.preventDefault();
      const modal = document.getElementById('item-codex');
      if (modal && modal.classList.contains('hidden')) openCatalog();
      else closeCatalog();
    }

    if (event.key === 'Escape') closeCatalog();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const close = document.getElementById('codex-close');
    const modal = document.getElementById('item-codex');
    if (close) close.addEventListener('click', closeCatalog);
    if (modal) {
      modal.addEventListener('click', event => {
        if (event.target === modal) closeCatalog();
      });
    }
  });

  window.mineroCatalog = {
    open: openCatalog,
    close: closeCatalog,
    render: renderCatalog
  };
})();
