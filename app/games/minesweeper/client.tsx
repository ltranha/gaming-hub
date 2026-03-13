"use client";

import { useState, useCallback } from "react";
import type { GameConfig } from "@/lib/game-registry";
import { createInitialState, revealCell, toggleFlag, type Difficulty } from "@/lib/games/minesweeper";
import { GameShell } from "@/components/games/game-shell";

const NUM_COLORS = ["", "#2563eb", "#16a34a", "#dc2626", "#7c3aed", "#92400e", "#0891b2", "#1e293b", "#6b7280"];

export function MinesweeperClient({ game }: { game: GameConfig }) {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [state, setState] = useState(() => createInitialState("easy"));

  const restart = useCallback((d?: Difficulty) => {
    const diff = d ?? difficulty;
    setDifficulty(diff);
    setState(createInitialState(diff));
  }, [difficulty]);

  const handleClick = (r: number, c: number) => setState((s) => revealCell(s, r, c));
  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    setState((s) => toggleFlag(s, r, c));
  };

  const cellSize = difficulty === "easy" ? 34 : difficulty === "medium" ? 26 : 20;
  const statusText = state.won ? "You Win!" : state.gameOver ? "Game Over!" : `Mines: ${state.mines - state.flagCount}`;

  return (
    <GameShell game={game} onRestart={() => restart()} status={statusText}>
      {/* Difficulty */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => restart(d)}
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              border: "none",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
              background: difficulty === d ? "var(--color-primary)" : "var(--color-surface)",
              color: difficulty === d ? "#fff" : "var(--color-text-muted)",
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Board */}
      <div
        style={{
          display: "inline-grid",
          gridTemplateColumns: `repeat(${state.cols}, ${cellSize}px)`,
          gap: 1,
          background: "var(--color-border)",
          borderRadius: 8,
          overflow: "hidden",
          border: "2px solid var(--color-border)",
        }}
      >
        {state.grid.flat().map((cell, idx) => {
          const r = Math.floor(idx / state.cols), c = idx % state.cols;
          let content = "";
          let bg = "var(--color-surface)";
          let color = "var(--color-text)";

          if (cell.flagged && !cell.revealed) {
            content = "🚩";
          } else if (cell.revealed) {
            bg = "var(--color-bg-secondary)";
            if (cell.mine) {
              content = "💥";
              bg = "var(--color-error-dim)";
            } else if (cell.adjacentMines > 0) {
              content = String(cell.adjacentMines);
              color = NUM_COLORS[cell.adjacentMines] || "var(--color-text)";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleClick(r, c)}
              onContextMenu={(e) => handleRightClick(e, r, c)}
              style={{
                width: cellSize,
                height: cellSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                background: bg,
                color,
                fontSize: cellSize > 26 ? 14 : 11,
                fontWeight: 800,
                cursor: cell.revealed ? "default" : "pointer",
              }}
            >
              {content}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 12, textAlign: "center" }}>
        Click to reveal. Right-click to flag.
      </p>
    </GameShell>
  );
}
