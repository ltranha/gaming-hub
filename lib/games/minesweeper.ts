/**
 * Minesweeper game logic.
 *
 * Reveal cells on a grid without hitting mines. Numbers indicate
 * how many adjacent mines exist. Flag suspected mines.
 * Reveal all non-mine cells to win.
 *
 * @module lib/games/minesweeper
 */

export type Difficulty = "easy" | "medium" | "hard";

export interface Cell {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacentMines: number;
}

export interface MinesweeperState {
  grid: Cell[][];
  rows: number;
  cols: number;
  mines: number;
  gameOver: boolean;
  won: boolean;
  started: boolean;
  flagCount: number;
}

const CONFIGS: Record<Difficulty, { rows: number; cols: number; mines: number }> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

export function createInitialState(difficulty: Difficulty = "easy"): MinesweeperState {
  const { rows, cols, mines } = CONFIGS[difficulty];
  const grid: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacentMines: 0,
    }))
  );
  return { grid, rows, cols, mines, gameOver: false, won: false, started: false, flagCount: 0 };
}

/** Place mines after first click (first click is always safe). */
export function revealCell(state: MinesweeperState, row: number, col: number): MinesweeperState {
  if (state.gameOver || state.won) return state;
  if (state.grid[row][col].flagged) return state;

  let grid = state.grid.map((r) => r.map((c) => ({ ...c })));
  let started = state.started;

  if (!started) {
    grid = placeMines(grid, state.rows, state.cols, state.mines, row, col);
    started = true;
  }

  if (grid[row][col].mine) {
    grid.forEach((r) => r.forEach((c) => { if (c.mine) c.revealed = true; }));
    return { ...state, grid, gameOver: true, won: false, started };
  }

  flood(grid, state.rows, state.cols, row, col);

  const won = checkWin(grid);
  return { ...state, grid, started, won, gameOver: won };
}

/** Toggle flag on a cell. */
export function toggleFlag(state: MinesweeperState, row: number, col: number): MinesweeperState {
  if (state.gameOver || state.won) return state;
  if (state.grid[row][col].revealed) return state;

  const grid = state.grid.map((r) => r.map((c) => ({ ...c })));
  grid[row][col].flagged = !grid[row][col].flagged;
  const flagCount = grid.flat().filter((c) => c.flagged).length;
  return { ...state, grid, flagCount };
}

/* ── Internal ── */

function placeMines(grid: Cell[][], rows: number, cols: number, count: number, safeR: number, safeC: number): Cell[][] {
  let placed = 0;
  while (placed < count) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (grid[r][c].mine) continue;
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
    grid[r][c].mine = true;
    placed++;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].mine) count++;
        }
      }
      grid[r][c].adjacentMines = count;
    }
  }
  return grid;
}

function flood(grid: Cell[][], rows: number, cols: number, r: number, c: number): void {
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;
  if (grid[r][c].revealed || grid[r][c].flagged || grid[r][c].mine) return;
  grid[r][c].revealed = true;
  if (grid[r][c].adjacentMines === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        flood(grid, rows, cols, r + dr, c + dc);
      }
    }
  }
}

function checkWin(grid: Cell[][]): boolean {
  return grid.every((row) => row.every((c) => c.mine || c.revealed));
}
