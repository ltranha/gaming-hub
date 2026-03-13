/**
 * Connect Four game logic.
 *
 * Pure functions for a 7x6 grid with gravity-based piece drops,
 * 4-in-a-row win detection, and AI opponent.
 *
 * @module lib/games/connect-four
 */

export type Player = "R" | "Y";
export type Cell = Player | null;
export type Difficulty = "easy" | "medium" | "hard";

export const COLS = 7;
export const ROWS = 6;

export interface ConnectFourState {
  board: Cell[];
  heights: number[];
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null;
  winningCells: number[];
}

function idx(col: number, row: number) { return row * COLS + col; }

export function createInitialState(): ConnectFourState {
  return {
    board: Array(COLS * ROWS).fill(null),
    heights: Array(COLS).fill(0),
    currentPlayer: "R",
    gameOver: false,
    winner: null,
    winningCells: [],
  };
}

function checkWinner(board: Cell[]): { winner: Player; cells: number[] } | null {
  const lines: number[][] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c <= COLS - 4; c++)
      lines.push([idx(c,r), idx(c+1,r), idx(c+2,r), idx(c+3,r)]);
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r <= ROWS - 4; r++)
      lines.push([idx(c,r), idx(c,r+1), idx(c,r+2), idx(c,r+3)]);
  for (let c = 0; c <= COLS - 4; c++)
    for (let r = 0; r <= ROWS - 4; r++)
      lines.push([idx(c,r), idx(c+1,r+1), idx(c+2,r+2), idx(c+3,r+3)]);
  for (let c = 3; c < COLS; c++)
    for (let r = 0; r <= ROWS - 4; r++)
      lines.push([idx(c,r), idx(c-1,r+1), idx(c-2,r+2), idx(c-3,r+3)]);
  for (const [a,b,c,d] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d])
      return { winner: board[a]!, cells: [a,b,c,d] };
  }
  return null;
}

export function dropPiece(state: ConnectFourState, col: number): ConnectFourState {
  if (state.gameOver || col < 0 || col >= COLS || state.heights[col] >= ROWS) return state;
  const row = ROWS - 1 - state.heights[col];
  const board = [...state.board];
  board[idx(col, row)] = state.currentPlayer;
  const heights = [...state.heights];
  heights[col]++;

  const result = checkWinner(board);
  if (result) {
    return { board, heights, currentPlayer: state.currentPlayer, gameOver: true, winner: result.winner, winningCells: result.cells };
  }
  if (board.every((c) => c !== null)) {
    return { board, heights, currentPlayer: state.currentPlayer, gameOver: true, winner: null, winningCells: [] };
  }
  return {
    board, heights,
    currentPlayer: state.currentPlayer === "R" ? "Y" : "R",
    gameOver: false, winner: null, winningCells: [],
  };
}

// --- AI ---
export function getAiMove(state: ConnectFourState, difficulty: Difficulty): number | null {
  const avail: number[] = [];
  for (let c = 0; c < COLS; c++) if (state.heights[c] < ROWS) avail.push(c);
  if (!avail.length) return null;

  // Check for winning move
  for (const c of avail) {
    const next = dropPiece(state, c);
    if (next.winner === state.currentPlayer) return c;
  }
  // Block opponent winning move
  const opp: ConnectFourState = { ...state, currentPlayer: state.currentPlayer === "R" ? "Y" : "R" };
  for (const c of avail) {
    const next = dropPiece(opp, c);
    if (next.winner === opp.currentPlayer) return c;
  }

  if (difficulty === "easy") return avail[Math.floor(Math.random() * avail.length)];
  if (difficulty === "medium" && Math.random() > 0.5) return avail[Math.floor(Math.random() * avail.length)];

  // Prefer center columns
  const center = Math.floor(COLS / 2);
  const sorted = [...avail].sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
  return sorted[0];
}
