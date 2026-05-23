/** Game model — represents a complete game session. */

import type { Player } from './player';
import { grandTotal } from './player';

export type GameType = 'noppapeli' | 'mokkipeli' | 'ristiseiska';
export type GameState = 'inProgress' | 'completed';

export interface GameTypeInfo {
  id: GameType;
  displayName: string;
  icon: string;
  description: string;
}

export const GAME_TYPES: readonly GameTypeInfo[] = [
  { id: 'noppapeli', displayName: 'Noppapeli', icon: '🎲', description: 'Perinteinen noppapelin tuloskortti' },
  { id: 'mokkipeli', displayName: 'Mökkipeli', icon: '🎯', description: 'Keilaus 50 pisteeseen' },
  { id: 'ristiseiska', displayName: 'Ristiseiska', icon: '♣️', description: 'Korttipelin rangaistusseuranta' },
];

export interface Game {
  id: string;
  gameType: GameType;
  players: Player[];
  state: GameState;
  createdAt: string; // ISO 8601
  updatedAt: string;
  extraData: Record<string, unknown>;
}

export function createGame(
  players: Player[],
  gameType: GameType = 'noppapeli',
  extraData: Record<string, unknown> = {},
): Game {
  const now = new Date().toISOString();
  return {
    id: now,
    gameType,
    players,
    state: 'inProgress',
    createdAt: now,
    updatedAt: now,
    extraData,
  };
}

export function getWinners(game: Game): Player[] {
  if (game.players.length === 0) return [];
  const maxScore = Math.max(...game.players.map(p => grandTotal(p)));
  return game.players.filter(p => grandTotal(p) === maxScore);
}
