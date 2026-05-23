/** Player model for Noppapeli — tracks scores per category. */

import { type ScorecardCategory, UPPER_SECTION, LOWER_SECTION, ALL_PLAYABLE } from './scorecard';

export interface Player {
  name: string;
  scores: Record<string, number | null>;
}

export function createPlayer(name: string, scores?: Record<string, number | null>): Player {
  return { name, scores: scores ?? {} };
}

export function getScore(player: Player, category: ScorecardCategory): number | null {
  return player.scores[category.id] ?? null;
}

export function setScore(player: Player, category: ScorecardCategory, value: number | null): Player {
  return { ...player, scores: { ...player.scores, [category.id]: value } };
}

export function isComplete(player: Player): boolean {
  return ALL_PLAYABLE.every(cat => player.scores[cat.id] != null);
}

export function upperTotal(player: Player): number {
  return UPPER_SECTION.reduce((sum, cat) => sum + (player.scores[cat.id] ?? 0), 0);
}

/** Upper section bonus: +50 if upper total ≥ 63 */
export function upperBonus(player: Player): number {
  return upperTotal(player) >= 63 ? 50 : 0;
}

export function pointsToBonus(player: Player): number {
  const remaining = 63 - upperTotal(player);
  return remaining > 0 ? remaining : 0;
}

export function lowerTotal(player: Player): number {
  return LOWER_SECTION.reduce((sum, cat) => sum + (player.scores[cat.id] ?? 0), 0);
}

export function grandTotal(player: Player): number {
  return upperTotal(player) + upperBonus(player) + lowerTotal(player);
}
