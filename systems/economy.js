/* ============================================================
   ECONOMY SYSTEM
   La venta depende exclusivamente de item.sellable + sellPrice.
   ============================================================ */

function getSellPrice(itemId) {
  const item = getItem(itemId);
  return item?.sellable ? Number(item.sellPrice || 0) : 0;
}

function sellItemCore(itemId, qty = 1) {
  const item = getItem(itemId);
  const price = getSellPrice(itemId);
  qty = Math.floor(Number(qty));

  if (!item || price <= 0 || qty <= 0 || !hasItem(itemId, qty)) return false;

  removeItem(itemId, qty);
  const total = price * qty;
  state.gold += total;

  log(`🪙 Vendiste ${qty}x ${item.name} por ${total} oro.`, 'good');
  render();
  save();
  return true;
}

function sellAllCore(itemId) {
  return sellItemCore(itemId, getItemQuantity(itemId));
}

window.economySellItem = sellItemCore;
window.economySellAll = sellAllCore;
