/** Player column — one player's complete scorecard. */

import type { Player } from '../models/player';
import { getScore, upperTotal, upperBonus, lowerTotal, grandTotal } from '../models/player';
import { UPPER_SECTION, LOWER_SECTION, type ScorecardCategory } from '../models/scorecard';
import { ScoreCell } from './ScoreCell';

interface PlayerColumnProps {
  player: Player;
  onScoreTap: (category: ScorecardCategory) => void;
  cellWidth: number;
}

export function PlayerColumn({ player, onScoreTap, cellWidth }: PlayerColumnProps) {
  return (
    <div>
      {/* Player name header */}
      <div style={{
        width: cellWidth,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-lines)',
        borderBottom: '2px dashed var(--accent)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <span style={{
          fontFamily: 'var(--font-title)',
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--accent)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '0 4px',
        }}>
          {player.name}
        </span>
      </div>

      {/* Upper section scores */}
      {UPPER_SECTION.map(cat => (
        <ScoreCell
          key={cat.id}
          score={getScore(player, cat)}
          onTap={() => onScoreTap(cat)}
          width={cellWidth}
        />
      ))}

      {/* Upper subtotal */}
      <ScoreCell
        score={upperTotal(player)}
        isEditable={false}
        isHighlighted
        width={cellWidth}
      />

      {/* Bonus */}
      <ScoreCell
        score={upperBonus(player)}
        isEditable={false}
        isHighlighted={upperBonus(player) > 0}
        textColor={upperBonus(player) > 0 ? 'var(--gold)' : 'var(--muted)'}
        width={cellWidth}
      />

      {/* Lower section scores */}
      {LOWER_SECTION.map(cat => (
        <ScoreCell
          key={cat.id}
          score={getScore(player, cat)}
          onTap={() => onScoreTap(cat)}
          width={cellWidth}
        />
      ))}

      {/* Lower subtotal */}
      <ScoreCell
        score={lowerTotal(player)}
        isEditable={false}
        isHighlighted
        width={cellWidth}
      />

      {/* Grand total */}
      <ScoreCell
        score={grandTotal(player)}
        isEditable={false}
        isHighlighted
        textColor="var(--gold)"
        width={cellWidth}
      />
    </div>
  );
}
