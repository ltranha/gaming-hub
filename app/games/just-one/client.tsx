"use client";

import { useState, useCallback } from "react";
import type { GameConfig } from "@/lib/game-registry";
import type { JustOneState } from "@/lib/games/just-one";
import { createInitialState, startRound, submitClue, skipClue, moveToGuess, submitGuess, skipGuess } from "@/lib/games/just-one";
import { GameShell } from "@/components/games/game-shell";

const DEFAULT_PLAYERS = ["Alice", "Bob", "Charlie", "Diana"];

const input: React.CSSProperties = {
  flex: 1,
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-secondary)",
  color: "var(--color-text)",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: 10,
  border: "none",
  background: "var(--color-primary)",
  color: "#fff",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const successBtn: React.CSSProperties = {
  ...primaryBtn,
  background: "var(--color-success)",
};

const surfaceBtn: React.CSSProperties = {
  ...primaryBtn,
  background: "var(--color-surface)",
  color: "var(--color-text-secondary)",
};

export function JustOneClient({ game }: { game: GameConfig }) {
  const [state, setState] = useState<JustOneState>(() =>
    createInitialState(DEFAULT_PLAYERS, 5)
  );
  const [playerNames, setPlayerNames] = useState<string[]>(DEFAULT_PLAYERS);
  const [nameInput, setNameInput] = useState("");
  const [clueInputs, setClueInputs] = useState<Record<string, string>>({});
  const [guessInput, setGuessInput] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  const restart = useCallback(() => {
    setState(createInitialState(playerNames, 5));
    setClueInputs({});
    setGuessInput("");
  }, [playerNames]);

  const guesserName = state.players[state.guesser] || "";

  /* ── SETUP ── */
  if (state.phase === "setup") {
    return (
      <GameShell game={game}>
        <div style={{ maxWidth: 420, width: "100%", display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, textAlign: "center" }}>Setup Players</h2>
          <p style={{ textAlign: "center", fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
            Just One is a cooperative game. One player guesses a word based on one-word clues from others. Duplicate clues are eliminated!
          </p>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
            {playerNames.map((name, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 24, textAlign: "center", fontSize: 13, color: "var(--color-text-muted)" }}>{i + 1}</span>
                <span
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: 10,
                    background: "var(--color-surface)",
                    fontSize: 14,
                  }}
                >
                  {name}
                </span>
                <button
                  onClick={() => setPlayerNames((p) => p.filter((_, j) => j !== i))}
                  style={{ border: "none", background: "none", color: "var(--color-error)", fontSize: 12, cursor: "pointer" }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {playerNames.length < 7 && (
            <div style={{ width: "100%", display: "flex", gap: 8 }}>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && nameInput.trim()) {
                    setPlayerNames((p) => [...p, nameInput.trim()]);
                    setNameInput("");
                  }
                }}
                placeholder="Add player..."
                style={input}
              />
              <button
                onClick={() => {
                  if (nameInput.trim()) {
                    setPlayerNames((p) => [...p, nameInput.trim()]);
                    setNameInput("");
                  }
                }}
                style={primaryBtn}
              >
                Add
              </button>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {["easy", "medium", "hard"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 999,
                  border: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "capitalize",
                  cursor: "pointer",
                  background: difficulty === d ? "var(--color-primary)" : "var(--color-surface)",
                  color: difficulty === d ? "#fff" : "var(--color-text-muted)",
                }}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (playerNames.length >= 3) {
                const s = createInitialState(playerNames, 5);
                setState(startRound(s, difficulty));
              }
            }}
            disabled={playerNames.length < 3}
            style={{
              ...primaryBtn,
              width: "100%",
              padding: "12px 0",
              opacity: playerNames.length < 3 ? 0.5 : 1,
            }}
          >
            Start Game ({playerNames.length} players)
          </button>
          {playerNames.length < 3 && (
            <p style={{ textAlign: "center", fontSize: 12, color: "var(--color-warning)" }}>Need at least 3 players</p>
          )}
        </div>
      </GameShell>
    );
  }

  /* ── CLUE ── */
  if (state.phase === "clue") {
    return (
      <GameShell game={game} status={`Round ${state.round + 1}/${state.maxRounds} — ${guesserName} is guessing`}>
        <div style={{ maxWidth: 420, width: "100%", display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
          <div
            style={{
              width: "100%",
              padding: 24,
              borderRadius: 16,
              background: "var(--color-primary-dim)",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>The word is</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: "var(--color-primary-hover)", marginTop: 4 }}>{state.word}</p>
            <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 8 }}>
              (Don&apos;t show this to {guesserName}!)
            </p>
          </div>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
            {state.players.map((player, i) => {
              if (i === state.guesser) return null;
              const val = state.clues[player] || "";
              const submitted = val.length > 0;
              const skipped = val === "(skipped)";
              return (
                <div key={player} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 80, fontSize: 14, fontWeight: 500, color: "var(--color-text-secondary)" }}>{player}</span>
                  {skipped ? (
                    <span style={{ fontSize: 13, color: "var(--color-text-muted)", fontStyle: "italic" }}>Skipped</span>
                  ) : submitted ? (
                    <span style={{ fontSize: 14, color: "var(--color-success)" }}>Submitted ✓</span>
                  ) : (
                    <div style={{ flex: 1, display: "flex", gap: 8 }}>
                      <input
                        value={clueInputs[player] || ""}
                        onChange={(e) => setClueInputs((p) => ({ ...p, [player]: e.target.value }))}
                        placeholder="One word clue..."
                        style={input}
                      />
                      <button
                        onClick={() => {
                          const c = clueInputs[player]?.trim();
                          if (c) setState((p) => submitClue(p, player, c));
                        }}
                        style={successBtn}
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => setState((p) => skipClue(p, player))}
                        style={{ ...surfaceBtn, padding: "10px 12px", fontSize: 12 }}
                      >
                        Skip
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </GameShell>
    );
  }

  /* ── REVEAL ── */
  if (state.phase === "reveal") {
    return (
      <GameShell game={game} status={`Showing clues to ${guesserName}`}>
        <div style={{ maxWidth: 420, width: "100%", display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(state.clues).map(([player, clue]) => {
              const visible = state.visibleClues[player];
              const skipped = clue === "(skipped)";
              return (
                <div
                  key={player}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 12,
                    borderRadius: 10,
                    background: visible ? "var(--color-surface)" : "var(--color-error-dim)",
                    color: visible ? "var(--color-text)" : "var(--color-error)",
                    textDecoration: visible ? "none" : skipped ? "none" : "line-through",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{player}</span>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>{skipped ? "—" : clue}</span>
                  {!visible && <span style={{ fontSize: 11 }}>{skipped ? "SKIPPED" : "DUPLICATE"}</span>}
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setState((p) => moveToGuess(p))}
            style={{ ...primaryBtn, width: "100%", padding: "12px 0" }}
          >
            Show to {guesserName} — Let them guess
          </button>
        </div>
      </GameShell>
    );
  }

  /* ── GUESS ── */
  if (state.phase === "guess") {
    const visibleClueEntries = Object.entries(state.clues).filter(
      ([player]) => state.visibleClues[player]
    );
    return (
      <GameShell game={game} status={`${guesserName}'s turn to guess`}>
        <div style={{ maxWidth: 420, width: "100%", display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            {visibleClueEntries.map(([player, clue]) => (
              <div
                key={player}
                style={{
                  padding: "12px 16px",
                  borderRadius: 14,
                  background: "var(--color-surface)",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 18, fontWeight: 700, color: "var(--color-primary-hover)" }}>{clue}</p>
                <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>{player}</p>
              </div>
            ))}
          </div>

          {visibleClueEntries.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--color-error)" }}>All clues were duplicates! No clues to show.</p>
          )}

          <div style={{ width: "100%", display: "flex", gap: 8 }}>
            <input
              value={guessInput}
              onChange={(e) => setGuessInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && guessInput.trim()) {
                  setState((p) => submitGuess(p, guessInput.trim()));
                  setGuessInput("");
                  setClueInputs({});
                }
              }}
              placeholder={`${guesserName}, type your guess...`}
              style={input}
            />
            <button
              onClick={() => {
                if (guessInput.trim()) {
                  setState((p) => submitGuess(p, guessInput.trim()));
                  setGuessInput("");
                  setClueInputs({});
                }
              }}
              style={successBtn}
            >
              Guess
            </button>
            <button
              onClick={() => {
                setState((p) => skipGuess(p));
                setClueInputs({});
              }}
              style={surfaceBtn}
            >
              Skip
            </button>
          </div>
        </div>
      </GameShell>
    );
  }

  /* ── RESULT ── */
  const isCorrect = state.guess.toLowerCase().trim() === state.word.toLowerCase().trim();
  return (
    <GameShell game={game} status={`Score: ${state.correct} correct / ${state.wrong} wrong`}>
      <div style={{ maxWidth: 420, width: "100%", display: "flex", flexDirection: "column", gap: 20, alignItems: "center", textAlign: "center" }}>
        <div
          style={{
            width: "100%",
            padding: 24,
            borderRadius: 16,
            background: isCorrect ? "var(--color-success-dim)" : "var(--color-error-dim)",
          }}
        >
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>The word was</p>
          <p style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{state.word}</p>
          <p style={{ fontSize: 14, marginTop: 12 }}>
            {guesserName} guessed:{" "}
            <strong>{state.guess}</strong>{" "}
            {isCorrect ? "✓ Correct!" : state.guess === "(skipped)" ? "— Skipped" : "✗ Wrong!"}
          </p>
        </div>

        {state.gameOver ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <p style={{ fontSize: 18, fontWeight: 700 }}>
              Game Over! Final Score: {state.correct}/{state.maxRounds}
            </p>
            <button onClick={restart} style={primaryBtn}>
              Play Again
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setState((p) => startRound(p, difficulty));
              setClueInputs({});
            }}
            style={primaryBtn}
          >
            Next Round
          </button>
        )}
      </div>
    </GameShell>
  );
}
