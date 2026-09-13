// ============================================================
// NÚCLEO DEL JUEGO
// Estado global y pequeños estilos dinámicos para módulos nuevos.
// ============================================================
let state = null;

// Añade estilos mínimos para enemigos y mensajes sin depender de cambios HTML/CSS.
(function installRuntimeStyles() {
  const style = document.createElement('style');
  style.id = 'minero-runtime-styles';
  style.textContent = `
    #log { display: flex; flex-direction: column; align-items: stretch; gap: 4px; }
    #log .log-message { display: block; width: 100%; box-sizing: border-box; }
    .tile.mob { position: relative; }
    .tile.mob { cursor:pointer; touch-action:manipulation; user-select:none; }
    .mob-character { display:flex; align-items:center; justify-content:center; flex-direction:column; font-size:clamp(20px, 4vw, 34px); line-height:1; animation: mob-float .7s ease-in-out infinite alternate; }
    .mob-hp { font-size:10px; margin-top:2px; padding:1px 4px; border-radius:8px; background:rgba(0,0,0,.65); }
    @keyframes mob-float { from { transform:translateY(1px); } to { transform:translateY(-2px); } }
  `;
  document.head.appendChild(style);
})();
