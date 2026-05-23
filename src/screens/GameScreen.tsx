/** Noppapeli game screen — the active scorecard during gameplay. */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from '../hooks/useRouter';
import { loadCurrentGame, saveCurrentGame, addToHistory, clearCurrentGame } from '../hooks/useStorage';
import { playBlip } from '../hooks/useSound';
import type { Game } from '../models/game';
import { getWinners } from '../models/game';
import type { Player } from '../models/player';
import { getScore, setScore, isComplete, grandTotal, upperBonus, pointsToBonus } from '../models/player';
import type { ScorecardCategory } from '../models/scorecard';
import { ALL_PLAYABLE } from '../models/scorecard';
import { ScorecardTable } from '../components/ScorecardTable';
import { ScoreInputDialog } from '../components/ScoreInputDialog';

export function GameScreen() {
  const { navigate } = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [editingCell, setEditingCell] = useState<{ playerIndex: number; category: ScorecardCategory } | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  useEffect(() => {
    const loaded = loadCurrentGame();
    if (loaded) setGame(loaded);
    else navigate('home');
  }, [navigate]);

  const save = useCallback((g: Game) => {
    const updated = { ...g, updatedAt: new Date().toISOString() };
    saveCurrentGame(updated);
    setGame(updated);
  }, []);

  if (!game) return null;

  const completedCats = game.players.reduce((count, player) =>
    count + ALL_PLAYABLE.filter(cat => getScore(player, cat) !== null).length, 0);
  const totalCats = ALL_PLAYABLE.length * game.players.length;
  const winners = getWinners(game);
  const sorted = [...game.players].sort((a, b) => grandTotal(b) - grandTotal(a));

  function handleScoreTap(pi: number, cat: ScorecardCategory) { setEditingCell({ playerIndex: pi, category: cat }); }

  function handleScoreSubmit(value: number | null) {
    if (!game || !editingCell) return;
    if (value === null) { setEditingCell(null); return; }
    const player = game.players[editingCell.playerIndex];
    const up: Player = value === -1 ? setScore(player, editingCell.category, null) : setScore(player, editingCell.category, value);
    const ups = game.players.map((p, i) => i === editingCell.playerIndex ? up : p);
    const allDone = ups.every(p => isComplete(p));
    save({ ...game, players: ups, state: allDone ? 'completed' : 'inProgress' });
    playBlip();
    setEditingCell(null);
    if (allDone) setShowComplete(true);
  }

  function handleFinish() { if (!game) return; addToHistory(game); clearCurrentGame(); navigate('home'); }

  return (
    <div className="screen" style={{ height: '100dvh', maxHeight: '100dvh' }}>
      <div className="app-bar">
        <button className="app-bar-back" onClick={() => setShowLeaveConfirm(true)}>←</button>
        <span className="app-bar-title">Noppapeli</span>
        <div className="app-bar-actions">
          <button onClick={() => setShowLeaderboard(true)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>🏆</button>
          <span style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>{completedCats}/{totalCats}</span>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ScorecardTable players={game.players} onScoreTap={handleScoreTap} />
      </div>

      {editingCell && (
        <ScoreInputDialog
          category={editingCell.category}
          currentScore={getScore(game.players[editingCell.playerIndex], editingCell.category)}
          onSubmit={handleScoreSubmit}
          onClose={() => setEditingCell(null)}
        />
      )}

      {showLeaderboard && (
        <div className="modal-backdrop" onClick={() => setShowLeaderboard(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Tilanne</div>
            {sorted.map((player, rank) => (
              <div key={player.name} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', gap: 8 }}>
                <span style={{ width: 32, fontSize: rank < 3 ? 18 : 14 }}>{rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}.`}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: rank === 0 ? 'var(--gold)' : 'var(--text-primary)' }}>{player.name}</div>
                  <div style={{ fontSize: 12, color: upperBonus(player) > 0 ? 'var(--accent)' : 'var(--muted)', fontStyle: 'italic' }}>
                    {upperBonus(player) > 0 ? '✅ Bonus saavutettu!' : `${pointsToBonus(player)} p bonukseen`}
                  </div>
                </div>
                <span style={{
                  fontSize: 22, fontWeight: 700,
                  fontFamily: 'var(--font-title)',
                  color: rank === 0 ? 'var(--gold)' : 'var(--score-ink)',
                }}>{grandTotal(player)}</span>
              </div>
            ))}
            <div className="modal-actions"><button className="btn btn-primary btn-sm" onClick={() => setShowLeaderboard(false)}>Sulje</button></div>
          </div>
        </div>
      )}

      {showComplete && (
        <div className="modal-backdrop">
          <div className="modal" style={{ textAlign: 'center' }}>
            <div className="modal-title">Peli ohi!</div>
            <div style={{ fontSize: 48 }}>🏆</div>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: 22, margin: '8px 0' }}>{winners.length > 1 ? 'Tasapeli!' : 'Voittaja!'}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gold)' }}>{winners.map(w => w.name).join(' & ')}</div>
            <div style={{ fontSize: 18, fontFamily: 'var(--font-title)', color: 'var(--score-ink)', marginBottom: 16 }}>{grandTotal(winners[0])} pistettä</div>
            {game.players.map(p => (
              <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                <span>{p.name}</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-title)', color: winners.some(w => w.name === p.name) ? 'var(--gold)' : 'var(--text-secondary)' }}>{grandTotal(p)}</span>
              </div>
            ))}
            <div className="modal-actions"><button className="btn btn-primary" onClick={handleFinish}>Lopeta</button></div>
          </div>
        </div>
      )}

      {showLeaveConfirm && (
        <div className="modal-backdrop" onClick={() => setShowLeaveConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Poistu pelistä?</div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontStyle: 'italic' }}>Pelisi tallentuu automaattisesti. Voit jatkaa sitä kotinäytöltä.</p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowLeaveConfirm(false)}>Jää</button>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('home')}>Poistu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
