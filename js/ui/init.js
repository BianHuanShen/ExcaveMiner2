// ============================================================
// INICIALIZACIÓN + USUARIOS + RANURAS
// ============================================================

function showOnlyStartView(viewId) {
  document.querySelectorAll('#start-screen > .start-view').forEach(view => {
    view.classList.toggle('hidden', view.id !== viewId);
  });
}

function showAuthScreen() {
  const start = document.getElementById('start-screen');
  if (!start) return;

  start.classList.remove('hidden');
  showOnlyStartView('auth-view');

  const username = document.getElementById('login-username');
  const password = document.getElementById('login-password');
  const error = document.getElementById('auth-message');
  if (username) username.focus();
  if (password) password.value = '';
  if (error) error.textContent = '';
}

function showSlotsScreen() {
  const start = document.getElementById('start-screen');
  if (!start || !currentUser) return;

  start.classList.remove('hidden');
  showOnlyStartView('slots-view');
  document.getElementById('logged-user').textContent = currentUser.username;

  for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
    const card = document.querySelector(`[data-slot-card="${i}"]`);
    const saveData = getSlot(i);
    if (!card) continue;

    card.querySelector('.slot-title').textContent = `Ranura ${i + 1}`;
    card.querySelector('.slot-info').textContent = slotLabel(i);

    const loadBtn = card.querySelector('.slot-load');
    const newBtn = card.querySelector('.slot-new');
    const deleteBtn = card.querySelector('.slot-delete');

    loadBtn.disabled = !saveData;
    loadBtn.textContent = saveData ? '▶ Continuar' : '▶ Continuar';
    deleteBtn.disabled = !saveData;
    newBtn.textContent = saveData ? '♻ Nueva partida' : '⛏️ Nueva partida';
  }
}

function showDifficultyScreen(slotIndex) {
  currentSlot = Number(slotIndex);
  const saveData = getSlot(currentSlot);

  if (saveData) {
    startGame(saveData.difficulty, currentSlot, true);
    return;
  }

  showOnlyStartView('difficulty-view');
  document.getElementById('difficulty-slot').textContent = `Ranura ${currentSlot + 1}`;
}

function startGame(difficulty, slotIndex = currentSlot, replacing = false) {
  currentSlot = Number(slotIndex);
  state = newGameState(difficulty);
  rebuildPlayerStats();

  document.getElementById('start-screen').classList.add('hidden');
  ['hud', 'map-container', 'log', 'controls', 'bottom-tabs', 'reset-btn'].forEach(id =>
    document.getElementById(id).classList.remove('hidden')
  );

  clearLogVisual();
  log(replacing
    ? '♻ Nueva partida iniciada. El Abismo vuelve a esperar.'
    : '⛏️ Bienvenido al Abismo. Excava en cualquier dirección para comenzar tu aventura.', 'info');
  showTab('shelter');
  render();
  save();
}

function continueGame(slotIndex = currentSlot) {
  currentSlot = Number(slotIndex);
  const loaded = loadSave(currentSlot);
  if (!loaded) return;

  state = migrateInventoryState(loaded);
  state.difficulty = normalizeDifficulty(state.difficulty);
  normalizeEquipmentState(state);
  state.baseStats = state.baseStats || {
    damage: 1,
    defense: 0,
    maxHp: Number(state.maxHp || 100),
    maxEnergy: Number(state.maxEnergy || 100)
  };
  state.temporaryStats = state.temporaryStats || {};
  state.pickaxeRepairs = state.pickaxeRepairs || {};
  // Compatibilidad con partidas creadas antes del código DINERO.
  state.moneyCheatLastUsed = Number(state.moneyCheatLastUsed || 0);
  state.lastSleepAt = Number(state.lastSleepAt || 0);
  state.mobs = Array.isArray(state.mobs) ? state.mobs : [];
  state.nextMobId = Number(state.nextMobId || 1);
  rebuildPlayerStats();
  if (typeof normalizeMobsState === 'function') normalizeMobsState();

  document.getElementById('start-screen').classList.add('hidden');
  ['hud', 'map-container', 'log', 'controls', 'bottom-tabs', 'reset-btn'].forEach(id =>
    document.getElementById(id).classList.remove('hidden')
  );

  clearLogVisual();
  log('▶ Partida cargada. Bienvenido de vuelta, minero.', 'info');
  showTab('shelter');
  render();
}

function deleteCurrentSlot() {
  if (currentSlot === null) return;
  clearSave(currentSlot);
  showSlotsScreen();
}

function resetCurrentSlot() {
  if (currentSlot === null) return;

  const modal = document.createElement('div');
  modal.className = 'reset-modal-overlay';
  modal.innerHTML = `
    <div class="reset-modal">
      <div class="reset-modal-icon">⚠️</div>
      <h2>¿BORRAR PARTIDA?</h2>
      <p>¿Deseas realmente borrar esta ranura?</p>
      <span>Todo el progreso de esta partida se perderá.</span>
      <div class="reset-modal-actions">
        <button class="reset-cancel">CANCELAR</button>
        <button class="reset-confirm">BORRAR PARTIDA</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector('.reset-cancel').onclick = () => modal.remove();
  modal.querySelector('.reset-confirm').onclick = () => {
    clearSave(currentSlot);
    modal.remove();
    location.reload();
  };
  modal.onclick = e => {
    if (e.target === modal) modal.remove();
  };
}

function initAuthUI() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const authTabs = document.querySelectorAll('.auth-tab');
  const authMessage = document.getElementById('auth-message');

  authTabs.forEach(tab => {
    tab.onclick = () => {
      authTabs.forEach(t => t.classList.toggle('active', t === tab));
      document.getElementById('login-form').classList.toggle('hidden', tab.dataset.auth !== 'login');
      document.getElementById('register-form').classList.toggle('hidden', tab.dataset.auth !== 'register');
      authMessage.textContent = '';
    };
  });

  loginForm.onsubmit = e => {
    e.preventDefault();
    const result = loginUser(
      document.getElementById('login-username').value,
      document.getElementById('login-password').value
    );

    if (!result.ok) {
      authMessage.textContent = result.message;
      return;
    }

    migrateLegacySaveToUser();
    loginForm.reset();
    authMessage.textContent = '';
    showSlotsScreen();
  };

  registerForm.onsubmit = e => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    if (password !== confirm) {
      authMessage.textContent = 'Las contraseñas no coinciden.';
      return;
    }

    const result = registerUser(username, password);
    if (!result.ok) {
      authMessage.textContent = result.message;
      return;
    }

    loginUser(username, password);
    migrateLegacySaveToUser();
    registerForm.reset();
    authMessage.textContent = '';
    showSlotsScreen();
  };
}

function initGameUI() {
  document.getElementById('dig-up').onclick = () => dig('up');
  document.getElementById('dig-down').onclick = () => dig('down');
  document.getElementById('dig-left').onclick = () => dig('left');
  document.getElementById('dig-right').onclick = () => dig('right');
  document.getElementById('go-home').onclick = goHome;
  document.getElementById('sleep-btn').onclick = sleep;

  document.getElementById('inventory-list').addEventListener('click', event => {
    const button = event.target.closest('[data-action][data-item-id]');
    if (!button) return;
    executeItemAction(button.dataset.action, button.dataset.itemId);
  });

  document.getElementById('treasure-close').onclick = closeTreasurePopup;
  document.getElementById('treasure-popup').addEventListener('click', e => {
    if (e.target.id === 'treasure-popup') closeTreasurePopup();
  });

  document.getElementById('reset-btn').onclick = resetCurrentSlot;
  document.getElementById('slot-menu-btn').onclick = showSlotsScreen;
  document.getElementById('logout-btn').onclick = logoutUser;
  document.getElementById('slots-logout-btn').onclick = logoutUser;

  for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
    const card = document.querySelector(`[data-slot-card="${i}"]`);
    if (!card) continue;

    card.querySelector('.slot-load').onclick = () => continueGame(i);
    card.querySelector('.slot-new').onclick = () => showDifficultyScreen(i);
    card.querySelector('.slot-delete').onclick = () => {
      deleteSlot(i);
      showSlotsScreen();
    };
  }

  document.getElementById('difficulty-back').onclick = showSlotsScreen;
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.onclick = () => startGame(btn.dataset.diff, currentSlot, Boolean(getSlot(currentSlot)));
  });
}

function initUI() {
  initAuthUI();
  initGameUI();

  if (restoreSession()) {
    migrateLegacySaveToUser();
    showSlotsScreen();
  } else {
    showAuthScreen();
  }
}

document.addEventListener('DOMContentLoaded', initUI);
