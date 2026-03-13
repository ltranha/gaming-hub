"use client";

import { useState, useCallback, useEffect } from "react";
import type { GameConfig, GameMode } from "@/lib/game-registry";
import type { TicTacToeState, Difficulty } from "@/lib/games/tic-tac-toe";
import { createInitialState, makeMove, getAiMove } from "@/lib/games/tic-tac-toe";
import { GameShell } from "@/components/games/game-shell";
import { ModeSelector, DifficultyPicker } from "@/components/games/mode-selector";

/**
 * Tic-Tac-Toe game client.
 * Manages mode selection, AI moves, board rendering, and game state.
 */
export function TicTacToeClient({ game }: { game: GameConfig }) {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("hard");
  const [state, setState] = useState<TicTacToeState>(createInitialState);

  const restart = useCallback(() => setState(createInitialState()), []);

  const handleCellClick = useCallback(
    (index: number) => {
      if (state.gameOver || state.board[index] !== null) return;
      if (mode === "ai" && state.currentPlayer === "O") return;
      setState((prev) => makeMove(prev, index));
    },
    [state, mode]
  );

  useEffect(() => {
    if (mode !== "ai" || state.gameOver || state.currentPlayer !== "O") return;
    const timer = setTimeout(() => {
      const move = getAiMove([...state.board], difficulty);
      if (move !== null) setState((prev) => makeMove(prev, move));
    }, 400);
    return () => clearTimeout(timer);
  }, [mode, state, difficulty]);

  const statusText = state.gameOver
    ? state.winner
      ? `${state.winner === "X" ? (mode === "ai" ? "You win!" : "Player X wins!") : mode === "ai" ? "AI wins!" : "Player O wins!"}`
      : "It's a draw!"
    : `${state.currentPlayer === "X" ? (mode === "ai" ? "Your" : "X's") : mode === "ai" ? "AI's" : "O's"} turn`;

  if (!mode) {
    return (
      <GameShell game={game}>
        <ModeSelector modes={game.modes} selected={mode} onSelect={(m) => { setMode(m); restart(); }} />
      </GameShell>
    );
  }

  return (
    <GameShell game={game} status={statusText} onRestart={restart}>
      {mode === "ai" && (
        <DifficultyPicker value={difficulty} onChange={(d) => { setDifficulty(d as Difficulty); restart(); }} />
      )}

      {/* Board */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 16 }}>
        {state.board.map((cell, i) => {
          const isWin = state.winningCells.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              disabled={state.gameOver || cell !== null}
              style={{
                width: 96,
                height: 96,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                border: `2px solid ${isWin ? "var(--color-success)" : cell ? "var(--color-border-bright)" : "var(--color-border)"}`,
                background: isWin ? "var(--color-success-dim)" : cell ? "var(--color-surface)" : "var(--color-bg-tertiary)",
                fontSize: 32,
                fontWeight: 700,
                color: isWin ? "var(--color-success)" : cell === "X" ? "var(--color-primary-hover)" : "var(--color-error)",
                cursor: state.gameOver || cell ? "default" : "pointer",
                transition: "all 200ms",
              }}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* Game Over actions */}
      {state.gameOver && (
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24 }}>
          <ActionBtn onClick={restart} primary>Play Again</ActionBtn>
          <ActionBtn onClick={() => { setMode(null); restart(); }}>Change Mode</ActionBtn>
        </div>
      )}
    </GameShell>
  );
}

function ActionBtn({ onClick, primary, children }: { onClick: () => void; primary?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: 10,
        border: "none",
        background: primary ? "var(--color-primary)" : "var(--color-surface)",
        color: primary ? "#fff" : "var(--color-text-secondary)",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 150ms",
      }}
    >
      {children}
    </button>
  );
}
