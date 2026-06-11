import { useEffect, useReducer, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../game/game.css';
import { CARDS, REWARD_POOL, UPGRADES, isUpgradable, isUpgraded, cardDesc } from '../game/cards.js';
import { BOSS, ELITES, pickEncounter } from '../game/enemies.js';
import { RELICS, pickRelicReward } from '../game/relics.js';
import {
  newRun, reachable, startCombat, playCard, endTurn, resolveEnemy,
  intentInfo, intentTooltip, shuffle, activePowers,
} from '../game/engine.js';
import { ICONS, SPRITES } from '../game/art.js';

/* ---------------------------------- reducer --------------------------------- */

const initialState = {
  screen: 'title',
  run: null,
  combat: null,
  reward: null,
  gameover: null,
  deckOpen: false,
  restPicked: null, // 'rest' | 'upgrade' | null — used to gate the upgrade picker
};

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...initialState, screen: 'map', run: newRun() };

    case 'ENTER_NODE': {
      const { r, i, nodeType } = action;
      const run = { ...state.run, curRow: r, curIdx: i };
      if (nodeType === 'rest') return { ...state, run, screen: 'rest', restPicked: null };
      let encounter, opts = {};
      if (nodeType === 'boss')      { encounter = [BOSS];          opts.isBoss = true; }
      else if (nodeType === 'elite') { encounter = [ELITES.warden]; opts.isElite = true; }
      else                           { encounter = pickEncounter(run.sector); }
      return { ...state, run, combat: startCombat(run, encounter, opts), screen: 'combat' };
    }

    case 'REST': {
      const run = { ...state.run, hp: Math.min(state.run.maxHp, state.run.hp + Math.floor(state.run.maxHp * 0.3)) };
      return { ...state, run, screen: 'map' };
    }
    case 'GO_UPGRADE': return { ...state, restPicked: 'upgrade' };
    case 'UPGRADE_CARD': {
      const { deckIdx } = action;
      const deck = [...state.run.deck];
      const id = deck[deckIdx];
      if (!isUpgradable(id)) return state;
      deck[deckIdx] = id + '+';
      return { ...state, run: { ...state.run, deck }, screen: 'map', restPicked: null };
    }
    case 'CANCEL_UPGRADE': return { ...state, restPicked: null };

    case 'PLAY_CARD':
      return { ...state, combat: playCard(state.combat, action.idx, action.targetIdx) };
    case 'END_TURN':
      return { ...state, combat: endTurn(state.combat) };
    case 'RESOLVE_ENEMY':
      return { ...state, combat: resolveEnemy(state.combat) };

    case 'WIN': {
      const c = state.combat;
      let hp = c.player.hp;
      // Burning Blood: heal 6 at end of combat
      if (state.run.relics.includes('burningblood')) {
        hp = Math.min(state.run.maxHp, hp + 6);
      }
      const baseRun = { ...state.run, hp };
      if (c.isBoss) return { ...state, run: baseRun, combat: null, screen: 'gameover', gameover: { win: true } };
      // Elites drop a relic
      let relic = null;
      let run = baseRun;
      if (c.isElite) {
        relic = pickRelicReward(baseRun.relics);
        if (relic) run = { ...baseRun, relics: [...baseRun.relics, relic] };
      }
      return { ...state, run, combat: null, reward: { cards: shuffle(REWARD_POOL).slice(0, 3), relic }, screen: 'reward' };
    }
    case 'LOSE':
      return { ...state, combat: null, screen: 'gameover', gameover: { win: false } };

    case 'PICK_REWARD': {
      const run = { ...state.run, deck: [...state.run.deck, action.id], sector: state.run.sector + 1 };
      return { ...state, run, reward: null, screen: 'map' };
    }
    case 'SKIP_REWARD':
      return { ...state, run: { ...state.run, sector: state.run.sector + 1 }, reward: null, screen: 'map' };

    case 'TOGGLE_DECK': return { ...state, deckOpen: !state.deckOpen };
    default: return state;
  }
}

/* ------------------------------- presentational ----------------------------- */

function Card({ id, className = '', style, onPointerDown, onClick }) {
  const c = CARDS[id];
  if (!c) return null;
  const cost = c.fx?.unplayable ? '—' : c.cost;
  return (
    <div
      className={`cb-card ${className} ${c.upgraded ? 'cb-upgraded' : ''}`}
      data-type={c.type}
      style={style}
      onPointerDown={onPointerDown}
      onClick={onClick}
    >
      <div className="cb-cost">{cost}</div>
      <div className="cb-card-inner">
        <div className="cb-cname">{c.name}</div>
        <div className="cb-art" dangerouslySetInnerHTML={{ __html: ICONS[c.icon] || '' }} />
        <div className="cb-desc">{cardDesc(id)}</div>
        <div className="cb-ctype">{c.type}</div>
      </div>
    </div>
  );
}

function Bar({ entity }) {
  const pct = Math.max(0, (entity.hp / entity.maxHp) * 100);
  return (
    <div className="cb-bar">
      <i style={{ width: `${pct}%` }} />
      <span>{entity.hp} / {entity.maxHp}</span>
    </div>
  );
}

/* StS-style intent icons. Weapon scales with damage (dagger < 10, sword < 20,
   scythe >= 20). Defend and Buff show icon only — no numbers, like Spire. */
const INTENT_ICONS = {
  dagger: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5 8 16M19 5l-4 1 3 3zM8 16l-2 1-1 3 3-1 1-2z"/></svg>`,
  sword: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 9 15M21 3l-6 1 5 5zM9 15l-3 1M10 18l-1-3M6 16l-3 4 1 1 4-3z"/></svg>`,
  scythe: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4c-5-2-12 0-14 6l9 1c1-4 3-6 5-7z"/><path d="M11 9 6 21"/></svg>`,
  shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l8 3v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6z"/></svg>`,
  buff: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V5M5 12l7-7 7 7"/></svg>`,
  debuff: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 8c3-3 5 3 8 0s5 3 8 0M4 16c3-3 5 3 8 0s5 3 8 0"/></svg>`,
  unknown: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 9a3 3 0 1 1 4.6 2.5c-1 .7-1.6 1.3-1.6 2.5"/><circle cx="12" cy="18" r=".5" fill="currentColor"/></svg>`,
};

function IntentBadge({ enemy, player }) {
  const info = intentInfo(enemy, player);
  const tip = intentTooltip(info);

  if (info.kind === 'attack') {
    const weapon = info.dmg >= 20 ? 'scythe' : info.dmg >= 10 ? 'sword' : 'dagger';
    return (
      <div className="cb-intent atk" title={tip}>
        <span dangerouslySetInnerHTML={{ __html: INTENT_ICONS[weapon] }} />
        <span>{info.dmg}{info.hits > 1 ? `×${info.hits}` : ''}</span>
        {info.debuff && <span className="cb-intent-rider" dangerouslySetInnerHTML={{ __html: INTENT_ICONS.debuff }} />}
      </div>
    );
  }
  if (info.kind === 'defend') {
    return <div className="cb-intent def" title={tip}><span dangerouslySetInnerHTML={{ __html: INTENT_ICONS.shield }} /></div>;
  }
  if (info.kind === 'buff') {
    return <div className="cb-intent buf" title={tip}><span dangerouslySetInnerHTML={{ __html: INTENT_ICONS.buff }} /></div>;
  }
  return <div className="cb-intent unk" title={tip}><span dangerouslySetInnerHTML={{ __html: INTENT_ICONS.unknown }} /></div>;
}

function Pips({ entity, showPowers }) {
  const e = entity.effects || {};
  const powers = showPowers ? activePowers(entity) : [];
  return (
    <div className="cb-pips">
      {e.vulnerable > 0 && <span className="cb-pip vuln" title="Takes 50% more damage">Vuln {e.vulnerable}</span>}
      {e.weak > 0       && <span className="cb-pip weak" title="Deals 25% less damage">Weak {e.weak}</span>}
      {e.frail > 0      && <span className="cb-pip frail" title="Gains 25% less Block">Frail {e.frail}</span>}
      {e.poison > 0     && <span className="cb-pip poison" title="Loses HP at start of turn">Poison {e.poison}</span>}
      {e.thorns > 0     && <span className="cb-pip thorns" title="Reflects damage">Thorns {e.thorns}</span>}
      {(entity.strength || 0) > 0 && <span className="cb-pip str" title="+damage on attacks">Str {entity.strength}</span>}
      {powers.map((p) => (
        <span key={p.id} className="cb-pip power" title={p.label}>
          {p.label}{p.stacks > 1 ? ` ${p.stacks}` : ''}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------ page ---------------------------------- */

export default function GamePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { screen, run, combat, reward, gameover, deckOpen, restPicked } = state;

  // animation + floats, driven by combat.events
  const [anim, setAnim] = useState({ player: { k: 0, type: null }, enemies: {} });
  const [floats, setFloats] = useState([]);
  const seqRef = useRef(-1);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!combat || combat.seq === seqRef.current) return;
    seqRef.current = combat.seq;
    const evs = combat.events || [];
    setAnim((prev) => {
      const a = { player: { ...prev.player }, enemies: { ...prev.enemies } };
      evs.forEach((e) => {
        if (e.t === 'damage') {
          if (e.target === 'enemy') {
            const ei = e.enemyIdx ?? 0;
            const cur = a.enemies[ei] || { k: 0, type: null };
            a.enemies[ei] = { k: cur.k + 1, type: 'hurt' };
          } else {
            a.player = { k: a.player.k + 1, type: 'hurt' };
          }
        }
        if (e.t === 'lunge') {
          if (e.target === 'player') a.player = { k: a.player.k + 1, type: 'lunge' };
          else {
            const ei = e.enemyIdx ?? 0;
            const cur = a.enemies[ei] || { k: 0, type: null };
            a.enemies[ei] = { k: cur.k + 1, type: 'lunge' };
          }
        }
      });
      return a;
    });
    const fresh = [];
    evs.forEach((e, k) => {
      if (e.t === 'damage') {
        const tag = e.target === 'enemy' ? `e${e.enemyIdx ?? 0}` : 'player';
        fresh.push({ id: `${combat.seq}-${k}`, where: tag, text: `-${e.v}`, color: '#f4605f' });
      }
      if (e.t === 'buff' && e.target === 'player') {
        fresh.push({ id: `${combat.seq}-${k}`, where: 'player', text: `+${e.v} STR`, color: '#4ec9b0' });
      }
      if (e.t === 'buff' && e.target === 'enemy') {
        fresh.push({ id: `${combat.seq}-${k}`, where: `e${e.enemyIdx ?? 0}`, text: `+${e.v} STR`, color: '#4ec9b0' });
      }
      if (e.t === 'heal' && e.target === 'player') {
        fresh.push({ id: `${combat.seq}-${k}`, where: 'player', text: `+${e.v} HP`, color: '#4ec9b0' });
      }
      if (e.t === 'block' && e.target === 'player' && e.v > 0) {
        fresh.push({ id: `${combat.seq}-${k}`, where: 'player', text: `+${e.v} BLK`, color: '#569cd6' });
      }
    });
    if (fresh.length) {
      setFloats((f) => [...f, ...fresh]);
      fresh.forEach((nf) => setTimeout(() => setFloats((f) => f.filter((x) => x.id !== nf.id)), 1000));
    }
  }, [combat]);

  // timed phase transitions
  useEffect(() => {
    if (!combat) return undefined;
    if (combat.phase === 'enemy' && !combat.over) {
      const t = setTimeout(() => dispatch({ type: 'RESOLVE_ENEMY' }), 650);
      return () => clearTimeout(t);
    }
    if (combat.phase === 'won')  { const t = setTimeout(() => dispatch({ type: 'WIN' }),  700); return () => clearTimeout(t); }
    if (combat.phase === 'lost') { const t = setTimeout(() => dispatch({ type: 'LOSE' }), 700); return () => clearTimeout(t); }
    return undefined;
  }, [combat]);

  // map auto-scroll
  useEffect(() => {
    if (screen !== 'map' || !scrollRef.current || !run) return;
    const T = run.map.length;
    const RG = 92, PB = 34, H = PB + 34 + (T - 1) * RG;
    const focusY = run.curRow < 0 ? H : PB + (T - 1 - run.curRow) * RG;
    scrollRef.current.scrollTop = Math.max(0, focusY - scrollRef.current.clientHeight * 0.6);
  }, [screen, run]);

  /* -------- drag-to-target -------- */
  const [drag, setDrag] = useState(null);

  const onCardDown = (e, idx) => {
    if (!combat || combat.phase !== 'player' || combat.over) return;
    const cardId = combat.hand[idx];
    const card = CARDS[cardId];
    if (!card || card.fx.unplayable || card.cost > combat.energy) return;
    e.preventDefault();
    setDrag({
      handIdx: idx, cardId,
      target: card.target || (card.fx.damage || card.fx.damageBlock ? 'enemy' : 'self'),
      startX: e.clientX, startY: e.clientY,
      x: e.clientX, y: e.clientY,
    });
  };

  useEffect(() => {
    if (!drag) return undefined;
    const onMove = (ev) => setDrag((d) => (d ? { ...d, x: ev.clientX, y: ev.clientY } : null));
    const onUp = (ev) => {
      const d = drag;
      setDrag(null);
      if (!combat || combat.phase !== 'player' || combat.over) return;
      let targetIdx = null;
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      if (el) {
        const enemyEl = el.closest('[data-enemy-idx]');
        if (enemyEl) targetIdx = parseInt(enemyEl.dataset.enemyIdx, 10);
      }
      if (d.target === 'enemy' && targetIdx == null) return; // cancel — no valid drop
      dispatch({ type: 'PLAY_CARD', idx: d.handIdx, targetIdx });
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
  }, [drag, combat]);

  /* -------- title -------- */
  const Title = (
    <div className={`cb-screen cb-title ${screen === 'title' ? 'on' : ''}`}>
      <div className="eyebrow">// roguelike deckbuilder</div>
      <div className="logo"><span className="a">CORE</span><span className="b">BREAK</span></div>
      <div className="sub cb-mono">descend the stack · purge the rogue machines · reach the core<span className="cursor" /></div>
      <button className="cb-btn" onClick={() => dispatch({ type: 'START' })}><span className="x">&gt;</span> ./descend</button>
      <div className="cb-help">Spend PWR to play cards. Drag attacks onto an enemy. Click skills/powers to play.</div>
    </div>
  );

  /* -------- map -------- */
  let MapView = null;
  if (run) {
    const rows = run.map, T = rows.length;
    const W = 480, RG = 92, PT = 34, PB = 34, H = PT + PB + (T - 1) * RG;
    const coord = (r, i) => ({ x: (W * (i + 1)) / (rows[r].length + 1), y: PB + (T - 1 - r) * RG });
    const cur = run.curRow, ci = run.curIdx;
    const reach = reachable(run);
    const icon = { combat: '⚔', elite: '◆', rest: '⏻', boss: '⬢' };
    const label = { combat: 'Fight', elite: 'Elite', rest: 'Repair Bay', boss: 'Boss' };

    const edges = [];
    rows.forEach((row, r) => {
      if (r === T - 1) return;
      row.forEach((node, i) => {
        const a = coord(r, i);
        (node.next || []).forEach((j) => {
          const b = coord(r + 1, j);
          const active = r === cur && i === ci;
          const traveled = r < cur;
          const midY = (a.y + b.y) / 2;
          edges.push(
            <path key={`${r}-${i}-${j}`}
              d={`M${a.x.toFixed(1)} ${a.y} C ${a.x.toFixed(1)} ${midY}, ${b.x.toFixed(1)} ${midY}, ${b.x.toFixed(1)} ${b.y}`}
              fill="none" stroke={active ? '#569cd6' : traveled ? '#2c2e33' : '#3e3e42'}
              strokeWidth={active ? 2.5 : 1.5} strokeDasharray={active ? undefined : '3 6'}
              opacity={active ? 1 : traveled ? 0.45 : 0.8} />
          );
        });
      });
    });

    const nodes = [];
    rows.forEach((row, r) => {
      row.forEach((node, i) => {
        const cn = coord(r, i);
        const isReach = reach.some((x) => x.row === r && x.i === i);
        let cls = `cb-node ${node.type}`;
        if (r < cur) cls += ' done';
        if (r === cur && i === ci) cls += ' current';
        if (isReach) cls += ' reach';
        nodes.push(
          <div key={`${r}-${i}`} className={cls} title={label[node.type]}
            style={{ left: `${cn.x.toFixed(1)}px`, top: `${cn.y}px` }}
            onClick={isReach ? () => dispatch({ type: 'ENTER_NODE', r, i, nodeType: node.type }) : undefined}>
            {icon[node.type]}
          </div>
        );
      });
    });

    MapView = (
      <div className={`cb-screen ${screen === 'map' ? 'on' : ''}`} style={{ padding: 0, justifyContent: 'flex-start' }}>
        <div className="cb-maplegend">
          <span className="combat"><i>⚔</i>Fight</span>
          <span className="elite"><i>◆</i>Elite</span>
          <span className="rest"><i>⏻</i>Repair</span>
          <span className="boss"><i>⬢</i>Boss</span>
        </div>
        <div className="cb-mapscroll" ref={scrollRef}>
          <div className="cb-mapcanvas" style={{ width: `${W}px`, height: `${H}px` }}>
            <svg className="cb-mapedges" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>{edges}</svg>
            {nodes}
          </div>
        </div>
      </div>
    );
  }

  /* -------- combat -------- */
  let CombatView = null;
  if (combat) {
    const { player, energy } = combat;
    const willTarget = drag && drag.target === 'enemy';

    const SpriteOf = (key, art, side) => {
      const an = (side === 'player' ? anim.player : (anim.enemies[key] || { k: 0, type: null }));
      const cls = an.type === 'hurt'
        ? 'cb-hit'
        : an.type === 'lunge'
          ? (side === 'player' ? 'cb-lunge-l' : 'cb-lunge-r')
          : '';
      const svg = SPRITES[art] ? SPRITES[art]() : '';
      return (
        <div className="cb-bob">
          <div key={`${side}-${key}-${an.k}`} className={cls} dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      );
    };

    const sideFloats = (where) =>
      floats.filter((f) => f.where === where).map((f) =>
        <div key={f.id} className="cb-float" style={{ color: f.color }}>{f.text}</div>
      );

    CombatView = (
      <div className={`cb-screen ${screen === 'combat' ? 'on' : ''}`} style={{ padding: 0, justifyContent: 'space-between' }}>
        <div className="cb-field">
          <div className="cb-enemies">
            {combat.enemies.map((enemy, ei) => {
              if (enemy.hp <= 0) return null;
              return (
                <div key={ei} className={`cb-side cb-enemy ${willTarget ? 'cb-targetable' : ''}`} data-enemy-idx={ei}>
                  {sideFloats(`e${ei}`)}
                  <IntentBadge enemy={enemy} player={player} />
                  {enemy.block > 0 && <div className="cb-shield">▣ {enemy.block}</div>}
                  {SpriteOf(ei, enemy.art, 'enemy')}
                  <Pips entity={enemy} />
                  <div className="cb-name">{enemy.name}</div>
                  <Bar entity={enemy} />
                </div>
              );
            })}
          </div>
          <div className="cb-side cb-player-side">
            {sideFloats('player')}
            {player.block > 0 && <div className="cb-shield">▣ {player.block}</div>}
            {SpriteOf('p', 'operator', 'player')}
            <Pips entity={player} showPowers />
            <div className="cb-name"><span className="x">~/</span>operator</div>
            <Bar entity={player} />
          </div>
        </div>

        <div className="cb-hud">
          <div className="cb-energy">
            <svg viewBox="0 0 66 66"><polygon points="33,3 60,18 60,48 33,63 6,48 6,18" fill="rgba(86,156,214,.08)" stroke="#569cd6" strokeWidth="2" /></svg>
            <div className="num">{energy}</div>
            <div className="lbl">PWR</div>
          </div>
          <div className="cb-piles">
            <span>draw <b>{combat.draw.length}</b></span>
            <span>discard <b>{combat.discard.length}</b></span>
            {combat.exhaust.length > 0 && <span>exhaust <b>{combat.exhaust.length}</b></span>}
          </div>
          <span style={{ flex: 1 }} />
        </div>

        <div className="cb-hand">
          {combat.hand.map((id, i) => {
            const card = CARDS[id];
            if (!card) return null;
            const playable = !card.fx.unplayable && card.cost <= energy && combat.phase === 'player' && !combat.over;
            const isDragging = drag && drag.handIdx === i;
            const moved = isDragging && (Math.abs(drag.x - drag.startX) > 4 || Math.abs(drag.y - drag.startY) > 4);
            // While dragging, the floating copy is rendered via a portal to
            // document.body (see below) — position:fixed inside .cb-screen is
            // broken because its fill-mode:both animation retains a transform,
            // making the screen the containing block. The original card stays
            // in the hand, invisible, to keep layout stable.
            return (
              <Card key={i} id={id}
                className={playable ? '' : 'unplayable'}
                style={moved ? { visibility: 'hidden' } : null}
                onPointerDown={playable ? (e) => onCardDown(e, i) : undefined}
              />
            );
          })}
        </div>

        <button className="cb-btn cb-endturn"
          style={{ opacity: combat.phase === 'player' && !combat.over ? 1 : 0.4 }}
          onClick={() => combat.phase === 'player' && !combat.over && dispatch({ type: 'END_TURN' })}>
          end turn <span className="x">⏎</span>
        </button>
      </div>
    );
  }

  /* -------- overlays -------- */
  const dragMoved = drag && (Math.abs(drag.x - drag.startX) > 4 || Math.abs(drag.y - drag.startY) > 4);

  return (
    <section className="clean-shell" style={{ padding: '28px 20px 56px' }}>
      {dragMoved && createPortal(
        <div
          className="cb-root"
          style={{
            position: 'fixed',
            left: drag.x - 62,   // 124 / 2 — card centered on cursor
            top: drag.y - 89,    // 178 / 2
            width: 124, height: 178,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <Card id={drag.cardId} />
        </div>,
        document.body
      )}
      <div className="cb-root">
        <div className="cb-window clean-panel">
          <div className="cb-titlebar editor-topbar">
            <span className="window-dot" style={{ background: '#ec6a5f' }} />
            <span className="window-dot" style={{ background: '#f4bf4f' }} />
            <span className="window-dot" style={{ background: '#61c554' }} />
            <span className="cb-tab"><span className="x">~/</span><b>corebreak</b><span className="x">.exe</span></span>
            {run && (
              <span className="cb-status">
                <span className="cb-relics">
                  {run.relics.map((id) => {
                    const r = RELICS[id];
                    if (!r) return null;
                    let tip = `${r.name}: ${r.desc}`;
                    if (id === 'pennib' && combat) tip += ` (${(combat.attacksPlayed || 0) % 10}/10)`;
                    return <span key={id} className="cb-relic" title={tip}>{r.glyph}</span>;
                  })}
                </span>
                <span>HP <b>{run.hp}/{run.maxHp}</b></span>
                <span>sector <b>{run.sector}</b></span>
                <span className="clk" onClick={() => dispatch({ type: 'TOGGLE_DECK' })}>deck <b>{run.deck.length}</b></span>
              </span>
            )}
          </div>

          <div className="cb-stage">
            {Title}
            {MapView}
            {CombatView}

            {/* reward */}
            <div className={`cb-overlay ${screen === 'reward' ? 'on' : ''}`}>
              <h2><span className="x">+</span> salvaged data</h2>
              {reward?.relic && (
                <div className="cb-relicdrop">
                  <span className="cb-relic" title={RELICS[reward.relic].desc}>{RELICS[reward.relic].glyph}</span>
                  <span>relic acquired: <b>{RELICS[reward.relic].name}</b> — {RELICS[reward.relic].desc}</span>
                </div>
              )}
              <div className="cb-note">Add one card to your deck.</div>
              <div className="cb-rewardcards">
                {(reward?.cards || []).map((id, i) => (
                  <Card key={i} id={id} onClick={() => dispatch({ type: 'PICK_REWARD', id })} />
                ))}
              </div>
              <button className="cb-btn sm" onClick={() => dispatch({ type: 'SKIP_REWARD' })}>skip</button>
            </div>

            {/* rest: choose repair or upgrade */}
            <div className={`cb-overlay ${screen === 'rest' && restPicked == null ? 'on' : ''}`}>
              <h2><span className="x">⏻</span> repair bay</h2>
              <div className="cb-note">A safe node in the stack. Pick one.</div>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button className="cb-btn" onClick={() => dispatch({ type: 'REST' })}>repair · heal 30%</button>
                <button className="cb-btn" onClick={() => dispatch({ type: 'GO_UPGRADE' })}>upgrade a card</button>
              </div>
            </div>

            {/* upgrade picker */}
            <div className={`cb-overlay ${screen === 'rest' && restPicked === 'upgrade' ? 'on' : ''}`}>
              <h2><span className="x">∆</span> choose a card to upgrade</h2>
              <div className="cb-note">Upgraded cards are stronger versions of their base form.</div>
              <div className="cb-rewardcards cb-scroll">
                {run && run.deck.map((id, deckIdx) => isUpgradable(id) && (
                  <Card key={deckIdx} id={id} onClick={() => dispatch({ type: 'UPGRADE_CARD', deckIdx })} />
                ))}
                {run && run.deck.every((id) => !isUpgradable(id)) && (
                  <div className="cb-note">Nothing to upgrade — every eligible card is already upgraded.</div>
                )}
              </div>
              <button className="cb-btn sm" onClick={() => dispatch({ type: 'CANCEL_UPGRADE' })}>back</button>
            </div>

            {/* deck viewer */}
            <div className={`cb-overlay ${deckOpen ? 'on' : ''}`}>
              <h2><span className="x">::</span> deck</h2>
              <div className="cb-rewardcards cb-scroll">
                {run && [...run.deck].sort().map((id, i) => <Card key={i} id={id} />)}
              </div>
              <button className="cb-btn sm" onClick={() => dispatch({ type: 'TOGGLE_DECK' })}>close</button>
            </div>

            {/* game over */}
            <div className={`cb-overlay ${screen === 'gameover' ? 'on' : ''}`}>
              <div className={`cb-banner ${gameover?.win ? 'win' : 'lose'}`}>
                {gameover?.win ? 'SYSTEM PURGED' : 'CONNECTION LOST'}
              </div>
              <div className="cb-note">
                {gameover?.win
                  ? 'The Mainframe goes dark. The stack is yours — you ascend toward the surface.'
                  : 'Your chassis fails. The machines reclaim the sector.'}
              </div>
              <button className="cb-btn" onClick={() => dispatch({ type: 'START' })}><span className="x">&gt;</span> ./retry</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
