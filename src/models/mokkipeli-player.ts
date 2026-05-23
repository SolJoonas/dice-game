/** Mökkipeli player — pin throwing game to 50 points. */

export interface MokkipeliPlayer {
  name: string;
  throws: number[];
  isEliminated: boolean;
}

export function createMokkipeliPlayer(name: string): MokkipeliPlayer {
  return { name, throws: [], isEliminated: false };
}

export function addThrow(
  player: MokkipeliPlayer,
  score: number,
  _resetOnOvershoot: boolean,
  eliminateOnThreeMisses: boolean,
): MokkipeliPlayer {
  const newThrows = [...player.throws, score];
  const misses = consecutiveMisses({ ...player, throws: newThrows });
  const eliminated = eliminateOnThreeMisses && misses >= 3;
  return { ...player, throws: newThrows, isEliminated: eliminated || player.isEliminated };
}

export function consecutiveMisses(player: MokkipeliPlayer): number {
  let count = 0;
  for (let i = player.throws.length - 1; i >= 0; i--) {
    if (player.throws[i] === 0) count++;
    else break;
  }
  return count;
}

export function getTotal(player: MokkipeliPlayer, resetOnOvershoot: boolean): number {
  let total = 0;
  for (const score of player.throws) {
    total += score;
    if (resetOnOvershoot && total > 50) {
      total = 25;
    }
  }
  return total;
}

export function hasWon(player: MokkipeliPlayer, resetOnOvershoot: boolean): boolean {
  return getTotal(player, resetOnOvershoot) === 50;
}

export function pointsToWin(player: MokkipeliPlayer, resetOnOvershoot: boolean): number {
  return 50 - getTotal(player, resetOnOvershoot);
}

export function undoThrow(
  player: MokkipeliPlayer,
  eliminateOnThreeMisses: boolean,
): MokkipeliPlayer {
  if (player.throws.length === 0) return player;
  const newThrows = player.throws.slice(0, -1);
  const misses = consecutiveMisses({ ...player, throws: newThrows });
  const eliminated = eliminateOnThreeMisses && misses >= 3;
  return { ...player, throws: newThrows, isEliminated: eliminated };
}

/** Edit a throw at a specific index (for fixing errors). */
export function setThrowAt(
  player: MokkipeliPlayer,
  index: number,
  value: number,
  eliminateOnThreeMisses: boolean,
): MokkipeliPlayer {
  if (index < 0 || index >= player.throws.length) return player;
  const newThrows = [...player.throws];
  newThrows[index] = value;
  const misses = consecutiveMisses({ ...player, throws: newThrows });
  const eliminated = eliminateOnThreeMisses && misses >= 3;
  return { ...player, throws: newThrows, isEliminated: eliminated };
}

/** Remove a throw at a specific index. */
export function removeThrowAt(
  player: MokkipeliPlayer,
  index: number,
  eliminateOnThreeMisses: boolean,
): MokkipeliPlayer {
  if (index < 0 || index >= player.throws.length) return player;
  const newThrows = player.throws.filter((_, i) => i !== index);
  const misses = consecutiveMisses({ ...player, throws: newThrows });
  const eliminated = eliminateOnThreeMisses && misses >= 3;
  return { ...player, throws: newThrows, isEliminated: eliminated };
}
