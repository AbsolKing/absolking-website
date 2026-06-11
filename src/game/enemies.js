// Rogue machines. Each has an intent pattern (moves) the AI cycles through.
// Move types: attack | attack_multi (hits) | defend | buff (str).

export const ENEMIES = {
  skitter: {
    name: 'Scrap Skitterer', hp: [28, 34], art: 'skitter',
    moves: [{ t: 'attack', v: 7 }, { t: 'attack', v: 7 }, { t: 'defend', v: 6 }, { t: 'attack', v: 10 }],
  },
  drone: {
    name: 'Recon Drone', hp: [22, 26], art: 'drone',
    moves: [{ t: 'attack', v: 6 }, { t: 'attack', v: 6, weak: 1 }, { t: 'attack', v: 9 }],
  },
  sentinel: {
    name: 'Sentinel Unit', hp: [36, 42], art: 'sentinel',
    moves: [{ t: 'buff', str: 3 }, { t: 'attack', v: 9 }, { t: 'attack', v: 9 }, { t: 'attack', v: 13 }],
  },
};

export const ELITES = {
  warden: {
    name: 'Bastion Warden', hp: [60, 68], art: 'warden',
    moves: [{ t: 'defend', v: 10 }, { t: 'attack', v: 12 }, { t: 'attack', v: 9, vulnerable: 2 }, { t: 'attack', v: 16 }],
  },
};

export const BOSS = {
  name: 'The Mainframe', hp: [140, 140], art: 'core', boss: true,
  moves: [
    { t: 'attack', v: 11 },
    { t: 'buff', str: 4 },
    { t: 'attack', v: 14, vulnerable: 2 },
    { t: 'attack_multi', v: 7, hits: 3 },
    { t: 'defend', v: 14 },
  ],
};

export function randomEnemy() {
  const pool = Object.values(ENEMIES);
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ----------------------------- Encounters ----------------------------- */
// Groups of 1–3 enemies that show up in normal combat nodes. Picked by sector
// tier; deeper sectors lean on bigger / mixed groups.

export const ENCOUNTERS = {
  early: [
    [ENEMIES.skitter],
    [ENEMIES.drone],
    [ENEMIES.skitter, ENEMIES.drone],
    [ENEMIES.drone, ENEMIES.drone],
  ],
  mid: [
    [ENEMIES.sentinel],
    [ENEMIES.skitter, ENEMIES.sentinel],
    [ENEMIES.skitter, ENEMIES.skitter, ENEMIES.drone],
    [ENEMIES.drone, ENEMIES.sentinel],
  ],
  late: [
    [ENEMIES.sentinel, ENEMIES.sentinel],
    [ENEMIES.sentinel, ENEMIES.drone, ENEMIES.drone],
    [ENEMIES.skitter, ENEMIES.sentinel, ENEMIES.drone],
  ],
};

export function pickEncounter(sector = 1) {
  const tier = sector < 3 ? 'early' : sector < 5 ? 'mid' : 'late';
  const pool = ENCOUNTERS[tier];
  return pool[Math.floor(Math.random() * pool.length)];
}
