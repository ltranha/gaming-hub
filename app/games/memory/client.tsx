"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { GameConfig } from "@/lib/game-registry";
import type { MemoryState, Theme, MemoryDifficulty } from "@/lib/games/memory";
import { createInitialState, flipCard, unflipCards } from "@/lib/games/memory";
import { GameShell } from "@/components/games/game-shell";

/**
 * Memory card game client.
 * Supports emoji/symbol/number themes and 3 difficulty levels.
 */
export function MemoryClient({ game }: { game: GameConfig }) {
  const [theme, setTheme] = useState<Theme>("emoji");
  const [difficulty, setDifficulty] = useState<MemoryDifficulty>("medium");
  const [state, setState] = useState<MemoryState>(() => createInitialState(theme, difficulty));
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const restart = useCallback(() => {
    setState(createInitialState(theme, difficulty));
    setTime(0);
    setStarted(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [theme, difficulty]);

  useEffect(() => {
    if (started && !state.gameOver) {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
    if (state.gameOver && timerRef.current) clearInterval(timerRef.current);
  }, [started, state.gameOver]);

  useEffect(() => {
    if (state.locked) {
      const timer = setTimeout(() => setState((prev) => unflipCards(prev)), 700);
      return () => clearTimeout(timer);
    }
  }, [state.locked]);

  const handleFlip = useCallback(
    (id: number) => {
      if (!started) setStarted(true);
      setState((prev) => flipCard(prev, id));
    },
    [started]
  );

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const cols = difficulty === "easy" ? 4 : difficulty === "medium" ? 4 : 6;
  const statusText = state.gameOver
    ? `Completed in ${state.moves} moves (${formatTime(time)})`
    : `Moves: ${state.moves} | Time: ${formatTime(time)} | Pairs: ${state.matched}/${state.total}`;

  return (
    <GameShell game={game} status={statusText} onRestart={restart}>
      {/* Settings */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 24 }}>
        <SettingGroup label="Theme">
          {(["emoji", "symbols", "numbers"] as Theme[]).map((t) => (
            <PillBtn key={t} active={theme === t} onClick={() => { setTheme(t); restart(); }}>
              {t === "emoji" ? "🎮 Emoji" : t === "symbols" ? "♦ Symbols" : "123 Numbers"}
            </PillBtn>
          ))}
        </SettingGroup>
        <SettingGroup label="Size">
          {(["easy", "medium", "hard"] as MemoryDifficulty[]).map((d) => (
            <PillBtn key={d} active={difficulty === d} onClick={() => { setDifficulty(d); restart(); }}>
              {d === "easy" ? "4×2" : d === "medium" ? "4×4" : "6×4"}
            </PillBtn>
          ))}
        </SettingGroup>
      </div>

      {/* Board */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>
        {state.cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            disabled={card.flipped || card.matched || state.locked}
            style={{
              width: 68,
              height: 68,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              border: `2px solid ${card.matched ? "var(--color-success)" : card.flipped ? "var(--color-primary)" : "var(--color-border)"}`,
              background: card.matched ? "var(--color-success-dim)" : card.flipped ? "var(--color-primary-dim)" : "var(--color-surface)",
              fontSize: 24,
              fontWeight: 700,
              color: card.matched ? "var(--color-success)" : card.flipped ? "var(--color-text)" : "var(--color-text-muted)",
              cursor: card.flipped || card.matched || state.locked ? "default" : "pointer",
              transition: "all 250ms",
              transform: card.matched ? "scale(0.95)" : "scale(1)",
            }}
          >
            {card.flipped || card.matched ? card.value : "?"}
          </button>
        ))}
      </div>

      {state.gameOver && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: "var(--color-success)", marginBottom: 16 }}>
            Congratulations!
          </p>
          <button
            onClick={restart}
            style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "var(--color-primary)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Play Again
          </button>
        </div>
      )}
    </GameShell>
  );
}

function SettingGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 500 }}>{label}:</span>
      <div style={{ display: "flex", gap: 4 }}>{children}</div>
    </div>
  );
}

function PillBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
        background: active ? "var(--color-primary)" : "var(--color-surface)",
        color: active ? "#fff" : "var(--color-text-muted)",
        transition: "all 150ms",
      }}
    >
      {children}
    </button>
  );
}
