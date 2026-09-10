// ============================================================
// SISTEMA DE REFUGIOS — hasta 4 ubicaciones por partida.
// Solo administra posiciones; no modifica minería, combate o inventario.
// ============================================================

const MAX_SHELTERS = 4;

function normalizeSheltersState() {
  if (!state) return [];
  if (!Array.isArray(state.shelters)) state.shelters = [];

  state.shelters = state.shelters
    .filter(s => s && s.pos && Number.isFinite(Number(s.pos.x)) && Number.isFinite(Number(s.pos.y)))
    .slice(0, MAX_SHELTERS)
    .map((s, index) => ({
      id: Number.isFinite(Number(s.id)) ? Number(s.id) : index + 1,
      name: String(s.name || `Refugio ${index + 1}`),
      pos: { x: Number(s.pos.x), y: Number(s.pos.y) },
      savedAt: Number(s.savedAt || Date.now())
    }));

  return state.shelters;
}

function getShelters() {
  return normalizeSheltersState();
}

function saveShelter() {
  if (!state) return false;
  normalizeSheltersState();

  if (state.shelters.length >= MAX_SHELTERS) {
    log('🏠 Ya tienes 4 refugios. Elimina uno para guardar otra ubicación.', 'info');
    renderShelterManager();
    return false;
  }

  const pos = { x: Number(state.pos.x), y: Number(state.pos.y) };
  const duplicate = state.shelters.find(s => s.pos.x === pos.x && s.pos.y === pos.y);

  if (duplicate) {
    log(`🏠 Esa ubicación ya está guardada como ${duplicate.name}.`, 'info');
    renderShelterManager();
    return false;
  }

  const id = state.shelters.reduce((max, s) => Math.max(max, Number(s.id) || 0), 0) + 1;
  state.shelters.push({
    id,
    name: `Refugio ${state.shelters.length + 1}`,
    pos,
    savedAt: Date.now()
  });

  save();
  renderShelterManager();
  log(`📌 ${state.shelters[state.shelters.length - 1].name} guardado en (${pos.x}, ${pos.y}).`, 'good');
  return true;
}

function travelToShelter(id) {
  if (!state) return false;
  const shelter = getShelters().find(s => Number(s.id) === Number(id));

  if (!shelter) {
    log('🏠 Ese refugio ya no existe.', 'info');
    renderShelterManager();
    return false;
  }

  state.pos = { x: shelter.pos.x, y: shelter.pos.y };
  save();
  render();
  log(`🏠 Has viajado a ${shelter.name} (${shelter.pos.x}, ${shelter.pos.y}).`, 'good');

  if (window.mineroUI?.close) window.mineroUI.close();
  return true;
}

function deleteShelter(id) {
  if (!state) return false;
  normalizeSheltersState();

  const index = state.shelters.findIndex(s => Number(s.id) === Number(id));
  if (index < 0) return false;

  const [removed] = state.shelters.splice(index, 1);
  save();
  renderShelterManager();
  log(`🗑️ ${removed.name} eliminado.`, 'info');
  return true;
}

function renderShelterManager() {
  const list = document.getElementById('shelter-list');
  const count = document.getElementById('shelter-count');
  const saveButton = document.getElementById('save-shelter-btn');
  if (!list) return;

  const shelters = getShelters();
  if (count) count.textContent = `${shelters.length}/${MAX_SHELTERS}`;
  if (saveButton) saveButton.disabled = shelters.length >= MAX_SHELTERS;

  list.replaceChildren();

  if (!shelters.length) {
    const empty = document.createElement('div');
    empty.className = 'shelter-empty';
    empty.textContent = 'No hay refugios guardados. Puedes guardar tu posición actual.';
    list.appendChild(empty);
    return;
  }

  shelters.forEach(shelter => {
    const row = document.createElement('div');
    row.className = 'shelter-entry';

    const info = document.createElement('div');
    info.className = 'shelter-entry-info';

    const title = document.createElement('strong');
    title.textContent = shelter.name;

    const coords = document.createElement('span');
    coords.textContent = `X: ${shelter.pos.x} · Y: ${shelter.pos.y}`;

    info.append(title, coords);

    const actions = document.createElement('div');
    actions.className = 'shelter-entry-actions';

    const go = document.createElement('button');
    go.type = 'button';
    go.className = 'shelter-go';
    go.textContent = 'Ir';
    go.title = `Ir a ${shelter.name}`;
    go.dataset.shelterId = String(shelter.id);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'shelter-delete';
    remove.textContent = 'Eliminar';
    remove.dataset.shelterId = String(shelter.id);

    actions.append(go, remove);
    row.append(info, actions);
    list.appendChild(row);
  });
}

function openShelterManager() {
  if (window.mineroUI?.openShelter) {
    window.mineroUI.openShelter();
  } else {
    renderShelterManager();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save-shelter-btn');
  const list = document.getElementById('shelter-list');

  if (saveButton) {
    saveButton.addEventListener('click', saveShelter);
  }

  if (list) {
    list.addEventListener('click', event => {
      const go = event.target.closest('.shelter-go');
      const remove = event.target.closest('.shelter-delete');

      if (go) travelToShelter(go.dataset.shelterId);
      if (remove) deleteShelter(remove.dataset.shelterId);
    });
  }

  renderShelterManager();
});
