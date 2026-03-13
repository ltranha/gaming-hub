/**
 * Pixel Art collaborative canvas logic.
 *
 * A grid of colored pixels that users can paint on. Supports
 * multiple palette colors and undo. Designed for collaborative
 * use when combined with Firebase real-time sync.
 *
 * @module lib/games/pixel-art
 */

export interface PixelArtState {
  grid: string[][];
  rows: number;
  cols: number;
  history: { row: number; col: number; prevColor: string; newColor: string }[];
}

export const PALETTE = [
  "#000000", "#ffffff", "#dc2626", "#f97316", "#eab308", "#22c55e",
  "#0ea5e9", "#3b82f6", "#8b5cf6", "#ec4899", "#78716c", "#a3e635",
  "#06b6d4", "#f43f5e", "#d946ef", "#fbbf24",
];

export function createInitialState(rows = 24, cols = 32): PixelArtState {
  const grid = Array.from({ length: rows }, () => Array(cols).fill("#ffffff"));
  return { grid, rows, cols, history: [] };
}

export function paintPixel(state: PixelArtState, row: number, col: number, color: string): PixelArtState {
  if (state.grid[row][col] === color) return state;
  const prevColor = state.grid[row][col];
  const grid = state.grid.map((r, ri) =>
    ri === row ? r.map((c, ci) => ci === col ? color : c) : [...r]
  );
  const history = [...state.history, { row, col, prevColor, newColor: color }];
  return { ...state, grid, history };
}

export function undo(state: PixelArtState): PixelArtState {
  if (state.history.length === 0) return state;
  const history = [...state.history];
  const last = history.pop()!;
  const grid = state.grid.map((r, ri) =>
    ri === last.row ? r.map((c, ci) => ci === last.col ? last.prevColor : c) : [...r]
  );
  return { ...state, grid, history };
}

export function clearCanvas(state: PixelArtState): PixelArtState {
  return createInitialState(state.rows, state.cols);
}

export function fillBucket(state: PixelArtState, row: number, col: number, color: string): PixelArtState {
  const target = state.grid[row][col];
  if (target === color) return state;
  const grid = state.grid.map((r) => [...r]);
  const visited = new Set<string>();
  const stack: [number, number][] = [[row, col]];

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    if (r < 0 || r >= state.rows || c < 0 || c >= state.cols) continue;
    if (grid[r][c] !== target) continue;
    visited.add(key);
    grid[r][c] = color;
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }

  return { ...state, grid, history: [...state.history, { row, col, prevColor: target, newColor: color }] };
}
