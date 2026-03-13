/**
 * Chess game logic.
 *
 * Lightweight chess engine with piece movement, capture detection,
 * pawn promotion, and a simple AI. Does not implement castling,
 * en passant, or deep checkmate search (king capture = game over).
 *
 * @module lib/games/chess
 */

export type Color = "w" | "b";
export type PieceType = "K" | "Q" | "R" | "B" | "N" | "P" | "k" | "q" | "r" | "b" | "n" | "p";
export type Cell = PieceType | null;

const UNICODE: Record<string, string> = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

const PIECE_VALUE: Record<string, number> = { k: 100, q: 9, r: 5, b: 3, n: 3, p: 1 };

export interface ChessState {
  board: Cell[];
  turn: Color;
  selected: number | null;
  legalMoves: number[];
  gameOver: boolean;
  winner: Color | "draw" | null;
  capturedWhite: PieceType[];
  capturedBlack: PieceType[];
  moveHistory: string[];
}

export function pieceUnicode(piece: PieceType): string {
  return UNICODE[piece] || "";
}

function colorOf(piece: PieceType | null): Color | null {
  if (!piece) return null;
  return piece === piece.toUpperCase() ? "w" : "b";
}

function isOpponent(piece: PieceType | null, color: Color): boolean {
  const c = colorOf(piece);
  return c !== null && c !== color;
}

function pos(index: number) {
  return { row: Math.floor(index / 8), col: index % 8 };
}

function idx(row: number, col: number) { return row * 8 + col; }
function inBounds(row: number, col: number) { return row >= 0 && row < 8 && col >= 0 && col < 8; }

function getSlidingMoves(board: Cell[], index: number, color: Color, dirs: number[][]): number[] {
  const moves: number[] = [];
  const { row, col } = pos(index);
  for (const [dr, dc] of dirs) {
    let r = row + dr, c = col + dc;
    while (inBounds(r, c)) {
      const i = idx(r, c);
      if (!board[i]) { moves.push(i); }
      else { if (isOpponent(board[i], color)) moves.push(i); break; }
      r += dr; c += dc;
    }
  }
  return moves;
}

export function getLegalMoves(board: Cell[], index: number): number[] {
  const piece = board[index];
  if (!piece) return [];
  const type = piece.toLowerCase();
  const color = colorOf(piece)!;
  const { row, col } = pos(index);
  const moves: number[] = [];

  if (type === "p") {
    const dir = color === "w" ? -1 : 1;
    const startRow = color === "w" ? 6 : 1;
    const oneRow = row + dir;
    if (inBounds(oneRow, col) && !board[idx(oneRow, col)]) {
      moves.push(idx(oneRow, col));
      const twoRow = row + dir * 2;
      if (row === startRow && !board[idx(twoRow, col)]) moves.push(idx(twoRow, col));
    }
    for (const dc of [-1, 1]) {
      if (!inBounds(row + dir, col + dc)) continue;
      if (board[idx(row + dir, col + dc)] && isOpponent(board[idx(row + dir, col + dc)], color))
        moves.push(idx(row + dir, col + dc));
    }
    return moves;
  }
  if (type === "n") {
    for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
      const r = row + dr, c = col + dc;
      if (!inBounds(r, c)) continue;
      if (!board[idx(r, c)] || isOpponent(board[idx(r, c)], color)) moves.push(idx(r, c));
    }
    return moves;
  }
  if (type === "b") return getSlidingMoves(board, index, color, [[1,1],[1,-1],[-1,1],[-1,-1]]);
  if (type === "r") return getSlidingMoves(board, index, color, [[1,0],[-1,0],[0,1],[0,-1]]);
  if (type === "q") return getSlidingMoves(board, index, color, [[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]);
  if (type === "k") {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr, c = col + dc;
      if (!inBounds(r, c)) continue;
      if (!board[idx(r, c)] || isOpponent(board[idx(r, c)], color)) moves.push(idx(r, c));
    }
  }
  return moves;
}

function isKingPresent(board: Cell[], color: Color): boolean {
  const king = color === "w" ? "K" : "k";
  return board.includes(king);
}

function allMoves(board: Cell[], color: Color): { from: number; to: number; capture: Cell }[] {
  const moves: { from: number; to: number; capture: Cell }[] = [];
  for (let i = 0; i < 64; i++) {
    if (!board[i] || colorOf(board[i]) !== color) continue;
    for (const to of getLegalMoves(board, i)) {
      moves.push({ from: i, to, capture: board[to] });
    }
  }
  return moves;
}

export function createInitialState(): ChessState {
  return {
    board: [
      "r","n","b","q","k","b","n","r",
      "p","p","p","p","p","p","p","p",
      null,null,null,null,null,null,null,null,
      null,null,null,null,null,null,null,null,
      null,null,null,null,null,null,null,null,
      null,null,null,null,null,null,null,null,
      "P","P","P","P","P","P","P","P",
      "R","N","B","Q","K","B","N","R",
    ],
    turn: "w",
    selected: null,
    legalMoves: [],
    gameOver: false,
    winner: null,
    capturedWhite: [],
    capturedBlack: [],
    moveHistory: [],
  };
}

export function selectPiece(state: ChessState, index: number): ChessState {
  if (state.gameOver) return state;
  const piece = state.board[index];

  // If clicking a legal move target, perform the move
  if (state.selected !== null && state.legalMoves.includes(index)) {
    return movePiece(state, state.selected, index);
  }

  // If clicking own piece, select it
  if (!piece || colorOf(piece) !== state.turn) {
    return { ...state, selected: null, legalMoves: [] };
  }

  return { ...state, selected: index, legalMoves: getLegalMoves(state.board, index) };
}

function promotePawn(board: Cell[], index: number): Cell[] {
  const piece = board[index];
  if (!piece || piece.toLowerCase() !== "p") return board;
  const { row } = pos(index);
  if (piece === "P" && row === 0) { board[index] = "Q"; return board; }
  if (piece === "p" && row === 7) { board[index] = "q"; return board; }
  return board;
}

export function movePiece(state: ChessState, from: number, to: number): ChessState {
  const board = [...state.board];
  const captured = board[to];
  const piece = board[from]!;
  board[to] = piece;
  board[from] = null;
  promotePawn(board, to);

  const capturedWhite = [...state.capturedWhite];
  const capturedBlack = [...state.capturedBlack];
  if (captured) {
    if (colorOf(captured) === "w") capturedBlack.push(captured);
    else capturedWhite.push(captured);
  }

  const cols = "abcdefgh";
  const notation = `${pieceUnicode(piece)}${cols[pos(to).col]}${8 - pos(to).row}`;
  const moveHistory = [...state.moveHistory, notation];

  // Check for king capture (simplified checkmate)
  if (!isKingPresent(board, "w")) {
    return { board, turn: state.turn, selected: null, legalMoves: [], gameOver: true, winner: "b", capturedWhite, capturedBlack, moveHistory };
  }
  if (!isKingPresent(board, "b")) {
    return { board, turn: state.turn, selected: null, legalMoves: [], gameOver: true, winner: "w", capturedWhite, capturedBlack, moveHistory };
  }

  const nextTurn: Color = state.turn === "w" ? "b" : "w";
  const nextMoves = allMoves(board, nextTurn);
  if (nextMoves.length === 0) {
    return { board, turn: nextTurn, selected: null, legalMoves: [], gameOver: true, winner: "draw", capturedWhite, capturedBlack, moveHistory };
  }

  return { board, turn: nextTurn, selected: null, legalMoves: [], gameOver: false, winner: null, capturedWhite, capturedBlack, moveHistory };
}

// --- AI ---
export function getAiMove(state: ChessState): { from: number; to: number } | null {
  const moves = allMoves(state.board, state.turn);
  if (!moves.length) return null;

  // Prioritize captures by value
  const captures = moves
    .filter((m) => m.capture)
    .sort((a, b) => (PIECE_VALUE[b.capture!.toLowerCase()] || 0) - (PIECE_VALUE[a.capture!.toLowerCase()] || 0));
  if (captures.length > 0) return { from: captures[0].from, to: captures[0].to };

  // Random move otherwise
  const chosen = moves[Math.floor(Math.random() * moves.length)];
  return { from: chosen.from, to: chosen.to };
}
