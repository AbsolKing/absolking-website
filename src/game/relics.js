// Relic catalog. Effects are implemented in engine.js (combat hooks) and the
// GamePage reducer (run-level hooks like Burning Blood's post-combat heal).
// Elites drop one unowned relic on kill.

export const RELICS = {
  burningblood: {
    name: 'Burning Blood', glyph: '♥', starter: true,
    desc: 'At the end of combat, heal 6 HP.',
  },
  vajra: {
    name: 'Vajra', glyph: '↟',
    desc: 'Start each combat with 1 Strength.',
  },
  anchor: {
    name: 'Anchor', glyph: '⚓',
    desc: 'Start each combat with 10 Block.',
  },
  bagofprep: {
    name: 'Bag of Preparation', glyph: '☰',
    desc: 'Draw 2 additional cards at the start of each combat.',
  },
  bloodvial: {
    name: 'Blood Vial', glyph: '◉',
    desc: 'Heal 2 HP at the start of each combat.',
  },
  bronzescales: {
    name: 'Bronze Scales', glyph: '✶',
    desc: 'Start each combat with 3 Thorns.',
  },
  lantern: {
    name: 'Lantern', glyph: '☀',
    desc: 'Gain 1 extra Energy on the first turn of each combat.',
  },
  orichalcum: {
    name: 'Orichalcum', glyph: '▣',
    desc: 'If you end your turn with no Block, gain 6 Block.',
  },
  akabeko: {
    name: 'Akabeko', glyph: '⚡',
    desc: 'Your first Attack each combat deals 8 additional damage.',
  },
  strikedummy: {
    name: 'Strike Dummy', glyph: '✊',
    desc: 'Cards containing "Strike" deal 3 additional damage.',
  },
  pennib: {
    name: 'Pen Nib', glyph: '✎',
    desc: 'Every 10th Attack you play deals double damage.',
  },
  puzzle: {
    name: 'Centennial Puzzle', glyph: '◬',
    desc: 'The first time you lose HP each combat, draw 3 cards.',
  },
};

// Random unowned, non-starter relic for elite drops. Null when exhausted.
export function pickRelicReward(owned = []) {
  const pool = Object.keys(RELICS).filter((id) => !RELICS[id].starter && !owned.includes(id));
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
