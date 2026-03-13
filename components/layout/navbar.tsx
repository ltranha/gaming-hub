"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { LocaleToggle, useI18n } from "@/components/i18n/locale-provider";

/**
 * Responsive top navigation bar.
 * On desktop: logo | Games Admin [FR/EN] | Sign In
 * On mobile: logo | hamburger + Sign In (hamburger contains nav links, locale, admin)
 */
export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const { user, loading, signInGuest, signInEmail, logout } = useAuth();
  const { t } = useI18n();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setShowAuth(false); setShowMenu(false); }
    };
    const handleClick = (e: MouseEvent) => {
      if (authRef.current && !authRef.current.contains(e.target as Node)) setShowAuth(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClick);
    return () => { document.removeEventListener("keydown", handleEsc); document.removeEventListener("mousedown", handleClick); };
  }, []);

  return (
    <>
      {/* Inject media query styles once */}
      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-burger { display: none !important; }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-burger { display: flex !important; }
        }
      `}</style>

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
            paddingLeft: 16,
            paddingRight: 16,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo (always visible) */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--color-text)", flexShrink: 0 }}>
            <span style={{ fontSize: 20 }}>🎮</span>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Games<span style={{ color: "var(--color-primary)" }}>Hub</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-desktop" style={{ alignItems: "center", gap: 4 }}>
            <NavLink href="/" active={pathname === "/"}>{t("nav.games")}</NavLink>
            <NavLink href="/admin" active={isAdmin}>{t("nav.admin")}</NavLink>
            <LocaleToggle />
            <AuthSection
              user={user}
              loading={loading}
              showAuth={showAuth}
              setShowAuth={setShowAuth}
              authRef={authRef}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              signInEmail={signInEmail}
              signInGuest={signInGuest}
              logout={logout}
              t={t}
            />
          </div>

          {/* Mobile: hamburger + auth */}
          <div className="nav-burger" style={{ alignItems: "center", gap: 8 }}>
            <AuthSection
              user={user}
              loading={loading}
              showAuth={showAuth}
              setShowAuth={setShowAuth}
              authRef={authRef}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              signInEmail={signInEmail}
              signInGuest={signInGuest}
              logout={logout}
              t={t}
            />

            {/* Hamburger */}
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  width: 36, height: 36, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 4,
                  border: "none", background: "transparent", cursor: "pointer", padding: 6,
                }}
                aria-label="Menu"
              >
                <span style={{ width: 18, height: 2, background: "var(--color-text-secondary)", borderRadius: 1 }} />
                <span style={{ width: 18, height: 2, background: "var(--color-text-secondary)", borderRadius: 1 }} />
                <span style={{ width: 18, height: 2, background: "var(--color-text-secondary)", borderRadius: 1 }} />
              </button>

              {showMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: 42,
                    right: 0,
                    width: 180,
                    padding: 8,
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    boxShadow: "0 8px 32px rgba(0,0,0,.4)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    zIndex: 100,
                  }}
                >
                  <Link
                    href="/"
                    onClick={() => setShowMenu(false)}
                    style={{
                      padding: "10px 12px", borderRadius: 8, textDecoration: "none",
                      fontSize: 14, fontWeight: 500,
                      background: pathname === "/" ? "var(--color-primary-dim)" : "transparent",
                      color: pathname === "/" ? "var(--color-primary-hover)" : "var(--color-text-secondary)",
                    }}
                  >
                    🎲 {t("nav.games")}
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setShowMenu(false)}
                    style={{
                      padding: "10px 12px", borderRadius: 8, textDecoration: "none",
                      fontSize: 14, fontWeight: 500,
                      background: isAdmin ? "var(--color-primary-dim)" : "transparent",
                      color: isAdmin ? "var(--color-primary-hover)" : "var(--color-text-secondary)",
                    }}
                  >
                    ⚙ {t("nav.admin")}
                  </Link>
                  <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Language</span>
                    <LocaleToggle />
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

/* Auth section extracted for reuse in both desktop and mobile layouts */
function AuthSection({
  user, loading, showAuth, setShowAuth, authRef,
  email, setEmail, password, setPassword,
  signInEmail, signInGuest, logout, t,
}: {
  user: { displayName: string | null; email: string | null } | null;
  loading: boolean;
  showAuth: boolean;
  setShowAuth: (v: boolean) => void;
  authRef: React.RefObject<HTMLDivElement | null>;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  signInEmail: (email: string, pw: string) => Promise<void>;
  signInGuest: () => Promise<void>;
  logout: () => Promise<void>;
  t: (k: string) => string;
}) {
  if (loading) return null;

  if (user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
        <span style={{ fontSize: 11, color: "var(--color-text-muted)", maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user.displayName || user.email || "Guest"}
        </span>
        <button
          onClick={logout}
          style={{
            padding: "4px 10px", borderRadius: 8,
            border: "1px solid var(--color-border)",
            background: "transparent", color: "var(--color-text-secondary)",
            fontSize: 11, cursor: "pointer",
          }}
        >
          {t("nav.signOut")}
        </button>
      </div>
    );
  }

  return (
    <div ref={authRef} style={{ position: "relative", marginLeft: 8 }}>
      <button
        onClick={() => setShowAuth(!showAuth)}
        style={{
          padding: "5px 10px", borderRadius: 8, border: "none",
          background: "var(--color-primary)", color: "#fff",
          fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}
      >
        {t("nav.signIn")}
      </button>

      {showAuth && (
        <div
          style={{
            position: "absolute", top: 40, right: 0, width: 260, padding: 16,
            borderRadius: 12, border: "1px solid var(--color-border)",
            background: "var(--color-surface)", boxShadow: "0 8px 32px rgba(0,0,0,.4)",
            display: "flex", flexDirection: "column", gap: 8, zIndex: 100,
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("nav.email")}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, outline: "none" }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("nav.password")}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)", color: "var(--color-text)", fontSize: 13, outline: "none" }}
          />
          <button
            onClick={async () => { if (email && password) { await signInEmail(email, password); setShowAuth(false); } }}
            style={{ padding: "8px 0", borderRadius: 8, border: "none", background: "var(--color-primary)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            {t("nav.signInUp")}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
            <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{t("nav.or")}</span>
            <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
          </div>
          <button
            onClick={async () => { await signInGuest(); setShowAuth(false); }}
            style={{ padding: "8px 0", borderRadius: 8, border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer" }}
          >
            {t("nav.guest")}
          </button>
        </div>
      )}
    </div>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        padding: "6px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
        textDecoration: "none", transition: "all 150ms",
        background: active ? "var(--color-primary-dim)" : "transparent",
        color: active ? "var(--color-primary-hover)" : "var(--color-text-secondary)",
      }}
    >
      {children}
    </Link>
  );
}
