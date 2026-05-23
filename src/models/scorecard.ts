/** Scorecard category definitions for Scandinavian Noppapeli. */

export interface ScorecardCategory {
  readonly id: string;
  readonly name: string;
  readonly section: 'upper' | 'lower';
  readonly description: string;
  readonly maxScore: number;
}

// ── Upper section categories ─────────────────────────────────

export const ONES: ScorecardCategory = {
  id: 'ones', name: 'Ykköset', section: 'upper',
  description: 'Kaikkien ykkösten summa', maxScore: 5,
};

export const TWOS: ScorecardCategory = {
  id: 'twos', name: 'Kakkoset', section: 'upper',
  description: 'Kaikkien kakkosten summa', maxScore: 10,
};

export const THREES: ScorecardCategory = {
  id: 'threes', name: 'Kolmoset', section: 'upper',
  description: 'Kaikkien kolmosten summa', maxScore: 15,
};

export const FOURS: ScorecardCategory = {
  id: 'fours', name: 'Neloset', section: 'upper',
  description: 'Kaikkien nelosten summa', maxScore: 20,
};

export const FIVES: ScorecardCategory = {
  id: 'fives', name: 'Vitoset', section: 'upper',
  description: 'Kaikkien vitosten summa', maxScore: 25,
};

export const SIXES: ScorecardCategory = {
  id: 'sixes', name: 'Kutoset', section: 'upper',
  description: 'Kaikkien kutosten summa', maxScore: 30,
};

// ── Lower section categories ─────────────────────────────────

export const ONE_PAIR: ScorecardCategory = {
  id: 'one_pair', name: 'Pari', section: 'lower',
  description: 'Kaksi samaa noppaa', maxScore: 12,
};

export const TWO_PAIRS: ScorecardCategory = {
  id: 'two_pairs', name: 'Kaksi paria', section: 'lower',
  description: 'Kaksi eri paria', maxScore: 22,
};

export const THREE_OF_A_KIND: ScorecardCategory = {
  id: 'three_of_a_kind', name: 'Kolme samaa', section: 'lower',
  description: 'Kolme samaa noppaa', maxScore: 18,
};

export const FOUR_OF_A_KIND: ScorecardCategory = {
  id: 'four_of_a_kind', name: 'Neljä samaa', section: 'lower',
  description: 'Neljä samaa noppaa', maxScore: 24,
};

export const SMALL_STRAIGHT: ScorecardCategory = {
  id: 'small_straight', name: 'Pieni suora', section: 'lower',
  description: '1-2-3-4-5 (summa = 15)', maxScore: 15,
};

export const LARGE_STRAIGHT: ScorecardCategory = {
  id: 'large_straight', name: 'Iso suora', section: 'lower',
  description: '2-3-4-5-6 (summa = 20)', maxScore: 20,
};

export const FULL_HOUSE: ScorecardCategory = {
  id: 'full_house', name: 'Täyskäsi', section: 'lower',
  description: 'Kolme samaa + pari', maxScore: 28,
};

export const CHANCE: ScorecardCategory = {
  id: 'chance', name: 'Sattuma', section: 'lower',
  description: 'Kaikkien noppien summa', maxScore: 30,
};

export const NOPPAPELI: ScorecardCategory = {
  id: 'noppapeli', name: 'Noppapeli', section: 'lower',
  description: 'Kaikki viisi samaa (50 pistettä)', maxScore: 50,
};

// ── Category lists ───────────────────────────────────────────

export const UPPER_SECTION: readonly ScorecardCategory[] = [
  ONES, TWOS, THREES, FOURS, FIVES, SIXES,
];

export const LOWER_SECTION: readonly ScorecardCategory[] = [
  ONE_PAIR, TWO_PAIRS, THREE_OF_A_KIND, FOUR_OF_A_KIND,
  SMALL_STRAIGHT, LARGE_STRAIGHT, FULL_HOUSE, CHANCE, NOPPAPELI,
];

export const ALL_PLAYABLE: readonly ScorecardCategory[] = [
  ...UPPER_SECTION,
  ...LOWER_SECTION,
];

/** Returns ranked best possible scores for quick-select buttons. */
export function getRankedScores(category: ScorecardCategory): number[] {
  switch (category.id) {
    case 'ones': return [5, 4, 3];
    case 'twos': return [10, 8, 6];
    case 'threes': return [15, 12, 9];
    case 'fours': return [20, 16, 12];
    case 'fives': return [25, 20, 15];
    case 'sixes': return [30, 24, 18];
    case 'one_pair': return [12, 10, 8];
    case 'two_pairs': return [22, 20, 18];
    case 'three_of_a_kind': return [18, 15, 12];
    case 'four_of_a_kind': return [24, 20, 16];
    case 'small_straight': return [15];
    case 'large_straight': return [20];
    case 'full_house': return [28, 27, 26];
    case 'chance': return [30, 29, 28];
    case 'noppapeli': return [50];
    default: return [category.maxScore];
  }
}
