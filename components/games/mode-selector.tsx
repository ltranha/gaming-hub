"use client";

import type { GameMode } from "@/lib/game-registry";

interface Props {
  modes: GameMode[];
  selected: GameMode | null;
  onSelect: (mode: GameMode) => void;
}

const MODE_META: Record<GameMode, { label: string; icon: string; desc: string }> = {
  local: { label: "Local", icon: "👥", desc: "Play on the same device" },
  ai: { label: "vs AI", icon: "🤖", desc: "Challenge the computer" },
  online: { label: "Online", icon: "🌐", desc: "Play with friends online" },
};

/**
 * Mode selection cards. Displayed before starting a game.
 * Supports local, AI, and online modes.
 */
export function ModeSelector({ modes, selected, onSelect }: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(modes.length, 3)}, 1fr)`, gap: 12, width: "100%", maxWidth: 480 }}>
      {modes.map((mode) => {
        const meta = MODE_META[mode];
        const active = selected === mode;
        return (
          <button
            key={mode}
            onClick={() => onSelect(mode)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: 20,
              borderRadius: 14,
              border: `1px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
              background: active ? "var(--color-primary-dim)" : "var(--color-surface)",
              cursor: "pointer",
              transition: "all 200ms",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 28 }}>{meta.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)" }}>{meta.label}</span>
            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{meta.desc}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * AI difficulty picker pills.
 */
export function DifficultyPicker({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const opts = ["easy", "medium", "hard"];
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
      {opts.map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          style={{
            padding: "6px 16px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            textTransform: "capitalize",
            border: "none",
            cursor: "pointer",
            background: value === d ? "var(--color-primary)" : "var(--color-surface)",
            color: value === d ? "#fff" : "var(--color-text-muted)",
            transition: "all 150ms",
          }}
        >
          {d}
        </button>
      ))}
    </div>
  );
}
