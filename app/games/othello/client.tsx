"use client";

import { useState, useCallback, useEffect } from "react";
import type { GameConfig } from "@/lib/game-registry";
import { createInitialState, makeMove, getAiMove } from "@/lib/games/othello";
import { GameShell } from "@/components/games/game-shell";
import { ModeSelector } from "@/components/games/mode-selector";

type Mode = "local" | "ai";

export function OthelloClient({ game }: { game: GameConfig }) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [state, setState] = useState(createInitialState);

  const restart = useCallback(() => setState(createInitialState()), []);

  // AI move
  useEffect(() => {
    if (mode !== "ai" || state.currentPlayer !== 2 || state.gameOver) return;
    const timer = setTimeout(() => {
      const mv = getAiMove(state);
      if (mv) setState((s) => makeMove(s, mv[0], mv[1]));
    }, 400);
    return () => clearTimeout(timer);
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

  const player1Label = mode === "ai" ? "You (Black)" : "Black";
  const player2Label = mode === "ai" ? "AI (White)" : "White";
  const [s1, s2] = state.score;
  const turnLabel = state.gameOver
    ? (s1 > s2 ? `${player1Label} wins!` : s2 > s1 ? `${player2Label} wins!` : "Draw!")
    : `${state.currentPlayer === 1 ? player1Label : player2Label}'s turn`;

  return (
    <GameShell game={game} onRestart={restart} status={`${turnLabel} | ${s1} - ${s2}`}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: 1,
          padding: 4,
          borderRadius: 8,
          background: "#065f46",
          width: "100%",
          maxWidth: 360,
          aspectRatio: "1",
        }}
      >
        {state.board.flat().map((val, idx) => {
          const r = Math.floor(idx / 8), c = idx % 8;
          const isValid = state.validMoves.some(([mr, mc]) => mr === r && mc === c);
          const isLast = state.lastMove && state.lastMove[0] === r && state.lastMove[1] === c;
          const canClick = isValid && !state.gameOver && (mode === "local" || state.currentPlayer === 1);

          return (
            <button
              key={idx}
              onClick={() => canClick && setState((s) => makeMove(s, r, c))}
              style={{
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                borderRadius: 2,
                background: isLast ? "#047857" : "#059669",
                cursor: canClick ? "pointer" : "default",
                position: "relative",
              }}
            >
              {val > 0 && (
                <div style={{
                  width: "78%",
                  height: "78%",
                  borderRadius: "50%",
                  background: val === 1 ? "#111" : "#f5f5f5",
                  boxShadow: "0 2px 4px rgba(0,0,0,.3)",
                  transition: "all 200ms",
                }} />
              )}
              {val === 0 && isValid && canClick && (
                <div style={{
                  width: "30%",
                  height: "30%",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                }} />
              )}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
