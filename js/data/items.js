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
    id: 'ruby', name: 'Rubí', icon: '♦️',
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
    description: 'Una corona antigua que puede evitar que algunas minas se activen.',
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
    description: 'Una espada antigua encontrada bajo la roca. Concede +8 de ataque.',
    category: 'equipment', rarity: 'rare', xp: 22,
    usable: false, equippable: true, consumable: false,
    sellable: true, droppable: true, stackable: false
  },

  cursed_ring: {
    id: 'cursed_ring', name: 'Anillo maldito', icon: '💍',
    description: 'Un extraño anillo que canaliza energía. Regenera +5 de energía cada 10 segundos.',
    category: 'equipment', rarity: 'rare', xp: 20,
    usable: false, equippable: true, consumable: false,
    sellable: true, droppable: true, stackable: false
  },

  abyss_crystal: {
    id: 'abyss_crystal', name: 'Cristal del Abismo', icon: '✧',
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
    id: 'black_diamond', name: 'Diamante negro', icon: '♢',
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
    id: 'abyss_heart', name: 'Corazón del Abismo', icon: '🖤',
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
   /* ===== OBJETO ESPECIAL: LA CICLA DEL MINERO PERDIDO ===== */
  lost_miner_bicycle: {
    id: 'lost_miner_bicycle',
    name: 'La Cicla del Minero Perdido',
    icon: '🚲',
    description: 'Cuenta la leyenda que un minero recorría las galerías sobre esta vieja cicla, a la que atribuía una fortuna extraordinaria. Un día, un derrumbe partió la montaña y sepultó al minero junto con su bicicleta. Nunca encontraron su cuerpo ni la cicla. Desde entonces permanece perdida en algún rincón del Abismo. Quien consiga encontrarla heredará parte de aquella suerte: recuperará +3 de vida cada 20 segundos.',
    category: 'equipment',
    rarity: 'very_rare',
    rarityLabel: 'Muy épica',
    xp: 200,
    usable: false,
    equippable: true,
    consumable: false,
    sellable: true,
    droppable: false,
    stackable: false
  },
  ari_lost_diamond: {
    id: 'ari_lost_diamond', name: 'Diamante Perdido de Ari', icon: '◆',
    description: 'Un diamante mítico que Ari escondió en algún rincón del Abismo y, con el paso de los años, olvidó por completo dónde lo dejó. Algunos mineros aseguran que solo aparece ante quien está destinado a encontrarlo.',
    category: 'treasure', rarity: 'very_rare', xp: 100,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: false
  },
  emerald_of_change: {
    id: 'emerald_of_change', name: 'Esmeralda del Cambio', icon: '◇',
    description: 'Una esmeralda legendaria nacida de una veta que cambia con el destino. Se dice que quien la encuentra nunca vuelve a ser exactamente el mismo minero.',
    category: 'treasure', rarity: 'legendary', xp: 200,
    usable: false, equippable: false, consumable: false,
    sellable: true, droppable: true, stackable: false
  },

  // ===== 16 NUEVOS OBJETOS =====
  coal_chunk: {
    id: 'coal_chunk', name: 'Trozo de carbón', icon: '🪵',
    description: 'Carbón común, útil para forjar y fundir materiales.',
    category: 'material', rarity: 'common', xp: 2,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  copper_ore: {
    id: 'copper_ore', name: 'Mineral de cobre', icon: '🔶',
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
    id: 'clay_piece', name: 'Fragmento de arcilla', icon: '🟧',
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
    id: 'silver_nugget', name: 'Pepita de plata', icon: '⬥⬥',
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
    id: 'void_shard', name: 'Fragmento del Vacío', icon: '🌑',
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
    id: 'forged_iron_ingot', name: 'Lingote de hierro forjado', icon: '⚒️',
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
    id: 'crafted_miner_helmet', name: 'Casco del Set del Minero del Abismo', icon: '🪖',
    description: 'Casco fabricado para proteger la cabeza y conservar energía durante largas excavaciones.',
    category: 'equipment', rarity: 'uncommon', xp: 30,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  crafted_miner_shirt: {
    id: 'crafted_miner_shirt', name: 'Camisa del Set del Minero del Abismo', icon: '👕',
    description: 'Una camisa reforzada con placas ligeras que protege contra los peligros del Abismo.',
    category: 'equipment', rarity: 'uncommon', xp: 30,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  crafted_miner_pants: {
    id: 'crafted_miner_pants', name: 'Pantalón del Set del Minero del Abismo', icon: '👖',
    description: 'Pantalón reforzado diseñado para resistir derrumbes y facilitar la movilidad.',
    category: 'equipment', rarity: 'uncommon', xp: 30,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  crafted_miner_boots: {
    id: 'crafted_miner_boots', name: 'Zapatos del Set del Minero del Abismo', icon: '🥾',
    description: 'Botas reforzadas que reducen en 1 la energía consumida por cada excavación.',
    category: 'equipment', rarity: 'uncommon', xp: 30,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  crafted_miner_sword: {
    id: 'crafted_miner_sword', name: 'Espada del Set del Minero del Abismo', icon: '⚔️',
    description: 'Espada poco común fabricada con metal forjado, ligera y confiable para las profundidades.',
    category: 'equipment', rarity: 'uncommon', xp: 35,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  }
,
/* ===== PIEZAS EXTRA DEL SET CRAFTEADO ===== */
  crafted_miner_ring: {
    id: 'crafted_miner_ring', name: 'Anillo del Set del Minero del Abismo', icon: '💍',
    description: 'Anillo forjado para canalizar energía. Regenera +5 de energía cada 10 segundos.',
    category: 'equipment', rarity: 'rare', xp: 40,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  crafted_miner_gloves: {
    id: 'crafted_miner_gloves', name: 'Guantes del Set del Minero del Abismo', icon: '🧤',
    description: 'Guantes reforzados que otorgan 8% de probabilidad de golpe crítico.',
    category: 'equipment', rarity: 'rare', xp: 30,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  crafted_miner_cloak: {
    id: 'crafted_miner_cloak', name: 'Capa del Set del Minero del Abismo', icon: '🧥',
    description: 'Capa oscura que aumenta en 8% la probabilidad de encontrar objetos.',
    category: 'equipment', rarity: 'epic', xp: 45,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },

/* ===== EQUIPO BÁSICO EXCLUSIVO DE LA MINA ===== */
  mine_basic_helmet: {
    id: 'mine_basic_helmet', name: 'Casco de veta', icon: '🪖',
    description: 'Casco gastado recuperado exclusivamente como botín de la mina.',
    category: 'equipment', rarity: 'common', xp: 12,
    usable: false, equippable: true, consumable: false,
    sellable: true, droppable: true, stackable: false
  },
  mine_basic_shirt: {
    id: 'mine_basic_shirt', name: 'Camisa de veta', icon: '🥋',
    description: 'Camisa de trabajo recuperada de antiguos mineros. Solo aparece como botín.',
    category: 'equipment', rarity: 'common', xp: 12,
    usable: false, equippable: true, consumable: false,
    sellable: true, droppable: true, stackable: false
  },
  mine_basic_pants: {
    id: 'mine_basic_pants', name: 'Pantalón de veta', icon: '👖',
    description: 'Pantalón resistente, pero muy gastado por el tiempo. Solo aparece en la mina.',
    category: 'equipment', rarity: 'common', xp: 12,
    usable: false, equippable: true, consumable: false,
    sellable: true, droppable: true, stackable: false
  },
  mine_basic_boots: {
    id: 'mine_basic_boots', name: 'Zapatos de veta', icon: '🥾',
    description: 'Calzado minero usado encontrado entre las rocas.',
    category: 'equipment', rarity: 'common', xp: 12,
    usable: false, equippable: true, consumable: false,
    sellable: true, droppable: true, stackable: false
  },
  /* ===== GEMA: AMATISTA ===== */
  amethyst: {
    id: 'amethyst',
    name: 'Amatista',
    icon: '🌌',
    description: 'Una gema violeta formada durante siglos en las grietas más profundas del Abismo. Los antiguos mineros creían que su color era una señal de que la montaña guardaba secretos que solo podían ser descubiertos por quien se atreviera a excavar más profundo.',
    category: 'sellable',
    rarity: 'rare',
    xp: 25,
    usable: false,
    equippable: false,
    consumable: false,
    sellable: true,
    droppable: true,
    stackable: true
  },
  /* ===== 10 NUEVOS MATERIALES DE CRAFTEO ===== */
  wood_ash: {
    id: 'wood_ash', name: 'Ceniza de madera', icon: '🪵',
    description: 'Restos de madera mineralizada usados para preparar mangos y mezclas.',
    category: 'craft_material', rarity: 'common', xp: 2,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  cave_silk: {
    id: 'cave_silk', name: 'Seda cavernaria', icon: '🕸️',
    description: 'Fibra fina y resistente obtenida de criaturas de las cavernas.',
    category: 'craft_material', rarity: 'uncommon', xp: 6,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  blood_ore: {
    id: 'blood_ore', name: 'Mineral carmesí', icon: '🩸',
    description: 'Mineral rojizo que conserva calor y tensión mágica.',
    category: 'craft_material', rarity: 'uncommon', xp: 7,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  runic_bone: {
    id: 'runic_bone', name: 'Hueso rúnico', icon: '🦴',
    description: 'Fragmento óseo grabado con símbolos antiguos.',
    category: 'craft_material', rarity: 'rare', xp: 14,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  ember_core: {
    id: 'ember_core', name: 'Núcleo de brasa', icon: '🔥',
    description: 'Núcleo caliente utilizado para canalizar fuerza vital.',
    category: 'craft_material', rarity: 'rare', xp: 18,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  frost_shard: {
    id: 'frost_shard', name: 'Esquirla de escarcha', icon: '❄️',
    description: 'Cristal frío capaz de conservar energía durante mucho tiempo.',
    category: 'craft_material', rarity: 'rare', xp: 18,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  titan_scale: {
    id: 'titan_scale', name: 'Escama de titán', icon: '🐉',
    description: 'Escama mineral extremadamente resistente, apreciada por los herreros.',
    category: 'craft_material', rarity: 'very_rare', xp: 40,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  void_thread: {
    id: 'void_thread', name: 'Hilo del Vacío', icon: '🕸️',
    description: 'Hilo oscuro que parece desaparecer bajo la luz.',
    category: 'craft_material', rarity: 'very_rare', xp: 45,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  royal_steel: {
    id: 'royal_steel', name: 'Acero real', icon: '⚙️',
    description: 'Metal noble usado en piezas de equipamiento de alto nivel.',
    category: 'craft_material', rarity: 'epic', xp: 60,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },
  star_essence: {
    id: 'star_essence', name: 'Esencia estelar', icon: '🌟',
    description: 'Esencia cristalizada de origen desconocido, muy difícil de encontrar.',
    category: 'craft_material', rarity: 'legendary', xp: 100,
    usable: false, equippable: false, consumable: false, sellable: true, droppable: true, stackable: true
  },

  /* ===== 6 AMULETOS ===== */
  amulet_heartstone: {
    id: 'amulet_heartstone', name: 'Amuleto del Corazón Profundo', icon: '❤️‍🔥',
    description: 'Al derrotar un enemigo recupera 5 HP.',
    category: 'equipment', rarity: 'rare', xp: 25,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  amulet_deep_reservoir: {
    id: 'amulet_deep_reservoir', name: 'Amuleto del Reservorio', icon: '🔋',
    description: 'Recupera 2 de energía cada vez que excavas.',
    category: 'equipment', rarity: 'rare', xp: 25,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  amulet_guardian_ward: {
    id: 'amulet_guardian_ward', name: 'Amuleto del Guardián', icon: '🛡️',
    description: 'Reduce en 8% el daño causado por peligros de la mina.',
    category: 'equipment', rarity: 'rare', xp: 25,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  amulet_hunter_eye: {
    id: 'amulet_hunter_eye', name: 'Amuleto del Cazador', icon: '👁️',
    description: 'Otorga 8% de probabilidad de golpe crítico.',
    category: 'equipment', rarity: 'rare', xp: 25,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  amulet_luck_eye: {
    id: 'amulet_luck_eye', name: 'Amuleto de la Fortuna', icon: '🍀',
    description: 'Otorga 2.5% de probabilidad adicional de hallar objetos raros o mejores.',
    category: 'equipment', rarity: 'very_rare', xp: 40,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  amulet_executioner: {
    id: 'amulet_executioner', name: 'Amuleto del Verdugo', icon: '☠️',
    description: 'Añade +5 de daño al calcular ataques.',
    category: 'equipment', rarity: 'epic', xp: 55,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },

  /* ===== PICOS COMO OBJETOS EQUIPABLES ===== */
  rusted_pickaxe: {
    id: 'rusted_pickaxe', name: 'Pico oxidado', icon: '⛏️',
    description: 'Herramienta inicial del minero.',
    category: 'tool', rarity: 'common', xp: 0,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  iron_pickaxe: {
    id: 'iron_pickaxe', name: 'Pico de hierro', icon: '⛏️',
    description: 'Pico comprado en la tienda, equilibrado para las primeras profundidades.',
    category: 'tool', rarity: 'uncommon', xp: 0,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  steel_pickaxe: {
    id: 'steel_pickaxe', name: 'Pico de acero', icon: '⛏️',
    description: 'Pico comercial de gran resistencia.',
    category: 'tool', rarity: 'rare', xp: 0,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  gold_pickaxe: {
    id: 'gold_pickaxe', name: 'Pico de oro', icon: '⛏️',
    description: 'Pico comercial rápido y potente.',
    category: 'tool', rarity: 'epic', xp: 0,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  diamond_pickaxe: {
    id: 'diamond_pickaxe', name: 'Pico de diamante', icon: '⛏️',
    description: 'Herramienta comercial de alto nivel.',
    category: 'tool', rarity: 'very_rare', xp: 0,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  abyss_pickaxe: {
    id: 'abyss_pickaxe', name: 'Pico del Abismo', icon: '⛏️',
    description: 'Pico comercial de máximo nivel.',
    category: 'tool', rarity: 'legendary', xp: 0,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  crafted_copper_pickaxe: {
    id: 'crafted_copper_pickaxe', name: 'Pico de cobre reforzado', icon: '⛏️',
    description: 'Pico fabricado con materiales comunes. Superior a los picos perdidos de la mina.',
    category: 'tool', rarity: 'rare', xp: 30,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  crafted_reinforced_pickaxe: {
    id: 'crafted_reinforced_pickaxe', name: 'Pico de hierro reforzado', icon: '⛏️',
    description: 'Pico fabricado de alto rendimiento con materiales fáciles de conseguir.',
    category: 'tool', rarity: 'epic', xp: 45,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  lost_depth_pickaxe: {
    id: 'lost_depth_pickaxe', name: 'Pico perdido de las Profundidades', icon: '⛏️',
    description: 'Pico raro recuperado dentro de la mina. Aparece usado: 20/40 de durabilidad.',
    category: 'tool', rarity: 'rare', xp: 35,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },
  lost_abyss_pickaxe: {
    id: 'lost_abyss_pickaxe', name: 'Pico perdido del Abismo', icon: '⛏️',
    description: 'Pico muy raro recuperado dentro de la mina. Aparece usado: 20/40 de durabilidad.',
    category: 'tool', rarity: 'very_rare', xp: 55,
    usable: false, equippable: true, consumable: false, sellable: true, droppable: true, stackable: false
  },

};


const RARITY_ITEMS = {
  common: ['stone', 'iron_ore', 'ancient_coin', 'crystal_fragment', 'coal_chunk', 'copper_ore', 'rough_fiber', 'clay_piece', 'mine_basic_helmet', 'mine_basic_shirt', 'mine_basic_pants', 'mine_basic_boots', 'wood_ash'],
  uncommon: ['gold_pouch', 'ruby', 'sapphire', 'ancient_jar', 'copper_wire', 'miner_leather', 'blue_crystal', 'silver_nugget', 'cave_silk', 'blood_ore'],
  rare: ['lost_crown', 'ancient_scroll', 'iron_buried_sword', 'cursed_ring', 'obsidian_shard', 'moon_stone', 'emerald_shard', 'runic_bone', 'ember_core', 'frost_shard', 'lost_depth_pickaxe', 'amethyst'],
  epic: ['abyss_crystal', 'ancient_idol', 'black_diamond', 'royal_steel'],
  very_rare: ['ari_lost_diamond', 'abyss_steel', 'sun_crystal', 'ancient_core', 'titan_scale', 'void_thread', 'lost_abyss_pickaxe', 'lost_miner_bicycle'],
  legendary: ['dead_king_crown', 'abyss_heart', 'first_miner_relic', 'emerald_of_change', 'void_shard', 'abyss_rune', 'star_essence']
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
    if (equipment.setId) item.setId = equipment.setId;
  }
  const pickaxeDefinition = typeof PICKAXES !== 'undefined'
    ? PICKAXES.find(p => p.id === item.id)
    : null;
  if (pickaxeDefinition) {
    /* Todo pico es un objeto de inventario equipable en el slot tool. */
    item.slot = 'tool';
    item.stats = item.stats || {};
    item.pickaxeData = { ...pickaxeDefinition };
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
