"use client";

import { useState, useCallback, useEffect } from "react";
import type { GameConfig } from "@/lib/game-registry";
import { createInitialState, selectCell, placeNumber, clearCell, hasConflict, type Difficulty } from "@/lib/games/sudoku";
import { GameShell } from "@/components/games/game-shell";

export function SudokuClient({ game }: { game: GameConfig }) {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [state, setState] = useState(() => createInitialState("easy"));

  const restart = useCallback((d?: Difficulty) => {
    const diff = d ?? difficulty;
    setDifficulty(diff);
    setState(createInitialState(diff));
  }, [difficulty]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const n = parseInt(e.key);
      if (n >= 1 && n <= 9) setState((s) => placeNumber(s, n));
      if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") setState((s) => clearCell(s));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const [sr, sc] = state.selected ?? [-1, -1];
  const selectedVal = sr >= 0 ? state.current[sr][sc] : 0;
  const statusText = state.completed ? "Solved!" : `Mistakes: ${state.mistakes}`;

  return (
    <GameShell game={game} onRestart={() => restart()} status={statusText}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => restart(d)}
            style={{
              padding: "6px 16px", borderRadius: 999, border: "none", fontSize: 12,
              fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
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
          gridTemplateColumns: "repeat(9, 36px)",
          width: "fit-content",
          border: "2px solid var(--color-text-secondary)",
          borderRadius: 4,
        }}
      >
        {state.current.flat().map((val, idx) => {
          const r = Math.floor(idx / 9), c = idx % 9;
          const isGiven = state.given[r][c];
          const isSelected = r === sr && c === sc;
          const isSameVal = val > 0 && val === selectedVal;
          const isConflict = val > 0 && hasConflict(state, r, c);
          const isSameRow = r === sr;
          const isSameCol = c === sc;
          const isSameBox = sr >= 0 && Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3);

          let bg = "var(--color-bg)";
          if (isSelected) bg = "var(--color-primary-dim)";
          else if (isSameVal) bg = "rgba(91,108,255,0.1)";
          else if (isSameRow || isSameCol || isSameBox) bg = "var(--color-bg-secondary)";

          return (
            <button
              key={idx}
              onClick={() => setState((s) => selectCell(s, r, c))}
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                borderRight: (c + 1) % 3 === 0 && c < 8 ? "2px solid var(--color-text-secondary)" : "1px solid var(--color-border)",
                borderBottom: (r + 1) % 3 === 0 && r < 8 ? "2px solid var(--color-text-secondary)" : "1px solid var(--color-border)",
                background: bg,
                color: isConflict ? "var(--color-error)" : isGiven ? "var(--color-text)" : "var(--color-primary)",
                fontSize: 16,
                fontWeight: isGiven ? 700 : 500,
                cursor: "pointer",
              }}
            >
              {val > 0 ? val : ""}
            </button>
          );
        })}
      </div>

      {/* Number pad */}
      <div style={{ display: "flex", gap: 6, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => setState((s) => placeNumber(s, n))}
            style={{
              width: 36, height: 36, borderRadius: 8, border: "none",
              background: "var(--color-surface)", color: "var(--color-text)",
              fontSize: 16, fontWeight: 700, cursor: "pointer",
            }}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => setState((s) => clearCell(s))}
          style={{
            width: 36, height: 36, borderRadius: 8, border: "none",
            background: "var(--color-error-dim)", color: "var(--color-error)",
            fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 12, textAlign: "center" }}>
        Click a cell, then type or tap a number. Press Backspace to clear.
      </p>
    </GameShell>
  );
}
