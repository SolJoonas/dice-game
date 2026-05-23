/** Ristiseiska player — card game penalty tracker. */

export interface RistiseiskaPlayer {
  name: string;
  roundScores: number[];
  panttiCount: number;
}

export function createRistiseiskaPlayer(name: string): RistiseiskaPlayer {
  return { name, roundScores: [], panttiCount: 0 };
}

export function addRoundScore(player: RistiseiskaPlayer, penalty: number): RistiseiskaPlayer {
  return { ...player, roundScores: [...player.roundScores, penalty] };
}

export function panttiTotal(player: RistiseiskaPlayer): number {
  return player.panttiCount * 25;
}

export function roundsTotal(player: RistiseiskaPlayer): number {
  return player.roundScores.reduce((sum, s) => sum + s, 0);
}

export function ristiseiskaGrandTotal(player: RistiseiskaPlayer): number {
  return roundsTotal(player);
}

/** Edit a round score at a specific index (for fixing errors). */
export function setRoundScoreAt(player: RistiseiskaPlayer, index: number, value: number): RistiseiskaPlayer {
  if (index < 0 || index >= player.roundScores.length) return player;
  const newScores = [...player.roundScores];
  newScores[index] = value;
  return { ...player, roundScores: newScores };
}

/** Remove a round score at a specific index. */
export function removeRoundScoreAt(player: RistiseiskaPlayer, index: number): RistiseiskaPlayer {
  if (index < 0 || index >= player.roundScores.length) return player;
  return { ...player, roundScores: player.roundScores.filter((_, i) => i !== index) };
}

/** Card face values for the penalty calculator. */
export const CARD_VALUES: readonly { label: string; value: number }[] = [
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: 'J', value: 11 },
  { label: 'Q', value: 12 },
  { label: 'K', value: 13 },
  { label: 'A', value: 14 },
];
