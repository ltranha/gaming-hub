"use client";

import { useState, useCallback, useEffect } from "react";
import type { GameConfig, GameMode } from "@/lib/game-registry";
import type { ChessState } from "@/lib/games/chess";
import { createInitialState, selectPiece, movePiece, getAiMove, pieceUnicode } from "@/lib/games/chess";
import { GameShell } from "@/components/games/game-shell";
import { ModeSelector } from "@/components/games/mode-selector";

/**
 * Chess game client.
 * Supports local 2-player and AI modes with piece movement and capture.
 */
export function ChessClient({ game }: { game: GameConfig }) {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [state, setState] = useState<ChessState>(createInitialState);

  const restart = useCallback(() => setState(createInitialState()), []);

  const handleCell = useCallback(
    (index: number) => {
      if (state.gameOver) return;
      if (mode === "ai" && state.turn === "b") return;
      setState((prev) => selectPiece(prev, index));
    },
    [state.gameOver, state.turn, mode]
  );

  useEffect(() => {
    if (mode !== "ai" || state.gameOver || state.turn !== "b") return;
    const timer = setTimeout(() => {
      const move = getAiMove(state);
      if (move) setState((prev) => movePiece(prev, move.from, move.to));
    }, 350);
    return () => clearTimeout(timer);
  }, [mode, state]);

  const turnLabel = state.turn === "w" ? "White" : "Black";
  const statusText = state.gameOver
    ? state.winner === "draw" ? "Stalemate — Draw!" : `${state.winner === "w" ? "White" : "Black"} wins!`
    : `${turnLabel}'s turn${mode === "ai" && state.turn === "b" ? " (AI thinking...)" : ""}`;

  if (!mode) {
    return (
      <GameShell game={game}>
        <ModeSelector modes={game.modes} selected={mode} onSelect={(m) => { setMode(m as GameMode); restart(); }} />
      </GameShell>
    );
  }

  const CELL_SIZE = 52;

  return (
    <GameShell game={game} status={statusText} onRestart={restart}>
      {/* Captured pieces */}
      <div style={{ display: "flex", justifyContent: "space-between", width: CELL_SIZE * 8, marginBottom: 8, fontSize: 18 }}>
        <div style={{ display: "flex", gap: 2 }}>
          {state.capturedWhite.map((p, i) => <span key={i} style={{ color: "var(--color-text-muted)" }}>{pieceUnicode(p)}</span>)}
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {state.capturedBlack.map((p, i) => <span key={i} style={{ color: "var(--color-text-muted)" }}>{pieceUnicode(p)}</span>)}
        </div>
      </div>

      {/* Board */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", borderRadius: 12, overflow: "hidden", border: "2px solid var(--color-border)" }}>
        {Array.from({ length: 64 }, (_, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const isLight = (row + col) % 2 === 0;
          const piece = state.board[i];
          const isSelected = state.selected === i;
          const isLegal = state.legalMoves.includes(i);
          const isBlack = piece ? piece === piece.toLowerCase() : false;

          return (
            <button
              key={i}
              onClick={() => handleCell(i)}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                border: "none",
                cursor: piece && !state.gameOver ? "pointer" : "default",
                background: isSelected
                  ? "rgba(91, 108, 255, 0.3)"
                  : isLegal
                    ? isLight ? "rgba(34, 197, 94, 0.25)" : "rgba(34, 197, 94, 0.2)"
                    : isLight ? "#e8dcc8" : "#b58863",
                outline: isSelected ? "2px solid var(--color-primary)" : "none",
                outlineOffset: -2,
                transition: "background 150ms",
              }}
            >
              {piece && (
                <span style={{ color: isBlack ? "#1a1a2e" : "#fff", textShadow: isBlack ? "none" : "0 1px 2px rgba(0,0,0,0.3)" }}>
                  {pieceUnicode(piece)}
                </span>
              )}
              {isLegal && !piece && (
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(34, 197, 94, 0.5)" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Move History */}
      {state.moveHistory.length > 0 && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: "var(--color-bg-secondary)", width: "100%", maxWidth: CELL_SIZE * 8 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-muted)", marginBottom: 6 }}>Moves</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, fontSize: 12, color: "var(--color-text-secondary)" }}>
            {state.moveHistory.map((m, i) => (
              <span key={i} style={{ padding: "2px 6px", borderRadius: 4, background: "var(--color-surface)" }}>
                {i % 2 === 0 && <span style={{ color: "var(--color-text-muted)" }}>{Math.floor(i / 2) + 1}.</span>}
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {state.gameOver && (
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24 }}>
          <button onClick={restart} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "var(--color-primary)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Play Again</button>
          <button onClick={() => { setMode(null); restart(); }} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "var(--color-surface)", color: "var(--color-text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Change Mode</button>
        </div>
      )}
    </GameShell>
  );
}
