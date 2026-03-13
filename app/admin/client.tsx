"use client";

import { useState } from "react";
import { GAME_REGISTRY, CATEGORIES } from "@/lib/game-registry";
import type { GameConfig } from "@/lib/game-registry";

export function AdminClient() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  if (!authenticated) {
    return (
      <div
        style={{
          maxWidth: 380,
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>
          Admin Access
        </h1>
        <div
          style={{
            width: "100%",
            padding: 24,
            borderRadius: 16,
            border: "1px solid var(--color-border)",
            background: "var(--color-surface)",
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setAuthenticated(password === "admin");
            }}
            placeholder="Admin password"
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text)",
              fontSize: 14,
              outline: "none",
              marginBottom: 16,
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={() => setAuthenticated(password === "admin")}
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 10,
              border: "none",
              background: "var(--color-primary)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
          <p
            style={{
              marginTop: 12,
              textAlign: "center",
              fontSize: 12,
              color: "var(--color-text-muted)",
            }}
          >
            Default password: admin (change in production)
          </p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const games = GAME_REGISTRY;
  const active = games.filter((g) => g.status === "active").length;
  const publicGames = games.filter((g) => g.isPublic).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Admin Dashboard</h1>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard label="Total Games" value={String(games.length)} icon="🎮" />
        <StatCard label="Active" value={String(active)} icon="✅" />
        <StatCard label="Public" value={String(publicGames)} icon="🌐" />
        <StatCard label="Categories" value={String(CATEGORIES.length)} icon="📂" />
      </div>

      {/* Game Registry Table */}
      <div
        style={{
          borderRadius: 16,
          border: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Game Registry</h2>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 4 }}>
            Manage games from{" "}
            <code
              style={{
                background: "var(--color-bg-secondary)",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 12,
              }}
            >
              lib/game-registry.ts
            </code>
          </p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", textAlign: "left", fontSize: 14, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-secondary)" }}>
                {["Game", "Category", "Modes", "Status", "Public"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 24px",
                      fontWeight: 500,
                      color: "var(--color-text-muted)",
                      fontSize: 13,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {games.map((g) => (
                <GameRow key={g.slug} game={g} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          borderRadius: 16,
          border: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <ActionBtn label="View Hub" href="/" />
          <ActionBtn label="Edit Registry" note="lib/game-registry.ts" />
          <ActionBtn label="Firebase Console" note="External" />
          <ActionBtn label="Vercel Dashboard" note="External" />
        </div>
      </div>

      {/* How to manage games */}
      <div
        style={{
          borderRadius: 16,
          border: "1px solid var(--color-border)",
          background: "var(--color-bg-secondary)",
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>How to Manage Games</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14, color: "var(--color-text-secondary)" }}>
          <HelpRow label="Hide a game" code='status: "hidden"' suffix=" in the registry" />
          <HelpRow label="Coming soon badge" code='status: "coming-soon"' suffix="" />
          <HelpRow label="Require sign-in" code="isPublic: false" suffix="" />
          <HelpRow label="Add a game" code="GAME_REGISTRY" suffix=" and create app/games/[slug]/" />
          <HelpRow label="Remove a game" code='"hidden"' suffix=" — code stays, game disappears" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 12,
        border: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{label}</p>
        <p style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{value}</p>
      </div>
      <span style={{ fontSize: 24 }}>{icon}</span>
    </div>
  );
}

function GameRow({ game }: { game: GameConfig }) {
  const statusBg: Record<string, string> = {
    active: "var(--color-success-dim)",
    "coming-soon": "var(--color-warning-dim)",
    hidden: "var(--color-error-dim)",
  };
  const statusColor: Record<string, string> = {
    active: "var(--color-success)",
    "coming-soon": "var(--color-warning)",
    hidden: "var(--color-error)",
  };

  return (
    <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
      <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
        <span style={{ marginRight: 8 }}>{game.icon}</span>
        {game.name}
      </td>
      <td style={{ padding: "12px 24px", textTransform: "capitalize", color: "var(--color-text-secondary)" }}>
        {game.category}
      </td>
      <td style={{ padding: "12px 24px" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {game.modes.map((m) => (
            <span
              key={m}
              style={{
                background: "var(--color-bg-secondary)",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </td>
      <td style={{ padding: "12px 24px" }}>
        <span
          style={{
            background: statusBg[game.status] || "var(--color-surface)",
            color: statusColor[game.status] || "var(--color-text-muted)",
            padding: "2px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {game.status}
        </span>
      </td>
      <td style={{ padding: "12px 24px", color: "var(--color-text-secondary)" }}>
        {game.isPublic ? "Yes" : "No"}
      </td>
    </tr>
  );
}

function ActionBtn({ label, href, note }: { label: string; href?: string; note?: string }) {
  const s: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid var(--color-border)",
    background: "var(--color-bg-secondary)",
    color: "var(--color-text-secondary)",
    fontSize: 14,
    fontWeight: 500,
    textDecoration: "none",
    cursor: "pointer",
    minWidth: 120,
  };

  const inner = (
    <>
      <span>{label}</span>
      {note && <span style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 2 }}>{note}</span>}
    </>
  );

  if (href) return <a href={href} style={s}>{inner}</a>;
  return <div style={s}>{inner}</div>;
}

function HelpRow({ label, code, suffix }: { label: string; code: string; suffix: string }) {
  return (
    <p>
      <strong>{label}:</strong> Set{" "}
      <code
        style={{
          background: "var(--color-surface)",
          padding: "1px 4px",
          borderRadius: 4,
          fontSize: 12,
        }}
      >
        {code}
      </code>
      {suffix}
    </p>
  );
}
