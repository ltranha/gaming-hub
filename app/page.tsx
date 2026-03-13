import { getActiveGames, CATEGORIES } from "@/lib/game-registry";
import { GameGrid } from "@/components/games/game-grid";
import { HeroSection } from "@/components/games/hero-section";

/**
 * Hub landing page.
 * Displays hero, search, category filters, and game card grid.
 * All content centered within the max-width layout container.
 */
export default function HomePage() {
  const games = getActiveGames();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <HeroSection />
      <GameGrid games={games} categories={CATEGORIES} />
    </div>
  );
}
