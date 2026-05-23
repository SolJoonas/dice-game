/** Lightweight hash-based router. Zero external dependencies. */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type Route =
  | { page: 'home' }
  | { page: 'new-game' }
  | { page: 'game' }
  | { page: 'history' }
  | { page: 'settings' };

function parseHash(): Route {
  const hash = window.location.hash.replace('#', '') || '/';
  switch (hash) {
    case '/new-game': return { page: 'new-game' };
    case '/game': return { page: 'game' };
    case '/history': return { page: 'history' };
    case '/settings': return { page: 'settings' };
    default: return { page: 'home' };
  }
}

interface RouterContextValue {
  route: Route;
  navigate: (page: Route['page']) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const handler = () => setRoute(parseHash());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = useCallback((page: Route['page']) => {
    const path = page === 'home' ? '/' : `/${page}`;
    window.location.hash = path;
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('home');
    }
  }, [navigate]);

  return (
    <RouterContext.Provider value={{ route, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
