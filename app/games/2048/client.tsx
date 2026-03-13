"use client";

import { useState, useEffect, useCallback } from "react";
import type { GameConfig } from "@/lib/game-registry";
import { createInitialState, move, continueGame, type Direction, type State2048 } from "@/lib/games/twenty48";
import { GameShell } from "@/components/games/game-shell";

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0:    { bg: "rgba(255,255,255,0.05)", text: "transparent" },
  2:    { bg: "#eee4da", text: "#776e65" },
  4:    { bg: "#ede0c8", text: "#776e65" },
  8:    { bg: "#f2b179", text: "#f9f6f2" },
  16:   { bg: "#f59563", text: "#f9f6f2" },
  32:   { bg: "#f67c5f", text: "#f9f6f2" },
  64:   { bg: "#f65e3b", text: "#f9f6f2" },
  128:  { bg: "#edcf72", text: "#f9f6f2" },
  256:  { bg: "#edcc61", text: "#f9f6f2" },
  512:  { bg: "#edc850", text: "#f9f6f2" },
  1024: { bg: "#edc53f", text: "#f9f6f2" },
  2048: { bg: "#edc22e", text: "#f9f6f2" },
};

function getTileStyle(val: number): { bg: string; text: string } {
  return TILE_COLORS[val] ?? { bg: "#3c3a32", text: "#f9f6f2" };
}

export function Game2048Client({ game }: { game: GameConfig }) {
  const [state, setState] = useState<State2048>(createInitialState);

  const handleMove = useCallback((dir: Direction) => {
    setState((s) => move(s, dir));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right",
      };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); handleMove(dir); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleMove]);

  // Touch/swipe support
  useEffect(() => {
    let startX = 0, startY = 0;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      const absDx = Math.abs(dx), absDy = Math.abs(dy);
      if (Math.max(absDx, absDy) < 30) return;
      if (absDx > absDy) handleMove(dx > 0 ? "right" : "left");
      else handleMove(dy > 0 ? "down" : "up");
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchend", onEnd); };
  }, [handleMove]);

  const restart = useCallback(() => setState(createInitialState()), []);

  return (
    <GameShell game={game} onRestart={restart} status={`Score: ${state.score}`}>
      {/* Score bar */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: 16, marginBottom: 16 }}>
        <ScoreBox label="Score" value={state.score} />
        <ScoreBox label="Best" value={state.bestScore} />
      </div>

      {/* Board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          padding: 8,
          borderRadius: 12,
          background: "#bbada0",
          width: "100%",
          maxWidth: 340,
          aspectRatio: "1",
        }}
      >
        {state.grid.flat().map((val, i) => {
          const { bg, text } = getTileStyle(val);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
                background: bg,
                color: text,
                fontSize: val >= 1024 ? 20 : val >= 128 ? 24 : 28,
                fontWeight: 800,
                transition: "all 100ms",
                aspectRatio: "1",
              }}
            >
              {val > 0 ? val : ""}
            </div>
          );
        })}
      </div>

      {/* Overlays */}
      {state.won && !state.keepPlaying && (
        <Overlay color="rgba(237,197,63,0.5)" message="You reached 2048!">
          <button onClick={() => setState((s) => continueGame(s))} style={overlayBtn}>Keep Going</button>
          <button onClick={restart} style={{ ...overlayBtn, background: "var(--color-surface)" }}>New Game</button>
        </Overlay>
      )}
      {state.gameOver && (
        <Overlay color="rgba(238,228,218,0.5)" message="Game Over!">
          <button onClick={restart} style={overlayBtn}>Try Again</button>
        </Overlay>
      )}

      <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 12, textAlign: "center" }}>
        Use arrow keys or WASD to move tiles. Swipe on mobile.
      </p>
    </GameShell>
  );
}

function ScoreBox({ label, value }: { label: string; value: number }) {
  return (
    <div style={{
      padding: "8px 20px",
      borderRadius: 8,
      background: "#bbada0",
      textAlign: "center",
      minWidth: 80,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#eee4da", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{value}</div>
    </div>
  );
}

const overlayBtn: React.CSSProperties = {
  padding: "10px 24px",
  borderRadius: 8,
  border: "none",
  background: "#8f7a66",
  color: "#f9f6f2",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

function Overlay({ color, message, children }: { color: string; message: string; children: React.ReactNode }) {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      background: color,
      borderRadius: 12,
      zIndex: 10,
    }}>
      <p style={{ fontSize: 28, fontWeight: 800, color: "#776e65" }}>{message}</p>
      <div style={{ display: "flex", gap: 12 }}>{children}</div>
    </div>
  );
}
