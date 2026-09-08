/* ============================================================
   REGISTRO CENTRAL DE ITEMS
   Un solo registro. El inventario guarda únicamente IDs + qty.
   ============================================================ */

const ITEM_DEFINITIONS = {
  stone: {
    id: 'stone', name: 'Piedra', icon: '🪨',
    description: 'Una piedra común extraída de las profundidades.',
    category: 'material', rarity: 'common', xp: 2,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: true
  },

  iron_ore: {
    id: 'iron_ore', name: 'Mineral de hierro', icon: '⛓️',
    description: 'Mineral resistente usado por los mineros.',
    category: 'material', rarity: 'common', xp: 3,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: true
  },

  ancient_coin: {
    id: 'ancient_coin', name: 'Moneda antigua', icon: '🪙',
    description: 'Una moneda de una civilización olvidada.',
    category: 'sellable', rarity: 'common', xp: 3,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: true
  },

  crystal_fragment: {
    id: 'crystal_fragment', name: 'Fragmento de cristal', icon: '💠',
    description: 'Un pequeño fragmento cristalino que brilla tenuemente.',
    category: 'material', rarity: 'common', xp: 4,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: true
  },

  gold_pouch: {
    id: 'gold_pouch', name: 'Bolsa de oro', icon: '💰',
    description: 'Una pequeña bolsa repleta de monedas antiguas.',
    category: 'sellable', rarity: 'uncommon', xp: 8,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: true
  },

  ruby: {
    id: 'ruby', name: 'Rubí', icon: '❤️',
    description: 'Una gema roja de gran valor.',
    category: 'sellable', rarity: 'uncommon', xp: 10,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: true
  },

  sapphire: {
    id: 'sapphire', name: 'Zafiro', icon: '🔷',
    description: 'Una gema azul encontrada en las rocas profundas.',
    category: 'sellable', rarity: 'uncommon', xp: 10,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: true
  },

  ancient_jar: {
    id: 'ancient_jar', name: 'Jarra antigua', icon: '🏺',
    description: 'Una jarra conservada durante siglos bajo tierra.',
    category: 'misc', rarity: 'uncommon', xp: 8,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: true
  },

  lost_crown: {
    id: 'lost_crown', name: 'Corona perdida', icon: '👑',
    description: 'Una corona perdida por algún antiguo gobernante.',
    category: 'equipment', rarity: 'rare', xp: 25,
    usable: false, equippable: true, consumable: false,
    sellable: true, droppable: true, stackable: false
  },

  ancient_scroll: {
    id: 'ancient_scroll', name: 'Pergamino antiguo', icon: '📜',
    description: 'Un pergamino misterioso lleno de secretos.',
    category: 'quest', rarity: 'rare', xp: 20,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: true
  },

  iron_buried_sword: {
    id: 'iron_buried_sword', name: 'Espada enterrada', icon: '⚔️',
    description: 'Una espada que permaneció enterrada durante generaciones.',
    category: 'equipment', rarity: 'rare', xp: 22,
    usable: false, equippable: true, consumable: false,
    sellable: true, droppable: true, stackable: false
  },

  cursed_ring: {
    id: 'cursed_ring', name: 'Anillo maldito', icon: '💍',
    description: 'Un extraño anillo que parece guardar una maldición.',
    category: 'equipment', rarity: 'rare', xp: 20,
    usable: false, equippable: true, consumable: false,
    sellable: true, droppable: true, stackable: false
  },

  abyss_crystal: {
    id: 'abyss_crystal', name: 'Cristal del Abismo', icon: '🔮',
    description: 'Un cristal que parece contener energía del Abismo.',
    category: 'material', rarity: 'epic', xp: 50,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: true
  },

  ancient_idol: {
    id: 'ancient_idol', name: 'Ídolo antiguo', icon: '🗿',
    description: 'Una figura sagrada de una civilización perdida.',
    category: 'sellable', rarity: 'epic', xp: 45,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: true
  },

  black_diamond: {
    id: 'black_diamond', name: 'Diamante negro', icon: '💎',
    description: 'Una gema extremadamente rara y oscura.',
    category: 'sellable', rarity: 'epic', xp: 55,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: true
  },

  dead_king_crown: {
    id: 'dead_king_crown', name: 'Corona del Rey Muerto', icon: '👑',
    description: 'La corona de un rey cuyo nombre se perdió en el tiempo.',
    category: 'equipment', rarity: 'legendary', xp: 150,
    usable: false, equippable: true, consumable: false,
    sellable: true, droppable: true, stackable: false
  },

  abyss_heart: {
    id: 'abyss_heart', name: 'Corazón del Abismo', icon: '💜',
    description: 'Un cristal con forma de corazón que late con energía oscura.',
    category: 'misc', rarity: 'legendary', xp: 180,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: false
  },

  first_miner_relic: {
    id: 'first_miner_relic', name: 'Reliquia del Primer Minero', icon: '🏆',
    description: 'Una reliquia legendaria vinculada al primer minero del Abismo.',
    category: 'quest', rarity: 'legendary', xp: 200,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: false
  },

  health_potion: {
    id: 'health_potion', name: 'Poción de vida', icon: '🧪',
    description: 'Restaura 40 puntos de vida.',
    category: 'consumable', rarity: 'common', xp: 0,
    usable: true, equippable: false, consumable: true,
    sellable: true, droppable: true, stackable: true,
    effectId: 'heal_40'
  },

  energy_potion: {
    id: 'energy_potion', name: 'Poción de energía', icon: '⚡',
    description: 'Restaura 40 puntos de energía.',
    category: 'consumable', rarity: 'common', xp: 0,
    usable: true, equippable: false, consumable: true,
    sellable: true, droppable: true, stackable: true,
    effectId: 'energy_40'
  }
};

const RARITY_ITEMS = {
  common: ['stone', 'iron_ore', 'ancient_coin', 'crystal_fragment'],
  uncommon: ['gold_pouch', 'ruby', 'sapphire', 'ancient_jar'],
  rare: ['lost_crown', 'ancient_scroll', 'iron_buried_sword', 'cursed_ring'],
  epic: ['abyss_crystal', 'ancient_idol', 'black_diamond'],
  legendary: ['dead_king_crown', 'abyss_heart', 'first_miner_relic']
};

/* Precio y equipamiento se inyectan como propiedades derivadas. */
for (const item of Object.values(ITEM_DEFINITIONS)) {
  if (Object.prototype.hasOwnProperty.call(SELLABLE_PRICES, item.id)) {
    item.sellPrice = SELLABLE_PRICES[item.id];
  }
  const equipment = EQUIPMENT_DEFINITIONS[item.id];
  if (equipment) {
    item.slot = equipment.slot;
    item.stats = { ...equipment.stats };
  }
}

const ITEMS = ITEM_DEFINITIONS;

function getItem(id) {
  return ITEM_DEFINITIONS[id] || null;
}

function requireItem(id) {
  const item = getItem(id);
  if (!item) throw new Error(`Item desconocido: ${id}`);
  return item;
}
