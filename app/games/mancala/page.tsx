import { getGameBySlug } from "@/lib/game-registry";
import { MancalaClient } from "./client";

export const metadata = { title: "Mancala" };

export default function MancalaPage() {
  const game = getGameBySlug("mancala")!;
  return <MancalaClient game={game} />;
}
