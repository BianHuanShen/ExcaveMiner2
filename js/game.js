// ============================================================
// EL MINERO DEL ABISMO - NÚCLEO
// ============================================================
// Este archivo mantiene únicamente el estado global y la entrada
// principal. La lógica está separada en data/, systems/ y ui/.

let state = null;

function pickaxe() {
  return PICKAXES[state.pickaxeIndex];
}
