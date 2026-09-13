// ============================================================
// TABS
// ============================================================
function showTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  ['inventory', 'shelter', 'shop', 'crafting'].forEach(t => {
    document.getElementById('panel-' + t).classList.toggle('hidden', t !== tab);
  });
}
