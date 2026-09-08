/* ============================================================
   DEFINICIONES DE EFECTOS CONSUMIBLES
   La definición del ítem solo referencia effectId.
   ============================================================ */

const CONSUMABLE_EFFECTS = {
  heal_40: {
    id: 'heal_40',
    type: 'restore_hp',
    amount: 40,
    message: '🧪 Usaste una poción de vida. +40 HP.'
  },

  energy_40: {
    id: 'energy_40',
    type: 'restore_energy',
    amount: 40,
    message: '⚡ Usaste una poción de energía. +40 Energía.'
  }
};
