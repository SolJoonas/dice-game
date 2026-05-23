/** Ristiseiska game screen — card game penalty tracker, scrollable card list. */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from '../hooks/useRouter';
import { loadCurrentGame, saveCurrentGame, addToHistory, clearCurrentGame } from '../hooks/useStorage';
import { playBlip } from '../hooks/useSound';
import type { Game } from '../models/game';
import {
  createRistiseiskaPlayer, addRoundScore, ristiseiskaGrandTotal,
  setRoundScoreAt, removeRoundScoreAt, type RistiseiskaPlayer,
} from '../models/ristiseiska-player';
import { CardCalculatorDialog } from '../components/CardCalculatorDialog';

export function RistiseiskaGameScreen() {
  const { navigate } = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<RistiseiskaPlayer[]>([]);
  const [pointLimit, setPointLimit] = useState(200);
  // Single-player add (click card to add score for that player)
  const [addingFor, setAddingFor] = useState<number | null>(null);
  // Editing a past round score
  const [editing, setEditing] = useState<{ pi: number; ri: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showPointLimitDialog, setShowPointLimitDialog] = useState(false);
  const [pointLimitInput, setPointLimitInput] = useState('200');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameOverDialog, setGameOverDialog] = useState(false);

  useEffect(() => {
    const loaded = loadCurrentGame();
    if (!loaded || loaded.gameType !== 'ristiseiska') { navigate('home'); return; }
    setGame(loaded);
    setPointLimit((loaded.extraData.pointLimit as number) ?? 200);
    setPointLimitInput(String((loaded.extraData.pointLimit as number) ?? 200));
    const saved = loaded.extraData.ristiseiskaPlayers as RistiseiskaPlayer[] | undefined;
    if (saved) setPlayers(saved);
    else setPlayers(loaded.players.map(p => createRistiseiskaPlayer(p.name)));
  }, [navigate]);

  const save = useCallback((g: Game, ps: RistiseiskaPlayer[], pl: number) => {
    g.extraData.ristiseiskaPlayers = ps;
    g.extraData.pointLimit = pl;
    g.updatedAt = new Date().toISOString();
    saveCurrentGame(g);
    setGame({ ...g });
  }, []);

  if (!game) return null;

  function handleSingleAdd(total: number) {
    if (addingFor === null || !game) return;
    const updated = addRoundScore(players[addingFor], total);
    const newPlayers = players.map((p, i) => i === addingFor ? updated : p);
    setPlayers(newPlayers); save(game, newPlayers, pointLimit); playBlip(); setAddingFor(null);
    checkGameOver(newPlayers);
  }

  function checkGameOver(ps: RistiseiskaPlayer[]) {
    if (!game) return;
    if (ps.some(p => ristiseiskaGrandTotal(p) >= pointLimit)) {
      game.state = 'completed'; addToHistory(game); clearCurrentGame(); setGameOverDialog(true);
    }
  }

  function handleEditSave() {
    if (!editing || !game) return;
    const val = parseInt(editValue, 10);
    if (isNaN(val) || val < 0) return;
    const updated = setRoundScoreAt(players[editing.pi], editing.ri, val);
    const newPlayers = players.map((p, i) => i === editing.pi ? updated : p);
    setPlayers(newPlayers); save(game, newPlayers, pointLimit); setEditing(null);
  }

  function handleEditDelete() {
    if (!editing || !game) return;
    const updated = removeRoundScoreAt(players[editing.pi], editing.ri);
    const newPlayers = players.map((p, i) => i === editing.pi ? updated : p);
    setPlayers(newPlayers); save(game, newPlayers, pointLimit); setEditing(null);
  }

  function handleSetPointLimit() {
    const val = parseInt(pointLimitInput, 10);
    if (!isNaN(val) && val > 0 && game) { setPointLimit(val); save(game, players, val); }
    setShowPointLimitDialog(false);
  }

  const sorted = [...players].sort((a, b) => ristiseiskaGrandTotal(a) - ristiseiskaGrandTotal(b));
  const winner = sorted[0];

  return (
    <div className="screen">
      <div className="app-bar">
        <button className="app-bar-back" onClick={() => navigate('home')}>←</button>
        <span className="app-bar-title">Ristiseiska</span>
        <div className="app-bar-actions">
          <button onClick={() => navigate('help')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>❓</button>
          <button onClick={() => setShowLeaderboard(true)}
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>🏆</button>
          <button onClick={() => { setPointLimitInput(String(pointLimit)); setShowPointLimitDialog(true); }}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer', fontStyle: 'italic' }}>
            Raja: {pointLimit}
          </button>
        </div>
      </div>

      {/* Scrollable card list */}
      <div style={{ flex: 1, overflow: 'auto', padding: 12, paddingBottom: 24 }}>
        {players.map((player, pi) => {
          const total = ristiseiskaGrandTotal(player);
          const rank = sorted.indexOf(player);
          const pct = Math.min((total / pointLimit) * 100, 100);
          return (
            <div key={player.name}
              className="player-card"
              style={{ marginBottom: 12, cursor: 'pointer' }}
              onClick={() => setAddingFor(pi)}
            >
              <div className="player-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>
                    {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}.`}
                  </span>
                  <div className="player-card-name">{player.name}</div>
                </div>
                <div className="player-card-total" style={{
                  color: rank === 0 ? 'var(--accent)' : total >= pointLimit * 0.8 ? 'var(--error)' : 'var(--text-primary)',
                }}>{total}</div>
              </div>

              <div className="progress-bar" style={{ margin: '4px 0' }}>
                <div className="progress-bar-fill" style={{
                  width: `${pct}%`,
                  background: total >= pointLimit * 0.8 ? 'var(--error)' : 'var(--sky)',
                }} />
              </div>

              {/* Round scores — tap to edit */}
              {player.roundScores.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}
                  onClick={e => e.stopPropagation()}>
                  {player.roundScores.map((s, ri) => (
                    <button key={ri} className="chip chip-round"
                      style={s === 0 ? { background: 'rgba(0,137,123,0.08)', border: '1px dashed var(--accent)', color: 'var(--accent)' } : {}}
                      onClick={() => { setEditing({ pi, ri }); setEditValue(String(s)); }}
                    >
                      R{ri + 1}: {s}
                    </button>
                  ))}
                </div>
              )}

              {player.roundScores.length === 0 && (
                <div style={{ textAlign: 'center', padding: '8px 0', color: 'var(--muted)', fontStyle: 'italic', fontSize: 13 }}>
                  Paina lisätäksesi pisteitä
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Single-player card calculator */}
      {addingFor !== null && (
        <CardCalculatorDialog
          key={`single-${addingFor}`}
          playerName={players[addingFor].name}
          roundNumber={players[addingFor].roundScores.length + 1}
          playerIndex={1}
          totalPlayers={1}
          initialPanttiCount={0}
          onPanttiChanged={() => {}}
          onSubmit={handleSingleAdd}
          onCancel={() => setAddingFor(null)}
        />
      )}

      {/* Edit round score modal */}
      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Muokkaa kierrosta {editing.ri + 1}</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>
              {players[editing.pi].name} — kierros {editing.ri + 1}
            </p>
            <input className="input" type="number" inputMode="numeric" autoFocus
              min={0} value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEditSave()}
              style={{ fontSize: 28, textAlign: 'center', fontFamily: 'var(--font-title)', color: 'var(--score-ink)' }}
            />
            <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
              <button className="btn-ghost" style={{ color: 'var(--error)', fontSize: 14 }} onClick={handleEditDelete}>🗑 Poista</button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-ghost" onClick={() => setEditing(null)}>Peruuta</button>
                <button className="btn btn-primary btn-sm" onClick={handleEditSave}>Tallenna</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {showLeaderboard && (
        <div className="modal-backdrop" onClick={() => setShowLeaderboard(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Tilanne</div>
            {sorted.map((player, rank) => (
              <div key={player.name} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', gap: 8 }}>
                <span style={{ width: 32, fontSize: rank < 3 ? 18 : 14 }}>
                  {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}.`}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: rank === 0 ? 'var(--gold)' : 'var(--text-primary)' }}>{player.name}</div>
                </div>
                <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-title)', color: rank === 0 ? 'var(--gold)' : 'var(--score-ink)' }}>
                  {ristiseiskaGrandTotal(player)}
                </span>
              </div>
            ))}
            <div className="modal-actions">
              <button className="btn btn-primary btn-sm" onClick={() => setShowLeaderboard(false)}>Sulje</button>
            </div>
          </div>
        </div>
      )}

      {/* Point limit dialog */}
      {showPointLimitDialog && (
        <div className="modal-backdrop" onClick={() => setShowPointLimitDialog(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Pisteraja</div>
            <input className="input" type="number" inputMode="numeric" autoFocus
              value={pointLimitInput} onChange={e => setPointLimitInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSetPointLimit()}
              style={{ fontSize: 28, textAlign: 'center', fontFamily: 'var(--font-title)', color: 'var(--score-ink)' }} />
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8, fontStyle: 'italic' }}>Peli päättyy kun pelaaja saavuttaa...</p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowPointLimitDialog(false)}>Peruuta</button>
              <button className="btn btn-primary btn-sm" onClick={handleSetPointLimit}>Aseta</button>
            </div>
          </div>
        </div>
      )}

      {/* Game over dialog */}
      {gameOverDialog && winner && (
        <div className="modal-backdrop">
          <div className="modal" style={{ textAlign: 'center' }}>
            <div className="modal-title">Peli ohi!</div>
            <div style={{ fontSize: 48 }}>🏆</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-title)', color: 'var(--gold)', margin: '8px 0' }}>{winner.name} voittaa!</div>
            <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>vain {ristiseiskaGrandTotal(winner)} rangaistuspistettä</div>
            <div style={{ height: 16 }} />
            {sorted.map(p => (
              <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                <span>{p.name}</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-title)', color: p === winner ? 'var(--gold)' : 'var(--text-secondary)' }}>{ristiseiskaGrandTotal(p)}</span>
              </div>
            ))}
            <div className="modal-actions"><button className="btn btn-primary" onClick={() => navigate('home')}>Lopeta</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
