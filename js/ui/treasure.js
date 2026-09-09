// ============================================================
// TESORO / POPUP
// ============================================================

function itemVisual(itemId) {
  const item = getItem(itemId);
  return item || { icon: '❓', description: 'Un objeto misterioso.' };
}

function showTreasurePopup(itemId, rarity, info) {
  const popup = document.getElementById('treasure-popup');
  const card = popup.querySelector('.treasure-card');
  const item = getItem(itemId);
  if (!item) return;

  document.getElementById('treasure-rarity').textContent =
    `✨ ${RARITY_LABELS[rarity] || rarity}`;
  document.getElementById('treasure-icon').textContent = item.icon;
  document.getElementById('treasure-name').textContent = item.name;
  document.getElementById('treasure-description').textContent = item.description;
  document.getElementById('treasure-reward').textContent =
    `✨ +${info.xp} XP   ·   🪙 ${info.sellPrice || 0} oro de valor`;

  card.className = `treasure-card rarity-${rarity}`;
  popup.classList.remove('hidden');
}

function closeTreasurePopup() {
  document.getElementById('treasure-popup').classList.add('hidden');
}
