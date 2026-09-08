/* ============================================================
   DEFINICIONES DE EQUIPAMIENTO
   Solo contiene datos. La lógica vive en systems/equipment.js.
   ============================================================ */

const EQUIPMENT_DEFINITIONS = {
  iron_buried_sword: {
    slot: 'weapon',
    stats: { damage: 10 }
  },

  cursed_ring: {
    slot: 'ring',
    stats: { damage: 3, defense: -2 }
  },

  lost_crown: {
    slot: 'helmet',
    stats: { defense: 4 }
  },

  dead_king_crown: {
    slot: 'helmet',
    stats: { defense: 10, damage: 2 }
  }
};
