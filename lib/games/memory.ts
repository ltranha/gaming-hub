/**
 * Memory card game logic.
 *
 * Pure functions for card creation, shuffling, flip handling,
 * match detection, and score tracking. Supports 3 themes and
 * 3 difficulty levels.
 *
 * @module lib/games/memory
 */

export type Theme = "emoji" | "symbols" | "numbers";
export type MemoryDifficulty = "easy" | "medium" | "hard";

export interface MemoryCard {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

export interface MemoryState {
  cards: MemoryCard[];
  flippedIds: number[];
  moves: number;
  matched: number;
  total: number;
  gameOver: boolean;
  locked: boolean;
}

const EMOJI_SET = ["🎮","🎯","🎲","🎸","🎺","🎻","🏀","⚽","🏈","🥎","🎾","🏐","🌸","🌺","🌻","🌷","🍎","🍊"];
const SYMBOL_SET = ["♦","♥","♠","♣","★","☆","◆","●","▲","■","☀","☁","◇","○","△","□","►","▼"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getPairCount(diff: MemoryDifficulty): number {
  if (diff === "easy") return 4;
  if (diff === "medium") return 8;
  return 12;
}

function getSymbols(theme: Theme, count: number): string[] {
  if (theme === "emoji") return EMOJI_SET.slice(0, count);
  if (theme === "symbols") return SYMBOL_SET.slice(0, count);
  return Array.from({ length: count }, (_, i) => String(i + 1));
}

export function createInitialState(theme: Theme = "emoji", diff: MemoryDifficulty = "medium"): MemoryState {
  const pairCount = getPairCount(diff);
  const symbols = getSymbols(theme, pairCount);
  const doubled = [...symbols, ...symbols];
  const shuffled = shuffle(doubled);
  const cards: MemoryCard[] = shuffled.map((value, id) => ({
    id, value, flipped: false, matched: false,
  }));
  return {
    cards,
    flippedIds: [],
    moves: 0,
    matched: 0,
    total: pairCount,
    gameOver: false,
    locked: false,
  };
}

export function flipCard(state: MemoryState, cardId: number): MemoryState {
  if (state.locked || state.gameOver) return state;
  const card = state.cards[cardId];
  if (!card || card.flipped || card.matched) return state;
  if (state.flippedIds.length >= 2) return state;

  const cards = state.cards.map((c) =>
    c.id === cardId ? { ...c, flipped: true } : c
  );
  const flippedIds = [...state.flippedIds, cardId];
  const moves = state.moves + 1;

  if (flippedIds.length === 2) {
    const [a, b] = flippedIds;
    if (cards[a].value === cards[b].value) {
      const updated = cards.map((c) =>
        c.id === a || c.id === b ? { ...c, matched: true } : c
      );
      const matched = state.matched + 1;
      return {
        cards: updated, flippedIds: [], moves, matched,
        total: state.total,
        gameOver: matched === state.total,
        locked: false,
      };
    }
    return { ...state, cards, flippedIds, moves, locked: true };
  }

  return { ...state, cards, flippedIds, moves };
}

export function unflipCards(state: MemoryState): MemoryState {
  if (!state.locked) return state;
  const cards = state.cards.map((c) =>
    state.flippedIds.includes(c.id) ? { ...c, flipped: false } : c
  );
  return { ...state, cards, flippedIds: [], locked: false };
}
