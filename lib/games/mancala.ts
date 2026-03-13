/**
 * Mancala (Kalah variant) game logic with AI.
 *
 * Two players sow seeds counter-clockwise. Landing in your store
 * earns an extra turn. Landing in an empty pit on your side captures
 * the opposite pit's seeds. The game ends when one side is empty.
 *
 * @module lib/games/mancala
 */

export type Player = 0 | 1;

export interface MancalaState {
  pits: number[];    // indices 0-5 = P1 pits, 6 = P1 store, 7-12 = P2 pits, 13 = P2 store
  currentPlayer: Player;
  gameOver: boolean;
  lastAction: string;
}

const SEEDS_PER_PIT = 4;

export function createInitialState(): MancalaState {
  const pits = Array(14).fill(SEEDS_PER_PIT);
  pits[6] = 0;   // P1 store
  pits[13] = 0;  // P2 store
  return { pits, currentPlayer: 0, gameOver: false, lastAction: "" };
}

/** Sow seeds from a pit. Returns new state. */
export function sow(state: MancalaState, pitIndex: number): MancalaState {
  if (state.gameOver) return state;

  const player = state.currentPlayer;
  const myPits = player === 0 ? [0, 1, 2, 3, 4, 5] : [7, 8, 9, 10, 11, 12];
  if (!myPits.includes(pitIndex)) return state;
  if (state.pits[pitIndex] === 0) return state;

  const pits = [...state.pits];
  let seeds = pits[pitIndex];
  pits[pitIndex] = 0;
  let idx = pitIndex;
  const oppStore = player === 0 ? 13 : 6;

  while (seeds > 0) {
    idx = (idx + 1) % 14;
    if (idx === oppStore) continue;
    pits[idx]++;
    seeds--;
  }

  // Capture: last seed in empty pit on your side
  const myRange = player === 0 ? [0, 5] : [7, 12];
  if (idx >= myRange[0] && idx <= myRange[1] && pits[idx] === 1) {
    const opposite = 12 - idx;
    if (pits[opposite] > 0) {
      const myStore = player === 0 ? 6 : 13;
      pits[myStore] += pits[opposite] + 1;
      pits[idx] = 0;
      pits[opposite] = 0;
    }
  }

  // Extra turn if last seed lands in your store
  const myStore = player === 0 ? 6 : 13;
  const extraTurn = idx === myStore;

  // Check game over
  const p1Empty = pits.slice(0, 6).every((v) => v === 0);
  const p2Empty = pits.slice(7, 13).every((v) => v === 0);
  let gameOver = false;

  if (p1Empty || p2Empty) {
    gameOver = true;
    for (let i = 0; i < 6; i++) { pits[6] += pits[i]; pits[i] = 0; }
    for (let i = 7; i < 13; i++) { pits[13] += pits[i]; pits[i] = 0; }
  }

  const nextPlayer: Player = gameOver ? player : extraTurn ? player : (player === 0 ? 1 : 0);
  const action = extraTurn && !gameOver ? "Extra turn!" : "";

  return { pits, currentPlayer: nextPlayer, gameOver, lastAction: action };
}

/** AI: pick the pit that maximizes store score, preferring extra turns. */
export function getAiMove(state: MancalaState): number | null {
  const myPits = state.currentPlayer === 0 ? [0, 1, 2, 3, 4, 5] : [7, 8, 9, 10, 11, 12];
  const available = myPits.filter((i) => state.pits[i] > 0);
  if (available.length === 0) return null;

  const myStore = state.currentPlayer === 0 ? 6 : 13;

  // Prefer moves that give extra turn
  for (const pit of available) {
    const seeds = state.pits[pit];
    let idx = pit;
    let remaining = seeds;
    while (remaining > 0) {
      idx = (idx + 1) % 14;
      if (idx === (state.currentPlayer === 0 ? 13 : 6)) continue;
      remaining--;
    }
    if (idx === myStore) return pit;
  }

  // Otherwise pick move that gives highest store
  let bestPit = available[0];
  let bestScore = -1;
  for (const pit of available) {
    const result = sow(state, pit);
    if (result.pits[myStore] > bestScore) {
      bestScore = result.pits[myStore];
      bestPit = pit;
    }
  }

  return bestPit;
}

export function getScore(state: MancalaState): [number, number] {
  return [state.pits[6], state.pits[13]];
}
