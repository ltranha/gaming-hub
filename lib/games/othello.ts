/**
 * Othello (Reversi) game logic with AI.
 *
 * Two players place discs on an 8x8 board. Placing a disc must
 * outflank one or more opponent discs, which are then flipped.
 * The player with the most discs when the board is full (or no
 * moves remain) wins.
 *
 * @module lib/games/othello
 */

export type Player = 1 | 2;
export type CellValue = 0 | 1 | 2;

export interface OthelloState {
  board: CellValue[][];
  currentPlayer: Player;
  gameOver: boolean;
  score: [number, number];
  validMoves: [number, number][];
  lastMove: [number, number] | null;
}

const SIZE = 8;
const DIRS: [number, number][] = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

export function createInitialState(): OthelloState {
  const board: CellValue[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(0) as CellValue[]);
  board[3][3] = 2; board[3][4] = 1;
  board[4][3] = 1; board[4][4] = 2;
  const validMoves = getValidMoves(board, 1);
  return { board, currentPlayer: 1, gameOver: false, score: [2, 2], validMoves, lastMove: null };
}

export function makeMove(state: OthelloState, row: number, col: number): OthelloState {
  if (state.gameOver) return state;
  if (!state.validMoves.some(([r, c]) => r === row && c === col)) return state;

  const board = state.board.map((r) => [...r]) as CellValue[][];
  const flipped = applyMove(board, row, col, state.currentPlayer);
  if (flipped === 0) return state;

  const score = countScore(board);
  let next: Player = state.currentPlayer === 1 ? 2 : 1;
  let validMoves = getValidMoves(board, next);

  if (validMoves.length === 0) {
    next = state.currentPlayer;
    validMoves = getValidMoves(board, next);
    if (validMoves.length === 0) {
      return { board, currentPlayer: next, gameOver: true, score, validMoves: [], lastMove: [row, col] };
    }
  }

  return { board, currentPlayer: next, gameOver: false, score, validMoves, lastMove: [row, col] };
}

/** Simple AI: picks the move that flips the most discs, with corner/edge preference. */
export function getAiMove(state: OthelloState): [number, number] | null {
  if (state.validMoves.length === 0) return null;

  const corners = [[0,0],[0,7],[7,0],[7,7]];
  for (const [r, c] of corners) {
    if (state.validMoves.some(([mr, mc]) => mr === r && mc === c)) return [r, c] as [number, number];
  }

  let bestMove = state.validMoves[0];
  let bestScore = -1;

  for (const [r, c] of state.validMoves) {
    const testBoard = state.board.map((row) => [...row]) as CellValue[][];
    const flipped = applyMove(testBoard, r, c, state.currentPlayer);
    const edgeBonus = (r === 0 || r === 7 || c === 0 || c === 7) ? 3 : 0;
    const score = flipped + edgeBonus;
    if (score > bestScore) {
      bestScore = score;
      bestMove = [r, c];
    }
  }

  return bestMove;
}

/* ── Internal ── */

function getValidMoves(board: CellValue[][], player: Player): [number, number][] {
  const moves: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] !== 0) continue;
      if (wouldFlip(board, r, c, player) > 0) moves.push([r, c]);
    }
  }
  return moves;
}

function wouldFlip(board: CellValue[][], row: number, col: number, player: Player): number {
  const opp: Player = player === 1 ? 2 : 1;
  let total = 0;
  for (const [dr, dc] of DIRS) {
    let r = row + dr, c = col + dc, count = 0;
    while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] === opp) {
      count++; r += dr; c += dc;
    }
    if (count > 0 && r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] === player) {
      total += count;
    }
  }
  return total;
}

function applyMove(board: CellValue[][], row: number, col: number, player: Player): number {
  const opp: Player = player === 1 ? 2 : 1;
  board[row][col] = player;
  let totalFlipped = 0;
  for (const [dr, dc] of DIRS) {
    const toFlip: [number, number][] = [];
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] === opp) {
      toFlip.push([r, c]); r += dr; c += dc;
    }
    if (toFlip.length > 0 && r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] === player) {
      for (const [fr, fc] of toFlip) board[fr][fc] = player;
      totalFlipped += toFlip.length;
    }
  }
  return totalFlipped;
}

function countScore(board: CellValue[][]): [number, number] {
  let p1 = 0, p2 = 0;
  for (const row of board) for (const v of row) { if (v === 1) p1++; if (v === 2) p2++; }
  return [p1, p2];
}
