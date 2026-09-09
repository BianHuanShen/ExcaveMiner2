// ============================================================
// USUARIOS Y PARTIDAS
// Sistema local para GitHub/static hosting.
// Cada usuario dispone de 3 ranuras de partida.
// ============================================================

const USERS_KEY = 'minero-abismo-users-v1';
const SESSION_KEY = 'minero-abismo-session-v1';
const MAX_SAVE_SLOTS = 3;

let currentUser = null;
let currentSlot = null;

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users = raw ? JSON.parse(raw) : {};
    return users && typeof users === 'object' ? users : {};
  } catch (error) {
    console.error('No se pudieron leer los usuarios:', error);
    return {};
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeUsername(username) {
  return String(username || '').trim().toLowerCase();
}

function validUsername(username) {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(String(username || '').trim());
}

function validPassword(password) {
  return String(password || '').length >= 4;
}

function registerUser(username, password) {
  username = String(username || '').trim();
  const key = normalizeUsername(username);

  if (!validUsername(username)) {
    return { ok: false, message: 'El usuario debe tener 3-20 caracteres y solo usar letras, números, _ o -.' };
  }

  if (!validPassword(password)) {
    return { ok: false, message: 'La contraseña debe tener al menos 4 caracteres.' };
  }

  const users = readUsers();
  if (users[key]) {
    return { ok: false, message: 'Ese usuario ya existe.' };
  }

  users[key] = {
    username,
    password: String(password),
    slots: [null, null, null]
  };

  writeUsers(users);
  return { ok: true };
}

function loginUser(username, password) {
  const key = normalizeUsername(username);
  const users = readUsers();
  const user = users[key];

  if (!user || user.password !== String(password || '')) {
    return { ok: false, message: 'Usuario o contraseña incorrectos.' };
  }

  user.slots = Array.isArray(user.slots) ? user.slots.slice(0, MAX_SAVE_SLOTS) : [null, null, null];
  while (user.slots.length < MAX_SAVE_SLOTS) user.slots.push(null);

  currentUser = user;
  currentUser.key = key;
  localStorage.setItem(SESSION_KEY, key);

  return { ok: true };
}

function logoutUser() {
  currentUser = null;
  currentSlot = null;
  state = null;
  localStorage.removeItem(SESSION_KEY);
  showAuthScreen();
}

function restoreSession() {
  const key = localStorage.getItem(SESSION_KEY);
  if (!key) return false;

  const users = readUsers();
  const user = users[key];
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    return false;
  }

  user.slots = Array.isArray(user.slots) ? user.slots.slice(0, MAX_SAVE_SLOTS) : [null, null, null];
  while (user.slots.length < MAX_SAVE_SLOTS) user.slots.push(null);

  currentUser = user;
  currentUser.key = key;
  return true;
}

function persistCurrentUser() {
  if (!currentUser?.key) return;

  const users = readUsers();
  const copy = {
    username: currentUser.username,
    password: currentUser.password,
    slots: currentUser.slots
  };

  users[currentUser.key] = copy;
  writeUsers(users);
}

function getSlot(slotIndex) {
  if (!currentUser) return null;
  return currentUser.slots[slotIndex] || null;
}

function setSlot(slotIndex, saveData) {
  if (!currentUser || slotIndex < 0 || slotIndex >= MAX_SAVE_SLOTS) return false;
  currentUser.slots[slotIndex] = saveData;
  persistCurrentUser();
  return true;
}

function deleteSlot(slotIndex) {
  if (!currentUser || slotIndex < 0 || slotIndex >= MAX_SAVE_SLOTS) return false;
  currentUser.slots[slotIndex] = null;
  persistCurrentUser();
  return true;
}

function slotLabel(slotIndex) {
  const saveData = getSlot(slotIndex);
  if (!saveData) return `Ranura ${slotIndex + 1} — Vacía`;

  const level = Number(saveData.level || 1);
  const difficulty = DIFFICULTIES[saveData.difficulty]?.label || saveData.difficulty || 'Desconocida';
  const gold = Number(saveData.gold || 0);

  return `Ranura ${slotIndex + 1} — Nivel ${level} · ${difficulty} · ${gold} 🪙`;
}

// Migración de la antigua partida única a la ranura 1 del usuario.
function migrateLegacySaveToUser() {
  if (!currentUser) return;

  const legacyKey = typeof SAVE_KEY === 'string' ? SAVE_KEY : 'minero-abismo-save';
  const legacyRaw = localStorage.getItem(legacyKey);
  if (!legacyRaw || currentUser.slots.some(Boolean)) return;

  try {
    const legacy = JSON.parse(legacyRaw);
    if (legacy && typeof legacy === 'object') {
      currentUser.slots[0] = legacy;
      persistCurrentUser();
      localStorage.removeItem(legacyKey);
    }
  } catch (error) {
    console.warn('No se pudo migrar la partida antigua:', error);
  }
}
