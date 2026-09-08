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
  ,
  // ===== NUEVOS TESOROS =====
  ari_lost_diamond: {
    id: 'ari_lost_diamond', name: 'Diamante Perdido de Ari', icon: '💎',
    description: 'Un diamante mítico que Ari escondió en algún rincón del Abismo y, con el paso de los años, olvidó por completo dónde lo dejó. Algunos mineros aseguran que solo aparece ante quien está destinado a encontrarlo.',
    category: 'treasure', rarity: 'very_rare', xp: 100,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: false
  },
  emerald_of_change: {
    id: 'emerald_of_change', name: 'Esmeralda del Cambio', icon: '💚',
    description: 'Una esmeralda legendaria nacida de una veta que cambia con el destino. Se dice que quien la encuentra nunca vuelve a ser exactamente el mismo minero.',
    category: 'treasure', rarity: 'legendary', xp: 200,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: false
  },

  // ===== 16 NUEVOS OBJETOS =====
  coal_chunk: {
    id: 'coal_chunk', name: 'Trozo de carbón', icon: '⚫',
    description: 'Carbón común, útil para forjar y fundir materiales.',
    category: 'material', rarity: 'common', xp: 2,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  copper_ore: {
    id: 'copper_ore', name: 'Mineral de cobre', icon: '🟠',
    description: 'Un mineral rojizo frecuente en las capas superiores.',
    category: 'material', rarity: 'common', xp: 3,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  rough_fiber: {
    id: 'rough_fiber', name: 'Fibra áspera', icon: '🌿',
    description: 'Fibra resistente encontrada entre grietas húmedas.',
    category: 'material', rarity: 'common', xp: 2,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  clay_piece: {
    id: 'clay_piece', name: 'Fragmento de arcilla', icon: '🟤',
    description: 'Arcilla endurecida que puede convertirse en piezas útiles.',
    category: 'material', rarity: 'common', xp: 2,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },

  copper_wire: {
    id: 'copper_wire', name: 'Alambre de cobre', icon: '〰️',
    description: 'Cobre trabajado, flexible y perfecto para mecanismos sencillos.',
    category: 'material', rarity: 'uncommon', xp: 5,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  miner_leather: {
    id: 'miner_leather', name: 'Cuero de minero', icon: '🟫',
    description: 'Cuero curtido y reforzado para proteger al minero.',
    category: 'material', rarity: 'uncommon', xp: 6,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  blue_crystal: {
    id: 'blue_crystal', name: 'Cristal azul', icon: '🔹',
    description: 'Cristal poco común que conserva energía durante horas.',
    category: 'material', rarity: 'uncommon', xp: 7,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  silver_nugget: {
    id: 'silver_nugget', name: 'Pepita de plata', icon: '⚪',
    description: 'Una pequeña pepita de plata hallada en una veta escondida.',
    category: 'material', rarity: 'uncommon', xp: 8,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },

  obsidian_shard: {
    id: 'obsidian_shard', name: 'Fragmento de obsidiana', icon: '⬛',
    description: 'Vidrio volcánico oscuro, duro como una promesa del Abismo.',
    category: 'material', rarity: 'rare', xp: 15,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  moon_stone: {
    id: 'moon_stone', name: 'Piedra lunar', icon: '🌙',
    description: 'Piedra pálida que parece guardar un reflejo de la superficie.',
    category: 'material', rarity: 'rare', xp: 18,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  emerald_shard: {
    id: 'emerald_shard', name: 'Fragmento de esmeralda', icon: '💚',
    description: 'Un fragmento verde y brillante, precursor de gemas mayores.',
    category: 'material', rarity: 'rare', xp: 20,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },

  abyss_steel: {
    id: 'abyss_steel', name: 'Acero del Abismo', icon: '🔩',
    description: 'Metal oscuro templado bajo una presión imposible. Pocos herreros saben trabajarlo.',
    category: 'material', rarity: 'very_rare', xp: 35,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  sun_crystal: {
    id: 'sun_crystal', name: 'Cristal solar', icon: '☀️',
    description: 'Una gema cálida que emite una luz constante incluso en la oscuridad absoluta.',
    category: 'material', rarity: 'very_rare', xp: 40,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  ancient_core: {
    id: 'ancient_core', name: 'Núcleo antiguo', icon: '🔆',
    description: 'El corazón energético de una máquina olvidada bajo miles de toneladas de roca.',
    category: 'material', rarity: 'very_rare', xp: 45,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: false
  },

  void_shard: {
    id: 'void_shard', name: 'Fragmento del Vacío', icon: '🟣',
    description: 'Un fragmento imposible que parece absorber la luz que lo rodea.',
    category: 'material', rarity: 'legendary', xp: 80,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: false
  },
  abyss_rune: {
    id: 'abyss_rune', name: 'Runa del Abismo', icon: 'ᚨ',
    description: 'Una runa ancestral grabada por mineros que conocían secretos que hoy nadie recuerda.',
    category: 'material', rarity: 'legendary', xp: 100,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: false
  },

  // ===== MATERIALES DE FABRICACIÓN =====
  forged_iron_ingot: {
    id: 'forged_iron_ingot', name: 'Lingote de hierro forjado', icon: '🔧',
    description: 'Lingote preparado para fabricar equipamiento básico. Es un componente de fabricación.',
    category: 'craft_material', rarity: 'uncommon', xp: 10,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  reinforced_fabric: {
    id: 'reinforced_fabric', name: 'Tela reforzada', icon: '🧵',
    description: 'Tela resistente tratada con fibras y cristal. Base de la armadura del minero.',
    category: 'craft_material', rarity: 'uncommon', xp: 12,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  tempered_plate: {
    id: 'tempered_plate', name: 'Placa templada', icon: '🛡️',
    description: 'Placa metálica endurecida para soportar golpes en las profundidades.',
    category: 'craft_material', rarity: 'rare', xp: 20,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  energy_gem: {
    id: 'energy_gem', name: 'Gema de energía', icon: '🔋',
    description: 'Concentrado de energía mineral utilizado para mejorar el equipo.',
    category: 'craft_material', rarity: 'rare', xp: 25,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },

  // ===== EQUIPAMIENTO FABRICABLE =====
  crafted_miner_helmet: {
    id: 'crafted_miner_helmet', name: 'Casco reforzado del minero', icon: '🪖',
    description: 'Casco fabricado para proteger la cabeza y conservar energía durante largas excavaciones.',
    category: 'equipment', rarity: 'uncommon', xp: 30,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  crafted_miner_shirt: {
    id: 'crafted_miner_shirt', name: 'Camisa reforzada del minero', icon: '👕',
    description: 'Una camisa reforzada con placas ligeras que protege contra los peligros del Abismo.',
    category: 'equipment', rarity: 'uncommon', xp: 30,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  crafted_miner_pants: {
    id: 'crafted_miner_pants', name: 'Pantalón reforzado del minero', icon: '👖',
    description: 'Pantalón reforzado diseñado para resistir derrumbes y facilitar la movilidad.',
    category: 'equipment', rarity: 'uncommon', xp: 30,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  crafted_miner_boots: {
    id: 'crafted_miner_boots', name: 'Botas reforzadas del minero', icon: '🥾',
    description: 'Botas pesadas que mejoran el paso y permiten una pequeña posibilidad de excavar un segundo cuadro.',
    category: 'equipment', rarity: 'uncommon', xp: 30,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  crafted_miner_sword: {
    id: 'crafted_miner_sword', name: 'Espada forjada del minero', icon: '⚔️',
    description: 'Espada poco común fabricada con metal forjado, ligera y confiable para las profundidades.',
    category: 'equipment', rarity: 'uncommon', xp: 35,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  }

};

const RARITY_ITEMS = {
  common: ['stone', 'iron_ore', 'ancient_coin', 'crystal_fragment', 'coal_chunk', 'copper_ore', 'rough_fiber', 'clay_piece'],
  uncommon: ['gold_pouch', 'ruby', 'sapphire', 'ancient_jar', 'copper_wire', 'miner_leather', 'blue_crystal', 'silver_nugget'],
  rare: ['lost_crown', 'ancient_scroll', 'iron_buried_sword', 'cursed_ring', 'obsidian_shard', 'moon_stone', 'emerald_shard'],
  epic: ['abyss_crystal', 'ancient_idol', 'black_diamond'],
  very_rare: ['ari_lost_diamond', 'abyss_steel', 'sun_crystal', 'ancient_core'],
  legendary: ['dead_king_crown', 'abyss_heart', 'first_miner_relic', 'emerald_of_change', 'void_shard', 'abyss_rune']
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
    if (equipment.abilities) item.abilities = { ...equipment.abilities };
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
