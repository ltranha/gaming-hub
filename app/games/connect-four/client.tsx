"use client";

import { useState, useCallback, useEffect } from "react";
import type { GameConfig, GameMode } from "@/lib/game-registry";
import type { ConnectFourState, Difficulty } from "@/lib/games/connect-four";
import { createInitialState, dropPiece, getAiMove, COLS, ROWS } from "@/lib/games/connect-four";
import { GameShell } from "@/components/games/game-shell";
import { ModeSelector, DifficultyPicker } from "@/components/games/mode-selector";

/**
 * Connect Four game client.
 */
export function ConnectFourClient({ game }: { game: GameConfig }) {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [state, setState] = useState<ConnectFourState>(createInitialState);

  const restart = useCallback(() => setState(createInitialState()), []);

  const handleDrop = useCallback(
    (col: number) => {
      if (state.gameOver) return;
      if (mode === "ai" && state.currentPlayer === "Y") return;
      setState((prev) => dropPiece(prev, col));
    },
    [state.gameOver, state.currentPlayer, mode]
  );

  useEffect(() => {
    if (mode !== "ai" || state.gameOver || state.currentPlayer !== "Y") return;
    const timer = setTimeout(() => {
      const col = getAiMove(state, difficulty);
      if (col !== null) setState((prev) => dropPiece(prev, col));
    }, 400);
    return () => clearTimeout(timer);
  }, [mode, state, difficulty]);

  const label = (p: "R" | "Y") => (p === "R" ? (mode === "ai" ? "You" : "Red") : mode === "ai" ? "AI" : "Yellow");
  const statusText = state.gameOver
    ? state.winner ? `${label(state.winner)} wins!` : "It's a draw!"
    : `${label(state.currentPlayer)}'s turn`;

  if (!mode) {
    return (
      <GameShell game={game}>
        <ModeSelector modes={game.modes} selected={mode} onSelect={(m) => { setMode(m as GameMode); restart(); }} />
      </GameShell>
    );
  }

  return (
    <GameShell game={game} status={statusText} onRestart={restart}>
      {mode === "ai" && <DifficultyPicker value={difficulty} onChange={(d) => { setDifficulty(d as Difficulty); restart(); }} />}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: 4,
          padding: 12,
          borderRadius: 20,
          background: "var(--color-primary)",
          marginTop: 16,
        }}
      >
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => {
            const i = r * COLS + c;
            const cell = state.board[i];
            const isWin = state.winningCells.includes(i);
            return (
              <button
                key={i}
                onClick={() => handleDrop(c)}
                disabled={state.gameOver}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "none",
                  cursor: state.gameOver ? "default" : "pointer",
                  transition: "all 200ms",
                  background: cell === "R" ? "#ef4444" : cell === "Y" ? "#facc15" : "var(--color-bg-tertiary)",
                  boxShadow: isWin ? "0 0 0 3px white" : "inset 0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
            );
          })
        )}
      </div>

      {state.gameOver && (
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24 }}>
          <button onClick={restart} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "var(--color-primary)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Play Again</button>
          <button onClick={() => { setMode(null); restart(); }} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "var(--color-surface)", color: "var(--color-text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Change Mode</button>
        </div>
      )}
    </GameShell>
  );
}
