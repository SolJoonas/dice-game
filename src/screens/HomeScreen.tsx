/** Kotinäyttö — päävalikko. */

import { useEffect, useState } from 'react';
import { useRouter } from '../hooks/useRouter';
import { loadCurrentGame } from '../hooks/useStorage';
import { RetroHeader } from '../components/RetroHeader';
import type { Game } from '../models/game';

export function HomeScreen() {
  const { navigate } = useRouter();
  const [currentGame, setCurrentGame] = useState<Game | null>(null);

  useEffect(() => {
    setCurrentGame(loadCurrentGame());
  }, []);

  return (
    <div className="screen">
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
      }}>
        <div style={{ flex: 1 }} />

        <RetroHeader subtitle="TULOSPALVELU" scale={1.2} />

        <div style={{ height: 32 }} />

        {currentGame && (
          <>
            <button
              id="btn-resume"
              className="btn btn-success btn-full"
              onClick={() => navigate('game')}
            >
              ▶ Jatka
            </button>
            <p style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              textAlign: 'center',
              marginTop: 8,
              fontStyle: 'italic',
            }}>
              🎮 {currentGame.players.map(p => p.name).join(', ')}
            </p>
            <div style={{ height: 16 }} />
          </>
        )}

        <button
          id="btn-new-game"
          className="btn btn-primary btn-full"
          onClick={() => navigate('new-game')}
        >
          🎲 Uusi peli
        </button>

        <div style={{ height: 12 }} />

        <button
          id="btn-history"
          className="btn btn-outline-cyan btn-full"
          onClick={() => navigate('history')}
        >
          📜 Historia
        </button>

        <div style={{ height: 12 }} />

        <button
          id="btn-settings"
          className="btn btn-outline-purple btn-full"
          onClick={() => navigate('settings')}
        >
          ⚙️ Asetukset
        </button>

        <div style={{ height: 12 }} />

        <button
          id="btn-help"
          className="btn btn-outline btn-full"
          onClick={() => navigate('help')}
        >
          ❓ Ohje
        </button>

        <div style={{ flex: 1 }} />
      </div>
    </div>
  );
}
