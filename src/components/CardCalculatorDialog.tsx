/** Card calculator dialog for Ristiseiska penalty entry. */

import { useState } from 'react';
import { CARD_VALUES } from '../models/ristiseiska-player';

interface CardCalculatorDialogProps {
  playerName: string;
  roundNumber: number;
  playerIndex: number;
  totalPlayers: number;
  initialPanttiCount: number;
  onPanttiChanged: (count: number) => void;
  onSubmit: (total: number) => void;
  onCancel: () => void;
}

export function CardCalculatorDialog({
  playerName,
  roundNumber,
  playerIndex,
  totalPlayers,
  initialPanttiCount,
  onPanttiChanged,
  onSubmit,
  onCancel,
}: CardCalculatorDialogProps) {
  const [tappedCards, setTappedCards] = useState<{ label: string; value: number }[]>([]);
  const [panttiCount, setPanttiCount] = useState(initialPanttiCount);

  const cardTotal = tappedCards.reduce((sum, c) => sum + c.value, 0);
  const total = cardTotal + (panttiCount * 25);

  function addCard(card: { label: string; value: number }) {
    setTappedCards(prev => [...prev, card]);
  }

  function undoLast() {
    setTappedCards(prev => prev.slice(0, -1));
  }

  function addPantti() {
    if (panttiCount >= 1) return;
    const newCount = panttiCount + 1;
    setPanttiCount(newCount);
    onPanttiChanged(newCount);
  }

  function removePantti() {
    if (panttiCount > 0) {
      const newCount = panttiCount - 1;
      setPanttiCount(newCount);
      onPanttiChanged(newCount);
    }
  }

  const FACE_CARDS = ['J', 'Q', 'K', 'A'];

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>Kierros {roundNumber}</div>
        <div className="modal-title">
          {playerName} ({playerIndex}/{totalPlayers})
        </div>

        {/* Running total */}
        <div style={{
          background: 'var(--bg-lines)',
          borderRadius: 8,
          padding: '8px 12px',
          textAlign: 'center',
          marginBottom: 10,
          border: '1px dashed var(--border)',
        }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>Rangaistus</div>
          <div style={{
            fontSize: 36,
            fontFamily: 'var(--font-title)',
            fontWeight: 700,
            color: 'var(--score-ink)',
          }}>{total}</div>
          {(tappedCards.length > 0 || panttiCount > 0) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
              {tappedCards.map((c, i) => (
                <span key={i} className="chip">{c.label}</span>
              ))}
              {panttiCount > 0 && <span className="chip chip-error">P +25</span>}
            </div>
          )}
        </div>

        {/* Card buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 10 }}>
          {CARD_VALUES.map(card => {
            const isFace = FACE_CARDS.includes(card.label);
            return (
              <button
                key={card.label}
                onClick={() => addCard(card)}
                style={{
                  width: 44,
                  height: 44,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px ${isFace ? 'solid' : 'dashed'} ${isFace ? 'var(--coral)' : 'var(--border)'}`,
                  borderRadius: 6,
                  background: isFace ? 'rgba(255, 111, 97, 0.1)' : 'var(--surface)',
                  color: isFace ? 'var(--coral)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: 'var(--font-title)',
                  padding: 0,
                  WebkitTapHighlightColor: 'transparent',
                  boxShadow: 'var(--pencil-shadow-sm)',
                }}
              >
                {card.label}
                {isFace && <span style={{ fontSize: 9, color: 'var(--muted)' }}>{card.value}</span>}
              </button>
            );
          })}
          {/* Undo button */}
          {tappedCards.length > 0 ? (
            <button
              onClick={undoLast}
              style={{
                width: 44,
                height: 44,
                border: '2px dashed var(--border)',
                borderRadius: 6,
                background: 'var(--surface)',
                color: 'var(--muted)',
                cursor: 'pointer',
                fontSize: 18,
                fontFamily: 'inherit',
                padding: 0,
                WebkitTapHighlightColor: 'transparent',
              }}
              title="Undo last card"
            >
              ↩
            </button>
          ) : (
            <div style={{ width: 44 }} />
          )}
        </div>

        {/* Pantti section */}
        <div style={{
          padding: '8px 12px',
          background: 'rgba(229, 57, 53, 0.06)',
          borderRadius: 6,
          border: '2px dashed rgba(229, 57, 53, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
          <span style={{ fontSize: 14, color: 'var(--error)', fontFamily: 'var(--font-body)' }}>Pantti (+25)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={removePantti}
              disabled={panttiCount <= 0}
              style={{
                background: 'none', border: 'none', color: 'var(--error)',
                fontSize: 22, cursor: 'pointer', padding: 0, opacity: panttiCount > 0 ? 1 : 0.3,
              }}
            >
              −
            </button>
            <span style={{
              fontSize: 20, fontWeight: 700, color: 'var(--error)',
              fontFamily: 'var(--font-title)',
              minWidth: 24, textAlign: 'center',
            }}>
              {panttiCount}
            </span>
            <button
              onClick={addPantti}
              disabled={panttiCount >= 1}
              style={{
                background: 'none', border: 'none', color: 'var(--error)',
                fontSize: 22, cursor: 'pointer', padding: 0, opacity: panttiCount >= 1 ? 0.3 : 1,
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <button className="btn-ghost" onClick={onCancel}>PERUUTA</button>
          <button className="btn btn-primary btn-sm" onClick={() => onSubmit(total)}>
            OK ({total} p)
          </button>
        </div>
      </div>
    </div>
  );
}
