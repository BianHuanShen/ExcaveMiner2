// ============================================================
// TRUCOS / CÓDIGOS DE TECLADO
// ============================================================
// El código "dinero" entrega 500 de oro.
// El tiempo de espera se guarda dentro de la partida para que
// no se pueda reiniciar simplemente recargando la página.

const MONEY_CHEAT_WORD = 'dinero';
const MONEY_CHEAT_REWARD = 500;
const MONEY_CHEAT_COOLDOWN = 10 * 60 * 1000; // 10 minutos

let moneyCheatBuffer = '';
let moneyCheatLastKeyAt = 0;

function handleKeyboardCheats(event) {
  // No activar trucos mientras el jugador escribe en formularios.
  const active = document.activeElement;
  if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return;

  const key = String(event.key || '').toLowerCase();
  if (!/^[a-z]$/.test(key)) return;

  // Si pasó demasiado tiempo entre letras, empezamos una nueva secuencia.
  if (Date.now() - moneyCheatLastKeyAt > 3000) {
    moneyCheatBuffer = '';
  }
  moneyCheatLastKeyAt = Date.now();

  // Mantener solo una secuencia del tamaño necesario.
  moneyCheatBuffer += key;
  if (moneyCheatBuffer.length > MONEY_CHEAT_WORD.length) {
    moneyCheatBuffer = moneyCheatBuffer.slice(-MONEY_CHEAT_WORD.length);
  }

  if (moneyCheatBuffer !== MONEY_CHEAT_WORD) return;

  moneyCheatBuffer = '';

  // Se requiere una partida activa para entregar el premio.
  if (!state || !currentUser || currentSlot === null) return;

  const now = Date.now();
  const lastUsed = Number(state.moneyCheatLastUsed || 0);
  const elapsed = now - lastUsed;

  if (elapsed < MONEY_CHEAT_COOLDOWN) {
    const remaining = MONEY_CHEAT_COOLDOWN - elapsed;
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.ceil((remaining % 60000) / 1000);
    log(`💰 El código ya fue usado. Espera ${minutes}m ${seconds}s para volver a usarlo.`, 'bad');
    return;
  }

  state.gold += MONEY_CHEAT_REWARD;
  state.moneyCheatLastUsed = now;

  log(`💰 Código DINERO activado: +${MONEY_CHEAT_REWARD} de oro. Podrás usarlo de nuevo en 10 minutos.`, 'good');
  render();
  save();
}

document.addEventListener('keydown', handleKeyboardCheats);
