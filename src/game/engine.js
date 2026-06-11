// Framework-agnostic engine. Multi-enemy combat with the full effects bag
// (weak, vulnerable, frail, poison, thorns, intangible, regenerate), Powers
// stored on player (mettalicize, combustion, demonForm, brutality, barricade,
// darkEmbrace, feelNoPain, evolve, corruption), status cards (Wound, Burn),
// ethereal, mid-combat upgrades, random targeting, deck-scanning, etc.
// Every function returns NEW state — no mutation, no timers, no DOM.

import { CARDS, isUpgradable } from './cards.js';

const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ----------------------------- Status effects ----------------------------- */

export const applyEffect = (target, effect, amount) => {
  if (!amount) return target;
  const effects = { ...(target.effects || {}) };
  effects[effect] = (effects[effect] || 0) + amount;
  return { ...target, effects };
};

export const reduceEffects = (target) => {
  const effects = { ...(target.effects || {}) };
  ['weak', 'vulnerable', 'frail', 'intangible', 'regenerate'].forEach((k) => {
    if (effects[k] > 0) effects[k]--;
  });
  return { ...target, effects };
};

export const calculateDamage = (base, attacker, defender) => {
  let dmg = base + (attacker.strength || 0);
  if (attacker.effects?.weak > 0) dmg = Math.floor(dmg * 0.75);
  if (defender.effects?.vulnerable > 0) dmg = Math.floor(dmg * 1.5);
  return Math.max(0, dmg);
};

export const calculateBlock = (base, target) => {
  let block = base;
  if (target.effects?.frail > 0) block = Math.floor(block * 0.75);
  return Math.max(0, block);
};

// Returns { target, thornsTriggered } after applying damage through block.
export const applyDamage = (target, damage) => {
  let { block = 0, hp, effects } = target;
  let remaining = damage;
  if (effects?.intangible > 0) remaining = Math.min(1, remaining);
  const blockBefore = block;
  if (block > 0) {
    const absorb = Math.min(block, remaining);
    block -= absorb;
    remaining -= absorb;
  }
  const thornsTriggered = remaining > 0 && effects?.thorns > 0 ? effects.thorns : 0;
  return {
    target: { ...target, block, hp: Math.max(0, hp - remaining) },
    thornsTriggered,
    unblocked: remaining,
    blockBefore,
  };
};

export const tickPoison = (target) => {
  const p = target.effects?.poison || 0;
  if (p <= 0) return { target, damage: 0 };
  const hp = Math.max(0, target.hp - p);
  return {
    target: { ...target, hp, effects: { ...target.effects, poison: p - 1 } },
    damage: p,
  };
};

/* --------------------------------- Map ----------------------------------- */

export function buildMap() {
  const rows = [[{ type: 'combat', row: 0, i: 0 }]];

  for (let r = 1; r < 7; r++) {
    const n = rint(2, 3);
    const row = [];
    for (let i = 0; i < n; i++) {
      const roll = Math.random();
      let t = 'combat';
      if (r === 1)      t = roll < 0.15 ? 'elite' : 'combat';
      else if (r === 2) t = roll < 0.10 ? 'rest'  : roll < 0.35 ? 'elite' : 'combat';
      else if (r === 3) t = roll < 0.15 ? 'rest'  : roll < 0.40 ? 'elite' : 'combat';
      else if (r === 4) t = roll < 0.20 ? 'rest'  : roll < 0.50 ? 'elite' : 'combat';
      else if (r === 5) t = roll < 0.10 ? 'rest'  : roll < 0.35 ? 'elite' : 'combat';
      else if (r === 6) t = roll < 0.30 ? 'rest'  : 'combat';
      row.push({ type: t, row: r, i });
    }
    rows.push(row);
  }
  rows.push([{ type: 'boss', row: 7, i: 0 }]);

  rows.forEach((row, r) => {
    if (r === rows.length - 1) return;
    const next = rows[r + 1];
    row.forEach((node) => {
      node.next = [];
      const idxs = next.map((_, j) => j);
      const k = rint(1, Math.min(2, idxs.length));
      for (let p = 0; p < k; p++) {
        const pick = Math.floor(Math.random() * idxs.length);
        node.next.push(idxs[pick]);
        idxs.splice(pick, 1);
      }
    });
    next.forEach((_, j) => {
      if (!row.some((n) => n.next.includes(j))) {
        row[Math.floor(Math.random() * row.length)].next.push(j);
      }
    });
  });
  return rows;
}

export function newRun() {
  return {
    hp: 80, maxHp: 80,
    gold: 99, act: 1, sector: 1,
    deck: ['strike','strike','strike','strike','strike','defend','defend','defend','defend','bash'],
    relics: ['burningblood'], potions: [],
    map: buildMap(),
    curRow: -1, curIdx: null,
  };
}

export function reachable(run) {
  const m = run.map;
  if (run.curRow < 0) return m[0].map((_, i) => ({ row: 0, i }));
  return m[run.curRow][run.curIdx].next.map((i) => ({ row: run.curRow + 1, i }));
}

/* -------------------------------- Combat --------------------------------- */

function makeEnemyEntity(def, id) {
  const ehp = Array.isArray(def.hp) ? rint(def.hp[0], def.hp[1]) : def.hp;
  return {
    id, art: def.art, name: def.name,
    hp: ehp, maxHp: ehp,
    block: 0, strength: 0,
    effects: {},
    moves: def.moves, moveIdx: 0, intent: null,
  };
}

function pickIntent(enemy) {
  if (enemy.hp <= 0) return enemy;
  const move = enemy.moves[enemy.moveIdx % enemy.moves.length];
  // Note: no damage baked in here. The UI computes displayed damage live via
  // intentDamage() so the number reacts to Weak/Vulnerable/Strength, like StS.
  return { ...enemy, intent: { ...move }, moveIdx: enemy.moveIdx + 1 };
}
const pickIntents = (c) => ({ ...c, enemies: c.enemies.map(pickIntent) });

// Pure draw helper — does not trigger evolve (caller can layer that on).
function drawCardsRaw(state, n) {
  let draw = [...state.draw];
  let hand = [...state.hand];
  let discard = [...state.discard];
  const drawnIds = [];
  for (let i = 0; i < n; i++) {
    if (draw.length === 0 && discard.length === 0) break;
    if (draw.length === 0) { draw = shuffle(discard); discard = []; }
    const id = draw.pop();
    hand.push(id);
    drawnIds.push(id);
  }
  return { draw, hand, discard, drawnIds };
}

// Evolve-aware draw: every Status drawn → +N extra cards (N = evolve stacks).
function drawWithEvolve(state, n) {
  let { draw, hand, discard, player } = state;
  let queue = n;
  while (queue > 0) {
    const r = drawCardsRaw({ draw, hand, discard }, queue);
    draw = r.draw; hand = r.hand; discard = r.discard;
    const ev = player.powers?.evolve || 0;
    queue = 0;
    if (ev > 0 && r.drawnIds.length) {
      const statuses = r.drawnIds.filter((id) => CARDS[id]?.type === 'Status').length;
      queue = statuses * ev;
    }
  }
  return { ...state, draw, hand, discard };
}

// Apply on-exhaust power triggers (Feel No Pain, Dark Embrace).
function onExhaust(state, events) {
  let s = state;
  const fnp = s.player.powers?.feelNoPain || 0;
  if (fnp > 0) {
    const blk = calculateBlock(3 * fnp, s.player);
    s = { ...s, player: { ...s.player, block: s.player.block + blk } };
    events.push({ t: 'block', target: 'player', v: blk, type: 'feelNoPain' });
  }
  const de = s.player.powers?.darkEmbrace || 0;
  if (de > 0 && !s.noDrawThisTurn) {
    const r = drawCardsRaw(s, de);
    s = { ...s, draw: r.draw, hand: r.hand, discard: r.discard };
    if (r.drawnIds.length) events.push({ t: 'draw', v: r.drawnIds.length });
  }
  return s;
}

export function startTurn(c) {
  let player = { ...c.player, effects: { ...c.player.effects }, powers: { ...c.player.powers } };

  // Block reset (unless Barricade keeps it)
  if (!(player.powers?.barricade > 0)) {
    player = { ...player, block: 0 };
  }

  // Demon Form: permanent strength gain each turn
  const demon = player.powers?.demonForm || 0;
  if (demon > 0) player.strength = (player.strength || 0) + demon * 2;

  // Brutality: lose 1 HP per stack, draw 1 per stack
  const brut = player.powers?.brutality || 0;
  if (brut > 0) player.hp = Math.max(0, player.hp - brut);

  let newC = {
    ...c,
    player,
    energy: c.maxEnergy,
    phase: 'player',
    playedPowerThisTurn: false,
    noDrawThisTurn: false,
    events: [],
  };

  // Poison tick on player
  if (newC.player.effects?.poison > 0) {
    const r = tickPoison(newC.player);
    newC.player = r.target;
    if (r.damage > 0) newC.events.push({ t: 'damage', target: 'player', v: r.damage, type: 'poison' });
  }

  // Brutality draws (after poison so hp can fall first)
  if (brut > 0) {
    newC = drawWithEvolve(newC, brut);
    newC.events.push({ t: 'draw', v: brut, type: 'brutality' });
  }

  // Standard 5-card draw
  newC = drawWithEvolve(newC, 5);

  // Queued relic draws (Centennial Puzzle triggered during enemy phase)
  if (newC.pendingDraw > 0) {
    newC = drawWithEvolve(newC, newC.pendingDraw);
    newC.events.push({ t: 'draw', v: newC.pendingDraw, type: 'puzzle' });
    newC = { ...newC, pendingDraw: 0 };
  }

  // Death check (brutality + poison could kill)
  if (newC.player.hp <= 0) {
    return { ...newC, over: true, won: false, phase: 'lost' };
  }
  return newC;
}

export function startCombat(run, encounter, opts = {}) {
  const enemies = encounter.map((def, idx) => makeEnemyEntity(def, idx));
  let c = {
    isBoss: !!opts.isBoss,
    isElite: !!opts.isElite,
    relics: [...(run.relics || [])],
    attacksPlayed: 0,
    akabekoUsed: false,
    puzzleUsed: false,
    pendingDraw: 0,
    player: {
      hp: run.hp, maxHp: run.maxHp,
      block: 0, strength: 0,
      tempStrength: 0,
      effects: {},
      powers: {},
    },
    enemies,
    energy: 3, maxEnergy: 3,
    draw: shuffle(run.deck),
    hand: [], discard: [], exhaust: [],
    phase: 'player', over: false, won: false,
    events: [], seq: 0,
    playedPowerThisTurn: false,
    noDrawThisTurn: false,
  };
  c = pickIntents(c);
  c = startTurn(c);
  c = applyCombatStartRelics(c);
  return c;
}

// Combat-start relic effects. Runs AFTER the first startTurn so the block
// reset / initial draw don't wipe them. Anchor block then survives exactly
// through the first enemy turn (reset happens at the start of YOUR turn).
function applyCombatStartRelics(c) {
  const r = c.relics || [];
  let player = { ...c.player, effects: { ...c.player.effects } };
  let energy = c.energy;
  const events = [...c.events];

  if (r.includes('vajra')) {
    player.strength = (player.strength || 0) + 1;
    events.push({ t: 'buff', target: 'player', v: 1, type: 'strength' });
  }
  if (r.includes('anchor')) {
    player.block += 10;
    events.push({ t: 'block', target: 'player', v: 10 });
  }
  if (r.includes('bloodvial')) {
    player.hp = Math.min(player.maxHp, player.hp + 2);
    events.push({ t: 'heal', target: 'player', v: 2 });
  }
  if (r.includes('bronzescales')) {
    player = applyEffect(player, 'thorns', 3);
  }
  if (r.includes('lantern')) energy += 1;

  let state = { ...c, player, energy, events };
  if (r.includes('bagofprep')) state = drawWithEvolve(state, 2);
  return state;
}

function targetsFor(card, c, targetIdx) {
  const t = card.target || (card.fx.damage || card.fx.damageBlock ? 'enemy' : 'self');
  if (t === 'self') return [];
  if (t === 'all') return c.enemies.map((e, i) => (e.hp > 0 ? i : null)).filter((i) => i !== null);
  if (t === 'enemy') {
    if (targetIdx == null || !c.enemies[targetIdx] || c.enemies[targetIdx].hp <= 0) {
      const fb = c.enemies.findIndex((e) => e.hp > 0);
      return fb >= 0 ? [fb] : [];
    }
    return [targetIdx];
  }
  return [];
}

export function playCard(c, idx, targetIdx = null) {
  const cardId = c.hand[idx];
  const card = CARDS[cardId];
  if (!card || c.phase !== 'player' || c.over) return c;
  if (card.fx.unplayable) return c;

  // Corruption: skills cost 0 and exhaust.
  const isSkill = card.type === 'Skill';
  const corrupted = isSkill && (c.player.powers?.corruption > 0);
  const effectiveCost = corrupted ? 0 : card.cost;
  if (effectiveCost > c.energy) return c;
  if (card.type === 'Power' && c.playedPowerThisTurn && !card.canPlayMultiple) return c;

  const fx = card.fx;
  const tgts = targetsFor(card, c, targetIdx);
  const cardTarget = card.target || (fx.damage || fx.damageBlock ? 'enemy' : 'self');

  // Mutable locals
  let player = { ...c.player, effects: { ...c.player.effects }, powers: { ...c.player.powers } };
  let enemies = c.enemies.map((e) => ({ ...e, effects: { ...e.effects } }));
  let hand = [...c.hand]; hand.splice(idx, 1);
  let draw = [...c.draw];
  let discard = [...c.discard];
  let exhaust = [...c.exhaust];
  let energy = c.energy - effectiveCost;
  const events = [];
  const playedPowerThisTurn = c.playedPowerThisTurn || card.type === 'Power';

  // Block gain
  if (fx.block) {
    const block = calculateBlock(fx.block, player);
    player.block += block;
    events.push({ t: 'block', target: 'player', v: block });
  }
  // Block double (Entrench)
  if (fx.blockDouble) {
    const before = player.block;
    player.block = before * 2;
    if (before > 0) events.push({ t: 'block', target: 'player', v: before });
  }

  // Strength
  if (fx.strength) {
    player.strength = (player.strength || 0) + fx.strength;
    events.push({ t: 'buff', target: 'player', v: fx.strength, type: 'strength' });
  }
  if (fx.tempStrength) {
    player.strength = (player.strength || 0) + fx.tempStrength;
    player.tempStrength = (player.tempStrength || 0) + fx.tempStrength;
    events.push({ t: 'buff', target: 'player', v: fx.tempStrength, type: 'strength_temp' });
  }
  // Self thorns (Flame Barrier)
  if (fx.thorns) {
    player = applyEffect(player, 'thorns', fx.thorns);
    events.push({ t: 'buff', target: 'player', v: fx.thorns, type: 'thorns' });
  }

  // Relic context for this card
  const relics = c.relics || [];
  const isAttackCard = card.type === 'Attack';
  const attacksPlayed = (c.attacksPlayed || 0) + (isAttackCard ? 1 : 0);
  const akabekoBonus = isAttackCard && relics.includes('akabeko') && !c.akabekoUsed ? 8 : 0;
  const strikeDummyBonus = isAttackCard && relics.includes('strikedummy')
    && (card.name || '').toLowerCase().includes('strike') ? 3 : 0;
  const penNibDouble = isAttackCard && relics.includes('pennib') && attacksPlayed % 10 === 0;

  // Damage
  if (fx.damage || fx.damageBlock || fx.damageAll) {
    const baseHits = fx.hits || 1;

    const damageOne = (enemyIdx, hits) => {
      let enemy = enemies[enemyIdx];
      for (let h = 0; h < hits; h++) {
        if (enemy.hp <= 0) break;
        let baseDmg = fx.damageBlock ? player.block : (fx.damage || 0);
        if (fx.strikeBonus) {
          const allCards = [...draw, ...hand, ...discard, ...exhaust];
          const strikes = allCards.filter((id) => (CARDS[id]?.name || '').toLowerCase().includes('strike')).length;
          baseDmg += strikes * fx.strikeBonus;
        }
        baseDmg += akabekoBonus + strikeDummyBonus;
        let dmg = baseDmg + (player.strength || 0) * (fx.strMult || 1);
        if (player.effects?.weak > 0)    dmg = Math.floor(dmg * 0.75);
        if (enemy.effects?.vulnerable > 0) dmg = Math.floor(dmg * 1.5);
        if (penNibDouble) dmg *= 2;
        dmg = Math.max(0, dmg);
        const r = applyDamage(enemy, dmg);
        enemy = r.target;
        events.push({ t: 'damage', target: 'enemy', enemyIdx, v: dmg });
        // Reaper: heal from unblocked damage dealt
        if (fx.healMissing && r.unblocked > 0) {
          player.hp = Math.min(player.maxHp, player.hp + r.unblocked);
          events.push({ t: 'heal', target: 'player', v: r.unblocked });
        }
        // Thorns hit back on the attacker (player)
        if (r.thornsTriggered > 0) {
          const pr = applyDamage(player, r.thornsTriggered);
          player = pr.target;
          events.push({ t: 'damage', target: 'player', v: r.thornsTriggered, type: 'thorns' });
        }
      }
      enemies[enemyIdx] = enemy;
    };

    if (fx.random) {
      // Sword Boomerang: each hit picks a fresh random living enemy.
      const totalHits = fx.hits || 1;
      for (let h = 0; h < totalHits; h++) {
        const living = enemies.map((e, i) => (e.hp > 0 ? i : -1)).filter((i) => i >= 0);
        if (living.length === 0) break;
        const ti = living[Math.floor(Math.random() * living.length)];
        damageOne(ti, 1);
      }
    } else if (fx.damageAll && !(fx.damage || fx.damageBlock)) {
      // Pure AOE (no per-card primary damage) — e.g. fx.damageAll on Combustion power proc.
      // (Powers proc this in endTurn instead.)
    } else {
      tgts.forEach((ei) => damageOne(ei, baseHits));
    }
    events.push({ t: 'lunge', target: 'player' });
  }

  // Debuff application (follows card target)
  const applyToTargets = (effect, amount) => {
    if (!amount) return;
    tgts.forEach((ei) => {
      enemies[ei] = applyEffect(enemies[ei], effect, amount);
      events.push({ t: 'debuff', target: 'enemy', enemyIdx: ei, v: amount, type: effect });
    });
  };
  applyToTargets('weak',       fx.weak);
  applyToTargets('vulnerable', fx.vulnerable);
  applyToTargets('frail',      fx.frail);
  applyToTargets('poison',     fx.poison);

  // Disarm
  if (fx.enemyStrengthDown && cardTarget === 'enemy' && tgts.length) {
    const ei = tgts[0];
    enemies[ei] = { ...enemies[ei], strength: Math.max(0, (enemies[ei].strength || 0) - fx.enemyStrengthDown) };
    events.push({ t: 'debuff', target: 'enemy', enemyIdx: ei, v: fx.enemyStrengthDown, type: 'strengthDown' });
  }

  // Status-card pollution from your own cards
  if (fx.addWound) discard.push('wound');
  if (fx.addBurn)  for (let k = 0; k < fx.addBurn; k++) discard.push('burn');

  // Mid-combat upgrade — single random hand card or all hand cards
  if (fx.upgrade || fx.upgradeAll) {
    if (fx.upgradeAll) {
      hand = hand.map((id) => (isUpgradable(id) ? id + '+' : id));
    } else {
      const cands = hand.map((id, i) => (isUpgradable(id) ? i : -1)).filter((i) => i >= 0);
      if (cands.length > 0) {
        const pick = cands[Math.floor(Math.random() * cands.length)];
        hand[pick] = hand[pick] + '+';
      }
    }
  }

  // Energy gain
  if (fx.energy) energy += fx.energy;
  // HP loss
  if (fx.loseHp) {
    player = { ...player, hp: Math.max(0, player.hp - fx.loseHp) };
    events.push({ t: 'damage', target: 'player', v: fx.loseHp, type: 'self' });
  }

  // Power persistence (track stack count under cardId)
  if (card.type === 'Power') {
    const key = cardId.replace(/\+$/, ''); // upgraded variant stacks under same key
    player.powers = { ...player.powers, [key]: (player.powers[key] || 0) + 1 };
  }

  // Draw — guarded by noDrawThisTurn (Battle Trance) for non-base draws
  let state = { player, draw, hand, discard, exhaust };
  if (fx.draw && !c.noDrawThisTurn) {
    const before = state.hand.length;
    state = drawWithEvolve(state, fx.draw);
    const actually = state.hand.length - before;
    if (actually > 0) events.push({ t: 'draw', v: actually });
  }
  if (fx.noDrawNext) {
    // Battle Trance sets the flag AFTER its own draws, so its draws aren't blocked.
    // We propagate via the returned combat below.
  }

  // Anger: copy this card to discard
  if (fx.addCopy) state = { ...state, discard: [...state.discard, cardId] };

  // Exhaust a random hand card (True Grit)
  if (fx.exhaustRandom && state.hand.length > 0) {
    const pick = Math.floor(Math.random() * state.hand.length);
    const exId = state.hand[pick];
    const newHand = [...state.hand]; newHand.splice(pick, 1);
    state = { ...state, hand: newHand, exhaust: [...state.exhaust, exId] };
    state = onExhaust(state, events);
  }

  // Card destination (this card itself)
  const shouldExhaust = fx.exhaust || corrupted || fx.power; // powers go to neither pile in StS;
                                                             // but visually they're removed — keep them OUT of discard.
  if (card.type === 'Power') {
    // Powers stay tracked via player.powers — no discard, no exhaust pile entry.
  } else if (shouldExhaust) {
    state = { ...state, exhaust: [...state.exhaust, cardId] };
    state = onExhaust(state, events);
  } else {
    state = { ...state, discard: [...state.discard, cardId] };
  }

  // Assemble result
  let newC = {
    ...c,
    player: state.player,
    enemies,
    hand: state.hand,
    draw: state.draw,
    discard: state.discard,
    exhaust: state.exhaust,
    energy,
    playedPowerThisTurn,
    noDrawThisTurn: c.noDrawThisTurn || !!fx.noDrawNext,
    attacksPlayed,
    akabekoUsed: c.akabekoUsed || isAttackCard,
    events,
    seq: c.seq + 1,
  };

  // Centennial Puzzle: first HP loss this combat → draw 3 (thorns/self-damage count).
  if (!newC.puzzleUsed && relics.includes('puzzle') && newC.player.hp < c.player.hp) {
    newC = { ...newC, puzzleUsed: true };
    if (!newC.noDrawThisTurn) {
      const before = newC.hand.length;
      newC = drawWithEvolve(newC, 3);
      const got = newC.hand.length - before;
      if (got > 0) events.push({ t: 'draw', v: got, type: 'puzzle' });
    }
  }

  if (newC.player.hp <= 0) return { ...newC, over: true, won: false, phase: 'lost' };
  if (newC.enemies.every((e) => e.hp <= 0)) return { ...newC, over: true, won: true, phase: 'won' };
  return newC;
}

export function endTurn(c) {
  if (c.phase !== 'player' || c.over) return c;

  let player = { ...c.player, effects: { ...c.player.effects }, powers: { ...c.player.powers } };
  let enemies = c.enemies.map((e) => ({ ...e, effects: { ...e.effects } }));
  let hand = [...c.hand];
  let discard = [...c.discard];
  let exhaust = [...c.exhaust];
  let draw = [...c.draw];
  const events = [];
  const hpAtStart = player.hp;

  // Orichalcum: no block at end of turn → 6 block (relics ignore Frail)
  if ((c.relics || []).includes('orichalcum') && player.block === 0) {
    player.block += 6;
    events.push({ t: 'block', target: 'player', v: 6, type: 'orichalcum' });
  }

  // Mettalicize: end-of-turn block
  const mett = player.powers?.mettalicize || 0;
  if (mett > 0) {
    const blk = calculateBlock(3 * mett, player);
    player.block += blk;
    events.push({ t: 'block', target: 'player', v: blk, type: 'mettalicize' });
  }

  // Combustion: lose 1 HP per stack, deal 2 per stack to ALL enemies
  const comb = player.powers?.combustion || 0;
  if (comb > 0) {
    const selfDmg = applyDamage(player, comb);
    player = selfDmg.target;
    events.push({ t: 'damage', target: 'player', v: comb, type: 'combustion' });
    enemies = enemies.map((e, ei) => {
      if (e.hp <= 0) return e;
      const r = applyDamage(e, 2 * comb);
      events.push({ t: 'damage', target: 'enemy', enemyIdx: ei, v: 2 * comb, type: 'combustion' });
      return r.target;
    });
  }

  // Burn damage from unplayed Burns in hand — AFTER block gains, so
  // Mettalicize/Orichalcum block absorbs it, like StS.
  const burns = hand.filter((id) => id === 'burn').length;
  if (burns > 0) {
    const dmg = burns * 2;
    const r = applyDamage(player, dmg);
    player = r.target;
    events.push({ t: 'damage', target: 'player', v: dmg, type: 'burn' });
  }

  // Ethereal cards in hand → exhaust + trigger
  let state = { player, draw, hand, discard, exhaust };
  const remaining = [];
  for (const id of state.hand) {
    if (CARDS[id]?.fx?.ethereal) {
      state = { ...state, exhaust: [...state.exhaust, id] };
      state = onExhaust(state, events);
    } else {
      remaining.push(id);
    }
  }
  state = { ...state, hand: remaining };

  // Remove tempStrength
  let p2 = state.player;
  if (p2.tempStrength) {
    p2 = { ...p2, strength: (p2.strength || 0) - p2.tempStrength, tempStrength: 0 };
  }
  // Tick player debuffs
  p2 = reduceEffects(p2);

  // Discard the rest of the hand
  const newDiscard = [...state.discard, ...state.hand];

  // Centennial Puzzle: hp loss during end-of-turn effects queues +3 for next turn
  let pendingDraw = c.pendingDraw || 0;
  let puzzleUsed = c.puzzleUsed;
  if (!puzzleUsed && (c.relics || []).includes('puzzle') && p2.hp < hpAtStart) {
    puzzleUsed = true;
    pendingDraw += 3;
  }

  // Death by burn?
  if (p2.hp <= 0) {
    return { ...c, player: p2, enemies, hand: [], discard: newDiscard, draw: state.draw, exhaust: state.exhaust,
             events, seq: c.seq + 1, over: true, won: false, phase: 'lost' };
  }
  // Win by Combustion?
  if (enemies.every((e) => e.hp <= 0)) {
    return { ...c, player: p2, enemies, hand: [], discard: newDiscard, draw: state.draw, exhaust: state.exhaust,
             events, seq: c.seq + 1, over: true, won: true, phase: 'won' };
  }

  return {
    ...c, player: p2, enemies,
    hand: [], discard: newDiscard, draw: state.draw, exhaust: state.exhaust,
    phase: 'enemy', events, seq: c.seq + 1,
    pendingDraw, puzzleUsed,
  };
}

export function resolveEnemy(c) {
  let player = { ...c.player, effects: { ...c.player.effects } };
  let enemies = c.enemies.map((e) => ({ ...e, effects: { ...e.effects } }));
  const events = [];

  // Reset enemy block at start of their turn
  enemies = enemies.map((e) => (e.hp > 0 ? { ...e, block: 0 } : e));

  // Poison ticks first
  enemies = enemies.map((e, ei) => {
    if (e.hp <= 0 || !(e.effects?.poison > 0)) return e;
    const r = tickPoison(e);
    if (r.damage > 0) events.push({ t: 'damage', target: 'enemy', enemyIdx: ei, v: r.damage, type: 'poison' });
    return r.target;
  });

  // Each living enemy acts
  for (let ei = 0; ei < enemies.length; ei++) {
    const enemy = enemies[ei];
    if (enemy.hp <= 0 || !enemy.intent) continue;
    const m = enemy.intent;

    if (m.t === 'attack' || m.t === 'attack_multi') {
      const hits = m.hits || 1;
      for (let h = 0; h < hits; h++) {
        if (player.hp <= 0) break;
        const dmg = calculateDamage(m.v, enemy, player);
        const r = applyDamage(player, dmg);
        player = r.target;
        events.push({ t: 'damage', target: 'player', enemyIdx: ei, v: dmg });
        if (r.thornsTriggered > 0) {
          const er = applyDamage(enemies[ei], r.thornsTriggered);
          enemies[ei] = er.target;
          events.push({ t: 'damage', target: 'enemy', enemyIdx: ei, v: r.thornsTriggered, type: 'thorns' });
          if (er.target.hp <= 0) break;
        }
      }
      events.push({ t: 'lunge', target: 'enemy', enemyIdx: ei });
      if (m.weak)       player = applyEffect(player, 'weak', m.weak);
      if (m.vulnerable) player = applyEffect(player, 'vulnerable', m.vulnerable);
      if (m.frail)      player = applyEffect(player, 'frail', m.frail);
    } else if (m.t === 'defend') {
      const block = calculateBlock(m.v, enemies[ei]);
      enemies[ei] = { ...enemies[ei], block: enemies[ei].block + block };
      events.push({ t: 'block', target: 'enemy', enemyIdx: ei, v: block });
    } else if (m.t === 'buff') {
      enemies[ei] = { ...enemies[ei], strength: (enemies[ei].strength || 0) + m.str };
      events.push({ t: 'buff', target: 'enemy', enemyIdx: ei, v: m.str, type: 'strength' });
    }
  }

  // Tick enemy debuffs
  enemies = enemies.map((e) => (e.hp > 0 ? reduceEffects(e) : e));

  // Centennial Puzzle: first HP loss can happen here too
  let pendingDraw = c.pendingDraw || 0;
  let puzzleUsed = c.puzzleUsed;
  if (!puzzleUsed && (c.relics || []).includes('puzzle') && player.hp < c.player.hp) {
    puzzleUsed = true;
    pendingDraw += 3;
  }

  if (player.hp <= 0) return { ...c, player, enemies, events, seq: c.seq + 1, over: true, won: false, phase: 'lost' };

  let newC = { ...c, player, enemies, events, seq: c.seq + 1, pendingDraw, puzzleUsed };
  newC = pickIntents(newC);
  newC = startTurn(newC);
  return newC;
}

/* ----------------------------- UI helpers -------------------------------- */

// StS-accurate intent info. Damage is computed live — it includes the enemy's
// Strength, the enemy's Weak, and the PLAYER's Vulnerable, exactly like Spire.
// Defend and Buff intents expose no numbers.
export function intentInfo(enemy, player) {
  const m = enemy.intent;
  if (!m) return { kind: 'unknown' };

  if (m.t === 'attack' || m.t === 'attack_multi') {
    const dmg = calculateDamage(m.v, enemy, player);
    const hits = m.hits || 1;
    const debuff = !!(m.weak || m.vulnerable || m.frail);
    return { kind: 'attack', dmg, hits, debuff };
  }
  if (m.t === 'defend') return { kind: 'defend' };
  if (m.t === 'buff')   return { kind: 'buff' };
  return { kind: 'unknown' };
}

// Tooltip text, phrased like the in-game tips.
export function intentTooltip(info) {
  switch (info.kind) {
    case 'attack':
      return info.hits > 1
        ? `This enemy intends to attack for ${info.dmg} damage, ${info.hits} times.` + (info.debuff ? ' It will also inflict a debuff.' : '')
        : `This enemy intends to attack for ${info.dmg} damage.` + (info.debuff ? ' It will also inflict a debuff.' : '');
    case 'defend':  return 'This enemy intends to defend itself.';
    case 'buff':    return 'This enemy intends to use a buff.';
    default:        return 'This enemy\u2019s intentions are unknown.';
  }
}

// Active power list for UI display: returns [{ id, label, stacks }]
export function activePowers(player) {
  const labels = {
    mettalicize: 'Metallicize', combustion: 'Combustion',
    demonForm:   'Demon Form',  brutality:  'Brutality',
    barricade:   'Barricade',   evolve:     'Evolve',
    darkEmbrace: 'Dark Embrace', feelNoPain: 'Feel No Pain',
    corruption:  'Corruption',  inflame:    'Inflame',
  };
  return Object.entries(player?.powers || {})
    .filter(([, v]) => v > 0)
    .map(([id, v]) => ({ id, label: labels[id] || id, stacks: v }));
}
