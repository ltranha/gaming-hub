import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth/auth-provider";
import { LocaleProvider } from "@/components/i18n/locale-provider";

export const metadata: Metadata = {
  title: { default: "Games Hub", template: "%s | Games Hub" },
  description:
    "A collection of multiplayer games with local, AI, and online modes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)" }}>
        <LocaleProvider>
        <AuthProvider>
          <Navbar />
          <main
            style={{
              maxWidth: 960,
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 32,
              paddingBottom: 80,
            }}
          >
            {children}
          </main>
          <Toaster />
        </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
