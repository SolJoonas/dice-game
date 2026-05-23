/** Scorecard cards — per-player Noppapeli scorecard in a swipeable carousel. */

import type { Player } from '../models/player';
import { getScore, upperTotal, upperBonus, lowerTotal, grandTotal } from '../models/player';
import type { ScorecardCategory } from '../models/scorecard';
import { UPPER_SECTION, LOWER_SECTION } from '../models/scorecard';
import { PlayerCardCarousel } from './PlayerCardCarousel';

interface ScorecardTableProps {
  players: Player[];
  onScoreTap: (playerIndex: number, category: ScorecardCategory) => void;
}

/* ── Inline SVG die face ───────────────────────────── */
const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[8, 8]],
  2: [[4, 4], [12, 12]],
  3: [[4, 4], [8, 8], [12, 12]],
  4: [[4, 4], [12, 4], [4, 12], [12, 12]],
  5: [[4, 4], [12, 4], [8, 8], [4, 12], [12, 12]],
  6: [[4, 4], [12, 4], [4, 8], [12, 8], [4, 12], [12, 12]],
};

function Die({ face, size = 16 }: { face: number; size?: number }) {
  const dots = DOT_POSITIONS[face] || DOT_POSITIONS[1];
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <rect x="0.5" y="0.5" width="15" height="15" rx="2.5" fill="none"
        stroke="var(--text-secondary)" strokeWidth="1" />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.6" fill="var(--text-secondary)" />
      ))}
    </svg>
  );
}

function DiceGroup({ faces, gap = 1 }: { faces: number[]; gap?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap, alignItems: 'center' }}>
      {faces.map((f, i) => <Die key={i} face={f} size={16} />)}
    </span>
  );
}

function diceLabel(id: string): React.ReactNode {
  switch (id) {
    case 'ones':             return <Die face={1} size={18} />;
    case 'twos':             return <Die face={2} size={18} />;
    case 'threes':           return <Die face={3} size={18} />;
    case 'fours':            return <Die face={4} size={18} />;
    case 'fives':            return <Die face={5} size={18} />;
    case 'sixes':            return <Die face={6} size={18} />;
    case 'one_pair':         return <DiceGroup faces={[4, 4]} />;
    case 'two_pairs':        return <DiceGroup faces={[3, 3, 6, 6]} />;
    case 'three_of_a_kind':  return <DiceGroup faces={[5, 5, 5]} />;
    case 'four_of_a_kind':   return <DiceGroup faces={[3, 3, 3, 3]} />;
    case 'small_straight':   return <DiceGroup faces={[1, 2, 3, 4, 5]} gap={0} />;
    case 'large_straight':   return <DiceGroup faces={[2, 3, 4, 5, 6]} gap={0} />;
    case 'full_house':       return <DiceGroup faces={[3, 3, 6, 6, 6]} gap={0} />;
    case 'chance':           return <span style={{ fontSize: 16 }}>🎲</span>;
    case 'noppapeli':        return <DiceGroup faces={[6, 6, 6, 6, 6]} gap={0} />;
    default:                 return <span>🎲</span>;
  }
}

export function ScorecardTable({ players, onScoreTap }: ScorecardTableProps) {
  function scoreRow(player: Player, pi: number, cat: ScorecardCategory) {
    const s = getScore(player, cat);
    return (
      <div key={cat.id} className="score-card-row" title={cat.name}
        onClick={() => onScoreTap(pi, cat)}>
        <span className="score-card-dice">{diceLabel(cat.id)}</span>
        <span className={`score-card-value ${s !== null ? 'filled' : 'empty'}`}>
          {s !== null ? s : '–'}
        </span>
      </div>
    );
  }

  function computedRow(label: string, value: number, type: 'subtotal' | 'bonus' | 'grandTotal' = 'subtotal') {
    const cls = type === 'grandTotal' ? 'grand-total'
      : type === 'bonus' ? (value > 0 ? 'bonus-earned' : 'bonus-none')
      : 'subtotal';
    return (
      <div className={`score-card-computed ${cls}`}>
        <span>{label}</span><span>{value}</span>
      </div>
    );
  }

  function renderCard(pi: number) {
    const player = players[pi];
    const t = grandTotal(player);
    return (
      <div className="player-card">
        <div className="player-card-header">
          <div className="player-card-name">{player.name}</div>
          <div className="player-card-total">{t}</div>
        </div>

        <div className="score-card-grid">
          <div className="score-card-col">
            {UPPER_SECTION.slice(0, 3).map(c => scoreRow(player, pi, c))}
          </div>
          <div className="score-card-col">
            {UPPER_SECTION.slice(3, 6).map(c => scoreRow(player, pi, c))}
          </div>
        </div>

        <div className="score-card-grid">
          <div className="score-card-col">{computedRow('Välisumma', upperTotal(player))}</div>
          <div className="score-card-col">{computedRow('Bonus', upperBonus(player), 'bonus')}</div>
        </div>

        <div className="score-card-grid">
          <div className="score-card-col">
            {LOWER_SECTION.slice(0, 5).map(c => scoreRow(player, pi, c))}
          </div>
          <div className="score-card-col">
            {LOWER_SECTION.slice(5, 9).map(c => scoreRow(player, pi, c))}
            {computedRow('Alaosa', lowerTotal(player))}
          </div>
        </div>

        {computedRow('YHTEENSÄ', t, 'grandTotal')}
      </div>
    );
  }

  return (
    <PlayerCardCarousel
      count={players.length}
      renderCard={renderCard}
      names={players.map(p => p.name)}
    />
  );
}
