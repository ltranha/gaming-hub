import { getGameBySlug } from "@/lib/game-registry";
import { ChessClient } from "./client";

export const metadata = { title: "Chess" };

export default function ChessPage() {
  const game = getGameBySlug("chess")!;
  return <ChessClient game={game} />;
}
