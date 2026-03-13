"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Top navigation bar.
 * Displays site logo and navigation links. Sticky with backdrop blur.
 */
export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--color-border)",
        background: "rgba(17,19,24,0.92)",
        backdropFilter: "blur(12px)",
      }}
    >
      <nav
        style={{
          maxWidth: 960,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: 24,
          paddingRight: 24,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--color-text)" }}>
          <span style={{ fontSize: 22 }}>🎮</span>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Games<span style={{ color: "var(--color-primary)" }}>Hub</span>
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <NavLink href="/" active={pathname === "/"}>Games</NavLink>
          <NavLink href="/admin" active={isAdmin}>Admin</NavLink>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        padding: "6px 14px",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        textDecoration: "none",
        transition: "all 150ms",
        background: active ? "var(--color-primary-dim)" : "transparent",
        color: active ? "var(--color-primary-hover)" : "var(--color-text-secondary)",
      }}
    >
      {children}
    </Link>
  );
}
