/**
 * Tic-Tac-Toe game logic.
 *
 * Pure functions for state management, win detection, and AI (minimax).
 * No UI or DOM dependencies — used by both local and online modes.
 *
 * @module lib/games/tic-tac-toe
 */

export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[];
export type Difficulty = "easy" | "medium" | "hard";

export interface TicTacToeState {
  board: Board;
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null;
  winningCells: number[];
}

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function createInitialState(): TicTacToeState {
  return {
    board: Array(9).fill(null),
    currentPlayer: "X",
    gameOver: false,
    winner: null,
    winningCells: [],
  };
}

export function checkWinner(board: Board): { winner: Player; cells: number[] } | null {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a]!, cells: pattern };
    }
  }
  return null;
}

export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

export function makeMove(state: TicTacToeState, index: number): TicTacToeState {
  if (state.gameOver || state.board[index] !== null) return state;

  const board = [...state.board];
  board[index] = state.currentPlayer;

  const result = checkWinner(board);
  if (result) {
    return { board, currentPlayer: state.currentPlayer, gameOver: true, winner: result.winner, winningCells: result.cells };
  }
  if (isBoardFull(board)) {
    return { board, currentPlayer: state.currentPlayer, gameOver: true, winner: null, winningCells: [] };
  }

  return { board, currentPlayer: state.currentPlayer === "X" ? "O" : "X", gameOver: false, winner: null, winningCells: [] };
}

// --- AI (Minimax) ---

function checkWinnerForBoard(board: Board): Player | null {
  for (const [a, b, c] of WIN_PATTERNS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]!;
  }
  return null;
}

function minimax(board: Board, depth: number, isMaximizing: boolean): number {
  const winner = checkWinnerForBoard(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (board.every((c) => c !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "X";
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function getBestMove(board: Board): number | null {
  let bestScore = -Infinity;
  let bestMove: number | null = null;
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = "O";
      const score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function getRandomMove(board: Board): number | null {
  const available = board.map((c, i) => (c === null ? i : -1)).filter((i) => i !== -1);
  return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null;
}

export function getAiMove(board: Board, difficulty: Difficulty): number | null {
  switch (difficulty) {
    case "easy":
      return getRandomMove(board);
    case "medium":
      return Math.random() > 0.5 ? getBestMove([...board]) : getRandomMove(board);
    case "hard":
    default:
      return getBestMove([...board]);
  }
}
