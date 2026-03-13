import { getGameBySlug } from "@/lib/game-registry";
import { PixelArtClient } from "./client";

export const metadata = { title: "Pixel Art" };

export default function PixelArtPage() {
  const game = getGameBySlug("pixel-art")!;
  return <PixelArtClient game={game} />;
}
