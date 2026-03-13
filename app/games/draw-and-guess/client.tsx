"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { GameConfig } from "@/lib/game-registry";
import { createInitialState, startRound, submitGuess, endRound, getWinner } from "@/lib/games/draw-and-guess";
import { GameShell } from "@/components/games/game-shell";

const DEFAULT_PLAYERS = ["Artist", "Guesser 1", "Guesser 2"];
const COLORS = ["#000000", "#dc2626", "#2563eb", "#16a34a", "#f59e0b", "#8b5cf6", "#ec4899", "#ffffff"];

export function DrawAndGuessClient({ game }: { game: GameConfig }) {
  const [state, setState] = useState(() => createInitialState(DEFAULT_PLAYERS));
  const [guessInput, setGuessInput] = useState("");
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const restart = useCallback(() => {
    setState(createInitialState(DEFAULT_PLAYERS));
    clearCanvas();
  }, []);

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 400, 300); }
  };

  useEffect(() => { clearCanvas(); }, []);

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    drawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const pos = "touches" in e ? e.touches[0] : e;
    ctx.beginPath();
    ctx.moveTo(pos.clientX - rect.left, pos.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const pos = "touches" in e ? e.touches[0] : e;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(pos.clientX - rect.left, pos.clientY - rect.top);
    ctx.stroke();
  };

  const stopDraw = () => { drawing.current = false; };

  const drawerName = state.players[state.drawer];

  if (state.phase === "results") {
    const winner = getWinner(state);
    return (
      <GameShell game={game}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Game Over!</h2>
          <p style={{ fontSize: 16 }}>Winner: <strong>{winner}</strong></p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {Object.entries(state.scores).sort((a, b) => b[1] - a[1]).map(([p, s]) => (
              <div key={p} style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>{p}: {s} pts</div>
            ))}
          </div>
          <button onClick={restart} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "var(--color-primary)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Play Again
          </button>
        </div>
      </GameShell>
    );
  }

  if (state.phase === "setup") {
    return (
      <GameShell game={game}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Round {state.round + 1}</h2>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
            <strong>{drawerName}</strong> will draw. Everyone else guesses!
          </p>
          <button
            onClick={() => { clearCanvas(); setState((s) => startRound(s)); }}
            style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: "var(--color-primary)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Start Drawing
          </button>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell game={game} status={`${drawerName} is drawing | Round ${state.round + 1}`}>
      {/* Word (only drawer sees) */}
      <div style={{ marginBottom: 8, padding: "8px 16px", borderRadius: 8, background: "var(--color-primary-dim)", textAlign: "center" }}>
        <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Word: </span>
        <span style={{ fontSize: 18, fontWeight: 700, color: "var(--color-primary-hover)" }}>{state.word}</span>
        <span style={{ fontSize: 11, color: "var(--color-text-muted)", marginLeft: 8 }}>(Only {drawerName} should see this!)</span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
        style={{ width: "100%", maxWidth: 400, borderRadius: 8, border: "2px solid var(--color-border)", background: "#fff", cursor: "crosshair", touchAction: "none" }}
      />

      {/* Brush controls */}
      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setBrushColor(c)}
            style={{
              width: 24, height: 24, borderRadius: "50%",
              border: brushColor === c ? "3px solid var(--color-primary)" : "2px solid var(--color-border)",
              background: c, cursor: "pointer",
            }}
          />
        ))}
        <select
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text)", fontSize: 12 }}
        >
          <option value={2}>Thin</option>
          <option value={4}>Medium</option>
          <option value={8}>Thick</option>
          <option value={16}>Very Thick</option>
        </select>
        <button onClick={clearCanvas} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-secondary)", fontSize: 12, cursor: "pointer" }}>
          Clear
        </button>
      </div>

      {/* Guesses */}
      <div style={{ width: "100%", marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {state.players.filter((_, i) => i !== state.drawer).map((player) => {
          const correct = state.guesses.some((g) => g.player === player && g.correct);
          return (
            <div key={player} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 80, fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}>{player}</span>
              {correct ? (
                <span style={{ fontSize: 13, color: "var(--color-success)" }}>Correct! ✓</span>
              ) : (
                <div style={{ flex: 1, display: "flex", gap: 6 }}>
                  <input
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && guessInput.trim()) {
                        setState((s) => submitGuess(s, player, guessInput.trim()));
                        setGuessInput("");
                      }
                    }}
                    placeholder="Type guess..."
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, outline: "none" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setState((s) => endRound(s))}
        style={{ marginTop: 12, padding: "8px 20px", borderRadius: 8, border: "none", background: "var(--color-surface)", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer" }}
      >
        End Round
      </button>
    </GameShell>
  );
}
