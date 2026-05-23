/** Score cell — a single tappable cell in the scorecard table. */

import type { CSSProperties } from 'react';

interface ScoreCellProps {
  score: number | null;
  onTap?: () => void;
  isEditable?: boolean;
  isHighlighted?: boolean;
  textColor?: string;
  width: number;
}

export function ScoreCell({
  score,
  onTap,
  isEditable = true,
  isHighlighted = false,
  textColor,
  width,
}: ScoreCellProps) {
  const color = textColor ?? (score != null ? 'var(--score-ink)' : 'var(--muted)');

  const style: CSSProperties = {
    width,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--surface)',
    borderBottom: '1px dashed var(--border)',
    borderRight: '1px dashed var(--border-light)',
    cursor: isEditable ? 'pointer' : 'default',
    transition: 'background 0.15s',
    WebkitTapHighlightColor: 'transparent',
    ...(isHighlighted ? {
      background: 'rgba(0, 137, 123, 0.05)',
    } : {}),
  };

  return (
    <div style={style} onClick={isEditable ? onTap : undefined}>
      <span
        key={score ?? 'empty'}
        style={{
          fontFamily: 'var(--font-title)',
          fontSize: 20,
          fontWeight: 700,
          color,
          animation: 'scoreEnter 0.2s ease',
        }}
      >
        {score != null ? score : (isEditable ? '–' : '')}
      </span>
    </div>
  );
}
