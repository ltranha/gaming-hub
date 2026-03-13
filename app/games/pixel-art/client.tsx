"use client";

import { useState, useRef, useCallback } from "react";
import type { GameConfig } from "@/lib/game-registry";
import { createInitialState, paintPixel, fillBucket, undo, clearCanvas, PALETTE } from "@/lib/games/pixel-art";
import { GameShell } from "@/components/games/game-shell";

type Tool = "brush" | "fill" | "eraser";

export function PixelArtClient({ game }: { game: GameConfig }) {
  const [state, setState] = useState(() => createInitialState(24, 32));
  const [color, setColor] = useState("#000000");
  const [tool, setTool] = useState<Tool>("brush");
  const painting = useRef(false);

  const restart = useCallback(() => setState((s) => clearCanvas(s)), []);

  const handlePixel = (r: number, c: number) => {
    if (tool === "fill") {
      setState((s) => fillBucket(s, r, c, color));
    } else {
      const paintColor = tool === "eraser" ? "#ffffff" : color;
      setState((s) => paintPixel(s, r, c, paintColor));
    }
  };

  const pixelSize = Math.min(16, Math.floor(560 / state.cols));

  return (
    <GameShell game={game} onRestart={restart}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        {(["brush", "fill", "eraser"] as Tool[]).map((t) => (
          <button
            key={t}
            onClick={() => setTool(t)}
            style={{
              padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 12,
              fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
              background: tool === t ? "var(--color-primary)" : "var(--color-surface)",
              color: tool === t ? "#fff" : "var(--color-text-muted)",
            }}
          >
            {t === "brush" ? "🖌 Brush" : t === "fill" ? "🪣 Fill" : "🧹 Eraser"}
          </button>
        ))}
        <button
          onClick={() => setState((s) => undo(s))}
          style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", fontSize: 12, cursor: "pointer" }}
        >
          ↩ Undo
        </button>
      </div>

      {/* Palette */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {PALETTE.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{
              width: 24, height: 24, borderRadius: 4,
              border: color === c ? "3px solid var(--color-primary)" : "1px solid var(--color-border)",
              background: c, cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* Canvas grid */}
      <div
        onMouseLeave={() => { painting.current = false; }}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${state.cols}, ${pixelSize}px)`,
          border: "1px solid var(--color-border)",
          borderRadius: 4,
          overflow: "hidden",
          cursor: tool === "fill" ? "crosshair" : "cell",
          userSelect: "none",
        }}
      >
        {state.grid.flat().map((cellColor, idx) => {
          const r = Math.floor(idx / state.cols), c = idx % state.cols;
          return (
            <div
              key={idx}
              onMouseDown={() => { painting.current = true; handlePixel(r, c); }}
              onMouseEnter={() => { if (painting.current && tool !== "fill") handlePixel(r, c); }}
              onMouseUp={() => { painting.current = false; }}
              style={{
                width: pixelSize,
                height: pixelSize,
                background: cellColor,
              }}
            />
          );
        })}
      </div>

      <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 8, textAlign: "center" }}>
        Click and drag to paint. Use fill bucket for large areas.
      </p>
    </GameShell>
  );
}
