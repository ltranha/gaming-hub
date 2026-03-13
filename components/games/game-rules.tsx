"use client";

import { useState } from "react";
import { GAME_RULES } from "@/lib/game-rules";
import { useI18n } from "@/components/i18n/locale-provider";

/**
 * Expandable rules/how-to-play panel for any game.
 * Shows how to play, fun facts, and a link to Wikipedia.
 * Collapsed by default to keep the game UI clean.
 */
export function GameRules({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const rules = GAME_RULES[slug];
  if (!rules) return null;

  return (
    <div style={{ width: "100%", marginTop: 24 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px 16px",
          borderRadius: 10,
          border: "1px solid var(--color-border)",
          background: "var(--color-bg-secondary)",
          color: "var(--color-text-secondary)",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{t("game.howToPlay")}</span>
        <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms" }}>▼</span>
      </button>

      {open && (
        <div
          style={{
            marginTop: 8,
            padding: 20,
            borderRadius: 12,
            border: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* How to Play */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: "var(--color-primary-hover)" }}>
              {t("game.howToPlay")}
            </h3>
            <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              {rules.howToPlay.map((step, i) => (
                <li key={i} style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Fun Facts */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: "var(--color-accent)" }}>
              {t("game.funFacts")}
            </h3>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              {rules.funFacts.map((fact, i) => (
                <li key={i} style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          {/* Wiki Link */}
          {rules.wikiLink && (
            <a
              href={rules.wikiLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 13,
                color: "var(--color-primary)",
                textDecoration: "none",
              }}
            >
              {t("game.learnMore")}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
