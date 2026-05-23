/** Mökkipeli game screen — pin throwing to 50, scrollable card list. */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from '../hooks/useRouter';
import { loadCurrentGame, saveCurrentGame, addToHistory, clearCurrentGame } from '../hooks/useStorage';
import { playBlip } from '../hooks/useSound';
import type { Game } from '../models/game';
import {
  createMokkipeliPlayer, addThrow, getTotal, consecutiveMisses,
  hasWon, setThrowAt, removeThrowAt, type MokkipeliPlayer,
} from '../models/mokkipeli-player';

export function MokkipeliGameScreen() {
  const { navigate } = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<MokkipeliPlayer[]>([]);
  const [resetOnOvershoot, setResetOnOvershoot] = useState(true);
  const [eliminateOnThreeMisses, setEliminateOnThreeMisses] = useState(true);
  // Which player's throw input is open (null = closed)
  const [throwingFor, setThrowingFor] = useState<number | null>(null);
  // Editing a past throw: { playerIdx, throwIdx }
  const [editing, setEditing] = useState<{ pi: number; ti: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [winnerDialog, setWinnerDialog] = useState<MokkipeliPlayer | null>(null);

  useEffect(() => {
    const loaded = loadCurrentGame();
    if (!loaded || loaded.gameType !== 'mokkipeli') { navigate('home'); return; }
    setGame(loaded);
    setResetOnOvershoot((loaded.extraData.resetOnOvershoot as boolean) ?? true);
    setEliminateOnThreeMisses((loaded.extraData.eliminateOnThreeMisses as boolean) ?? true);
    const saved = loaded.extraData.mokkipeliPlayers as MokkipeliPlayer[] | undefined;
    if (saved) setPlayers(saved);
    else setPlayers(loaded.players.map(p => createMokkipeliPlayer(p.name)));
  }, [navigate]);

  const save = useCallback((g: Game, ps: MokkipeliPlayer[]) => {
    g.extraData.mokkipeliPlayers = ps;
    g.updatedAt = new Date().toISOString();
    saveCurrentGame(g);
    setGame({ ...g });
  }, []);

  if (!game) return null;

  function recordThrow(pi: number, score: number) {
    if (!game) return;
    const updated = addThrow(players[pi], score, resetOnOvershoot, eliminateOnThreeMisses);
    const newPlayers = players.map((p, i) => i === pi ? updated : p);
    setPlayers(newPlayers);
    save(game, newPlayers);
    playBlip();
    setThrowingFor(null);
    if (hasWon(updated, resetOnOvershoot)) {
      game.state = 'completed'; addToHistory(game); clearCurrentGame(); setWinnerDialog(updated);
    }
  }

  function handleEditSave() {
    if (!editing || !game) return;
    const val = parseInt(editValue, 10);
    if (isNaN(val) || val < 0 || val > 12) return;
    const updated = setThrowAt(players[editing.pi], editing.ti, val, eliminateOnThreeMisses);
    const newPlayers = players.map((p, i) => i === editing.pi ? updated : p);
    setPlayers(newPlayers);
    save(game, newPlayers);
    setEditing(null);
  }

  function handleEditDelete() {
    if (!editing || !game) return;
    const updated = removeThrowAt(players[editing.pi], editing.ti, eliminateOnThreeMisses);
    const newPlayers = players.map((p, i) => i === editing.pi ? updated : p);
    setPlayers(newPlayers);
    save(game, newPlayers);
    setEditing(null);
  }

  const sorted = [...players].sort((a, b) => getTotal(b, resetOnOvershoot) - getTotal(a, resetOnOvershoot));

  return (
    <div className="screen">
      <div className="app-bar">
        <button className="app-bar-back" onClick={() => navigate('home')}>←</button>
        <span className="app-bar-title">Mökkipeli</span>
        <div className="app-bar-actions">
          <button onClick={() => setShowLeaderboard(true)}
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>🏆</button>
          <span style={{ display: 'flex', gap: 2 }}>
            {resetOnOvershoot && <span title="Reset to 25 on overshoot">↩️</span>}
            {eliminateOnThreeMisses && <span title="3-miss elimination">💀</span>}
          </span>
        </div>
      </div>

      {/* Scrollable card list */}
      <div style={{ flex: 1, overflow: 'auto', padding: 12, paddingBottom: 24 }}>
        {players.map((player, pi) => {
          const total = getTotal(player, resetOnOvershoot);
          return (
            <div key={player.name}
              className="player-card"
              style={{ marginBottom: 12, opacity: player.isEliminated ? 0.55 : 1, cursor: player.isEliminated ? 'default' : 'pointer' }}
              onClick={() => { if (!player.isEliminated) setThrowingFor(pi); }}
            >
              <div className="player-card-header">
                <div className="player-card-name" style={{
                  color: player.isEliminated ? 'var(--muted)' : 'var(--accent)',
                  textDecoration: player.isEliminated ? 'line-through' : 'none',
                }}>{player.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <div className="player-card-total" style={{
                    color: player.isEliminated ? 'var(--muted)' : total === 50 ? 'var(--gold)' : 'var(--score-ink)',
                  }}>{total}</div>
                  <span style={{ fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--font-title)' }}>/ 50</span>
                </div>
              </div>

              <div className="progress-bar" style={{ margin: '4px 0' }}>
                <div className="progress-bar-fill" style={{
                  width: `${(total / 50) * 100}%`,
                  background: player.isEliminated ? 'var(--muted)' : total >= 45 ? 'var(--gold)' : 'var(--accent)',
                }} />
              </div>

              {eliminateOnThreeMisses && consecutiveMisses(player) > 0 && !player.isEliminated && (
                <div style={{ fontSize: 12, color: consecutiveMisses(player) >= 2 ? 'var(--error)' : 'var(--muted)', fontStyle: 'italic' }}>
                  ⚠️ {consecutiveMisses(player)}/3 hutia
                </div>
              )}
              {player.isEliminated && (
                <div style={{ fontSize: 12, color: 'var(--error)', fontStyle: 'italic' }}>❌ Pudonnut</div>
              )}

              {/* Throw history — tap a chip to edit */}
              {player.throws.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}
                  onClick={e => e.stopPropagation()}>
                  {player.throws.map((t, ti) => (
                    <button key={ti} className="chip chip-round"
                      style={t === 0 ? { background: 'rgba(229,57,53,0.08)', border: '1px dashed var(--error)', color: 'var(--error)' } : {}}
                      onClick={() => { setEditing({ pi, ti }); setEditValue(String(t)); }}
                    >
                      {ti + 1}: {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Throw input modal */}
      {throwingFor !== null && (
        <div className="modal-backdrop" onClick={() => setThrowingFor(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{players[throwingFor].name} heittää</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              <button onClick={() => recordThrow(throwingFor, 0)} style={{
                width: 52, height: 44, border: '2px dashed var(--error)', borderRadius: 6,
                background: 'rgba(229,57,53,0.08)', color: 'var(--error)',
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-title)',
              }}>❌ 0</button>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(val => (
                <button key={val} onClick={() => recordThrow(throwingFor, val)} style={{
                  width: 52, height: 44, border: '2px dashed var(--border)', borderRadius: 6,
                  background: 'var(--surface)', color: 'var(--score-ink)',
                  fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-title)',
                  boxShadow: 'var(--pencil-shadow-sm)',
                }}>{val}</button>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setThrowingFor(null)}>Peruuta</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit throw modal */}
      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Muokkaa heittoa {editing.ti + 1}</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>
              {players[editing.pi].name} — heitto #{editing.ti + 1}
            </p>
            <input className="input" type="number" inputMode="numeric" autoFocus
              min={0} max={12} value={editValue}
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
            {sorted.map((player, rank) => {
              const total = getTotal(player, resetOnOvershoot);
              return (
                <div key={player.name} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', gap: 8 }}>
                  <span style={{ width: 32, fontSize: rank < 3 ? 18 : 14 }}>
                    {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}.`}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: 700,
                      color: player.isEliminated ? 'var(--muted)' : rank === 0 ? 'var(--gold)' : 'var(--text-primary)',
                      textDecoration: player.isEliminated ? 'line-through' : 'none',
                    }}>{player.name}</div>
                  </div>
                  <span style={{
                    fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-title)',
                    color: rank === 0 ? 'var(--gold)' : 'var(--score-ink)',
                  }}>{total}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>/ 50</span>
                </div>
              );
            })}
            <div className="modal-actions">
              <button className="btn btn-primary btn-sm" onClick={() => setShowLeaderboard(false)}>Sulje</button>
            </div>
          </div>
        </div>
      )}

      {/* Winner dialog */}
      {winnerDialog && (
        <div className="modal-backdrop">
          <div className="modal" style={{ textAlign: 'center' }}>
            <div className="modal-title">Voittaja!</div>
            <div style={{ fontSize: 48 }}>🏆</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-title)', color: 'var(--gold)', margin: '8px 0' }}>
              {winnerDialog.name}
            </div>
            <div>saavutti 50 pistettä!</div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => navigate('home')}>Lopeta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
