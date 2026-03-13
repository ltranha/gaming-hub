/**
 * Sudoku puzzle generator and validation.
 *
 * Generates a valid 9x9 Sudoku grid, then removes cells based on
 * difficulty to create the puzzle. Validates the user's input
 * against the solution.
 *
 * @module lib/games/sudoku
 */

export type Difficulty = "easy" | "medium" | "hard";

export interface SudokuState {
  puzzle: number[][];
  solution: number[][];
  current: number[][];
  given: boolean[][];
  selected: [number, number] | null;
  mistakes: number;
  completed: boolean;
}

const REMOVE_COUNT: Record<Difficulty, number> = { easy: 30, medium: 40, hard: 50 };

export function createInitialState(difficulty: Difficulty = "easy"): SudokuState {
  const solution = generateSolution();
  const puzzle = solution.map((r) => [...r]);
  const given = solution.map((r) => r.map(() => true));
  const remove = REMOVE_COUNT[difficulty];

  let removed = 0;
  while (removed < remove) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      given[r][c] = false;
      removed++;
    }
  }

  return {
    puzzle,
    solution,
    current: puzzle.map((r) => [...r]),
    given,
    selected: null,
    mistakes: 0,
    completed: false,
  };
}

export function selectCell(state: SudokuState, row: number, col: number): SudokuState {
  if (state.given[row][col]) return { ...state, selected: [row, col] };
  return { ...state, selected: [row, col] };
}

export function placeNumber(state: SudokuState, num: number): SudokuState {
  if (!state.selected || state.completed) return state;
  const [r, c] = state.selected;
  if (state.given[r][c]) return state;

  const current = state.current.map((row) => [...row]);
  current[r][c] = num;

  let mistakes = state.mistakes;
  if (num !== 0 && num !== state.solution[r][c]) {
    mistakes++;
  }

  const completed = current.every((row, ri) =>
    row.every((val, ci) => val === state.solution[ri][ci])
  );

  return { ...state, current, mistakes, completed };
}

export function clearCell(state: SudokuState): SudokuState {
  return placeNumber(state, 0);
}

/** Check if a specific value conflicts with the row, column, or box of the selected cell. */
export function hasConflict(state: SudokuState, row: number, col: number): boolean {
  const val = state.current[row][col];
  if (val === 0) return false;
  if (val !== state.solution[row][col]) return true;
  return false;
}

/* ── Generator (backtracking) ── */

function generateSolution(): number[][] {
  const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillGrid(grid);
  return grid;
}

function fillGrid(grid: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== 0) continue;
      const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      for (const n of nums) {
        if (isValid(grid, r, c, n)) {
          grid[r][c] = n;
          if (fillGrid(grid)) return true;
          grid[r][c] = 0;
        }
      }
      return false;
    }
  }
  return true;
}

function isValid(grid: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }
  const br = Math.floor(row / 3) * 3, bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }
  return true;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
