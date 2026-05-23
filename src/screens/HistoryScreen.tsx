/** History screen — shows all completed games. */

import { useState } from 'react';
import { useRouter } from '../hooks/useRouter';
import { loadGameHistory, deleteFromHistory, clearHistory } from '../hooks/useStorage';
import type { Game } from '../models/game';
import { getWinners } from '../models/game';
import { grandTotal } from '../models/player';

export function HistoryScreen() {
  const { navigate } = useRouter();
  const [history, setHistory] = useState<Game[]>(() => loadGameHistory());
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  function handleDelete(id: string) {
    deleteFromHistory(id);
    setHistory(prev => prev.filter(g => g.id !== id));
  }

  function handleClearAll() {
    clearHistory();
    setHistory([]);
    setShowClearConfirm(false);
  }

  return (
    <div className="screen">
      <div className="app-bar">
        <button className="app-bar-back" onClick={() => navigate('home')}>←</button>
        <span className="app-bar-title">Historia</span>
        <div className="app-bar-actions">
          {history.length > 0 && (
            <button onClick={() => setShowClearConfirm(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 18, cursor: 'pointer' }}>
              🗑️
            </button>
          )}
        </div>
      </div>

      <div className="screen-body">
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 80 }}>
            <div style={{ fontSize: 64, opacity: 0.3 }}>📜</div>
            <h3 style={{ color: 'var(--muted)', margin: '16px 0 8px', fontFamily: 'var(--font-title)', fontSize: 24 }}>Ei pelejä vielä</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontStyle: 'italic' }}>Suoritetut pelit näkyvät täällä</p>
          </div>
        ) : (
          history.map(game => {
            const winners = getWinners(game);
            const date = new Date(game.createdAt);
            const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            return (
              <div key={game.id} className="card" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>{dateStr}</span>
                  <button onClick={() => handleDelete(game.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 16, cursor: 'pointer' }}>
                    ×
                  </button>
                </div>
                {game.players.map(player => {
                  const isWinner = winners.some(w => w.name === player.name);
                  return (
                    <div key={player.name} style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
                      {isWinner && <span style={{ marginRight: 8 }}>🏆</span>}
                      <span style={{
                        flex: 1, fontWeight: isWinner ? 700 : 400,
                        color: isWinner ? 'var(--gold)' : 'var(--text-primary)',
                      }}>{player.name}</span>
                      <span style={{
                        fontWeight: 700, fontSize: 18, fontFamily: 'var(--font-title)',
                        color: isWinner ? 'var(--gold)' : 'var(--score-ink)',
                      }}>{grandTotal(player)}</span>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {showClearConfirm && (
        <div className="modal-backdrop" onClick={() => setShowClearConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Tyhjennä kaikki?</div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontStyle: 'italic' }}>
              Tämä poistaa kaiken pelihistorian. Tätä ei voi perua.
            </p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowClearConfirm(false)}>Peruuta</button>
              <button className="btn btn-danger btn-sm" onClick={handleClearAll}>Poista kaikki</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
