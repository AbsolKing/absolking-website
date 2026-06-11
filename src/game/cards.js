// Complete Ironclad card pool with StS mechanics

export const CARDS = {
  // Starter
  strike:      { name: 'Strike',        cost: 1, type: 'Attack', icon: 'bolt',    fx: { damage: 6 } },
  defend:      { name: 'Defend',        cost: 1, type: 'Skill',  icon: 'shield',  fx: { block: 5 } },
  bash:        { name: 'Bash',          cost: 2, type: 'Attack', icon: 'slam',    fx: { damage: 8, vulnerable: 2 } },
  
  // Common Attacks
  anger:       { name: 'Anger',         cost: 0, type: 'Attack', icon: 'fast',    fx: { damage: 6, addCopy: true } },
  bodyslam:    { name: 'Body Slam',     cost: 1, type: 'Attack', icon: 'deflect', fx: { damageBlock: true } },
  clothesline: { name: 'Clothesline',   cost: 2, type: 'Attack', icon: 'sweep',   fx: { damage: 12, weak: 2 } },
  heavyblade:  { name: 'Heavy Blade',   cost: 2, type: 'Attack', icon: 'rail',    fx: { damage: 14, strMult: 3 } },
  ironwave:    { name: 'Iron Wave',     cost: 1, type: 'Attack', icon: 'deflect', fx: { damage: 5, block: 5 } },
  pommelstrike:{ name: 'Pommel Strike', cost: 1, type: 'Attack', icon: 'bolt',    fx: { damage: 9, draw: 1 } },
  twinstrike:  { name: 'Twin Strike',   cost: 1, type: 'Attack', icon: 'fast',    fx: { damage: 5, hits: 2 } },
  cleave:      { name: 'Cleave',        cost: 1, type: 'Attack', icon: 'sweep',   fx: { damage: 8 } },
  
  // Uncommon Attacks
  uppercut:    { name: 'Uppercut',      cost: 2, type: 'Attack', icon: 'slam',    fx: { damage: 13, weak: 1, vulnerable: 1 } },
  wildstrike:  { name: 'Wild Strike',   cost: 1, type: 'Attack', icon: 'bolt',    fx: { damage: 12, addWound: true } },
  swordboomerang: { name: 'Sword Boomerang', cost: 1, type: 'Attack', icon: 'fast', fx: { damage: 3, hits: 3, random: true } },
  perfectedstrike: { name: 'Perfected Strike', cost: 2, type: 'Attack', icon: 'rail', fx: { damage: 6, strikeBonus: true } },
  thunderclap: { name: 'Thunderclap',   cost: 1, type: 'Attack', icon: 'burst',   fx: { damage: 4, vulnerable: 1 } },
  
  // Rare Attacks
  bludgeon:    { name: 'Bludgeon',      cost: 3, type: 'Attack', icon: 'slam',    fx: { damage: 32 } },
  immolate:    { name: 'Immolate',      cost: 2, type: 'Attack', icon: 'burst',   fx: { damage: 21, addBurn: 2 } },
  reaper:      { name: 'Reaper',        cost: 2, type: 'Attack', icon: 'sweep',   fx: { damage: 4, healMissing: true } },
  
  // Common Skills
  shrugitoff:  { name: 'Shrug It Off',  cost: 1, type: 'Skill',  icon: 'brace',   fx: { block: 8, draw: 1 } },
  armaments:   { name: 'Armaments',     cost: 1, type: 'Skill',  icon: 'chip',    fx: { block: 5, upgrade: true } },
  flex:        { name: 'Flex',          cost: 0, type: 'Skill',  icon: 'chip',    fx: { tempStrength: 2 } },
  truegrit:    { name: 'True Grit',     cost: 1, type: 'Skill',  icon: 'brace',   fx: { block: 7, exhaustRandom: true } },
  
  // Uncommon Skills
  battleTrance: { name: 'Battle Trance', cost: 0, type: 'Skill', icon: 'fast',   fx: { draw: 3, noDrawNext: true } },
  burningPact: { name: 'Burning Pact',  cost: 1, type: 'Skill', icon: 'chip',    fx: { exhaust: true, draw: 2 } },
  disarm:      { name: 'Disarm',        cost: 1, type: 'Skill', icon: 'deflect', fx: { enemyStrengthDown: 2 } },
  entrench:    { name: 'Entrench',      cost: 2, type: 'Skill', icon: 'shield',  fx: { blockDouble: true } },
  feelNoPain:  { name: 'Feel No Pain',  cost: 1, type: 'Power', icon: 'brace',   fx: { power: true, exhaustBlock: 3 } },
  flameBarrier:{ name: 'Flame Barrier', cost: 2, type: 'Skill', icon: 'burst',   fx: { block: 12, thorns: 4 } },
  ghostlyArmor:{ name: 'Ghostly Armor', cost: 1, type: 'Skill', icon: 'shield',  fx: { block: 10, ethereal: true } },
  
  // Rare Skills
  impervious:  { name: 'Impervious',    cost: 2, type: 'Skill', icon: 'shield',  fx: { block: 30, exhaust: true } },
  offering:    { name: 'Offering',      cost: 0, type: 'Skill', icon: 'chip',    fx: { loseHp: 6, energy: 2, draw: 5, exhaust: true } },
  
  // Common Powers
  inflame:     { name: 'Inflame',       cost: 1, type: 'Power', icon: 'chip',    fx: { strength: 2, power: true } },
  
  // Uncommon Powers
  combustion:  { name: 'Combustion',    cost: 1, type: 'Power', icon: 'burst',   fx: { power: true, loseHp: 1, damageAll: 2 } },
  darkEmbrace: { name: 'Dark Embrace',  cost: 2, type: 'Power', icon: 'brace',   fx: { power: true, exhaustDraw: true } },
  evolve:      { name: 'Evolve',        cost: 1, type: 'Power', icon: 'fast',    fx: { power: true, woundDraw: true } },
  mettalicize: { name: 'Metallicize',   cost: 1, type: 'Power', icon: 'shield',  fx: { power: true, endOfTurnBlock: 3 } },
  
  // Rare Powers
  barricade:   { name: 'Barricade',     cost: 3, type: 'Power', icon: 'shield',  fx: { power: true, blockPersist: true } },
  brutality:   { name: 'Brutality',     cost: 0, type: 'Power', icon: 'fast',    fx: { power: true, loseHp: 1, draw: 1 } },
  corruption:  { name: 'Corruption',    cost: 3, type: 'Power', icon: 'chip',    fx: { power: true, skillsFree: true, exhaustSkills: true } },
  demonForm:   { name: 'Demon Form',    cost: 3, type: 'Power', icon: 'burst',   fx: { power: true, strengthGain: 2 } },

  // Status cards — added to your deck/discard by enemy attacks or your own cards
  wound:       { name: 'Wound',         cost: -1, type: 'Status', icon: 'chip',   fx: { unplayable: true } },
  burn:        { name: 'Burn',          cost: -1, type: 'Status', icon: 'burst',  fx: { unplayable: true, endTurnDamage: 2 } },
};

export const STARTER_REWARDS = ['strike', 'strike', 'strike', 'defend', 'defend', 'bash'];

// Reward pool: everything in here is playable end-to-end by the engine.
export const REWARD_POOL = [
  // commons
  'anger', 'bodyslam', 'clothesline', 'heavyblade', 'ironwave',
  'pommelstrike', 'shrugitoff', 'twinstrike', 'cleave', 'flex', 'inflame',
  'thunderclap', 'truegrit', 'armaments',
  // uncommons
  'uppercut', 'wildstrike', 'swordboomerang', 'perfectedstrike', 'disarm',
  'entrench', 'flameBarrier', 'ghostlyArmor', 'battleTrance', 'burningPact',
  'feelNoPain', 'darkEmbrace', 'evolve', 'mettalicize',
  // rares (still in the same pool for now — frequency control is a future polish)
  'bludgeon', 'immolate', 'reaper', 'impervious', 'offering',
  'combustion', 'demonForm', 'barricade', 'brutality', 'corruption',
];

export const RARE_REWARDS = [];

export function cardDesc(id) {
  const card = CARDS[id];
  if (!card) return '';
  
  const f = card.fx;
  const tgt = card.target;
  const ALL = (tgt === 'all') ? ' to ALL enemies' : '';
  const p = [];

  if (f.unplayable) p.push('Unplayable.');
  if (f.endTurnDamage) p.push(`At end of turn, deal ${f.endTurnDamage} damage to yourself.`);
  
  // Attack effects
  if (f.damageBlock) {
    p.push('Deal damage equal to your Block.');
  } 
  else if (f.damage) {
    if (f.random && f.hits && f.hits > 1) {
      p.push(`Deal ${f.damage} damage to a random enemy ${f.hits} times.`);
    } else if (f.hits && f.hits > 1) {
      p.push(`Deal ${f.damage} damage ${f.hits} times${ALL}.`);
    } else {
      p.push(`Deal ${f.damage} damage${ALL}.`);
    }
  }
  
  if (f.strMult) p.push(`Strength affects this ${f.strMult}x.`);
  if (f.block) p.push(`Gain ${f.block} Block.`);
  
  // Debuffs (follow card's target)
  if (f.vulnerable) p.push(`Apply ${f.vulnerable} Vulnerable${ALL}.`);
  if (f.weak) p.push(`Apply ${f.weak} Weak${ALL}.`);
  if (f.frail) p.push(`Apply ${f.frail} Frail${ALL}.`);
  if (f.poison) p.push(`Apply ${f.poison} Poison${ALL}.`);
  
  // Buffs
  if (f.tempStrength) {
    p.push(`Gain ${f.tempStrength} Strength. Lose it at end of turn.`);
  } else if (f.strength) {
    p.push(`Gain ${f.strength} Strength.`);
  }
  
  if (f.thorns) p.push(`Gain ${f.thorns} Thorns.`);
  
  // Card manipulation
  if (f.addCopy) p.push('Add a copy of this card to your discard pile.');
  if (f.draw) p.push(`Draw ${f.draw} card(s).`);
  if (f.exhaust) p.push('Exhausts.');
  if (f.exhaustRandom) p.push('Exhaust a random card in your hand.');
  
  // Self damage and energy
  if (f.loseHp) p.push(`Lose ${f.loseHp} HP.`);
  if (f.energy) p.push(`Gain ${f.energy} Energy.`);
  
  // Block manipulation
  if (f.blockDouble) p.push('Double your Block.');
  if (f.blockPersist) p.push('Block is not removed at the start of your turn.');
  if (f.endOfTurnBlock) p.push(`At the end of your turn, gain ${f.endOfTurnBlock} Block.`);
  
  // Special card effects
  if (f.addWound) p.push('Add a Wound to your discard pile.');
  if (f.addBurn) p.push(`Add ${f.addBurn} Burn(s) to your discard pile.`);
  if (f.healMissing) p.push('Heal HP equal to unblocked damage dealt.');
  if (f.strikeBonus) p.push(`Deals an extra ${f.strikeBonus} damage for each Strike in your deck.`);
  if (f.enemyStrengthDown) p.push(`Reduce target enemy's Strength by ${f.enemyStrengthDown}.`);
  if (f.upgrade) p.push('Upgrade a random card in your hand for the rest of combat.');
  if (f.noDrawNext) p.push('You cannot draw additional cards this turn.');
  if (f.ethereal) p.push('Ethereal. (Exhausts at end of turn if still in hand.)');
  if (f.damageAll) p.push(`Deal ${f.damageAll} damage to ALL enemies.`);
  
  // Power-specific descriptions (override generic ones)
  if (f.power) {
    switch(id) {
      case 'combustion':
        p.length = 0;
        p.push('At the end of your turn, lose 1 HP and deal 2 damage to ALL enemies.');
        break;
      case 'mettalicize':
        p.length = 0;
        p.push('At the end of your turn, gain 3 Block.');
        break;
      case 'demonForm':
        p.length = 0;
        p.push('At the start of your turn, gain 2 Strength.');
        break;
      case 'brutality':
        p.length = 0;
        p.push('At the start of your turn, lose 1 HP and draw 1 card.');
        break;
      case 'barricade':
        p.length = 0;
        p.push('Block is not removed at the start of your turn.');
        break;
      case 'corruption':
        p.length = 0;
        p.push('Skills cost 0. Whenever you play a Skill, Exhaust it.');
        break;
      case 'darkEmbrace':
        p.length = 0;
        p.push('Whenever a card is Exhausted, draw 1 card.');
        break;
      case 'evolve':
        p.length = 0;
        p.push('Whenever you draw a Status card, draw 1 card.');
        break;
      case 'feelNoPain':
        p.length = 0;
        p.push('Whenever a card is Exhausted, gain 3 Block.');
        break;
      case 'inflame':
        p.length = 0;
        p.push('Gain 2 Strength.');
        break;
    }
  }
  
  if (p.length === 0) p.push('?');
  return p.join(' ');
}

/* ----------------------------- Targets ----------------------------- */
// Tells the UI which cards need to be dragged onto an enemy, hit all enemies,
// or are self-targeted (no drag required). Falls back to 'self' for cards
// without damage.

const TARGETS = {
  // single-target attacks
  strike:'enemy', bash:'enemy', anger:'enemy', bodyslam:'enemy',
  clothesline:'enemy', heavyblade:'enemy', ironwave:'enemy',
  pommelstrike:'enemy', twinstrike:'enemy', uppercut:'enemy',
  wildstrike:'enemy', perfectedstrike:'enemy', bludgeon:'enemy',
  disarm:'enemy',
  // hits-all attacks
  cleave:'all', thunderclap:'all', immolate:'all', reaper:'all',
  // random multi-hit
  swordboomerang:'all', // engine reads fx.random and picks per-hit
  // self / no target
  defend:'self', shrugitoff:'self', armaments:'self', flex:'self',
  truegrit:'self', battleTrance:'self', burningPact:'self', entrench:'self',
  feelNoPain:'self', flameBarrier:'self', ghostlyArmor:'self',
  impervious:'self', offering:'self', inflame:'self', combustion:'self',
  darkEmbrace:'self', evolve:'self', mettalicize:'self', barricade:'self',
  brutality:'self', corruption:'self', demonForm:'self',
  // status (unplayable, can't be dragged anyway)
  wound:'self', burn:'self',
};
Object.entries(TARGETS).forEach(([id, t]) => { if (CARDS[id]) CARDS[id].target = t; });

/* ----------------------------- Upgrades ----------------------------- */
// Each entry can override `cost` and/or merge `fx`. The expansion below
// generates an `<id>+` variant of every base card in this map.

export const UPGRADES = {
  // commons
  strike:       { fx: { damage: 9 } },
  defend:       { fx: { block: 8 } },
  bash:         { fx: { damage: 10, vulnerable: 3 } },
  anger:        { fx: { damage: 8 } },
  bodyslam:     { cost: 0 },
  clothesline:  { fx: { damage: 14, weak: 3 } },
  heavyblade:   { fx: { strMult: 5 } },
  ironwave:     { fx: { damage: 7, block: 7 } },
  pommelstrike: { fx: { damage: 10, draw: 2 } },
  shrugitoff:   { fx: { block: 11 } },
  twinstrike:   { fx: { damage: 7 } },
  cleave:       { fx: { damage: 11 } },
  flex:         { fx: { tempStrength: 4 } },
  inflame:      { fx: { strength: 3 } },
  thunderclap:  { fx: { damage: 7 } },
  truegrit:     { fx: { block: 9 } },
  armaments:    { fx: { block: 5, upgradeAll: true, upgrade: false } },
  // uncommons
  uppercut:        { fx: { weak: 2, vulnerable: 2 } },
  disarm:          { fx: { enemyStrengthDown: 3 } },
  wildstrike:      { fx: { damage: 17 } },
  swordboomerang:  { fx: { hits: 4 } },
  perfectedstrike: { fx: { strikeBonus: 3 } },
  entrench:        { cost: 1 },
  flameBarrier:    { fx: { block: 16, thorns: 6 } },
  ghostlyArmor:    { fx: { block: 13 } },
  battleTrance:    { fx: { draw: 4 } },
  burningPact:     { fx: { draw: 3 } },
  feelNoPain:      { fx: { exhaustBlock: 4 } },
  darkEmbrace:     { cost: 1 },
  evolve:          { fx: { woundDraw: 2 } },
  mettalicize:     { fx: { endOfTurnBlock: 4 } },
  // rares
  bludgeon:        { fx: { damage: 42 } },
  immolate:        { fx: { damage: 28 } },
  reaper:          { fx: { damage: 5 } },
  impervious:      { fx: { block: 40 } },
  barricade:       { cost: 2 },
  corruption:      { cost: 2 },
  demonForm:       { fx: { strengthGain: 3 } },
};

Object.keys(UPGRADES).forEach((baseId) => {
  const base = CARDS[baseId];
  if (!base) return;
  const up = UPGRADES[baseId];
  CARDS[baseId + '+'] = {
    ...base,
    name: base.name + '+',
    cost: up.cost != null ? up.cost : base.cost,
    fx: up.fx ? { ...base.fx, ...up.fx } : { ...base.fx },
    upgraded: true,
  };
});

export function isUpgraded(id) { return id.endsWith('+'); }
export function isUpgradable(id) { return !isUpgraded(id) && !!UPGRADES[id]; }
