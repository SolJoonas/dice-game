/** Pisteen syöttödialogi noppapelin tulosten kirjaamiseen. */

import { useState } from 'react';
import type { ScorecardCategory } from '../models/scorecard';
import { getRankedScores } from '../models/scorecard';

interface ScoreInputDialogProps {
  category: ScorecardCategory;
  currentScore: number | null;
  onSubmit: (value: number | null) => void;
  onClose: () => void;
}

const RANK_EMOJI = ['🥇', '🥈', '🥉'];

export function ScoreInputDialog({ category, currentScore, onSubmit, onClose }: ScoreInputDialogProps) {
  const [value, setValue] = useState(currentScore?.toString() ?? '');
  const ranked = getRankedScores(category);

  function handleSubmit() {
    const trimmed = value.trim();
    if (trimmed === '') {
      onSubmit(-1);
      return;
    }
    const num = parseInt(trimmed, 10);
    if (isNaN(num) || num < 0) return;
    onSubmit(num);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{category.name}</div>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 16, fontStyle: 'italic' }}>
          {category.description}
        </p>

        <input
          className="input"
          type="number"
          inputMode="numeric"
          placeholder={`0 - ${category.maxScore}`}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{
            fontSize: 28,
            fontFamily: 'var(--font-title)',
            fontWeight: 700,
            color: 'var(--score-ink)',
            textAlign: 'center',
            borderBottom: '3px dashed var(--accent)',
          }}
        />

        <p style={{ fontSize: 16, color: 'var(--text-secondary)', margin: '16px 0 8px', fontStyle: 'italic' }}>
          Pikavalinta:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setValue('0')}
            style={{ borderColor: 'var(--border)', color: 'var(--error)' }}
          >
            ❌ 0
          </button>
          {ranked.map((val, i) => (
            <button
              key={val}
              className="btn btn-outline btn-sm"
              onClick={() => setValue(val.toString())}
              style={{
                borderColor: i === 0 ? 'var(--gold)' : 'var(--border)',
                borderStyle: 'dashed',
                color: i === 0 ? 'var(--gold)' : 'var(--score-ink)',
                background: i === 0 ? 'rgba(255, 179, 0, 0.1)' : 'transparent',
                fontWeight: i === 0 ? 700 : 400,
              }}
            >
              {RANK_EMOJI[i] ?? '•'} {val}
            </button>
          ))}
        </div>

        <div className="modal-actions">
          {currentScore != null && (
            <button className="btn-ghost" style={{ color: 'var(--error)' }} onClick={() => onSubmit(-1)}>
              TYHJENNÄ
            </button>
          )}
          <button className="btn-ghost" onClick={onClose}>PERUUTA</button>
          <button className="btn btn-primary btn-sm" onClick={handleSubmit}>OK</button>
        </div>
      </div>
    </div>
  );
}
