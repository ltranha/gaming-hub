"use client";

import { useState, useCallback, useEffect } from "react";
import type { GameConfig } from "@/lib/game-registry";
import { createInitialState, sow, getAiMove, getScore } from "@/lib/games/mancala";
import { GameShell } from "@/components/games/game-shell";
import { ModeSelector } from "@/components/games/mode-selector";

type Mode = "local" | "ai";

export function MancalaClient({ game }: { game: GameConfig }) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [state, setState] = useState(createInitialState);

  const restart = useCallback(() => setState(createInitialState()), []);

  useEffect(() => {
    if (mode !== "ai" || state.currentPlayer !== 1 || state.gameOver) return;
    const t = setTimeout(() => {
      const mv = getAiMove(state);
      if (mv !== null) setState((s) => sow(s, mv));
    }, 500);
    return () => clearTimeout(t);
  }, [mode, state]);

  if (!mode) {
    return (
      <GameShell game={game}>
        <ModeSelector
          modes={[
            { id: "local", label: "Local 2P", desc: "Play with a friend", icon: "👥" },
            { id: "ai", label: "vs AI", desc: "Challenge the computer", icon: "🤖" },
          ]}
          onSelect={(m) => setMode(m as Mode)}
        />
      </GameShell>
    );
  }

  const [s1, s2] = getScore(state);
  const p1Label = mode === "ai" ? "You" : "Player 1";
  const p2Label = mode === "ai" ? "AI" : "Player 2";
  const turnText = state.gameOver
    ? (s1 > s2 ? `${p1Label} wins!` : s2 > s1 ? `${p2Label} wins!` : "Draw!")
    : `${state.currentPlayer === 0 ? p1Label : p2Label}'s turn${state.lastAction ? ` — ${state.lastAction}` : ""}`;

  const pitStyle = (idx: number, clickable: boolean): React.CSSProperties => ({
    width: 48,
    height: 48,
    borderRadius: "50%",
    border: "none",
    background: clickable ? "var(--color-surface-hover)" : "var(--color-surface)",
    color: "var(--color-text)",
    fontSize: 18,
    fontWeight: 700,
    cursor: clickable ? "pointer" : "default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 150ms",
  });

  const storeStyle: React.CSSProperties = {
    width: 56,
    minHeight: 100,
    borderRadius: 28,
    background: "var(--color-bg-tertiary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 800,
    color: "var(--color-text)",
    border: "2px solid var(--color-border)",
  };

  const canClick = (idx: number) => {
    if (state.gameOver) return false;
    if (state.pits[idx] === 0) return false;
    if (state.currentPlayer === 0 && idx >= 0 && idx <= 5) return mode === "local" || true;
    if (state.currentPlayer === 1 && idx >= 7 && idx <= 12) return mode === "local";
    return false;
  };

  // P2 pits: indices 12..7 (displayed top row, left to right)
  // P1 pits: indices 0..5 (displayed bottom row, left to right)
  return (
    <GameShell game={game} onRestart={restart} status={turnText}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 16,
        borderRadius: 16,
        background: "var(--color-bg-secondary)",
        border: "2px solid var(--color-border)",
      }}>
        {/* P2 Store */}
        <div style={storeStyle}>{s2}</div>

        {/* Pits */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* P2 row (top) */}
          <div style={{ display: "flex", gap: 8 }}>
            {[12, 11, 10, 9, 8, 7].map((i) => (
              <button key={i} onClick={() => canClick(i) && setState((s) => sow(s, i))} style={pitStyle(i, canClick(i))}>
                {state.pits[i]}
              </button>
            ))}
          </div>
          {/* Labels */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px" }}>
            <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>← {p2Label}</span>
            <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{p1Label} →</span>
          </div>
          {/* P1 row (bottom) */}
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <button key={i} onClick={() => canClick(i) && setState((s) => sow(s, i))} style={pitStyle(i, canClick(i))}>
                {state.pits[i]}
              </button>
            ))}
          </div>
        </div>

        {/* P1 Store */}
        <div style={storeStyle}>{s1}</div>
      </div>
    </GameShell>
  );
}
