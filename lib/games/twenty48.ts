/**
 * 2048 game logic.
 *
 * Slide tiles on a 4x4 grid. When two tiles with the same value collide,
 * they merge into one tile with double the value. A new tile (2 or 4)
 * spawns after each move. Reach 2048 to win; fill the board with no
 * valid moves to lose.
 *
 * @module lib/games/twenty48
 */

export type Direction = "up" | "down" | "left" | "right";

export interface State2048 {
  grid: number[][];
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
  keepPlaying: boolean;
}

const SIZE = 4;

/** Create a fresh 4x4 board with two random tiles. */
export function createInitialState(): State2048 {
  let grid = emptyGrid();
  grid = addRandomTile(addRandomTile(grid));
  return { grid, score: 0, bestScore: 0, gameOver: false, won: false, keepPlaying: false };
}

/** Process a move in the given direction. Returns new state (or same if move is invalid). */
export function move(state: State2048, dir: Direction): State2048 {
  if (state.gameOver && !state.keepPlaying) return state;

  const { grid: newGrid, scored } = slideGrid(state.grid, dir);

  if (gridsEqual(state.grid, newGrid)) return state;

  const withTile = addRandomTile(newGrid);
  const newScore = state.score + scored;
  const bestScore = Math.max(newScore, state.bestScore);
  const won = !state.won && !state.keepPlaying && hasValue(withTile, 2048);
  const gameOver = !canMove(withTile);

  return { grid: withTile, score: newScore, bestScore, gameOver, won, keepPlaying: state.keepPlaying };
}

/** Continue playing after reaching 2048. */
export function continueGame(state: State2048): State2048 {
  return { ...state, won: false, keepPlaying: true };
}

/* ── Internal helpers ── */

function emptyGrid(): number[][] {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function addRandomTile(grid: number[][]): number[][] {
  const empty: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const copy = grid.map((row) => [...row]);
  copy[r][c] = Math.random() < 0.9 ? 2 : 4;
  return copy;
}

function slideLine(line: number[]): { result: number[]; scored: number } {
  const filtered = line.filter((v) => v !== 0);
  const result: number[] = [];
  let scored = 0;
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2;
      result.push(merged);
      scored += merged;
      i += 2;
    } else {
      result.push(filtered[i]);
      i += 1;
    }
  }
  while (result.length < SIZE) result.push(0);
  return { result, scored };
}

function slideGrid(grid: number[][], dir: Direction): { grid: number[][]; scored: number } {
  let totalScored = 0;
  const newGrid = emptyGrid();

  for (let i = 0; i < SIZE; i++) {
    let line: number[];
    if (dir === "left") line = grid[i].slice();
    else if (dir === "right") line = grid[i].slice().reverse();
    else if (dir === "up") line = Array.from({ length: SIZE }, (_, r) => grid[r][i]);
    else line = Array.from({ length: SIZE }, (_, r) => grid[SIZE - 1 - r][i]);

    const { result, scored } = slideLine(line);
    totalScored += scored;

    for (let j = 0; j < SIZE; j++) {
      if (dir === "left") newGrid[i][j] = result[j];
      else if (dir === "right") newGrid[i][SIZE - 1 - j] = result[j];
      else if (dir === "up") newGrid[j][i] = result[j];
      else newGrid[SIZE - 1 - j][i] = result[j];
    }
  }

  return { grid: newGrid, scored: totalScored };
}

function canMove(grid: number[][]): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < SIZE && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

function hasValue(grid: number[][], val: number): boolean {
  return grid.some((row) => row.some((v) => v === val));
}

function gridsEqual(a: number[][], b: number[][]): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}
