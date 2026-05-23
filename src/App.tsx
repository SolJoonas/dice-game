/** Root app component — routes to the correct screen based on hash. */

import { RouterProvider, useRouter } from './hooks/useRouter';
import { loadCurrentGame } from './hooks/useStorage';
import { HomeScreen } from './screens/HomeScreen';
import { NewGameScreen } from './screens/NewGameScreen';
import { GameScreen } from './screens/GameScreen';
import { MokkipeliGameScreen } from './screens/MokkipeliGameScreen';
import { RistiseiskaGameScreen } from './screens/RistiseiskaGameScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';

function Router() {
  const { route } = useRouter();

  switch (route.page) {
    case 'new-game':
      return <NewGameScreen />;
    case 'game': {
      const game = loadCurrentGame();
      if (!game) return <HomeScreen />;
      switch (game.gameType) {
        case 'mokkipeli': return <MokkipeliGameScreen />;
        case 'ristiseiska': return <RistiseiskaGameScreen />;
        default: return <GameScreen />;
      }
    }
    case 'history':
      return <HistoryScreen />;
    case 'settings':
      return <SettingsScreen />;
    default:
      return <HomeScreen />;
  }
}

export default function App() {
  return (
    <RouterProvider>
      <Router />
    </RouterProvider>
  );
}
