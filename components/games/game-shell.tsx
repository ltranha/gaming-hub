"use client";

import Link from "next/link";
import type { GameConfig } from "@/lib/game-registry";
import { GameRules } from "./game-rules";

interface Props {
  game: GameConfig;
  children: React.ReactNode;
  status?: string;
  onRestart?: () => void;
}

/**
 * Shared game shell wrapper.
 * Provides consistent header (back + title), status bar, content area,
 * and collapsible rules/how-to-play section at the bottom.
 * Used by every game page for uniform navigation and layout.
 */
export function GameShell({ game, children, status, onRestart }: Props) {
  return (
    <div style={{ maxWidth: 600, marginLeft: "auto", marginRight: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Header */}
      <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/"
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              background: "var(--color-surface)",
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              fontSize: 16,
            }}
          >
            ←
          </Link>
          <h1 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 700 }}>
            <span>{game.icon}</span>
            {game.name}
          </h1>
        </div>
        {onRestart && (
          <button
            onClick={onRestart}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: "var(--color-surface)",
              color: "var(--color-text-secondary)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Restart
          </button>
        )}
      </div>

      {/* Status */}
      {status && (
        <div
          style={{
            width: "100%",
            padding: "12px 20px",
            borderRadius: 12,
            background: "var(--color-bg-secondary)",
            textAlign: "center",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--color-text-secondary)",
            marginBottom: 20,
          }}
        >
          {status}
        </div>
      )}

      {/* Game Content */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {children}
      </div>

      {/* Rules (collapsible, at the bottom of every game) */}
      <GameRules slug={game.slug} />
    </div>
  );
}
