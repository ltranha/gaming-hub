"use client";

import { useI18n } from "@/components/i18n/locale-provider";

/**
 * Hub hero section with gradient title and subtitle.
 */
export function HeroSection() {
  const { t } = useI18n();

  return (
    <section style={{ width: "100%", textAlign: "center", padding: "40px 0 24px 0" }}>
      <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
        <span
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {t("hub.title")}
        </span>
      </h1>
      <p style={{ marginTop: 16, fontSize: "1.1rem", fontWeight: 500, color: "var(--color-text-secondary)", maxWidth: 480, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
        {t("hub.subtitle")}
      </p>
    </section>
  );
}
