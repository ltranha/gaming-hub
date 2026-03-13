"use client";

import type { GameMode } from "@/lib/game-registry";

interface ModeOption {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

const DEFAULT_MODE_META: Record<GameMode, ModeOption> = {
  local: { id: "local", label: "Local", icon: "👥", desc: "Play on the same device" },
  ai: { id: "ai", label: "vs AI", icon: "🤖", desc: "Challenge the computer" },
  online: { id: "online", label: "Online", icon: "🌐", desc: "Play with friends online" },
};

interface Props {
  modes: (GameMode | ModeOption)[];
  selected?: string | null;
  onSelect: (mode: string) => void;
}

/**
 * Mode selection cards. Displayed before starting a game.
 * Accepts either GameMode strings or custom ModeOption objects.
 */
export function ModeSelector({ modes, selected, onSelect }: Props) {
  const options: ModeOption[] = modes.map((m) =>
    typeof m === "string" ? DEFAULT_MODE_META[m] : m
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(options.length, 3)}, 1fr)`, gap: 12, width: "100%", maxWidth: 480 }}>
      {options.map((opt) => {
        const active = selected === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
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
            <span style={{ fontSize: 28 }}>{opt.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)" }}>{opt.label}</span>
            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{opt.desc}</span>
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
