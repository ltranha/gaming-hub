"use client";

import { useState, useCallback } from "react";
import type { GameConfig } from "@/lib/game-registry";
import { createInitialState, giveClue, guessCard, endGuessing, toggleSpymasterView } from "@/lib/games/codenames";
import { GameShell } from "@/components/games/game-shell";

const TEAM_COLORS = { red: "#dc2626", blue: "#2563eb" };
const CARD_BG = { red: "#fca5a5", blue: "#93c5fd", neutral: "#d4d4d8", assassin: "#1e1e1e" };
const CARD_TEXT = { red: "#7f1d1d", blue: "#1e3a5f", neutral: "#52525b", assassin: "#fff" };

export function CodenamesClient({ game }: { game: GameConfig }) {
  const [state, setState] = useState(createInitialState);
  const [clueInput, setClueInput] = useState("");
  const [countInput, setCountInput] = useState("1");

  const restart = useCallback(() => {
    setState(createInitialState());
    setClueInput("");
    setCountInput("1");
  }, []);

  const teamColor = TEAM_COLORS[state.currentTeam];
  const statusText = state.phase === "over"
    ? `${state.winner === "red" ? "Red" : "Blue"} team wins!`
    : state.phase === "clue"
    ? `${state.currentTeam === "red" ? "Red" : "Blue"} Spymaster — give a clue`
    : `Clue: "${state.clue}" (${state.clueCount}) — ${state.guessesRemaining} guesses left`;

  return (
    <GameShell game={game} onRestart={restart} status={statusText}>
      {/* Score */}
      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: TEAM_COLORS.red }}>Red: {state.redRemaining}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: TEAM_COLORS.blue }}>Blue: {state.blueRemaining}</span>
        <button
          onClick={() => setState((s) => toggleSpymasterView(s))}
          style={{
            padding: "4px 10px", borderRadius: 6, border: "1px solid var(--color-border)",
            background: state.spymasterView ? "var(--color-warning-dim)" : "transparent",
            color: "var(--color-text-secondary)", fontSize: 11, cursor: "pointer",
          }}
        >
          {state.spymasterView ? "Hide Key" : "Spymaster View"}
        </button>
      </div>

      {/* Clue input */}
      {state.phase === "clue" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 12, width: "100%" }}>
          <input
            value={clueInput}
            onChange={(e) => setClueInput(e.target.value)}
            placeholder="One-word clue..."
            style={{
              flex: 1, padding: "8px 12px", borderRadius: 8,
              border: `2px solid ${teamColor}`, background: "var(--color-bg-secondary)",
              color: "var(--color-text)", fontSize: 14, outline: "none",
            }}
          />
          <input
            type="number"
            min="1"
            max="9"
            value={countInput}
            onChange={(e) => setCountInput(e.target.value)}
            style={{
              width: 48, padding: "8px", borderRadius: 8,
              border: `2px solid ${teamColor}`, background: "var(--color-bg-secondary)",
              color: "var(--color-text)", fontSize: 14, textAlign: "center", outline: "none",
            }}
          />
          <button
            onClick={() => {
              if (clueInput.trim()) {
                setState((s) => giveClue(s, clueInput.trim(), parseInt(countInput) || 1));
                setClueInput("");
              }
            }}
            style={{
              padding: "8px 16px", borderRadius: 8, border: "none",
              background: teamColor, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}
          >
            Give Clue
          </button>
        </div>
      )}

      {/* End guessing button */}
      {state.phase === "guess" && (
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => setState((s) => endGuessing(s))}
            style={{
              padding: "6px 16px", borderRadius: 8, border: "1px solid var(--color-border)",
              background: "var(--color-surface)", color: "var(--color-text-secondary)",
              fontSize: 12, cursor: "pointer",
            }}
          >
            End Turn
          </button>
        </div>
      )}

      {/* Board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 6,
          width: "100%",
        }}
      >
        {state.cards.map((card, i) => {
          const showType = card.revealed || state.spymasterView;
          const bg = showType ? CARD_BG[card.type] : "var(--color-surface)";
          const color = showType ? CARD_TEXT[card.type] : "var(--color-text)";
          const canGuess = state.phase === "guess" && !card.revealed && state.winner === null;

          return (
            <button
              key={i}
              onClick={() => canGuess && setState((s) => guessCard(s, i))}
              style={{
                padding: "14px 6px",
                borderRadius: 8,
                border: card.revealed ? "2px solid transparent" : "1px solid var(--color-border)",
                background: bg,
                color,
                fontSize: 12,
                fontWeight: 600,
                cursor: canGuess ? "pointer" : "default",
                opacity: card.revealed ? 0.7 : 1,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                lineHeight: 1.2,
                minHeight: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {card.word}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
