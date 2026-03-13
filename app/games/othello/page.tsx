import { getGameBySlug } from "@/lib/game-registry";
import { OthelloClient } from "./client";

export const metadata = { title: "Othello" };

export default function OthelloPage() {
  const game = getGameBySlug("othello")!;
  return <OthelloClient game={game} />;
}
