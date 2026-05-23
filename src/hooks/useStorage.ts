/** localStorage wrapper for game persistence. Zero dependencies. */

import type { Game } from '../models/game';

const KEYS = {
  currentGame: 'dice_current_game',
  gameHistory: 'dice_game_history',
  playerPresets: 'dice_player_presets',
  soundEnabled: 'dice_sound_enabled',
} as const;

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Current game ──────────────────────────────────────────────

export function saveCurrentGame(game: Game): void {
  writeJSON(KEYS.currentGame, game);
}

export function loadCurrentGame(): Game | null {
  return readJSON<Game | null>(KEYS.currentGame, null);
}

export function clearCurrentGame(): void {
  localStorage.removeItem(KEYS.currentGame);
}

// ── Game history ──────────────────────────────────────────────

export function loadGameHistory(): Game[] {
  return readJSON<Game[]>(KEYS.gameHistory, []);
}

export function addToHistory(game: Game): void {
  const history = loadGameHistory();
  history.unshift(game);
  writeJSON(KEYS.gameHistory, history);
}

export function deleteFromHistory(gameId: string): void {
  const history = loadGameHistory().filter(g => g.id !== gameId);
  writeJSON(KEYS.gameHistory, history);
}

export function clearHistory(): void {
  localStorage.removeItem(KEYS.gameHistory);
}

// ── Player presets ────────────────────────────────────────────

export function savePlayerPresets(names: string[]): void {
  writeJSON(KEYS.playerPresets, names);
}

export function loadPlayerPresets(): string[] {
  return readJSON<string[]>(KEYS.playerPresets, []);
}

// ── Settings ──────────────────────────────────────────────────

export function isSoundEnabled(): boolean {
  return readJSON<boolean>(KEYS.soundEnabled, true);
}

export function setSoundEnabled(enabled: boolean): void {
  writeJSON(KEYS.soundEnabled, enabled);
}
