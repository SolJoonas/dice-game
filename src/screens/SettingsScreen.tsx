/** Settings screen — sound toggle and data management. */

import { useState } from 'react';
import { useRouter } from '../hooks/useRouter';
import { isSoundEnabled, setSoundEnabled, savePlayerPresets } from '../hooks/useStorage';

export function SettingsScreen() {
  const { navigate } = useRouter();
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [snackbar, setSnackbar] = useState('');

  function toggleSound(value: boolean) {
    setSoundEnabled(value);
    setSoundOn(value);
  }

  function clearPresets() {
    savePlayerPresets([]);
    setSnackbar('Pelaajien esiasetukset tyhjennetty');
    setTimeout(() => setSnackbar(''), 2000);
  }

  return (
    <div className="screen">
      <div className="app-bar">
        <button className="app-bar-back" onClick={() => navigate('home')}>←</button>
        <span className="app-bar-title">Asetukset</span>
        <div style={{ width: 40 }} />
      </div>

      <div className="screen-body">
        {/* Sound toggle */}
        <div className="card" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{soundOn ? '🔊' : '🔇'}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Äänitehosteet</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>Piippaus pisteen syötössä</div>
              </div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={soundOn} onChange={e => toggleSound(e.target.checked)} />
              <span className="switch-track" />
              <span className="switch-thumb" />
            </label>
          </div>
        </div>

        {/* Clear presets */}
        <div className="card" style={{ marginBottom: 8, cursor: 'pointer' }} onClick={clearPresets}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>👥</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Tyhjennä esiasetukset</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>Poista tallennetut pelaajien nimet</div>
            </div>
            <span style={{ color: 'var(--muted)' }}>›</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>Mökin tulospalvelu v1.0.0</p>
        </div>
      </div>

      {snackbar && <div className="snackbar">{snackbar}</div>}
    </div>
  );
}
