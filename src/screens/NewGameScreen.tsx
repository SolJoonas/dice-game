/** New game screen — game type selection, player setup, rule options. */

import { useState, useRef, useEffect } from 'react';
import { useRouter } from '../hooks/useRouter';
import { saveCurrentGame, savePlayerPresets, loadPlayerPresets } from '../hooks/useStorage';
import { GAME_TYPES, createGame, type GameType } from '../models/game';
import { createPlayer } from '../models/player';

export function NewGameScreen() {
  const { navigate } = useRouter();
  const [gameType, setGameType] = useState<GameType>('noppapeli');
  const [playerNames, setPlayerNames] = useState<string[]>(['']);
  const [presets] = useState<string[]>(() => loadPlayerPresets());
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resetOnOvershoot, setResetOnOvershoot] = useState(true);
  const [eliminateOnThreeMisses, setEliminateOnThreeMisses] = useState(true);
  const [pointLimit, setPointLimit] = useState(200);
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    inputRefs.current[inputRefs.current.length - 1]?.focus();
  }, [playerNames.length]);

  function addPlayerField() { setPlayerNames(prev => [...prev, '']); }
  function removePlayer(index: number) { if (playerNames.length <= 1) return; setPlayerNames(prev => prev.filter((_, i) => i !== index)); }
  function updateName(index: number, value: string) { setPlayerNames(prev => prev.map((n, i) => i === index ? value : n)); }
  function addPreset(name: string) { const emptyIdx = playerNames.findIndex(n => n.trim() === ''); if (emptyIdx >= 0) updateName(emptyIdx, name); else setPlayerNames(prev => [...prev, name]); }

  function startGame() {
    const names = playerNames.map(n => n.trim()).filter(n => n.length > 0);
    if (names.length === 0) { setSnackbar('Lisää ainakin yksi pelaaja'); setTimeout(() => setSnackbar(''), 2000); return; }
    if (new Set(names).size !== names.length) { setSnackbar('Pelaajien nimien pitää olla uniikkeja'); setTimeout(() => setSnackbar(''), 2000); return; }
    savePlayerPresets(names);
    const players = names.map(name => createPlayer(name));
    const extraData: Record<string, unknown> = {};
    if (gameType === 'mokkipeli') { extraData.resetOnOvershoot = resetOnOvershoot; extraData.eliminateOnThreeMisses = eliminateOnThreeMisses; }
    else if (gameType === 'ristiseiska') { extraData.pointLimit = pointLimit; }
    const game = createGame(players, gameType, extraData);
    saveCurrentGame(game);
    navigate('game');
  }

  return (
    <div className="screen">
      <div className="app-bar">
        <button className="app-bar-back" onClick={() => navigate('home')}>←</button>
        <span className="app-bar-title">Uusi peli</span>
        <div style={{ width: 40 }} />
      </div>
      <div className="screen-body" style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: 22, fontFamily: 'var(--font-title)', fontWeight: 700, marginBottom: 8, color: 'var(--accent)' }}>Pelityyppi</h3>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}>
          {GAME_TYPES.map(type => {
            const sel = type.id === gameType;
            return (
              <button key={type.id} onClick={() => setGameType(type.id)} style={{
                minWidth: 90, padding: '8px 16px', borderRadius: 6,
                border: `2px ${sel ? 'solid' : 'dashed'} ${sel ? 'var(--accent)' : 'var(--border)'}`,
                background: sel ? 'rgba(0,137,123,0.08)' : 'var(--surface)', cursor: 'pointer',
                textAlign: 'center', transition: 'all 0.2s', WebkitTapHighlightColor: 'transparent',
                boxShadow: sel ? 'var(--pencil-shadow-sm)' : 'none',
              }}>
                <div style={{ fontSize: 20 }}>{type.icon}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: sel ? 700 : 400, color: sel ? 'var(--accent)' : 'var(--text-secondary)', marginTop: 4 }}>{type.displayName}</div>
              </button>
            );
          })}
        </div>

        {gameType === 'mokkipeli' && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, fontFamily: 'var(--font-title)', color: 'var(--accent)' }}>🎯 Pelissäännöt</div>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 14 }}>Nollaus 25:een ylityksestä</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>Pisteet palautuvat 25:een jos ylittää 50</div>
              </div>
              <label className="switch"><input type="checkbox" checked={resetOnOvershoot} onChange={e => setResetOnOvershoot(e.target.checked)} /><span className="switch-track" /><span className="switch-thumb" /></label>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14 }}>Pudotus 3 hutista</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>Pelaaja putoaa 3 peräkkäisen nollan jälkeen</div>
              </div>
              <label className="switch"><input type="checkbox" checked={eliminateOnThreeMisses} onChange={e => setEliminateOnThreeMisses(e.target.checked)} /><span className="switch-track" /><span className="switch-thumb" /></label>
            </label>
          </div>
        )}

        {gameType === 'ristiseiska' && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, fontFamily: 'var(--font-title)', color: 'var(--accent)' }}>♣️ Pelissäännöt</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14 }}>Pisteraja</span>
              <input className="input" type="number" inputMode="numeric" value={pointLimit} onChange={e => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v > 0) setPointLimit(v); }} style={{ width: 80, textAlign: 'center', fontSize: 18, fontFamily: 'var(--font-title)', color: 'var(--score-ink)' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontStyle: 'italic' }}>Peli päättyy kun pelaaja saavuttaa tämän</div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          <span style={{ fontSize: 20 }}>✏️</span>
          <h3 style={{ fontSize: 22, fontFamily: 'var(--font-title)', fontWeight: 700, color: 'var(--accent)' }}>Pelaajat</h3>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, fontStyle: 'italic' }}>Lisää pelaajien nimet pelijärjestyksessä</p>

        <div style={{ flex: 1, overflow: 'auto', marginBottom: 8 }}>
          {playerNames.map((name, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px dashed var(--accent)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent)', fontSize: 16, fontFamily: 'var(--font-title)', flexShrink: 0, paddingRight: 3 }}>{index + 1}</div>
              <input ref={el => { inputRefs.current[index] = el; }} className="input" placeholder={`Pelaaja ${index + 1}`} value={name} onChange={e => updateName(index, e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { if (index === playerNames.length - 1) addPlayerField(); else inputRefs.current[index + 1]?.focus(); } }} style={{ flex: 1, textTransform: 'capitalize' }} />
              {playerNames.length > 1 && <button onClick={() => removePlayer(index)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 22, cursor: 'pointer', padding: '4px' }}>×</button>}
            </div>
          ))}
        </div>

        <button className="btn-ghost" onClick={addPlayerField} style={{ alignSelf: 'flex-start', marginBottom: 8 }}>+ Lisää pelaaja</button>

        {presets.length > 0 && (<>
          <hr style={{ border: 'none', borderTop: '1px dashed var(--border)', margin: '8px 0' }} />
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, fontStyle: 'italic' }}>⚡ Pikalisäys edellisestä pelistä:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {presets.map(name => (<button key={name} onClick={() => addPreset(name)} className="chip" style={{ cursor: 'pointer', border: '1px dashed var(--accent)', padding: '4px 10px', fontSize: 14, color: 'var(--accent)' }}>👤 {name}</button>))}
          </div>
        </>)}

        <button id="btn-start-game" className="btn btn-primary btn-full" onClick={startGame}>▶ Aloita peli</button>
        <div style={{ height: 8 }} />
      </div>
      {snackbar && <div className="snackbar">{snackbar}</div>}
    </div>
  );
}
