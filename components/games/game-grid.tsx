"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { GameConfig, GameCategory } from "@/lib/game-registry";

interface Props {
  games: GameConfig[];
  categories: { id: GameCategory; label: string; icon: string }[];
}

/**
 * Game grid: search bar, category filters, and responsive card grid.
 * All sections are explicitly centered via inline styles.
 */
export function GameGrid({ games, categories }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<GameCategory | "all">("all");

  const filtered = games.filter((g) => {
    if (activeCategory !== "all" && g.category !== activeCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Search Bar */}
      <div style={{ width: "100%", maxWidth: 420, marginBottom: 24 }}>
        <input
          type="search"
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 20px",
            borderRadius: 12,
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-secondary)",
            color: "var(--color-text)",
            fontSize: 14,
            outline: "none",
          }}
        />
      </div>

      {/* Category Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 40 }}>
        <FilterPill active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>All Games</FilterPill>
        {categories.map((cat) => (
          <FilterPill key={cat.id} active={activeCategory === cat.id} onClick={() => setActiveCategory(cat.id)}>
            {cat.icon} {cat.label}
          </FilterPill>
        ))}
      </div>

      {/* Game Cards Grid */}
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 24,
          justifyContent: "center",
        }}
      >
        {filtered.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
        {filtered.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", padding: "64px 0", color: "var(--color-text-muted)" }}>
            No games match your search.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Individual game card with icon, title, description, modes, and metadata.
 * Hover produces a solid color glow using the game's accent color.
 */
function GameCard({ game }: { game: GameConfig }) {
  const isComingSoon = game.status === "coming-soon";

  return (
    <Link
      href={isComingSoon ? "#" : `/games/${game.slug}`}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: 28,
        borderRadius: 20,
        border: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        textDecoration: "none",
        color: "inherit",
        transition: "all 300ms ease",
        cursor: isComingSoon ? "not-allowed" : "pointer",
        opacity: isComingSoon ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isComingSoon) {
          e.currentTarget.style.borderColor = game.color;
          e.currentTarget.style.boxShadow = `0 8px 40px ${game.color}30, 0 0 0 1px ${game.color}40`;
          e.currentTarget.style.transform = "translateY(-4px)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Badges */}
      {isComingSoon && (
        <span style={{ position: "absolute", top: 12, right: 12, padding: "4px 12px", borderRadius: 999, background: "var(--color-warning-dim)", color: "var(--color-warning)", fontSize: 11, fontWeight: 600 }}>
          Coming Soon
        </span>
      )}
      {!game.isPublic && !isComingSoon && (
        <span style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 999, background: "var(--color-accent-dim)", color: "var(--color-accent)", fontSize: 10, fontWeight: 600 }}>
          🔒 Sign In
        </span>
      )}

      {/* Icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: `${game.color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          overflow: "hidden",
        }}
      >
        <Image
          src={`/icons/${game.slug}.svg`}
          alt={game.name}
          width={48}
          height={48}
          style={{ objectFit: "contain" }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              const fb = document.createElement("span");
              fb.textContent = game.icon;
              fb.style.fontSize = "36px";
              parent.appendChild(fb);
            }
          }}
        />
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "var(--color-text)" }}>{game.name}</h3>

      {/* Description */}
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-text-secondary)", marginBottom: 20, flex: 1 }}>{game.description}</p>

      {/* Mode badges */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 20 }}>
        {game.modes.map((mode) => (
          <span
            key={mode}
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              textTransform: "capitalize",
              background: `${game.color}18`,
              color: game.color,
            }}
          >
            {mode}
          </span>
        ))}
      </div>

      {/* Footer metadata */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          width: "100%",
          borderTop: "1px solid var(--color-border)",
          paddingTop: 16,
          fontSize: 12,
          fontWeight: 500,
          color: "var(--color-text-secondary)",
        }}
      >
        <span>{game.minPlayers === game.maxPlayers ? `${game.minPlayers} Player` : `${game.minPlayers}-${game.maxPlayers} Players`}</span>
        <span style={{ color: "var(--color-border-bright)" }}>·</span>
        <span style={{ textTransform: "capitalize" }}>{game.difficulty}</span>
        <span style={{ color: "var(--color-border-bright)" }}>·</span>
        <span>{game.estimatedTime}</span>
      </div>
    </Link>
  );
}

/** Category filter pill button. */
function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 18px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 500,
        border: active ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
        background: active ? "rgba(91, 108, 255, 0.15)" : "var(--color-surface)",
        color: active ? "var(--color-primary-hover)" : "var(--color-text-secondary)",
        cursor: "pointer",
        transition: "all 150ms",
      }}
    >
      {children}
    </button>
  );
}
