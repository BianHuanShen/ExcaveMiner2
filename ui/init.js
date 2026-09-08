// ============================================================
// INICIALIZACIÓN
// ============================================================
function startGame(difficulty) {
  state = newGameState(difficulty);
  rebuildPlayerStats();
  document.getElementById('start-screen').classList.add('hidden');
  ['hud', 'map-container', 'log', 'controls', 'bottom-tabs', 'reset-btn'].forEach(id =>
    document.getElementById(id).classList.remove('hidden')
  );
  clearLogVisual();
  log('⛏️ Bienvenido al Abismo. Excava en cualquier dirección para comenzar tu aventura.', 'info');
  showTab('shelter');
  render();
  save();
}

function continueGame() {
  const loaded = loadSave();
  if (!loaded) return;
  state = migrateInventoryState(loaded);
  normalizeEquipmentState(state);
  state.baseStats = state.baseStats || {
    damage: 1,
    defense: 0,
    maxHp: Number(state.maxHp || 100),
    maxEnergy: Number(state.maxEnergy || 100)
  };
  state.temporaryStats = state.temporaryStats || {};
  rebuildPlayerStats();
  document.getElementById('start-screen').classList.add('hidden');
  ['hud', 'map-container', 'log', 'controls', 'bottom-tabs', 'reset-btn'].forEach(id =>
    document.getElementById(id).classList.remove('hidden')
  );
  clearLogVisual();
  log('▶ Partida cargada. Bienvenido de vuelta, minero.', 'info');
  showTab('shelter');
  render();
}

function initUI() {
  const existing = loadSave();
  if (existing) {
    document.getElementById('continue-btn').style.display = 'block';
    document.getElementById('continue-btn').onclick = continueGame;
  }

  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.onclick = () => startGame(btn.dataset.diff);
  });

  document.getElementById('dig-up').onclick = () => dig('up');
  document.getElementById('dig-down').onclick = () => dig('down');
  document.getElementById('dig-left').onclick = () => dig('left');
  document.getElementById('dig-right').onclick = () => dig('right');
  document.getElementById('go-home').onclick = goHome;
  document.getElementById('sleep-btn').onclick = sleep;

  document.getElementById('inventory-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-action][data-item-id]');
    if (!button) return;
    executeItemAction(button.dataset.action, button.dataset.itemId);
  });

  document.getElementById('treasure-close').onclick = closeTreasurePopup;
  document.getElementById('treasure-popup').addEventListener('click', (e) => {
    if (e.target.id === 'treasure-popup') closeTreasurePopup();
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => showTab(btn.dataset.tab);
  });

  document.getElementById('reset-btn').onclick = () => {
  mostrarModalReset();
};

function mostrarModalReset() {
  const modal = document.createElement('div');

  modal.className = 'reset-modal-overlay';

  modal.innerHTML = `
    <div class="reset-modal">
      
      <div class="reset-modal-icon">⚠️</div>

      <h2>¿BORRAR PARTIDA?</h2>

      <p>
        ¿Deseas realmente borrar tu partida?
      </p>

      <span>
        Todo tu progreso se perderá y comenzarás desde cero.
      </span>

      <div class="reset-modal-actions">
        <button class="reset-cancel">
          CANCELAR
        </button>

        <button class="reset-confirm">
          BORRAR PARTIDA
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  const cancelar = modal.querySelector('.reset-cancel');
  const confirmar = modal.querySelector('.reset-confirm');

  cancelar.onclick = () => {
    modal.remove();
  };

  confirmar.onclick = () => {
    clearSave();
    location.reload();
  };

  // Cerrar haciendo clic fuera del modal
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  };
};
}

document.addEventListener('DOMContentLoaded', initUI);
